"use client";

import React from 'react';

export default function SuccessModal({ open, title = 'Success', message = '', onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-2 text-lg font-semibold text-slate-800">{title}</h3>
                <p className="mb-6 text-sm text-slate-700">{message}</p>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-95 focus:outline-none"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
