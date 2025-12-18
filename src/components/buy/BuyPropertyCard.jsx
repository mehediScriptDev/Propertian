'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import { AiOutlineHeart } from "react-icons/ai";
import { Check, Home, Bed, ShowerHead, Ruler } from 'lucide-react';

/**
 * BuyPropertyCard Component
 * Displays a single property for sale with all relevant information
 * Follows atomic design principles and SOLID/DRY best practices
 *
 * @param {Object} property - Property data object
 */
export default function BuyPropertyCard({ property }) {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const {
    id,
    city,
    address,
    bathrooms,
    bedrooms,
    description,
    title,
    country,
    developerInfo,
    developerName,
    furnishing,
    images,
    propertyType,
    // 1. Rename API fields to match component variables
    featured: isVerified = false, // API has 'featured', you want 'isVerified'
    price: priceXOF,              // API has 'price', you want 'priceXOF'
    sqft: area,                   // API has 'sqft', you want 'area'
    state,                        // Need this to build 'location'
  } = property;

  // 2. Create derived / calculated fields
  const location = state ? `${city}, ${state}` : city || '';
  const priceUSD = priceXOF ? Math.round(Number(priceXOF) / 610) : 0; // Calculate USD from XOF
  const imageAlt = title; // Use title as alt text
  // Prefer first image from images array, fall back to any single-image field or a local placeholder
  const image = (images && images.length && images[0]) || property.image || '/buy-rent/thumb.png';
  console.log(property)
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(Boolean(property.isFavorite));

  // Format price with thousand separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // Map property type keys to English labels (avoid translation keys showing)
  const mapPropertyType = (pt) => {
    if (!pt) return '';
    const key = String(pt).toLowerCase();
    switch (key) {
      case 'villa':
      case 'villas':
      case 'vlla':
        return 'Villa';
      case 'apartment':
      case 'apartments':
        return 'Apartment';
      case 'house':
      case 'homes':
        return 'House';
      case 'land':
        return 'Land';
      case 'studio':
        return 'Studio';
      case 'commercial':
        return 'Commercial';
      default:
        // Fallback: capitalize the first letter
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  // WhatsApp message handler
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ${title} at ${location}. Can you provide more details?`
    );
    window.open(
      `https://wa.me/1234567890?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Toggle favorite - requires authentication
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // redirect to login page (preserve locale)
      const locale = (typeof window !== 'undefined' && window.location.pathname.split('/')[1]) || 'en';
      router.push(`/${locale}/login`);
      return;
    }

    // optimistic UI
    const prev = isFavorite;
    setIsFavorite(!prev);

    try {
      const res = await axios.post(`/properties/${id}/favorite`);
      // axios wrapper returns response; we don't strictly need to use res.data here
      // but could check success if backend returns structured response
      return res;
    } catch (err) {
      console.error('Favorite request failed', err);
      // revert optimistic update
      setIsFavorite(prev);
    }
  };

  return (
    <article
      className='flex flex-col gap-3 rounded-xl bg-white/50 dark:bg-card-dark shadow-md border border-[#f6efcb] dark:border-border-dark overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
      aria-label={`${title} property for sale`}
    >
      {/* Property Image */}
      <div className='relative w-full aspect-5/3 bg-gray-200 dark:bg-gray-700 overflow-hidden'>
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          className='object-cover group-hover:scale-105 transition-transform duration-500'
          loading='lazy'
        />

        {/* Badges - Top Left */}
        <div className='absolute top-3 left-3 flex items-center gap-2 flex-wrap'>
          {isVerified && (
            <span
              className='flex items-center gap-1 bg-[#D4AF37] text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md'
              aria-label='Verified property'
            >
              <Check className='w-3.5 h-3.5' aria-hidden='true' />
              <span>{t('buy.propertyCard.verified', 'Verified')}</span>
            </span>
          )}
        </div>

        {/* Property Type Badge - Top Right */}
        <div className='absolute top-3 right-3'>
          <span
            className='flex items-center gap-1 bg-gray-700/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md'
            aria-label={`${mapPropertyType(propertyType)} property`}
          >
            <Home className='w-3.5 h-3.5' aria-hidden='true' />
            <span>{mapPropertyType(propertyType)}</span>
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className='p-4 flex flex-col grow'>
        {/* Location */}
        <div className='flex justify-between'>
          <p className='text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-normal line-clamp-1'>
            {location}
          </p>
          <button
            title={isFavorite ? 'Remove favourite' : 'Add favourite'}
            onClick={handleToggleFavorite}
            aria-pressed={isFavorite}
            className={`cursor-pointer hover:scale-125 text-2xl p-0 leading-none inline-flex items-center justify-center ${isFavorite ? 'text-accent' : 'text-gray-400 dark:text-gray-300'}`}
          >
            {isFavorite ? <FaHeart /> : <AiOutlineHeart />}
          </button>
        </div>

        {/* Title */}
        <h3 className='text-xl lg:text-2xl font-bold leading-snug mt-1 line-clamp-1 text-gray-900 dark:text-white'>
          {title}
        </h3>

        {/* Property Features */}
        {(bedrooms || bathrooms || area) && (
          <div className='flex items-center gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
            {bedrooms && (
              <div className='flex items-center gap-1'>
                <Bed className='w-4 h-4' aria-hidden='true' />
                <span>
                  {bedrooms} {bedrooms > 1 ? 'beds' : 'bed'}
                </span>
              </div>
            )}
            {bathrooms && (
              <div className='flex items-center gap-1'>
                <ShowerHead className='w-4 h-4' aria-hidden='true' />
                <span>
                  {bathrooms} {bathrooms > 1 ? 'baths' : 'bath'}
                </span>
              </div>
            )}
            {area && (
              <div className='flex items-center gap-1'>
                <Ruler className='w-4 h-4' aria-hidden='true' />
                <span>{area} m²</span>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className='mt-2 sm:mt-3'>
          <p className='text-[#D4AF37] text-xl  font-bold'>
            {formatPrice(priceXOF)} XOF
          </p>
          <p className='text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-normal'>
            {t('buy.propertyCard.approx', '~')} ${formatPrice(priceUSD)}{' '}
            {t('buy.propertyCard.usd', 'USD')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-border-dark grid grid-cols-3 gap-1.5 sm:gap-2'>
          <Link
            href={`/${locale}/buy/${id}`}
            className='text-xs sm:text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap'
            aria-label={`View details for ${title}`}
          >
            {t('buy.propertyCard.viewDetails', 'View Details')}
          </Link>
          <Link
            href={`/${locale}/book-visit?property=${id}&type=buy`}
            className='text-xs sm:text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap'
            aria-label={`Book viewing for ${title}`}
          >
            {t('buy.propertyCard.bookViewing', 'Book Viewing')}
          </Link>
          <button
            onClick={handleWhatsAppClick}
            className='text-xs sm:text-sm lg:text-base font-semibold p-2 rounded-lg text-[#25D366] hover:bg-[#25D366]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 truncate'
            aria-label={`Contact via WhatsApp about ${title}`}
          >
            {t('buy.propertyCard.whatsapp', 'WhatsApp')}
          </button>
        </div>
      </div>
    </article>
  );
}
