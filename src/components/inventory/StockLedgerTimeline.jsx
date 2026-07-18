import React, { useEffect, useState, useContext } from 'react';
import { InventoryContext } from '../../context/InventoryContext';
import { Loader2, ArrowUpRight, ArrowDownRight, RefreshCcw, ShoppingCart, Info } from 'lucide-react';
import gsap from 'gsap';

const typeConfig = {
    'in_initial': { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', label: 'رصيد افتتاحي', isPositive: true },
    'in_purchase': { icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'شراء / توريد', isPositive: true },
    'in_return': { icon: RefreshCcw, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'مرتجع مبيعات', isPositive: true },
    'in_adjustment': { icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'تعديل بالزيادة', isPositive: true },
    'out_sale': { icon: ShoppingCart, color: 'text-rose-600', bg: 'bg-rose-50', label: 'مبيعات', isPositive: false },
    'out_adjustment': { icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-50', label: 'تعديل بالنقصان', isPositive: false },
};

const StockLedgerTimeline = ({ productId }) => {
    const { fetchStockMovements } = useContext(InventoryContext);
    const [movements, setMovements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchStockMovements(productId);
                if (isMounted) setMovements(data);
            } catch (error) {
                console.error("Failed to load stock movements", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        
        loadData();
        return () => { isMounted = false; };
    }, [productId]);

    useEffect(() => {
        if (!isLoading && movements.length > 0) {
            gsap.set('.timeline-item', { willChange: 'transform, opacity' });
            gsap.fromTo('.timeline-item', 
                { opacity: 0, x: -15 }, 
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: "power2.out", force3D: true, clearProps: "all" }
            );
        }
    }, [isLoading, movements]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (movements.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <p className="text-slate-500 font-medium">لا توجد حركات مخزون مسجلة لهذا المنتج بعد.</p>
            </div>
        );
    }

    return (
        <div className="relative border-r-2 border-slate-100 pr-6 space-y-8 mt-4">
            {movements.map((movement) => {
                const config = typeConfig[movement.type] || typeConfig['in_adjustment'];
                const Icon = config.icon;
                
                return (
                    <div key={movement.id} className="timeline-item relative">
                        <div className={`absolute -right-[35px] w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${config.bg} ${config.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                        </div>
                        
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{config.label}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {new Date(movement.created_at).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                                <div className={`font-extrabold text-base ${config.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {config.isPositive ? '+' : ''}{movement.quantity_change}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 text-xs font-medium">
                                <span className="text-slate-500">
                                    المستخدم: <span className="text-slate-800">{movement.user?.name || 'النظام'}</span>
                                </span>
                                <span className="text-slate-500">
                                    الرصيد بعد الحركة: <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded">{movement.balance_after}</span>
                                </span>
                            </div>
                            
                            {movement.reference && (
                                <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                                    <span className="font-bold">مرجع:</span> {movement.reference}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StockLedgerTimeline;
