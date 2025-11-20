'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/i18n';
import UserFilters from '@/components/dashboard/admin/UserFilters';
import UsersTable from '@/components/dashboard/admin/UsersTable';
import Pagination from '@/components/dashboard/Pagination';
import Modal from '@/components/Modal';
import api from '@/lib/api';

export default function AdminUsersPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const itemsPerPage = 8;

  // Server state
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: itemsPerPage,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // Fetch users from backend when filters/page change
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchTerm) params.search = searchTerm;
      if (roleFilter && roleFilter !== 'all') params.role = roleFilter;

      if (statusFilter && statusFilter !== 'all') {
        if (statusFilter === 'active') params.isActive = true;
        else if (statusFilter === 'inactive') params.isActive = false;
        else params.status = statusFilter; // suspended, pending
      }

      const res = await api.get('/users', { params });

      // res expected: { success: true, data: { users: [], pagination: {} } }
      const payload = res?.data || res;
      if (payload) {
        setUsers(payload.users || []);
        setPagination((prev) => ({ ...prev, ...(payload.pagination || {}) }));
      } else {
        setUsers([]);
        setPagination({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage });
      }
    } catch (err) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, roleFilter, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 when filters change
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleRoleChange = useCallback((value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  
  function handleActionClick(action, user) {
    if (action === 'view') {
      setSelectedUser(user);
      setShowUserModal(true);
      return;
    }

    if (action === 'edit') {
      // open edit modal
      openEditModal(user);
      return;
    }

    // other actions: suspend/activate/delete — keep logging for now
    console.log(`Action: ${action} on user:`, user);
  }

  
  function openEditModal(user) {
    if (!user) return;
    setSelectedUser(user);
    // prepare editable form fields
    setEditForm({
      firstName: user.firstName || user.name || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || user.roleLabel || '',
      isActive: typeof user.isActive === 'boolean' ? user.isActive : undefined,
      isVerified: typeof user.isVerified === 'boolean' ? user.isVerified : undefined,
    });
    setUpdateError(null);
    setShowEditModal(true);
  }

  const handleUpdateUser = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!selectedUser) return;
      setUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(null);
      try {
        const userId = selectedUser.id ?? selectedUser.userId ?? selectedUser.user_id;
        if (!userId) throw new Error('Missing user id');

        // Build a minimal payload - only allowed editable fields
        const payload = {};
        if (editForm?.firstName) payload.firstName = editForm.firstName;
        if (editForm?.lastName) payload.lastName = editForm.lastName;
        if (editForm?.email) payload.email = editForm.email;
        if (editForm?.phone) payload.phone = editForm.phone;
        if (editForm?.role) payload.role = editForm.role;

        // send PUT request to /users/:userId
        await api.put(`/users/${userId}`, payload);

        setUpdateSuccess(t('common.save') || 'Saved');
        setShowEditModal(false);
        // refresh list
        fetchUsers();
      } catch (err) {
        setUpdateError(err?.message || 'Failed to update user');
      } finally {
        setUpdating(false);
      }
    },
    [selectedUser, editForm, fetchUsers, t]
  );

  // Translations for child components
  const userTranslations = useMemo(() => {
    return {
      filters: {
        status: t('dashboard.admin.users.filters.status'),
        statusAll: t('dashboard.admin.users.filters.statusAll'),
        role: t('dashboard.admin.users.filters.role'),
        roleAll: t('dashboard.admin.users.filters.roleAll'),
        lastActivity: t('dashboard.admin.users.filters.lastActivity'),
        last: t('dashboard.admin.users.filters.last'),
        days: t('dashboard.admin.users.filters.days'),
      },
      table: {
        userId: t('dashboard.admin.users.table.userId'),
        name: t('dashboard.admin.users.table.name'),
        email: t('dashboard.admin.users.table.email'),
        role: t('dashboard.admin.users.table.role'),
        registrationDate: t('dashboard.admin.users.table.registrationDate'),
        status: t('dashboard.admin.users.table.status'),
        actions: t('dashboard.admin.users.table.actions'),
      },
      roles: {
        buyer: t('dashboard.admin.users.roles.buyer'),
        developer: t('dashboard.admin.users.roles.developer'),
        concierge: t('dashboard.admin.users.roles.concierge'),
        admin: t('dashboard.admin.users.roles.admin'),
        partner: t('dashboard.admin.users.roles.partner'),
        agent: t('dashboard.admin.users.roles.agent'),
      },
      statuses: {
        active: t('dashboard.admin.users.statuses.active'),
        inactive: t('dashboard.admin.users.statuses.inactive'),
        suspended: t('dashboard.admin.users.statuses.suspended'),
        pending: t('dashboard.admin.users.statuses.pending'),
      },
      actions: {
        view: t('dashboard.admin.users.actions.view'),
        edit: t('dashboard.admin.users.actions.edit'),
        suspend: t('dashboard.admin.users.actions.suspend'),
        activate: t('dashboard.admin.users.actions.activate'),
        delete: t('dashboard.admin.users.actions.delete'),
      },
    };
  }, [t]);

  // Pagination translations
  const paginationTranslations = useMemo(
    () => ({
      previous: t('common.previous'),
      next: t('common.next'),
      showing: t('common.showing'),
      to: t('common.to'),
      of: t('common.of'),
      results: t('common.results'),
    }),
    [t]
  );

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
            {t('dashboard.admin.users.title')}
          </h1>
        </div>
        <button className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-md active:scale-95'>
          <Plus className='h-4 w-4' />
          {t('dashboard.admin.users.addUser')}
        </button>
      </div>

      {/* Filters */}
      <UserFilters
        searchPlaceholder={t('dashboard.admin.users.searchPlaceholder')}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
        translations={userTranslations}
      />

      {/* Users Table with Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        {error && (
          <div className='p-4 text-sm text-red-600'>
            {t('common.error')}: {error}
          </div>
        )}

        <UsersTable users={users} translations={userTranslations} onActionClick={handleActionClick} />

        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title={
            selectedUser
              ? `${selectedUser.firstName || selectedUser.name || ''} ${
                  selectedUser.lastName || ''
                }`.trim()
              : t('dashboard.admin.users.details')
          }
          maxWidth='max-w-xl'
          footer={
            <div className='flex items-center justify-end gap-3'>
              <button
                onClick={() => setShowUserModal(false)}
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
                  <div className='text-lg md:text-xl font-semibold'>{selectedUser.firstName || selectedUser.name || '-' } {selectedUser.lastName || ''}</div>
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

        {/* Edit User Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          // title={
          //   selectedUser
          //     ? `${t('dashboard.admin.users.actions.edit') || userTranslations.actions.edit} — ${selectedUser.firstName || selectedUser.name || ''}`
          //     : t('dashboard.admin.users.actions.edit') || userTranslations.actions.edit
          // }
          maxWidth='max-w-xl'
          footer={
            <div className='flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={() => setShowEditModal(false)}
                className='px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800'
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type='button'
                onClick={handleUpdateUser}
                disabled={updating}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90 ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {updating ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save')}
              </button>
            </div>
          }
        >
          <form onSubmit={handleUpdateUser} className='space-y-4'>
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
              {/* <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Role</label>
                <select
                  className='w-full px-3 py-2 border border-gray-200 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30'
                  value={editForm?.role || ''}
                  onChange={(e) => setEditForm((p) => ({ ...(p || {}), role: e.target.value }))}
                >
                  <option value='USER'>{t('dashboard.admin.users.roles.user') || 'User'}</option>
                  <option value='PARTNER'>{userTranslations.roles.partner}</option>
                </select>
                <p className='mt-1 text-xs text-gray-400'>Only User or Partner roles are allowed here.</p>
              </div> */}
              {/* Active / Verified checkboxes intentionally hidden per design */}
            </div>
          </form>
        </Modal>

        {pagination && pagination.totalItems > 0 && (
          <Pagination
            currentPage={pagination.currentPage || currentPage}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.totalItems || 0}
            itemsPerPage={pagination.itemsPerPage || itemsPerPage}
            onPageChange={handlePageChange}
            translations={paginationTranslations}
          />
        )}
      </div>
    </div>
  );
}
