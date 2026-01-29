import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function ConciergeModal({ initialOpen = true, onClose } = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    // if parent decides to close by changing initialOpen
    setIsOpen(initialOpen);
  }, [initialOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (typeof onClose === 'function') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // prevent background scroll while modal open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow || '';
    };
  }, [isOpen]);

  // close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="presentation"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Concierge confirmation"
        className="bg-background-light rounded-lg shadow-xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div className="flex justify-center ">
          <div className=" rounded-full flex items-center justify-center">
            <Image src="/logo.png" alt="Q Global Living Logo" width={200} height={200} />
          </div>
        </div>
        
        {/* Brand Name */}
        {/* <div className="text-center mb-6">
          <p className="text-amber-700 text-sm tracking-widest font-light">Q GLOBAL</p>
          <p className="text-amber-700 text-xs tracking-widest font-light">LIVING</p>
        </div> */}

        {/* Title */}
        <h2 className="text-accent text-3xl font-bold text-center mb-3">
          Thank you!
        </h2>

        {/* Content */}
        <div className="text-center mb-4">
          <p className="text-gray-700 text-base font-semibold mb-3">
            Your concierge consultation request has been received.
          </p>
          
          <p className="text-gray-600 text-sm">
            A member of our Q Global Concierge team will contact you shortly. In the meantime, feel free to reach us at{' '}
            <a 
              href="mailto:support@qgloballiving.com" 
              className="text-amber-600 hover:text-amber-700 underline"
            >
              support@qgloballiving.com
            </a>
            {' '}for urgent enquiries.
          </p>
        </div>

        {/* Close Button */}
        <button
          ref={closeBtnRef}
          onClick={handleClose}
          className="w-full bg-accent text-white font-medium py-3 rounded-md transition-all duration-200 shadow-md hover:shadow-lg mt-6 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Close
        </button>
      </div>
    </div>
  );
}