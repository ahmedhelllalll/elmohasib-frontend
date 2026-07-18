import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Header = () => {
    const { user } = useContext(AuthContext);

    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100/40 pt-[env(safe-area-inset-top)] shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 sm:px-8">
                {/* Mobile Title (hidden on md+) */}
                <div className="md:hidden flex items-center">
                    <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                        المُحاسِب <span className="text-emerald-500 font-black text-2xl leading-none">.</span>
                    </h1>
                </div>

                {/* Desktop Search (hidden on mobile) */}
                <div className="hidden md:flex items-center flex-1 max-w-md">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 start-0 flex items-center pe-3 ps-4 pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input 
                            type="text" 
                            className="bg-slate-50/50 border border-slate-200/60 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block w-full ps-11 p-2.5 transition-all placeholder-slate-400 focus:bg-white" 
                            placeholder="ابحث عن منتج، فاتورة، أو عميل..." 
                        />
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-3 md:gap-5 ms-auto">
                    <button className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-emerald-50 active:scale-95">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
                    </button>
                    
                    <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                    
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-800 leading-none group-hover:text-emerald-600 transition-colors">{user?.business?.name || 'النشاط التجاري'}</span>
                            <span className="text-xs font-medium text-slate-500 mt-1">{user?.name || 'مدير النظام'}</span>
                        </div>
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200/50 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                            {user?.name?.charAt(0) || 'م'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
