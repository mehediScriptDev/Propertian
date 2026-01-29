// 'use client';

// import { use, useState, useMemo, useCallback, useEffect } from 'react';
// import { Plus, Users, UserCheck, UserX, ShieldCheck } from 'lucide-react';
// import { useTranslation } from '@/i18n';
// import StatsCard from '@/components/dashboard/admin/StatsCard';
// import UserFilters from '@/components/dashboard/admin/UserFilters';
// import UsersTable from '@/components/dashboard/admin/UsersTable';
// import Pagination from '@/components/dashboard/Pagination';
// import AddUserModal from '@/app/[locale]/dashboard/admin/users/components/Modals/AddUserModal';
// import EditUserModal from '@/app/[locale]/dashboard/admin/users/components/Modals/EditUserModal';
// import ViewUserModal from '@/app/[locale]/dashboard/admin/users/components/Modals/ViewUserModal';
// import api from '@/lib/api';

// export default function AdminUsersPage({ params }) {
//   const { locale } = use(params);
//   const { t } = useTranslation(locale);

//   // State management
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [roleFilter, setRoleFilter] = useState('all');
//   const [lastActivityFilter, setLastActivityFilter] = useState('all');
//   const itemsPerPage = 10;

//   // Server state
//   const [users, setUsers] = useState([]);
//   // Keep full user list for frontend filtering/pagination
//   const [allUsers, setAllUsers] = useState([]);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: itemsPerPage,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editForm, setEditForm] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [updateError, setUpdateError] = useState(null);
//   const [updateSuccess, setUpdateSuccess] = useState(null);
//   // Add user modal state
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
//   const [creating, setCreating] = useState(false);
//   const [createError, setCreateError] = useState(null);
//   const [createSuccess, setCreateSuccess] = useState(null);

//   const [userStats, setUserStats] = useState(null);

//   // Fetch all users once for frontend-side filtering/pagination
//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const params = {
//         page: 1,
//         limit: 1000, // fetch large set for frontend filtering
//       };

//       const res = await api.get('/users', { params });

//       // Fetch user stats (non-blocking)
//       try {
//         const statsRes = await api.get('/users/stats');
//         if (statsRes?.data) {
//           setUserStats(statsRes.data);
//         }
//       } catch (statsErr) {
//         console.error('Error fetching user stats:', statsErr);
//       }

//       const payload = res?.data || res;
//       const usersPayload = (payload && (payload.users || payload.data?.users)) || [];

//       const mappedUsers = (usersPayload || []).map(user => ({
//         ...user,
//         name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
//         roleLabel: user.role === 'USER' ? 'User'
//           : user.role === 'PARTNER' ? 'Partner'
//             : user.role === 'AGENT' ? 'Agent'
//               : user.role === 'SUPER_ADMIN' ? 'Super Admin'
//                 : user.role || 'User',
//         dateJoined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '',
//       }));

//       setAllUsers(mappedUsers);
//       setUsers(mappedUsers.slice(0, itemsPerPage));

//       // Set pagination based on total items fetched
//       setPagination(prev => ({
//         ...prev,
//         totalItems: mappedUsers.length,
//         totalPages: Math.max(1, Math.ceil(mappedUsers.length / itemsPerPage)),
//       }));
//     } catch (err) {
//       setError(err?.message || 'Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Client-side filtering/pagination: fetch all users once on mount
//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   // Reset to page 1 when filters change
//   const handleSearchChange = useCallback((value) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   }, []);

//   const handleStatusChange = useCallback((value) => {
//     setStatusFilter(value);
//     setCurrentPage(1);
//   }, []);

//   const handleRoleChange = useCallback((value) => {
//     setRoleFilter(value);
//     setCurrentPage(1);
//   }, []);

//   const handleLastActivityChange = useCallback((value) => {
//     setLastActivityFilter(value);
//     setCurrentPage(1);
//   }, []);

//   const handlePageChange = useCallback((page) => {
//     setCurrentPage(page);
//   }, []);

//   // Frontend filtering and pagination
//   const filteredAndPaginatedUsers = useMemo(() => {
//     let filtered = [...allUsers];

//     // Apply search filter: support searching by name and email.
//     if (searchTerm && searchTerm.trim()) {
//       const raw = searchTerm.trim();
//       const search = raw.toLowerCase();

//       // If user typed an email (contains @), prefer email match
//       if (raw.includes('@')) {
//         filtered = filtered.filter(user => {
//           const email = (user.email || '').toLowerCase();
//           return email.includes(search);
//         });
//       } else {
//         // Split into words and ensure name contains all terms OR email contains the whole search
//         const terms = search.split(/\s+/).filter(Boolean);
//         filtered = filtered.filter(user => {
//           const name = (user.name || `${user.firstName || ''} ${user.lastName || ''}`).toLowerCase();
//           const email = (user.email || '').toLowerCase();

//           const nameMatches = terms.every(term => name.includes(term));
//           const emailMatches = email.includes(search);

//           return nameMatches || emailMatches;
//         });
//       }
//     }

//     // Apply role filter
//     if (roleFilter && roleFilter !== 'all') {
//       filtered = filtered.filter(user => user.role === roleFilter);
//     }

//     // Apply status filter
//     if (statusFilter && statusFilter !== 'all') {
//       if (statusFilter === 'active') {
//         filtered = filtered.filter(user => user.isActive === true);
//       } else if (statusFilter === 'inactive') {
//         filtered = filtered.filter(user => user.isActive === false);
//       } else {
//         filtered = filtered.filter(user => user.status === statusFilter);
//       }
//     }

//     // Apply last activity filter
//     if (lastActivityFilter && lastActivityFilter !== 'all') {
//       const days = parseInt(lastActivityFilter);
//       const cutoffDate = new Date();
//       cutoffDate.setDate(cutoffDate.getDate() - days);

//       filtered = filtered.filter(user => {
//         if (user.lastLoginAt) {
//           const lastLogin = new Date(user.lastLoginAt);
//           return lastLogin >= cutoffDate;
//         }
//         return false;
//       });
//     }

//     // Calculate pagination
//     const totalItems = filtered.length;
//     const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const paginatedData = filtered.slice(startIndex, endIndex);

//     // Update pagination state
//     setPagination({
//       currentPage,
//       totalPages,
//       totalItems,
//       itemsPerPage,
//     });

//     return paginatedData;
//   }, [allUsers, searchTerm, roleFilter, statusFilter, lastActivityFilter, currentPage, itemsPerPage]);

//   // User stats cards
//   const userStatsCards = useMemo(() => {
//     if (!userStats) return [];

//     return [
//       {
//         title: 'Total Users',
//         value: userStats.totalUsers || 0,
//         icon: Users,
//         variant: 'primary',
//       },
//       {
//         title: 'Active Users',
//         value: userStats.activeUsers || 0,
//         icon: UserCheck,
//         variant: 'success',
//       },
//       {
//         title: 'Verified Users',
//         value: userStats.verifiedUsers || 0,
//         icon: ShieldCheck,
//         variant: 'info',
//       },

//       {
//         title: 'Unverified Users',
//         value: userStats.unverifiedUsers || 0,
//         icon: Users,
//         variant: 'warning',
//       },
//     ];
//   }, [userStats]);


//   function handleActionClick(action, user) {
//     if (action === 'view') {
//       setSelectedUser(user);
//       setShowUserModal(true);
//       return;
//     }

//     if (action === 'edit') {

//       openEditModal(user);
//       return;
//     }
//     console.log(`Action: ${action} on user:`, user);
//   }


//   function openEditModal(user) {
//     if (!user) return;
//     setSelectedUser(user);
//     // prepare editable form fields
//     setEditForm({
//       firstName: user.firstName || user.name || '',
//       lastName: user.lastName || '',
//       email: user.email || '',
//       phone: user.phone || '',
//       role: user.role || user.roleLabel || '',

//       isActive: typeof user.isActive === 'boolean' ? user.isActive : undefined,
//       isVerified: typeof user.isVerified === 'boolean' ? user.isVerified : undefined,
//     });
//     setUpdateError(null);
//     setShowEditModal(true);
//   }

// const handleUpdateUser = useCallback(
//   async (e) => {
//     if (e && e.preventDefault) e.preventDefault();
//     if (!selectedUser) return;

//     if (updating) return; 

//     setUpdating(true);
//     setUpdateError(null);
//     setUpdateSuccess(null);

//     try {
//       const userId =
//         selectedUser.id ??
//         selectedUser.userId ??
//         selectedUser.user_id;

//       if (!userId) throw new Error('Missing user id');

//       // ✅ Build clean payload
//       const payload = {};

//       if (editForm?.firstName !== undefined)
//         payload.firstName = editForm.firstName;

//       if (editForm?.lastName !== undefined)
//         payload.lastName = editForm.lastName;

//       if (editForm?.email !== undefined)
//         payload.email = editForm.email;

//       if (editForm?.phone !== undefined)
//         payload.phone = editForm.phone;

//       if (editForm?.role !== undefined)
//         payload.role = editForm.role;

//       if (typeof editForm?.isActive === 'boolean')
//         payload.isActive = editForm.isActive;

//       if (typeof editForm?.isVerified === 'boolean')
//         payload.isVerified = editForm.isVerified;

//       // 🚀 API call
//       const res = await api.put(`/users/${userId}`, payload);

//       // ✅ FIXED response extraction
//       const updatedUserRaw =
//         res?.data?.data?.user ||
//         res?.data?.user;

//       if (!updatedUserRaw) {
//         throw new Error('Invalid API response');
//       }

//       const updatedUser = {
//         ...updatedUserRaw,
//         name:
//           `${updatedUserRaw.firstName || ''} ${updatedUserRaw.lastName || ''}`.trim() ||
//           updatedUserRaw.email,
//         roleLabel:
//           updatedUserRaw.role === 'USER'
//             ? 'User'
//             : updatedUserRaw.role === 'PARTNER'
//             ? 'Partner'
//             : updatedUserRaw.role === 'AGENT'
//             ? 'Agent'
//             : updatedUserRaw.role === 'SUPER_ADMIN'
//             ? 'Super Admin'
//             : updatedUserRaw.role,
//         dateJoined: updatedUserRaw.createdAt
//           ? new Date(updatedUserRaw.createdAt).toISOString().split('T')[0]
//           : '',
//       };

//       // 🔄 Update local state
//       setAllUsers((prev) =>
//         prev.map((u) =>
//           (u.id ?? u.userId) === updatedUser.id
//             ? { ...u, ...updatedUser }
//             : u
//         )
//       );

//       setUpdateSuccess('Saved');
//       setShowEditModal(false);
//     } catch (err) {
//       const apiMessage =
//         err?.response?.data?.message ||
//         err?.message ||
//         'Failed to update user';

//       setUpdateError(apiMessage);
//     } finally {
//       setUpdating(false);
//     }
//   },
//   [selectedUser, editForm, updating]
// );



//   // Translations for child components
//   const userTranslations = useMemo(() => {
//     return {
//       filters: {
//         status: t('dashboard.admin.users.filters.status'),
//         statusAll: t('dashboard.admin.users.filters.statusAll'),
//         role: t('dashboard.admin.users.filters.role'),
//         roleAll: t('dashboard.admin.users.filters.roleAll'),
//         lastActivity: t('dashboard.admin.users.filters.lastActivity'),
//         last: t('dashboard.admin.users.filters.last'),
//         days: t('dashboard.admin.users.filters.days'),
//       },
//       table: {
//         userId: t('dashboard.admin.users.table.userId'),
//         name: t('dashboard.admin.users.table.name'),
//         email: t('dashboard.admin.users.table.email'),
//         role: t('dashboard.admin.users.table.role'),
//         registrationDate: t('dashboard.admin.users.table.registrationDate'),
//         status: t('dashboard.admin.users.table.status'),
//         actions: t('dashboard.admin.users.table.actions'),
//       },
//       roles: {
//         buyer: t('dashboard.admin.users.roles.buyer'),
//         developer: t('dashboard.admin.users.roles.developer'),
//         concierge: t('dashboard.admin.users.roles.concierge'),
//         admin: t('dashboard.admin.users.roles.admin'),
//         partner: t('dashboard.admin.users.roles.partner'),
//         agent: t('dashboard.admin.users.roles.agent'),
//       },
//       statuses: {
//         active: t('dashboard.admin.users.statuses.active'),
//         inactive: t('dashboard.admin.users.statuses.inactive'),
//         suspended: t('dashboard.admin.users.statuses.suspended'),
//         pending: t('dashboard.admin.users.statuses.pending'),
//       },
//       actions: {
//         view: t('dashboard.admin.users.actions.view'),
//         edit: t('dashboard.admin.users.actions.edit'),
//         suspend: t('dashboard.admin.users.actions.suspend'),
//         activate: t('dashboard.admin.users.actions.activate'),
//         delete: t('dashboard.admin.users.actions.delete'),
//       },
//     };
//   }, [t]);

//   // Pagination translations
//   const paginationTranslations = useMemo(
//     () => ({
//       previous: t('common.previous'),
//       next: t('common.next'),
//       showing: t('common.showing'),
//       to: t('common.to'),
//       of: t('common.of'),
//       results: t('common.results'),
//     }),
//     [t]
//   );

//   return (
//     <div className='space-y-6'>
//       {/* Page Header */}
//       <div className='flex flex-wrap items-center justify-between gap-4'>
//         <div>
//           <h1 className='text-4xl font-bold text-gray-900 '>
//             {t('dashboard.admin.users.title')}
//           </h1>
//         </div>
//       </div>

//       {/* User Stats Cards */}
//       {userStatsCards.length > 0 && (
//         <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
//           {userStatsCards.map((stat, index) => (
//             <StatsCard
//               key={index}
//               title={stat.title}
//               value={stat.value}
//               icon={stat.icon}
//               variant={stat.variant}
//             />
//           ))}
//         </div>
//       )}

//       {/* Filters */}
//       <UserFilters
//         searchPlaceholder={t('dashboard.admin.users.searchPlaceholder')}
//         onSearchChange={handleSearchChange}
//         onStatusChange={handleStatusChange}
//         onRoleChange={handleRoleChange}
//         onLastActivityChange={handleLastActivityChange}
//         translations={userTranslations}
//       />

//       {/* Users Table with Pagination */}
//       <div className='rounded-lg bg-white shadow-sm overflow-hidden'>
//         {error && (
//           <div className='p-4 text-sm text-red-600'>
//             {t('common.error')}: {error}
//           </div>
//         )}

//         <UsersTable users={filteredAndPaginatedUsers} title='All Users' translations={userTranslations} onActionClick={handleActionClick} loading={loading} />

//         <ViewUserModal
//           isOpen={showUserModal}
//           onClose={() => setShowUserModal(false)}
//           selectedUser={selectedUser}
//           t={t}
//           userTranslations={userTranslations}
//         />


//         <EditUserModal
//           isOpen={showEditModal}
//           onClose={() => setShowEditModal(false)}
//           onSave={handleUpdateUser}
//           editForm={editForm}
//           setEditForm={setEditForm}
//           updating={updating}
//           updateError={updateError}
//           t={t}
//           selectedUser={selectedUser}
//         />

//         {pagination && pagination.totalItems > 0 && (
//           <Pagination
//             currentPage={pagination.currentPage || currentPage}
//             totalPages={pagination.totalPages || 1}
//             totalItems={pagination.totalItems || 0}
//             itemsPerPage={pagination.itemsPerPage || itemsPerPage}
//             onPageChange={handlePageChange}
//             translations={paginationTranslations}
//           />
//         )}
//       </div>
//     </div>
//   );
// }









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
  const itemsPerPage = 10;

  // Server state
  const [users, setUsers] = useState([]);
  // Keep full user list for frontend filtering/pagination
  const [allUsers, setAllUsers] = useState([]);
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

  const [userStats, setUserStats] = useState(null);

  // Fetch all users once for frontend-side filtering/pagination
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: 1,
        limit: 1000, // fetch large set for frontend filtering
      };

      const res = await api.get('/users', { params });

      // Fetch user stats (non-blocking)
      try {
        const statsRes = await api.get('/users/stats');
        if (statsRes?.data) {
          setUserStats(statsRes.data);
        }
      } catch (statsErr) {
        console.error('Error fetching user stats:', statsErr);
      }

      const payload = res?.data || res;
      const usersPayload = (payload && (payload.users || payload.data?.users)) || [];

      const mappedUsers = (usersPayload || []).map(user => ({
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
      setUsers(mappedUsers.slice(0, itemsPerPage));

      // Set pagination based on total items fetched
      setPagination(prev => ({
        ...prev,
        totalItems: mappedUsers.length,
        totalPages: Math.max(1, Math.ceil(mappedUsers.length / itemsPerPage)),
      }));
    } catch (err) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Client-side filtering/pagination: fetch all users once on mount
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

  // Frontend filtering and pagination
  const filteredAndPaginatedUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Apply search filter: support searching by name and email.
    if (searchTerm && searchTerm.trim()) {
      const raw = searchTerm.trim();
      const search = raw.toLowerCase();

      // If user typed an email (contains @), prefer email match
      if (raw.includes('@')) {
        filtered = filtered.filter(user => {
          const email = (user.email || '').toLowerCase();
          return email.includes(search);
        });
      } else {
        // Split into words and ensure name contains all terms OR email contains the whole search
        const terms = search.split(/\s+/).filter(Boolean);
        filtered = filtered.filter(user => {
          const name = (user.name || `${user.firstName || ''} ${user.lastName || ''}`).toLowerCase();
          const email = (user.email || '').toLowerCase();

          const nameMatches = terms.every(term => name.includes(term));
          const emailMatches = email.includes(search);

          return nameMatches || emailMatches;
        });
      }
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
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
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
      openEditModal(user);
      return;
    }
    console.log(`Action: ${action} on user:`, user);
  }


  function openEditModal(user) {
    if (!user) return;
    setSelectedUser(user);
    // prepare editable form fields
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '', // Keep raw role value for API
      isActive: typeof user.isActive === 'boolean' ? user.isActive : undefined,
      isVerified: typeof user.isVerified === 'boolean' ? user.isVerified : undefined,
      avatar: user.avatar || ''
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

      // 1. Basic Frontend Validation
      if (!editForm.firstName?.trim()) {
        setUpdateError('First name is required');
        setUpdating(false);
        return;
      }
      if (!editForm.email?.trim()) {
        setUpdateError('Email is required');
        setUpdating(false);
        return;
      }

      try {
        const userId = selectedUser.id ?? selectedUser.userId ?? selectedUser.user_id;
        if (!userId) throw new Error('Missing user id');

        // 2. Build Payload (Explicitly include fields to avoid accidental omission)
        // Note: We use || '' to ensure we send empty string if field is empty, 
        // rather than omitting the key which might cause "Missing field" errors on strict backends.
        const payload = {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
          role: editForm.role,
        };

        // Add optional boolean flags if they exist in form state
        if (typeof editForm.isActive === 'boolean') payload.isActive = editForm.isActive;
        if (typeof editForm.isVerified === 'boolean') payload.isVerified = editForm.isVerified;

        // Add avatar only if it's a valid URL string
        if (editForm.avatar && typeof editForm.avatar === 'string' && editForm.avatar.trim().startsWith('http')) {
            payload.avatar = editForm.avatar.trim();
        }

        // send PUT request to /users/:userId
        const res = await api.put(`/users/${userId}`, payload);

        // Try to extract the updated user from response
        const updatedUserRaw = res?.data?.user || res?.user || res?.data || res;
        
        // Normalize the updated user
        const updatedUser = updatedUserRaw
          ? {
            ...updatedUserRaw,
            name: `${updatedUserRaw.firstName || ''} ${updatedUserRaw.lastName || ''}`.trim() || updatedUserRaw.email,
            roleLabel: updatedUserRaw.role === 'USER' ? 'User'
              : updatedUserRaw.role === 'PARTNER' ? 'Partner'
                : updatedUserRaw.role === 'AGENT' ? 'Agent'
                  : updatedUserRaw.role === 'SUPER_ADMIN' ? 'Super Admin'
                    : updatedUserRaw.role || 'User',
            dateJoined: updatedUserRaw.createdAt ? new Date(updatedUserRaw.createdAt).toISOString().split('T')[0] : '',
          }
          : null;

        // If we have an updated user object, replace it in local state
        if (updatedUser) {
          setAllUsers(prev => {
            const idx = (prev || []).findIndex(u => (u.id ?? u.userId ?? u.user_id) === (updatedUser.id ?? updatedUser.userId ?? updatedUser.user_id));
            if (idx === -1) {
              return [updatedUser, ...(prev || [])];
            }
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...updatedUser };
            return copy;
          });

          // Also update currently-visible `users` slice
          setUsers(prev => {
            const copy = (prev || []).map(u => ((u.id ?? u.userId ?? u.user_id) === (updatedUser.id ?? updatedUser.userId ?? updatedUser.user_id) ? { ...u, ...updatedUser } : u));
            return copy;
          });
        }

        setUpdateSuccess(t('common.save') || 'Saved');
        setShowEditModal(false);
      } catch (err) {
        // Prefer API validation message when available
        const apiMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message;
        setUpdateError(apiMessage || 'Failed to update user');
      } finally {
        setUpdating(false);
      }
    },
    [selectedUser, editForm, t]
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