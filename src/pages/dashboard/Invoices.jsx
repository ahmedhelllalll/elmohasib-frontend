import React, { useContext, useState, useRef, useEffect } from 'react';
import { InvoicesContext } from '../../context/InvoicesContext';
import ReceiptDrawer from '../../components/invoices/ReceiptDrawer';
import PageLoader from '../../components/ui/PageLoader';
import { Search, FileText, Receipt, Calendar, CreditCard, Banknote, Clock } from 'lucide-react';
import gsap from 'gsap';

const Invoices = () => {
    const { invoices, isLoading } = useContext(InvoicesContext);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    const listRef = useRef(null);

    const filteredInvoices = invoices.filter(inv => 
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (inv.customer?.name && inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        if (!isLoading && invoices.length > 0 && listRef.current) {
            gsap.fromTo(listRef.current.children, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [isLoading, invoices.length]);

    const handleViewReceipt = (invoice) => {
        setSelectedInvoice(invoice);
        setIsReceiptOpen(true);
    };

    const getPaymentMethodIcon = (method) => {
        switch(method) {
            case 'cash': return <Banknote className="w-4 h-4" />;
            case 'card': return <CreditCard className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getPaymentMethodName = (method) => {
        switch(method) {
            case 'cash': return 'نقدي';
            case 'card': return 'بطاقة ائتمان';
            default: return 'آجل';
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 md:space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <FileText className="w-7 h-7 text-emerald-500" />
                        سجل الفواتير
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">تتبع جميع مبيعاتك السابقة واطبع إيصالاتها بكل سهولة.</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-3 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="ابحث برقم الفاتورة أو اسم العميل..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pr-11 pl-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            {/* Empty State */}
            {!isLoading && filteredInvoices.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 border-dashed p-8 text-center min-h-[400px]">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Receipt className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">لا توجد فواتير</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-6 max-w-sm">
                        لم يتم العثور على أي فواتير مطابقة. قم بإنشاء مبيعات جديدة من نقطة البيع لكي تظهر هنا.
                    </p>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/60 relative">
                {isLoading ? (
                    <PageLoader message="جاري تحميل الفواتير..." />
                ) : filteredInvoices.length > 0 && (
                    <table className="w-full text-sm text-right text-slate-500 hidden md:table">
                        <thead className="text-xs text-slate-700 bg-slate-50/50 uppercase border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 rounded-ts-2xl">رقم الفاتورة</th>
                                <th className="px-6 py-4">العميل</th>
                                <th className="px-6 py-4">التاريخ</th>
                                <th className="px-6 py-4">طريقة الدفع</th>
                                <th className="px-6 py-4">الإجمالي</th>
                                <th className="px-6 py-4 rounded-te-2xl">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody ref={listRef} className="divide-y divide-slate-100">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => handleViewReceipt(invoice)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-slate-800 font-mono">{invoice.invoice_number}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {invoice.customer ? (
                                            <span className="font-bold text-slate-700">{invoice.customer.name}</span>
                                        ) : (
                                            <span className="text-slate-400 bg-slate-100 px-2 py-1 rounded-md text-xs">بدون اسم</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(invoice.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                                            {getPaymentMethodIcon(invoice.payment_method)}
                                            {getPaymentMethodName(invoice.payment_method)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-emerald-600">
                                        {invoice.total} ر.س
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleViewReceipt(invoice); }} 
                                            className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Receipt className="w-3.5 h-3.5" /> عرض
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3 pb-20">
                {!isLoading && filteredInvoices.map((invoice) => (
                    <div 
                        key={invoice.id} 
                        onClick={() => handleViewReceipt(invoice)}
                        className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100 active:bg-slate-50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-800 text-base leading-tight font-mono">{invoice.invoice_number}</h3>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(invoice.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <span className="font-black text-emerald-600 text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                                {invoice.total} ر.س
                            </span>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                                {invoice.customer ? (
                                    <span className="text-sm font-bold text-slate-700">{invoice.customer.name}</span>
                                ) : (
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">بدون اسم</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                                {getPaymentMethodIcon(invoice.payment_method)}
                                {getPaymentMethodName(invoice.payment_method)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Receipt Drawer */}
            <ReceiptDrawer 
                isOpen={isReceiptOpen} 
                onClose={() => setIsReceiptOpen(false)} 
                invoice={selectedInvoice}
            />

        </div>
    );
};

export default Invoices;
