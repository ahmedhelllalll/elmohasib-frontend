import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, PackageSearch, TrendingUp, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';

const slides = [
    {
        id: 1,
        title: 'مرحباً بك في المُحاسِب',
        subtitle: 'النظام الأسهل لإدارة أعمالك التجارية ومخزونك بكل دقة واحترافية.',
        icon: Store,
    },
    {
        id: 2,
        title: 'إدارة المخزون بذكاء',
        subtitle: 'تتبع منتجاتك، راقب التواريخ، واحصل على تنبيهات النواقص فوراً.',
        icon: PackageSearch,
    },
    {
        id: 3,
        title: 'تقارير مالية دقيقة',
        subtitle: 'اتخذ قرارات أفضل بناءً على تحليلات دقيقة للمبيعات والأرباح.',
        icon: TrendingUp,
    }
];

const Onboarding = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.out" }
        );
        animateEnter();
    }, []);

    const animateEnter = () => {
        gsap.fromTo(contentRef.current.children,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
    };

    const nextSlide = () => {
        if (currentSlide === slides.length - 1) {
            finishOnboarding();
            return;
        }
        
        gsap.to(contentRef.current.children, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.inOut",
            onComplete: () => {
                setCurrentSlide(prev => prev + 1);
                animateEnter();
            }
        });
    };

    const finishOnboarding = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                navigate('/dashboard');
            }
        });
    };

    const SlideIcon = slides[currentSlide].icon;

    return (
        <div ref={containerRef} className="min-h-screen bg-white flex flex-col font-sans selection:bg-emerald-100">
            
            {/* Header / Skip */}
            <header className="p-6 flex justify-end">
                <button 
                    onClick={finishOnboarding}
                    className="text-slate-400 hover:text-slate-900 transition-colors text-sm font-medium tracking-wide"
                >
                    تخطي
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <div ref={contentRef} className="max-w-sm w-full flex flex-col items-center text-center">
                    
                    {/* Minimal Icon Wrapper */}
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center mb-10 border border-slate-100">
                        <SlideIcon className="w-10 h-10 text-slate-800" strokeWidth={1.5} />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                        {slides[currentSlide].title}
                    </h1>
                    
                    <p className="text-slate-500 text-lg leading-relaxed">
                        {slides[currentSlide].subtitle}
                    </p>

                </div>
            </main>

            {/* Footer / Controls */}
            <footer className="p-8 pb-12 flex flex-col items-center gap-8">
                
                {/* Minimal Progress Lines */}
                <div className="flex gap-2" dir="ltr">
                    {slides.map((_, index) => (
                        <div 
                            key={index} 
                            className={`h-1 rounded-full transition-all duration-500 ${currentSlide === index ? 'w-8 bg-slate-900' : 'w-4 bg-slate-200'}`}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    className="w-full max-w-sm bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2"
                >
                    {currentSlide === slides.length - 1 ? 'البدء الآن' : 'التالي'}
                </button>

            </footer>
            
        </div>
    );
};

export default Onboarding;
