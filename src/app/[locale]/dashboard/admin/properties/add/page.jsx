'use client';
import AddPropertyForm from '@/components/dashboard/admin/AddPropertyForm';
import { use } from 'react';
import { useTranslation } from '@/i18n';

export default function AddPropertyPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  const translations = {
    title: t('dashboard.admin.properties.add.title') || 'Add Property',
    subtitle: t('dashboard.admin.properties.add.subtitle') || 'Create a new property listing',
    submit: t('common.submit') || 'Save Property',
    cancel: t('common.cancel') || 'Cancel',
    // sections
    basicInfo: t('dashboard.admin.properties.add.basicInfo') || 'Basic Information',
    pricing: t('dashboard.admin.properties.add.pricing') || 'Pricing',
    images: t('dashboard.admin.properties.add.images') || 'Images',
    features: t('dashboard.admin.properties.add.features') || 'Features',
    interior: t('dashboard.admin.properties.add.interior') || 'Interior Features',
    exterior: t('dashboard.admin.properties.add.exterior') || 'Exterior Features',
    highlights: t('dashboard.admin.properties.add.highlights') || 'Highlights',
    locationDescription: t('dashboard.admin.properties.add.locationDescription') || 'Location Description',
    developerDescription: t('dashboard.admin.properties.add.developerDescription') || 'Developer Description',
    rental: t('dashboard.admin.properties.add.rental') || 'Rental Information',
  };

  return (
    <div className='space-y-4 md:space-y-6'>
    
        <h1 className='text-4xl font-bold text-gray-900 mb-2'>{translations.title}</h1>
        <p className='text-base text-gray-600'>{translations.subtitle}</p>
      

      <div className='rounded-lg bg-white shadow-sm overflow-hidden p-4 sm:p-6'>
        <AddPropertyForm translations={translations} locale={locale} />
      </div>
    </div>
  );
}
