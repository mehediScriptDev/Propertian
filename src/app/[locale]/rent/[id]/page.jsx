"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import ImageGallery from "@/components/property/ImageGallery";
import PropertyHeader from "@/components/property/PropertyHeader";// (If used inside tabs component)
import ContactActions from "@/components/property/ContactActions";
import PropertyTabs from "@/components/property/PropertyTabs";
import RentalOverview from "@/components/property/RentalOverview";
import axiosInstance from "@/lib/axios";
import api from '@/lib/api';
import { showToast } from '@/components/Toast';
import { X } from 'lucide-react';

export default function RentDetailsPage() {
  // Extract locale & id from the route using useParams hook
  const params = useParams();
  const locale = params?.locale || "en";
  const id = params?.id;
  const { t } = useTranslation(locale);

  const [property, setProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ fullName: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    setLoading(true);
    setError(null);

    axiosInstance
      .get(`/properties/${id}`)
      .then((res) => {
        
        const p = res?.data?.data?.property || res?.data?.data || res?.data?.property || res?.data || null;
        if (!p) throw new Error('Property not found');

        const normalized = {
          id: p.id,
          title: p.title,
          location: `${p.city || ''}${p.state ? ', ' + p.state : ''}`,
          priceXOF: p.price || p.priceXOF,
          priceUSD: p.priceUSD || null,
          developer: t('rent.property.manager'),
          status: p.featured || p.isVerified ? t('rent.property.status') : undefined,
          images: (p.images && p.images.length ? p.images : p.image ? [p.image] : []),
          features: {
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            area: p.sqft || p.area || null,
            garages: p.garages || null,
          },
          description: p.description || t('rent.property.description'),
          highlights: [],
          interiorFeatures: p.interiorFeatures || [],
          exteriorFeatures: p.exteriorFeatures || [],
          locationDescription: p.locationDescription || t('rent.property.locationDesc'),
          managerDescription: p.managerDescription || t('rent.property.managerDesc', 'Professionally managed for comfort and reliability.'),
          rental: {
            duration: p.duration || p.rentalDuration || null,
            furnishing: p.isFurnished ? t('rent.property.rental.furnishing', 'Fully Furnished') : t('rent.propertyCard.unfurnished'),
            deposit: t('rent.property.rental.deposit', '2 Months Deposit'),
          },
        };

        if (mounted) setProperty(normalized);
      })
      .catch((err) => {
        console.error('Failed to load property', err);
        if (mounted) setError(err.message || 'Failed to load property');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, t]);

  const handleInquire = (id) => {
    setFormState((s) => ({ ...s, message: `I am interested in ${property?.title || ''}. Please send me more information.` }));
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
        propertyId: property?.id,
        propertyTitle: property?.title,
        message: formState.message,
      };
      await api.post('/inquiries', payload);
      setIsModalOpen(false);
      showToast('Inquiry sent successfully', 'success');
    } catch (err) {
      console.error('Failed to submit inquiry', err);
      const msg = (err && err.message) ? err.message : 'Failed to send inquiry. Please try again.';
      showToast(msg, 'error');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-700 dark:text-gray-300">
          {/* Use fallback if translation returns raw key */}
          <p>{(() => {
            const key = 'rent.listings.loading';
            const res = t(key);
            return res === key ? 'Loading property...' : res;
          })()}</p>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-700 dark:text-gray-300">
          <h1 className="text-2xl font-semibold mb-2">{t('rent.listings.noResults')}</h1>
          <p className='text-sm text-gray-600 mb-4'>{error}</p>
          <Link href={`/${locale}/rent`} className="text-primary underline">{t('common.back')}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-light dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-3.5">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-3.5 lg:space-y-6">
            {/* Image Gallery */}
            <Suspense
              fallback={<div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />}
            >
              <ImageGallery images={property.images} alt={property.title} />
            </Suspense>

            {/* Tabs (Overview / Features / Location / etc.) */}
            <section className="bg-white/50 dark:bg-card-dark rounded-lg shadow-sm p-6">
              <PropertyTabs property={property} />
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 lg:space-y-6 space-y-3.5">
            <div className="sticky top-22 lg:space-y-6 space-y-3.5">
              <div className="bg-white/50 border border-[#f6efcb] dark:bg-card-dark rounded-lg shadow-sm p-6">
                <PropertyHeader
                  title={property.title}
                  location={property.location}
                  price={property.priceXOF}
                  priceUSD={property.priceUSD}
                  developer={property.developer}
                  status={property.status}
                />
                <div className="my-6 border-t border-gray-200 dark:border-gray-700" />
                <ContactActions
                  propertyId={property.id}
                  propertyTitle={property.title}
                  listingType='rent'
                  onInquire={() => handleInquire(property.id)}
                />
              </div>

              {/* Rental Overview */}

              {property.rental && <RentalOverview rental={property.rental} />}
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav className="mt-8 mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href={`/${locale}`} className="hover:text-gray-700 dark:hover:text-gray-200">
                {t("common.home")}
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <Link href={`/${locale}/rent`} className="hover:text-gray-700 dark:hover:text-gray-200">
                {t("common.rent")}
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-xs">
              {property.title}
            </li>
          </ol>
        </nav>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div>
                <h3 className="text-2xl font-bold text-charcoal">Inquire about {property.title}</h3>
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
