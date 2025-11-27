'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const PropertiesFilters = memo(
  ({
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusChange,
    translations,
  }) => {
    const pathname = usePathname();
    const router = useRouter();

    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4 sm:p-6'>
        <div className='flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between'>
          {/* Search */}
          <div className='relative flex-1 min-w-[300px]'>
            <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder={translations.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-200 text-sm text-gray-900 placeholder-gray-400'
            />
          </div>

          {/* Filters and Action */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
            {/* Status Filter */}
            <div className='relative'>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className='px-4 py-2.5 pr-10 bg-white border appearance-none border-gray-300 rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-200 text-sm text-gray-900 cursor-pointer'
              >
                <option value='all'>{translations.allStatus}</option>
                <option value='available'>Available</option>
                <option value='pending'>{translations.status.pending}</option>
                <option value='inactive'>{translations.status.inactive}</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </div>

            {/* Add Property Button */}
            <button
              type='button'
              onClick={() => {
                const target = pathname.endsWith('/') ? `${pathname}add` : `${pathname}/add`;
                if (router && router.push) router.push(target);
                else window.location.href = target;
              }}
              className="inline-flex items-center rounded-md bg-accent  px-5 py-2 text-base font-medium text-white cursor-pointer "
            >
              {translations.addProperty}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PropertiesFilters.displayName = 'PropertiesFilters';

export default PropertiesFilters;
