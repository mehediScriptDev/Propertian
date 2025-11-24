'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/i18n';
import UserFilters from '@/components/dashboard/admin/UserFilters';
import UsersTable from '@/components/dashboard/admin/UsersTable';
import Pagination from '@/components/dashboard/Pagination';
import AddUserModal from '@/app/[locale]/dashboard/admin/users/components/Modals/AddUserModal';
import EditUserModal from '@/app/[locale]/dashboard/admin/users/components/Modals/EditUserModal';
import ViewUserModal from '@/app/[locale]/dashboard/admin/users/components/Modals/ViewUserModal';
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
  // Add user modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

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

  const handleCreateUser = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setCreating(true);
      setCreateError(null);
      setCreateSuccess(null);
      try {
        // Basic validation
        if (!createForm?.firstName || !createForm?.email || !createForm?.password) {
          throw new Error('First name, email and password are required');
        }

        // POST to auth register endpoint to create user (include password)
        await api.post('/auth/register', {
          firstName: createForm.firstName,
          lastName: createForm.lastName,
          email: createForm.email,
          phone: createForm.phone,
          password: createForm.password,
        });

        setCreateSuccess(t('common.created') || 'Created');
        setShowAddModal(false);
        // reset form
        setCreateForm({ firstName: '', lastName: '', email: '', phone: '', password: '' });
        // refresh list and go to first page
        setCurrentPage(1);
        fetchUsers();
      } catch (err) {
        setCreateError(err?.message || 'Failed to create user'); 
      } finally {
        setCreating(false);
      }
    },
    [createForm, fetchUsers, t]
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
        <button
          onClick={() => {
            setCreateForm({ firstName: '', lastName: '', email: '', phone: '', password: '' });
            setCreateError(null);
            setShowAddModal(true);
          }}
          className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-md active:scale-95'
        >
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

        <ViewUserModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          selectedUser={selectedUser}
          t={t}
          userTranslations={userTranslations}
        />

        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateUser}
          createForm={createForm}
          setCreateForm={setCreateForm}
          creating={creating}
          createError={createError}
          t={t}
        />

        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateUser}
          editForm={editForm}
          setEditForm={setEditForm}
          updating={updating}
          updateError={updateError}
          t={t}
          selectedUser={selectedUser}
        />

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
