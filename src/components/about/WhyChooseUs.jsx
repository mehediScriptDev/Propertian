'use client';

import { memo } from 'react';

/**
 * FeatureCard Component - Pixel-perfect design
 */
const FeatureCard = memo(({ icon, title, description }) => {
  return (
    <article className='flex flex-col items-center p-6 text-center sm:p-8'>
      {/* Icon Container - Gold accent background */}
      <div
        className='mb-4 flex size-14 items-center justify-center rounded-full bg-[#D4AF37]/20 sm:mb-6 sm:size-16 md:size-20'
        aria-hidden='true'
      >
        <span className='material-symbols-outlined text-3xl text-[#D4AF37] sm:text-4xl md:text-5xl'>
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3 className='mb-2 text-lg font-bold leading-tight text-[#0A2240] dark:text-white sm:mb-3 sm:text-xl md:text-2xl'>
        {title}
      </h3>

      {/* Description */}
      <p className='text-sm font-normal leading-relaxed text-[#111418] dark:text-[#f0f2f4]/90 sm:text-base md:text-lg'>
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
      className='py-12 sm:py-16 md:py-20 lg:py-24'
      aria-labelledby='why-choose-title'
    >
      {/* Section Header */}
      <div className='mb-12 text-center sm:mb-16'>
        <h2
          id='why-choose-title'
          className='text-2xl font-bold leading-tight tracking-tight text-[#0A2240] dark:text-white sm:text-3xl md:text-4xl lg:text-5xl'
        >
          {title}
        </h2>
        <p className='mx-auto mt-4 max-w-3xl text-base font-normal leading-relaxed text-[#111418] dark:text-[#f0f2f4]/90 sm:mt-6 sm:text-lg md:text-xl'>
          {subtitle}
        </p>
      </div>

      {/* Features Grid */}
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-12'>
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
