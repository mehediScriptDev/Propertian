'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { getTranslation } from '@/i18n';

export default function Header({ locale }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const translations = getTranslation(locale);
  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const navLinks = [
    { href: `/${locale}/buy`, label: t('nav.buy') },
    { href: `/${locale}/rent`, label: t('nav.rent') },
    {
      href: `/${locale}/properties/residential`,
      label: t('nav.newDevelopments'),
    },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
    { href: `/${locale}/blog`, label: t('nav.blog') },
  ];

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className='sticky top-0 z-50 border-b border-solid border-primary/20 bg-background-light/95 backdrop-blur-md dark:bg-background-dark/95 shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className='flex items-center shrink-0'
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image
            src='/logo.png'
            alt='Q Global Living'
            width={85}
            height={40}
            className='h-4 w-auto object-contain'
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6 lg:gap-8'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className='text-sm font-medium text-charcoal dark:text-soft-grey hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap'
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className='hidden md:flex items-center gap-3'>
          <Link
            href={`/${locale}/login`}
            className='flex items-center justify-center h-10 px-4 rounded-lg border border-primary text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white whitespace-nowrap'
          >
            Sign In
          </Link>
          <Link
            href={`/${locale}/event`}
            className='flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-md whitespace-nowrap'
          >
            {t('nav.listYourProperty')}
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </div>

        {/* Mobile Actions */}
        <div className='flex md:hidden items-center gap-2'>
          <LanguageSwitcher currentLocale={locale} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='flex items-center justify-center w-10 h-10 rounded-lg text-charcoal dark:text-soft-grey hover:bg-primary/10 transition-colors'
            aria-label='Toggle menu'
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className='md:hidden fixed inset-x-0 bg-background-light dark:bg-background-dark z-40 overflow-y-auto border-b border-primary/20 shadow-lg'
          style={{ top: '61px', maxHeight: 'calc(100vh - 61px)' }}
        >
          <nav className='flex flex-col px-4 py-6 space-y-1'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className='px-4 py-3 text-base font-medium text-charcoal dark:text-soft-grey hover:bg-primary/10 hover:text-primary rounded-lg transition-colors'
              >
                {link.label}
              </Link>
            ))}
            <div className='pt-4 border-t border-primary/20 space-y-3'>
              <Link
                href={`/${locale}/login`}
                onClick={() => setMobileMenuOpen(false)}
                className='flex items-center justify-center w-full h-12 px-4 rounded-lg border border-primary text-base font-semibold text-primary hover:bg-primary hover:text-white transition-colors'
              >
                Sign In
              </Link>
              <Link
                href={`/${locale}/event`}
                onClick={() => setMobileMenuOpen(false)}
                className='flex items-center justify-center w-full h-12 px-4 rounded-lg bg-primary text-base font-semibold text-white hover:bg-primary/90 transition-colors'
              >
                {t('nav.listYourProperty')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
