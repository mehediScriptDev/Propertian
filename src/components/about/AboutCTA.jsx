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
        className='my-8 sm:my-12 md:my-16'
        aria-labelledby='about-cta-title'
      >
        <div className='flex flex-col items-center rounded-xl bg-[#0A2240] p-6 text-center text-white sm:p-8 md:p-12'>
          {/* Title */}
          <h2
            id='about-cta-title'
            className='text-[24px] font-bold leading-tight sm:text-[28px] md:text-[32px] lg:text-[40px]'
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p className='mx-auto mt-3 max-w-2xl text-[14px] font-normal text-gray-200 sm:mt-4 sm:text-[15px] md:text-base'>
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className='mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:gap-4'>
            {/* Primary Button - Gold accent */}
            <Link
              href={primaryButtonHref}
              className='flex min-w-40 items-center justify-center rounded-lg bg-[#D4AF37] px-4 py-2.5 text-[14px] font-bold text-[#0A2240] transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A2240] sm:min-w-[180px] sm:px-5 sm:py-3 sm:text-base'
            >
              {primaryButtonText}
            </Link>

            {/* Secondary Button - Outlined */}
            <Link
              href={secondaryButtonHref}
              className='flex min-w-40 items-center justify-center rounded-lg border-2 border-[#D4AF37] bg-transparent px-4 py-2.5 text-[14px] font-bold text-[#D4AF37] transition-all duration-200 hover:bg-[#D4AF37]/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A2240] sm:min-w-[180px] sm:px-5 sm:py-3 sm:text-base'
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
