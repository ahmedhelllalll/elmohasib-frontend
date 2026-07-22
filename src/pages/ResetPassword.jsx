import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Lock, CheckCircle2, AlertCircle, Mail, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
    const query = useQuery();
    const token = query.get('token');
    const emailFromUrl = query.get('email');

    const [email, setEmail] = useState(emailFromUrl || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [message, setMessage] = useState('');
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { resetPassword } = useContext(AuthContext);
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 30, scale: 0.98 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", clearProps: "all" }
        );
    }, []);

    const calculatePasswordStrength = (pass) => {
        let score = 0;
        if (!pass) return score;
        if (pass.length > 8) score += 1;
        if (pass.length >= 12) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return Math.min(score, 4);
    };

    const strength = calculatePasswordStrength(password);
    const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-orange-400', 'bg-emerald-400', 'bg-emerald-600'];
    const strengthLabels = ['', 'ضعيفة', 'مقبولة', 'قوية', 'قوية جداً'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'password') setPassword(value);
        if (name === 'password_confirmation') setPasswordConfirmation(value);
        if (name === 'email') setEmail(value);
        
        // Real-time validation
        const newErrors = { ...errors };
        
        if (name === 'password_confirmation' || name === 'password') {
            const pass = name === 'password' ? value : password;
            const confirm = name === 'password_confirmation' ? value : passwordConfirmation;
            
            if (confirm && pass !== confirm) {
                newErrors.password_confirmation = 'كلمة المرور غير متطابقة';
            } else {
                delete newErrors.password_confirmation;
            }
        }
        
        setErrors(newErrors);
    };

    const validateForm = () => {
        if (password.length < 8) {
            setServerError('كلمة المرور يجب أن تتكون من 8 أحرف على الأقل.');
            return false;
        }
        if (password !== passwordConfirmation) {
            setServerError('كلمة المرور وتأكيد كلمة المرور غير متطابقين.');
            return false;
        }
        if (Object.keys(errors).length > 0) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        setMessage('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await resetPassword(token, email, password, passwordConfirmation);
            setMessage('تم إعادة تعيين كلمة المرور بنجاح.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setServerError(err.response?.data?.email || 'حدث خطأ. قد يكون الرابط منتهي الصلاحية.');
        } finally {
            setIsLoading(false);
        }
    };

    const isConfirmValid = passwordConfirmation && !errors.password_confirmation && passwordConfirmation === password;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 relative overflow-hidden">
            {/* Minimal Luxury Background Elements */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div ref={containerRef} className="max-w-md w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                    
                    {!message ? (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Lock className="w-8 h-8 text-slate-800" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    كلمة مرور جديدة <span className="text-emerald-500 font-black text-4xl">.</span>
                                </h2>
                                <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
                                    قم بتعيين كلمة مرور قوية وجديدة لتأمين حسابك.
                                </p>
                            </div>

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
                                            readOnly={!!emailFromUrl}
                                            disabled={isLoading || !!emailFromUrl}
                                            className="appearance-none rounded-2xl block w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-base disabled:opacity-70 text-left"
                                            dir="ltr"
                                            value={email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور الجديدة</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            disabled={isLoading}
                                            className="appearance-none rounded-2xl block w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-base disabled:opacity-50 text-left"
                                            placeholder="••••••••"
                                            dir="ltr"
                                            value={password}
                                            onChange={handleChange}
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
                                    {/* Password Strength Meter */}
                                    {password && (
                                        <div className="mt-3">
                                            <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
                                                {[1, 2, 3, 4].map(level => (
                                                    <div 
                                                        key={level} 
                                                        className={`flex-1 transition-all duration-300 ${strength >= level ? strengthColors[strength] : 'bg-slate-200'}`}
                                                    ></div>
                                                ))}
                                            </div>
                                            <p className={`text-xs font-bold mt-1.5 text-right ${strength >= 3 ? 'text-emerald-600' : strength === 2 ? 'text-orange-500' : 'text-red-500'}`}>
                                                {strengthLabels[strength]}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">تأكيد كلمة المرور</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                                            <CheckCircle2 className={`h-5 w-5 ${isConfirmValid ? 'text-emerald-500' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            name="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            disabled={isLoading}
                                            className={`appearance-none rounded-2xl block w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border ${errors.password_confirmation ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : isConfirmValid ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 transition-all sm:text-base disabled:opacity-50 text-left`}
                                            placeholder="••••••••"
                                            dir="ltr"
                                            value={passwordConfirmation}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                            tabIndex="-1"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && <p className="mt-2 text-xs font-bold text-red-500 text-right">{errors.password_confirmation}</p>}
                                </div>

                                {serverError && (
                                    <div className="flex items-center gap-3 text-red-600 text-sm font-bold bg-red-50 p-4 rounded-2xl border border-red-100">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{serverError}</span>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading || Object.keys(errors).length > 0}
                                        className="group relative w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent text-base font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-70 active:scale-[0.98]"
                                    >
                                        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                        <span>{isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}</span>
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">تم التحديث بنجاح</h3>
                            <p className="text-slate-500 text-center font-medium leading-relaxed mb-8">
                                {message} جاري توجيهك لصفحة تسجيل الدخول...
                            </p>
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
