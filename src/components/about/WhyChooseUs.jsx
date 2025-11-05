'use client';

import { memo } from 'react';

/**
 * FeatureCard Component - Pixel-perfect design
 */
const FeatureCard = memo(({ icon, title, description }) => {
  return (
    <article className='flex flex-col items-center p-4 text-center sm:p-6'>
      {/* Icon Container - Gold accent background */}
      <div
        className='mb-3 flex size-10 items-center justify-center rounded-full bg-[#D4AF37]/20 sm:mb-4 sm:size-12'
        aria-hidden='true'
      >
        <span className='material-symbols-outlined text-[24px] text-[#D4AF37] sm:text-[32px]'>
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3 className='mb-1.5 text-[15px] font-bold leading-tight text-[#0A2240] dark:text-white sm:mb-2 sm:text-lg'>
        {title}
      </h3>

      {/* Description */}
      <p className='text-[13px] font-normal leading-relaxed text-[#111418] dark:text-[#f0f2f4]/90 sm:text-sm'>
        {description}
      </p>
    </article>
  );
});

FeatureCard.displayName = 'FeatureCard';

/**
 * WhyChooseUs Component - Pixel-perfect design
 */
const WhyChooseUs = memo(({ title, subtitle, features }) => {
  return (
    <section
      className='py-8 sm:py-12 md:py-16'
      aria-labelledby='why-choose-title'
    >
      {/* Section Header */}
      <div className='mb-8 text-center sm:mb-12'>
        <h2
          id='why-choose-title'
          className='text-[24px] font-bold leading-tight tracking-[-0.015em] text-[#0A2240] dark:text-white sm:text-[28px] md:text-[32px] lg:text-[40px]'
        >
          {title}
        </h2>
        <p className='mx-auto mt-3 max-w-2xl text-[14px] font-normal text-[#111418] dark:text-[#f0f2f4]/90 sm:mt-4 sm:text-[15px] md:text-base lg:text-lg'>
          {subtitle}
        </p>
      </div>

      {/* Features Grid */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4'>
        {features.map((feature, index) => (
          <FeatureCard
            key={`feature-${index}`}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
});

WhyChooseUs.displayName = 'WhyChooseUs';

export default WhyChooseUs;
