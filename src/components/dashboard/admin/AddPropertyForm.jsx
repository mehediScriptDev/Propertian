"use client";

import React, { useState, useEffect } from "react";
import { uploadFile } from "../../../lib/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  title: "",
  description: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  propertyType: "NEW_DEVELOPMENT",
  listingType: "SALE",
  price: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  amenities: [],
  interiorFeatures: "",
  exteriorFeatures: "",
  furnishing: "Unfurnished",
  rentalDuration: "",
  rentalTerms: "",
  images: [],
};

export default function AddPropertyForm({ translations = {}, defaultVerified = true, apiEndpoint = '/properties' }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [imagePreviews]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleNumberChange(e) {
    const { name, value } = e.target;
    const sanitized = value === "" ? "" : value.replace(/[^0-9]/g, "");
    setForm((s) => ({ ...s, [name]: sanitized }));
  }

  function handleListingTypeChange(e) {
    const val = e.target.value;
    setForm((s) => ({ ...s, listingType: val }));
    if (val !== "RENT") setForm((s) => ({ ...s, rentalDuration: "", rentalTerms: "" }));
  }

  function toggleAmenity(value) {
    setForm((s) => {
      const exists = s.amenities.includes(value);
      const next = exists ? s.amenities.filter((a) => a !== value) : [...s.amenities, value];
      return { ...s, amenities: next };
    });
  }

  function handleImagesChange(e) {
    const files = Array.from(e.target.files || []);
    setForm((s) => ({ ...s, images: files }));
    const previews = files.map((f) => URL.createObjectURL(f));
    imagePreviews.forEach((p) => URL.revokeObjectURL(p));
    setImagePreviews(previews);
  }

  function removeImageAt(index) {
    setForm((s) => {
      const next = [...s.images];
      next.splice(index, 1);
      return { ...s, images: next };
    });
    setImagePreviews((p) => {
      const next = [...p];
      const removed = next.splice(index, 1)[0];
      if (removed) URL.revokeObjectURL(removed);
      return next;
    });
  }

  function validate() {
    const err = {};
    if (!form.title.trim()) err.title = "Title is required";
    if (!form.description.trim()) err.description = "Description is required";
    if (!form.address.trim()) err.address = "Address is required";
    if (!form.city.trim()) err.city = "City is required";
    if (!form.state.trim()) err.state = "State is required";
    if (!form.zipCode.trim()) err.zipCode = "Zip code is required";
    if (!form.country.trim()) err.country = "Country is required";
    if (!String(form.price).trim()) err.price = "Price is required";
    if (!String(form.bedrooms).trim()) err.bedrooms = "Bedrooms is required";
    if (!String(form.bathrooms).trim()) err.bathrooms = "Bathrooms is required";
    if (!String(form.sqft).trim()) err.sqft = "Sqft is required";

    // Images are mandatory for listings
    if (!form.images || form.images.length === 0) err.images = "At least one image is required";

    const numFields = ["price", "bedrooms", "bathrooms", "sqft"];
    numFields.forEach((k) => {
      const v = Number(form[k]);
      if (form[k] !== "" && (isNaN(v) || v < 0)) err[k] = "Must be a valid non-negative number";
    });

    if (form.listingType === "RENT") {
      if (!form.rentalDuration.trim()) err.rentalDuration = "Rental duration is required for rentals";
      if (!form.rentalTerms.trim()) err.rentalTerms = "Rental terms are required for rentals";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("address", form.address);
      fd.append("city", form.city);
      fd.append("state", form.state);
      fd.append("zipCode", form.zipCode);
      fd.append("country", form.country);
      fd.append("propertyType", form.propertyType);
      fd.append("listingType", form.listingType);
      fd.append("price", String(form.price));
      fd.append("bedrooms", String(form.bedrooms));
      fd.append("bathrooms", String(form.bathrooms));
      fd.append("sqft", String(form.sqft));
      fd.append("interiorFeatures", form.interiorFeatures || "");
      fd.append("exteriorFeatures", form.exteriorFeatures || "");
      fd.append("furnishing", form.furnishing || "");
      if (form.listingType === "RENT") {
        fd.append("rentalDuration", form.rentalDuration || "");
        fd.append("rentalTerms", form.rentalTerms || "");
      }
      fd.append("amenities", (form.amenities || []).join(","));
      if (form.images && form.images.length) {
        form.images.forEach((file) => fd.append("images", file));
      }

      // respect caller-provided apiEndpoint and optional NEXT_PUBLIC_BASE_URL
      const base = process.env.NEXT_PUBLIC_BASE_URL || "";
      let endpoint = apiEndpoint || "/properties";
      if (!endpoint.startsWith("http") && endpoint.startsWith('/')) endpoint = `${base}${endpoint}`;
      else if (!endpoint.startsWith("http") && !endpoint.startsWith('/')) endpoint = `${base}/${endpoint}`;

      // include defaultVerified flag to inform backend of caller intent
      fd.append('isVerified', defaultVerified ? '1' : '0');

      // use project's upload helper (axios) so auth token from cookies is attached
      const json = await uploadFile(endpoint, fd);

      const successMessage = json?.message || "Property created";
      setSuccessMsg(successMessage);
      toast.success(successMessage);
      setForm(initialState);
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
      setImagePreviews([]);
    } catch (err) {
      setErrors((p) => ({ ...p, submit: err.message || "Submission failed" }));
      if (!err?.message) toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  }

  const amenityOptions = ["Pool", "Garage", "Gym", "Garden", "Air Conditioning", "Concierge", "Security"];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className=" mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Property Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <ToastContainer position="top-right" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
                <p className="text-sm text-gray-500 mb-4">Core details for the listing</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="title" name="title" value={form.title} onChange={handleInputChange} placeholder="e.g. Modern 4-bedroom villa with pool" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <textarea id="description" name="description" value={form.description} onChange={handleInputChange} placeholder="Add a detailed description of the property" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="address" name="address" value={form.address} onChange={handleInputChange} placeholder="Street address" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="city" name="city" value={form.city} onChange={handleInputChange} placeholder="City" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="state" name="state" value={form.state} onChange={handleInputChange} placeholder="State / Region" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="zipCode" name="zipCode" value={form.zipCode} onChange={handleInputChange} placeholder="Zip / Postal code" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.zipCode && <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="country" name="country" value={form.country} onChange={handleInputChange} placeholder="Country" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Pricing & Specs</h2>
                <p className="text-sm text-gray-500 mb-4">Listing type, price and size</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                    <select id="propertyType" name="propertyType" value={form.propertyType} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2">
                      <option value="HOUSE">House</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="CONDO">Condo</option>
                      <option value="TOWNHOUSE">Townhouse</option>
                      <option value="VILLA">Villa</option>
                      <option value="LAND">Land</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="OFFICE">Office</option>
                      <option value="RETAIL">Retail</option>
                      <option value="WAREHOUSE">Warehouse</option>
                      <option value="NEW_DEVELOPMENT">New Development</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">Listing Type</label>
                    <select id="listingType" name="listingType" value={form.listingType} onChange={handleListingTypeChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-[#d4af37]">
                      <option value="SALE">SALE</option>
                      <option value="RENT">RENT</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="price" name="price" type="text" inputMode="numeric" value={form.price} onChange={handleNumberChange} placeholder="e.g. 350000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">Sqft * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="sqft" name="sqft" type="text" value={form.sqft} onChange={handleNumberChange} placeholder="e.g. 4500" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.sqft && <p className="mt-1 text-xs text-red-600">{errors.sqft}</p>}
                  </div>

                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="bedrooms" name="bedrooms" type="text" value={form.bedrooms} onChange={handleNumberChange} placeholder="e.g. 4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.bedrooms && <p className="mt-1 text-xs text-red-600">{errors.bedrooms}</p>}
                  </div>

                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="bathrooms" name="bathrooms" type="text" value={form.bathrooms} onChange={handleNumberChange} placeholder="e.g. 3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.bathrooms && <p className="mt-1 text-xs text-red-600">{errors.bathrooms}</p>}
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Features</h2>
                <p className="text-sm text-gray-500 mb-4">Amenities and feature lists</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                    <div className="grid grid-cols-2 gap-2">
                      {amenityOptions.map((opt) => (
                        <label key={opt} className="inline-flex items-center space-x-2">
                          <input type="checkbox" checked={form.amenities.includes(opt)} onChange={() => toggleAmenity(opt)} />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700">Furnishing</label>
                    <select id="furnishing" name="furnishing" value={form.furnishing} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-[#d4af37]">
                      <option>Unfurnished</option>
                      <option>Furnished</option>
                      <option>Semi-Furnished</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="interiorFeatures" className="block text-sm font-medium text-gray-700">Interior Features</label>
                    <textarea id="interiorFeatures" name="interiorFeatures" value={form.interiorFeatures} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" placeholder="Comma separated or newline list" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="exteriorFeatures" className="block text-sm font-medium text-gray-700">Exterior Features</label>
                    <textarea id="exteriorFeatures" name="exteriorFeatures" value={form.exteriorFeatures} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" placeholder="Comma separated or newline list" />
                  </div>

                  {form.listingType === "RENT" && (
                    <>
                      <div>
                        <label htmlFor="rentalDuration" className="block text-sm font-medium text-gray-700">Rental Duration * <span className="text-xs text-gray-500 ml-1">required</span></label>
                        <input id="rentalDuration" name="rentalDuration" value={form.rentalDuration} onChange={handleInputChange} placeholder="e.g. 12 Months (Minimum)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                        {errors.rentalDuration && <p className="mt-1 text-xs text-red-600">{errors.rentalDuration}</p>}
                      </div>

                      <div>
                        <label htmlFor="rentalTerms" className="block text-sm font-medium text-gray-700">Rental Terms * <span className="text-xs text-gray-500 ml-1">required</span></label>
                        <input id="rentalTerms" name="rentalTerms" value={form.rentalTerms} onChange={handleInputChange} placeholder="e.g. 2 Months Deposit" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                        {errors.rentalTerms && <p className="mt-1 text-xs text-red-600">{errors.rentalTerms}</p>}
                      </div>
                    </>
                  )}
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Images</h2>
                <p className="text-sm text-gray-500 mb-4">Upload images for the listing (multiple allowed)</p>

                  <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="images" name="images" type="file" accept="image/*" multiple onChange={handleImagesChange} className="mt-1 block w-full" />
                    {errors.images && <p className="mt-1 text-xs text-red-600">{errors.images}</p>}
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {imagePreviews.map((src, i) => (
                        <div key={src} className="relative rounded-md overflow-hidden border">
                          <img src={src} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                          <button type="button" onClick={() => removeImageAt(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-600">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
              </section>

              <div className="sticky bottom-6 bg-transparent pt-4 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                    {successMsg && <p className="text-sm text-green-700">{successMsg}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => { setForm(initialState); imagePreviews.forEach((p)=>URL.revokeObjectURL(p)); setImagePreviews([]); }} className="px-4 py-2 rounded-md border bg-white">Cancel</button>
                    <button type="submit" disabled={loading} className={`px-5 py-2 rounded-md font-semibold ${loading ? "bg-gray-300 text-gray-700" : "bg-[#d4af37] text-white"}`}>
                      {loading ? "Saving..." : "Save Property"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-20">
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="w-full h-44 bg-gray-50 rounded overflow-hidden mb-3">
                  {imagePreviews[0] ? <img src={imagePreviews[0]} alt="cover preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No cover</div>}
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-gray-800">{form.title || "Property title"}</div>
                  <div className="text-gray-600">{(form.address || "") + (form.city ? ", " + form.city : "")}</div>
                  <div className="text-gray-800 mt-2">{form.price ? `$${form.price}` : "Price"}</div>
                  <div className="text-gray-600">{form.bedrooms ? `${form.bedrooms} bd` : ""} {form.bathrooms ? `${form.bathrooms} ba` : ""}</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Quick Info</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Type:</strong> {form.propertyType}</li>
                  <li><strong>Listing:</strong> {form.listingType}</li>
                  <li><strong>Furnishing:</strong> {form.furnishing}</li>
                  <li><strong>Amenities:</strong> {(form.amenities || []).join(", ") || "—"}</li>
                </ul>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}



