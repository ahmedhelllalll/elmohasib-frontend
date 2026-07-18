import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { AuthContext } from './AuthContext';
import db from '../db';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            fetchData();
        };
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, isOffline]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (!navigator.onLine) throw new Error("Offline");
            
            const [prodRes, catRes] = await Promise.all([
                axios.get('/products'),
                axios.get('/categories')
            ]);
            
            setProducts(prodRes.data);
            setCategories(catRes.data);
            
            // Cache to IndexedDB
            await db.products.clear();
            await db.products.bulkAdd(prodRes.data);
            await db.categories.clear();
            await db.categories.bulkAdd(catRes.data);
            
        } catch (error) {
            console.log("Fetching inventory data from local database due to network error.");
            try {
                const localProducts = await db.products.toArray();
                const localCategories = await db.categories.toArray();
                setProducts(localProducts);
                setCategories(localCategories);
                if (localProducts.length === 0) {
                    toast.error("لا يوجد اتصال بالإنترنت ولا توجد بيانات مخزنة مؤقتاً");
                } else {
                    toast.info("أنت في وضع عدم الاتصال (Offline). تم تحميل البيانات من الذاكرة المحلية.");
                }
            } catch (dbError) {
                console.error("Local DB Error", dbError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const addProduct = async (productData) => {
        if (isOffline) {
            toast.error("لا يمكن إضافة منتجات في وضع عدم الاتصال حالياً");
            return;
        }
        try {
            const res = await axios.post('/products', productData);
            setProducts([res.data, ...products]);
            toast.success("تم إضافة المنتج بنجاح");
            return res.data;
        } catch (error) {
            toast.error("حدث خطأ أثناء الإضافة");
            return false;
        }
    };

    const updateProduct = async (id, productData) => {
        if (isOffline) {
            toast.error("لا يمكن تعديل منتجات في وضع عدم الاتصال حالياً");
            return;
        }
        try {
            const res = await axios.put(`/products/${id}`, productData);
            setProducts(products.map(p => p.id === id ? res.data : p));
            toast.success("تم تحديث المنتج بنجاح");
            return res.data;
        } catch (error) {
            toast.error("حدث خطأ أثناء التحديث");
            return false;
        }
    };

    const deleteProduct = async (id) => {
        if (isOffline) {
            toast.error("لا يمكن حذف منتجات في وضع عدم الاتصال حالياً");
            return;
        }
        try {
            await axios.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            toast.success("تم حذف المنتج بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء الحذف");
        }
    };

    const addCategory = async (categoryData) => {
        if (isOffline) {
            toast.error("لا يمكن إضافة تصنيفات في وضع عدم الاتصال حالياً");
            return;
        }
        try {
            const res = await axios.post('/categories', categoryData);
            setCategories([res.data, ...categories]);
            toast.success("تم إضافة القسم بنجاح");
            return res.data;
        } catch (error) {
            toast.error("حدث خطأ أثناء الإضافة");
            return false;
        }
    };

    const fetchStockMovements = async (productId) => {
        if (isOffline) return [];
        const res = await axios.get('/stock-movements', { params: { product_id: productId } });
        return res.data;
    };

    return (
        <InventoryContext.Provider value={{
            products, categories, isLoading, isOffline,
            addProduct, updateProduct, deleteProduct, addCategory,
            fetchStockMovements,
            refreshData: fetchData
        }}>
            {children}
        </InventoryContext.Provider>
    );
};
