import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { InventoryContext } from './InventoryContext';
import { InvoicesContext } from './InvoicesContext';
import db from '../db';

export const POSContext = createContext();

export const POSProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const { addInvoiceToState } = useContext(InvoicesContext);
    const { refreshData } = useContext(InventoryContext);
    
    const [cart, setCart] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(0.15); // 15% default tax for example
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    // Fetch customers on load (if needed)
    useEffect(() => {
        const fetchCustomers = async () => {
            if (!token) return;
            try {
                // We will create this endpoint later
                const response = await axios.get('/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error("Failed to fetch customers", error);
            }
        };
        fetchCustomers();
    }, [token]);

    // Cart Operations
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product_id === product.id);
            if (existingItem) {
                // Check stock limit
                if (existingItem.quantity + 1 > product.initial_quantity) {
                    toast.error('الكمية المطلوبة غير متوفرة في المخزون!');
                    return prevCart;
                }
                return prevCart.map(item => 
                    item.product_id === product.id 
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
                        : item
                );
            } else {
                if (product.initial_quantity < 1) {
                    toast.error('هذا المنتج نفذ من المخزون!');
                    return prevCart;
                }
                return [...prevCart, {
                    product_id: product.id,
                    product_name: product.name,
                    unit_price: product.retail_price,
                    quantity: 1,
                    subtotal: parseFloat(product.retail_price)
                }];
            }
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart(prevCart => prevCart.map(item => 
            item.product_id === productId 
                ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.unit_price }
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        setSelectedCustomer(null);
        setDiscount(0);
    };

    // Derived State
    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const taxAmount = (subtotal - discount) * taxRate;
    const total = (subtotal - discount) + taxAmount;

    // Checkout
    const checkout = async (discount = 0, paymentMethod = 'cash', customerId = null) => {
        if (cart.length === 0) {
            toast.error("السلة فارغة");
            return;
        }

        setIsCheckoutLoading(true);
        const payload = {
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            })),
            discount_amount: discount,
            payment_method: paymentMethod,
            customer_id: customerId
        };

        try {
            if (!navigator.onLine) {
                // Save to outbox
                await db.outbox.add({
                    type: 'checkout',
                    payload,
                    created_at: new Date().toISOString(),
                    status: 'pending'
                });
                toast.success("أنت غير متصل بالإنترنت. تم حفظ الفاتورة محلياً وستتم مزامنتها لاحقاً.");
                clearCart();
                return true;
            }

            const response = await axios.post('/checkout', payload);
            toast.success("تمت عملية البيع بنجاح");
            clearCart();
            
            // Add invoice to InvoicesContext state manually to avoid refetching
            if (response.data.invoice) {
                addInvoiceToState(response.data.invoice);
            }

            // Refresh inventory products after stock deduction
            if (refreshData) {
                refreshData();
            }

            return response.data.invoice; // return for receipt printing immediately
        } catch (error) {
            console.error("Checkout error", error);
            toast.error(error.response?.data?.message || "حدث خطأ أثناء إتمام العملية");
            return false;
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    return (
        <POSContext.Provider value={{
            cart, addToCart, updateQuantity, removeFromCart, clearCart,
            customers, selectedCustomer, setSelectedCustomer,
            discount, setDiscount, taxRate, setTaxRate,
            subtotal, taxAmount, total,
            checkout, isCheckoutLoading
        }}>
            {children}
        </POSContext.Provider>
    );
};
