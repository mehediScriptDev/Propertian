'use client';

import Modal from '@/components/Modal';

export default function ViewUserModal({ isOpen, onClose, selectedUser, t, userTranslations }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectedUser
          ? `${selectedUser.firstName || selectedUser.name || ''} ${selectedUser.lastName || ''}`.trim()
          : t('dashboard.admin.users.details')
      }
      maxWidth='max-w-xl'
      footer={
        <div className='flex items-center justify-end gap-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800'
          >
            {t('common.close') || 'Close'}
          </button>
        </div>
      }
    >
      {selectedUser ? (
        <div className='text-gray-900'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white text-2xl md:text-3xl font-semibold'>
              {(selectedUser.firstName || selectedUser.name || '?')
                .toString()
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className='text-lg md:text-xl font-semibold'>{selectedUser.firstName || selectedUser.name || '-'} {selectedUser.lastName || ''}</div>
              <div className='text-sm md:text-base text-gray-600'>{selectedUser.email}</div>
            </div>
            <div className='ml-auto flex items-center gap-2'>
              <span className='px-2 py-1 text-xs md:text-sm rounded-full bg-slate-100 text-slate-800 border border-slate-200'>
                {selectedUser.role || selectedUser.roleLabel || '-'}
              </span>
              <span className='px-2 py-1 text-xs md:text-sm rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200'>
                {(() => {
                  const isAct = selectedUser?.isActive;
                  if (typeof isAct === 'boolean') return isAct ? userTranslations.statuses.active : userTranslations.statuses.inactive;
                  const st = (selectedUser?.status || '').toString().toLowerCase();
                  return (userTranslations.statuses && userTranslations.statuses[st]) || (selectedUser?.status ? selectedUser.status : '-');
                })()}
              </span>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-2 gap-4 text-sm md:text-base'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='text-xs md:text-sm text-gray-500'>Phone</div>
              <div className='mt-1 font-medium text-gray-800'>{selectedUser.phone || '-'}</div>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='text-xs md:text-sm text-gray-500'>Verified</div>
              <div className='mt-1 font-medium text-gray-800'>{String(selectedUser.isVerified ?? '-')}</div>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='text-xs md:text-sm text-gray-500'>Last Login</div>
              <div className='mt-1 font-medium text-gray-800'>{selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : '-'}</div>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='text-xs md:text-sm text-gray-500'>Created</div>
              <div className='mt-1 font-medium text-gray-800'>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '-'}</div>
            </div>
          </div>

          {selectedUser._count && (
            <div className='mt-6 grid grid-cols-3 gap-4'>
              <div className='text-center p-3 bg-gray-50 rounded-lg'>
                <div className='text-xs md:text-sm text-gray-500'>Properties</div>
                <div className='mt-1 text-lg md:text-xl font-semibold text-gray-800'>{selectedUser._count.properties}</div>
              </div>
              <div className='text-center p-3 bg-gray-50 rounded-lg'>
                <div className='text-xs md:text-sm text-gray-500'>Inquiries</div>
                <div className='mt-1 text-lg md:text-xl font-semibold text-gray-800'>{selectedUser._count.inquiries}</div>
              </div>
              <div className='text-center p-3 bg-gray-50 rounded-lg'>
                <div className='text-xs md:text-sm text-gray-500'>Favorites</div>
                <div className='mt-1 text-lg md:text-xl font-semibold text-gray-800'>{selectedUser._count.favorites}</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='text-sm text-gray-700'>No user selected</div>
      )}
    </Modal>
  );
}
