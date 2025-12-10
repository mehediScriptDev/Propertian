"use client";

import { useState, useRef } from "react";
import { Plus, X, Loader2 } from "lucide-react";
 

// Converted from TS: removed PropertyFormData type annotations

export function PropertyForm() {
  const formRef = useRef(null);

  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fd = new FormData(formRef.current);
    const get = (k) => fd.get(k);

    const propertyData = {
      title: get("title"),
      description: get("description"),
      address: get("address"),
      mapLink: get("mapLink") || null,
      city: get("city"),
      state: get("state"),
      zipCode: get("zipCode"),
      country: get("country"),
      latitude: get("latitude") ? parseFloat(get("latitude")) : null,
      longitude: get("longitude") ? parseFloat(get("longitude")) : null,
      propertyType: get("propertyType") || "HOUSE",
      listingType: get("listingType") || "SALE",
      price: get("price"),
      bedrooms: get("bedrooms") ? Number(get("bedrooms")) : null,
      bathrooms: get("bathrooms") ? Number(get("bathrooms")) : null,
      sqft: get("sqft") ? Number(get("sqft")) : null,
      lotSize: get("lotSize") ? Number(get("lotSize")) : null,
      yearBuilt: get("yearBuilt") ? Number(get("yearBuilt")) : null,
      images: images,
      amenities: amenities,
      virtualTourUrl: get("virtualTourUrl") || null,
    };

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // simple inline feedback (no external toast)
        alert("Property added successfully!");
        // Reset form
        if (formRef.current) formRef.current.reset();
        setAmenities([]);
        setImages([]);
      } else {
        alert(result.message || "Failed to add property. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity) => {
    setAmenities(amenities.filter((a) => a !== amenity));
  };

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (image) => {
    setImages(images.filter((img) => img !== image));
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-8 max-w-7xl mx-auto py-3.5">
      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-gray-900 border-b border-gray-200 pb-2">
          Basic Information
        </h2>

        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Property Title *
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Luxury Villa in Cocody"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the property..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyType" className="block text-gray-700 mb-2">
              Property Type *
            </label>
            <select
              id="propertyType"
              name="propertyType"
              defaultValue="HOUSE"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="TOWNHOUSE">Townhouse</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>

          <div>
            <label htmlFor="listingType" className="block text-gray-700 mb-2">
              Listing Type *
            </label>
            <select
              id="listingType"
              name="listingType"
              defaultValue="SALE"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SALE">Sale</option>
              <option value="RENT">Rent</option>
              <option value="DEVELOPMENT">Development</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-700 mb-2">
            Price *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 250000000"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-6">
        <h2 className="text-gray-900 border-b border-gray-200 pb-2">
          Location
        </h2>

        <div>
          <label htmlFor="address" className="block text-gray-700 mb-2">
            Address *
          </label>
          <input
            id="address"
            name="address"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Rue des Jardins"
          />
        </div>

        <div>
          <label htmlFor="mapLink" className="block text-gray-700 mb-2">
            Map Link
          </label>
          <input
            id="mapLink"
            name="mapLink"
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., https://maps.google.com/..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-gray-700 mb-2">
              City *
            </label>
            <input
              id="city"
              name="city"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Abidjan"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-gray-700 mb-2">
              State/Region *
            </label>
            <input
              id="state"
              name="state"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Cocody"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-gray-700 mb-2">
              Zip Code *
            </label>
            <input
              id="zipCode"
              name="zipCode"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 00225"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-gray-700 mb-2">
              Country *
            </label>
            <input
              id="country"
              name="country"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Côte d'Ivoire"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-gray-700 mb-2">
              Latitude
            </label>
            <input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5.36"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-gray-700 mb-2">
              Longitude
            </label>
            <input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., -4.0083"
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-6">
        <h2 className="text-gray-900 border-b border-gray-200 pb-2">
          Property Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-gray-700 mb-2">
              Bedrooms *
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 4"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-gray-700 mb-2">
              Bathrooms *
            </label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 3"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sqft" className="block text-gray-700 mb-2">
              Square Feet *
            </label>
            <input
              id="sqft"
              name="sqft"
              type="number"
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 3200"
            />
          </div>

          <div>
            <label htmlFor="lotSize" className="block text-gray-700 mb-2">
              Lot Size (sq ft)
            </label>
            <input
              id="lotSize"
              name="lotSize"
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="yearBuilt" className="block text-gray-700 mb-2">
            Year Built
          </label>
          <input
            id="yearBuilt"
            name="yearBuilt"
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 2021"
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h2 className="text-gray-900 border-b border-gray-200 pb-2">
          Amenities
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAmenity();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Pool, Garden, AC"
          />
          <button
            type="button"
            onClick={addAmenity}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(amenity)}
                  className="hover:text-blue-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h2 className="text-gray-900 border-b border-gray-200 pb-2">Images</h2>

        <div className="flex gap-2">
          <input
            type="url"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter image URL"
          />
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <h2 className="text-gray-900 border-b border-gray-200 pb-2">
          Additional Information
        </h2>

        <div>
          <label htmlFor="virtualTourUrl" className="block text-gray-700 mb-2">
            Virtual Tour URL
          </label>
          <input
            id="virtualTourUrl"
            name="virtualTourUrl"
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding Property...
            </>
          ) : (
            "Add Property"
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            if (formRef.current) formRef.current.reset();
            setAmenities([]);
            setImages([]);
          }}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Reset Form
        </button>
      </div>
    </form>
  );
}

// Next.js App Router expects a default export that is a React component.
// Export the form component as the route's default export so the page renders.
export default PropertyForm;