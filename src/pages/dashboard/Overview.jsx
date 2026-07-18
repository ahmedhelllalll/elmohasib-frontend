import React, { useEffect, useRef, useState, useContext } from 'react';
import gsap from 'gsap';
import { Package, TrendingUp, AlertCircle, ArrowUpRight, ShoppingCart, Users, Truck, FileText, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageLoader from '../../components/ui/PageLoader';
import { SettingsContext } from '../../context/SettingsContext';

const HeroStatCard = ({ title, value, icon: Icon, trend }) => {
    return (
        <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 shadow-[0_8px_30px_rgb(16,185,129,0.2)] overflow-hidden text-white transition-transform hover:-translate-y-1 duration-300">
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-emerald-50 font-bold text-sm">{title}</h3>
                    </div>
                    <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">{value}</p>
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl text-sm font-bold shadow-sm">
                        <ArrowUpRight className="w-4 h-4" />
                        {trend} مقارنة بالأمس
                    </div>
                )}
            </div>
            
            {/* Background Decor */}
            <div className="absolute -bottom-12 -right-12 opacity-10 pointer-events-none">
                <TrendingUp className="w-56 h-56" />
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 blur-3xl rounded-full mix-blend-overlay"></div>
        </div>
    );
};

const SecondaryStatCard = ({ title, value, icon: Icon, isWarning }) => {
    return (
        <div className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 shadow-[0_2px_15px_rgb(0,0,0,0.02)] transition-all hover:-translate-y-1 duration-300 ${isWarning ? 'bg-gradient-to-b from-rose-50/80 to-white border border-rose-100/50' : 'bg-gradient-to-b from-blue-50/80 to-white border border-blue-100/50'}`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-2.5 rounded-2xl ${isWarning ? 'bg-rose-100/50 text-rose-600' : 'bg-blue-100/50 text-blue-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`w-8 h-8 rounded-full opacity-10 ${isWarning ? 'bg-rose-500' : 'bg-blue-500'} blur-xl absolute -top-2 -right-2`}></div>
            </div>
            <div>
                <p className={`text-3xl font-extrabold tracking-tight leading-none mb-1.5 ${isWarning ? 'text-rose-950' : 'text-slate-800'}`}>{value}</p>
                <h3 className={`text-xs font-bold ${isWarning ? 'text-rose-600/80' : 'text-slate-500'}`}>{title}</h3>
            </div>
        </div>
    );
};

const QuickAction = ({ to, icon: Icon, label, color }) => (
    <Link to={to} className="flex flex-col items-center gap-2 group">
        <div className={`w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center ${color} shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-white transition-all duration-300 group-hover:scale-105 group-active:scale-95 group-hover:shadow-[0_8px_20px_rgb(0,0,0,0.05)]`}>
            <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
        </div>
        <span className="text-[11px] sm:text-xs font-bold text-slate-600 text-center leading-tight tracking-tight">{label}</span>
    </Link>
);

const Overview = () => {
    const heroRef = useRef(null);
    const actionsRef = useRef(null);
    const secondaryRef = useRef(null);
    const activityRef = useRef(null);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { settings } = useContext(SettingsContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/dashboard-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        if (!isLoading && stats) {
            // Optimize animations for smooth 60fps performance
            const tl = gsap.timeline({ defaults: { ease: "power2.out", force3D: true } });
            
            if (heroRef.current) {
                tl.fromTo(heroRef.current,
                    { autoAlpha: 0, y: 20 },
                    { autoAlpha: 1, y: 0, duration: 0.5, clearProps: "all" } // clearProps prevents lingering hardware layers
                );
            }

            if (actionsRef.current && actionsRef.current.children) {
                tl.fromTo(actionsRef.current.children,
                    { autoAlpha: 0, scale: 0.95, y: 10 },
                    { autoAlpha: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "back.out(1.2)", clearProps: "all" },
                    "-=0.3"
                );
            }

            if (secondaryRef.current && secondaryRef.current.children) {
                tl.fromTo(secondaryRef.current.children,
                    { autoAlpha: 0, y: 10 },
                    { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, clearProps: "all" },
                    "-=0.2"
                );
            }

            if (activityRef.current) {
                tl.fromTo(activityRef.current,
                    { autoAlpha: 0, y: 10 },
                    { autoAlpha: 1, y: 0, duration: 0.4, clearProps: "all" },
                    "-=0.2"
                );
            }
        }
    }, [isLoading, stats]);

    if (isLoading) {
        return <PageLoader message="جاري تحميل لوحة التحكم..." />;
    }

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
                <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">تعذر تحميل الإحصائيات</h2>
                <p className="mt-2 text-sm">حدث خطأ أثناء الاتصال بالخادم. يرجى التأكد من تشغيل الخادم وتحديث الصفحة.</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm hover:bg-emerald-600 transition-colors">
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 pb-24 md:pb-8 max-w-5xl mx-auto">
            
            {/* Header Greeting */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">الرئيسية</h2>
                    <p className="text-sm text-slate-500 mt-1">مرحباً بك! إليك أداء عملك اليوم.</p>
                </div>
            </div>

            {/* Hero Revenue Card */}
            <div ref={heroRef}>
                <HeroStatCard 
                    title="إجمالي الإيرادات اليوم" 
                    value={`${stats.total_revenue} ${settings?.currency || 'ر.س'}`} 
                    icon={TrendingUp} 
                    trend={stats.revenue_trend} 
                />
            </div>

            {/* Quick Actions Grid - Colorful Squircles */}
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 px-1">الإجراءات السريعة</h3>
                <div ref={actionsRef} className="grid grid-cols-3 sm:grid-cols-6 gap-y-6 gap-x-2">
                    <QuickAction to="/dashboard/pos" icon={ShoppingCart} label="بيع جديد" color="bg-emerald-50 text-emerald-600 hover:bg-emerald-100" />
                    <QuickAction to="/dashboard/inventory" icon={Package} label="منتج جديد" color="bg-blue-50 text-blue-600 hover:bg-blue-100" />
                    <QuickAction to="/dashboard/customers" icon={Users} label="عميل جديد" color="bg-purple-50 text-purple-600 hover:bg-purple-100" />
                    <QuickAction to="/dashboard/suppliers" icon={Truck} label="مورد جديد" color="bg-amber-50 text-amber-600 hover:bg-amber-100" />
                    <QuickAction to="/dashboard/invoices" icon={FileText} label="فاتورة جديدة" color="bg-indigo-50 text-indigo-600 hover:bg-indigo-100" />
                    <QuickAction to="/dashboard/settings" icon={SettingsIcon} label="الإعدادات" color="bg-slate-50 text-slate-600 hover:bg-slate-100" />
                </div>
            </div>

            {/* Secondary Stats Grid */}
            <div ref={secondaryRef} className="grid grid-cols-2 gap-4">
                <SecondaryStatCard 
                    title="المنتجات النشطة" 
                    value={stats.total_products} 
                    icon={Package} 
                />
                <SecondaryStatCard 
                    title="تنبيهات المخزون" 
                    value={stats.low_stock_count} 
                    icon={AlertCircle} 
                    isWarning={stats.low_stock_count > 0} 
                />
            </div>

            {/* Recent Activity */}
            <div ref={activityRef} className="bg-slate-50/70 rounded-3xl p-5 sm:p-6 border border-slate-100/50">
                <div className="flex items-center justify-between mb-5 px-1">
                    <h3 className="text-base font-extrabold text-slate-700">نشاطات اليوم</h3>
                </div>
                
                <div className="space-y-3">
                    {stats.recent_activity.length > 0 ? stats.recent_activity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:shadow-sm transition-shadow group cursor-pointer border border-white hover:border-slate-100/60">
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                                    activity.type === 'sale' ? 'bg-emerald-50/50 text-emerald-500' : 
                                    activity.type === 'alert' ? 'bg-rose-50/50 text-rose-400' : 'bg-slate-50 text-slate-500'
                                }`}>
                                    {activity.type === 'sale' ? <ShoppingCart className="w-5 h-5" /> : activity.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{activity.action}</p>
                                    <p className="text-xs font-medium text-slate-400/80 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                            {activity.amount && (
                                <span className="text-sm font-semibold text-slate-500" dir="ltr">
                                    {activity.amount}
                                </span>
                            )}
                        </div>
                    )) : (
                        <div className="text-center py-8 bg-white rounded-2xl">
                            <p className="text-sm font-medium text-slate-400">لا توجد نشاطات حديثة اليوم.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;
