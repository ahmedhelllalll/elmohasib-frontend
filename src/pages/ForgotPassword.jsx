import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import gsap from 'gsap';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { forgotPassword } = useContext(AuthContext);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 15 }, 
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');
        
        if (!email) {
            setError('الرجاء إدخال البريد الإلكتروني.');
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword(email);
            setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
        } catch (err) {
            setError(err.response?.data?.email || 'حدث خطأ. يرجى المحاولة لاحقاً.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    نسيت كلمة المرور؟
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div ref={containerRef} className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sm:rounded-2xl sm:px-10 opacity-0">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                            <input
                                name="email"
                                type="email"
                                required
                                disabled={isLoading}
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors disabled:opacity-50"
                                dir="ltr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded-lg">{error}</div>}
                        {message && <div className="text-emerald-600 text-sm text-center font-medium bg-emerald-50 p-3 rounded-lg">{message}</div>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {isLoading ? 'جاري الإرسال...' : 'إرسال رابط التعيين'}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-slate-500">
                                تذكرت كلمة المرور؟{' '}
                                <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                                    العودة لتسجيل الدخول
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
