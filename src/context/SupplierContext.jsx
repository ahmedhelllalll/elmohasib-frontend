import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import db from '../db';

export const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            fetchSuppliers();
        };
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            if (!navigator.onLine) throw new Error("Offline");
            const response = await axios.get('/suppliers');
            setSuppliers(response.data);
            
            // Cache to IndexedDB
            await db.suppliers.clear();
            await db.suppliers.bulkAdd(response.data);
        } catch (error) {
            console.log("Fetching suppliers from local database due to network error.");
            try {
                const localSuppliers = await db.suppliers.toArray();
                setSuppliers(localSuppliers);
                if (localSuppliers.length === 0) {
                    toast.error("لا يوجد اتصال بالإنترنت ولا توجد بيانات موردين مخزنة مؤقتاً");
                }
            } catch (dbError) {
                console.error("Local DB Error", dbError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (axios.defaults.headers.common['Authorization']) {
            fetchSuppliers();
        }
    }, [isOffline]);

    const addSupplier = async (supplierData) => {
        if (isOffline) {
            toast.error("لا يمكن إضافة موردين في وضع عدم الاتصال حالياً");
            return;
        }
        try {
            const res = await axios.post('/suppliers', supplierData);
            setSuppliers([res.data, ...suppliers]);
            toast.success("تم حفظ المورد بنجاح");
            return res.data;
        } catch (error) {
            toast.error("حدث خطأ أثناء حفظ المورد");
            return false;
        }
    };

    const updateSupplier = async (id, supplierData) => {
        if (isOffline) {
            toast.error("لا يمكن تعديل موردين في وضع عدم الاتصال حالياً");
            return;
        }
        try {
            const res = await axios.put(`/suppliers/${id}`, supplierData);
            setSuppliers(suppliers.map(s => s.id === id ? res.data : s));
            toast.success("تم تحديث المورد بنجاح");
            return res.data;
        } catch (error) {
            toast.error("حدث خطأ أثناء تحديث المورد");
            return false;
        }
    };

    const deleteSupplier = async (id) => {
        if (isOffline) {
            toast.error("لا يمكن حذف موردين في وضع عدم الاتصال حالياً");
            return;
        }
        try {
            await axios.delete(`/suppliers/${id}`);
            setSuppliers(suppliers.filter(s => s.id !== id));
            toast.success("تم حذف المورد بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء حذف المورد");
        }
    };

    return (
        <SupplierContext.Provider value={{
            suppliers,
            isLoading,
            isOffline,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            refreshSuppliers: fetchSuppliers
        }}>
            {children}
        </SupplierContext.Provider>
    );
};
