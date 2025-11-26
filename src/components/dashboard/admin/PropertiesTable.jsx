'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, X } from 'lucide-react';

/**
 * PropertiesTable Component
 * Displays recent properties with status badges and actions
 *
 * @param {Object} props
 * @param {string} props.title - Table title
 * @param {string} props.addButtonText - Add button text
 * @param {Array} props.properties - Property data array
 * @param {Object} props.translations - i18n translations object
 * @param {string} props.locale - Current locale
 */
export default function PropertiesTable({
  title,
  addButtonText,
  properties = [],
  translations,
  locale = 'en',
}) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const getPropertyTypeStyles = (propertyType) => {
    const styles = {
      villa: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      apartment: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      commercial: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      house: 'bg-green-500/10 text-green-600 border-green-500/20',
      land: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    };
    return styles[propertyType?.toLowerCase()] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  return (
    <div className='overflow-hidden'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-white/60 px-6 py-4'>
        <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
        <button className="inline-flex items-center rounded-md bg-accent  px-5 py-2 text-base font-medium text-white cursor-pointer  ">
          <Plus className='h-5 w-5 text-white' />
          {addButtonText}
        </button>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>

              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.propertyTitle}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                property Type
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.dateAdded}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.agent}
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                {translations.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 bg-white'>
            {properties.map((property, index) => (
              <tr
                key={property.id || index}
                className='transition-colors hover:bg-gray-50'
              >
                {/* Image */}


                {/* Property Title */}
                <td className='px-6 py-4'>
                  <p className='font-semibold text-gray-900'>
                    {property.title}
                  </p>
                </td>

                {/* Property Type */}
                <td className='px-6 py-4'>
                  <span
                    className={`
                      inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium
                      ${getPropertyTypeStyles(property.propertyType)}
                    `}
                  >
                    {property.propertyType || 'N/A'}
                  </span>
                </td>

                {/* Date Added */}
                <td className='px-6 py-4'>
                  <p className='text-sm text-gray-600'>{property.dateAdded}</p>
                </td>

                {/* Agent */}
                <td className='px-6 py-4'>
                  <p className='text-sm text-gray-700'>{property.agent}</p>
                </td>

                {/* Actions */}
                <td className='px-6 py-4 pl-12'>
                  <button
                    onClick={() => handleViewDetails(property)}
                    className='inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80'
                  >
                    <Eye className='h-4 w-4' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {properties.length === 0 && (
        <div className='py-12 text-center'>
          <p className='text-gray-500'>No properties found</p>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            {/* Image */}
            {selectedProperty.image && (
              <div className="w-full h-64 md:h-80 relative">
                <Image
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover rounded-t-2xl"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-2xl md:text-3xl font-medium text-gray-900">{selectedProperty.title}</h2>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Property Type</div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedProperty.propertyType || 'N/A'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Listing Type</div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedProperty.typeLabel}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">City</div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedProperty.city || 'N/A'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">State</div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedProperty.state || 'N/A'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Price</div>
                  <div className="text-base font-semibold text-gray-900">
                    ${selectedProperty.price?.toLocaleString() || '0'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Status</div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedProperty.statusLabel}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Created At</div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedProperty.dateAdded}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Agent</div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedProperty.agent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
