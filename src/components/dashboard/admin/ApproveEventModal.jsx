'use client';

import { X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

/**
 * ApproveEventModal - Modal for approving event requests with additional details
 * @param {boolean} open - Whether modal is visible
 * @param {object} eventRequest - The event request being approved
 * @param {function} onClose - Cancel handler
 * @param {function} onConfirm - Confirm handler with approval details
 */
export default function ApproveEventModal({ open, eventRequest, onClose, onConfirm }) {
  const [finalDate, setFinalDate] = useState('');
  const [placement, setPlacement] = useState('homepage');
  const [visibility, setVisibility] = useState('public');

  if (!open || !eventRequest) return null;

  const handleConfirm = () => {
    onConfirm({
      finalDate,
      placement,
      visibility,
    });
    // Reset form
    setFinalDate('');
    setPlacement('homepage');
    setVisibility('public');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Approve Event Request
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Set final details for <span className="font-semibold text-gray-900">{eventRequest.event_title}</span>
          </p>

          {/* Final Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Event Date
            </label>
            <input
              type="datetime-local"
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              required
            />
          </div>

          {/* Placement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placement
            </label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              <option value="homepage">Homepage Featured</option>
              <option value="events-page">Events Page</option>
              <option value="sidebar">Sidebar Widget</option>
              <option value="newsletter">Newsletter</option>
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              <option value="public">Public</option>
              <option value="members-only">Members Only</option>
              <option value="invite-only">Invite Only</option>
            </select>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Note: Approving will not make the event live immediately. You'll need to set it to "Live" status separately.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!finalDate}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve Event
          </button>
        </div>
      </div>
    </div>
  );
}
