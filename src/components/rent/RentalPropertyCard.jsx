'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { GoHeartFill } from "react-icons/go";
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, Home, Bed, ShowerHead } from 'lucide-react';

/**
 * RentalPropertyCard Component
 * Displays a single rental property with all relevant information
 * Follows atomic design principles and SOLID/DRY best practices
 *
 * @param {Object} property - Property data object
 */
export default function RentalPropertyCard({ property }) {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);

  const {
    id,
    image,
    city,
    imageAlt,
    location,
    title,
    priceXOF,
    priceUSD,
    isVerified = false,
    duration = 'long-term',
    isFurnished = true,
    bedrooms,
    bathrooms,
  } = property;

  const { isAuthenticated, user } = useAuth();
  const showFavorite = !(user?.role === 'admin' || user?.role === 'partner');
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(Boolean(property.isFavorite));

  // Format price with thousand separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
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

  return (
    <article
      className='flex flex-col gap-3 rounded-xl bg-white/50 dark:bg-card-dark shadow-md border border-[#f6efcb] dark:border-border-dark overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
      aria-label={`${title} rental property`}
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
              <CheckCircle className='w-3.5 h-3.5' />
              <span>{t('rent.propertyCard.verified')}</span>
            </span>
          )}
          <span
            className='flex items-center gap-1 bg-gray-700/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md'
            aria-label={`${duration} rental`}
          >
            <Clock className='w-3.5 h-3.5' />
            <span>
              {duration === 'short-term'
                ? t('rent.propertyCard.shortTerm')
                : t('rent.propertyCard.longTerm')}
            </span>
          </span>
        </div>

        {/* Badge - Top Right */}
        <div className='absolute top-3 hidden lg:block right-3'>
          <span
            className='flex items-center gap-1 bg-gray-700/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md'
            aria-label={isFurnished ? 'Furnished' : 'Unfurnished'}
          >
            <Home className='w-3.5 h-3.5' />
            <span>
              {isFurnished
                ? t('rent.propertyCard.furnished')
                : t('rent.propertyCard.unfurnished')}
            </span>
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className='p-4 flex flex-col grow'>
        {/* Location */}
        <div className='flex justify-between'>
          <p className='text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-normal line-clamp-1'>
            {city || location}
          </p>
          {showFavorite && (
            <button
              title={isFavorite ? 'Remove favourite' : 'Add favourite'}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!isAuthenticated) {
                  const locale = (typeof window !== 'undefined' && window.location.pathname.split('/')[1]) || 'en';
                  router.push(`/${locale}/login`);
                  return;
                }

                const prev = isFavorite;
                setIsFavorite(!prev);

                try {
                  await axios.post(`/properties/${id}/favorite`);
                } catch (err) {
                  console.error('Favorite request failed', err);
                  setIsFavorite(prev);
                }
              }}
              aria-pressed={isFavorite}
              className={`cursor-pointer hover:scale-125 text-2xl p-0 leading-none inline-flex items-center justify-center ${isFavorite ? 'text-accent' : 'text-gray-400 dark:text-gray-300'}`}
            >
              {isFavorite ? <GoHeartFill /> : <AiOutlineHeart />}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className='text-xl lg:text-2xl font-bold leading-snug mt-1 line-clamp-1 text-gray-900 dark:text-white'>
          {title}
        </h3>

        {/* Property Features */}
        {(bedrooms || bathrooms) && (
          <div className='flex items-center gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
            {bedrooms && (
              <div className='flex items-center gap-1'>
                <Bed className='w-4 h-4' />
                <span>
                  {bedrooms} {bedrooms > 1 ? 'beds' : 'bed'}
                </span>
              </div>
            )}
            {bathrooms && (
              <div className='flex items-center gap-1'>
                <ShowerHead className='w-4 h-4' />
                <span>
                  {bathrooms} {bathrooms > 1 ? 'baths' : 'bath'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className='mt-2 sm:mt-3'>
          <p className='text-[#D4AF37] text-xl font-bold'>
            {formatPrice(priceXOF)} XOF{' '}
            <span className='text-gray-500 dark:text-gray-400 text-sm font-normal'>
              {t('rent.propertyCard.perMonth')}
            </span>
          </p>
          <p className='text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-normal'>
            {t('rent.propertyCard.approx')} ${formatPrice(priceUSD)}{' '}
            {t('rent.propertyCard.usd')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-border-dark grid grid-cols-3 gap-1.5 sm:gap-2'>
          <Link
            href={`/${locale}/rent/${id}`}
            className='text-xs sm:text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap'
            aria-label={`View details for ${title}`}
          >
            {t('rent.propertyCard.viewDetails')}
          </Link>
          <Link
            href={`/${locale}/book-visit?property=${id}&type=rent`}
            className='text-xs sm:text-sm lg:text-base font-semibold text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap'
            aria-label={`Book viewing for ${title}`}
          >
            {t('rent.propertyCard.bookViewing')}
          </Link>
          <button
            onClick={handleWhatsAppClick}
            className='text-xs sm:text-sm lg:text-base font-semibold p-2 rounded-lg text-[#25D366] hover:bg-[#25D366]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 truncate'
            aria-label={`Contact via WhatsApp about ${title}`}
          >
            {t('rent.propertyCard.whatsapp')}
          </button>
        </div>
      </div>
    </article>
  );
}
