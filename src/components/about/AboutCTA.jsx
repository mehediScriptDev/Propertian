'use client';

import Link from 'next/link';
import { memo } from 'react';

/**
 * AboutCTA Component - Pixel-perfect design
 * Call-to-action banner for the About page
 */
const AboutCTA = memo(
  ({
    title,
    subtitle,
    primaryButtonText,
    primaryButtonHref,
    secondaryButtonText,
    secondaryButtonHref,
  }) => {
    return (
      <section
        className='my-12 sm:my-16 md:my-20 lg:my-24'
        aria-labelledby='about-cta-title'
      >
        <div className='flex flex-col items-center rounded-2xl bg-[#0A2240] p-8 text-center text-white sm:p-12 md:p-16 lg:p-20'>
          {/* Title */}
          <h2
            id='about-cta-title'
            className='text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl'
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p className='mx-auto mt-4 max-w-3xl text-base font-normal leading-relaxed text-gray-200 sm:mt-6 sm:text-lg md:text-xl'>
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className='mt-8 flex w-full flex-col gap-4 sm:mt-10 sm:w-auto sm:flex-row sm:gap-6'>
            {/* Primary Button - Gold accent */}
            <Link
              href={primaryButtonHref}
              className='inline-flex min-w-[200px] items-center justify-center rounded-xl bg-[#D4AF37] px-8 py-4 text-base font-bold text-[#0A2240] transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A2240] sm:min-w-[220px] sm:text-lg md:px-10 md:py-5 md:text-xl'
            >
              {primaryButtonText}
            </Link>

            {/* Secondary Button - Outlined */}
            <Link
              href={secondaryButtonHref}
              className='inline-flex min-w-[200px] items-center justify-center rounded-xl border-2 border-[#D4AF37] bg-transparent px-8 py-4 text-base font-bold text-[#D4AF37] transition-all duration-200 hover:scale-105 hover:bg-[#D4AF37]/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A2240] sm:min-w-[220px] sm:text-lg md:px-10 md:py-5 md:text-xl'
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>
    );
  }
);

AboutCTA.displayName = 'AboutCTA';

export default AboutCTA;
