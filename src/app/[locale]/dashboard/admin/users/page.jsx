'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, Users, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';
import StatsCard from '@/components/dashboard/admin/StatsCard';
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
  const [lastActivityFilter, setLastActivityFilter] = useState('all');
  const itemsPerPage = 6;

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

  // State for all users (unfiltered)
  const [allUsers, setAllUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);

  // Fetch users from backend when page changes (without search/filter params)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: 1,
        limit: 1000, // Get all users for frontend filtering
      };

      const res = await api.get('/users', { params });

      // Fetch user stats
      try {
        const statsRes = await api.get('/users/stats');
        if (statsRes?.data) {
          setUserStats(statsRes.data);
        }
      } catch (statsErr) {
        console.error('Error fetching user stats:', statsErr);
      }

      // res expected: { success: true, data: { users: [], pagination: {} } }
      const payload = res?.data || res;
      if (payload) {
        // Map API data to table format
        const mappedUsers = (payload.users || []).map(user => ({
          ...user,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          roleLabel: user.role === 'USER' ? 'User'
            : user.role === 'PARTNER' ? 'Partner'
              : user.role === 'AGENT' ? 'Agent'
                : user.role === 'SUPER_ADMIN' ? 'Super Admin'
                  : user.role || 'User',
          dateJoined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
        }));
        setAllUsers(mappedUsers);
      } else {
        setAllUsers([]);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Frontend filtering and pagination
  const filteredAndPaginatedUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(user => {
        const id = user.id?.toString().toLowerCase() || '';
        const name = user.name?.toLowerCase() || '';
        const email = user.email?.toLowerCase() || '';
        const firstName = user.firstName?.toLowerCase() || '';
        const lastName = user.lastName?.toLowerCase() || '';
        return id.includes(search) || name.includes(search) || email.includes(search) ||
          firstName.includes(search) || lastName.includes(search);
      });
    }

    // Apply role filter
    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.isActive === true);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => user.isActive === false);
      } else {
        filtered = filtered.filter(user => user.status === statusFilter);
      }
    }

    // Apply last activity filter
    if (lastActivityFilter && lastActivityFilter !== 'all') {
      const days = parseInt(lastActivityFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      filtered = filtered.filter(user => {
        if (user.lastLoginAt) {
          const lastLogin = new Date(user.lastLoginAt);
          return lastLogin >= cutoffDate;
        }
        return false;
      });
    }

    // Calculate pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);

    // Update pagination state
    setPagination({
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
    });

    return paginatedData;
  }, [allUsers, searchTerm, roleFilter, statusFilter, lastActivityFilter, currentPage, itemsPerPage]);

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

  const handleLastActivityChange = useCallback((value) => {
    setLastActivityFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // User stats cards
  const userStatsCards = useMemo(() => {
    if (!userStats) return [];

    return [
      {
        title: 'Total Users',
        value: userStats.totalUsers || 0,
        icon: Users,
        variant: 'primary',
      },
      {
        title: 'Active Users',
        value: userStats.activeUsers || 0,
        icon: UserCheck,
        variant: 'success',
      },
      {
        title: 'Verified Users',
        value: userStats.verifiedUsers || 0,
        icon: ShieldCheck,
        variant: 'info',
      },
      // {
      //   title: 'Inactive Users',
      //   value: userStats.inactiveUsers || 0,
      //   icon: UserX,
      //   variant: 'warning',
      // },
      {
        title: 'Unverified Users',
        value: userStats.unverifiedUsers || 0,
        icon: Users,
        variant: 'warning',
      },
    ];
  }, [userStats]);


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
          <h1 className='text-4xl font-bold text-gray-900 '>
            {t('dashboard.admin.users.title')}
          </h1>
        </div>
        {/* <button
          onClick={() => {
            setCreateForm({ firstName: '', lastName: '', email: '', phone: '', password: '' });
            setCreateError(null);
            setShowAddModal(true);
          }}
          className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-md active:scale-95'
        >
          <Plus className='h-4 w-4' />
          {t('dashboard.admin.users.addUser')}
        </button> */}
      </div>

      {/* User Stats Cards */}
      {userStatsCards.length > 0 && (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {userStatsCards.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              variant={stat.variant}
            />
          ))}
        </div>
      )}

      {/* Filters */}
      <UserFilters
        searchPlaceholder={t('dashboard.admin.users.searchPlaceholder')}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
        onLastActivityChange={handleLastActivityChange}
        translations={userTranslations}
      />

      {/* Users Table with Pagination */}
      <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
        {error && (
          <div className='p-4 text-sm text-red-600'>
            {t('common.error')}: {error}
          </div>
        )}

        <UsersTable users={filteredAndPaginatedUsers} title='All Users' translations={userTranslations} onActionClick={handleActionClick} loading={loading} />

        <ViewUserModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          selectedUser={selectedUser}
          t={t}
          userTranslations={userTranslations}
        />

        {/* <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateUser}
          createForm={createForm}
          setCreateForm={setCreateForm}
          creating={creating}
          createError={createError}
          t={t}
        /> */}

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
