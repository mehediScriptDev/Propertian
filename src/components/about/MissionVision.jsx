'use client';

import { memo } from 'react';

/**
 * MissionVision Component - Pixel-perfect design
 * Displays the company's mission and vision statement
 */
const MissionVision = memo(({ title, description }) => {
  return (
    <section
      className='py-8 sm:py-12 md:py-16'
      aria-labelledby='mission-vision-title'
    >
      <div className='grid grid-cols-1 items-center gap-6 md:grid-cols-5'>
        {/* Title Column - 2/5 width on desktop */}
        <div className='md:col-span-2'>
          <h2
            id='mission-vision-title'
            className='text-[24px] font-bold leading-tight tracking-[-0.015em] text-[#0A2240] dark:text-white sm:text-[28px] md:text-[32px] lg:text-[40px]'
          >
            {title}
          </h2>
        </div>

        {/* Description Column - 3/5 width on desktop */}
        <div className='md:col-span-3'>
          <p className='text-[14px] font-normal leading-[1.75] text-[#111418] dark:text-[#f0f2f4]/90 sm:text-[15px] md:text-base'>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
});

MissionVision.displayName = 'MissionVision';

export default MissionVision;
