'use client';

import Modal from '@/components/Modal';

export default function AddUserModal({
  isOpen,
  onClose,
  onCreate,
  createForm,
  setCreateForm,
  creating,
  createError,
  t,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('dashboard.admin.users.addUser') || 'Add User'}
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
            onClick={onCreate}
            disabled={creating}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90 ${creating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {creating ? (t('common.creating') || 'Creating...') : (t('dashboard.admin.users.addUser') || 'Add User')}
          </button>
        </div>
      }
    >
      <div className=''>
        <div className='mb-6 pb-4 border-b border-gray-200'>
          
            <div className='flex-1'>
              <h2 className='text-2xl md:text-3xl font-semibold text-gray-900 leading-tight'>Create New User</h2>
              <p className='mt-1 text-sm text-gray-500'>Enter user details below to create an account. Fields marked with <span className='text-red-500'>*</span> are required.</p>
            </div>
        </div>

        <form onSubmit={onCreate} className='space-y-4'>
          {createError && <div className='text-sm text-red-600'>{createError}</div>}

          <div className='grid grid-cols-1 gap-4'>
            <div>
              <label className='block text-sm md:text-base text-gray-600 mb-1'>First name <span className='text-red-500'>*</span></label>
              <input
                autoFocus
                placeholder='Enter first name'
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary'
                value={createForm.firstName}
                onChange={(e) => setCreateForm((p) => ({ ...(p || {}), firstName: e.target.value }))}
              />
            </div>
            <div>
              <label className='block text-sm md:text-base text-gray-600 mb-1'>Last name</label>
              <input
                placeholder='Enter last name'
                className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary'
                value={createForm.lastName}
                onChange={(e) => setCreateForm((p) => ({ ...(p || {}), lastName: e.target.value }))}
              />
            </div>
            <div>
              <label className='block text-sm md:text-base text-gray-600 mb-1'>Email <span className='text-red-500'>*</span></label>
              <input
                placeholder='name@domain.com'
                required
                type='email'
                className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary'
                value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...(p || {}), email: e.target.value }))}
              />
            </div>
            <div>
              <label className='block text-sm md:text-base text-gray-600 mb-1'>Phone</label>
              <input
                placeholder='+8801xxxxxxxxx'
                className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary'
                value={createForm.phone}
                onChange={(e) => setCreateForm((p) => ({ ...(p || {}), phone: e.target.value }))}
              />
            </div>
            <div>
              <label className='block text-sm md:text-base text-gray-600 mb-1'>Password <span className='text-red-500'>*</span></label>
              <input
                placeholder='Choose a strong password'
                required
                type='password'
                className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary'
                value={createForm.password}
                onChange={(e) => setCreateForm((p) => ({ ...(p || {}), password: e.target.value }))}
              />
              <p className='mt-1 text-xs text-gray-400'>Minimum 8 characters recommended.</p>
            </div>
            
          </div>
        </form>
      </div>
    </Modal>
  );
}
