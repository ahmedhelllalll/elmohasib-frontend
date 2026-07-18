import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';

const SupplierDrawer = ({ isOpen, onClose, editingSupplier, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (editingSupplier) {
                setFormData({
                    name: editingSupplier.name || '',
                    company_name: editingSupplier.company_name || '',
                    email: editingSupplier.email || '',
                    phone: editingSupplier.phone || '',
                    address: editingSupplier.address || ''
                });
            } else {
                setFormData({
                    name: '',
                    company_name: '',
                    email: '',
                    phone: '',
                    address: ''
                });
            }
            
            gsap.to('.drawer-overlay', { opacity: 1, duration: 0.3, ease: 'power2.out', display: 'block' });
            gsap.to('.drawer-content', { x: 0, duration: 0.4, ease: 'power3.out' });
        } else {
            gsap.to('.drawer-overlay', { opacity: 0, duration: 0.3, ease: 'power2.in', display: 'none' });
            gsap.to('.drawer-content', { x: '100%', duration: 0.3, ease: 'power3.in' });
        }
    }, [isOpen, editingSupplier]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name) {
            toast.error("يرجى إدخال اسم المورد");
            return;
        }
        
        if (!formData.phone) {
            toast.error("يرجى إدخال رقم هاتف المورد");
            return;
        }
        
        if (!formData.company_name) {
            toast.error("يرجى إدخال اسم الشركة");
            return;
        }

        await onSave(formData);
    };

    return (
        <>
            <div 
                className="drawer-overlay fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 hidden opacity-0"
                onClick={onClose}
            ></div>
            
            <div className="drawer-content fixed top-0 h-[100dvh] right-0 w-full max-w-md bg-white shadow-2xl z-[100] translate-x-full flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                            {editingSupplier ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {editingSupplier ? 'قم بتحديث بيانات العميل الحالي' : 'أدخل بيانات العميل الجديد لربطه بالمبيعات'}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="SupplierForm" onSubmit={handleSubmit} className="space-y-5">
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم العميل <span className="text-rose-500">*</span></label>
                            <input 
                                name="name" 
                                type="text" 
                                required
                                value={formData.name} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم الشركة <span className="text-rose-500">*</span></label>
                            <input 
                                name="company_name" 
                                type="text" 
                                required
                                value={formData.company_name} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم الهاتف <span className="text-rose-500">*</span></label>
                            <input 
                                name="phone" 
                                type="text" 
                                required
                                value={formData.phone} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" 
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">البريد الإلكتروني</label>
                            <input 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" 
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">العنوان</label>
                            <textarea 
                                name="address" 
                                rows="3"
                                value={formData.address} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 resize-none" 
                            />
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                        <button 
                            form="SupplierForm"
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-sm shadow-emerald-200 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                            {isLoading ? 'جاري الحفظ...' : 'حفظ بيانات العميل'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SupplierDrawer;
