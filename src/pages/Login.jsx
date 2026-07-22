import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 30, scale: 0.98 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", clearProps: "all" }
        );
    }, []);

    const validateEmail = (val) => {
        if (!val) {
            setEmailError('');
            return false;
        }
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!isValid) {
            setEmailError('صيغة البريد الإلكتروني غير صحيحة');
        } else {
            setEmailError('');
        }
        return isValid;
    };

    const handleEmailChange = (e) => {
        const val = e.target.value;
        setEmail(val);
        validateEmail(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!email || !password) {
            setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
            return;
        }

        if (emailError) return;

        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('البيانات غير صحيحة أو حدث خطأ.');
        } finally {
            setIsLoading(false);
        }
    };

    const isEmailValid = email && !emailError;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 relative overflow-hidden">
            {/* Minimal Luxury Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div ref={containerRef} className="max-w-md w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            المُحاسِب <span className="text-emerald-500 font-black text-4xl">.</span>
                        </h2>
                        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
                            مرحباً بك مجدداً. سجل دخولك لإدارة أعمالك بذكاء.
                        </p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        className={`appearance-none rounded-2xl block w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border ${emailError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : isEmailValid ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 transition-all sm:text-base disabled:opacity-50 text-left`}
                                        placeholder="name@company.com"
                                        dir="ltr"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                    {isEmailValid && (
                                        <div className="absolute right-4 flex items-center justify-center pointer-events-none">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        </div>
                                    )}
                                    {emailError && (
                                        <div className="absolute right-4 flex items-center justify-center pointer-events-none">
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        </div>
                                    )}
                                </div>
                                {emailError && <p className="mt-2 text-xs font-bold text-red-500">{emailError}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isLoading}
                                        className="appearance-none rounded-2xl block w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-base disabled:opacity-50 text-left"
                                        placeholder="••••••••"
                                        dir="ltr"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <Link to="/forgot-password" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                                نسيت كلمة المرور؟
                            </Link>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 text-red-600 text-sm font-bold bg-red-50 p-4 rounded-2xl border border-red-100">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || emailError}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent text-base font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-70 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <LogIn className="w-5 h-5 transform rotate-180" />
                                )}
                                <span>{isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}</span>
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="text-center mt-8">
                    <p className="text-sm font-medium text-slate-500">
                        ليس لديك حساب؟{' '}
                        <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                            أنشئ حساباً جديداً
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
