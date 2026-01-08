'use client';

import { Eye, Building2, X, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

/**
 * ApprovedPartnersTable Component
 * Displays approved partners with details and actions
 *
 * @param {Object} props
 * @param {string} props.title - Table title
 * @param {Array} props.partners - Partner data array
 * @param {Function} props.onActionClick - Action click handler
 */
export default function ApprovedPartnersTable({ title, partners = [], onActionClick }) {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (partner) => {
    if (onActionClick) {
      onActionClick('view', partner);
    } else {
      setSelectedPartner(partner);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  const getStatusStyles = (status) => {
    const styles = {
      approved: 'bg-green-500/10 text-green-600 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    const key = typeof status === 'string' ? status.toLowerCase() : String(status);
    return styles[key] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  return (
    <>
      <div className='px-6 py-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className='block md:hidden px-4 pb-4 space-y-4'>
        {partners.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>No approved partners found</div>
        ) : (
          partners.map((partner) => (
            <div
              key={partner.id}
              className='bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow'
            >
              {/* Partner Header */}
              <div className='mb-3'>
                <h3 className='text-lg font-semibold text-gray-900'>{partner.companyName || partner.name}</h3>
                <p className='text-sm text-gray-600 mt-1'>{partner.email}</p>
              </div>

              {/* Partner Details */}
              <div className='space-y-2 mb-4'>
                {partner.phone && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>Phone:</span>
                    <span className='text-sm font-medium text-gray-900'>{partner.phone}</span>
                  </div>
                )}
                {partner.role && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>Role:</span>
                    <span className='text-sm font-medium text-gray-900'>{partner.role}</span>
                  </div>
                )}
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>Status:</span>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
                      partner.status
                    )}`}
                  >
                    {partner.statusLabel || partner.status}
                  </span>
                </div>
                {partner.dateJoined && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>Joined:</span>
                    <span className='text-sm font-medium text-gray-900'>{partner.dateJoined}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className='pt-3 border-t border-gray-200'>
                <button
                  onClick={() => handleViewDetails(partner)}
                  className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm transition-colors hover:bg-primary/20'
                >
                  <Eye className='h-4 w-4' />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Company Name
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Email
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Phone
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Role
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Status
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {partners.length === 0 ? (
              <tr>
                <td colSpan='6' className='px-6 py-8 text-center text-gray-500'>
                  No approved partners found
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {partner.companyName || partner.name}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-700'>{partner.email}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-700'>{partner.phone || '—'}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-700'>{partner.role || 'Partner'}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
                        partner.status
                      )}`}
                    >
                      {partner.statusLabel || partner.status}
                    </span>
                  </td>
                  <td className='pl-8 py-4'>
                    <div className='pl-4 flex items-center gap-4'>
                      <button
                        onClick={() => handleViewDetails(partner)}
                        className='inline-flex items-center gap-2 font-semibold text-primary transition-colors'
                        title='View Details'
                      >
                        <Eye className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Partner Details Modal */}
      {isModalOpen && selectedPartner && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className='relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between border-b border-gray-200 px-6 py-5'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-[#d4af37]/10 rounded-lg'>
                  <Building2 className='h-5 w-5 text-[#d4af37]' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900'>Partner Details</h3>
              </div>

              <button
                onClick={handleCloseModal}
                className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Content */}
            <div className='px-6 py-6 space-y-6'>
              {/* Details Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    Company Name
                  </div>
                  <div className='text-lg font-semibold text-gray-900'>
                    {selectedPartner.companyName || selectedPartner.name}
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    Email
                  </div>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-gray-400' />
                    <div className='text-sm font-semibold text-gray-900'>
                      {selectedPartner.email}
                    </div>
                  </div>
                </div>

                {selectedPartner.phone && (
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                      Phone
                    </div>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4 text-gray-400' />
                      <div className='text-sm font-semibold text-gray-900'>
                        {selectedPartner.phone}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPartner.city && (
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                      City
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4 text-gray-400' />
                      <div className='text-sm font-semibold text-gray-900'>
                        {selectedPartner.city}
                      </div>
                    </div>
                  </div>
                )}

                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    Status
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
                      selectedPartner.status
                    )}`}
                  >
                    {selectedPartner.statusLabel || selectedPartner.status}
                  </span>
                </div>

                {selectedPartner.dateJoined && (
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                      Date Joined
                    </div>
                    <div className='text-sm font-semibold text-gray-900'>
                      {selectedPartner.dateJoined}
                    </div>
                  </div>
                )}

                {selectedPartner.address && (
                  <div className='bg-gray-50 rounded-lg p-4 md:col-span-2'>
                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                      Address
                    </div>
                    <div className='text-sm font-semibold text-gray-900'>
                      {selectedPartner.address}
                    </div>
                  </div>
                )}

                {selectedPartner.description && (
                  <div className='bg-gray-50 rounded-lg p-4 md:col-span-2'>
                    <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                      Description
                    </div>
                    <div className='text-sm text-gray-900'>
                      {selectedPartner.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
