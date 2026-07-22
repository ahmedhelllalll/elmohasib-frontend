import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import db from '../db';

export const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            fetchPurchases();
        };
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchPurchases = async () => {
        setIsLoading(true);
        try {
            if (!navigator.onLine) throw new Error("Offline");
            const response = await axios.get('/purchases');
            setPurchases(response.data);
            
            // Cache to IndexedDB
            await db.purchases.clear();
            await db.purchases.bulkAdd(response.data);
        } catch (error) {
            console.log("Fetching purchases from local database due to network error.");
            try {
                const localPurchases = await db.purchases.toArray();
                setPurchases(localPurchases);
            } catch (dbError) {
                console.error("Local DB Error", dbError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPurchases();
        }
    }, [token, isOffline]);

    const submitPurchase = async (purchaseData) => {
        if (isOffline) {
            const localPurchase = {
                ...purchaseData,
                sync_status: 'pending_create'
            };
            
            await db.outbox.add({
                type: 'create_purchase',
                payload: localPurchase,
                created_at: new Date().toISOString(),
                status: 'pending'
            });
            toast.success("تم الحفظ محلياً. ستتم المزامنة عند عودة الاتصال.");
            return true;
        }

        try {
            const res = await axios.post('/purchases', purchaseData);
            setPurchases([res.data.purchase, ...purchases]);
            toast.success("تم تسجيل المشتريات بنجاح");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "حدث خطأ أثناء تسجيل المشتريات");
            throw error;
        }
    };

    return (
        <PurchaseContext.Provider value={{
            purchases,
            isLoading,
            isOffline,
            submitPurchase,
            refreshPurchases: fetchPurchases
        }}>
            {children}
        </PurchaseContext.Provider>
    );
};
