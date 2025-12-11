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

export default function RentDetailsPage() {
  // Extract locale & id from the route using useParams hook
  const params = useParams();
  const locale = params?.locale || "en";
  const id = params?.id;
  const { t } = useTranslation(locale);

  const [property, setProperty] = useState(null);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-700 dark:text-gray-300">
          <p>{t('rent.listings.loading', 'Loading property...')}</p>
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
    </main>
  );
}
