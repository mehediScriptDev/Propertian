'use client';

import { X, Play } from 'lucide-react';

/**
 * GoLiveModal - Confirmation dialog for making event live
 * @param {boolean} open - Whether modal is visible
 * @param {object} eventRequest - The event request going live
 * @param {function} onClose - Cancel handler
 * @param {function} onConfirm - Confirm handler
 */
export default function GoLiveModal({ open, eventRequest, onClose, onConfirm }) {
  if (!open || !eventRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
              <Play className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Make Event Live
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
        <div className="p-6">
          <p className="text-sm text-gray-600">
            Are you sure you want to make <span className="font-semibold text-gray-900">{eventRequest.event_title}</span> live?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            The event will become publicly visible and appear in Event Management.
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
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Live
          </button>
        </div>
      </div>
    </div>
  );
}
