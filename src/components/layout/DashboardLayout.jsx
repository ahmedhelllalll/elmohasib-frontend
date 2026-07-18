import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import DesktopSidebar from './DesktopSidebar';
import MobileBottomNav from './MobileBottomNav';
import MobileMenuDrawer from './MobileMenuDrawer';
import SyncEngine from '../SyncEngine';
import { useState } from 'react';
import gsap from 'gsap';

const DashboardLayout = () => {
    const mainRef = useRef(null);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Page transition animation
    useEffect(() => {
        if (mainRef.current) {
            gsap.fromTo(mainRef.current, 
                { opacity: 0, y: 15 }, 
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "all" }
            );
        }
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-emerald-100">
            <SyncEngine />
            {/* Desktop Sidebar */}
            <DesktopSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <Header />

                {/* Main Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto overflow-x-hidden">
                    <div ref={mainRef} className="h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav onMenuClick={() => setIsMobileMenuOpen(true)} />
            
            <MobileMenuDrawer 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
            />
        </div>
    );
};

export default DashboardLayout;
