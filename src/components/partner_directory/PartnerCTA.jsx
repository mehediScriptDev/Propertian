'use client';

import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import { useState } from "react";
import { X } from "lucide-react";

export default function PartnerCTA() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnerType: 'bank',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Partner application submitted:', formState);
    alert('Application submitted successfully!');
    setFormState({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      partnerType: 'bank',
      message: '',
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="my-2 md:my-4 md:mb-8">
        <div className="bg-[#001f3f] dark:bg-[#001f3f]/80 text-white rounded-xl shadow-lg flex flex-col md:flex-col items-center justify-between p-8 md:p-12 gap-8">
          <div className="text-center ">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {t("PartnerDirectory.partnerCTA.title")}
            </h2>
            <p className="text-lg text-white/80">
              {t("PartnerDirectory.partnerCTA.subtitle")}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-accent text-black/70 text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity"
          >
            <span>{t("PartnerDirectory.partnerCTA.button")}</span>
          </button>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background-light rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background-light border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-2xl font-bold text-charcoal">
                Become a Partner
              </h3>
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
              <p className="text-gray-600 mb-6">
                Join our network of trusted partners. Fill out the form below and we&apos;ll get back to you soon.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formState.companyName}
                    placeholder="Enter company name here"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formState.contactPerson}
                    placeholder="Enter contact person name"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>

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
                    onChange={handleChange}
                    placeholder="Enter phone or whatsApp"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="partnerType"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Partner Type
                  </label>
                  <select
                    id="partnerType"
                    name="partnerType"
                    value={formState.partnerType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[15px] transition-all duration-200"
                    required
                  >
                    <option value="bank">Bank/Mortgage</option>
                    <option value="legal">Legal/Notary</option>
                    <option value="developer">Developer</option>
                    <option value="agency">Agency</option>
                    <option value="relocation">Relocation/Concierge</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[14px] font-medium text-charcoal mb-1.5"
                  >
                    Message (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    placeholder="Write your short and clear message"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-[15px] transition-all duration-200"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                 
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-charcoal font-semibold px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
