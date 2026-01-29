# Real Authentication Implementation Guide

## Overview

This project now uses **real backend authentication** instead of the previous dummy login system. The authentication system supports three roles with proper mapping:

### Role Mapping

| Backend Role | Frontend Role | Dashboard Route               |
| ------------ | ------------- | ----------------------------- |
| `user`       | `client`      | `/[locale]/dashboard/client`  |
| `superAdmin` | `admin`       | `/[locale]/dashboard/admin`   |
| `partner`    | `partner`     | `/[locale]/dashboard/partner` |

---

## 📁 File Structure

```
src/
├── lib/
│   ├── axios.js          # Axios instance with interceptors
│   └── api.js            # Common CRUD functions (GET, POST, PUT, DELETE)
├── services/
│   └── authService.js    # Authentication API calls
├── contexts/
│   └── AuthContext.jsx   # Real authentication context
└── components/
    └── auth/
        ├── SignInForm.jsx     # Login form with backend integration
        └── RegisterForm.jsx   # Registration form with backend integration
```

---

## 🔧 Configuration

### 1. Environment Variables

Create or update `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

**Important:** Update this URL to match your actual backend API endpoint.

---

## 🚀 API Services

### Axios Instance (`src/lib/axios.js`)

Configured axios instance with:

- Base URL from environment variables
- 30-second timeout
- Automatic token attachment via interceptors
- Error handling for 401, 403, 404, 500 status codes
- Automatic redirect to login on 401 (Unauthorized)

### Common API Functions (`src/lib/api.js`)

Provides reusable CRUD operations:

```javascript
import api from "@/lib/api";

// GET request
const data = await api.get("/endpoint", { params: { id: 1 } });

// POST request
const result = await api.post("/endpoint", { name: "value" });

// PUT request
const updated = await api.put("/endpoint/1", { name: "updated" });

// PATCH request
const patched = await api.patch("/endpoint/1", { field: "value" });

// DELETE request
const deleted = await api.delete("/endpoint/1");

// Upload file
const uploaded = await api.uploadFile("/upload", formData, (progress) => {
  console.log("Upload progress:", progress);
});

// Download file
await api.downloadFile("/download/file.pdf", "filename.pdf");
```

### Authentication Service (`src/services/authService.js`)

Pre-built authentication methods:

```javascript
import authService from "@/services/authService";

// Login
const user = await authService.login({ email, password });

// Register
const newUser = await authService.register({ name, email, password, role });

// Logout
await authService.logout();

// Get current user
const currentUser = await authService.getCurrentUser();

// Forgot password
await authService.forgotPassword(email);

// Reset password
await authService.resetPassword({ token, newPassword });

// Change password
await authService.changePassword({ currentPassword, newPassword });

// Update profile
const updated = await authService.updateProfile({ name, avatar });
```

---

## 🔐 Authentication Context

### Usage in Components

```javascript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, login, logout, register, hasRole, isAuthenticated, loading } =
    useAuth();

  // Login
  const handleLogin = async () => {
    try {
      await login(email, password);
      // User is automatically redirected based on role
    } catch (error) {
      console.error(error.message);
    }
  };

  // Register
  const handleRegister = async () => {
    try {
      await register({ name, email, password });
      // User is automatically redirected to client dashboard
    } catch (error) {
      console.error(error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    // User is automatically redirected to login page
  };

  // Check role
  if (hasRole("admin")) {
    return <AdminContent />;
  }

  return <ClientContent />;
}
```

### User Object Structure

```javascript
{
  id: "user-id",
  email: "user@example.com",
  name: "User Name",
  role: "client", // Frontend role (client, admin, partner)
  backendRole: "user", // Original backend role
  token: "jwt-token",
  avatar: "avatar-url"
}
```

---

## 🎯 Backend Integration

### Expected Backend Response Structure

#### Login Endpoint: `POST /api/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user", // or "superAdmin", "partner"
    "avatar": "avatar-url"
  }
}
```

#### Register Endpoint: `POST /api/auth/register`

**Request:**

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:** Same as login response

---

## 🔄 Role-Based Routing

The system automatically redirects users to the appropriate dashboard based on their role:

1. **User logs in** → Backend returns role
2. **Role is mapped** → `user` → `client`, `superAdmin` → `admin`, `partner` → `partner`
3. **User is redirected** → `/{locale}/dashboard/{mapped-role}`

### Example:

- Backend returns `role: "user"` → Redirects to `/en/dashboard/client`
- Backend returns `role: "superAdmin"` → Redirects to `/en/dashboard/admin`
- Backend returns `role: "partner"` → Redirects to `/en/dashboard/partner`

---

## 🛡️ Token Management

### Storage

- User data (including token) is stored in:
  - **localStorage** → `localStorage.getItem('user')`
  - **Cookies** → For middleware/SSR access

### Automatic Token Attachment

The axios interceptor automatically attaches the token to every request:

```javascript
headers: {
  Authorization: `Bearer ${token}`;
}
```

### Token Expiration

On 401 (Unauthorized) response:

1. Clear localStorage
2. Clear cookies
3. Redirect to login page

---

## 🧪 Testing

### Test the Authentication Flow

1. **Start your backend server** (make sure it's running)

2. **Update the API URL** in `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://your-backend-url/api
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Test Registration**:

   - Go to `/en/register`
   - Fill in the form
   - Submit
   - Should redirect to client dashboard

5. **Test Login**:
   - Go to `/en/login`
   - Enter credentials
   - Submit
   - Should redirect to role-based dashboard

---

## 🚨 Error Handling

All API errors are properly handled and displayed to users:

```javascript
try {
  await login(email, password);
} catch (error) {
  // error.message contains user-friendly message
  // error.status contains HTTP status code
  // error.data contains full error response
}
```

Common errors:

- **401**: Invalid credentials or expired token
- **403**: Insufficient permissions
- **404**: Endpoint not found
- **500**: Server error
- **Network Error**: Backend is not reachable

---

## 📝 Customization

### Adjust Backend Response Structure

If your backend returns different field names, update `AuthContext.jsx`:

```javascript
const userData = {
  id: backendUser.userId, // Change field name
  name: backendUser.fullName, // Change field name
  email: backendUser.emailAddress, // Change field name
  role: mapRoleToFrontend(backendUser.userRole), // Change field name
  token: response.accessToken, // Change field name
};
```

### Add More API Endpoints

Add new services in `src/services/`:

```javascript
// src/services/propertyService.js
import api from "@/lib/api";

export const getProperties = async (filters) => {
  return await api.get("/properties", { params: filters });
};

export const createProperty = async (propertyData) => {
  return await api.post("/properties", propertyData);
};

export default {
  getProperties,
  createProperty,
};
```

---

## ✅ Checklist

- [x] Install axios dependency
- [x] Create axios instance with interceptors
- [x] Create common API service (CRUD functions)
- [x] Create authentication service
- [x] Update AuthContext with real backend
- [x] Update login form
- [x] Update registration form
- [x] Configure environment variables
- [ ] Update backend API URL in `.env.local`
- [ ] Test login flow
- [ ] Test registration flow
- [ ] Test role-based routing

---

## 🆘 Troubleshooting

### Issue: CORS Error

**Solution:** Enable CORS in your backend for the frontend URL

### Issue: Network Error

**Solution:**

1. Check if backend is running
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check if backend URL is accessible

### Issue: 401 on Every Request

**Solution:**

1. Check if token is being stored correctly
2. Verify backend expects `Authorization: Bearer {token}` header
3. Check token expiration

### Issue: User Not Redirected After Login

**Solution:**

1. Check if dashboard routes exist
2. Verify role mapping is correct
3. Check browser console for errors

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Context API](https://react.dev/reference/react/createContext)

---

## 🎉 You're All Set!

Your authentication system is now connected to your real backend. Make sure to:

1. Update the API URL in `.env.local`
2. Test all authentication flows
3. Verify role-based routing works correctly

Good luck! 🚀
