import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, FileText, Menu } from 'lucide-react';

const MobileBottomNav = ({ onMenuClick }) => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
        { path: '/dashboard/pos', icon: ShoppingCart, label: 'مبيعات' },
        { path: '/dashboard/purchases', icon: ShoppingCart, label: 'مشتريات' },
        { path: '/dashboard/inventory', icon: Package, label: 'المخزون' },
        { path: '#', icon: Menu, label: 'المزيد', isMenu: true },
    ];

    // Hide bottom nav in specific full-screen flows
    const hideOnPaths = ['/dashboard/purchases/new', '/dashboard/pos'];
    if (hideOnPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom,0px)]">
            <div className="flex items-center justify-around px-1 py-1.5">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                    if (item.isMenu) {
                        return (
                            <button
                                key="menu"
                                onClick={onMenuClick}
                                className={`flex flex-col items-center justify-center flex-1 py-1.5 relative transition-colors duration-300 text-slate-400 hover:text-slate-600`}
                            >
                                <div className="flex flex-col items-center justify-center w-14 py-1.5 rounded-xl transition-all duration-300">
                                    <item.icon className="w-5 h-5 mb-1 scale-100" strokeWidth={2} />
                                    <span className="text-[10px] font-bold tracking-tight opacity-80">
                                        {item.label}
                                    </span>
                                </div>
                            </button>
                        );
                    }
                    
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 py-1.5 relative transition-colors duration-300 ${
                                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {/* Top Active Line */}
                            {isActive && (
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-emerald-500 rounded-b-full"></div>
                            )}
                            
                            {/* Icon & Label Container */}
                            <div className={`flex flex-col items-center justify-center w-14 py-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-50/80' : ''}`}>
                                <item.icon className={`w-5 h-5 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[10px] font-bold tracking-tight transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                    {item.label}
                                </span>
                            </div>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
