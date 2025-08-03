# Quick Deployment Guide - Fix Backend Issues

## 🚨 **Current Issues:**
1. **CORS errors** - Backend changes not deployed yet
2. **JWT token expiration** - Need proper configuration
3. **500 Internal Server errors** - Backend needs updates

## 🚀 **Deploy Backend Changes to Render:**

### **Step 1: Push Changes to Git**
```bash
# In your project root directory
git add .
git commit -m "Fix CORS and JWT configuration"
git push origin main
```

### **Step 2: Set Environment Variables in Render**
1. Go to your **Render Dashboard**
2. Select your **backend service**
3. Go to **Environment** tab
4. Add these environment variables:

```
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://your-frontend-domain.com
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000
```

### **Step 3: Redeploy**
- Render will automatically redeploy when you push to Git
- Or manually trigger redeploy in Render dashboard

## 🔧 **Immediate Frontend Fixes Applied:**

### ✅ **Fixed HTML Nesting Error:**
- Changed `<p>` containing `<div>` to proper nesting in FAQ component

### ✅ **Enhanced Logout Function:**
- Added error handling for logout
- Emergency logout clears all localStorage
- Force page redirect if logout fails

### ✅ **JWT Token Management:**
- Added automatic token refresh
- Better error handling for expired tokens
- Configurable token expiration times

## 🆘 **Emergency Solutions (If Backend Still Down):**

### **Manual Logout (Browser Console):**
```javascript
// Type this in browser console if logout button doesn't work:
localStorage.clear();
window.location.href = '/';
```

### **Clear All Data:**
```javascript
// Complete reset:
window.emergencyLogout();
```

## 📋 **After Deployment Checklist:**

1. ✅ **Test CORS** - Frontend should connect to backend
2. ✅ **Test Login** - Should work without JWT errors  
3. ✅ **Test Logout** - Should clear tokens properly
4. ✅ **Test Charity Applications** - Admin should see real applications
5. ✅ **Check Logs** - Should see "CORS Origins configured" message

## 🔍 **Verify Deployment:**

### **Check Backend Logs:**
Look for these messages in Render logs:
```
CORS Origins configured: ['http://localhost:5173', 'http://localhost:5174', ...]
Flask-CORS installed successfully
```

### **Test API Endpoints:**
- Health check: `https://your-backend.onrender.com/api/v1/health`
- Should return without CORS errors

## 📞 **If Issues Persist:**

1. **Check Render build logs** for errors
2. **Verify environment variables** are set correctly
3. **Test with Postman** to isolate frontend vs backend issues
4. **Check if Flask-CORS** is properly installed

The main issue is that your backend changes haven't been deployed yet. Once you push to Git and Render redeploys, the CORS and JWT issues should be resolved!