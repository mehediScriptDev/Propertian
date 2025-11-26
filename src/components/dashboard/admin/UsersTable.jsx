'use client';

import { Eye, User2, X } from 'lucide-react';
import { useState } from 'react';

/**
 * UsersTable Component
 * Displays recent users with role badges and actions
 *
 * @param {Object} props
 * @param {string} props.title - Table title
 * @param {Array} props.users - User data array
 */
export default function UsersTable({ title, users = [] }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getRoleStyles = (role) => {
    const styles = {
      user: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      partner: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      agent: 'bg-green-500/10 text-green-600 border-green-500/20',
      super_admin: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    const key = typeof role === 'string' ? role.toLowerCase() : String(role);
    return styles[key] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  return (
    <>
      <div className='px-6 py-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-[800px]'>
          <thead className='bg-gray-100 text-gray-900'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Name
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Email
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Role
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Date Joined
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider opacity-90'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {users.length === 0 ? (
              <tr>
                <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>{user.name}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-700'>{user.email}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRoleStyles(
                        user.role
                      )}`}
                    >
                      {user.roleLabel}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    {user.dateJoined}
                  </td>
                  <td className='px-6 py-4 pl-12'>
                    <button
                      onClick={() => handleViewDetails(user)}
                      className='inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80'
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className='relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl'>
            {/* Header */}
            <div className='flex items-center justify-between border-b border-gray-200 px-6 py-5'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-[#d4af37]/10 rounded-lg'>
                  <User2 className='h-5 w-5 text-[#d4af37]' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900'>User Details</h3>
              </div>

              <button
                onClick={handleCloseModal}
                className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Content */}
            <div className='px-6 py-6 space-y-6'>
              {/* Details Grid */}
              <div className='grid grid-cols-2 gap-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    Full Name
                  </div>
                  <div className='text-lg font-semibold text-gray-900'>{selectedUser.name}</div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    Email
                  </div>
                  <div className='text-lg font-semibold text-gray-900'>{selectedUser.email}</div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    Role
                  </div>
                  <div className='text-lg font-semibold text-gray-900'>
                    {selectedUser.roleLabel}
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
                    Date Joined
                  </div>
                  <div className='text-lg font-semibold text-gray-900'>
                    {selectedUser.dateJoined}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            {/* <div className='flex justify-end gap-3 border-t border-gray-200 px-6 py-4'>
              <button
                onClick={handleCloseModal}
                className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
