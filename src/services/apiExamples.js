/**
 * Example API Usage
 *
 * This file demonstrates how to use the common API functions
 * in different scenarios throughout your application
 */

import api from "@/lib/api";

// ============================================
// 1. PROPERTIES API EXAMPLE
// ============================================

export const propertyAPI = {
  // Get all properties with filters
  getAll: async (filters = {}) => {
    try {
      const response = await api.get("/properties", {
        params: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          type: filters.type,
          location: filters.location,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching properties:", error.message);
      throw error;
    }
  },

  // Get single property by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching property:", error.message);
      throw error;
    }
  },

  // Create new property
  create: async (propertyData) => {
    try {
      const response = await api.post("/properties", propertyData);
      return response;
    } catch (error) {
      console.error("Error creating property:", error.message);
      throw error;
    }
  },

  // Update property
  update: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response;
    } catch (error) {
      console.error("Error updating property:", error.message);
      throw error;
    }
  },

  // Delete property
  delete: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting property:", error.message);
      throw error;
    }
  },

  // Upload property images
  uploadImages: async (propertyId, files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("propertyId", propertyId);

      const response = await api.uploadFile(
        "/properties/upload-images",
        formData,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      );
      return response;
    } catch (error) {
      console.error("Error uploading images:", error.message);
      throw error;
    }
  },
};

// ============================================
// 2. BOOKINGS/VISITS API EXAMPLE
// ============================================

export const bookingAPI = {
  // Get user bookings
  getUserBookings: async (userId) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      return response;
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
      throw error;
    }
  },

  // Create new booking
  create: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response;
    } catch (error) {
      console.error("Error creating booking:", error.message);
      throw error;
    }
  },

  // Cancel booking
  cancel: async (bookingId) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return response;
    } catch (error) {
      console.error("Error canceling booking:", error.message);
      throw error;
    }
  },
};

// ============================================
// 3. USER PROFILE API EXAMPLE
// ============================================

export const userAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      return response;
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/users/profile", profileData);
      return response;
    } catch (error) {
      console.error("Error updating profile:", error.message);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.uploadFile("/users/avatar", formData);
      return response;
    } catch (error) {
      console.error("Error uploading avatar:", error.message);
      throw error;
    }
  },

  // Get user favorites
  getFavorites: async () => {
    try {
      const response = await api.get("/users/favorites");
      return response;
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
      throw error;
    }
  },

  // Add to favorites
  addFavorite: async (propertyId) => {
    try {
      const response = await api.post("/users/favorites", { propertyId });
      return response;
    } catch (error) {
      console.error("Error adding favorite:", error.message);
      throw error;
    }
  },

  // Remove from favorites
  removeFavorite: async (propertyId) => {
    try {
      const response = await api.delete(`/users/favorites/${propertyId}`);
      return response;
    } catch (error) {
      console.error("Error removing favorite:", error.message);
      throw error;
    }
  },
};

// ============================================
// 4. ADMIN API EXAMPLE
// ============================================

export const adminAPI = {
  // Get all users (admin only)
  getAllUsers: async (filters = {}) => {
    try {
      const response = await api.get("/admin/users", { params: filters });
      return response;
    } catch (error) {
      console.error("Error fetching users:", error.message);
      throw error;
    }
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, {
        role,
      });
      return response;
    } catch (error) {
      console.error("Error updating user role:", error.message);
      throw error;
    }
  },

  // Get dashboard statistics
  getStatistics: async () => {
    try {
      const response = await api.get("/admin/statistics");
      return response;
    } catch (error) {
      console.error("Error fetching statistics:", error.message);
      throw error;
    }
  },
};

// ============================================
// 5. PARTNER API EXAMPLE
// ============================================

export const partnerAPI = {
  // Get partner properties
  getProperties: async () => {
    try {
      const response = await api.get("/partner/properties");
      return response;
    } catch (error) {
      console.error("Error fetching partner properties:", error.message);
      throw error;
    }
  },

  // Get partner bookings
  getBookings: async () => {
    try {
      const response = await api.get("/partner/bookings");
      return response;
    } catch (error) {
      console.error("Error fetching partner bookings:", error.message);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.patch(`/partner/bookings/${bookingId}`, {
        status,
      });
      return response;
    } catch (error) {
      console.error("Error updating booking status:", error.message);
      throw error;
    }
  },
};

// ============================================
// 6. USAGE IN REACT COMPONENTS
// ============================================

/**
 * Example 1: Fetch properties in a component
 */
/*
import { useEffect, useState } from 'react';
import { propertyAPI } from '@/services/apiExamples';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getAll({
          page: 1,
          limit: 10,
          type: 'rent',
        });
        setProperties(data.properties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
*/

/**
 * Example 2: Create a property with form submission
 */
/*
import { useState } from 'react';
import { propertyAPI } from '@/services/apiExamples';

export default function CreatePropertyForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProperty = await propertyAPI.create(formData);
      console.log('Property created:', newProperty);
      // Redirect or show success message
    } catch (error) {
      console.error('Error creating property:', error);
      // Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {// Form fields here}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Property'}
      </button>
    </form>
  );
}
*/

/**
 * Example 3: Upload images with progress
 */
/*
import { useState } from 'react';
import { propertyAPI } from '@/services/apiExamples';

export default function ImageUpload({ propertyId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      await propertyAPI.uploadImages(propertyId, files);
      console.log('Upload complete');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? `Uploading... ${progress}%` : 'Upload Images'}
      </button>
    </div>
  );
}
*/

/**
 * Example 4: Server-side data fetching in Next.js
 */
/*
// In a Next.js page or component
import { propertyAPI } from '@/services/apiExamples';

export async function getServerSideProps(context) {
  try {
    const properties = await propertyAPI.getAll();
    return {
      props: {
        properties: properties.data,
      },
    };
  } catch (error) {
    return {
      props: {
        properties: [],
        error: error.message,
      },
    };
  }
}

export default function PropertiesPage({ properties, error }) {
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
*/
