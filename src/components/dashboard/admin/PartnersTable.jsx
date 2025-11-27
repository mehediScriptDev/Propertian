'use client';

import { memo, useState } from 'react';
import {
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from 'lucide-react';

const PartnersTable = memo(({ partners, translations }) => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };
  const getVerificationBadge = (status) => {
    const badges = {
      verified: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: translations.verification.verified,
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
        label: translations.verification.pending,
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: translations.verification.rejected,
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon className='h-3.5 w-3.5' />
        {badge.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const badges = {
      paid: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: translations.payment.paid,
      },
      unpaid: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: translations.payment.unpaid,
      },
      partial: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: translations.payment.partial,
      },
    };

    const badge = badges[status] || badges.unpaid;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  // Helper to make object keys readable
  const prettyLabel = (key) =>
    String(key)
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const formatValue = (val) => {
    if (val === null || val === undefined) return '—';
    if (Array.isArray(val)) return val.length ? val.join(', ') : '—';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'object') return JSON.stringify(val);
    // Detect ISO-like date strings and format as YYYY-MM-DD
    if (typeof val === 'string') {
      const isoDate = /^\d{4}-\d{2}-\d{2}(T|$)/;
      if (isoDate.test(val)) {
        const d = new Date(val);
        if (!isNaN(d)) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
      }
    }
    return String(val);
  };

  const formatDate = (v) => {
    if (!v) return '—';
    const d = new Date(v);
    if (isNaN(d)) return '—';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div>
      <div className='px-6 py-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-900'>All Partners</h2>
        </div>
      </div>

      {/* Desktop Table */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.company}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.contact}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.projects}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.verification}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.payment}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {partners.map((partner) => (
              <tr
                key={partner.id}
                className='hover:bg-gray-50 transition-colors'
              >
                <td className='px-6 py-4'>
                  <div className='flex flex-col'>
                    <div className='font-medium text-gray-900'>
                      {partner.company_name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {translations.table.joined}{' '}
                      {formatDate(partner.created_at)}
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex flex-col gap-1'>
                    <div className='text-sm font-medium text-gray-900'>
                      {partner.contact_person}
                    </div>
                    <div className='flex items-center gap-1 text-sm text-gray-600'>
                      <Mail className='h-3.5 w-3.5 shrink-0 text-gray-400' />
                      <span className='truncate max-w-[180px]'>
                        {partner.email}
                      </span>
                    </div>
                    {partner.phone_number && (
                      <div className='flex items-center gap-1 text-sm text-gray-600'>
                        <Phone className='h-3.5 w-3.5 shrink-0 text-gray-400' />
                        {partner.phone_number}
                      </div>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <FolderOpen className='h-4 w-4 text-gray-400' />
                    <span className='text-sm font-medium text-gray-900'>
                      {partner.project_names?.length || 0}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  {getVerificationBadge(
                    partner.is_verified ? 'verified' : 'pending'
                  )}
                </td>
                <td className='px-6 py-4'>
                  {getPaymentBadge(partner.is_paid ? 'paid' : 'unpaid')}
                </td>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleView(partner)}
                      className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                      title={translations.table.view}
                    >
                      <Eye className='h-4 w-4 text-gray-600' />
                    </button>
                    <button
                      className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                      title={translations.table.edit}
                    >
                      <Edit className='h-4 w-4 text-blue-600' />
                    </button>
                    <button
                      className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                      title={translations.table.delete}
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
        {partners.map((partner) => (
          <div
            key={partner.id}
            className='p-4 hover:bg-gray-50 transition-colors'
          >
            {/* Company Name */}
            <div className='flex items-start justify-between mb-3'>
              <div className='flex-1'>
                <h3 className='font-medium text-gray-900'>
                  {partner.company_name}
                </h3>
                <p className='text-xs text-gray-500 mt-1'>
                  {translations.table.joined}{' '}
                  {formatDate(partner.created_at)}
                </p>
              </div>
              <div className='flex items-center gap-1 ml-2'>
                <button
                  onClick={() => handleView(partner)}
                  className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                  title={translations.table.view}
                >
                  <Eye className='h-4 w-4 text-gray-600' />
                </button>
                <button
                  className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                  title={translations.table.edit}
                >
                  <Edit className='h-4 w-4 text-blue-600' />
                </button>
                <button
                  className='rounded p-1.5 hover:bg-gray-100 transition-colors'
                  title={translations.table.delete}
                >
                  <Trash2 className='h-4 w-4 text-red-600' />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className='space-y-2 mb-3'>
              <div className='text-sm'>
                <span className='font-medium text-gray-700'>
                  {translations.table.contact}:{' '}
                </span>
                <span className='text-gray-900'>{partner.contact_person}</span>
              </div>
              <div className='flex items-center gap-1 text-sm text-gray-600'>
                <Mail className='h-3.5 w-3.5 shrink-0 text-gray-400' />
                <span className='truncate'>{partner.email}</span>
              </div>
              {partner.phone_number && (
                <div className='flex items-center gap-1 text-sm text-gray-600'>
                  <Phone className='h-3.5 w-3.5 shrink-0 text-gray-400' />
                  {partner.phone_number}
                </div>
              )}
            </div>

            {/* Stats & Status */}
            <div className='flex flex-wrap items-center gap-2'>
              <div className='flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md'>
                <FolderOpen className='h-3.5 w-3.5 text-gray-400' />
                <span className='font-medium'>
                  {partner.project_names?.length || 0}
                </span>
                <span className='text-xs'>{translations.table.projects}</span>
              </div>
              {getVerificationBadge(
                partner.is_verified ? 'verified' : 'pending'
              )}
              {getPaymentBadge(partner.is_paid ? 'paid' : 'unpaid')}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {partners.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          <FolderOpen className='h-12 w-12 mx-auto mb-3 text-gray-300' />
          <p className='text-sm'>No partners found</p>
        </div>
      )}
      {/* Partner Details Modal */}
      {isModalOpen && selectedPartner && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40' onClick={handleClose} />

          <div className='relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
              <div className='flex items-center gap-3'>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-primary'>
                  <FolderOpen className='h-5 w-5' />
                </span>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>{selectedPartner.company_name}</h3>
                  <div className='text-base text-gray-500'>{selectedPartner.contact_person}</div>
                </div>
              </div>

              <div>
                <button onClick={handleClose} className='p-2 rounded-full hover:bg-gray-100'>
                  <X className='h-5 w-5 text-gray-700' />
                </button>
              </div>
            </div>

            <div className='p-6'>
              <dl className='space-y-3'>
                {Object.entries(selectedPartner).map(([key, value]) => (
                  <div key={key} className='flex items-start justify-between gap-4'>
                    <dt className='text-base text-gray-500'>{prettyLabel(key)}</dt>
                    <dd className='text-base font-medium text-gray-900'>
                      {formatValue(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PartnersTable.displayName = 'PartnersTable';

export default PartnersTable;
