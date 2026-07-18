import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import gsap from 'gsap';

const Signup = () => {
    const [formData, setFormData] = useState({
        business_name: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 15 }, 
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const validateForm = () => {
        if (formData.password.length < 8) {
            setError('كلمة المرور يجب أن تتكون من 8 أحرف على الأقل.');
            return false;
        }
        if (formData.password !== formData.password_confirmation) {
            setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
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
                setError(firstError);
            } else {
                setError(err.response?.data?.message || 'تأكد من صحة البيانات المدخلة.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    حساب جديد
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    أو{' '}
                    <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                        قم بتسجيل الدخول إذا كان لديك حساب
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div ref={containerRef} className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sm:rounded-2xl sm:px-10 opacity-0">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم النشاط التجاري</label>
                            <input
                                name="business_name"
                                type="text"
                                required
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors disabled:opacity-50"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم المدير</label>
                            <input
                                name="name"
                                type="text"
                                required
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors disabled:opacity-50"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                            <input
                                name="email"
                                type="email"
                                required
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors disabled:opacity-50"
                                dir="ltr"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
                            <input
                                name="password"
                                type="password"
                                required
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors disabled:opacity-50"
                                dir="ltr"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">تأكيد كلمة المرور</label>
                            <input
                                name="password_confirmation"
                                type="password"
                                required
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors disabled:opacity-50"
                                dir="ltr"
                                onChange={handleChange}
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded-lg">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
