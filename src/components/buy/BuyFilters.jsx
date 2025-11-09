'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import { useState } from 'react';

/**
 * BuyFilters Component
 * Provides filtering functionality for buy properties
 * Mobile-responsive with modal on small screens, inline on large screens
 *
 * @param {Function} onFilterChange - Callback when filters are applied
 * @param {Object} initialFilters - Initial filter values
 */
export default function BuyFilters({ onFilterChange, initialFilters = {} }) {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const [filters, setFilters] = useState({
    city: initialFilters.city || 'abidjan',
    bedrooms: initialFilters.bedrooms || 'any',
    propertyType: initialFilters.propertyType || 'any',
    verifiedOnly: initialFilters.verifiedOnly ?? true,
  });

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className='p-4 rounded-xl bg-white dark:bg-card-dark shadow-sm border border-gray-200 dark:border-border-dark'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* City */}
        <div className='flex flex-col'>
          <label
            htmlFor='city'
            className='text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1'
          >
            {t('buy.filters.cityLabel', 'City')}
          </label>
          <select
            id='city'
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className='w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-[#FFFFF0] dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none cursor-pointer'
          >
            <option value='abidjan'>Abidjan</option>
            <option value='assinie'>Assinie-Mafia</option>
            <option value='yamoussoukro'>Yamoussoukro</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div className='flex flex-col'>
          <label
            htmlFor='bedrooms'
            className='text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1'
          >
            {t('buy.filters.bedroomsLabel', 'Bedrooms')}
          </label>
          <select
            id='bedrooms'
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            className='w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-[#FFFFF0] dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none cursor-pointer'
          >
            <option value='any'>{t('buy.filters.any', 'Any')}</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5+'>5+</option>
          </select>
        </div>

        {/* Property Type */}
        <div className='flex flex-col'>
          <label
            htmlFor='propertyType'
            className='text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1'
          >
            {t('buy.filters.propertyTypeLabel', 'Type')}
          </label>
          <select
            id='propertyType'
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className='w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-[#FFFFF0] dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none cursor-pointer'
          >
            <option value='any'>{t('buy.filters.any', 'Any')}</option>
            <option value='villa'>{t('buy.propertyTypes.villa', 'Villa')}</option>
            <option value='house'>{t('buy.propertyTypes.house', 'House')}</option>
            <option value='apartment'>{t('buy.propertyTypes.apartment', 'Apartment')}</option>
          </select>
        </div>

        {/* Verified Only Toggle */}
        <div className='flex flex-col justify-end'>
          <label className='flex items-center gap-2 cursor-pointer h-10'>
            <input
              type='checkbox'
              checked={filters.verifiedOnly}
              onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
              className='w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer'
            />
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {t('buy.filters.verifiedOnly', 'Verified Only')}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
