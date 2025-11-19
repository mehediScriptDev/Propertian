"use client";

import { useState, useRef } from "react";
export default function AddPropertyForm({ translations = {}, locale }) {
  const [form, setForm] = useState({
    id: "",
    title: "",
    location: "",
    address: "",
    city: "",
    description: "",
    developer: "",
    isVerified: false,
    priceXOF: "",
    priceUSD: "",
    propertyType: "villa",
    bedrooms: "",
    bathrooms: "",
    area: "",
    areaUnit: "sqm",
    garages: "",
    mainImage: null,
    gallery: [],
    locationDescription: "",
    developerDescription: "",
    rentalDuration: "12 Months (Minimum)",
    rentalDeposit: "2 Months Deposit",
    furnishing: "Unfurnished",
    lat: "",
    lng: "",
    featured: false,
  });

  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [mainPreview, setMainPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const galleryRef = useRef(null);

  const highlightOptions = [
    "pool",
    "living area",
    "modern kitchen",
    "master bedroom",
    "security",
    "proximity to road/market",
  ];

  // Updated to match the property detail features exactly as requested
  const interiorOptions = [
    "Modern fitted kitchen",
    "Air conditioning throughout",
    "Built-in wardrobes in all bedrooms",
    "Marble flooring",
    "High-speed internet ready",
    "Backup generator",
  ];
  const exteriorOptions = [
    "Private swimming pool",
    "Landscaped garden",
    "Secure gated community",
    "Covered parking for 2 vehicles",
    "Outdoor entertainment area",
  ];

  const [highlights, setHighlights] = useState([]);
  const [interior, setInterior] = useState([]);
  const [exterior, setExterior] = useState([]);

  // constants
  const MAX_GALLERY = 8;
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

  // generate id once on mount
  useState(() => {
    if (!form.id) {
      let id = "";
      try {
        if (typeof crypto !== "undefined" && crypto.randomUUID)
          id = crypto.randomUUID();
        else id = `prop_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      } catch (e) {
        id = `prop_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      }
      setForm((s) => ({ ...s, id }));
    }
  });

  function slugify(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "isVerified") {
      setForm((s) => ({ ...s, [name]: checked }));
      return;
    }
    if (type === "checkbox" && name === "featured") {
      setForm((s) => ({ ...s, featured: checked }));
      return;
    }
    setForm((s) => ({ ...s, [name]: value }));
    // title change handled but no slug/meta generation required
  }

  function handleMainImage(e) {
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, mainImage: "Max image size is 5MB" }));
      return;
    }
    setErrors((prev) => ({ ...prev, mainImage: undefined }));
    setForm((s) => ({ ...s, mainImage: file }));
    setMainPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleGallery(e) {
    const files = Array.from(e.target.files || []);
    const validFiles = [];
    const previews = [];
    const errs = [];
    for (let i = 0; i < files.length && validFiles.length < MAX_GALLERY; i++) {
      const f = files[i];
      if (f.size > MAX_IMAGE_BYTES) {
        errs.push(`${f.name} is larger than 5MB`);
        continue;
      }
      validFiles.push(f);
      previews.push(URL.createObjectURL(f));
    }
    if (files.length > MAX_GALLERY)
      errs.push(`Max ${MAX_GALLERY} images allowed`);
    setForm((s) => ({ ...s, gallery: validFiles }));
    setGalleryPreviews(previews);
    setErrors((prev) => ({
      ...prev,
      gallery: errs.length ? errs.join(", ") : undefined,
    }));
  }

  function toggleSelection(value, setFn, state) {
    if (state.includes(value)) setFn(state.filter((s) => s !== value));
    else setFn([...state, value]);
  }

  function validate() {
    const errs = {};
    if (!form.title) errs.title = "Title is required";
    if (!form.location && !form.city) errs.location = "Location is required";
    if (!form.developer) errs.developer = "Developer is required";
    if (!form.description) errs.description = "Description is required";
    if (!form.mainImage) errs.mainImage = "Main cover image is required";
    if (!form.priceXOF && !form.priceUSD)
      errs.price = "At least one price is required";
    if (!form.propertyType) errs.propertyType = "Property type is required";
    const numBedrooms = parseFloat(form.bedrooms);
    if (!form.bedrooms || Number.isNaN(numBedrooms) || numBedrooms < 0)
      errs.bedrooms = "Enter number of bedrooms";
    const numBathrooms = parseFloat(form.bathrooms);
    if (!form.bathrooms || Number.isNaN(numBathrooms) || numBathrooms < 0)
      errs.bathrooms = "Enter number of bathrooms";
    const areaNum = parseFloat(form.area);
    if (!form.area || Number.isNaN(areaNum) || areaNum <= 0)
      errs.area = "Enter a valid area";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function copyId() {
    try {
      navigator.clipboard.writeText(form.id);
    } catch (e) {
      console.log("copy failed", e);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const payload = {
      ...form,
      highlights,
      interior,
      exterior,
      gallery: form.gallery.map((f) => f.name || f),
      mainImage: form.mainImage ? form.mainImage.name : null,
      coordinates:
        form.lat && form.lng ? { lat: form.lat, lng: form.lng } : undefined,
    };
    console.log("Submitting property:", payload);
    setSuccess("Property saved (demo only).");
    setTimeout(() => setSuccess(""), 4000);
    // simulate save delay for UX
    setTimeout(() => setIsSubmitting(false), 800);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg md:text-2xl font-semibold">
              {translations.basicInfo || "Basic Information"}
            </h2>
            <p className="text-base md:text-lg text-gray-500">
              {"Core property details and identifiers"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm md:text-base font-medium mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            />
            {errors.title && (
              <p className="text-xs md:text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium mb-1">
              Property Type
            </label>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            >
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="commercial">Commercial</option>
              <option value="house">House</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm md:text-base font-medium mb-1">Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            />
            {errors.location && (
              <p className="text-xs md:text-sm text-red-600 mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium mb-1">
              Developer Name *
            </label>
            <input
              name="developer"
              value={form.developer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            />
            {errors.developer && (
              <p className="text-xs md:text-sm text-red-600 mt-1">{errors.developer}</p>
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm md:text-base font-medium mb-1">
              Developer Info
            </label>
            <textarea
              name="developerDescription"
              value={form.developerDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            />
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Optional: additional information about the developer or
              construction company.
            </p>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm md:text-base font-medium mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            />
            {errors.description && (
              <p className="text-xs md:text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-md md:text-lg font-semibold mb-2">
          {translations.pricing || "Pricing"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">
              Price (XOF)
            </label>
            <input
              name="priceXOF"
              value={form.priceXOF}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">
              Price (USD)
            </label>
            <input
              name="priceUSD"
              value={form.priceUSD}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">
              Area ({form.areaUnit})
            </label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.area && (
              <p className="text-xs md:text-sm text-red-600 mt-1">{errors.area}</p>
            )}
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Unit</label>
            <select
              name="areaUnit"
              value={form.areaUnit}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="sqm">sqm</option>
              <option value="sqft">sqft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Bedrooms</label>
            <input
              name="bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.bedrooms && (
              <p className="text-xs md:text-sm text-red-600 mt-1">{errors.bedrooms}</p>
            )}
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Bathrooms</label>
            <input
              name="bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.bathrooms && (
              <p className="text-xs md:text-sm text-red-600 mt-1">{errors.bathrooms}</p>
            )}
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Garages</label>
            <input
              name="garages"
              value={form.garages}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-md md:text-lg font-semibold mb-2">
          {translations.images || "Images"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="block text-sm font-medium mb-1">
              Main Cover Image (max 5MB)
            </label>
            <div className="border border-dashed border-gray-200 rounded-md p-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImage}
                className="w-full"
              />
              {errors.mainImage && (
                <p className="text-xs md:text-sm text-red-600 mt-1">{errors.mainImage}</p>
              )}
              {mainPreview && (
                <div className="mt-3 w-full rounded-md overflow-hidden border">
                  <img
                    src={mainPreview}
                    alt="main"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Gallery Images (max {MAX_GALLERY})
            </label>
            <div className="border border-dashed border-gray-200 rounded-md p-3">
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGallery}
                className="w-full"
              />
              {errors.gallery && (
                <p className="text-xs md:text-sm text-red-600 mt-1">{errors.gallery}</p>
              )}
              <div className="mt-3 grid grid-cols-3 gap-3">
                {galleryPreviews.map((src, i) => (
                  <div
                    key={i}
                    className="w-full h-24 overflow-hidden rounded-md border"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt={`gallery-${i}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-md md:text-lg font-semibold mb-2">
          {translations.features || "Features & SEO"}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <p className="text-sm text-gray-600">
            Select interior and exterior features below.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-2">Interior Features</h4>
            <div className="grid grid-cols-1 gap-2">
              {interiorOptions.map((opt) => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={interior.includes(opt)}
                    onChange={() => toggleSelection(opt, setInterior, interior)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm md:text-base">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm md:text-base font-semibold mb-2">Exterior Features</h4>
            <div className="grid grid-cols-1 gap-2">
              {exteriorOptions.map((opt) => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exterior.includes(opt)}
                    onChange={() => toggleSelection(opt, setExterior, exterior)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm md:text-base">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-md md:text-lg font-semibold mb-2">Rental Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Rental Duration</label>
            <select name="rentalDuration" value={form.rentalDuration} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>12 Months (Minimum)</option>
              <option>6 Months</option>
              <option>3 Months</option>
              <option>Flexible</option>
            </select>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Minimum term displayed by default.</p>
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Furnishing</label>
            <select name="furnishing" value={form.furnishing} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Unfurnished</option>
              <option>Partially Furnished</option>
              <option>Furnished</option>
            </select>
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Terms</label>
            <input name="rentalDeposit" value={form.rentalDeposit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            <p className="text-xs md:text-sm text-gray-500 mt-1">e.g. 2 Months Deposit</p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-md md:text-lg font-semibold mb-2">Coordinates & Extra</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              name="lat"
              value={form.lat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              name="lng"
              value={form.lng}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
            />
          </div>
          {/* <div className="flex items-center space-x-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={form.featured}
              onChange={handleChange}
            />
            <label htmlFor="featured" className="text-sm">
              Featured
            </label>
          </div> */}
        </div>
      </section>

      <div className="sticky bottom-6 bg-transparent pt-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            {success && <p className="text-sm md:text-base text-green-700">{success}</p>}
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-md border bg-white"
            >
              {translations.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-5 py-2 rounded-md font-semibold ${
                isSubmitting
                  ? "bg-gray-300 text-gray-700"
                  : "bg-[#d4af37] text-[#1e3a5f] hover:bg-[#c19b2a]"
              }`}
            >
              {isSubmitting
                ? "Saving..."
                : translations.submit || "Save Property"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
