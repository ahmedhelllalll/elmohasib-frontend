import React from 'react';

const PageLoader = ({ message = "جاري التحميل..." }) => {
    return (
        <div className="flex flex-col justify-center items-center h-full min-h-[400px] w-full gap-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-300 border-b-transparent animate-[spin_1.5s_linear_infinite_reverse] opacity-50"></div>
            </div>
            <p className="text-slate-500 font-medium text-sm animate-pulse">{message}</p>
        </div>
    );
};

export default PageLoader;
