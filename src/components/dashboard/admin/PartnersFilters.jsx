'use client';

import { memo } from 'react';
import { ChevronDown, Search, UserPlus } from 'lucide-react';

const PartnersFilters = memo(
  ({
    searchTerm,
    verificationFilter,
    paymentFilter,
    onSearchChange,
    onVerificationChange,
    onPaymentChange,
    translations,
  }) => {
    return (
      <div className='rounded-lg bg-white p-4 sm:p-6 shadow-sm'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          {/* Search Input */}
         <div className='relative flex-1 min-w-[300px]'>
            <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder={translations.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-[#E6B325] focus:outline-none focus:ring-2 focus:ring-[#E6B325]/20 transition-shadow'
            />
          </div>

          {/* Filters and Add Button */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
            {/* Verification Filter */}
            <div className='relative w-full sm:w-auto'>
              <select
                value={verificationFilter}
                onChange={(e) => onVerificationChange(e.target.value)}
                className='w-full h-12 appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
              >
                <option value='all'>
                  {translations.filters.allVerification}
                </option>
                <option value='verified'>
                  {translations.verification.verified}
                </option>
                <option value='pending'>
                  {translations.verification.pending}
                </option>
                <option value='rejected'>
                  {translations.verification.rejected}
                </option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
            </div>
            {/* Payment Filter */}
            <div className='relative w-full sm:w-auto'>
              <select
                value={paymentFilter}
                onChange={(e) => onPaymentChange(e.target.value)}
                className='w-full h-12 appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
              >
                <option value='all'>{translations.filters.allPayment}</option>
                <option value='paid'>{translations.payment.paid}</option>
                <option value='unpaid'>{translations.payment.unpaid}</option>
                <option value='partial'>{translations.payment.partial}</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
            </div>

            {/* Add Partner Button */}
            <button className="inline-flex items-center justify-center w-full sm:w-auto rounded-md bg-accent px-5 py-3 text-base font-medium text-white cursor-pointer gap-2 mt-2 sm:mt-0">
              <UserPlus className='h-4 w-4' />
              <span>{translations.addPartner}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PartnersFilters.displayName = 'PartnersFilters';

export default PartnersFilters;
