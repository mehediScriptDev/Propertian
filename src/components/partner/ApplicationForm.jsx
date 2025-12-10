"use client";

import React, { useState } from "react";
// upload removed per client request
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/i18n";
import { ChevronDown } from "lucide-react";

export default function ApplicationForm() {
  const { locale } = useLanguage();
  const { t } = useTranslation(locale);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Developer",
    listingTypes: [],
    cityCountry: "",
    photoAssistance: "Not sure yet",
    management: "I want more information",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'listingTypes') {
      setFormData((prev) => {
        const set = new Set(prev.listingTypes);
        if (checked) set.add(value); else set.delete(value);
        return { ...prev, listingTypes: Array.from(set) };
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    if (!formData.phone.trim()) e.phone = 'Phone / WhatsApp is required';
    if (!formData.listingTypes.length) e.listingTypes = 'Select at least one listing type';
    if (!formData.cityCountry.trim()) e.cityCountry = 'City & Country is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      // show first error as alert for now
      alert(Object.values(errors)[0]);
      return;
    }

    // No backend call here per client request — just log the data
    console.log('Listing submission (client-side):', formData);
    alert('Submission received — we will contact you shortly.');
  };

  const listingOptions = [
    'Single Property',
    'Multiple Properties',
    'Entire Building / Complex',
    'Land',
    'New Development / Project',
  ];


  return (
    <section
      id="apply"
      className="max-w-4xl mx-auto lg:px-6 py-5 mb-7 lg:mb-8 scroll-mt-20"
    >
      <h2 className="text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] font-bold text-center text-charcoal mb-1.5 lg:mb-4">
        {t("Verification.ApplicationForm.title")}
      </h2>
      <p className="text-center text-charcoal-600 mb-6">
        {t("Verification.ApplicationForm.subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="bg-white/50 rounded-xl p-6 md:p-8 border border-[#f6efcb] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-base font-medium text-charcoal mb-2">Full Name <span className="text-red-500">*</span></label>
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream/40 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-base font-medium text-charcoal mb-2">Email Address <span className="text-red-500">*</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream/40 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-base font-medium text-charcoal mb-2">Phone / WhatsApp <span className="text-red-500">*</span></label>
            <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream/40 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className=" relative">
            <label className="block text-base font-medium text-charcoal mb-2">Are you a…? <span className="text-red-500">*</span></label>
            <select name="role" value={formData.role} onChange={handleInputChange} className="h-12 w-full appearance-none rounded-lg border border-gray-200 pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option>Developer</option>
              <option>Real Estate Agency</option>
              <option>Individual Property Owner</option>
              <option>Corporate Property Owner</option>
              <option>Other</option>
            </select>
            <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 translate-y-1/2 text-gray-500' />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-base font-medium text-charcoal mb-2">What would you like to list? <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {listingOptions.map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2">
                <input type="checkbox" name="listingTypes" value={opt} checked={formData.listingTypes.includes(opt)} onChange={handleInputChange} className="h-4 w-4" />
                <span className="text-base">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
          <div>
            <label className="block text-base font-medium text-charcoal mb-2">City & Country of the Property <span className="text-red-500">*</span></label>
            <input name="cityCountry" value={formData.cityCountry} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream/40 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div >
            <label className="block text-base font-medium text-charcoal mb-2">Do you want assistance taking photos/videos? <span className="text-red-500">*</span></label>
            <div className="relative">
              <select name="photoAssistance" value={formData.photoAssistance} onChange={handleInputChange} className="h-12 w-full appearance-none rounded-lg border border-gray-200 pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                <option>Yes</option>
                <option>No</option>
                <option>Not sure yet</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-3 inset-y-0 m-auto h-4 w-4 text-gray-500' />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-base font-medium text-charcoal mb-2">Do you want Q Homes to manage your listing?</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="inline-flex items-center gap-2"><input type="radio" name="management" value="Yes, full management" checked={formData.management === 'Yes, full management'} onChange={handleInputChange} /> <span className="text-base">Yes, full management</span></label>
            <label className="inline-flex items-center gap-2"><input type="radio" name="management" value="No, I will upload myself" checked={formData.management === 'No, I will upload myself'} onChange={handleInputChange} /> <span className="text-base">No, I will upload myself</span></label>
            <label className="inline-flex items-center gap-2"><input type="radio" name="management" value="I want more information" checked={formData.management === 'I want more information'} onChange={handleInputChange} /> <span className="text-base">I want more information</span></label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-base font-medium text-charcoal mb-2">Message (Optional)</label>
          <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 bg-cream/40 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />

        </div>
        <button type="submit" className="w-full py-2.5 lg:py-4 bg-primary hover:bg-primary-dark text-charcoal rounded-lg transition-all duration-200 font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">Submit Listing</button>
      </form>
    </section>
  );
}

