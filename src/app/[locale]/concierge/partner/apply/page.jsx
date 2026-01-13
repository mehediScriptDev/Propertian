/** @format */

"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiGlobe,
} from "react-icons/fi";
import { conciergePartnerAPI } from "@/services/conciergeAPI";

export default function PartnerApplicationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    serviceCategories: [],
    experience: "",
    certifications: [],
    languages: [],
    availabilityHours: "",
    serviceArea: [],
    pricing: "",
    references: "",
    website: "",
    description: "",
  });

  const serviceCategories = [
    { value: "AIRPORT_TRANSFER", label: "Airport Transfer" },
    { value: "TOURISM_EXCURSIONS", label: "Tourism & Excursions" },
    { value: "RESTAURANT_BOOKING", label: "Restaurant Booking" },
    { value: "EVENT_TICKETS", label: "Event Tickets" },
    { value: "PERSONAL_SHOPPING", label: "Personal Shopping" },
    { value: "TRANSLATION", label: "Translation Services" },
    { value: "LEGAL_ASSISTANCE", label: "Legal Assistance" },
    { value: "MEDICAL_APPOINTMENT", label: "Medical Appointments" },
    { value: "HOME_SETUP", label: "Home Setup" },
    { value: "SCHOOL_ENROLLMENT", label: "School Enrollment" },
    { value: "OTHER", label: "Other Services" },
  ];

  const languages = [
    "French",
    "English",
    "Arabic",
    "Spanish",
    "German",
    "Mandarin",
    "Other",
  ];

  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter((c) => c !== category)
        : [...prev.serviceCategories, category],
    }));
  };

  const handleLanguageToggle = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleArrayInput = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.serviceCategories.length === 0) {
      toast.error("Please select at least one service category");
      return;
    }

    if (formData.languages.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    try {
      setSubmitting(true);
      const response = await conciergePartnerAPI.applyAsPartner(formData);

      if (response.success) {
        toast.success(
          "Application submitted successfully! We will review it and contact you soon."
        );
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='bg-linear-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white mb-8'>
          <h1 className='text-3xl font-bold mb-2'>
            Become a Concierge Partner
          </h1>
          <p className='text-blue-100'>
            Join our network of trusted service providers and help newcomers
            settle into Côte d'Ivoire
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-lg shadow p-8 space-y-8'
        >
          {/* Company Information */}
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
              <FiBriefcase className='mr-2' />
              Company Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Company Name *
                </label>
                <input
                  type='text'
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Contact Person *
                </label>
                <input
                  type='text'
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  required
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address *
                </label>
                <div className='relative'>
                  <FiMail className='absolute left-3 top-3 text-gray-400' />
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className='w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phone Number *
                </label>
                <div className='relative'>
                  <FiPhone className='absolute left-3 top-3 text-gray-400' />
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className='w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Website
                </label>
                <div className='relative'>
                  <FiGlobe className='absolute left-3 top-3 text-gray-400' />
                  <input
                    type='url'
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder='https://...'
                    className='w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Address
                </label>
                <input
                  type='text'
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>
              Services You Offer *
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
              {serviceCategories.map((category) => (
                <button
                  key={category.value}
                  type='button'
                  onClick={() => handleCategoryToggle(category.value)}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.serviceCategories.includes(category.value)
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>
              Languages Spoken *
            </h2>
            <div className='grid grid-cols-3 md:grid-cols-4 gap-3'>
              {languages.map((language) => (
                <button
                  key={language}
                  type='button'
                  onClick={() => handleLanguageToggle(language)}
                  className={`p-3 border-2 rounded-lg text-sm font-medium ${
                    formData.languages.includes(language)
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Experience & Qualifications */}
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
              <FiAward className='mr-2' />
              Experience & Qualifications
            </h2>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Years of Experience
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  rows={3}
                  placeholder='Describe your experience in providing concierge services...'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Certifications (comma-separated)
                </label>
                <input
                  type='text'
                  placeholder="e.g., Tourism License, Driver's License, First Aid Certified"
                  onChange={(e) =>
                    handleArrayInput("certifications", e.target.value)
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Service Areas (comma-separated cities/regions)
                </label>
                <input
                  type='text'
                  placeholder='e.g., Abidjan, Yamoussoukro, Grand-Bassam'
                  onChange={(e) =>
                    handleArrayInput("serviceArea", e.target.value)
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Availability Hours
                </label>
                <input
                  type='text'
                  value={formData.availabilityHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availabilityHours: e.target.value,
                    })
                  }
                  placeholder='e.g., Monday-Friday 9AM-6PM, Weekends on request'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Pricing Information
                </label>
                <textarea
                  value={formData.pricing}
                  onChange={(e) =>
                    setFormData({ ...formData, pricing: e.target.value })
                  }
                  rows={2}
                  placeholder='General pricing structure or rate range...'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  References (Optional)
                </label>
                <textarea
                  value={formData.references}
                  onChange={(e) =>
                    setFormData({ ...formData, references: e.target.value })
                  }
                  rows={2}
                  placeholder='Previous clients or professional references...'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Company Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  placeholder='Tell us about your company and what makes your services unique...'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
            <h3 className='font-semibold text-gray-900 mb-3'>
              Partner Agreement
            </h3>
            <ul className='text-sm text-gray-700 space-y-2'>
              <li>• I agree to provide professional and reliable services</li>
              <li>
                • I understand that quotes must be submitted within 24 hours of
                assignment
              </li>
              <li>• I agree to maintain communication through the platform</li>
              <li>• I accept the platform's commission structure</li>
              <li>• I will maintain necessary licenses and insurance</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end gap-4'>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={submitting}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
