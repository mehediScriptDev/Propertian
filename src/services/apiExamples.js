// /**
//  * Example API Usage
//  *
//  * This file demonstrates how to use the common API functions
//  * in different scenarios throughout your application
//  */

// import api from "@/lib/api";

// // ============================================
// // 1. PROPERTIES API EXAMPLE
// // ============================================

// export const propertyAPI = {
//   // Get all properties with filters
//   getAll: async (filters = {}) => {
//     try {
//       const response = await api.get("/properties", {
//         params: {
//           page: filters.page || 1,
//           limit: filters.limit || 10,
//           type: filters.type,
//           location: filters.location,
//         },
//       });
//       return response;
//     } catch (error) {
//       console.error("Error fetching properties:", error.message);
//       throw error;
//     }
//   },

//   // Get single property by ID
//   getById: async (id) => {
//     try {
//       const response = await api.get(`/properties/${id}`);
//       return response;
//     } catch (error) {
//       console.error("Error fetching property:", error.message);
//       throw error;
//     }
//   },

//   // Create new property
//   create: async (propertyData) => {
//     try {
//       const response = await api.post("/properties", propertyData);
//       return response;
//     } catch (error) {
//       console.error("Error creating property:", error.message);
//       throw error;
//     }
//   },

//   // Update property
//   update: async (id, propertyData) => {
//     try {
//       const response = await api.put(`/properties/${id}`, propertyData);
//       return response;
//     } catch (error) {
//       console.error("Error updating property:", error.message);
//       throw error;
//     }
//   },

//   // Delete property
//   delete: async (id) => {
//     try {
//       const response = await api.delete(`/properties/${id}`);
//       return response;
//     } catch (error) {
//       console.error("Error deleting property:", error.message);
//       throw error;
//     }
//   },

//   // Upload property images
//   uploadImages: async (propertyId, files) => {
//     try {
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append("images", file);
//       });
//       formData.append("propertyId", propertyId);

//       const response = await api.uploadFile(
//         "/properties/upload-images",
//         formData,
//         (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           console.log(`Upload progress: ${percentCompleted}%`);
//         }
//       );
//       return response;
//     } catch (error) {
//       console.error("Error uploading images:", error.message);
//       throw error;
//     }
//   },
// };

// // ============================================
// // 2. BOOKINGS/VISITS API EXAMPLE
// // ============================================

// export const bookingAPI = {
//   // Get user bookings
//   getUserBookings: async (userId) => {
//     try {
//       const response = await api.get(`/bookings/user/${userId}`);
//       return response;
//     } catch (error) {
//       console.error("Error fetching bookings:", error.message);
//       throw error;
//     }
//   },

//   // Create new booking
//   create: async (bookingData) => {
//     try {
//       const response = await api.post("/bookings", bookingData);
//       return response;
//     } catch (error) {
//       console.error("Error creating booking:", error.message);
//       throw error;
//     }
//   },

//   // Cancel booking
//   cancel: async (bookingId) => {
//     try {
//       const response = await api.patch(`/bookings/${bookingId}/cancel`);
//       return response;
//     } catch (error) {
//       console.error("Error canceling booking:", error.message);
//       throw error;
//     }
//   },
// };

// // ============================================
// // 3. USER PROFILE API EXAMPLE
// // ============================================

// export const userAPI = {
//   // Get user profile
//   getProfile: async () => {
//     try {
//       const response = await api.get("/users/profile");
//       return response;
//     } catch (error) {
//       console.error("Error fetching profile:", error.message);
//       throw error;
//     }
//   },

//   // Update user profile
//   updateProfile: async (profileData) => {
//     try {
//       const response = await api.put("/users/profile", profileData);
//       return response;
//     } catch (error) {
//       console.error("Error updating profile:", error.message);
//       throw error;
//     }
//   },

//   // Upload avatar
//   uploadAvatar: async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("avatar", file);

//       const response = await api.uploadFile("/users/avatar", formData);
//       return response;
//     } catch (error) {
//       console.error("Error uploading avatar:", error.message);
//       throw error;
//     }
//   },

//   // Get user favorites
//   getFavorites: async () => {
//     try {
//       const response = await api.get("/users/favorites");
//       return response;
//     } catch (error) {
//       console.error("Error fetching favorites:", error.message);
//       throw error;
//     }
//   },

//   // Add to favorites
//   addFavorite: async (propertyId) => {
//     try {
//       const response = await api.post("/users/favorites", { propertyId });
//       return response;
//     } catch (error) {
//       console.error("Error adding favorite:", error.message);
//       throw error;
//     }
//   },

//   // Remove from favorites
//   removeFavorite: async (propertyId) => {
//     try {
//       const response = await api.delete(`/users/favorites/${propertyId}`);
//       return response;
//     } catch (error) {
//       console.error("Error removing favorite:", error.message);
//       throw error;
//     }
//   },
// };

// // ============================================
// // 4. ADMIN API EXAMPLE
// // ============================================

// export const adminAPI = {
//   // Get all users (admin only)
//   getAllUsers: async (filters = {}) => {
//     try {
//       const response = await api.get("/admin/users", { params: filters });
//       return response;
//     } catch (error) {
//       console.error("Error fetching users:", error.message);
//       throw error;
//     }
//   },

//   // Update user role (admin only)
//   updateUserRole: async (userId, role) => {
//     try {
//       const response = await api.patch(`/admin/users/${userId}/role`, {
//         role,
//       });
//       return response;
//     } catch (error) {
//       console.error("Error updating user role:", error.message);
//       throw error;
//     }
//   },

//   // Get dashboard statistics
//   getStatistics: async () => {
//     try {
//       const response = await api.get("/admin/statistics");
//       return response;
//     } catch (error) {
//       console.error("Error fetching statistics:", error.message);
//       throw error;
//     }
//   },
// };

// // ============================================
// // 5. PARTNER API EXAMPLE
// // ============================================

// export const partnerAPI = {
//   // Get partner properties
//   getProperties: async () => {
//     try {
//       const response = await api.get("/partner/properties");
//       return response;
//     } catch (error) {
//       console.error("Error fetching partner properties:", error.message);
//       throw error;
//     }
//   },

//   // Get partner bookings
//   getBookings: async () => {
//     try {
//       const response = await api.get("/partner/bookings");
//       return response;
//     } catch (error) {
//       console.error("Error fetching partner bookings:", error.message);
//       throw error;
//     }
//   },

//   // Update booking status
//   updateBookingStatus: async (bookingId, status) => {
//     try {
//       const response = await api.patch(`/partner/bookings/${bookingId}`, {
//         status,
//       });
//       return response;
//     } catch (error) {
//       console.error("Error updating booking status:", error.message);
//       throw error;
//     }
//   },
// };
