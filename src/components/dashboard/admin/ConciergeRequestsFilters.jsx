'use client';

import { memo } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';

const ConciergeRequestsFilters = memo(
  ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
    translations,
  }) => {
    return (
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
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
                <option value='all'>{translations.filters.allStatus}</option>
                <option value='pending'>{translations.status.pending}</option>
                <option value='in-progress'>
                  {translations.status.inProgress}
                </option>
                <option value='completed'>{translations.status.completed}</option>
                <option value='cancelled'>{translations.status.cancelled}</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          {/* Priority Filter */}
          <div className='w-full sm:w-56'>
            <div className='relative'>
              <select
                value={priorityFilter}
                onChange={(e) => onPriorityChange(e.target.value)}
                className='h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-5 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
              >
                <option value='all'>{translations.filters.allPriority}</option>
                <option value='high'>{translations.priority.high}</option>
                <option value='medium'>{translations.priority.medium}</option>
                <option value='low'>{translations.priority.low}</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
            </div>
          </div>

          {/* Add Button */}
          {/* <button className="inline-flex items-center rounded-lg bg-[#d4af37] px-6 py-2 text-base font-medium text-white cursor-pointer w-full sm:w-auto justify-center gap-2 sm:ml-auto">
            <Plus className='h-4 w-4' />
            {translations.addRequest}
          </button> */}
        </div>
      </div>
    );
  }
);

ConciergeRequestsFilters.displayName = 'ConciergeRequestsFilters';

export default ConciergeRequestsFilters;

