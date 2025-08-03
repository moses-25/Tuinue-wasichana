# JWT Token Configuration Guide

## Current JWT Settings

The application now has proper JWT token expiration configured:

### Default Token Lifetimes:
- **Access Token:** 1 hour (3600 seconds)
- **Refresh Token:** 30 days (2592000 seconds)

### Environment Variables (Optional):
You can customize token lifetimes in Render by setting these environment variables:

```
JWT_ACCESS_TOKEN_EXPIRES=3600    # Access token lifetime in seconds (default: 1 hour)
JWT_REFRESH_TOKEN_EXPIRES=2592000 # Refresh token lifetime in seconds (default: 30 days)
```

## How Token Refresh Works:

1. **User logs in** → Gets access token (1 hour) + refresh token (30 days)
2. **Access token expires** → Frontend automatically tries to refresh
3. **Refresh successful** → New access token issued, user continues seamlessly
4. **Refresh fails** → User redirected to login page

## Frontend Automatic Handling:

The frontend now automatically:
- ✅ **Detects expired tokens** (401 errors with "expired" message)
- ✅ **Attempts token refresh** using stored refresh token
- ✅ **Retries original request** with new token
- ✅ **Redirects to login** if refresh fails
- ✅ **Clears stored tokens** on logout

## Recommended Settings:

### Development:
```
JWT_ACCESS_TOKEN_EXPIRES=3600     # 1 hour
JWT_REFRESH_TOKEN_EXPIRES=604800  # 7 days
```

### Production:
```
JWT_ACCESS_TOKEN_EXPIRES=1800     # 30 minutes (more secure)
JWT_REFRESH_TOKEN_EXPIRES=2592000 # 30 days
```

### High Security:
```
JWT_ACCESS_TOKEN_EXPIRES=900      # 15 minutes
JWT_REFRESH_TOKEN_EXPIRES=86400   # 1 day
```

## User Experience:

- **Short access tokens** = More secure, frequent refresh (invisible to user)
- **Long refresh tokens** = Less frequent logins required
- **Automatic refresh** = Seamless user experience

## Troubleshooting:

If users are getting logged out frequently:
1. **Check token expiration settings** in environment variables
2. **Verify refresh token endpoint** is working (`/auth/refresh`)
3. **Check browser console** for token refresh errors
4. **Ensure refresh tokens** are being stored properly

The current configuration provides a good balance of security and user experience.