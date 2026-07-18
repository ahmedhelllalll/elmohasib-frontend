import React, { useContext, useState, useRef, useEffect } from 'react';
import { PurchaseContext } from '../../context/PurchaseContext';
import { SettingsContext } from '../../context/SettingsContext';
import PageLoader from '../../components/ui/PageLoader';
import { Search, ShoppingCart, Plus, Calendar, Clock, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Purchases = () => {
    const { purchases, isLoading } = useContext(PurchaseContext);
    const { settings } = useContext(SettingsContext);
    
    const [searchTerm, setSearchTerm] = useState('');

    const listRef = useRef(null);

    const filteredPurchases = purchases.filter(pur => 
        pur.purchase_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (pur.supplier?.name && pur.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        if (!isLoading && purchases.length > 0 && listRef.current) {
            gsap.fromTo(listRef.current.children, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [isLoading, purchases.length]);

    const getPaymentStatusBadge = (status) => {
        switch(status) {
            case 'paid': return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold">مدفوعة</span>;
            case 'partial': return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold">مدفوعة جزئياً</span>;
            default: return <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg text-xs font-bold">آجلة (غير مدفوعة)</span>;
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <ShoppingCart className="w-7 h-7 text-emerald-500" />
                        سجل المشتريات
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">تتبع فواتير المشتريات والمدفوعات والموردين.</p>
                </div>
                <Link 
                    to="/dashboard/purchases/new"
                    className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm shadow-emerald-200 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    فاتورة مشتريات جديدة
                </Link>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="ابحث برقم الفاتورة أو اسم المورد..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pr-11 pl-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            {!isLoading && filteredPurchases.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 border-dashed p-8 text-center min-h-[400px]">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">لا توجد مشتريات</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-6 max-w-sm">
                        لم يتم العثور على أي فواتير. قم بإنشاء فاتورة مشتريات جديدة لكي تظهر هنا.
                    </p>
                </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/60 relative">
                {isLoading ? (
                    <PageLoader message="جاري تحميل المشتريات..." />
                ) : filteredPurchases.length > 0 && (
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm text-right text-slate-500 hidden md:table">
                            <thead className="text-xs text-slate-700 bg-slate-50/50 uppercase border-b border-slate-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 rounded-ts-2xl">رقم الفاتورة</th>
                                    <th className="px-6 py-4">التاريخ</th>
                                    <th className="px-6 py-4">المورد</th>
                                    <th className="px-6 py-4">الإجمالي</th>
                                    <th className="px-6 py-4">المدفوع</th>
                                    <th className="px-6 py-4">المتبقي</th>
                                    <th className="px-6 py-4 rounded-te-2xl">الحالة</th>
                                </tr>
                            </thead>
                            <tbody ref={listRef} className="divide-y divide-slate-100">
                                {filteredPurchases.map((pur) => (
                                    <tr key={pur.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            {pur.purchase_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {pur.purchase_date}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                <Truck className="w-4 h-4 text-emerald-500" />
                                                {pur.supplier?.name || 'مورد محذوف'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800 text-base">
                                            {parseFloat(pur.total).toLocaleString('en-US')} <span className="text-xs text-slate-500 font-normal">{settings?.currency || 'ر.س'}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-emerald-600 text-base">
                                            {parseFloat(pur.paid_amount).toLocaleString('en-US')}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-rose-600 text-base">
                                            {parseFloat(pur.remaining_balance).toLocaleString('en-US')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getPaymentStatusBadge(pur.payment_status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3 pb-20">
                {!isLoading && filteredPurchases.map((pur) => (
                    <div key={pur.id} className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{pur.purchase_number}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <Truck className="w-3 h-3" />
                                        {pur.supplier?.name || 'مورد محذوف'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-left">
                                {getPaymentStatusBadge(pur.payment_status)}
                                <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {pur.purchase_date}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-50 text-center">
                            <div className="bg-slate-50 p-2 rounded-xl">
                                <span className="block text-[10px] text-slate-400 mb-0.5">الإجمالي</span>
                                <span className="font-bold text-slate-800 text-xs">{parseFloat(pur.total).toLocaleString('en-US')}</span>
                            </div>
                            <div className="bg-emerald-50 p-2 rounded-xl">
                                <span className="block text-[10px] text-emerald-600/70 mb-0.5">المدفوع</span>
                                <span className="font-bold text-emerald-600 text-xs">{parseFloat(pur.paid_amount).toLocaleString('en-US')}</span>
                            </div>
                            <div className="bg-rose-50 p-2 rounded-xl">
                                <span className="block text-[10px] text-rose-600/70 mb-0.5">المتبقي</span>
                                <span className="font-bold text-rose-600 text-xs">{parseFloat(pur.remaining_balance).toLocaleString('en-US')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Floating Action Button */}
            <Link 
                to="/dashboard/purchases/new"
                className="md:hidden fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-6 z-40 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
            >
                <Plus className="w-6 h-6" />
            </Link>
        </div>
    );
};

export default Purchases;
