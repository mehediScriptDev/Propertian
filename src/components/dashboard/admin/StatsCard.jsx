'use client';

/**
 * StatsCard Component
 * Reusable metric card with icon
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main metric value
 * @param {React.Component} props.icon - Icon component from lucide-react
 * @param {string} props.variant - Color variant (primary, success, info, warning)
 */
export default function StatsCard({
  title,
  value,
  icon: Icon,
  variant = 'primary',
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-6 bg-white/60 shadow-md 
        transition-transform duration-300"
    >
      {/* Content */}
      <div className='relative z-10'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-600'>{title}</p>
            <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900'>
              {value.toLocaleString()}
            </p>
          </div>

          {/* Icon */}
          {Icon && (
            <div className='flex items-center justify-center w-12 h-12 rounded-full bg-[#d4af37]/10'>
              <Icon className='h-6 w-6 text-[#d4af37]' />
            </div>
          )}
        </div>
      </div>

      {/* Subtle Border Glow */}
      <div className='absolute inset-0 rounded-xl border border-white/10' />
    </div>
  );
}
