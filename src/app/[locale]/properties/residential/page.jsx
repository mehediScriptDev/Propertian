"use client";

import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n';
import DevelopmentCard from '@/components/property/DevelopmentCard';
import DevelopmentFilters from '@/components/property/DevelopmentFilters';
import WhyInvestCard from '@/components/property/WhyInvestCard';
import DeveloperCTA from '@/components/property/DeveloperCTA';
import { X } from 'lucide-react';
import { Shield } from 'lucide-react'; 
import api from '@/lib/api';
/**
 * ResidentialPage - New Developments Page
 *
 * Displays new residential development projects in Côte d'Ivoire.
 * Features hero section, filters, property cards, benefits section, and developer CTA.
 * Fully responsive and optimized for performance.
 */
export default function ResidentialPage() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const [filters, setFilters] = useState({
    cityArea: 'all',
    developmentStage: 'all',
    propertyType: 'all',
    priceRange: 'all'
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevelopment, setSelectedDevelopment] = useState(null);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  // live developments loaded from API
  const [developments, setDevelopments] = useState([]);
  const [loadingDevelopments, setLoadingDevelopments] = useState(false);
  const [devError, setDevError] = useState(null);

  // Fetch NEW_DEVELOPMENT properties from API and normalize shape
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchDevelopments = async () => {
      setLoadingDevelopments(true);
      setDevError(null);
      try {
        const res = await api.get('/properties?propertyType=NEW_DEVELOPMENT', { signal: controller.signal });
        // api.get returns response.data from axios; backend may nest under `data`
        const data = res?.data || res;
        let props = data?.properties || data?.data?.properties || data?.data || data?.items || [];

        if (!Array.isArray(props) && typeof props === 'object') {
          props = Object.values(props);
        }

        // Normalize fields so the rest of the page can use the same keys as the mock
        const normalized = (props || []).map((p) => ({
          id: p.id,
          title: p.title || p.name || '',
          developer: p.developerName || p.developer || (p.owner ? `${p.owner.firstName || ''} ${p.owner.lastName || ''}`.trim() : ''),
          location: p.address || p.location || '',
          city: (p.city || '').toLowerCase(),
          propertyType: p.propertyType || '',
          stage: p.stage || (p.isNewDevelopment ? 'planning' : ''),
          priceXOF: p.price || p.priceXOF || '',
          priceUSD: p.priceUSD || '',
          image: (p.images && p.images[0]) || p.image || '/new-development/last.png',
          verified: !!(p.verified || p.isVerified),
          escrowEligible: !!p.escrowEligible,
          completionDate: p.completionDate,
          developerInfo: p.developerInfo || '',
          raw: p,
        }));

        if (mounted) setDevelopments(normalized);
      } catch (err) {
        if (mounted) setDevError(err?.message || 'Failed to load developments');
      } finally {
        if (mounted) setLoadingDevelopments(false);
      }
    };

    fetchDevelopments();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Filter developments based on selected filters
  const filteredDevelopments = useMemo(() => {
    return developments.filter((dev) => {
      // City filter
      if (filters.cityArea !== 'all' && dev.city !== filters.cityArea) {
        return false;
      }

      // Property type filter
      if (filters.propertyType !== 'all' && dev.propertyType !== filters.propertyType ) {
        return false;
      }

      // Development stage filter
      if (filters.developmentStage !== 'all' && dev.stage !== filters.developmentStage) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = dev.priceXOF;
        switch (filters.priceRange) {
          case 'under100m':
            if (price >= 100000000) return false;
            break;
          case '100m-200m':
            if (price < 100000000 || price >= 200000000) return false;
            break;
          case '200m-500m':
            if (price < 200000000 || price >= 500000000) return false;
            break;
          case 'over500m':
            if (price < 500000000) return false;
            break;
        }
      }

          return true;
    });
  }, [filters, developments]);

  // Investment benefits data
  const investmentBenefits = [
    {
      icon: 'home_work',
      title: ' Modern Amenities',
      description: 'Experience elevated living with contemporary designs, smart home technology, recreational spaces, pools, gyms, and high-end lifestyle features built for today’s standards',
    },
    {
      icon: 'payments',
      title: 'Flexible Payment Options',
      description: 'Access developer-backed payment plans that make owning or investing easier, with structured schedules designed to fit different budgets. ',
    },
    {
      icon: 'trending_up',
      title: 'High Appreciation Potential',
      description: 'Secure your property early in emerging growth zones and benefit from strong long-term value increases and competitive returns.',
    },
    {
      icon: 'construction',
      title: 'Quality Construction',
      description: 'Enjoy peace of mind knowing your home meets the latest building codes, safety standards, and engineering practices—built to last with durability in mind. ',
    },
    {
      icon: 'public',
      title: 'Strong Market Demand',
      description: 'Modern developments attract quality tenants and buyers, providing higher occupancy rates and better rental performance. ',
    },
    {
      icon: <Shield />,
      title: 'Lower Maintenance Costs',
      description: 'With brand-new infrastructure and appliances, you reduce repair expenses and unexpected costs for years, improving overall cash flow.',
    },
  ];

  // Event handlers
  const handleViewDetails = (id) => {
    console.log('View details for development:', id);
    // Navigate to development detail page
  };

  const handleInquire = (id) => {
    const development = developments.find((dev) => dev.id === id);
    if (development) {
      setSelectedDevelopment(development);
      setFormState({
        fullName: '',
        email: '',
        phone: '',
        message: `I am interested in ${development.title}. Please send me more information.`,
      });
      setIsModalOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const payload = {
          propertyId: selectedDevelopment?.id || null,
          propertyTitle: selectedDevelopment?.title || selectedDevelopment?.name || '',
          message: formState.message,
          // fullName: formState.fullName,
          // email: formState.email,
          // phone: formState.phone,
        };

        await api.post('/inquiries', payload);

        alert('Thank you for your inquiry! The developer will contact you shortly.');
        setIsModalOpen(false);
      } catch (err) {
        console.error('Failed to submit inquiry', err);
        alert('Failed to send inquiry. Please try again later.');
      }
    })();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleListProject = () => {
    console.log('List project clicked');
    // Navigate to list project page
  };

  return (
    <main className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
      {/* Hero Section */}
      <section className='w-full sm:mb-8'>
        <div
          className='flex min-h-50 sm:min-h-60 lg:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-6 text-center'
          style={{
            backgroundImage: `linear-gradient(rgba(10, 25, 49, 0.4) 0%, rgba(10, 25, 49, 0.3) 100%), url("/new-development/banner.png")`,
          }}
          role='banner'
        >
          <div className='flex flex-col gap-4 max-w-3xl'>
            <h1 className='text-white font-black leading-tight tracking-[-0.033em] lg:text-5xl text-2xl sm:text-3xl'>
              {t('newDevelopments.hero.title')}
            </h1>
            <p className='text-gray-200 text-sm sm:text-base font-normal leading-normal lg:text-lg'>
              {t('newDevelopments.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <DevelopmentFilters onFilterChange={handleFilterChange} />

      {/* Featured Developments Section */}
      <section aria-labelledby='featured-developments'>
        <h2
          id='featured-developments'
          className='text-navy dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em]  pb-3 sm:pt-5'
        >
          {t('newDevelopments.section.featured')}
        </h2>

        {/* Development Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-6 my-1.5'>
          {loadingDevelopments ? (
            <div className='col-span-full text-center py-12'>Loading developments…</div>
          ) : devError ? (
            <div className='col-span-full text-center py-12 text-red-600'>{devError}</div>
          ) : filteredDevelopments.length > 0 ? (
            filteredDevelopments.map((development) => (
              <DevelopmentCard
                key={development.id}
                development={development}
                onViewDetails={handleViewDetails}
                onInquire={handleInquire}
              />
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <p className='text-gray-500 dark:text-gray-400 text-lg'>
                {t('newDevelopments.noResults', 'No developments found matching your criteria.')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Invest Section */}
      <section
        className=' my-4 py-6 lg:py-17 dark:bg-navy/20 rounded-xl'
        aria-labelledby='why-invest'
      >
        <h2
          id='why-invest'
          className='text-navy dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-4 lg:pb-8 text-center'
        >
          {t('newDevelopments.whyInvest.title')}
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-6'>
          {investmentBenefits.map((benefit, index) => (
            <WhyInvestCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </section>

      {/* Developer CTA */}
      <DeveloperCTA onListProject={handleListProject} />

      {/* Inquiry Modal */}
      {isModalOpen && selectedDevelopment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#fffff8] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#fffff8] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div>
                <h3 className="text-2xl font-bold text-charcoal">
                  Inquire about {selectedDevelopment.title ? selectedDevelopment.title.split(/\b-?\s*New Development\b/i)[0].replace(/\s*[-–—:\s]+$/,'').trim() : selectedDevelopment.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Fill out the form below and the developer will contact you shortly.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/*
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formState.fullName}
                    placeholder='Write your full name'
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>
                */}

                {/*
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    placeholder='Enter your email address'
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>
                */}

                {/*
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    placeholder='Enter your phone number'
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>
                */}

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}

                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-[15px] transition-all duration-200"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-charcoal font-semibold px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
