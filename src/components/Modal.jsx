import React, { useEffect } from 'react';

/**
 * Reusable Modal Component
 * @param {boolean} isOpen - Modal open/close state
 * @param {function} onClose - Function to call when closing modal
 * @param {string} title - Modal header title
 * @param {ReactNode} children - Modal body content
 * @param {string} maxWidth - Maximum width class (default: 'max-w-2xl')
 * @param {boolean} showCloseButton - Show close button in header (default: true)
 * @param {ReactNode} footer - Optional footer content
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  showCloseButton = true,
  footer,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
        className={`relative w-full ${maxWidth} rounded-xl transform-gpu transition-all duration-200 ease-out scale-100 shadow-2xl bg-[#fffff8] max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        {title && (
          <div className='sticky top-0 bg-[#fffff8] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl'>
            <div className='flex items-start gap-4'>
              <div className='flex flex-col'>
                <h3 id='modal-title' className="text-gray-900 text-lg md:text-2xl lg:text-3xl font-bold">
                  {title}
                </h3>
              </div>
            </div>

            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label='Close'
                className='w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary'
              >
                <svg
                  className='w-5 h-5 text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className='px-4 py-5 sm:p-6 max-h-[85vh]  text-gray-900'>
          {children}
        </div>

        {/* Modal Footer (Optional) - sticky and handles padding/border to avoid duplicates */}
        {footer && (
          <div className='sticky bottom-0 bg-[#fffff8] px-4 py-4 sm:px-6 sm:py-6 pt-0 border-t border-gray-100 rounded-b-xl'>
            {footer}
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles & Enter/Exit */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }
      `}</style>
    </div>
  );
};

export default Modal;
