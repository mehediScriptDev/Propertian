# 🚀 Authentication & API Integration Guide (বাংলা)

## 📋 সূচিপত্র

1. [প্রজেক্ট সেটাপ](#প্রজেক্ট-সেটাপ)
2. [Authentication System](#authentication-system)
3. [Axios Common CRUD Functions](#axios-common-crud-functions)
4. [Role-Based Routing](#role-based-routing)
5. [API ব্যবহারের উদাহরণ](#api-ব্যবহারের-উদাহরণ)

---

## 🔧 প্রজেক্ট সেটাপ

### ১. Environment Configuration

`.env.local` ফাইলে আপনার backend API URL সেট করুন:

```env
NEXT_PUBLIC_API_URL=https://quiahgroup1backend.mtscorporate.com/api
```

### ২. Dependencies

প্রজেক্টে ইতিমধ্যে `axios` ইনস্টল করা আছে। যদি না থাকে:

```bash
npm install axios
```

---

## 🔐 Authentication System

### Login প্রক্রিয়া

```javascript
import { useAuth } from "@/contexts/AuthContext";

function LoginComponent() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login("email@example.com", "password123");
      // স্বয়ংক্রিয়ভাবে dashboard এ redirect হবে
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };
}
```

### Login Flow বিস্তারিত:

1. **User credentials দেয়** → `/auth/login` endpoint এ POST request
2. **Token পায়** → Response থেকে token extract করে
3. **Profile fetch করে** → `/auth/profile` endpoint থেকে complete user data
4. **Role mapping করে** → Backend role কে frontend role এ convert করে
5. **Dashboard redirect করে** → Role অনুযায়ী সঠিক dashboard এ পাঠায়

---

## 🎯 Role-Based Routing

### Role Mapping

আপনার backend এবং frontend এ role এর নাম আলাদা:

| Backend Role  | Frontend Role | Dashboard Route               |
| ------------- | ------------- | ----------------------------- |
| `USER`        | `client`      | `/[locale]/dashboard/client`  |
| `SUPER_ADMIN` | `admin`       | `/[locale]/dashboard/admin`   |
| `partner`     | `partner`     | `/[locale]/dashboard/partner` |

### কিভাবে কাজ করে:

```javascript
// AuthContext.jsx এ role mapping function
const mapRoleToFrontend = (backendRole) => {
  const normalizedRole = backendRole?.toLowerCase().replace(/_/g, "");

  const roleMapping = {
    user: "client",
    superadmin: "admin",
    partner: "partner",
  };

  return roleMapping[normalizedRole] || "client";
};
```

**উদাহরণ:**

- Backend: `SUPER_ADMIN` → Frontend: `admin` → Route: `/en/dashboard/admin`
- Backend: `USER` → Frontend: `client` → Route: `/en/dashboard/client`

---

## 📡 Axios Common CRUD Functions

### File Structure

```
src/
├── lib/
│   ├── axios.js      # Axios instance + interceptors
│   └── api.js        # Common CRUD functions
└── services/
    └── authService.js # Authentication API calls
```

### ১. Axios Instance (`src/lib/axios.js`)

**বৈশিষ্ট্য:**

- ✅ Automatic token attachment (প্রতিটি request এ token auto add হয়)
- ✅ Error handling (401, 403, 404, 500 errors handle করে)
- ✅ Auto redirect on unauthorized (401 error এ login page এ পাঠায়)

```javascript
// Token automatically attach হয়
config.headers.Authorization = `Bearer ${user.token}`;
```

### ২. Common API Functions (`src/lib/api.js`)

#### GET Request

```javascript
import api from "@/lib/api";

// সাধারণ GET request
const data = await api.get("/properties");

// Query parameters সহ
const data = await api.get("/properties", {
  params: {
    page: 1,
    limit: 10,
    type: "rent",
  },
});
```

#### POST Request

```javascript
// নতুন data create করা
const result = await api.post("/properties", {
  title: "Beautiful House",
  price: 50000,
  location: "Abidjan",
});
```

#### PUT Request (সম্পূর্ণ update)

```javascript
// পুরো data update করা
const updated = await api.put("/properties/123", {
  title: "Updated House",
  price: 55000,
  location: "Abidjan",
});
```

#### PATCH Request (আংশিক update)

```javascript
// শুধু কিছু field update করা
const patched = await api.patch("/properties/123", {
  price: 60000,
});
```

#### DELETE Request

```javascript
// Data মুছে ফেলা
const deleted = await api.delete("/properties/123");
```

#### File Upload

```javascript
// Image upload করা
const formData = new FormData();
formData.append("image", file);

const uploaded = await api.uploadFile(
  "/properties/upload",
  formData,
  (progressEvent) => {
    const percent = (progressEvent.loaded * 100) / progressEvent.total;
    console.log(`Upload progress: ${percent}%`);
  }
);
```

---

## 💡 API ব্যবহারের উদাহরণ

### Example 1: Properties API Service

```javascript
// src/services/propertyService.js
import api from "@/lib/api";

export const propertyAPI = {
  // সব properties fetch করা
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
      throw error;
    }
  },

  // একটি property fetch করা
  getById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // নতুন property তৈরি করা
  create: async (propertyData) => {
    try {
      const response = await api.post("/properties", propertyData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Property update করা
  update: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Property delete করা
  delete: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
```

### Example 2: Component এ API ব্যবহার

```javascript
"use client";

import { useState, useEffect } from "react";
import { propertyAPI } from "@/services/propertyService";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyAPI.getAll({
        page: 1,
        limit: 10,
        type: "rent",
      });
      setProperties(data.properties);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const newProperty = await propertyAPI.create({
        title: "New House",
        price: 50000,
        location: "Abidjan",
      });
      console.log("Created:", newProperty);
      fetchProperties(); // List আবার load করা
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await propertyAPI.update(id, {
        price: 55000,
      });
      console.log("Updated:", updated);
      fetchProperties();
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await propertyAPI.delete(id);
      console.log("Deleted successfully");
      fetchProperties();
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleCreate}>Add Property</button>
      {properties.map((property) => (
        <div key={property.id}>
          <h3>{property.title}</h3>
          <p>Price: {property.price}</p>
          <button onClick={() => handleUpdate(property.id)}>Update</button>
          <button onClick={() => handleDelete(property.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Form Submit with API

```javascript
"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function CreatePropertyForm() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.post("/properties", formData);
      console.log("Success:", result);
      alert("Property created successfully!");
      // Form reset করা
      setFormData({ title: "", price: "", location: "" });
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Property"}
      </button>
    </form>
  );
}
```

---

## 🔒 Protected Routes (Role-based Access)

```javascript
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user, hasRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasRole("admin")) {
      // Admin না হলে access দেবে না
      router.push("/en");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.fullName}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

---

## 🎨 User Profile Dropdown এ Data দেখানো

```javascript
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();

  return (
    <div>
      {/* User Info */}
      <div>
        <p>{user?.fullName}</p>
        <p>{user?.email}</p>
        <p className="capitalize">{user?.role}</p>
      </div>

      {/* Logout Button */}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## ⚡ Authentication Flow চিত্র

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /auth/login│ ───► Token পায়
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│GET /auth/profile │ ───► Complete User Data
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Role Mapping   │ ───► USER → client, SUPER_ADMIN → admin
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│Store in Storage  │ ───► localStorage + cookies
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│Redirect Dashboard│ ───► Role-based routing
└──────────────────┘
```

---

## 🛠️ Error Handling

### Axios Interceptor Error Handling

```javascript
// src/lib/axios.js
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - auto logout
      localStorage.removeItem("user");
      window.location.href = "/en/login";
    }
    return Promise.reject(error);
  }
);
```

### Component এ Error Handling

```javascript
try {
  const data = await api.get("/properties");
  console.log(data);
} catch (error) {
  // error.message → User-friendly message
  // error.status → HTTP status code
  // error.data → Full error response
  console.error("Error:", error.message);
}
```

---

## 📝 সংক্ষিপ্ত সারাংশ

### ✅ কি কি সম্পন্ন হয়েছে:

1. **Real Backend Authentication** - Dummy login system replace করা হয়েছে
2. **Role-based Routing** - 3 role (Client, Admin, Partner) এর জন্য routing
3. **Axios Common CRUD** - GET, POST, PUT, PATCH, DELETE functions
4. **Auto Token Management** - প্রতিটি request এ token auto attach
5. **Profile Integration** - `/auth/profile` থেকে user data fetch
6. **Error Handling** - 401/403/404/500 errors properly handle
7. **Role Mapping** - Backend role কে frontend role এ convert

### 🎯 পরবর্তী পদক্ষেপ:

1. নতুন service file তৈরি করুন (properties, bookings, etc.)
2. Component গুলোতে API call integrate করুন
3. Role-based access control implement করুন
4. Loading states এবং error messages add করুন

---

## 📞 সাহায্য প্রয়োজন?

- **Full Documentation:** `AUTHENTICATION_GUIDE.md`
- **Quick Setup:** `QUICK_SETUP.md`
- **API Examples:** `src/services/apiExamples.js`

---

**তৈরি করেছেন:** Quiah Group Development Team  
**সর্বশেষ আপডেট:** November 19, 2025

🚀 **Happy Coding!**
