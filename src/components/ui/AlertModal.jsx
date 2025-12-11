"use client";

import React from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

export default function AlertModal({ open, type = 'success', title = '', message = '', onClose }) {
  if (!open) return null;

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            <Icon className={`w-8 h-8 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title || (type === 'success' ? 'Success' : 'Error')}</h3>
          <p className="text-sm text-gray-600">{message}</p>

          <div className="w-full mt-4">
            <button
              onClick={onClose}
              className={`w-full py-2 rounded-lg ${type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
