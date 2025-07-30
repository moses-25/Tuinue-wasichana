# 🆓 Render Free Plan Deployment Guide

This guide is specifically optimized for deploying **Tuinue Wasichana** on Render's **FREE PLAN**.

## 🎯 Free Plan Limitations & Solutions

### Render Free Plan Includes:
- ✅ **Web Service**: 750 hours/month (sleeps after 15 min inactivity)
- ✅ **PostgreSQL Database**: 1GB storage, shared CPU
- ❌ **No Redis**: We use database-based sessions instead
- ❌ **No Background Workers**: We use simplified reminder system
- ❌ **No Custom Domains**: Uses `.onrender.com` subdomain

### Our Optimizations:
- 🔄 **Database-based sessions** instead of Redis
- 📅 **Simplified reminder system** without Celery workers
- ⚡ **Single Gunicorn worker** for memory efficiency
- 🗄️ **Optimized database connections** for shared resources

## 📁 Files to Create in Repository Root

### 1. **`render.yaml`** (Main deployment file)
```yaml
services:
  # Web Service (Flask API) - FREE PLAN OPTIMIZED
  - type: web
    name: tuinue-wasichana-api
    env: python
    plan: free
    buildCommand: cd Backend && pip install -r requirements.txt
    startCommand: cd Backend && gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 --max-requests 1000 --max-requests-jitter 100 app:app
    envVars:
      - key: FLASK_ENV
        value: production
      - key: FLASK_APP
        value: app.py
      - key: DATABASE_URL
        fromDatabase:
          name: tuinue-wasichana-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: JWT_SECRET_KEY
        generateValue: true
      - key: USE_REDIS
        value: false
      - key: SESSION_TYPE
        value: sqlalchemy

# Database - FREE PLAN
databases:
  - name: tuinue-wasichana-db
    databaseName: tuinue_wasichana
    user: tuinue_user
    plan: free
```

### 2. **`requirements.txt`** (Copy from Backend/requirements.txt)
```txt
alembic==1.16.4
amqp==5.3.1
aniso8601==10.0.1
billiard==4.2.1
blinker==1.9.0
celery==5.3.6
click==8.2.1
click-didyoumean==0.3.1
click-plugins==1.1.1.2
click-repl==0.3.0
Flask==2.3.3
Flask-JWT-Extended==4.7.1
Flask-Migrate==4.1.0
Flask-RESTful==0.3.10
Flask-SQLAlchemy==2.5.1
greenlet==3.2.3
gunicorn==21.2.0
itsdangerous==2.2.0
Jinja2==3.1.6
kombu==5.5.4
Mako==1.3.10
MarkupSafe==3.0.2
packaging==25.0
prompt_toolkit==3.0.51
psycopg2-binary==2.9.10
PyJWT==2.10.1
python-dateutil==2.9.0.post0
python-dotenv==1.0.1
pytz==2025.2
redis==5.0.1
six==1.17.0
SQLAlchemy==1.4.47
typing_extensions==4.14.1
tzdata==2025.2
vine==5.1.0
wcwidth==0.2.13
Werkzeug==2.3.7
Flask-RESTX==1.1.0
pytest==8.2.2
requests==2.31.0
```

### 3. **`runtime.txt`**
```txt
python-3.12.3
```

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
# Navigate to repository root (parent of Backend folder)
cd /path/to/your/repository

# Create the deployment files (copy content from above)
touch render.yaml
touch requirements.txt
touch runtime.txt

# Copy requirements from Backend
cp Backend/requirements.txt requirements.txt

# Commit changes
git add .
git commit -m "Add Render free plan deployment configuration"
git push origin main
```

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select your repository
5. Render will detect `render.yaml` automatically
6. Click **"Apply"** to create services

### Step 3: Configure Environment Variables
In Render dashboard, add these environment variables:

#### Required for Mpesa (Get from Safaricom Developer Portal):
```
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_BUSINESS_SHORT_CODE=your_shortcode_here
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://your-app-name.onrender.com/api/v1/payments/verify
```

#### Optional:
```
ADMIN_EMAIL=admin@tuinuewasichana.com
ADMIN_PASSWORD=your_secure_admin_password
CORS_ORIGINS=*
```

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "tuinue-wasichana-api"
}
```

### 2. User Registration
```bash
curl -X POST https://your-app-name.onrender.com/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "donor"
  }'
```

### 3. User Login
```bash
curl -X POST https://your-app-name.onrender.com/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Get Charities (Public endpoint)
```bash
curl https://your-app-name.onrender.com/api/v1/charities/
```

## 📊 Free Plan Monitoring

### Service Status
- **Web Service**: Monitor in Render dashboard
- **Database**: Check connection in health endpoint
- **Logs**: Available in Render dashboard

### Performance Tips
1. **Cold Starts**: Service sleeps after 15 minutes of inactivity
2. **Wake Up**: First request after sleep takes ~30 seconds
3. **Keep Alive**: Consider using a monitoring service to ping your app
4. **Database**: 1GB limit, monitor usage in dashboard

## 🔧 Free Plan Optimizations Applied

### Database Optimizations
```python
# In config/config.py
SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
    'pool_size': 5,      # Reduced for free plan
    'max_overflow': 0,   # No overflow for free plan
}
```

### Gunicorn Configuration
```bash
# Single worker, optimized timeouts
gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 --max-requests 1000 --max-requests-jitter 100 app:app
```

### Session Management
```python
# Database-based sessions instead of Redis
SESSION_TYPE = 'sqlalchemy'
USE_REDIS = False
```

## 🚨 Free Plan Limitations to Consider

### 1. **Service Sleep**
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes time to wake up
- **Solution**: Use external monitoring to keep alive (optional)

### 2. **No Background Workers**
- Celery workers not available on free plan
- **Solution**: Manual reminder processing via API endpoint
- **Alternative**: Use external cron service to trigger reminder processing

### 3. **Database Limits**
- 1GB storage limit
- Shared CPU resources
- **Solution**: Regular cleanup of old data

### 4. **No Redis**
- No caching layer
- **Solution**: Database-based sessions and simplified architecture

## 🔄 Manual Reminder Processing

Since background workers aren't available, reminders need manual processing:

### Option 1: API Endpoint (Recommended)
```bash
# Create an admin endpoint to process reminders
curl -X POST https://your-app-name.onrender.com/api/v1/admin/process-reminders \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Option 2: External Cron Service
Use services like:
- [cron-job.org](https://cron-job.org) (free)
- [EasyCron](https://www.easycron.com) (free tier)
- GitHub Actions (scheduled workflows)

## 📈 Scaling Beyond Free Plan

When you're ready to upgrade:

### Paid Plan Benefits
- ✅ **Always-on services** (no sleep)
- ✅ **Redis support** for caching
- ✅ **Background workers** for Celery
- ✅ **More resources** (CPU, memory)
- ✅ **Custom domains**

### Migration Path
1. Update `render.yaml` to remove `plan: free`
2. Add Redis service back
3. Enable Celery worker service
4. Update environment variables

## 🎉 Success Checklist

- [ ] Repository prepared with deployment files
- [ ] Render service deployed successfully
- [ ] Environment variables configured
- [ ] Health check responding
- [ ] User registration working
- [ ] Database connected
- [ ] API endpoints functional
- [ ] Mpesa configuration set (sandbox)

## 📞 Support

### Common Issues
1. **Build Failures**: Check Python version in `runtime.txt`
2. **Database Errors**: Verify `DATABASE_URL` is set correctly
3. **Import Errors**: Ensure all dependencies in `requirements.txt`
4. **Timeout Errors**: Service might be sleeping, wait for wake-up

### Resources
- [Render Documentation](https://render.com/docs)
- [Render Free Plan Details](https://render.com/pricing)
- [Flask Deployment Guide](https://render.com/docs/deploy-flask)

---

## 🎊 Your Free Deployment is Ready!

**Production URL**: `https://your-app-name.onrender.com`

**API Documentation**: `https://your-app-name.onrender.com/api/v1`

**Features Available on Free Plan**:
- ✅ Complete user management
- ✅ Charity application system
- ✅ Donation processing
- ✅ Mpesa integration
- ✅ Story management
- ✅ Beneficiary tracking
- ✅ Inventory management
- ✅ Admin dashboard
- ✅ API documentation

Your **Tuinue Wasichana** platform is now live and accessible to users worldwide! 🌍