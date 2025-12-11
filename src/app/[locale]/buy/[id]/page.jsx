'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import ImageGallery from '@/components/property/ImageGallery';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertyFeatures from '@/components/property/PropertyFeatures';
import ContactActions from '@/components/property/ContactActions';
import PropertyTabs from '@/components/property/PropertyTabs';
import RentalOverview from '@/components/property/RentalOverview';
import axios from 'axios';

export default function BuyDetailsPage() {
  const [property, setProperty] = useState(null);
  console.log(property)

  const params = useParams();
  const locale = params?.locale || 'en';
  const id = params?.id;
  const { t } = useTranslation(locale);
  useEffect(() => {
    if (!id) return;

    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')) ||
      'https://quiahgroup1backend.mtscorporate.com/api';

    axios
      .get(`${apiUrl}/properties/${id}`)
      .then((res) => {
        // support different response shapes: { data: { property } } or { data: property } or { property }
        const payload =
          res?.data?.data?.property ?? res?.data?.data ?? res?.data ?? res;
        setProperty(payload);
      })
      .catch((err) => console.error('Fetch property error', err));
  }, [id]);

  // While loading show a simple placeholder
  if (property === null) {
    return (
      <main className='min-h-screen bg-gray-50'>
        <div className='max-w-3xl mx-auto px-4 py-16 text-center text-gray-700'>
          <h1 className='text-2xl font-semibold mb-2'>{t('common.loading') || 'Loading...'}</h1>
        </div>
      </main>
    );
  }

  if (!property || !property.id) {
    return (
      <main className='min-h-screen bg-gray-50'>
        <div className='max-w-3xl mx-auto px-4 py-16 text-center text-gray-700'>
          <h1 className='text-2xl font-semibold mb-2'>{t('buy.noResults')}</h1>
          <Link href={`/${locale}/buy`} className='text-primary underline'>
            {t('common.back')}
          </Link>
        </div>
      </main>
    );
  }

  // Build UI-friendly property object from API payload
  const apiOrigin =
    (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')) ||
    'https://quiahgroup1backend.mtscorporate.com';

  const images = (property.images || []).map((img) =>
    typeof img === 'string' && !img.startsWith('http') ? `${apiOrigin}${img}` : img
  );

  const uiProperty = {
    id: property.id,
    title: property.title,
    description: property.description,
    images,
    features: {
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.sqft || property.area || 0,
      garages: property.garages || 0,
    },
    interiorFeatures: property.interiorFeatures,
    exteriorFeatures: property.exteriorFeatures,
    developer: property.developerName || (property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : undefined),
    developerDescription: property.developerInfo,
    rental: {
      duration: property.rentalDuration,
      furnishing: property.furnishing,
      deposit: property.rentalTerms,
    },
    location: property.city ? `${property.city}${property.state ? ', ' + property.state : ''}` : property.address,
    price: Number(property.price) || 0,
    // Compute an approximate USD value when backend doesn't provide one.
    // You can override the conversion rate with NEXT_PUBLIC_XOF_TO_USD (client-safe env var).
    priceUSD:
      property.priceUSD && !Number.isNaN(Number(property.priceUSD))
        ? Number(property.priceUSD)
        : (() => {
          const rate = Number(process.env.NEXT_PUBLIC_XOF_TO_USD) || 600; // XOF per USD
          const xof = Number(property.price) || 0;
          return rate > 0 ? Math.round(xof / rate) : undefined;
        })(),
    status: property.status || (property.featured ? 'Featured' : undefined),
  };

  return (
    <main className='min-h-screen bg-background-light'>
      {/* Container with max-width for better readability */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-3.5'>
          {/* Main Content Area - Left Side (2/3 width on large screens) */}
          <div className='lg:col-span-2 space-y-3.5 lg:space-y-6'>
            {/* Image Gallery */}
            <Suspense
              fallback={
                <div className='w-full h-96 bg-gray-200 rounded-lg animate-pulse' />
              }
            >
              <ImageGallery
                images={uiProperty.images}
                alt={uiProperty.title}
              />
            </Suspense>

            {/* Tabbed Content */}
            <section className='bg-white/50 rounded-lg shadow-sm p-6'>
              <PropertyTabs property={uiProperty} />
            </section>
          </div>

          {/* Sidebar - Right Side (1/3 width on large screens) */}
          <div className='lg:col-span-1 lg:space-y-6 space-y-3.5'>
            {/* Property Info Card - Sticky on larger screens */}
            <div className='sticky top-22 lg:space-y-6 space-y-3.5'>
              {/* Combined Property Header and Contact Actions Card */}
              <div className='bg-white/50 border border-[#f6efcb] rounded-lg shadow-sm p-6'>
                <PropertyHeader
                  title={uiProperty.title}
                  location={uiProperty.location}
                  price={uiProperty.price}
                  priceUSD={uiProperty.priceUSD}
                  developer={uiProperty.developer}
                  status={uiProperty.status}
                />

                {/* Divider */}
                <div className='my-6 border-t border-gray-200'></div>

                <ContactActions
                  propertyId={uiProperty.id}
                  propertyTitle={uiProperty.title}
                  listingType='buy'
                />
              </div>

              {/* Rental Overview */}
              {uiProperty.rental && (
                <RentalOverview rental={uiProperty.rental} />
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumbs for SEO and navigation */}
        <nav className='mt-8 mb-4' aria-label='Breadcrumb'>
          <ol className='flex items-center space-x-2 text-sm text-gray-500'>
            <li>
              <Link href={`/${locale}`} className='hover:text-gray-700'>
                {t('common.home')}
              </Link>
            </li>
            <li>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </li>
            <li>
              <Link href={`/${locale}/buy`} className='hover:text-gray-700'>
                {t('common.buy')}
              </Link>
            </li>
            <li>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </li>
            <li className='text-gray-900 font-medium truncate max-w-xs'>
              {uiProperty.title}
            </li>
          </ol>
        </nav>
      </div>
    </main>
  );
}
