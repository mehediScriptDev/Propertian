'use client';

import { CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

let toastTimeout;
let toastCallback = null;

export const showToast = (message, type = 'success') => {
    if (toastCallback) {
        toastCallback(message, type);
    }
};

export default function Toast() {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        toastCallback = (message, type) => {
            setToast({ message, type });

            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }

            toastTimeout = setTimeout(() => {
                setToast(null);
            }, 4000);
        };

        return () => {
            toastCallback = null;
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, []);

    const handleClose = () => {
        setToast(null);
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
    };

    if (!toast) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
            <div
                className={`flex items-start gap-3 min-w-[320px] max-w-md rounded-lg shadow-lg p-4 border ${isSuccess
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
            >
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                    {isSuccess ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                    )}
                </div>

                {/* Message */}
                <div className="flex-1">
                    <p
                        className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'
                            }`}
                    >
                        {toast.message}
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className={`flex-shrink-0 rounded-lg p-1 transition-colors ${isSuccess
                            ? 'hover:bg-green-100 text-green-600'
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
