# Render Free Plan Setup Guide

## 🆓 **Free Plan Limitations:**
- ❌ No manual script execution
- ❌ No SSH access
- ❌ No pre-deploy hooks
- ✅ Only build and start commands work

## 🔧 **Render Dashboard Commands (Free Plan):**

### **Build Command:**
```bash
chmod +x build.sh && ./build.sh
```

### **Start Command:**
```bash
gunicorn --bind 0.0.0.0:$PORT wsgi:application
```

### **Pre-Deploy Command:**
```
(Leave this EMPTY - not available on free plan)
```

## 🚀 **How It Works on Free Plan:**

### **During Build Phase:**
1. **Install dependencies** (`pip install -r requirements.txt`)
2. **Try database initialization** (if DATABASE_URL available)
3. **Continue even if DB not ready** (database might not be provisioned yet)

### **During Startup Phase:**
1. **App starts with wsgi:application**
2. **Automatic database initialization** runs in wsgi.py
3. **Creates tables and admin user** if needed
4. **Handles enum conflicts** gracefully
5. **App becomes available**

## 🗄️ **Database Initialization Strategy:**

### **Multi-Phase Approach:**
1. **Build time** - Try to initialize if DB is ready
2. **Startup time** - Always try to initialize (main strategy)
3. **Runtime** - Graceful handling of missing tables

### **Error Handling:**
- ✅ **Enum already exists** → Skip and continue
- ✅ **Tables already exist** → Skip and continue  
- ✅ **Database not ready** → Retry with backoff
- ✅ **Complete failure** → App still starts (manual fix needed)

## 📋 **Environment Variables (Auto-set by render.yaml):**
```
FLASK_ENV=production
INIT_DB=true
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000
DATABASE_URL=(auto-generated)
SECRET_KEY=(auto-generated)
JWT_SECRET_KEY=(auto-generated)
```

## 🎯 **Expected Deployment Flow:**

### **Successful Scenario:**
```
🚀 Starting Render build process...
📦 Installing Python dependencies...
⏳ Waiting for database provisioning...
🗄️ Initializing database...
Database connection successful!
Database tables created successfully!
✅ Build completed successfully!
Starting gunicorn...
Robust database initialization...
Default admin user created!
App is ready!
```

### **Database Not Ready Scenario:**
```
🚀 Starting Render build process...
📦 Installing Python dependencies...
⏳ Waiting for database provisioning...
⚠️ DATABASE_URL not available during build
✅ Build completed successfully!
Starting gunicorn...
Waiting for database to become available...
Database connection successful!
Database tables created successfully!
App is ready!
```

## 🔍 **Troubleshooting:**

### **If App Doesn't Start:**
1. **Check logs** for database connection errors
2. **Verify environment variables** are set
3. **Database might still be provisioning** (wait 5-10 minutes)

### **If Database Issues Persist:**
The app will start anyway, but you might need to:
1. **Redeploy** after database is fully ready
2. **Check DATABASE_URL** format is correct
3. **Verify database service** is running

## ✅ **What's Automated:**
- ✅ **Dependency installation**
- ✅ **Database table creation**
- ✅ **Enum conflict resolution**
- ✅ **Admin user creation**
- ✅ **CORS configuration**
- ✅ **JWT token setup**
- ✅ **Health check endpoints**

Everything happens automatically - no manual intervention needed! 🎉