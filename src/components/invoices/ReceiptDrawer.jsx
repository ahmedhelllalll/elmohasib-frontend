import React, { useEffect, useContext } from 'react';
import { X, Printer } from 'lucide-react';
import { SettingsContext } from '../../context/SettingsContext';
import gsap from 'gsap';

const ReceiptDrawer = ({ isOpen, onClose, invoice }) => {
    const { settings } = useContext(SettingsContext);
    
    useEffect(() => {
        if (isOpen) {
            gsap.to('.receipt-overlay', { opacity: 1, duration: 0.3, ease: 'power2.out', display: 'block' });
            gsap.to('.receipt-content', { x: 0, duration: 0.4, ease: 'power3.out' });
        } else {
            gsap.to('.receipt-overlay', { opacity: 0, duration: 0.3, ease: 'power2.in', display: 'none' });
            gsap.to('.receipt-content', { x: '100%', duration: 0.3, ease: 'power3.in' });
        }
    }, [isOpen]);

    const handlePrint = () => {
        window.print();
    };

    if (!invoice) return null;

    return (
        <>
            <div 
                className="receipt-overlay fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 hidden opacity-0 print:hidden"
                onClick={onClose}
            ></div>
            
            <div className="receipt-content fixed top-0 bottom-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 translate-x-full flex flex-col print:translate-x-0 print:static print:w-full print:max-w-none print:shadow-none print:z-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 print:hidden">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">تفاصيل الفاتورة</h2>
                        <p className="text-sm text-slate-500 mt-1">{invoice.invoice_number}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handlePrint}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                            title="طباعة الفاتورة"
                        >
                            <Printer className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Printable Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50 print:bg-white print:p-0">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mx-auto max-w-sm print:max-w-none print:border-none print:shadow-none print:p-4 print:mx-0">
                        {/* Header */}
                        <div className="text-center mb-8 border-b border-dashed border-slate-200 pb-6">
                            <h2 className="text-2xl font-black text-slate-800 mb-1">{settings.business_name}</h2>
                            <p className="text-sm text-slate-500">مبيعات التجزئة</p>
                            
                            <div className="mt-4 text-xs text-slate-500 flex flex-col gap-1">
                                <p>رقم الفاتورة: <span className="font-bold text-slate-700 font-mono">{invoice.invoice_number}</span></p>
                                <p>التاريخ: {new Date(invoice.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        {invoice.customer && (
                            <div className="mb-6 bg-slate-50 p-4 rounded-xl print:bg-transparent print:p-0 print:border-b print:border-dashed print:border-slate-200 print:pb-4">
                                <p className="text-xs text-slate-500 mb-1">العميل</p>
                                <p className="font-bold text-slate-800">{invoice.customer.name}</p>
                                {invoice.customer.phone && <p className="text-xs text-slate-600 mt-0.5" dir="ltr">{invoice.customer.phone}</p>}
                            </div>
                        )}

                        {/* Items */}
                        <div className="mb-8">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500 text-xs">
                                        <th className="text-right py-2 font-medium">الصنف</th>
                                        <th className="text-center py-2 font-medium">الكمية</th>
                                        <th className="text-left py-2 font-medium">المجموع</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dashed divide-slate-100">
                                    {invoice.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-3 text-right">
                                                <p className="font-bold text-slate-800">{item.product_name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.unit_price} {settings.currency}</p>
                                            </td>
                                            <td className="py-3 text-center font-bold text-slate-700">{item.quantity}</td>
                                            <td className="py-3 text-left font-bold text-emerald-600">{item.subtotal} {settings.currency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-slate-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>المجموع الفرعي</span>
                                <span>{invoice.subtotal} {settings.currency}</span>
                            </div>
                            {parseFloat(invoice.discount_amount) > 0 && (
                                <div className="flex justify-between text-sm text-rose-500">
                                    <span>الخصم</span>
                                    <span>- {invoice.discount_amount} {settings.currency}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>ضريبة القيمة المضافة ({settings.tax_rate}%)</span>
                                <span>{invoice.tax_amount} {settings.currency}</span>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                                <span className="font-bold text-slate-800">الإجمالي</span>
                                <span className="text-xl font-black text-emerald-600">{invoice.total} {settings.currency}</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mt-8 text-center text-xs text-slate-500">
                            <p>طريقة الدفع: <span className="font-bold text-slate-700">{invoice.payment_method === 'cash' ? 'نقدي' : invoice.payment_method === 'card' ? 'بطاقة' : 'آجل'}</span></p>
                        </div>
                        
                        <div className="mt-8 text-center border-t border-dashed border-slate-200 pt-6">
                            <p className="text-sm font-bold text-slate-800 whitespace-pre-line">{settings.receipt_footer}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100 print:hidden">
                    <button 
                        onClick={handlePrint}
                        className="w-full bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold shadow-sm shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Printer className="w-5 h-5" />
                        طباعة الفاتورة
                    </button>
                </div>
            </div>
            
            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .receipt-content, .receipt-content * {
                        visibility: visible;
                    }
                    .receipt-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default ReceiptDrawer;
