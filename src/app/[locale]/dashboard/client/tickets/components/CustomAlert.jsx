import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function CustomAlert({ show, type = 'success', message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
      IconComponent: CheckCircle
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
      IconComponent: XCircle
    }
  };

  const style = styles[type] || styles.success;
  const Icon = style.IconComponent;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${style.bg} border rounded-lg shadow-lg p-4 pr-12 min-w-[300px] max-w-md relative`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${style.text}`}>
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
