


"use client";

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import Pagination from '@/components/dashboard/Pagination';
import api from '@/lib/api';
import { showToast } from '@/components/Toast';

// --- Constants ---
const PAGINATION_TRANSLATIONS = {
  showing: 'Showing',
  of: 'of',
  to: 'to',
  results: 'results',
  previous: 'Previous',
  next: 'Next',
};

// --- Utility Functions ---
function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '—';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const getStatusBadge = (status) => {
  const normalizedStatus = String(status || 'PENDING').toUpperCase();
  const statusMap = {
    APPROVED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
    UNDER_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, label: 'Under Review' },
  };
  const badge = statusMap[normalizedStatus] || statusMap.PENDING;
  const Icon = badge.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
      <Icon className='h-3.5 w-3.5' />
      {badge.label}
    </span>
  );
};

export default function ListingSubmissionsPage() {
  // --- State Management ---
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10 
  });

  // --- API Handlers ---
  const fetchSubmissions = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/property-approval/pending', {
        params: {
          page: page,
          limit: pagination.itemsPerPage
        }
      });

      if (response.success) {
        setSubmissions(response.data || []);

        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: response.pagination.page,
            totalPages: response.pagination.pages,
            totalItems: response.pagination.total,
            itemsPerPage: response.pagination.limit
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.itemsPerPage]);

  const handleStatusChange = async (id, newStatus) => {
    if (!id) return;
    const normalized = String(newStatus || '').toUpperCase();
    
    if (normalized === 'APPROVED') {
      setIsLoading(true);
      try {
        await api.post(`/admin/property-approval/${id}/approve`, { approvalStatus: 'APPROVED' });
        showToast('Property approved', 'success');
        setSubmissions((prev) => prev.map((p) => (p.id === id || p._id === id ? { ...p, status: 'APPROVED' } : p)));
        fetchSubmissions(pagination.currentPage);
      } catch (err) {
        console.error('Approve failed', err);
        showToast('Failed to approve property', 'error');
      } finally {
        setIsLoading(false);
      }
    } else if (normalized === 'REJECTED') {
      setRejectTargetId(id);
      setShowRejectModal(true);
    } else {
      setSubmissions((prev) => prev.map((p) => (p.id === id || p._id === id ? { ...p, status: newStatus } : p)));
    }
  };

  // Open reject modal directly
  const openRejectModal = (id) => {
    setRejectTargetId(id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectTargetId(null);
    setRejectionReason('');
  };

  const submitReject = async () => {
    if (!rejectTargetId) return;
    if (!rejectionReason || !rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await api.post(`/admin/property-approval/${rejectTargetId}/reject`, { rejectionReason: rejectionReason.trim() });
      showToast('Property rejected', 'success');
      setSubmissions((prev) => prev.map((p) => (p.id === rejectTargetId || p._id === rejectTargetId ? { ...p, status: 'REJECTED' } : p)));
      closeRejectModal();
      await fetchSubmissions(pagination.currentPage);
    } catch (err) {
      console.error('Reject failed', err);
      const serverMessage = err?.message || err?.data?.message || 'Failed to reject property';
      showToast(serverMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  // --- Effects ---
  useEffect(() => {
    fetchSubmissions(pagination.currentPage);
  }, [pagination.currentPage, fetchSubmissions]);

  // --- Render ---
  return (
    <div className='rounded-lg bg-white shadow-sm overflow-hidden relative min-h-[400px]'>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Pending Property Approvals</h2>
        <button
          onClick={() => fetchSubmissions(pagination.currentPage)}
          className="text-sm text-primary hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm font-medium text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-50 text-gray-900 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Property Details</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Location</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Price</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Status</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {submissions.length > 0 ? (
              submissions.map((item) => (
                <tr key={item.id || item._id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      {item.propertyTitle || item.title || '—'}
                    </div>
                    <div className='text-xs text-gray-500 mt-1'>
                      ID: {String(item.id || item._id).substring(0, 8)}...
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-700'>
                      {item.address ? (
                        <span title={item.address} className="truncate max-w-[200px] block">
                          {item.address}
                        </span>
                      ) : '—'}
                    </div>
                    {(item.city || item.state) && (
                      <div className='text-xs text-gray-500 mt-0.5'>
                        {item.city}, {item.state}
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      ${item.price ? Number(item.price).toLocaleString() : '0'}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    {getStatusBadge(item.status)}
                  </td>
                  <td className='pl-2 py-4'>
                    <select
                      value={item.status || 'PENDING'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (String(val).toUpperCase() === 'REJECTED') {
                          openRejectModal(item.id || item._id);
                        } else {
                          handleStatusChange(item.id || item._id, val);
                        }
                      }}
                      disabled={isLoading}
                      className={`
                        px-3 py-1.5 rounded-md text-xs font-medium border cursor-pointer 
                        focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
                        ${item.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                        ${item.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${item.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                        ${item.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                      `}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="APPROVED">Approve</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-300" />
                    <p className="text-sm">No pending submissions found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className='lg:hidden divide-y divide-gray-200'>
        {submissions.length > 0 ? (
          submissions.map((item) => (
            <div key={item.id || item._id} className='p-4 hover:bg-gray-50 transition-colors'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex-1 pr-4'>
                  <h3 className='font-medium text-gray-900 line-clamp-1'>
                    {item.propertyTitle || item.title || '—'}
                  </h3>
                  <div className='text-sm text-gray-500 mt-1'>
                    {item.address || '—'}
                  </div>
                </div>
                <div className='text-sm font-bold text-gray-900 whitespace-nowrap'>
                  ${item.price ? Number(item.price).toLocaleString() : '0'}
                </div>
              </div>

              <div className='flex items-center justify-between pt-2'>
                <div>{getStatusBadge(item.status)}</div>
                <div className="w-1/2 max-w-[140px]">
                  <select
                    value={item.status || 'PENDING'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (String(val).toUpperCase() === 'REJECTED') {
                        openRejectModal(item.id || item._id);
                      } else {
                        handleStatusChange(item.id || item._id, val);
                      }
                    }}
                    disabled={isLoading}
                    className='w-full px-3 py-1.5 rounded-md text-xs font-medium border border-gray-200 bg-white shadow-sm'
                  >
                    <option value="PENDING">Pending</option>
                    <option value="UNDER_REVIEW">Review</option>
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No pending submissions found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={handlePageChange}
        translations={PAGINATION_TRANSLATIONS}
      />
      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeRejectModal} />
          <div className="relative z-50 w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-300">
              <h3 className="text-lg font-semibold">Reject Reason</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                className="mt-2 w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Provide a reason for rejecting this property"
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-300 flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 rounded-md bg-gray-100 text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm"
                disabled={isLoading || !rejectionReason.trim()}
              >
                Submit Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}