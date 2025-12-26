'use client';

import { memo } from 'react';
import Image from 'next/image';
import { MapPin, Eye, Edit, Trash2 } from 'lucide-react';

const STATUS_BADGE_STYLES = {
  available: 'bg-green-100 text-green-700',
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-700',
};

const PropertiesListTable = memo(({ properties, translations, onView, onEdit, onDelete, loading = false }) => {
  // Show loading state
  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-sm font-medium text-gray-700">Loading properties...</p>
        </div>
      </div>
    );
  }
  
  const getStatusBadge = (status) => {
    const badgeStyle =
      STATUS_BADGE_STYLES[status] || 'bg-gray-100 text-gray-700';
    const displayText = status === 'available' ? 'Available' : translations.status[status] || status;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeStyle}`}
      >
        {displayText}
      </span>
    );
  };

  return (
    <div>
      {/* Table heading */}
      <div className='px-6 py-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-900'>All Properties</h2>
        </div>
      </div>
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-4 sm:px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90 whitespace-nowrap'>
                {translations.table.property}
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90 whitespace-nowrap'>
                {translations.table.location}
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90 whitespace-nowrap'>
                {translations.table.price}
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90 whitespace-nowrap'>
                {translations.table.status}
              </th>

              <th className='px-4 sm:px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90 whitespace-nowrap'>
                {translations.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {properties.map((property) => (
              <tr
                key={property.id}
                className='hover:bg-gray-50 transition-colors duration-150'
              >
                <td className='px-4 sm:px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='relative h-12 w-16 shrink-0 rounded overflow-hidden'>
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className='object-cover'
                        sizes='64px'
                      />
                    </div>
                    <div className='min-w-0'>
                      <div className='font-medium text-sm text-gray-900 truncate max-w-xs'>
                        {property.title}
                      </div>
                      <div className='text-xs text-gray-500 mt-0.5'>
                        {property.type} • {property.bedrooms}{' '}
                        {translations.table.beds} • {property.area}m²
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-4 sm:px-6 py-4'>
                  <div className='flex items-start gap-1 text-xs sm:text-sm text-gray-900 max-w-xs'>
                    <MapPin className='h-4 w-4 text-gray-400 shrink-0 mt-0.5' />
                    <span className='line-clamp-2'>{property.location}</span>
                  </div>
                </td>
                <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>
                    ${property.priceUSD.toLocaleString()}
                  </div>
                  <div className='text-xs text-gray-500 mt-0.5'>
                    {property.price.toLocaleString()} FCFA
                  </div>
                </td>
                <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(property.status)}
                </td>

                <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      onClick={() => onView && onView(property)}
                      className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200'
                      title={translations.table.view}
                      aria-label={`${translations.table.view} ${property.title}`}
                    >
                      <Eye className='h-4 w-4 text-gray-600' />
                    </button>
                    <button
                      type='button'
                      onClick={() => onEdit && onEdit(property)}
                      className='p-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-200'
                      title={translations.table.edit}
                      aria-label={`${translations.table.edit} ${property.title}`}
                    >
                      <Edit className='h-4 w-4 text-blue-600' />
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete && onDelete(property)}
                      className='p-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200'
                      title={translations.table.delete}
                      aria-label={`${translations.table.delete} ${property.title}`}
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

      {/* Mobile - show as cards and hide images on mobile */}
      <div className='lg:hidden space-y-4 px-4'>
        {properties.map((property) => (
          <div key={property.id} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
            <div className='flex items-start justify-between'>
              <div className='min-w-0'>
                <div className='font-medium text-sm text-gray-900 truncate'>{property.title}</div>
                <div className='text-xs text-gray-500 mt-1'>
                  {property.type} • {property.bedrooms} {translations.table.beds} • {property.area}m²
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-600 mt-2'>
                  <MapPin className='h-4 w-4 text-gray-400 shrink-0 mt-0.5' />
                  <span className='line-clamp-2'>{property.location}</span>
                </div>
              </div>

              <div className='flex flex-col items-end shrink-0'>
                <div className='text-sm font-bold text-gray-900'>${property.priceUSD.toLocaleString()}</div>
                <div className='text-xs text-gray-500'>{property.price.toLocaleString()} FCFA</div>
                <div className='mt-2'>
                  {/** Status badge kept visible on mobile */}
                  <span className='inline-block'>{getStatusBadge(property.status)}</span>
                </div>
              </div>
            </div>

            <div className='mt-3 flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => onView && onView(property)}
                  className='inline-flex items-center gap-2 bg-accent text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm hover:opacity-95'
                  title={translations.table.view}
                  aria-label={`${translations.table.view} ${property.title}`}
                >
                  <Eye className='h-4 w-4' />
                  {translations.table.view}
                </button>
              </div>

              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => onEdit && onEdit(property)}
                  className='p-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-200'
                  title={translations.table.edit}
                  aria-label={`${translations.table.edit} ${property.title}`}
                >
                  <Edit className='h-4 w-4 text-blue-600' />
                </button>
                <button
                  type='button'
                  onClick={() => onDelete && onDelete(property)}
                  className='p-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200'
                  title={translations.table.delete}
                  aria-label={`${translations.table.delete} ${property.title}`}
                >
                  <Trash2 className='h-4 w-4 text-red-600' />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PropertiesListTable.displayName = 'PropertiesListTable';

export default PropertiesListTable;
