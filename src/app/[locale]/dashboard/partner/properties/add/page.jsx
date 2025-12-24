'use client';
import AddPropertyForm from '@/components/dashboard/admin/AddPropertyForm';
import { use } from 'react';
import { useTranslation } from '@/i18n';

export default function PartnerAddPropertyPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);

  const translations = {
    title: t('dashboard.partner.properties.add.title') || 'Add Property',
    subtitle: t('dashboard.partner.properties.add.subtitle') || 'Create a new property listing (partner)',
    submit: t('common.submit') || 'Save Property',
    cancel: t('common.cancel') || 'Cancel',
    basicInfo: t('dashboard.partner.properties.add.basicInfo') || 'Basic Information',
    pricing: t('dashboard.partner.properties.add.pricing') || 'Pricing',
    images: t('dashboard.partner.properties.add.images') || 'Images',
    features: t('dashboard.partner.properties.add.features') || 'Features',
    interior: t('dashboard.partner.properties.add.interior') || 'Interior Features',
    exterior: t('dashboard.partner.properties.add.exterior') || 'Exterior Features',
    rental: t('dashboard.partner.properties.add.rental') || 'Rental Information',
  };

  // NOTE for integrators:
  // This partner page passes `apiEndpoint={'/partner/properties'}` and `defaultVerified={false}`
  // to the shared `AddPropertyForm`.
  // When backend is ready, confirm the partner create endpoint and expected payload. If file uploads are required,
  // either upload files first and pass returned URLs in the JSON payload, or switch to multipart POST here.

  return (
    <div className='space-y-4 md:space-y-6'>
      <h1 className='text-4xl font-bold text-gray-900 mb-2'>{translations.title}</h1>
      <p className='text-base text-gray-600'>{translations.subtitle}</p>

      <div className='rounded-lg bg-white shadow-sm overflow-hidden p-4 sm:p-6'>
        {/* Pass defaultVerified=false so partner submissions are not verified */}
        <AddPropertyForm translations={translations} locale={locale} defaultVerified={false} apiEndpoint={'/properties'} />
      </div>
    </div>
  );
}
