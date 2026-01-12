'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * AssignModal - Modal for assigning tickets to Internal Concierge or Partners
 * @param {boolean} open - Whether modal is visible
 * @param {object} ticket - The ticket being assigned
 * @param {function} onClose - Close handler
 * @param {function} onAssign - Callback when assignment is confirmed (assignType) => void
 */
export default function AssignModal({ open, ticket, onClose, onAssign }) {
  const [assignType, setAssignType] = useState('internal');

  if (!open || !ticket) return null;

  const handleConfirm = () => {
    onAssign(assignType);
    setAssignType('internal'); // Reset for next time
  };

  const handleCancel = () => {
    setAssignType('internal');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Ticket #{ticket.id}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select who should handle this ticket:
          </p>

          {/* Radio Options */}
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-500 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50">
              <input
                type="radio"
                name="assignType"
                value="internal"
                checked={assignType === 'internal'}
                onChange={(e) => setAssignType(e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  Internal Concierge
                </div>
                <div className="text-xs text-gray-500">
                  Assign to internal team member
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-500 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50">
              <input
                type="radio"
                name="assignType"
                value="partner"
                checked={assignType === 'partner'}
                onChange={(e) => setAssignType(e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  Concierge Partner
                </div>
                <div className="text-xs text-gray-500">
                  Assign to external partner
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Confirm Assign
          </button>
        </div>
      </div>
    </div>
  );
}
