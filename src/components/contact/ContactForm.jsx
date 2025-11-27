"use client";

import React, { useState } from 'react';
import  ComponentTitle  from '@/components/shared/ComponentTitle';
import COUNTRY_CODES from '@/utils/countryCodes';

const ContactForm = React.memo(
  ({ title, subtitle, labels, privacyNote, submitButton }) => {
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      countryCode: '+225',
      phone: '',
      subject: '',
      message: '',
    });

    // helper: convert ISO code to emoji flag
    const isoToFlag = (iso) => {
      if (!iso) return '';
      return iso
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(127397 + char.charCodeAt(0))
        );
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      // TODO: Implement form submission logic
      console.log('Form submitted:', formData);
    };

    return (
      <section id='contact-form' className='w-full -mt-1'>
        <div className='mx-auto flex max-w-4xl flex-col items-center gap-6'>
          {/* Header */}
          <ComponentTitle title={title} subtitle={subtitle} position={'text-center'} />

          {/* Form Card */}
          <div className='w-full rounded-xl bg-white/50 border border-gray-200 p-4 shadow-sm dark:bg-navy-light sm:p-6 md:p-10'>
            <form
              onSubmit={handleSubmit}
              className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'
            >
              {/* Full Name */}
              <div className='sm:col-span-1'>
                <label className='flex flex-col'>
                  <span className='pb-2 text-[13px] font-medium text-navy dark:text-[#FFFFF0] sm:text-sm'>
                    {labels.fullName}
                  </span>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={labels.fullNamePlaceholder}
                    required
                    className='form-input h-11 w-full rounded-lg border border-navy/20 px-3 py-2 text-[14px] font-normal text-navy placeholder:text-navy/50 focus:border-[#D4AF37] focus:ring-[#D4AF37] dark:border-[#FFFFF0]/20 dark:bg-navy dark:text-[#FFFFF0] dark:placeholder:text-[#FFFFF0]/50 sm:h-12 sm:text-base'
                  />
                </label>
              </div>

              {/* Email Address */}
              <div className='sm:col-span-1'>
                <label className='flex flex-col'>
                  <span className='pb-2 text-[13px] font-medium text-navy dark:text-[#FFFFF0] sm:text-sm'>
                    {labels.email}
                  </span>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={labels.emailPlaceholder}
                    required
                    className='form-input h-11 w-full rounded-lg border border-navy/20 px-3 py-2 text-[14px] font-normal text-navy placeholder:text-navy/50 focus:border-[#D4AF37] focus:ring-[#D4AF37] dark:border-[#FFFFF0]/20 dark:bg-navy dark:text-[#FFFFF0] dark:placeholder:text-[#FFFFF0]/50 sm:h-12 sm:text-base'
                  />
                </label>
              </div>

              {/* Phone Number */}
              <div className='sm:col-span-1'>
                <label className='flex flex-col'>
                  <span className='pb-2 text-[13px] font-medium text-navy dark:text-[#FFFFF0] sm:text-sm'>
                    {labels.phone}
                  </span>
                  <div className='relative flex items-center rounded-lg border border-navy/20 overflow-hidden dark:border-[#FFFFF0]/20 focus-within:ring-0.5 focus-within:ring-[#D4AF37] focus-within:border-[#D4AF37] focus-within:shadow-sm transition-shadow'>
                        <label htmlFor='countryCode' className='sr-only'>Country code</label>
                        <div className='relative'>
                          <select
                            id='countryCode'
                            name='countryCode'
                            value={formData.countryCode}
                            onChange={handleChange}
                            className='h-11 w-28 bg-transparent pl-3 pr-8 text-[13px] text-navy dark:text-[#FFFFF0] sm:h-12 appearance-none border-r border-navy/20 dark:border-[#FFFFF0]/20 cursor-pointer focus:outline-none'
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.iso2} value={c.dial_code}>
                                {`${isoToFlag(c.iso2)} ${c.dial_code}`}
                              </option>
                            ))}
                          </select>
                          <svg
                            className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-3 text-navy dark:text-[#FFFFF0] rotate-90'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                            aria-hidden='true'
                          >
                            <path d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z' />
                          </svg>
                        </div>

                        <input
                          type='tel'
                          name='phone'
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={labels.phonePlaceholder}
                          className='form-input h-11 flex-1 border-none py-2 pl-3 pr-3 text-[14px] font-normal text-navy placeholder:text-navy/50 focus:outline-none dark:bg-navy dark:text-[#FFFFF0] dark:placeholder:text-[#FFFFF0]/50 sm:h-12 sm:text-base'
                        />
                      </div>
                </label>
              </div>

              {/* Subject */}
              <div className='sm:col-span-1'>
                <label className='flex flex-col'>
                  <span className='pb-2 text-[13px] font-medium text-navy dark:text-[#FFFFF0] sm:text-sm'>
                    {labels.subject}
                  </span>
                  <input
                    type='text'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={labels.subjectPlaceholder}
                    className='form-input h-11 w-full rounded-lg border border-navy/20 px-3 py-2 text-[14px] font-normal text-navy placeholder:text-navy/50 focus:border-[#D4AF37] focus:ring-[#D4AF37] dark:border-[#FFFFF0]/20 dark:bg-navy dark:text-[#FFFFF0] dark:placeholder:text-[#FFFFF0]/50 sm:h-12 sm:text-base'
                  />
                </label>
              </div>

              {/* Message */}
              <div className='sm:col-span-2'>
                <label className='flex flex-col'>
                  <span className='pb-2 text-[13px] font-medium text-navy dark:text-[#FFFFF0] sm:text-sm'>
                    {labels.message}
                  </span>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={labels.messagePlaceholder}
                    rows='5'
                    required
                    className='form-textarea w-full resize-y rounded-lg border border-navy/20 px-3 py-2 text-[14px] font-normal text-navy placeholder:text-navy/50 focus:border-[#D4AF37] focus:ring-[#D4AF37] dark:border-[#FFFFF0]/20 dark:bg-navy dark:text-[#FFFFF0] dark:placeholder:text-[#FFFFF0]/50 sm:text-base outline-none '
                  />
                </label>
              </div>

              {/* Footer with Privacy Note and Submit Button */}
              <div className='flex flex-col items-start justify-between gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:gap-4'>
                <p className='text-[11px] text-navy/60 dark:text-[#FFFFF0]/60 sm:text-xs'>
                  {privacyNote}
                </p>
                <button
                  type='submit'
                  className='flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-[14px] font-bold text-[#333333] transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 dark:bg-accent dark:text-navy sm:h-12 sm:w-auto sm:min-w-40 sm:text-base'
                >
                  <span>{submitButton}</span>
                  <span className='material-symbols-outlined text-xl'>
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
);

ContactForm.displayName = 'ContactForm';

export default ContactForm;
