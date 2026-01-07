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
import api from '@/lib/api';
import { showToast } from '@/components/Toast';
import { X } from 'lucide-react';

export default function BuyDetailsPage() {
  const [property, setProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ fullName: '', email: '', phone: '', message: '' });
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

  const handleInquire = (id) => {
    // open modal for current property
    setFormState((s) => ({ ...s, message: `I am interested in ${uiProperty?.title || ''}. Please send me more information.` }));
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        propertyId: uiProperty?.id,
        propertyTitle: uiProperty?.title,
        message: formState.message,
      };
      console.log('Submitting inquiry payload ->', payload);
      await api.post('/inquiries', payload);
      setIsModalOpen(false);
      showToast('Inquiry sent successfully', 'success');
    } catch (err) {
      console.error('Failed to submit inquiry', err, err?.response || err?.data || null);
      const msg = (err && err.message) ? err.message : 'Failed to send inquiry. Please try again.';
      showToast(msg, 'error');
    }
  };

  // While loading show a skeleton placeholder for better UX
  if (property === null) {
    return (
      <main className='min-h-screen bg-background-light'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-3.5'>
            <div className='lg:col-span-2 space-y-3.5 lg:space-y-6'>
              <div className='w-full h-96 bg-gray-200 rounded-lg animate-pulse' />
              <section className='bg-white/50 rounded-lg shadow-sm p-6'>
                <div className='h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse' />
                <div className='h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse' />
                <div className='space-y-3'>
                  <div className='h-3 bg-gray-200 rounded w-full animate-pulse' />
                  <div className='h-3 bg-gray-200 rounded w-full animate-pulse' />
                  <div className='h-3 bg-gray-200 rounded w-2/3 animate-pulse' />
                </div>
              </section>
            </div>

            <div className='lg:col-span-1 lg:space-y-6 space-y-3.5'>
              <div className='sticky top-22 lg:space-y-6 space-y-3.5'>
                <div className='bg-white/50 border border-[#f6efcb] rounded-lg shadow-sm p-6'>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse' />
                  <div className='h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse' />
                  <div className='h-10 bg-gray-200 rounded w-full mb-2 animate-pulse' />
                </div>
                <div className='bg-white/50 border border-[#f6efcb] rounded-lg shadow-sm p-6'>
                  <div className='h-4 bg-gray-200 rounded w-full mb-2 animate-pulse' />
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse' />
                </div>
              </div>
            </div>
          </div>
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
    id: property.id || property._id,
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
                  onInquire={() => handleInquire(uiProperty.id)}
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
      {/* Inquiry Modal (property) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div>
                <h3 className="text-2xl font-bold text-charcoal">Inquire about {uiProperty.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Fill out the form below and the agent will contact you shortly.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close modal">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="message" className="block text-[14px] font-medium text-charcoal mb-1.5">Message</label>
                  <textarea id="message" name="message" rows={4} value={formState.message} onChange={handleChange} className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-[15px] transition-all duration-200" required />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200">Cancel</button>
                  <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-charcoal font-semibold px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Send Inquiry</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
