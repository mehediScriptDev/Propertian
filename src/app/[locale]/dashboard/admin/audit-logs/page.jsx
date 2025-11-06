'use client';

import { use, useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import AuditLogsFilters from '@/components/dashboard/admin/AuditLogsFilters';
import AuditLogsTable from '@/components/dashboard/admin/AuditLogsTable';

// Generate deterministic mock audit logs
const generateAuditLogs = (count) => {
  const users = [
    'admin@qhomes.ci',
    'staff_member@qhomes.ci',
    'System',
    'agent@qhomes.ci',
    'another_agent@qhomes.ci',
  ];

  const actionTypes = [
    'propertyApproved',
    'userSuspended',
    'settingsChanged',
    'passwordReset',
    'propertyRejected',
    'userCreated',
    'loginSuccess',
    'loginFailed',
    'dataExported',
    'permissionChanged',
  ];

  const items = [
    'Property ID: 12345',
    'User: agent@qhomes.ci',
    'Payment Gateway',
    'User: another_agent@qhomes.ci',
    'Property ID: 67890',
    'User: client@qhomes.ci',
    'Export Report',
    'Admin Panel',
    'User Permissions',
    'Property ID: 45678',
  ];

  const baseDate = new Date('2023-10-27T14:30:15');

  return Array.from({ length: count }, (_, i) => {
    const dayOffset = Math.floor(i / 10);
    const hourOffset = i % 24;
    const minuteOffset = (i * 13) % 60;
    const secondOffset = (i * 7) % 60;

    const logDate = new Date(baseDate);
    logDate.setDate(logDate.getDate() - dayOffset);
    logDate.setHours(logDate.getHours() - hourOffset);
    logDate.setMinutes(minuteOffset);
    logDate.setSeconds(secondOffset);

    const year = logDate.getFullYear();
    const month = String(logDate.getMonth() + 1).padStart(2, '0');
    const day = String(logDate.getDate()).padStart(2, '0');
    const hours = String(logDate.getHours()).padStart(2, '0');
    const minutes = String(logDate.getMinutes()).padStart(2, '0');
    const seconds = String(logDate.getSeconds()).padStart(2, '0');

    const dateTime = `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
    const user = users[i % users.length];
    const actionType = actionTypes[i % actionTypes.length];
    const itemAffected = items[i % items.length];
    const ipAddress =
      user === 'System'
        ? 'N/A'
        : `${192 + (i % 4)}.${168 + (i % 2)}.${(i * 3) % 256}.${(i * 7) % 256}`;

    return {
      id: i + 1,
      dateTime,
      user,
      actionType,
      itemAffected,
      ipAddress,
    };
  });
};

export default function AuditLogs({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Memoized translations
  const auditLogsTranslations = useMemo(
    () => ({
      title: t('dashboard.admin.auditLogs.title'),
      exportCsv: t('dashboard.admin.auditLogs.exportCsv'),
      searchPlaceholder: t('dashboard.admin.auditLogs.searchPlaceholder'),
      dateRange: t('dashboard.admin.auditLogs.dateRange'),
      userActor: t('dashboard.admin.auditLogs.userActor'),
      actionType: t('dashboard.admin.auditLogs.actionType'),
      allDates: t('dashboard.admin.auditLogs.allDates'),
      allUsers: t('dashboard.admin.auditLogs.allUsers'),
      allActions: t('dashboard.admin.auditLogs.allActions'),
      last7Days: t('dashboard.admin.auditLogs.last7Days'),
      last30Days: t('dashboard.admin.auditLogs.last30Days'),
      last90Days: t('dashboard.admin.auditLogs.last90Days'),
      customRange: t('dashboard.admin.auditLogs.customRange'),
      table: {
        dateTime: t('dashboard.admin.auditLogs.table.dateTime'),
        userActor: t('dashboard.admin.auditLogs.table.userActor'),
        actionPerformed: t('dashboard.admin.auditLogs.table.actionPerformed'),
        itemAffected: t('dashboard.admin.auditLogs.table.itemAffected'),
        ipAddress: t('dashboard.admin.auditLogs.table.ipAddress'),
      },
      actions: {
        propertyApproved: t(
          'dashboard.admin.auditLogs.actions.propertyApproved'
        ),
        userSuspended: t('dashboard.admin.auditLogs.actions.userSuspended'),
        settingsChanged: t('dashboard.admin.auditLogs.actions.settingsChanged'),
        passwordReset: t('dashboard.admin.auditLogs.actions.passwordReset'),
        propertyRejected: t(
          'dashboard.admin.auditLogs.actions.propertyRejected'
        ),
        userCreated: t('dashboard.admin.auditLogs.actions.userCreated'),
        loginSuccess: t('dashboard.admin.auditLogs.actions.loginSuccess'),
        loginFailed: t('dashboard.admin.auditLogs.actions.loginFailed'),
        dataExported: t('dashboard.admin.auditLogs.actions.dataExported'),
        permissionChanged: t(
          'dashboard.admin.auditLogs.actions.permissionChanged'
        ),
      },
      pagination: {
        showing: t('dashboard.admin.auditLogs.pagination.showing'),
        to: t('dashboard.admin.auditLogs.pagination.to'),
        of: t('dashboard.admin.auditLogs.pagination.of'),
        results: t('dashboard.admin.auditLogs.pagination.results'),
      },
    }),
    [t]
  );

  // Generate 128 audit logs
  const allLogs = useMemo(() => generateAuditLogs(128), []);

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      const matchesSearch =
        !searchQuery ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.itemAffected.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUser =
        userFilter === 'all' ||
        (userFilter === 'admin' && log.user.includes('admin')) ||
        (userFilter === 'staff' && log.user.includes('staff')) ||
        (userFilter === 'system' && log.user === 'System');

      const matchesAction =
        actionFilter === 'all' ||
        (actionFilter === 'property' &&
          (log.actionType.includes('property') ||
            log.actionType.includes('Property'))) ||
        (actionFilter === 'user' &&
          (log.actionType.includes('user') ||
            log.actionType.includes('User') ||
            log.actionType.includes('login') ||
            log.actionType.includes('permission'))) ||
        (actionFilter === 'settings' && log.actionType.includes('settings')) ||
        (actionFilter === 'security' &&
          (log.actionType.includes('password') ||
            log.actionType.includes('login')));

      return matchesSearch && matchesUser && matchesAction;
    });
  }, [allLogs, searchQuery, userFilter, actionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Handlers
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleExportCsv = useCallback(() => {
    console.log('Exporting CSV with', filteredLogs.length, 'logs');
  }, [filteredLogs.length]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((value) => {
    setDateRange(value);
    setCurrentPage(1);
  }, []);

  const handleUserFilterChange = useCallback((value) => {
    setUserFilter(value);
    setCurrentPage(1);
  }, []);

  const handleActionFilterChange = useCallback((value) => {
    setActionFilter(value);
    setCurrentPage(1);
  }, []);

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          {auditLogsTranslations.title}
        </h1>
        <button
          onClick={handleExportCsv}
          type='button'
          className='w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition-colors duration-200'
        >
          <Download size={18} />
          <span>{auditLogsTranslations.exportCsv}</span>
        </button>
      </div>

      {/* Filters */}
      <AuditLogsFilters
        searchQuery={searchQuery}
        dateRange={dateRange}
        userFilter={userFilter}
        actionFilter={actionFilter}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        onUserFilterChange={handleUserFilterChange}
        onActionFilterChange={handleActionFilterChange}
        translations={auditLogsTranslations}
      />

      {/* Audit Logs Table */}
      <AuditLogsTable logs={currentLogs} translations={auditLogsTranslations} />

      {/* Pagination */}
      <div className='bg-white border border-gray-200 rounded-lg'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4'>
          {/* Results Info */}
          <p className='text-xs sm:text-sm text-gray-700 text-center sm:text-left'>
            {auditLogsTranslations.pagination.showing}{' '}
            <span className='font-medium'>{startIndex + 1}</span>{' '}
            {auditLogsTranslations.pagination.to}{' '}
            <span className='font-medium'>
              {Math.min(endIndex, filteredLogs.length)}
            </span>{' '}
            {auditLogsTranslations.pagination.of}{' '}
            <span className='font-medium'>{filteredLogs.length}</span>{' '}
            {auditLogsTranslations.pagination.results}
          </p>

          {/* Pagination Controls */}
          <div className='flex items-center gap-1 sm:gap-2'>
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
                currentPage === 1
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
              }`}
              aria-label='Previous page'
            >
              <ChevronLeft size={16} className='sm:w-[18px] sm:h-[18px]' />
            </button>

            {/* Page Numbers */}
            <div className='flex items-center gap-1'>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                if (pageNumber < 1 || pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      currentPage === pageNumber
                        ? 'bg-[#d4af37] text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={
                      currentPage === pageNumber ? 'page' : undefined
                    }
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className='hidden sm:flex h-9 w-9 items-center justify-center text-gray-400 text-sm'>
                    ...
                  </span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className='hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all duration-200'
                    aria-label={`Page ${totalPages}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
                currentPage === totalPages
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
              }`}
              aria-label='Next page'
            >
              <ChevronRight size={16} className='sm:w-[18px] sm:h-[18px]' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
