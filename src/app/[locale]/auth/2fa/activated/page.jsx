import React from 'react';

export const metadata = {
    title: 'Two-Factor Authentication Activated',
};

export default function ActivatedPage({ params }) {
    const locale = params?.locale || 'en';

    const backupCodes = [
        'K3M4-P8N2-L9B6', 'F7G8-H1J2-Q4W5', 'T6Y7-U8I9-02P3',
        'D1F2-G3H4-Z5X6', 'B9N1-M2L3-K4J5', 'I8U9-Y1T2-R3E4',
        'A7S8-D9F1-G2H3', 'L6Z7-X8C9-V1B2', 'Q5W6-E7R8-T9Y1'
    ];

    return (
        <div className="min-h-screen  text-slate-900 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Two-Factor Authentication Activated!</h1>
                <p className="text-slate-600 mb-8">Your account is now protected with an extra layer of security. Well done.</p>

                <hr className="border-gray-200 mb-8" />

                <div className="text-left mb-4">
                    <h3 className="text-lg font-semibold">Your Backup Codes</h3>
                    <p className="text-slate-600 text-sm">If you lose access to your device, you can use these backup codes to sign in. Store them in a safe place.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {backupCodes.map((c) => (
                        <div key={c} className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-3">
                            <span className="font-mono text-sm text-slate-900">{c}</span>
                            <button className="ml-4 text-slate-700 text-sm bg-gray-100 px-2 py-1 rounded">Copy</button>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 items-center mb-8">
                    <button className="bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" /></svg>
                        Download Codes
                    </button>
                    <button className="bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /></svg>
                        Print Codes
                    </button>
                </div>

                <a href={`/${locale}/dashboard`} className="inline-block bg-amber-400 text-slate-900 px-8 py-3 rounded-md font-semibold">Go to Dashboard</a>
            </div>
        </div>
    );
}
