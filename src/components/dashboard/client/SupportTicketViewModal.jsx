import React, { useEffect, useRef } from 'react';
import Modal from '@/components/Modal';

export default function TicketDetailsModal({ show = false, onClose = () => {}, ticket = null }) {
  const contentRef = useRef(null);

  // default sample ticket when none provided
  const ticketData = ticket || {
    id: '11',
    status: 'Closed',
    date: '2025-11-25',
    category: 'Billing',
    property: '3-Bedroom Apt in Cocody',
    subject: 'Payment Issue',
    description: 'The payment transaction for the Cocody apartment booking failed multiple times. Please investigate.',
  };

  useEffect(() => {
    if (show) {
      // focus the content container for accessibility
      contentRef.current?.focus();
    }
  }, [show]);

  return (
    <Modal isOpen={show} onClose={onClose} title={`Ticket Details: ${ticketData.id}`} maxWidth="max-w-2xl">
      <div ref={contentRef} tabIndex={-1} className="outline-none">
        {/* Info Grid */}
        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Status:</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">{ticketData.status}</span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Date:</p>
            <p className="text-sm text-gray-900">{ticketData.date}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Category:</p>
            <p className="text-sm text-gray-900">{ticketData.category}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Property:</p>
            <p className="text-sm text-gray-900">{ticketData.property}</p>
          </div>
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-900">{ticketData.subject}</div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700">{ticketData.description}</div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-accent border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
        </div>
      </div>
    </Modal>
  );
}