import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const InvoicesContext = createContext();

export const InvoicesProvider = ({ children }) => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/invoices');
            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices", error);
            toast.error("فشل في جلب الفواتير");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (axios.defaults.headers.common['Authorization']) {
            fetchInvoices();
        }
    }, []);

    // Also expose a function to add an invoice manually to the state, 
    // useful when checkout finishes so we don't have to refetch all invoices
    const addInvoiceToState = (invoice) => {
        setInvoices(prev => [invoice, ...prev]);
    };

    return (
        <InvoicesContext.Provider value={{
            invoices,
            isLoading,
            fetchInvoices,
            addInvoiceToState
        }}>
            {children}
        </InvoicesContext.Provider>
    );
};
