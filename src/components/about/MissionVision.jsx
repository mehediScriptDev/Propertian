'use client';

import { memo } from 'react';

/**
 * MissionVision Component - Pixel-perfect design
 * Displays the company's mission and vision statement
 */
const MissionVision = memo(({ title, description }) => {
  return (
    <section
      className='py-12 sm:py-16 md:py-20 lg:py-24'
      aria-labelledby='mission-vision-title'
    >
      <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-5 md:gap-12'>
        {/* Title Column - 2/5 width on desktop */}
        <div className='md:col-span-2'>
          <h2
            id='mission-vision-title'
            className='text-2xl font-bold leading-tight tracking-tight text-[#0A2240] dark:text-white sm:text-3xl md:text-4xl lg:text-5xl'
          >
            {title}
          </h2>
        </div>

        {/* Description Column - 3/5 width on desktop */}
        <div className='md:col-span-3'>
          <p className='text-base font-normal leading-relaxed text-[#111418] dark:text-[#f0f2f4]/90 sm:text-lg md:text-xl'>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
});

MissionVision.displayName = 'MissionVision';

export default MissionVision;
