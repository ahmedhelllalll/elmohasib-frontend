import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Mail, Lock, CheckCircle2, AlertCircle, Building2, User, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';

const Signup = () => {
    const [formData, setFormData] = useState({
        business_name: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
        return Math.min(score, 4); // Max 4 levels (0: weak, 4: very strong)
    };

    const strength = calculatePasswordStrength(formData.password);
    const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-orange-400', 'bg-emerald-400', 'bg-emerald-600'];
    const strengthLabels = ['', 'ضعيفة', 'مقبولة', 'قوية', 'قوية جداً'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Real-time validation
        const newErrors = { ...errors };
        
        if (name === 'business_name') {
            if (!value.trim()) {
                newErrors.business_name = 'اسم النشاط التجاري مطلوب';
            } else if (value.trim().length < 3) {
                newErrors.business_name = 'يجب أن يتكون من 3 أحرف على الأقل';
            } else {
                delete newErrors.business_name;
            }
        }
        
        if (name === 'name') {
            if (!value.trim()) {
                newErrors.name = 'اسم المدير مطلوب';
            } else if (value.trim().length < 3) {
                newErrors.name = 'يجب أن يتكون من 3 أحرف على الأقل';
            } else {
                delete newErrors.name;
            }
        }
        
        if (name === 'email') {
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
            } else {
                delete newErrors.email;
            }
        }
        
        if (name === 'password_confirmation' || name === 'password') {
            const pass = name === 'password' ? value : formData.password;
            const confirm = name === 'password_confirmation' ? value : formData.password_confirmation;
            
            if (confirm && pass !== confirm) {
                newErrors.password_confirmation = 'كلمة المرور غير متطابقة';
            } else {
                delete newErrors.password_confirmation;
            }
        }
        
        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = { ...errors };
        
        if (!formData.business_name.trim()) newErrors.business_name = 'اسم النشاط التجاري مطلوب';
        if (!formData.name.trim()) newErrors.name = 'اسم المدير مطلوب';
        if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';

        if (formData.password.length < 8) {
            setServerError('كلمة المرور يجب أن تتكون من 8 أحرف على الأقل.');
            return false;
        }
        if (formData.password !== formData.password_confirmation) {
            setServerError('كلمة المرور وتأكيد كلمة المرور غير متطابقين.');
            return false;
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            await register(
                formData.name,
                formData.email,
                formData.password,
                formData.password_confirmation,
                formData.business_name
            );
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setServerError(firstError);
            } else {
                setServerError(err.response?.data?.message || 'تأكد من صحة البيانات المدخلة.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isEmailValid = formData.email && !errors.email;
    const isConfirmValid = formData.password_confirmation && !errors.password_confirmation && formData.password_confirmation === formData.password;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 relative overflow-hidden">
            {/* Minimal Luxury Background Elements */}
            <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div ref={containerRef} className="max-w-xl w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white/60">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            إنشاء حساب <span className="text-emerald-500 font-black text-4xl">.</span>
                        </h2>
                        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
                            مرحباً بك. ابدأ رحلة نجاحك مع المُحاسِب اليوم.
                        </p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Business Name */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">اسم النشاط التجاري</label>
                                <div className="relative flex items-center">
                                    <div className="absolute right-4 flex items-center justify-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        name="business_name"
                                        type="text"
                                        required
                                        disabled={isLoading}
                                        className={`appearance-none rounded-2xl block w-full pr-12 pl-4 py-3.5 bg-slate-50/50 border ${errors.business_name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 transition-all sm:text-base disabled:opacity-50`}
                                        placeholder="شركة النور للتقنية"
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.business_name && <p className="mt-2 text-xs font-bold text-red-500 text-right">{errors.business_name}</p>}
                            </div>

                            {/* Manager Name */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">اسم المدير</label>
                                <div className="relative flex items-center">
                                    <div className="absolute right-4 flex items-center justify-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        disabled={isLoading}
                                        className={`appearance-none rounded-2xl block w-full pr-12 pl-4 py-3.5 bg-slate-50/50 border ${errors.name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 transition-all sm:text-base disabled:opacity-50`}
                                        placeholder="أحمد محمد"
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.name && <p className="mt-2 text-xs font-bold text-red-500 text-right">{errors.name}</p>}
                            </div>
                        </div>

                        {/* Email */}
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
                                    className={`appearance-none rounded-2xl block w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border ${errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : isEmailValid ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'} placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-4 transition-all sm:text-base disabled:opacity-50 text-left`}
                                    placeholder="name@company.com"
                                    dir="ltr"
                                    onChange={handleChange}
                                />
                                {isEmailValid && (
                                    <div className="absolute right-4 flex items-center justify-center pointer-events-none">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    </div>
                                )}
                                {errors.email && (
                                    <div className="absolute right-4 flex items-center justify-center pointer-events-none">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.email && <p className="mt-2 text-xs font-bold text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
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
                                {formData.password && (
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

                            {/* Password Confirmation */}
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
                                <span>{isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}</span>
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="text-center mt-8">
                    <p className="text-sm font-medium text-slate-500">
                        لديك حساب بالفعل؟{' '}
                        <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                            العودة لتسجيل الدخول
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
