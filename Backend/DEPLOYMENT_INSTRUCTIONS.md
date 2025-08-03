# Deployment Instructions for Render

## 🚀 **Automatic Database Initialization**

I've created a robust database initialization system that will:

### ✅ **Features:**
1. **Wait for database** to be available (up to 30 retries with exponential backoff)
2. **Multiple initialization methods** (SQLAlchemy, migrations, raw SQL)
3. **Graceful failure handling** (deployment continues even if DB init fails)
4. **Automatic admin user creation** (admin@tuinuewasichana.org / admin123)
5. **Connection retry logic** with proper error handling

### 📁 **Files Created:**
- `init_database.py` - Main database initialization script
- `build.sh` - Render build script that calls database init
- `render.yaml` - Updated Render configuration
- Enhanced `app.py` with retry logic

## 🔧 **Setup Instructions:**

### **Option 1: Use render.yaml (Recommended)**
1. **Commit all files** to your Git repository
2. **In Render Dashboard:**
   - Create new Web Service
   - Connect your Git repository
   - Render will automatically use `render.yaml` configuration
   - Database will be created and initialized automatically

### **Option 2: Manual Configuration**
1. **In Render Dashboard** → Your service → Settings:

   **Build Command:**
   ```bash
   chmod +x build.sh && ./build.sh
   ```

   **Start Command:**
   ```bash
   gunicorn --bind 0.0.0.0:$PORT app:app
   ```

2. **Environment Variables:**
   ```
   FLASK_ENV=production
   INIT_DB=true
   CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://your-frontend.vercel.app
   JWT_ACCESS_TOKEN_EXPIRES=3600
   JWT_REFRESH_TOKEN_EXPIRES=2592000
   ```

## 🗄️ **Database Initialization Process:**

### **What Happens During Deployment:**
1. **Install dependencies** (including psycopg2-binary)
2. **Wait for database** to be provisioned by Render
3. **Test database connection** with retries
4. **Create tables** using multiple fallback methods:
   - Try SQLAlchemy with app models
   - Try Alembic migrations
   - Try raw SQL from schema.sql
5. **Create admin user** if successful
6. **Start application** (even if DB init partially fails)

### **Error Handling:**
- **Database not ready?** → Waits up to 5 minutes with exponential backoff
- **Connection fails?** → Retries with increasing delays
- **Table creation fails?** → Tries multiple methods
- **Complete failure?** → Logs error but continues deployment

## 🔍 **Troubleshooting:**

### **Check Deployment Logs:**
Look for these messages:
```
🚀 Starting Render build process...
📦 Installing Python dependencies...
⏳ Waiting for database provisioning...
🗄️ Initializing database...
Database connection successful!
Database tables created successfully!
Default admin user created: admin@tuinuewasichana.org / admin123
✅ Build completed successfully!
```

### **If Database Init Fails:**
The deployment will still succeed, but you may need to:
1. **Check DATABASE_URL** environment variable
2. **Manually run migrations** after deployment
3. **Create admin user** manually

### **Manual Database Setup (if needed):**
```bash
# SSH into your Render service (if available) or run locally
python init_database.py
```

## 🎯 **Expected Results:**

After successful deployment:
- ✅ **CORS errors resolved** (Flask-CORS installed and configured)
- ✅ **JWT tokens working** (proper expiration times set)
- ✅ **Database tables created** (all models initialized)
- ✅ **Admin user available** (admin@tuinuewasichana.org / admin123)
- ✅ **API endpoints working** (health check, auth, etc.)

## 🔐 **Default Admin Credentials:**
- **Email:** admin@tuinuewasichana.org
- **Password:** admin123
- **Role:** admin

**⚠️ Change the admin password immediately after first login!**

## 📋 **Post-Deployment Checklist:**
1. ✅ Check deployment logs for successful database init
2. ✅ Test API health endpoint: `https://your-app.onrender.com/api/v1/health`
3. ✅ Test login with admin credentials
4. ✅ Verify CORS is working from frontend
5. ✅ Change admin password
6. ✅ Test charity application flow