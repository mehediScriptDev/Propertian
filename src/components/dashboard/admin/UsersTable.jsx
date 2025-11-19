'use client';

import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

/**
 * UsersTable Component
 * Displays user data with status badges, role badges, and actions menu
 *
 * @param {Object} props
 * @param {Array} props.users - User data array
 * @param {Object} props.translations - i18n translations
 * @param {Function} props.onActionClick - Action handler
 */
export default function UsersTable({
  users = [],
  translations,
  onActionClick,
}) {
  const [activeMenu, setActiveMenu] = useState(null);

  const getStatusStyles = (status) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-200',
      inactive: 'bg-gray-50 text-gray-700 border-gray-200',
      suspended: 'bg-red-50 text-red-700 border-red-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };
    if (!status && status !== false) return styles.active;
    const key = typeof status === 'string' ? status.toLowerCase() : String(status);
    return styles[key] || styles.active;
  };

  const getStatusDot = (status) => {
    const colors = {
      active: 'bg-green-500',
      inactive: 'bg-gray-400',
      suspended: 'bg-red-500',
      pending: 'bg-yellow-500',
    };
    if (!status && status !== false) return colors.active;
    const key = typeof status === 'string' ? status.toLowerCase() : String(status);
    return colors[key] || colors.active;
  };

  const toggleMenu = (userId) => {
    setActiveMenu(activeMenu === userId ? null : userId);
  };

  // Normalize incoming user objects (support both API raw users and already-mapped rows)
  const displayUsers = users.map((u) => {
    // if it's already in the display shape, return as-is
    if (u.userId && (u.name || u.firstName)) return u;

    const status = u.status
      ? u.status
      : typeof u.isActive === 'boolean'
      ? u.isActive
        ? 'active'
        : 'inactive'
      : u.status || 'inactive';

    return {
      id: u.id || u.userId,
      userId: u.userId || u.id,
      name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      email: u.email,
      role: u.role || u.roleName,
      roleLabel:
        (translations && translations.roles && translations.roles[u.role]) ||
        u.role ||
        u.roleLabel ||
        '',
      registrationDate: u.registrationDate || u.createdAt || u.created_at || '-',
      status: status,
      statusLabel:
        (translations && translations.statuses && translations.statuses[status]) ||
        (status === 'active' || status === true ? 'Active' : 'Inactive'),
      _raw: u,
    };
  });

  return (
    <div className='overflow-hidden'>
      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[1000px]'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                {translations.table.userId}
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                {translations.table.name}
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                {translations.table.email}
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                {translations.table.role}
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                {translations.table.registrationDate}
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                {translations.table.status}
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                {translations.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 bg-white'>
            {displayUsers.map((user) => (
              <tr key={user.id} className='transition-colors hover:bg-gray-50'>
                {/* User ID */}
                <td className='px-6 py-4'>
                  <p className='text-sm font-medium text-gray-900'>
                    {user.userId}
                  </p>
                </td>

                {/* Name */}
                <td className='px-6 py-4'>
                  <p className='text-sm font-semibold text-gray-900'>
                    {user.name}
                  </p>
                </td>

                {/* Email */}
                <td className='px-6 py-4'>
                  <p className='text-sm text-gray-600'>{user.email}</p>
                </td>

                {/* Role */}
                <td className='px-6 py-4'>
                  <span className='text-sm font-medium text-gray-700'>
                    {user.roleLabel}
                  </span>
                </td>

                {/* Registration Date */}
                <td className='px-6 py-4'>
                  <p className='text-sm text-gray-600'>
                    {user.registrationDate}
                  </p>
                </td>

                {/* Status */}
                <td className='px-6 py-4'>
                  <span
                    className={`
                      inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium
                      ${getStatusStyles(user.status)}
                    `}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusDot(
                        user.status
                      )}`}
                    />
                    {user.statusLabel}
                  </span>
                </td>

                {/* Actions */}
                <td className='px-6 py-4'>
                  <div className='relative'>
                    <button
                      onClick={() => toggleMenu(user.id || user.userId)}
                      className='
                        flex h-8 w-8 items-center justify-center rounded-lg
                        text-gray-400 transition-colors
                        hover:bg-gray-100 hover:text-gray-600
                      '
                      aria-label='Actions menu'
                    >
                      <MoreVertical className='h-5 w-5' />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenu === user.id && (
                      <>
                        {/* Backdrop */}
                        <div
                          className='fixed inset-0 z-10'
                          onClick={() => setActiveMenu(null)}
                        />

                        {/* Menu */}
                        <div className='absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg'>
                          <button
                            onClick={() => {
                              onActionClick?.('view', user._raw || user);
                              setActiveMenu(null);
                            }}
                            className='w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50'
                          >
                            {translations.actions.view}
                          </button>
                          <button
                            onClick={() => {
                              onActionClick?.('edit', user._raw || user);
                              setActiveMenu(null);
                            }}
                            className='w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50'
                          >
                            {translations.actions.edit}
                          </button>
                          <button
                            onClick={() => {
                              onActionClick?.(
                                (user.status === 'active' || user.status === true) ? 'suspend' : 'activate',
                                user._raw || user
                              );
                              setActiveMenu(null);
                            }}
                            className='w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50'
                          >
                            {user.status === 'active' || user.status === true
                              ? translations.actions.suspend
                              : translations.actions.activate}
                          </button>
                          <button
                            onClick={() => {
                              onActionClick?.('delete', user._raw || user);
                              setActiveMenu(null);
                            }}
                            className='w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50'
                          >
                            {translations.actions.delete}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className='py-12 text-center'>
          <p className='text-gray-500'>No users found</p>
        </div>
      )}
    </div>
  );
}
