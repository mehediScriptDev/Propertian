'use client';

import { X, UserPen, User, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function EditUserModal({
  isOpen,
  onClose,
  onSave,
  editForm,
  setEditForm,
  updating,
  updateError,
  t,
  selectedUser,
}) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-200 '>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-[#d4af37]/20 rounded-lg'>
              <UserPen className='h-6 w-6 text-[#d4af37]' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                {t('dashboard.admin.users.actions.edit') || 'Edit User'}
              </h2>
              <p className='text-sm text-gray-600 mt-0.5'>
                Update user information and settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className='p-2 rounded-lg text-gray-400  transition-colors cursor-pointer'
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSave} className='px-6 py-6'>
          {updateError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2'>
              <div className='text-red-600 text-sm'>{updateError}</div>
            </div>
          )}

          {/* User Info Section */}
          <div className='mb-6'>
            <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
              <User className='h-4 w-4 text-gray-500' />
              Personal Information
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  First Name
                </label>
                <input
                  type='text'
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-0 focus:ring-2 focus:ring-primary'
                  value={editForm?.firstName || ''}
                  onChange={(e) => setEditForm((p) => ({ ...(p || {}), firstName: e.target.value }))}
                  placeholder='Enter first name'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Last Name
                </label>
                <input
                  type='text'
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-0 focus:ring-2 focus:ring-primary'
                  value={editForm?.lastName || ''}
                  onChange={(e) => setEditForm((p) => ({ ...(p || {}), lastName: e.target.value }))}
                  placeholder='Enter last name'
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className='mb-6'>
            <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
              <Mail className='h-4 w-4 text-gray-500' />
              Contact Details
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    type='email'
                    className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-0 focus:ring-2 focus:ring-primary'
                    value={editForm?.email || ''}
                    onChange={(e) => setEditForm((p) => ({ ...(p || {}), email: e.target.value }))}
                    placeholder='email@example.com'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phone Number
                </label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    type='tel'
                    className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-0 focus:ring-2 focus:ring-primary'
                    value={editForm?.phone || ''}
                    onChange={(e) => setEditForm((p) => ({ ...(p || {}), phone: e.target.value }))}
                    placeholder='+1 (555) 000-0000'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
            
            <button
              type='button'
              onClick={onSave}
              disabled={updating}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#d4af37] hover:bg-[#c19b2f] transition-all flex items-center gap-2 ${updating ? 'opacity-60 cursor-not-allowed' : ''
                }`}
            >
              {updating ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  {t('common.saving') || 'Saving...'}
                </>
              ) : (
                <>
                  <Save className='h-4 w-4' />
                  {t('common.save') || 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
