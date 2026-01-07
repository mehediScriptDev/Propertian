"use client";

import React, { useState, useEffect, useRef } from "react";
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

export default function AddPropertyForm({
  translations = {},
  defaultVerified = true,
  apiEndpoint = "properties",
}) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // For form submission
  const [successMsg, setSuccessMsg] = useState("");
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const imagesRef = useRef(null);

  // --- Location Logic States ---
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  // Backup Data (Used if API fails or for fast testing)
  const backupData = {
    "Bangladesh": {
      "Dhaka": {
        "Dhaka City": ["1000", "1205", "1212", "1230"],
        "Savar": ["1340", "1341", "1344"],
        "Gazipur": ["1700", "1704"]
      },
      "Chittagong": {
        "Chittagong City": ["4000", "4100", "4202"],
        "Cox's Bazar": ["4700", "4701"]
      },
      "Sylhet": {
        "Sylhet City": ["3100", "3104"],
        "Beanibazar": ["3170"]
      }
    },
    "India": {
      "Maharashtra": {
        "Mumbai": ["400001", "400050", "400070"],
        "Pune": ["411001", "411007"]
      },
      "West Bengal": {
        "Kolkata": ["700001", "700091"],
        "Darjeeling": ["734101"]
      }
    },
    "United States": {
      "California": {
        "Los Angeles": ["90001", "90011", "90045"],
        "San Francisco": ["94102", "94110"]
      },
      "New York": {
        "New York City": ["10001", "10010", "10020"],
        "Buffalo": ["14201", "14202"]
      }
    }
  };

  // Fetch Countries on Mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLocationLoading(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
        const data = await response.json();
        
        if (!data.error) {
          // Sorting countries alphabetically
          const countryList = data.data.map(c => ({ name: c.name, iso2: c.iso2 })).sort((a, b) => a.name.localeCompare(b.name));
          setCountries(countryList);
        } else {
          throw new Error("API Error");
        }
      } catch (err) {
        console.error("API failed, using backup data for Countries");
        const backupCountries = Object.keys(backupData).map(name => ({ name, iso2: name.substring(0,2).toUpperCase() }));
        setCountries(backupCountries);
      } finally {
        setLocationLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [imagePreviews]);

  // --- Location Handlers ---

  const handleCountryChange = async (e) => {
    const countryName = e.target.value;
    
    // Update form state and reset dependent fields
    setForm(s => ({ 
      ...s, 
      country: countryName,
      state: "",
      city: "",
      zipCode: "" 
    }));
    
    setStates([]);
    setCities([]);
    setZipCodes([]);

    if (!countryName) return;

    setLocationLoading(true);
    try {
      if (backupData[countryName]) {
        setStates(Object.keys(backupData[countryName]).map(s => ({ name: s })));
        setLocationLoading(false);
        return;
      }

      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName })
      });
      const data = await response.json();
      
      if (!data.error && data.data.states.length > 0) {
        setStates(data.data.states);
      } else {
        setStates([]);
      }
    } catch (err) {
      console.error("Error fetching states:", err);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    
    setForm(s => ({ 
      ...s, 
      state: stateName,
      city: "",
      zipCode: "" 
    }));
    
    setCities([]);
    setZipCodes([]);

    if (!stateName) return;

    setLocationLoading(true);
    try {
      if (backupData[form.country] && backupData[form.country][stateName]) {
        setCities(Object.keys(backupData[form.country][stateName]).map(c => ({ name: c })));
        setLocationLoading(false);
        return;
      }

      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: form.country, state: stateName })
      });
      const data = await response.json();
      
      if (!data.error && data.data.length > 0) {
        setCities(data.data.map(city => ({ name: city })));
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    
    setForm(s => ({ 
      ...s, 
      city: cityName,
      zipCode: "" 
    }));
    
    setZipCodes([]);

    if (backupData[form.country] && 
        backupData[form.country][form.state] && 
        backupData[form.country][form.state][cityName]) {
      setZipCodes(backupData[form.country][form.state][cityName]);
    } else {
      // Mock logic for API-fetched cities
      const mockZip = Math.floor(1000 + Math.random() * 9000);
      setZipCodes([
        `${mockZip}`, 
        `${mockZip + 15}`, 
        `${mockZip + 42}`
      ]);
    }
  };

  const handleZipChange = (e) => {
    setForm(s => ({ ...s, zipCode: e.target.value }));
  };

  // --- End Location Handlers ---

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
    if (val !== "RENT")
      setForm((s) => ({ ...s, rentalDuration: "", rentalTerms: "" }));
  }

  function toggleAmenity(value) {
    setForm((s) => {
      const exists = s.amenities.includes(value);
      const next = exists
        ? s.amenities.filter((a) => a !== value)
        : [...s.amenities, value];
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
    if (!form.city.trim()) err.city = "City is required";
    if (!form.state.trim()) err.state = "State is required";
    if (!form.zipCode.trim()) err.zipCode = "Zip code is required";
    if (!form.country.trim()) err.country = "Country is required";
    if (!String(form.price).trim()) err.price = "Price is required";
    if (!String(form.bedrooms).trim()) err.bedrooms = "Bedrooms is required";
    if (!String(form.bathrooms).trim()) err.bathrooms = "Bathrooms is required";
    if (!String(form.sqft).trim()) err.sqft = "Sqft is required";

    // Images are mandatory for listings
    if (!form.images || form.images.length === 0)
      err.images = "At least one image is required";

    const numFields = ["price", "bedrooms", "bathrooms", "sqft"];
    numFields.forEach((k) => {
      const v = Number(form[k]);
      if (form[k] !== "" && (isNaN(v) || v < 0))
        err[k] = "Must be a valid non-negative number";
    });

    if (form.listingType === "RENT") {
      if (!form.rentalDuration.trim())
        err.rentalDuration = "Rental duration is required for rentals";
      if (!form.rentalTerms.trim())
        err.rentalTerms = "Rental terms are required for rentals";
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
      fd.append("isVerified", defaultVerified ? "1" : "0");

      // Use the endpoint as-is since axios baseURL is already set
      const endpoint = apiEndpoint || "/properties";
      
      console.log("Submitting to:", endpoint);
      console.log("Form data:", {
        title: form.title,
        city: form.city,
        price: form.price,
        images: form.images.length
      });

      const json = await uploadFile(endpoint, fd);

      console.log("Success:", json);
      // Remove (Mock) from backend message if present
      const successMessage = (json?.message || "Property created successfully").replace(/\s*\(Mock\)\s*/gi, "");
      setSuccessMsg(successMessage);
      toast.success(successMessage);
      setShowCustomAlert(true);
      setTimeout(() => setShowCustomAlert(false), 5000);
      setForm(initialState);
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
      setImagePreviews([]);
      if (imagesRef?.current) imagesRef.current.value = "";
    } catch (err) {
      console.error("Submission error:", err);
      const errorMsg = err?.message || err?.data?.message || "Submission failed";
      setErrors((p) => ({ ...p, submit: errorMsg }));
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  const amenityOptions = [
    "Pool",
    "Garage",
    "Gym",
    "Garden",
    "Air Conditioning",
    "Concierge",
    "Security",
  ];

  return (
    <div className="p-4 sm:px-6">
      <div className="mx-auto">
        {/* <h1 className="text-2xl font-bold mb-4">Create Property Listing</h1> */}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Custom success alert */}
          {showCustomAlert && (
            <div role="alert" className="fixed top-6 right-6 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-md flex items-start gap-3 max-w-sm">
              <div className="flex-1">
                <div className="font-semibold">Success</div>
                <div className="text-sm">{successMsg || "Property created successfully"}</div>
              </div>
              <button type="button" onClick={() => setShowCustomAlert(false)} className="text-green-700 font-bold">×</button>
            </div>
          )}
          <ToastContainer position="top-right" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">
                  Basic Information
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Core details for the listing
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Modern 4-bedroom villa with pool"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      placeholder="Add a detailed description of the property"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Reordered: Country, State, City, Zip Code with Dropdown Logic */}
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleCountryChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2 bg-white"
                      disabled={locationLoading && countries.length === 0}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country, idx) => (
                        <option key={idx} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleStateChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2 bg-white"
                      disabled={!form.country}
                    >
                      <option value="">Select State</option>
                      {states.map((state, idx) => (
                        <option key={idx} value={state.name}>{state.name}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleCityChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2 bg-white"
                      disabled={!form.state}
                    >
                      <option value="">Select City</option>
                      {cities.map((city, idx) => (
                        <option key={idx} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Zip Code *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <select
                      id="zipCode"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleZipChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2 bg-white"
                      disabled={!form.city}
                    >
                      <option value="">Select Zip Code</option>
                      {zipCodes.map((zip, idx) => (
                        <option key={idx} value={zip}>{zip}</option>
                      ))}
                    </select>
                    {errors.zipCode && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                  
                  {/* Address field commented out per request - kept in state but hidden} */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Pricing & Specs</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Listing type, price and size
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="propertyType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={form.propertyType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2"
                    >
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
                    <label
                      htmlFor="listingType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Listing Type
                    </label>
                    <select
                      id="listingType"
                      name="listingType"
                      value={form.listingType}
                      onChange={handleListingTypeChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-[#d4af37]"
                    >
                      <option value="SALE">SALE</option>
                      <option value="RENT">RENT</option>
                      <option value="DEVELOPMENT">DEVELOPMENT</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      inputMode="numeric"
                      value={form.price}
                      onChange={handleNumberChange}
                      placeholder="e.g. 350000"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                    />
                    {errors.price && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="sqft"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sqft *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <input
                      id="sqft"
                      name="sqft"
                      type="text"
                      value={form.sqft}
                      onChange={handleNumberChange}
                      placeholder="e.g. 4500"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                    />
                    {errors.sqft && (
                      <p className="mt-1 text-xs text-red-600">{errors.sqft}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="bedrooms"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bedrooms *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <input
                      id="bedrooms"
                      name="bedrooms"
                      type="text"
                      value={form.bedrooms}
                      onChange={handleNumberChange}
                      placeholder="e.g. 4"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                    />
                    {errors.bedrooms && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.bedrooms}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="bathrooms"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bathrooms *{" "}
                      <span className="text-xs text-gray-500 ml-1">
                        required
                      </span>
                    </label>
                    <input
                      id="bathrooms"
                      name="bathrooms"
                      type="text"
                      value={form.bathrooms}
                      onChange={handleNumberChange}
                      placeholder="e.g. 3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                    />
                    {errors.bathrooms && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.bathrooms}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Features</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Amenities and feature lists
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {amenityOptions.map((opt) => (
                        <label
                          key={opt}
                          className="inline-flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={form.amenities.includes(opt)}
                            onChange={() => toggleAmenity(opt)}
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="furnishing"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Furnishing
                    </label>
                    <select
                      id="furnishing"
                      name="furnishing"
                      value={form.furnishing}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-[#d4af37]"
                    >
                      <option>Unfurnished</option>
                      <option>Furnished</option>
                      <option>Semi-Furnished</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="interiorFeatures"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Interior Features
                    </label>
                    <textarea
                      id="interiorFeatures"
                      name="interiorFeatures"
                      value={form.interiorFeatures}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                      placeholder="Comma separated or newline list"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="exteriorFeatures"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Exterior Features
                    </label>
                    <textarea
                      id="exteriorFeatures"
                      name="exteriorFeatures"
                      value={form.exteriorFeatures}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                      placeholder="Comma separated or newline list"
                    />
                  </div>

                  {form.listingType === "RENT" && (
                    <>
                      <div>
                        <label
                          htmlFor="rentalDuration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Rental Duration *{" "}
                          <span className="text-xs text-gray-500 ml-1">
                            required
                          </span>
                        </label>
                        <input
                          id="rentalDuration"
                          name="rentalDuration"
                          value={form.rentalDuration}
                          onChange={handleInputChange}
                          placeholder="e.g. 12 Months (Minimum)"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                        />
                        {errors.rentalDuration && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.rentalDuration}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="rentalTerms"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Rental Terms *{" "}
                          <span className="text-xs text-gray-500 ml-1">
                            required
                          </span>
                        </label>
                        <input
                          id="rentalTerms"
                          name="rentalTerms"
                          value={form.rentalTerms}
                          onChange={handleInputChange}
                          placeholder="e.g. 2 Months Deposit"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2"
                        />
                        {errors.rentalTerms && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.rentalTerms}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Images</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Upload images for the listing (multiple allowed)
                </p>

                <div>
                  <label
                    htmlFor="images"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Images *{" "}
                    <span className="text-xs text-gray-500 ml-1">required</span>
                  </label>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    ref={imagesRef}
                    onChange={handleImagesChange}
                    className="mt-1 block w-full"
                  />
                  {errors.images && (
                    <p className="mt-1 text-xs text-red-600">{errors.images}</p>
                  )}
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={src}
                        className="relative rounded-md overflow-hidden border"
                      >
                        <img
                          src={src}
                          alt={`preview-${i}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageAt(i)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="sticky bottom-6 bg-transparent pt-4 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    {errors.submit && (
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    )}
                    {successMsg && (
                      <p className="text-sm text-green-700">{successMsg}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                        onClick={() => {
                        setForm(initialState);
                        imagePreviews.forEach((p) => URL.revokeObjectURL(p));
                        setImagePreviews([]);
                        if (imagesRef?.current) imagesRef.current.value = "";
                      }}
                      className="px-4 py-2 rounded-md border bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-5 py-2 rounded-md font-semibold ${
                        loading
                          ? "bg-gray-300 text-gray-700"
                          : "bg-[#d4af37] text-white"
                      }`}
                    >
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
                  {imagePreviews[0] ? (
                    <img
                      src={imagePreviews[0]}
                      alt="cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No cover
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-gray-800">
                    {form.title || "Property title"}
                  </div>
                  <div className="text-gray-600">
                    {[form.city, form.state, form.zipCode]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                  <div className="text-gray-800 mt-2">
                    {form.price ? `$${form.price}` : "Price"}
                  </div>
                  <div className="text-gray-600">
                    {form.bedrooms ? `${form.bedrooms} bd` : ""}{" "}
                    {form.bathrooms ? `${form.bathrooms} ba` : ""}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Quick Info</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>Type:</strong> {form.propertyType}
                  </li>
                  <li>
                    <strong>Listing:</strong> {form.listingType}
                  </li>
                  <li>
                    <strong>Furnishing:</strong> {form.furnishing}
                  </li>
                  <li>
                    {(form.amenities || []).join(", ") || "—"}
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}