
'use client';

import { X, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import axios from '@/lib/axios';
import { showToast } from '@/components/Toast';

export default function ApproveEventModal({ open, eventRequest, onClose, onConfirm }) {
  const [approvalNotes, setApprovalNotes] = useState('Event approved. Excellent content and speaker lineup.');
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!open || !eventRequest) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const id = eventRequest.id || eventRequest._id;
      const payload = {
        approvalNotes,
        publishImmediately,
      };

      const res = await axios.post(`/events/admin/${id}/approve`, payload);

      showToast('Event approved successfully', 'success');

      if (typeof onConfirm === 'function') {
        onConfirm(res?.data || res?.data?.data || payload);
      }
      onClose();

      // Reset
      setApprovalNotes('Event approved. Excellent content and speaker lineup.');
      setPublishImmediately(true);
    } catch (err) {
      const msg = err?.message || 'Failed to approve event';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 ring-4 ring-green-50">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Approve Event</h2>
              <p className="text-xs text-gray-500 font-medium">{eventRequest.event_title || 'Event'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Approval Notes</label>
            <textarea
              rows={4}
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Enter approval notes..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">Publish Immediately</span>
              <span className="text-xs text-gray-500">Event will go live instantly</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-60"
            disabled={submitting}
          >
            <CheckCircle className="w-4 h-4" />
            {submitting ? 'Approving...' : 'Approve Event'}
          </button>
        </div>
      </div>
    </div>
  );
}