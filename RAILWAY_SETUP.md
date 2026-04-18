# Railway Environment Variables Setup

## 🚨 IMMEDIATE ACTION REQUIRED

### 1. Go to Railway Dashboard
- Open: https://railway.app
- Select your project
- Go to backend service
- Click on "Variables" tab

### 2. Add These Environment Variables:

```
BREVO_API_KEY=your_actual_brevo_api_key_here
FRONTEND_URL=https://subtle-gumdrop-648ce7.netlify.app
PORT=5454
```

### 3. Deploy Settings
- Make sure "Auto-deploy" is ON
- Or manually trigger deploy from GitHub

### 4. Current Problem
- 403 Forbidden errors because Railway doesn't have latest code
- Admin user creation not working because env vars missing
- OTP system working but authentication failing

### 5. Quick Test
After setting env vars, test:
1. Create admin: POST /api/admin/create
2. Check admin: GET /api/admin/check
3. Login with admin credentials

### Admin Credentials
- Email: shuklarohan388@gmail.com
- Password: admin123
- Role: ROLE_ADMIN

## 🔧 Debug Steps
1. Set environment variables in Railway
2. Wait for auto-deploy or manual deploy
3. Check Railway logs for errors
4. Test admin endpoints
