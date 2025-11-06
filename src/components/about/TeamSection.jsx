'use client';

import Image from 'next/image';
import { memo } from 'react';

/**
 * TeamMemberCard Component - Pixel-perfect design
 */
const TeamMemberCard = memo(({ image, name, role, bio, alt }) => {
  return (
    <article className='group text-center'>
      {/* Team Member Photo - Responsive size */}
      <div className='relative mx-auto mb-4 size-40 overflow-hidden rounded-full border-4 border-[#D4AF37]/50 transition-colors duration-300 group-hover:border-[#D4AF37] sm:mb-6 sm:size-48 md:size-56 lg:size-64'>
        <Image
          src={image}
          alt={alt || `Professional headshot of ${name}`}
          fill
          sizes='(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px'
          quality={90}
          className='object-cover'
        />
      </div>

      {/* Team Member Info */}
      <div className='mt-4 sm:mt-6'>
        <h3 className='text-xl font-bold text-[#0A2240] dark:text-white sm:text-2xl md:text-3xl'>
          {name}
        </h3>
        <p className='mt-2 text-base font-medium text-[#D4AF37] sm:text-lg md:text-xl'>
          {role}
        </p>
        <p className='mt-3 text-sm leading-relaxed text-[#111418] dark:text-[#f0f2f4]/90 sm:text-base md:text-lg'>
          {bio}
        </p>
      </div>
    </article>
  );
});

TeamMemberCard.displayName = 'TeamMemberCard';

/**
 * TeamSection Component - Pixel-perfect design
 */
const TeamSection = memo(({ title, subtitle, team }) => {
  return (
    <section
      className='py-12 sm:py-16 md:py-20 lg:py-24'
      aria-labelledby='team-section-title'
    >
      {/* Section Header */}
      <div className='mb-12 text-center sm:mb-16'>
        <h2
          id='team-section-title'
          className='text-2xl font-bold leading-tight tracking-tight text-[#0A2240] dark:text-white sm:text-3xl md:text-4xl lg:text-5xl'
        >
          {title}
        </h2>
        <p className='mx-auto mt-4 max-w-3xl text-base font-normal leading-relaxed text-[#111418] dark:text-[#f0f2f4]/90 sm:mt-6 sm:text-lg md:text-xl'>
          {subtitle}
        </p>
      </div>

      {/* Team Grid */}
      <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3 lg:gap-16'>
        {team.map((member, index) => (
          <TeamMemberCard
            key={`team-member-${index}`}
            image={member.image}
            name={member.name}
            role={member.role}
            bio={member.bio}
            alt={member.alt}
          />
        ))}
      </div>
    </section>
  );
});

TeamSection.displayName = 'TeamSection';

export default TeamSection;
