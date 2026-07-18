import React, { useState, useEffect } from 'react';
import { Download, MonitorSmartphone, Share, PlusSquare, ArrowLeft, ArrowUp } from 'lucide-react';

export default function InstallPWA({ children }) {
    const [isStandalone, setIsStandalone] = useState(
        window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    );
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isChrome, setIsChrome] = useState(false);
    const [forceWeb, setForceWeb] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));
        setIsChrome(/chrome|crios/.test(userAgent) && !/edge|edg|opr/.test(userAgent));

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handleChange = (e) => {
            setIsStandalone(e.matches);
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else if (isIOS) {
            // For iOS, prompt is not supported, we just show instructions
            alert('لتثبيت التطبيق على الآيفون، اضغط على زر المشاركة (Share) بالأسفل ثم اختر "الإضافة للصفحة الرئيسية" (Add to Home Screen)');
        } else {
            // Fallback instruction
            alert('الرجاء استخدام متصفح يدعم تثبيت التطبيقات أو الضغط على "إضافة للشاشة الرئيسية" من قائمة المتصفح.');
        }
    };

    // If already installed or user forced web version, render the app
    if (isStandalone || forceWeb) {
        return children;
    }

    return (
        <div className="min-h-[100dvh] bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-slate-100" dir="rtl">
            
            {/* App Icon / Logo Area */}
            <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20 animate-bounce-slow">
                <MonitorSmartphone className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-black mb-4">المحاسب الذكي</h1>
            <p className="text-slate-400 mb-10 text-lg max-w-sm leading-relaxed">
                للحصول على أفضل تجربة وأداء سريع كالتطبيقات الأصلية، يرجى تثبيت التطبيق على جهازك.
            </p>

            <div className="w-full max-w-sm space-y-4">
                <button 
                    onClick={handleInstall}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <Download className="w-6 h-6" />
                    <span>تثبيت التطبيق الآن</span>
                </button>

                <button 
                    onClick={() => setForceWeb(true)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    المتابعة من المتصفح
                </button>
            </div>

            {/* iOS Instructions */}
            {isIOS && (
                <div className="mt-12 bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 max-w-sm w-full backdrop-blur-sm">
                    <h3 className="font-bold mb-4 text-emerald-400 flex items-center justify-center gap-2">
                        <Apple className="w-5 h-5" />
                        طريقة التثبيت لأجهزة آبل
                    </h3>
                    <ol className="text-right text-slate-300 space-y-3 text-sm">
                        <li className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 font-bold">1</span>
                            <span>اضغط على زر المشاركة <Share className="inline w-4 h-4 mx-1" /> أسفل الشاشة</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 font-bold">2</span>
                            <span>اختر <PlusSquare className="inline w-4 h-4 mx-1 text-slate-400" /> الإضافة للشاشة الرئيسية</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 font-bold">3</span>
                            <span>اضغط على <strong>إضافة (Add)</strong> أعلى الشاشة</span>
                        </li>
                    </ol>
                </div>
            )}
            
        </div>
    );
}
