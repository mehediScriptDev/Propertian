"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, Eye, Trash2 } from 'lucide-react';
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

function Avatar({ partner, size = 40 }) {
  const [errored, setErrored] = useState(false);
  const name = partner?.partnerName || partner?.fullName || partner?.name || '';
  const imageUrl = partner?.partnerImage || partner?.avatar || partner?.image || partner?.profileImage || partner?.picture || partner?.photo || partner?.documentPreview || '';
  const initials = name ? name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() : '—';
  const sizeClass = size === 40 ? 'h-10 w-10' : 'h-8 w-8';

  return (
    <div className={`relative flex-shrink-0 ${sizeClass} rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-sm font-medium text-gray-600`}>
      {imageUrl && !errored ? (
        <img
          src={imageUrl}
          alt={name || 'avatar'}
          className="object-cover h-full w-full"
          onError={() => setErrored(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default function VerificationRequestsPanel({
  partners,
  loading,
  onDelete,
  onStatusChange,
  onViewDocument,
  onRefresh,
  tableTranslations,
  paginationTranslations,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  useEffect(() => {
    console.log('VerificationRequestsPanel partners:', partners);
  }, [partners]);
  return (
    <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
      {/* <div className="px-4 py-3 border-b bg-gray-50 text-sm font-medium text-charcoal">Verification Requests</div> */}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm font-medium text-gray-700">Loading requests...</p>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[900px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Property Title</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Partner Name</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Date Submitted</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Documents</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Status</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {partners.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-8 text-center text-sm text-gray-500'>
                  No verification requests found.
                </td>
              </tr>
            ) : (
              partners.map((p, idx) => (
                <tr key={p.id || p._id || p.partnerId || p.documentId || idx} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>{p.propertyTitle || p.title || '—'}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <Avatar partner={p} />
                      <div className='text-sm text-gray-700'>{p.partnerName || p.fullName || '—'}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-700'>{formatDate(p.submittedAt || p.createdAt)}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => (typeof onViewDocument === 'function' ? onViewDocument(p) : window.open(p.documentUrl || '#', '_blank'))}
                      className='text-sm text-primary underline'
                    >
                      View Document
                    </button>
                  </td>
                  <td className='px-6 py-4'>
                    {getStatusBadge(p.status)}
                  </td>
                  <td className='pl-2 py-4'>
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='lg:hidden divide-y divide-gray-200'>
        {partners.length === 0 ? (
          <div className='p-4 text-center text-sm text-gray-500'>No verification requests found.</div>
        ) : (
          partners.map((p, idx) => (
            <div key={p.id || p._id || p.partnerId || p.documentId || idx} className='p-4 hover:bg-gray-50 transition-colors'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <Avatar partner={p} />
                  <div>
                    <h3 className='font-medium text-gray-900'>{p.propertyTitle || p.title || '—'}</h3>
                    <div className='text-sm text-gray-700'>{p.partnerName || p.fullName || '—'}</div>
                  </div>
                </div>
                <div className='text-sm text-gray-500'>{formatDate(p.submittedAt || p.createdAt)}</div>
              </div>

              <div className='space-y-3 mb-3'>
                <div>
                  <button
                    onClick={() => (typeof onViewDocument === 'function' ? onViewDocument(p) : window.open(p.documentUrl || '#', '_blank'))}
                    className='text-sm text-primary underline'
                  >
                    View Document
                  </button>
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
            </div>
          ))
        )}
      </div>

      {/* Safe pagination values to avoid NaN when totalItems is undefined */}
      {
        (() => {
          const safeTotalItems = Number(totalItems) || partners.length || 0;
          const safeItemsPerPage = Number(itemsPerPage) || 10;
          const safeTotalPages = Math.max(1, Number(totalPages) || Math.ceil(safeTotalItems / safeItemsPerPage) || 1);

          return (
            <Pagination
              currentPage={Math.max(1, Number(currentPage) || 1)}
              totalPages={safeTotalPages}
              totalItems={safeTotalItems}
              itemsPerPage={safeItemsPerPage}
              onPageChange={onPageChange}
              translations={paginationTranslations}
            />
          );
        })()
      }
    </div>
  );
}
// 'use client';

// import PartnersTable from '@/components/dashboard/admin/PartnersTable';
// import Pagination from '@/components/dashboard/Pagination';

// export default function VerificationRequestsPanel({
//   partners,
//   loading,
//   onDelete,
//   onStatusChange,
//   onRefresh,
//   tableTranslations,
//   paginationTranslations,
//   currentPage,
//   totalPages,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
// }) {
//   return (
//     <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
      
//       <PartnersTable
//         partners={partners}
//         loading={loading}
//         onDelete={onDelete}
//         onStatusChange={onStatusChange}
//         onRefresh={onRefresh}
//         translations={tableTranslations}
//       />
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalItems={totalItems}
//         itemsPerPage={itemsPerPage}
//         onPageChange={onPageChange}
//         translations={paginationTranslations}
//       />
//     </div>
//   );
// }
