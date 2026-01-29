'use client';

import { X, User, Eye, Phone, Mail, Shield, Calendar, Clock, Building2, MessageSquare, Heart } from 'lucide-react';
import { useEffect } from 'react';

export default function ViewUserModal({ isOpen, onClose, selectedUser, t, userTranslations }) {
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
        className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {selectedUser ? (
          <>
            {/* Header */}
            <div className='sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-gray-200 '>
              <div className='flex items-center gap-4'>
                <div className='flex items-center justify-center h-12  w-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#c19b2f] text-white text-2xl font-bold shadow-lg'>
                  {(selectedUser.firstName || selectedUser.name || '?')
                    .toString()
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    {selectedUser.firstName || selectedUser.name || '-'} {selectedUser.lastName || ''}
                  </h2>
                  <p className='text-sm text-gray-600 flex items-center gap-2 mt-1'>
                    <Mail className='h-4 w-4' />
                    {selectedUser.email}
                  </p>
                </div>
                {/* <div className='ml-auto flex items-center gap-2'>
                  <span className='px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200'>
                    {selectedUser.role || selectedUser.roleLabel || '-'}
                  </span>
                  <span className='px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200'>
                    {(() => {
                      const isAct = selectedUser?.isActive;
                      if (typeof isAct === 'boolean') return isAct ? userTranslations.statuses.active : userTranslations.statuses.inactive;
                      const st = (selectedUser?.status || '').toString().toLowerCase();
                      return (userTranslations.statuses && userTranslations.statuses[st]) || (selectedUser?.status ? selectedUser.status : '-');
                    })()}
                  </span>
                </div> */}
              </div>

              <button
                onClick={onClose}
                className='p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'
                aria-label='Close'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Body */}
            <div className='px-6 py-6'>
              {/* Contact Information */}
              <div className='mb-6'>
                <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                  <User className='h-4 w-4 text-gray-500' />
                  Contact Information
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                    <div className='flex items-center gap-2 text-xs font-medium text-gray-600 mb-1'>
                      <Phone className='h-3.5 w-3.5' />
                      Phone
                    </div>
                    <div className='font-semibold text-gray-800'>{selectedUser.phone || '-'}</div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                    <div className='flex items-center gap-2 text-xs font-medium text-gray-600 mb-1'>
                      <Shield className='h-3.5 w-3.5' />
                      Verified Status
                    </div>
                    <div className='font-semibold text-gray-800'>{String(selectedUser.isVerified ?? '-')}</div>
                  </div>
                </div>
              </div>

              {/* Account Activity */}
              <div className='mb-6'>
                <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-gray-500' />
                  Account Activity
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                    <div className='flex items-center gap-2 text-xs font-medium text-gray-600 mb-1'>
                      <Clock className='h-3.5 w-3.5' />
                      Last Login
                    </div>
                    <div className='font-semibold text-gray-800 text-sm'>
                      {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : '-'}
                    </div>
                  </div>
                  <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                    <div className='flex items-center gap-2 text-xs font-medium text-gray-600 mb-1'>
                      <Calendar className='h-3.5 w-3.5' />
                      Account Created
                    </div>
                    <div className='font-semibold text-gray-800 text-sm'>
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Activity Statistics */}
              <div>
                <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                  <Eye className='h-4 w-4 text-gray-500' />
                  User Activity Statistics
                </h3>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='text-center p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
                    <Building2 className='h-6 w-6 text-gray-600 mx-auto mb-2' />
                    <div className='text-xs font-medium text-gray-600 mb-1'>Properties</div>
                    <div className='text-3xl font-bold text-gray-900'>
                      {selectedUser._count?.properties ?? selectedUser.properties ?? 0}
                    </div>
                  </div>
                  <div className='text-center p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
                    <MessageSquare className='h-6 w-6 text-gray-600 mx-auto mb-2' />
                    <div className='text-xs font-medium text-gray-600 mb-1'>Inquiries</div>
                    <div className='text-3xl font-bold text-gray-900'>
                      {selectedUser._count?.inquiries ?? selectedUser.inquiries ?? 0}
                    </div>
                  </div>
                  <div className='text-center p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
                    <Heart className='h-6 w-6 text-gray-600 mx-auto mb-2' />
                    <div className='text-xs font-medium text-gray-600 mb-1'>Favorites</div>
                    <div className='text-3xl font-bold text-gray-900'>
                      {selectedUser._count?.favorites ?? selectedUser.favorites ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='px-6 py-12 text-center'>
            <User className='h-12 w-12 text-gray-400 mx-auto mb-3' />
            <p className='text-sm text-gray-700'>No user selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
