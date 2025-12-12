"use client";

import { use, useMemo, useEffect, useState } from 'react';
import axios from '@/lib/axios'
import dynamic from 'next/dynamic'
import { useTranslation } from '@/i18n';
import {
  EventAbout,
  EventLearning,
  EventSpeakers,
  EventRegistration,
} from '@/components/event';

const EventHero = dynamic(() => import('@/components/event').then(m => m.EventHero), { ssr: false })

export default function EventPage({ params }) {
  const { locale } = use(params);
  const { t } = useTranslation(locale);
  const [firstEvent, setFirstEvent] = useState(null)


  // Translations (prefer API `firstEvent` values when available)
  const heroTranslations = useMemo(
    () => ({
      title: firstEvent?.title || '',
      subtitle: firstEvent?.description || t('event.hero.subtitle'),
      cta: t('event.hero.cta'),
    }),
    [t, firstEvent]
  );

  const countdownTranslations = useMemo(
    () => ({
      days: t('event.countdown.days'),
      hours: t('event.countdown.hours'),
      minutes: t('event.countdown.minutes'),
      seconds: t('event.countdown.seconds'),
    }),
    [t]
  );

  const aboutTranslations = useMemo(
    () => ({
      title: t('event.about.title'),
      description: firstEvent?.description || t('event.about.description'),
      dateTimeLabel: t('event.about.dateTimeLabel'),
      dateTime: firstEvent ? `${new Date(firstEvent.eventDate).toLocaleString()} — ${new Date(firstEvent.endDate).toLocaleString()}` : t('event.about.dateTime'),
      locationLabel: t('event.about.locationLabel'),
      location: firstEvent?.location || t('event.about.location'),
    }),
    [t, firstEvent]
  );

  const learningTranslations = useMemo(
    () => ({
      title: t('event.learning.title'),
      point1: firstEvent?.learningPoints?.[0]?.text || t('event.learning.point1'),
      point2: firstEvent?.learningPoints?.[1]?.text || t('event.learning.point2'),
      point3: firstEvent?.learningPoints?.[2]?.text || t('event.learning.point3'),
      point4: firstEvent?.learningPoints?.[3]?.text || t('event.learning.point4'),
    }),
    [t, firstEvent]
  );

  const speakersTranslations = useMemo(
    () => ({
      title: t('event.speakers.title'),
      speaker1Name: firstEvent?.speakers?.[0]?.name || t('event.speakers.speaker1Name'),
      speaker1Role: firstEvent?.speakers?.[0]?.role || t('event.speakers.speaker1Role'),
      speaker2Name: firstEvent?.speakers?.[1]?.name || t('event.speakers.speaker2Name'),
      speaker2Role: firstEvent?.speakers?.[1]?.role || t('event.speakers.speaker2Role'),
    }),
    [t, firstEvent]
  );

  const registrationTranslations = useMemo(
    () => ({
      title: t('event.registration.title'),
      subtitle: t('event.registration.subtitle'),
      fullName: t('event.registration.fullName'),
      fullNamePlaceholder: t('event.registration.fullNamePlaceholder'),
      email: t('event.registration.email'),
      emailPlaceholder: t('event.registration.emailPlaceholder'),
      phone: t('event.registration.phone'),
      phonePlaceholder: t('event.registration.phonePlaceholder'),
      submit: t('event.registration.submit'),
      shareEvent: t('event.registration.shareEvent'),
    }),
    [t]
  );
  useEffect(() => {
    let mounted = true
    const fetchFirst = async () => {
      try {
        const res = await axios.get('/events')
        console.log('events API response:', res)
        const list = res?.data?.data ?? res?.data
        console.log('events list:', list)
        if (Array.isArray(list) && list.length > 0 && mounted) {
          // Choose the next upcoming event (closest event after now). If none found, pick the closest past event.
          const now = Date.now()
          const withDates = list.filter(e => e && e.eventDate)
          const upcoming = withDates
            .filter(e => new Date(e.eventDate).getTime() > now)
            .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

          let chosen = upcoming.length > 0 ? upcoming[0] : null;

          if (!chosen) {
            // No upcoming events: choose the event whose date is closest to now (past or future)
            const byClosest = withDates.slice().sort((a, b) => Math.abs(new Date(a.eventDate).getTime() - now) - Math.abs(new Date(b.eventDate).getTime() - now));
            chosen = byClosest[0] || list[0];
          }

          setFirstEvent(chosen)
          console.log('firstEvent:', chosen)
        }
      } catch (e) {
        console.warn('Failed to load events', e)
      }
    }
    fetchFirst()
    return () => { mounted = false }
  }, [])
  return (
    <div className='min-h-screen bg-background-light'>
      <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        {/* First event image from API (show only first) */}
        {/* {firstEvent?.image && (
          <div className='mb-6'>
            <img src={firstEvent.image} alt={firstEvent.title || 'event image'} className='w-full h-64 object-cover rounded-md' loading='lazy' />
          </div>
        )} */}
        {/* Hero Section */}
        <div className='mb-8 sm:mb-12'>
          <EventHero
            targetDate={firstEvent?.eventDate}
            translations={heroTranslations}
            countdownTranslations={countdownTranslations}
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6'>
          {/* Left Column - Event Details */}
          <div className='lg:col-span-2 space-y-3 lg:space-y-6'>
            <EventAbout translations={aboutTranslations} />
            <EventLearning translations={learningTranslations} />
            <EventSpeakers translations={speakersTranslations} />
          </div>

          {/* Right Column - Registration Form (Sticky) */}
          <div className='lg:col-span-1'>
            <div id='event-registration' className='lg:sticky lg:top-24'>
              <EventRegistration translations={registrationTranslations} event={firstEvent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

