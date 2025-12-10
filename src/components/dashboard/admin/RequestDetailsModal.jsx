import React from 'react';
import { Calendar, X } from 'lucide-react';

export default function RequestDetailsModal({ open, request, onClose }) {
    if (!open || !request) return null;

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch (e) {
            return dateString || '';
        }
    };

    const getStatusBadge = (status, translations) => {
        // Minimal inline rendering to keep this component simple; the table uses its own badge helpers.
        const label = (status || '').toString();
        return (
            <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                {label}
            </span>
        );
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='absolute inset-0 bg-black/40' onClick={onClose} />

            <div className='relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
                <div className='flex items-center justify-between px-6 py-4 border-b'>
                    <div className='flex items-center gap-4'>
                        <span className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-700'>
                            <Calendar className='h-5 w-5' />
                        </span>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-900'>Request #{request.id}</h3>
                            <div className='text-sm text-gray-500'>
                                {request.service_type} • {formatDate(request.created_at)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button onClick={onClose} className='p-2 rounded-full hover:bg-gray-100'>
                            <X className='h-5 w-5 text-gray-700' />
                        </button>
                    </div>
                </div>

                <div className='p-6 space-y-4'>
                    <div className='grid grid-cols-1 gap-3'>
                        <div className='flex justify-between'>
                            <div className='text-sm text-gray-500'>Client</div>
                            <div className='font-medium text-gray-900'>{request.client_name}</div>
                        </div>

                        <div className='flex justify-between'>
                            <div className='text-sm text-gray-500'>Email</div>
                            <div className='font-medium text-gray-900'>{request.client_email}</div>
                        </div>

                        <div className='flex justify-between'>
                            <div className='text-sm text-gray-500'>Phone</div>
                            <div className='font-medium text-gray-900'>{request.client_phone || '—'}</div>
                        </div>

                        <div className='flex justify-between'>
                            <div className='text-sm text-gray-500'>Service</div>
                            <div className='font-medium text-gray-900'>{request.service_type}</div>
                        </div>

                        <div className='flex justify-between'>
                            <div className='text-sm text-gray-500'>Property</div>
                            <div className='font-medium text-gray-900'>{request.property_address || '—'}</div>
                        </div>

                        <div className='flex justify-between items-center gap-4'>
                            <div className='text-sm text-gray-500'>Priority</div>
                            <div className='font-medium text-gray-900'>{request.priority || '—'}</div>
                        </div>

                        <div className='flex justify-between items-center gap-4'>
                            <div className='text-sm text-gray-500'>Status</div>
                            <div>{getStatusBadge(request.status)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
