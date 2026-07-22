import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, Mail, CheckCircle2, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import gsap from 'gsap';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { forgotPassword } = useContext(AuthContext);
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
        setMessage('');
        
        if (!email) {
            setError('الرجاء إدخال البريد الإلكتروني.');
            return;
        }

        if (emailError) return;

        setIsLoading(true);
        try {
            await forgotPassword(email);
            setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
            setEmail(''); // Clear form on success
        } catch (err) {
            setError(err.response?.data?.email || 'حدث خطأ. يرجى المحاولة لاحقاً.');
        } finally {
            setIsLoading(false);
        }
    };

    const isEmailValid = email && !emailError;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 relative overflow-hidden">
            {/* Minimal Luxury Background Elements */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[300px] bg-slate-300/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div ref={containerRef} className="max-w-md w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-slate-800" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            استعادة الوصول <span className="text-emerald-500 font-black text-4xl">.</span>
                        </h2>
                        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
                            أدخل بريدك الإلكتروني المسجل لدينا، وسنرسل لك تعليمات آمنة لإعادة تعيين كلمة المرور الخاصة بك.
                        </p>
                    </div>

                    {!message ? (
                        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        className={`appearance-none rounded-2xl block w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border ${emailError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : isEmailValid ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 transition-all sm:text-base disabled:opacity-50 text-left`}
                                        dir="ltr"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="name@company.com"
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
                                    className="group relative w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent text-base font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-70 active:scale-[0.98]"
                                >
                                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    <span>{isLoading ? 'جاري الإرسال...' : 'إرسال تعليمات الاستعادة'}</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                            <p className="text-emerald-800 text-center font-medium leading-relaxed mb-6">
                                {message}
                            </p>
                            <Link to="/login" className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                                العودة لتسجيل الدخول
                                <ArrowRight className="w-4 h-4 transform rotate-180" />
                            </Link>
                        </div>
                    )}

                    {!message && (
                        <div className="text-center mt-8">
                            <p className="text-sm font-medium text-slate-500">
                                تذكرت كلمة المرور؟{' '}
                                <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                                    العودة لتسجيل الدخول
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
