import React from 'react';

export default function ConfirmDeleteModal({ open, message = 'Are you sure?', onCancel, onConfirm }) {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='absolute inset-0 bg-black/40' onClick={onCancel} />

            <div className='relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Confirm</h3>
                <p className='text-sm text-gray-600 mb-4'>{message}</p>

                <div className='flex justify-end gap-3'>
                    <button onClick={onCancel} className='px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'>
                        Cancel
                    </button>
                    <button onClick={onConfirm} className='px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700'>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
