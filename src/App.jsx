import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { POSProvider } from './context/POSContext';
import { CustomerProvider } from './context/CustomerContext';
import { InvoicesProvider } from './context/InvoicesContext';
import { SettingsProvider } from './context/SettingsContext';
import { SupplierProvider } from './context/SupplierContext';
import { PurchaseProvider } from './context/PurchaseContext';
import ProtectedRoute from './components/ProtectedRoute';
import SyncEngine from './components/SyncEngine';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Onboarding from './pages/Onboarding';
import InstallPWA from './components/InstallPWA';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Inventory from './pages/dashboard/Inventory';
import Customers from './pages/dashboard/Customers';
import Suppliers from './pages/dashboard/Suppliers';
import Invoices from './pages/dashboard/Invoices';
import Purchases from './pages/dashboard/Purchases';
import NewPurchase from './pages/dashboard/NewPurchase';
import Settings from './pages/dashboard/Settings';
import POS from './pages/dashboard/POS';
import Lenis from 'lenis';

import { Toaster } from 'sonner';

const InitialRedirect = () => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    return hasSeenOnboarding ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />;
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <InstallPWA>
      <AuthProvider>
        <SettingsProvider>
        <InventoryProvider>
          <CustomerProvider>
            <SupplierProvider>
              <PurchaseProvider>
                <InvoicesProvider>
                  <POSProvider>
                    <Router>
            <Toaster position="top-center" richColors dir="rtl" />
            <Routes>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="pos" element={<POS />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="purchases" element={<Purchases />} />
                    <Route path="purchases/new" element={<NewPurchase />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
              
              <Route path="/" element={<InitialRedirect />} />
            </Routes>
              </Router>
                </POSProvider>
              </InvoicesProvider>
            </PurchaseProvider>
          </SupplierProvider>
          </CustomerProvider>
        </InventoryProvider>
        </SettingsProvider>
      </AuthProvider>
    </InstallPWA>
  );
}

export default App;
