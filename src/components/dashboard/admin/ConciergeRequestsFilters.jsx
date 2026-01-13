'use client';

import { memo } from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';

const ConciergeRequestsFilters = memo(
  ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    assignedFilter,
    onAssignedChange,
    dateRange,
    onDateRangeChange,
    translations,
  }) => {
    return (
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        {/* First Row - Search and Status */}
        <div className='flex flex-col sm:flex-row gap-4 sm:items-center mb-4'>
          {/* Search */}
          <div className='w-full sm:flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={translations.searchPlaceholder}
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent'
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className='w-full sm:w-56'>
            <div className='relative'>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
              >
                <option value='all'>All Status</option>
                <option value='pending'>Pending</option>
                <option value='assigned'>Assigned</option>
                <option value='in-progress'>In Progress</option>
                <option value='info-requested'>Info Requested</option>
                <option value='completed'>Completed</option>
                <option value='cancelled'>Cancelled</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
            </div>
          </div>
        </div>

        {/* Second Row - Assignment and Date Range */}
        <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
          {/* Assigned Filter */}
          <div className='w-full sm:w-56'>
            <div className='relative'>
              <select
                value={assignedFilter}
                onChange={(e) => onAssignedChange(e.target.value)}
                className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
              >
                <option value='all'>All Assigned</option>
                <option value='internal'>Internal</option>
                <option value='partner'>Partner</option>
                <option value='unassigned'>Unassigned</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          {/* Date Range Filter */}
          <div className='w-full sm:flex-1'>
            <div className='flex gap-2 items-center'> 
              <div className='relative flex-1'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='date'
                  value={dateRange?.startDate || ''}
                  onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent'
                />
              </div>
              <span className='text-gray-500'>-</span>
              <div className='relative flex-1'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='date'
                  value={dateRange?.endDate || ''}
                  onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConciergeRequestsFilters.displayName = 'ConciergeRequestsFilters';

export default ConciergeRequestsFilters;

