import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import db from '../db';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            if (!navigator.onLine) throw new Error("Offline");
            const response = await axios.get('/customers');
            setCustomers(response.data);
            
            // Cache
            await db.customers.clear();
            await db.customers.bulkAdd(response.data);
        } catch (error) {
            console.log("Fetching customers from local database due to network error.");
            try {
                const localCustomers = await db.customers.toArray();
                setCustomers(localCustomers);
            } catch (dbError) {
                console.error("Local DB Error", dbError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Automatically fetch customers when context mounts
        if (axios.defaults.headers.common['Authorization']) {
            fetchCustomers();
        }
    }, []);

    const addCustomer = async (data) => {
        try {
            const response = await axios.post('/customers', data);
            setCustomers(prev => [...prev, response.data]);
            toast.success("تم إضافة العميل بنجاح");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "حدث خطأ أثناء الإضافة");
            return false;
        }
    };

    const updateCustomer = async (id, data) => {
        try {
            const response = await axios.put(`/customers/${id}`, data);
            setCustomers(prev => prev.map(c => c.id === id ? response.data : c));
            toast.success("تم تحديث بيانات العميل");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "حدث خطأ أثناء التحديث");
            return false;
        }
    };

    const deleteCustomer = async (id) => {
        try {
            await axios.delete(`/customers/${id}`);
            setCustomers(prev => prev.filter(c => c.id !== id));
            toast.success("تم حذف العميل بنجاح");
            return true;
        } catch (error) {
            toast.error("حدث خطأ أثناء الحذف");
            return false;
        }
    };

    return (
        <CustomerContext.Provider value={{
            customers,
            isLoading,
            fetchCustomers,
            addCustomer,
            updateCustomer,
            deleteCustomer
        }}>
            {children}
        </CustomerContext.Provider>
    );
};
