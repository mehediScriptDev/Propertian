"use client";

import React, { useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AlertModal({ open, type = 'success', title = '', message = '', onClose }) {
  const shownRef = useRef(false);

  useEffect(() => {
    if (open && !shownRef.current) {
      shownRef.current = true;

      const Content = (
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {type === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">{title || (type === 'success' ? 'Success' : 'Error')}</div>
            <div className="text-sm text-gray-600">{message}</div>
          </div>
        </div>
      );

      const options = {
        onClose: () => {
          shownRef.current = false;
          if (typeof onClose === 'function') onClose();
        },
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      };

      if (type === 'success') {
        toast.success(Content, options);
      } else {
        toast.error(Content, options);
      }
    }
  }, [open, type, title, message, onClose]);

  return <ToastContainer position="top-center" />;
}
