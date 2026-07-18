import React, { useContext, useState } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import { AuthContext } from '../../context/AuthContext';
import { Settings as SettingsIcon, Building, Calculator, Receipt, User, Lock, Save, LogOut } from 'lucide-react';

const Settings = () => {
    const { settings, updateSettings, isLoading } = useContext(SettingsContext);
    const { user, logout } = useContext(AuthContext);
    
    const [activeTab, setActiveTab] = useState('business');
    const [formData, setFormData] = useState({
        business_name: settings.business_name || '',
        tax_rate: settings.tax_rate || '',
        currency: settings.currency || '',
        receipt_footer: settings.receipt_footer || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateSettings(formData);
    };

    return (
        <div className="h-full flex flex-col space-y-4 md:space-y-6 max-w-5xl mx-auto pb-20 md:pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <SettingsIcon className="w-7 h-7 text-emerald-500" />
                        الإعدادات
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">إدارة إعدادات النظام، الضرائب، وملف الشركة.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Tabs Sidebar */}
                <div className="md:w-64 flex-shrink-0 space-y-1">
                    <button 
                        onClick={() => setActiveTab('business')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                            activeTab === 'business' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Building className="w-5 h-5" />
                        بيانات الشركة
                    </button>
                    <button 
                        onClick={() => setActiveTab('tax')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                            activeTab === 'tax' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Calculator className="w-5 h-5" />
                        الضرائب والعملة
                    </button>
                    <button 
                        onClick={() => setActiveTab('receipt')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                            activeTab === 'receipt' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Receipt className="w-5 h-5" />
                        إعدادات الفاتورة
                    </button>
                    <button 
                        onClick={() => setActiveTab('account')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                            activeTab === 'account' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <User className="w-5 h-5" />
                        الحساب الشخصي
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/60 p-6 md:p-8">
                    {activeTab !== 'account' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {activeTab === 'business' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">المعلومات الأساسية</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">اسم النشاط التجاري</label>
                                        <input 
                                            type="text" 
                                            name="business_name"
                                            value={formData.business_name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                            placeholder="أدخل اسم المحل أو الشركة"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tax' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">الإعدادات المالية</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">نسبة ضريبة القيمة المضافة (%)</label>
                                            <input 
                                                type="number" 
                                                name="tax_rate"
                                                value={formData.tax_rate}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                                placeholder="مثال: 15"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">العملة الافتراضية</label>
                                            <input 
                                                type="text" 
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                                placeholder="مثال: ر.س"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'receipt' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">تخصيص الفاتورة المطبوعة</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">رسالة تذييل الفاتورة</label>
                                        <textarea 
                                            name="receipt_footer"
                                            value={formData.receipt_footer}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none"
                                            placeholder="مثال: شكراً لتسوقكم معنا! البضاعة المباعة لا ترد ولا تستبدل بعد 3 أيام."
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading ? 'جاري الحفظ...' : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            حفظ التغييرات
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    ) : (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">إعدادات الحساب</h3>
                            
                            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl shrink-0">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{user?.name}</p>
                                    <p className="text-sm text-slate-500">{user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-slate-400" /> تغيير كلمة المرور</span>
                                    <span className="text-slate-400">&larr;</span>
                                </button>
                                
                                <button 
                                    onClick={logout}
                                    className="w-full bg-rose-50 text-rose-600 px-4 py-3 rounded-xl font-bold text-sm hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    تسجيل الخروج
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
