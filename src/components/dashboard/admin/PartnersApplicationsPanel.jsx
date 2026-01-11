"use client";

import { CheckCircle, Clock, XCircle, Eye, Trash2, Mail, Phone } from 'lucide-react';
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
    UNDER_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, label: 'Under Review' },
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

export default function PartnersApplicationsPanel({
  partners,
  loading,
  onDelete,
  onStatusChange,
  onView,
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
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm font-medium text-gray-700">Loading applications...</p>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[900px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Partner Name</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Contact Info</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Company</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Date Submitted</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Status</th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {partners.map((p) => (
              <tr key={p.id || p._id} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4'>
                  <div className='text-sm font-medium text-gray-900'>{p.fullName || '—'}</div>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1 text-sm text-gray-600'>
                      <Mail className='h-3.5 w-3.5 shrink-0 text-gray-400' />
                      <span className='truncate max-w-[180px]'>{p.email || '—'}</span>
                    </div>
                    {p.phone && (
                      <div className='flex items-center gap-1 text-sm text-gray-600'>
                        <Phone className='h-3.5 w-3.5 shrink-0 text-gray-400' />
                        {p.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-700'>{p.companyName || '—'}</div>
                </td>
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-700'>{formatDate(p.createdAt)}</div>
                </td>
                <td className='px-6 py-4'>
                  {getStatusBadge(p.status)}
                </td>
                <td className='pl-2 py-4'>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => onStatusChange && onStatusChange(p.id || p._id, 'APPROVED')}
                      className='rounded p-1.5 hover:bg-green-50 transition-colors'
                      title='Approve Application'
                    >
                      <CheckCircle className='h-4 w-4 text-green-600' />
                    </button>
                    <button
                      onClick={() => (typeof onView === 'function' ? onView(p) : null)}
                      className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                      title='View'
                    >
                      <Eye className='h-4 w-4 text-gray-600' />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(p.id || p._id)}
                      className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                      title='Delete'
                    >
                      <Trash2 className='h-4 w-4 text-red-600' />
                    </button>
                  </div>
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
                <h3 className='font-medium text-gray-900'>{p.fullName || '—'}</h3>
                <div className='text-sm text-gray-700'>{p.companyName || '—'}</div>
              </div>
              <div className='text-sm text-gray-500'>{formatDate(p.createdAt)}</div>
            </div>

            <div className='space-y-2 mb-3'>
              <div className='flex items-center gap-1 text-sm text-gray-600'>
                <Mail className='h-3.5 w-3.5 shrink-0 text-gray-400' />
                <span className='truncate'>{p.email || '—'}</span>
              </div>
              {p.phone && (
                <div className='flex items-center gap-1 text-sm text-gray-600'>
                  <Phone className='h-3.5 w-3.5 shrink-0 text-gray-400' />
                  {p.phone}
                </div>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <div>{getStatusBadge(p.status)}</div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => onStatusChange && onStatusChange(p.id || p._id, 'APPROVED')}
                  className='rounded p-1.5 hover:bg-green-50 transition-colors'
                  title='Approve Application'
                >
                  <CheckCircle className='h-4 w-4 text-green-600' />
                </button>
                <button
                  onClick={() => (typeof onView === 'function' ? onView(p) : null)}
                  className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                  title='View'
                >
                  <Eye className='h-4 w-4 text-gray-600' />
                </button>
                <button
                  onClick={() => onDelete && onDelete(p.id || p._id)}
                  className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                  title='Delete'
                >
                  <Trash2 className='h-4 w-4 text-red-600' />
                </button>
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
