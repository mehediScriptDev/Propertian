"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { uploadFile } from "../../../lib/api";
import COUNTRY_CODES from "../../../utils/countryCodes";
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
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [zipOptions, setZipOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingZips, setLoadingZips] = useState(false);
  const [selectedCountryIso, setSelectedCountryIso] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showZipDropdown, setShowZipDropdown] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [zipFilter, setZipFilter] = useState("");
  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const zipRef = useRef(null);
  const countryInputRef = useRef(null);
  const stateInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const zipInputRef = useRef(null);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [imagePreviews]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // country/state/city helpers
  useEffect(() => {
    setCountryOptions(COUNTRY_CODES.map((c) => ({ name: c.name, iso2: c.iso2 })));
  }, []);

  // close dropdowns on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (countryRef.current && !countryRef.current.contains(e.target)) setShowCountryDropdown(false);
      if (stateRef.current && !stateRef.current.contains(e.target)) setShowStateDropdown(false);
      if (cityRef.current && !cityRef.current.contains(e.target)) setShowCityDropdown(false);
      if (zipRef.current && !zipRef.current.contains(e.target)) setShowZipDropdown(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function loadStatesForCountry(countryName) {
    if (!countryName) {
      setStateOptions([]);
      return;
    }
    setLoadingStates(true);
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName }),
      });
      const json = await res.json();
      const states = (json?.data?.states || []).map((s) => s.name || s);
      setStateOptions(states);
    } catch (err) {
      setStateOptions([]);
    } finally {
      setLoadingStates(false);
    }
  }

  async function loadCitiesForState(countryName, stateName) {
    if (!countryName || !stateName) {
      setCityOptions([]);
      return;
    }
    console.log('Loading cities for:', { countryName, stateName });
    setLoadingCities(true);
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName, state: stateName }),
      });
      const json = await res.json();
      console.log('Cities API response:', json);
      const cities = json?.data || [];
      setCityOptions(cities);
    } catch (err) {
      console.error('Error loading cities:', err);
      setCityOptions([]);
    } finally {
      setLoadingCities(false);
    }
  }

  // Dropdown portal: render menu into body and position under anchor input
  function DropdownPortal({ anchorRef, visible, children }) {
    const elRef = useRef(null);
    const [, setTick] = useState(0);

    useEffect(() => {
      if (!visible) return;
      if (!elRef.current) {
        elRef.current = document.createElement('div');
        document.body.appendChild(elRef.current);
      }

      function update() {
        setTick((t) => t + 1);
      }

      window.addEventListener('scroll', update, true);
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('scroll', update, true);
        window.removeEventListener('resize', update);
        if (elRef.current) {
          document.body.removeChild(elRef.current);
          elRef.current = null;
        }
      };
    }, [visible]);

    if (!visible || !anchorRef?.current) return null;
    if (!elRef.current) {
      elRef.current = document.createElement('div');
      document.body.appendChild(elRef.current);
    }

    const rect = anchorRef.current.getBoundingClientRect();
    const style = {
      position: 'absolute',
      left: `${rect.left + window.scrollX}px`,
      top: `${rect.bottom + window.scrollY}px`,
      width: `${rect.width}px`,
      zIndex: 9999,
    };

    return ReactDOM.createPortal(
      <div style={style} className="bg-white border rounded shadow max-h-56 overflow-auto">
        {children}
      </div>,
      elRef.current
    );
  }

  async function loadZipsForPlace(countryIso2, stateName, cityName) {
    if (!countryIso2 || !stateName || !cityName) {
      setZipOptions([]);
      return;
    }
    setLoadingZips(true);
    try {
      // Try zippopotam.us - may not be available for all countries
      const code = (countryIso2 || "").toLowerCase();
      const url = `https://api.zippopotam.us/${code}/${encodeURIComponent(stateName)}/${encodeURIComponent(cityName)}`;
      const res = await fetch(url);
      if (!res.ok) {
        setZipOptions([]);
        return;
      }
      const json = await res.json();
      const zips = (json?.places || []).map((p) => p['post code'] || p['postcode'] || p['postalCode']).filter(Boolean);
      setZipOptions(Array.from(new Set(zips)));
    } catch (err) {
      setZipOptions([]);
    } finally {
      setLoadingZips(false);
    }
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
      // address field commented out in UI - skipping append
      // fd.append("address", form.address);
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

                  {/* Address field commented out per request - kept in state but hidden
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <input id="address" name="address" value={form.address} onChange={handleInputChange} placeholder="Street address" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                    {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                  </div>
                  */}

                  {/* Reordered: Country, State, City, Zip Code (Address commented out) */}
                  <div ref={countryRef} className="relative">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <div className="relative">
                      <input id="country" name="country" ref={countryInputRef} value={form.country} onChange={(e)=>{
                        const v = e.target.value;
                        setCountryFilter(v);
                        setForm(s=>({...s, country: v}));
                        setShowCountryDropdown(true);
                      }} onFocus={()=> setShowCountryDropdown(true)} placeholder="Country" autoComplete="off" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                      <button type="button" onClick={()=> setShowCountryDropdown(s=>!s)} className="absolute right-2 top-3 text-gray-500">▾</button>
                    </div>
                    <DropdownPortal anchorRef={countryInputRef} visible={showCountryDropdown}>
                      {countryOptions.filter(c=> c.name.toLowerCase().includes((countryFilter||"").toLowerCase())).map((c)=> (
                        <div key={c.iso2} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{
                          setForm(s=>({...s, country: c.name, state: "", city: "", zipCode: ""}));
                          setSelectedCountryIso(c.iso2);
                          setSelectedCountryName(c.name);
                          setShowCountryDropdown(false);
                          setCountryFilter("");
                          setStateOptions([]); setCityOptions([]); setZipOptions([]);
                          loadStatesForCountry(c.name);
                        }}>{c.name}</div>
                      ))}
                    </DropdownPortal>
                    {/* Inline fallback if portal doesn't show (keeps UX robust) */}
                    {showCountryDropdown && (
                      <div className="absolute mt-1 w-full bg-white border rounded shadow max-h-71 overflow-auto" style={{zIndex: 999999}}>
                        {countryOptions.filter(c=> c.name.toLowerCase().includes((countryFilter||"").toLowerCase())).map((c)=> (
                          <div key={c.iso2} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{
                            setForm(s=>({...s, country: c.name, state: "", city: "", zipCode: ""}));
                            setSelectedCountryIso(c.iso2);
                            setSelectedCountryName(c.name);
                            setShowCountryDropdown(false);
                            setCountryFilter("");
                            setStateOptions([]); setCityOptions([]); setZipOptions([]);
                            loadStatesForCountry(c.name);
                          }}>{c.name}</div>
                        ))}
                      </div>
                    )}
                    {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                  </div>

                  <div ref={stateRef} className="relative">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <div className="relative">
                      <input id="state" name="state" ref={stateInputRef} value={form.state} onChange={(e)=>{
                        const v = e.target.value; setStateFilter(v); setForm(s=>({...s, state: v})); setShowStateDropdown(true);
                      }} onFocus={() => {
                        setShowStateDropdown(true);
                        // If states not yet loaded, attempt to load using selected or typed country
                        if ((!stateOptions || stateOptions.length === 0)) {
                          const countryName = selectedCountryName || form.country;
                          if (countryName) {
                            const found = countryOptions.find(c => c.name.toLowerCase() === (countryName || '').toLowerCase());
                            if (found) {
                              setSelectedCountryIso(found.iso2);
                              setSelectedCountryName(found.name);
                              loadStatesForCountry(found.name);
                            } else {
                              loadStatesForCountry(countryName);
                            }
                          }
                        }
                      }} placeholder="State / Region" autoComplete="off" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                      <button type="button" onClick={()=> {
                        setShowStateDropdown(s=>!s);
                        if ((!stateOptions || stateOptions.length === 0)) {
                          const countryName = selectedCountryName || form.country;
                          if (countryName) {
                            const found = countryOptions.find(c => c.name.toLowerCase() === (countryName || '').toLowerCase());
                            if (found) {
                              setSelectedCountryIso(found.iso2);
                              setSelectedCountryName(found.name);
                              loadStatesForCountry(found.name);
                            } else {
                              loadStatesForCountry(countryName);
                            }
                          }
                        }
                      }} className="absolute right-2 top-3 text-gray-500">▾</button>
                    </div>
                    <DropdownPortal anchorRef={stateInputRef} visible={showStateDropdown}>
                      {loadingStates ? <div className="px-3 py-2 text-sm text-gray-500">Loading...</div> : stateOptions.filter(s=> s.toLowerCase().includes((stateFilter||"").toLowerCase())).map((s)=> (
                        <div key={s} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{
                          const countryName = selectedCountryName || form.country;
                          // Ensure country info is set
                          if (countryName && !selectedCountryName) {
                            const found = countryOptions.find(c => c.name.toLowerCase() === (countryName || '').toLowerCase());
                            if (found) {
                              setSelectedCountryIso(found.iso2);
                              setSelectedCountryName(found.name);
                            }
                          }
                          setForm(f=>({...f, state: s, city: "", zipCode: ""}));
                          setShowStateDropdown(false);
                          setStateFilter("");
                          setCityOptions([]); setZipOptions([]);
                          loadCitiesForState(selectedCountryName || form.country, s);
                        }}>{s}</div>
                      ))}
                    </DropdownPortal>
                    {showStateDropdown && (
                      <div className="absolute mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto" style={{zIndex: 9999}}>
                        {loadingStates ? <div className="px-3 py-2 text-sm text-gray-500">Loading...</div> : stateOptions.filter(s=> s.toLowerCase().includes((stateFilter||"").toLowerCase())).map((s)=> (
                          <div key={s} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{
                            const countryName = selectedCountryName || form.country;
                            // Ensure country info is set
                            if (countryName && !selectedCountryName) {
                              const found = countryOptions.find(c => c.name.toLowerCase() === (countryName || '').toLowerCase());
                              if (found) {
                                setSelectedCountryIso(found.iso2);
                                setSelectedCountryName(found.name);
                              }
                            }
                            setForm(f=>({...f, state: s, city: "", zipCode: ""}));
                            setShowStateDropdown(false);
                            setStateFilter("");
                            setCityOptions([]); setZipOptions([]);
                            loadCitiesForState(selectedCountryName || form.country, s);
                          }}>{s}</div>
                        ))}
                      </div>
                    )}
                    {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                  </div>

                  <div ref={cityRef} className="relative">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <div className="relative">
                      <input id="city" name="city" ref={cityInputRef} value={form.city} onChange={(e)=>{ const v = e.target.value; setCityFilter(v); setForm(s=>({...s, city: v})); setShowCityDropdown(true); }} onFocus={() => {
                        setShowCityDropdown(true);
                        // If cities not loaded, attempt to load using country+state
                        if ((!cityOptions || cityOptions.length === 0)) {
                          const countryName = selectedCountryName || form.country;
                          const stateName = form.state;
                          if (stateName && countryName) {
                            const found = countryOptions.find(c => c.name.toLowerCase() === (countryName || '').toLowerCase());
                            if (found && !selectedCountryIso) setSelectedCountryIso(found.iso2);
                            loadCitiesForState(countryName, stateName);
                          }
                        }
                      }} placeholder="City" autoComplete="off" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                      <button type="button" onClick={()=> {
                        setShowCityDropdown(s=>!s);
                        if ((!cityOptions || cityOptions.length === 0)) {
                          const countryName = selectedCountryName || form.country;
                          const stateName = form.state;
                          if (stateName && countryName) {
                            const found = countryOptions.find(c => c.name.toLowerCase() === (countryName || '').toLowerCase());
                            if (found && !selectedCountryIso) setSelectedCountryIso(found.iso2);
                            loadCitiesForState(countryName, stateName);
                          }
                        }
                      }} className="absolute right-2 top-3 text-gray-500">▾</button>
                    </div>
                    <DropdownPortal anchorRef={cityInputRef} visible={showCityDropdown}>
                      {loadingCities ? (
                        <div className="px-4 py-3 text-sm text-gray-500 bg-white">Loading cities...</div>
                      ) : cityOptions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50">No cities found. Please select a state first.</div>
                      ) : (
                        cityOptions.filter(c=> c.toLowerCase().includes((cityFilter||"").toLowerCase())).map((c)=> (
                          <div key={c} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{
                            setForm(f=>({...f, city: c, zipCode: ""}));
                            setShowCityDropdown(false);
                            setCityFilter("");
                            setZipOptions([]);
                            loadZipsForPlace(selectedCountryIso, form.state, c);
                          }}>{c}</div>
                        ))
                      )}
                    </DropdownPortal>
                    {showCityDropdown && (
                      <div className="absolute mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto" style={{zIndex: 9999}}>
                        {loadingCities ? (
                          <div className="px-4 py-3 text-sm text-gray-500 bg-white">Loading cities...</div>
                        ) : cityOptions.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50">No cities found. Please select a state first.</div>
                        ) : (
                          cityOptions.filter(c=> c.toLowerCase().includes((cityFilter||"").toLowerCase())).map((c)=> (
                            <div key={c} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{
                              setForm(f=>({...f, city: c, zipCode: ""}));
                              setShowCityDropdown(false);
                              setCityFilter("");
                              setZipOptions([]);
                              loadZipsForPlace(selectedCountryIso, form.state, c);
                            }}>{c}</div>
                          ))
                        )}
                      </div>
                    )}
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                  </div>

                  <div ref={zipRef} className="relative">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code * <span className="text-xs text-gray-500 ml-1">required</span></label>
                    <div className="relative">
                      <input id="zipCode" name="zipCode" ref={zipInputRef} value={form.zipCode} onChange={(e)=>{ setZipFilter(e.target.value); setForm(s=>({...s, zipCode: e.target.value})); setShowZipDropdown(true); }} onFocus={() => {
                        setShowZipDropdown(true);
                        // If zips not loaded, attempt to load using country iso + state + city
                        if ((!zipOptions || zipOptions.length === 0)) {
                          const countryIso = selectedCountryIso || (countryOptions.find(c=>c.name.toLowerCase() === (form.country||'').toLowerCase()) || {}).iso2;
                          const stateName = form.state;
                          const cityName = form.city;
                          if (countryIso && stateName && cityName) {
                            loadZipsForPlace(countryIso, stateName, cityName);
                          }
                        }
                      }} placeholder="Zip / Postal code" autoComplete="off" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-[#d4af37] px-3 py-2" />
                      <button type="button" onClick={()=> {
                        setShowZipDropdown(s=>!s);
                        if ((!zipOptions || zipOptions.length === 0)) {
                          const countryIso = selectedCountryIso || (countryOptions.find(c=>c.name.toLowerCase() === (form.country||'').toLowerCase()) || {}).iso2;
                          const stateName = form.state;
                          const cityName = form.city;
                          if (countryIso && stateName && cityName) {
                            loadZipsForPlace(countryIso, stateName, cityName);
                          }
                        }
                      }} className="absolute right-2 top-3 text-gray-500">▾</button>
                    </div>
                    <DropdownPortal anchorRef={zipInputRef} visible={showZipDropdown}>
                      {loadingZips ? <div className="px-3 py-2 text-sm text-gray-500">Loading...</div> : zipOptions.filter(z=> z.toLowerCase().includes((zipFilter||"").toLowerCase())).map((z)=> (
                        <div key={z} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{ setForm(f=>({...f, zipCode: z})); setShowZipDropdown(false); setZipFilter(""); }}>{z}</div>
                      ))}
                    </DropdownPortal>
                    {showZipDropdown && (
                      <div className="absolute mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto" style={{zIndex: 9999}}>
                        {loadingZips ? <div className="px-3 py-2 text-sm text-gray-500">Loading...</div> : zipOptions.filter(z=> z.toLowerCase().includes((zipFilter||"").toLowerCase())).map((z)=> (
                          <div key={z} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{ setForm(f=>({...f, zipCode: z})); setShowZipDropdown(false); setZipFilter(""); }}>{z}</div>
                        ))}
                      </div>
                    )}
                    {errors.zipCode && <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>}
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
                    <div className="text-gray-600">{[form.city, form.state, form.zipCode].filter(Boolean).join(', ')}</div>
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



