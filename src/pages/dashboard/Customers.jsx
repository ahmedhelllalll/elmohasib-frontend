import React, { useContext, useState, useRef, useEffect } from 'react';
import { CustomerContext } from '../../context/CustomerContext';
import CustomerDrawer from '../../components/customers/CustomerDrawer';
import PageLoader from '../../components/ui/PageLoader';
import { Plus, Search, Edit2, Trash2, Users, Phone, Mail, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { toast } from 'sonner';

const Customers = () => {
    const { customers, isLoading, addCustomer, updateCustomer, deleteCustomer } = useContext(CustomerContext);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const listRef = useRef(null);

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.phone && c.phone.includes(searchTerm)) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        if (!isLoading && customers.length > 0 && listRef.current) {
            gsap.fromTo(listRef.current.children, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [isLoading, customers.length]);

    const handleAdd = () => {
        setEditingCustomer(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setIsDrawerOpen(true);
    };

    const handleSave = async (formData) => {
        setIsSaving(true);
        let success = false;
        
        if (editingCustomer) {
            success = await updateCustomer(editingCustomer.id, formData);
        } else {
            success = await addCustomer(formData);
        }
        
        setIsSaving(false);
        if (success) {
            setIsDrawerOpen(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
            await deleteCustomer(id);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 md:space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <Users className="w-7 h-7 text-emerald-500" />
                        إدارة العملاء
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">قم بإدارة عملائك، وتتبع بياناتهم لتسهيل عمليات البيع.</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="hidden md:flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm shadow-emerald-200 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    إضافة عميل
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-3 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="ابحث باسم العميل، الهاتف، أو البريد الإلكتروني..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pr-11 pl-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            {/* Empty State */}
            {!isLoading && filteredCustomers.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 border-dashed p-8 text-center min-h-[400px]">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">لا يوجد عملاء</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-6 max-w-sm">
                        لم يتم العثور على أي عملاء. يمكنك إضافة عميل جديد للبدء في تتبع عمليات البيع الخاصة بهم.
                    </p>
                    <button 
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة عميل جديد
                    </button>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/60 relative">
                {isLoading ? (
                    <PageLoader message="جاري تحميل العملاء..." />
                ) : filteredCustomers.length > 0 && (
                    <table className="w-full text-sm text-right text-slate-500 hidden md:table">
                        <thead className="text-xs text-slate-700 bg-slate-50/50 uppercase border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 rounded-ts-2xl">اسم العميل</th>
                                <th className="px-6 py-4">معلومات الاتصال</th>
                                <th className="px-6 py-4">العنوان</th>
                                <th className="px-6 py-4 rounded-te-2xl">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody ref={listRef} className="divide-y divide-slate-100">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div className="font-bold text-slate-800">{customer.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {customer.phone && (
                                                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium" dir="ltr">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {customer.phone}
                                                </div>
                                            )}
                                            {customer.email && (
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs" dir="ltr">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {customer.email}
                                                </div>
                                            )}
                                            {!customer.phone && !customer.email && (
                                                <span className="text-slate-400 text-xs">لا يوجد</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {customer.address ? (
                                            <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[200px]">
                                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{customer.address}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">لا يوجد</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(customer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(customer.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="حذف">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3 pb-20">
                {!isLoading && filteredCustomers.map((customer) => (
                    <div key={customer.id} className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base leading-tight">{customer.name}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-50">
                            {customer.phone && (
                                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium" dir="ltr">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {customer.phone}
                                </div>
                            )}
                            {customer.email && (
                                <div className="flex items-center gap-2 text-slate-500 text-sm" dir="ltr">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    {customer.email}
                                </div>
                            )}
                            {customer.address && (
                                <div className="flex items-start gap-2 text-slate-600 text-sm">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <span>{customer.address}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-50 gap-2">
                            <button onClick={() => handleEdit(customer)} className="p-2 text-blue-600 bg-blue-50 rounded-lg flex-1 flex justify-center items-center gap-2 font-bold text-sm">
                                <Edit2 className="w-3.5 h-3.5" /> تعديل
                            </button>
                            <button onClick={() => handleDelete(customer.id)} className="p-2 text-rose-600 bg-rose-50 rounded-lg flex-1 flex justify-center items-center gap-2 font-bold text-sm">
                                <Trash2 className="w-3.5 h-3.5" /> حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Floating Action Button */}
            <button 
                onClick={handleAdd}
                className="md:hidden fixed bottom-20 left-6 z-40 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Customer Drawer */}
            <CustomerDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                editingCustomer={editingCustomer}
                onSave={handleSave}
                isLoading={isSaving}
            />

        </div>
    );
};

export default Customers;
