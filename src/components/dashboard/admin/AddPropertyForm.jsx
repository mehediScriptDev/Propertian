"use client";

import { useState, useRef } from "react";
import { post } from "../../../lib/api";
import { ChevronDown } from "lucide-react";

export default function AddPropertyForm({ translations = {} }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    propertyType: "villa",
    listingType: "SALE",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    amenities: "",
    rentalDuration: "12 Months (Minimum)",
    furnishing: "Unfurnished",
    rentalTerms: "",
    mainImage: null,
    gallery: [],
  });

  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [mainPreview, setMainPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const galleryRef = useRef(null);

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

  const [interiorFeatures, setInteriorFeatures] = useState([]);
  const [exteriorFeatures, setExteriorFeatures] = useState([]);

  const [openDropdowns, setOpenDropdowns] = useState({
    propertyType: false,
    listingType: false,
    rentalDuration: false,
    furnishing: false,
  });

  const MAX_GALLERY = 8;
  const MIN_GALLERY = 4;
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
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
    if (files.length > MAX_GALLERY) errs.push(`Max ${MAX_GALLERY} images allowed`);
    setForm((s) => ({ ...s, gallery: validFiles }));
    setGalleryPreviews(previews);
    setErrors((prev) => ({ ...prev, gallery: errs.length ? errs.join(", ") : undefined }));
  }

  function toggleSelection(value, setFn, state) {
    if (state.includes(value)) setFn(state.filter((s) => s !== value));
    else setFn([...state, value]);
  }

  function validate() {
    const errs = {};
    if (!form.title) errs.title = "Title is required";
    if (!form.description) errs.description = "Description is required";
    if (!form.address) errs.address = "Address is required";
    if (!form.city) errs.city = "City is required";
    if (!form.state) errs.state = "State is required";
    if (!form.zipCode) errs.zipCode = "Zip Code is required";
    if (!form.country) errs.country = "Country is required";
    if (!form.propertyType) errs.propertyType = "Property type is required";
    if (!form.listingType) errs.listingType = "Listing type is required";
    if (!form.price) errs.price = "Price is required";
    const numBedrooms = parseFloat(form.bedrooms);
    if (isNaN(numBedrooms) || numBedrooms < 0) errs.bedrooms = "Enter number of bedrooms";
    const numBathrooms = parseFloat(form.bathrooms);
    if (isNaN(numBathrooms) || numBathrooms < 0) errs.bathrooms = "Enter number of bathrooms";
    if (!form.sqft) errs.sqft = "Sqft is required";
    // Image validation removed - not required for JSON POST
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      console.log('Form data:', form);

      const allowed = [
        "title",
        "description",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
        "propertyType",
        "listingType",
        "price",
        "bedrooms",
        "bathrooms",
        "sqft",
        "rentalDuration",
        "furnishing",
        "rentalTerms",
      ];

      const payload = {};
      allowed.forEach((k) => {
        const v = form[k];
        if (v !== undefined && v !== null && String(v) !== "") payload[k] = v;
      });

      if (form.amenities) payload.amenities = form.amenities;
      payload.interiorFeatures = interiorFeatures;
      payload.exteriorFeatures = exteriorFeatures;

      console.log('Payload to send:', payload);

      const result = await post("/properties", payload);
      setSuccess(result?.message || "Property saved");
      alert(result?.message || "Property saved");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("submit error", err);
      const serverMsg = err?.response?.data?.message || "Save failed";
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors) setErrors(serverErrors);
      setErrors((prev) => ({ ...prev, submit: serverMsg }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div>
          <h2 className="text-lg md:text-2xl font-semibold">{translations.basicInfo || "Basic Information"}</h2>
          <p className="text-base md:text-lg text-gray-500">Core property details</p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm md:text-base font-medium mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.title && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm md:text-base font-medium mb-1">Property Type</label>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              onFocus={() => setOpenDropdowns(prev => ({ ...prev, propertyType: true }))}
              onBlur={() => setOpenDropdowns(prev => ({ ...prev, propertyType: false }))}
              className="w-full px-3 py-2 border appearance-none border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]"
            >
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="commercial">Commercial</option>
              <option value="house">House</option>
              <option value="land">Land</option>
            </select>
            <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 translate-y-1/2 text-gray-500 transition-transform duration-200 ${openDropdowns.propertyType ? 'rotate-180' : ''}`} />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm md:text-base font-medium mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm md:text-base font-medium mb-1">Address *</label>
            <input name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.address && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium mb-1">City *</label>
            <input name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.city && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium mb-1">State *</label>
            <input name="state" value={form.state} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.state && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Zip Code *</label>
            <input name="zipCode" value={form.zipCode} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.zipCode && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.zipCode}</p>}
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm md:text-base font-medium mb-1">Country *</label>
            <input name="country" value={form.country} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.country && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.country}</p>}
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm md:text-base font-medium mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.description && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-md md:text-lg font-semibold mb-2">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm md:text-base font-medium mb-1">Listing Type</label>
            <select
              name="listingType"
              value={form.listingType}
              onChange={handleChange}
              onFocus={() => setOpenDropdowns(prev => ({ ...prev, listingType: true }))}
              onBlur={() => setOpenDropdowns(prev => ({ ...prev, listingType: false }))}
              className="w-full px-3 py-2 border appearance-none border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]"
            >
              <option value="SALE">Sale</option>
              <option value="RENT">Rent</option>
            </select>
            <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 translate-y-1/2 text-gray-500 transition-transform duration-200 ${openDropdowns.listingType ? 'rotate-180' : ''}`} />
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Price *</label>
            <input name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.price && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Sqft *</label>
            <input name="sqft" value={form.sqft} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.sqft && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.sqft}</p>}
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Bedrooms *</label>
            <input name="bedrooms" value={form.bedrooms} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.bedrooms && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.bedrooms}</p>}
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Bathrooms *</label>
            <input name="bathrooms" value={form.bathrooms} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
            {errors.bathrooms && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.bathrooms}</p>}
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-md md:text-lg font-semibold mb-2">Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="block text-sm font-medium mb-1">Main Cover Image (max 5MB)</label>
            <div className="border border-dashed border-gray-200 rounded-md p-3">
              <input type="file" accept="image/*" onChange={handleMainImage} className="w-full" />
              {errors.mainImage && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.mainImage}</p>}
              {mainPreview && (
                <div className="mt-3 w-full rounded-md overflow-hidden border">
                  <img src={mainPreview} alt="main" className="w-full h-48 object-cover" />
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Gallery Images (min {MIN_GALLERY})</label>
            <div className="border border-dashed border-gray-200 rounded-md p-3">
              <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGallery} className="w-full" />
              {errors.gallery && <p className="text-xs md:text-sm text-red-600 mt-1">{errors.gallery}</p>}
              <div className="mt-3 grid grid-cols-3 gap-3">
                {galleryPreviews.map((src, i) => (
                  <div key={i} className="w-full h-24 overflow-hidden rounded-md border">
                    <img src={src} className="w-full h-full object-cover" alt={`gallery-${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-md md:text-lg font-semibold mb-2">Features</h3>
        <div className="mt-3">
          <label className="block text-sm md:text-base font-medium mb-1">Amenities (comma separated)</label>
          <input name="amenities" value={form.amenities} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-2">Interior Features</h4>
            <div className="grid grid-cols-1 gap-2">
              {interiorOptions.map((opt) => (
                <label key={opt} className="flex items-center space-x-2">
                  <input type="checkbox" checked={interiorFeatures.includes(opt)} onChange={() => toggleSelection(opt, setInteriorFeatures, interiorFeatures)} className="w-4 h-4" />
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
                  <input type="checkbox" checked={exteriorFeatures.includes(opt)} onChange={() => toggleSelection(opt, setExteriorFeatures, exteriorFeatures)} className="w-4 h-4" />
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
          <div className="relative">
            <label className="block text-sm md:text-base font-medium mb-1">Rental Duration</label>
            <select
              name="rentalDuration"
              value={form.rentalDuration}
              onChange={handleChange}
              onFocus={() => setOpenDropdowns(prev => ({ ...prev, rentalDuration: true }))}
              onBlur={() => setOpenDropdowns(prev => ({ ...prev, rentalDuration: false }))}
              className="w-full px-3 py-2 border appearance-none border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]"
            >
              <option>12 Months (Minimum)</option>
              <option>6 Months</option>
              <option>3 Months</option>
              <option>Flexible</option>
            </select>
            <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 translate-y-1/2 text-gray-500 transition-transform duration-200 ${openDropdowns.rentalDuration ? 'rotate-180' : ''}`} />
          </div>

          <div className="relative">
            <label className="block text-sm md:text-base font-medium mb-1">Furnishing</label>
            <select
              name="furnishing"
              value={form.furnishing}
              onChange={handleChange}
              onFocus={() => setOpenDropdowns(prev => ({ ...prev, furnishing: true }))}
              onBlur={() => setOpenDropdowns(prev => ({ ...prev, furnishing: false }))}
              className="w-full px-3 py-2 border appearance-none border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]"
            >
              <option>Unfurnished</option>
              <option>Partially Furnished</option>
              <option>Furnished</option>
            </select>
            <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 translate-y-1/2 text-gray-500 transition-transform duration-200 ${openDropdowns.furnishing ? 'rotate-180' : ''}`} />
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium mb-1">Rental Terms</label>
            <input name="rentalTerms" value={form.rentalTerms} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0 focus:ring-2 focus:ring-[#d4af37]" />
          </div>
        </div>
      </section>

      <div className="sticky bottom-6 bg-transparent pt-4">
        <div className="flex items-center justify-between">
          <div>
            {/* {success && <p className="text-sm md:text-base text-green-700">{success}</p>}
            {errors.submit && <p className="text-sm md:text-base text-red-600">{errors.submit}</p>} */}
          </div>
          <div className="flex items-center space-x-3">
            <button type="button" onClick={() => window.history.back()} className="px-4 py-2 rounded-md border border-gray-300 bg-white">{translations.cancel || "Cancel"}</button>
            <button type="submit" disabled={isSubmitting} className={`inline-flex items-center px-5 py-2 rounded-md font-semibold ${isSubmitting ? "bg-gray-300 text-gray-700" : "bg-[#d4af37] text-[#FFFFFF] "}`}>
              {isSubmitting ? "Saving..." : translations.submit || "Save Property"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}


