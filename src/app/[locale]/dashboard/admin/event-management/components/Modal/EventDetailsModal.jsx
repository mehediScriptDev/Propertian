'use client';

import React, { useEffect } from 'react';

export default function EventDetailsModal({ isOpen, onClose, event, t, maxWidth = 'max-w-2xl', showCloseButton = true }) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='event-details-title'
        className={`relative w-full ${maxWidth} rounded-xl transform-gpu transition-all duration-200 ease-out scale-100 shadow-2xl bg-[#FFFFFF] max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {event && (
          <div className='sticky top-0 bg-white  border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl'>
            <div className='flex items-start gap-4'>
              <div className='flex flex-col'>
                <h3 id='event-details-title' className='text-gray-900 text-lg md:text-2xl lg:text-3xl font-bold'>
                  {event.title}
                </h3>
              </div>
            </div>

            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label='Close'
                className='w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary'
              >
                <svg
                  className='w-5 h-5 text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className='px-4 py-5 sm:p-6 max-h-[85vh] overflow-y-auto custom-scrollbar text-gray-900 text-base'>
          {event ? (
            <div className='space-y-6'>
              {/* Image */}
              

              {/* Basic info grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>Date (Start):</strong> {event.eventDate ? new Date(event.eventDate).toLocaleString() : (event.date || '-')}</div>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>End Date:</strong> {event.endDate ? new Date(event.endDate).toLocaleString() : '-'}</div>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>Type:</strong> {(event.eventType || event.type || '-').toString()}</div>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>Capacity:</strong> {event.capacity ?? '-'}</div>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>Published:</strong> {typeof event.isPublished === 'boolean' ? (event.isPublished ? 'Yes' : 'No') : '-'}</div>
                </div>

                <div className='space-y-2'>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>Location:</strong> {event.location || event.address || '-'}</div>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>City / Country:</strong> {(event.city || '-') + (event.country ? ` / ${event.country}` : '')}</div>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>Status:</strong> {t ? (t(`dashboard.pages.eventManagement.status.${(event.status || '').toLowerCase()}`) || event.status || '-') : (event.status || '-')}</div>
                  <div className='text-base text-gray-700'><strong className='text-gray-900'>ID:</strong> {event.id}</div>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div>
                  <h4 className='text-base font-semibold text-gray-900'>Description</h4>
                  <div className='text-base text-gray-700 whitespace-pre-wrap'>{event.description}</div>
                </div>
              )}

              {/* Speakers */}
              {Array.isArray(event.speakers) && event.speakers.length > 0 && (
                <div>
                  <h4 className='text-base font-semibold text-gray-900 mb-3'>Speakers</h4>
                  <div className='space-y-3'>
                    {event.speakers.map((s) => {
                      const avatar = typeof s.avatar === 'string' ? s.avatar : s.avatar?.url || null;
                      return (
                        <div key={s.id} className='flex items-start gap-4'>
                          <div className='flex-shrink-0'>
                            {avatar ? (
                              <img src={avatar} alt={s.name || 'speaker'} className='w-12 h-12 rounded-full object-cover' />
                            ) : (
                              <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600'>{(s.name || '').split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                            )}
                          </div>

                          <div className='flex-1'>
                            <div className='text-base font-medium text-gray-900'>{s.name || '-'}</div>
                            <div className='text-sm text-gray-600'>{s.role || ''}</div>
                            {s.bio && <div className='mt-1 text-base text-gray-700 whitespace-pre-wrap'>{s.bio}</div>}
                            <div className='mt-2 flex items-center gap-3 text-sm'>
                              {s.linkedin && (
                                <a href={s.linkedin} target='_blank' rel='noreferrer' className='text-primary underline'>LinkedIn</a>
                              )}
                              {s.twitter && (
                                <a href={s.twitter} target='_blank' rel='noreferrer' className='text-primary underline'>Twitter</a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className='pt-4 border-t border-gray-100 text-sm text-gray-600'>
                <div><strong className='text-gray-900'>Created At:</strong> {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : '-'}</div>
                <div><strong className='text-gray-900'>Updated At:</strong> {event.updatedAt ? new Date(event.updatedAt).toLocaleDateString() : '-'}</div>
              </div>
            </div>
          ) : null}
        </div>



      </div>


    </div>
  );
}
