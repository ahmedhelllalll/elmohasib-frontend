import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Truck, FileText, Users, PieChart, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const DesktopSidebar = () => {
    const { logout } = useContext(AuthContext);

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
        { path: '/dashboard/pos', icon: ShoppingCart, label: 'نقطة البيع (POS)' },
        { path: '/dashboard/inventory', icon: Package, label: 'المخزون' },
        { path: '/dashboard/customers', icon: Users, label: 'العملاء' },
        { path: '/dashboard/suppliers', icon: Truck, label: 'الموردين' },
        { path: '/dashboard/invoices', icon: FileText, label: 'مبيعات' },
        { path: '/dashboard/purchases', icon: ShoppingCart, label: 'مشتريات' },
        { path: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-e border-slate-100/50 h-screen sticky top-0 shadow-[4px_0_24px_rgb(0,0,0,0.01)] z-50">
            <div className="flex h-16 items-center px-8 border-b border-slate-100/50">
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                    المُحاسِب <span className="text-emerald-500 font-black text-3xl leading-none">.</span>
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                                isActive 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                {item.label}
                                {isActive && (
                                    <div className="ms-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-slate-100/50">
                <button 
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
};

export default DesktopSidebar;
