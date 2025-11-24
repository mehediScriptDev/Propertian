'use client';

import Modal from '@/components/Modal';

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('dashboard.admin.users.actions.edit') || 'Edit User'}
      maxWidth='max-w-xl'
      footer={
        <div className='flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800'
          >
            {t('common.cancel') || 'Cancel'}
          </button>
          <button
            type='button'
            onClick={onSave}
            disabled={updating}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90 ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {updating ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save')}
          </button>
        </div>
      }
    >
      <form onSubmit={onSave} className='space-y-4'>
        {updateError && <div className='text-sm text-red-600'>{updateError}</div>}

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm md:text-base text-gray-600 mb-1'>First name</label>
            <input
              className='w-full px-3 py-2 border rounded-md text-sm md:text-base focus:ring-2 focus:ring-primary/30'
              value={editForm?.firstName || ''}
              onChange={(e) => setEditForm((p) => ({ ...(p || {}), firstName: e.target.value }))}
            />
          </div>
          <div>
            <label className='block text-sm md:text-base text-gray-600 mb-1'>Last name</label>
            <input
              className='w-full px-3 py-2 border rounded-md text-sm md:text-base focus:ring-2 focus:ring-primary/30'
              value={editForm?.lastName || ''}
              onChange={(e) => setEditForm((p) => ({ ...(p || {}), lastName: e.target.value }))}
            />
          </div>
          <div>
            <label className='block text-sm md:text-base text-gray-600 mb-1'>Email</label>
            <input
              className='w-full px-3 py-2 border rounded-md text-sm md:text-base focus:ring-2 focus:ring-primary/30'
              value={editForm?.email || ''}
              onChange={(e) => setEditForm((p) => ({ ...(p || {}), email: e.target.value }))}
              type='email'
            />
          </div>
          <div>
            <label className='block text-sm md:text-base text-gray-600 mb-1'>Phone</label>
            <input
              className='w-full px-3 py-2 border rounded-md text-sm md:text-base focus:ring-2 focus:ring-primary/30'
              value={editForm?.phone || ''}
              onChange={(e) => setEditForm((p) => ({ ...(p || {}), phone: e.target.value }))}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
