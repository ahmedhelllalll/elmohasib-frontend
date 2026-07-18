import React, { useState, useEffect, useRef, useContext } from 'react';
import { X, Loader2, List, FileText } from 'lucide-react';
import gsap from 'gsap';
import { InventoryContext } from '../../context/InventoryContext';
import StockLedgerTimeline from './StockLedgerTimeline';
import { toast } from 'sonner';

const ProductDrawer = ({ isOpen, onClose, editingProduct = null }) => {
    const { addProduct, updateProduct, categories } = useContext(InventoryContext);
    const drawerRef = useRef(null);
    const overlayRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Tab state: 'details' or 'history'
    const [activeTab, setActiveTab] = useState('details');

    const [formData, setFormData] = useState({
        name: '', barcode: '', cost_price: '', retail_price: '',
        initial_quantity: '0', alert_quantity: '5', expiration_date: '', category_id: ''
    });

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name || '',
                barcode: editingProduct.barcode || '',
                cost_price: editingProduct.cost_price || '',
                retail_price: editingProduct.retail_price || '',
                initial_quantity: editingProduct.initial_quantity || '0',
                alert_quantity: editingProduct.alert_quantity || '5',
                expiration_date: editingProduct.expiration_date || '',
                category_id: editingProduct.category_id || ''
            });
        } else {
            setFormData({
                name: '', barcode: '', cost_price: '', retail_price: '',
                initial_quantity: '0', alert_quantity: '5', expiration_date: '', category_id: ''
            });
            setActiveTab('details'); // Always default to details for new products
        }
    }, [editingProduct, isOpen]);

    useEffect(() => {
        if (isOpen) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
            gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: "power3.out" });
        } else {
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none' });
            gsap.to(drawerRef.current, { x: '-100%', duration: 0.4, ease: "power3.in" });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                toast.success('تم تحديث المنتج بنجاح');
            } else {
                await addProduct(formData);
                toast.success('تمت إضافة المنتج بنجاح');
            }
            onClose();
        } catch (err) {
            if (err.response?.data?.errors) {
                toast.error(Object.values(err.response.data.errors)[0][0]);
            } else {
                toast.error('حدث خطأ أثناء الحفظ.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div 
                ref={overlayRef} 
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] hidden opacity-0 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div 
                ref={drawerRef} 
                className="fixed top-0 h-[100dvh] left-0 w-full sm:w-[450px] bg-white shadow-2xl z-[70] transform -translate-x-full flex flex-col border-r border-slate-100"
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                    <h2 className="text-xl font-extrabold text-slate-800">
                        {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs (Only show if editing an existing product) */}
                {editingProduct && (
                    <div className="flex px-6 border-b border-slate-100 bg-slate-50/50">
                        <button 
                            onClick={() => setActiveTab('details')}
                            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-bold text-sm transition-colors ${
                                activeTab === 'details' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            تفاصيل المنتج
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 py-4 px-4 border-b-2 font-bold text-sm transition-colors ${
                                activeTab === 'history' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <List className="w-4 h-4" />
                            سجل الحركات
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                    {activeTab === 'details' ? (
                        <form id="productForm" onSubmit={handleSubmit} className="space-y-5">
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">اسم المنتج</label>
                                <input name="name" type="text" required value={formData.name} onChange={handleChange} disabled={isLoading} className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">القسم / التصنيف</label>
                                <select name="category_id" value={formData.category_id} onChange={handleChange} disabled={isLoading} className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50">
                                    <option value="">بدون تصنيف</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الباركود (اختياري)</label>
                                <input name="barcode" type="text" value={formData.barcode} onChange={handleChange} disabled={isLoading} className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" dir="ltr" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">سعر التكلفة</label>
                                    <input name="cost_price" type="number" step="0.01" required value={formData.cost_price} onChange={handleChange} disabled={isLoading} className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" dir="ltr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">سعر البيع</label>
                                    <input name="retail_price" type="number" step="0.01" required value={formData.retail_price} onChange={handleChange} disabled={isLoading} className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" dir="ltr" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{editingProduct ? 'الكمية المتوفرة حالياً' : 'الكمية الافتتاحية'}</label>
                                    <input name="initial_quantity" type="number" required value={formData.initial_quantity} onChange={handleChange} disabled={isLoading} className={`appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50`} dir="ltr" />
                                    {editingProduct && <p className="text-[10px] text-emerald-600 mt-1">تعديل هذه القيمة سينشئ حركة مخزون تلقائياً</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">تنبيه النقصان</label>
                                    <input name="alert_quantity" type="number" required value={formData.alert_quantity} onChange={handleChange} disabled={isLoading} className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" dir="ltr" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ الصلاحية (اختياري)</label>
                                <input name="expiration_date" type="date" value={formData.expiration_date} onChange={handleChange} disabled={isLoading} className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" dir="ltr" />
                            </div>

                        </form>
                    ) : (
                        <StockLedgerTimeline productId={editingProduct.id} />
                    )}
                </div>

                {activeTab === 'details' && (
                    <div className="p-6 border-t border-slate-100 bg-white pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                        <button 
                            type="submit" 
                            form="productForm" 
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                            {isLoading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDrawer;
