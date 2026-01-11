"use client";

import { CheckCircle, Clock, XCircle } from 'lucide-react';
import Pagination from '@/components/dashboard/Pagination';

function formatDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  if (isNaN(d)) return '—';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const getStatusBadge = (status) => {
  const s = String(status || 'PENDING').toUpperCase();
  const map = {
    APPROVED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
  };
  const badge = map[s] || map.PENDING;
  const Icon = badge.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
      <Icon className='h-3.5 w-3.5' />
      {badge.label}
    </span>
  );
};

export default function ListingSubmissionsPanel({
  partners,
  loading,
  onDelete,
  onStatusChange,
  onRefresh,
  tableTranslations,
  paginationTranslations,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  return (
    <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
      {/* <div className="px-4 py-3  bg-gray-50 text-sm font-medium text-charcoal">Listing Submissions</div> */}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm font-medium text-gray-700">Loading submissions...</p>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Property Title</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Partner Name</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Date Submitted</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Status</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {partners.map((p) => (
              <tr key={p.id || p._id} className='hover:bg-gray-50 transition-colors'>
                
                <td className='px-6 py-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {p.propertyTitle || p.title || '—'}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-700'>{p.partnerName || p.fullName || '—'}</div>
                </td>
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-700'>{formatDate(p.submittedAt || p.createdAt)}</div>
                </td>
                <td className='px-6 py-4'>
                  {getStatusBadge(p.status)}
                </td>
                <td className='pl-2 py-4'>
                  <select
                    value={p.status || 'PENDING'}
                    onChange={(e) => onStatusChange && onStatusChange(p.id || p._id, e.target.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed
                      ${p.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                      ${p.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      ${p.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${p.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='lg:hidden divide-y divide-gray-200'>
        {partners.map((p) => (
          <div key={p.id || p._id} className='p-4 hover:bg-gray-50 transition-colors'>
            <div className='flex items-start justify-between mb-3'>
              <div>
                <h3 className='font-medium text-gray-900'>{p.propertyTitle || p.title || '—'}</h3>
                <div className='text-sm text-gray-700'>{p.partnerName || p.fullName || '—'}</div>
              </div>
              <div className='text-sm text-gray-500'>{formatDate(p.submittedAt || p.createdAt)}</div>
            </div>

            <div className='flex items-center justify-between'>
              <div>{getStatusBadge(p.status)}</div>
              <div>
                <select
                  value={p.status || 'PENDING'}
                  onChange={(e) => onStatusChange && onStatusChange(p.id || p._id, e.target.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20
                    ${p.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                    ${p.status === 'UNDER_REVIEW' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                    ${p.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    ${p.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        translations={paginationTranslations}
      />
    </div>
  );
}
