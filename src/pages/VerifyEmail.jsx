import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const VerifyEmail = () => {
    const query = useQuery();
    const url = query.get('url');
    const { verifyEmail } = useContext(AuthContext);
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading'); // loading, success, error

    useEffect(() => {
        if (!url) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                await verifyEmail(decodeURIComponent(url));
                setStatus('success');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } catch (error) {
                setStatus('error');
            }
        };

        verify();
    }, [url, verifyEmail, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center flex flex-col items-center">
                
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">جاري التحقق من بريدك الإلكتروني...</h2>
                        <p className="text-slate-500">يرجى الانتظار لحظات.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">تم التحقق بنجاح!</h2>
                        <p className="text-slate-500 mb-6">شكراً لك، تم تأكيد بريدك الإلكتروني. سيتم توجيهك الآن.</p>
                        <Link to="/dashboard" className="text-emerald-600 font-medium hover:text-emerald-700">
                            الذهاب للوحة التحكم فوراً
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">حدث خطأ</h2>
                        <p className="text-slate-500 mb-6">الرابط غير صالح أو منتهي الصلاحية.</p>
                        <Link to="/dashboard" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
                            العودة للوحة التحكم
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;
