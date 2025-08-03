# CORS Configuration Guide

## Setting up CORS Origins in Render

To configure CORS origins for your deployed application, set the `CORS_ORIGINS` environment variable in your Render dashboard.

### Steps:

1. **Go to your Render Dashboard**
2. **Select your backend service**
3. **Go to Environment tab**
4. **Add a new environment variable:**
   - **Key:** `CORS_ORIGINS`
   - **Value:** Your frontend URLs separated by commas

### Examples:

**For Production:**
```
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app
```

**For Development + Production:**
```
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://your-frontend.vercel.app
```

**Allow All Origins (NOT RECOMMENDED for production):**
```
CORS_ORIGINS=*
```

### Default Values:
If no `CORS_ORIGINS` environment variable is set, the application will default to:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Alternative Vite port)

### Notes:
- **No spaces around commas** - Use `url1,url2` not `url1, url2`
- **Include protocol** - Use `https://` or `http://`
- **No trailing slashes** - Use `https://example.com` not `https://example.com/`
- **Case sensitive** - URLs are case-sensitive

### Verification:
After setting the environment variable:
1. Redeploy your service in Render
2. Check the application logs for: `CORS Origins configured: [...]`
3. Test CORS by making a request from your frontend

### Common Frontend URLs:
- **Vercel:** `https://your-app.vercel.app`
- **Netlify:** `https://your-app.netlify.app`
- **GitHub Pages:** `https://username.github.io/repository`
- **Local Development:** `http://localhost:5173` or `http://localhost:5174`