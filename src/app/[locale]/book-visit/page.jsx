"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Bed, Square, ParkingCircle } from 'lucide-react';

export default function HotelBooking() {
  const [category, setCategory] = useState(() => {
    try {
      if (typeof window === 'undefined') return 'Buy';
      const params = new URLSearchParams(window.location.search);
      const type = params.get('type');
      if (!type) return 'Buy';
      return type.toLowerCase() === 'rent' ? 'Rent' : 'Buy';
    } catch (e) {
      return 'Buy';
    }
  });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [property, setProperty] = useState(() => {
    try {
      if (typeof window === 'undefined') return '';
      const params = new URLSearchParams(window.location.search);
      const prop = params.get('property');
      return prop ? decodeURIComponent(prop) : '';
    } catch (e) {
      return '';
    }
  });
  const [message, setMessage] = useState('');

  // Room feature params: ?bedrooms=4&bathrooms=4&size=350&garages=2 - lazy init to avoid effect
  const [bedrooms, setBedrooms] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;
      const params = new URLSearchParams(window.location.search);
      const b = params.get('bedrooms');
      return b ? Number(b) : null;
    } catch (e) {
      return null;
    }
  });
  const [bathrooms, setBathrooms] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;
      const params = new URLSearchParams(window.location.search);
      const bath = params.get('bathrooms');
      return bath ? Number(bath) : null;
    } catch (e) {
      return null;
    }
  });
  const [size, setSize] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;
      const params = new URLSearchParams(window.location.search);
      const s = params.get('size');
      return s ? s : null;
    } catch (e) {
      return null;
    }
  });
  const [garages, setGarages] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;
      const params = new URLSearchParams(window.location.search);
      const g = params.get('garages');
      return g ? Number(g) : null;
    } catch (e) {
      return null;
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      fullName,
      email,
      phone,
      preferredDateTime,
      property,
      message,
    };

    // Replace with real submission later. For now provide simple feedback.
    console.log('Book visit payload:', payload);
    alert('Request submitted — check console for details.');
    // optional: reset form except property
    setFullName('');
    setEmail('');
    setPhone('');
    setPreferredDateTime('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background-light  px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          {/* Left Column - Booking Form (updated fields) */}
          <div className="bg-white/50 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Book a Visit</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                  <button
                    type="button"
                    title="Required (message is optional)"
                    aria-label="Required"
                    className="ml-2 text-yellow-500 font-bold"
                  >
                    *
                  </button>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={fullName}
                  placeholder='Write your full name'
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background-light outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f6efd1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                  <button
                    type="button"
                    title="Required (message is optional)"
                    aria-label="Required"
                    className="ml-2 text-yellow-500 font-bold"
                  >
                    *
                  </button>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  placeholder='Write your email address'
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background-light outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f6efd1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone / WhatsApp
                  <button
                    type="button"
                    title="Required (message is optional)"
                    aria-label="Required"
                    className="ml-2 text-yellow-500 font-bold"
                  >
                    *
                  </button>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={phone}
                  placeholder='Write your phone number'
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-background-light outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f6efd1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Preferred Date &amp; Time
                  <button
                    type="button"
                    title="Required (message is optional)"
                    aria-label="Required"
                    className="ml-2 text-yellow-500 font-bold"
                  >
                    *
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="preferredDateTime"
                    value={preferredDateTime}
                    onChange={(e) => setPreferredDateTime(e.target.value)}
                    className="w-full px-4 py-3 border bg-background-light outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f6efd1] focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Property
                  <button
                    type="button"
                    title="Required ()"
                    aria-label="Required"
                    className="ml-2 text-yellow-500 font-bold"
                    
                  >
                    *
                  </button>
                </label>
                <input
                  type="text"
                  name="property"
                  readOnly
                  value={property}
                  placeholder="Property (leave it blank if not specified)"
                  className="w-full px-4 py-3 bg-background-light outline-none border border-gray-200 rounded-lg text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Message (optional)</label>
                <textarea
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-background-light outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f6efd1] focus:border-transparent"
                  placeholder="Any details we should know"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Request Visit
                </button>
                
              </div>
            </form>
          </div>

          {/* Right Column - Room / Property Details (kept as-is) */}
          <div>
            <div className="bg-white/50 rounded-lg shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=400&fit=crop"
                alt="Deluxe Room"
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">Deluxe Room</h2>
                  <span className="text-2xl font-bold">$250</span>
                </div>

                <p className="text-gray-600 mb-6">
                  The room has a double-sized bed draped in soft, flowing linens, a deep, freestanding tub overlooking the jungle, and a rain shower with a glass ceiling to enjoy the tropical sky.
                </p>

                <h3 className="font-semibold mb-4">Room features</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-start gap-1 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-primary">
                      <Bed className="w-5 h-5" />
                      <span className="text-lg font-bold">{bedrooms ?? '—'}</span>
                    </div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>

                  <div className="flex flex-col items-start gap-1 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="text-lg font-bold">{bathrooms ?? '—'}</span>
                    </div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>

                  <div className="flex flex-col items-start gap-1 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-primary">
                      <Square className="w-5 h-5" />
                      <span className="text-lg font-bold">{size ? `${size} m²` : '—'}</span>
                    </div>
                    <div className="text-sm text-gray-600">Size</div>
                  </div>

                  {garages ? (
                    <div className="flex flex-col items-start gap-1 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-primary">
                        <ParkingCircle className="w-5 h-5" />
                        <span className="text-lg font-bold">{garages}</span>
                      </div>
                      <div className="text-sm text-gray-600">Garages</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-1 p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 italic">No garage info</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}