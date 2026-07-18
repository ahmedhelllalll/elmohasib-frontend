import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, ShoppingCart, Package, Truck, FileText, Users, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import gsap from 'gsap';

const MobileMenuDrawer = ({ isOpen, onClose }) => {
    const { logout, user } = useContext(AuthContext);

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
        { path: '/dashboard/pos', icon: ShoppingCart, label: 'نقطة البيع (POS)' },
        { path: '/dashboard/inventory', icon: Package, label: 'المخزون' },
        { path: '/dashboard/customers', icon: Users, label: 'العملاء' },
        { path: '/dashboard/suppliers', icon: Truck, label: 'الموردين' },
        { path: '/dashboard/invoices', icon: FileText, label: 'المبيعات' },
        { path: '/dashboard/purchases', icon: ShoppingCart, label: 'المشتريات' },
        { path: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
    ];

    React.useEffect(() => {
        if (isOpen) {
            gsap.to('.mobile-menu-overlay', { opacity: 1, duration: 0.3, display: 'block', ease: 'power2.out' });
            gsap.to('.mobile-menu-content', { y: 0, duration: 0.4, ease: 'power3.out' });
        } else {
            gsap.to('.mobile-menu-overlay', { opacity: 0, duration: 0.3, display: 'none', ease: 'power2.in' });
            gsap.to('.mobile-menu-content', { y: '100%', duration: 0.3, ease: 'power3.in' });
        }
    }, [isOpen]);

    return (
        <div className="md:hidden">
            {/* Overlay */}
            <div 
                className="mobile-menu-overlay fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] hidden opacity-0"
                onClick={onClose}
            ></div>
            
            {/* Drawer */}
            <div className="mobile-menu-content fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl z-[110] translate-y-full flex flex-col pb-[env(safe-area-inset-bottom)]">
                
                {/* Drag handle & Header */}
                <div className="flex flex-col items-center pt-3 pb-2 border-b border-slate-100">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-3"></div>
                    <div className="w-full flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200/50">
                                {user?.name?.charAt(0) || 'م'}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{user?.business?.name || 'النشاط التجاري'}</h3>
                                <p className="text-xs text-slate-500">{user?.name || 'مدير النظام'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                onClick={onClose}
                                className={({ isActive }) => 
                                    `flex flex-col items-center justify-center p-4 rounded-2xl gap-2 transition-all ${
                                        isActive 
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm' 
                                        : 'bg-slate-50 text-slate-600 border border-slate-100/50 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="text-xs font-bold text-center">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={() => { onClose(); logout(); }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileMenuDrawer;
