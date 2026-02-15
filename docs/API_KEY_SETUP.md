# OJS API Key Setup Guide

## Quick Start

To connect your dashboard to OJS Analytics API, you need an API key. Follow these steps:

### Step 1: Configure API Secret in OJS (Admin - One Time Only)

Before anyone can generate API keys, an administrator must set the API secret:

1. **Open `config.inc.php`** in your OJS installation directory
2. **Find the security section** (around line 271):
   ```ini
   [security]
   ; The unique secret used for encoding and decoding API keys
   api_key_secret = ""
   ```
3. **Set a strong secret key**:
   ```ini
   api_key_secret = "your-very-long-random-secret-key-here-keep-it-secure"
   ```
4. **Save the file** and restart your web server

⚠️ **Important**: Keep this secret secure! Anyone with this key could forge API tokens.

---

### Step 2: Generate Your Personal API Key

Once the secret is configured, each user can generate their own API key:

1. **Log in to OJS** with your account (must have Manager, Sub Editor, or Site Admin role)

2. **Go to your profile:**
   - Click your username in the top right corner
   - Select "View Profile" or "Edit Profile"

3. **Navigate to API tab:**
   - Look for tabs: [Public] [Identity] [Contact] [Roles] [Password] **[API Key]**
   - Click on "API Key" tab
   - Or go directly to: `http://localhost/tjpsd/index.php/index/user/profile` → "API" tab

4. **Enable and Generate API Key:**
   - ✅ Check "Enable external applications with an API key to access this account"
   - ✅ Check "Generate new API key"
   - Click **Save**

5. **Copy your API key** from the "API Key" field
   - It will be a long JWT token like: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

---

### Step 3: Add API Key to Dashboard

You have two options:

#### Option A: Environment Variables (Recommended)

1. Create `.env.local` in your project root:
   ```env
   VITE_OJS_BASE_URL=http://localhost:8000
   VITE_OJS_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...your-key-here
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

#### Option B: Configuration File

1. Edit `src/config/ojs.ts`:
   ```typescript
   export const OJS_CONFIG = {
     baseUrl: 'http://localhost:8000',
     defaultContext: 'index',
     
     auth: {
       apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...your-key-here',
     },
   };
   ```

2. Save and the dashboard will automatically reconnect

---

## Troubleshooting

### Problem: Can't see API Key tab in profile

**Cause**: You don't have the required role

**Solution**: 
- Only users with **Manager**, **Sub Editor**, or **Site Admin** roles can generate API keys
- Ask your site administrator to grant you the appropriate role
- Check assigned roles in your user profile → "Roles" tab

---

### Problem: "API secret key missing" error

**Cause**: The `api_key_secret` is not configured in `config.inc.php`

**Solution**:
1. Open `config.inc.php` in your OJS installation
2. Set `api_key_secret = "your-long-random-secret-here"`
3. Restart your web server (Apache/Nginx)

---

### Problem: API key doesn't work / 401 Unauthorized

**Causes & Solutions**:

1. **API key not enabled in profile:**
   - Go to your OJS profile → API Key tab
   - Ensure "Enable external applications..." is checked
   - Click Save

2. **Wrong API key format:**
   - The key should be used with `Authorization: Bearer YOUR_KEY`
   - Don't modify or trim the key

3. **API key expired or regenerated:**
   - If you checked "Generate new API key" again, the old key is invalidated
   - Copy the new key and update your dashboard configuration

4. **Insufficient permissions:**
   - Stats APIs require: Site Admin, Manager, or Sub Editor roles
   - Check your assigned roles

---

### Problem: CORS errors in browser console

**Cause**: Cross-origin request blocked

**Solution for Development**:

If your dashboard runs on a different port than OJS, configure CORS:

**Option 1: OJS CORS Configuration**
Add to OJS `config.inc.php`:
```ini
[security]
allowed_hosts = ["localhost:8081", "localhost:5173", "localhost:3000"]
```

**Option 2: Development Proxy** (Vite)
Add to `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/ojs-api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ojs-api/, '/index.php/index/api/v1'),
      },
    },
  },
});
```

---

### Problem: Empty data or "No data available"

**Common causes**:

1. **No published content:**
   - Stats only track published submissions
   - Ensure you have published articles in OJS

2. **Date range issue:**
   - Try expanding the date range in queries
   - Check if there's activity in the specified period

3. **Wrong context/journal:**
   - Verify you're using the correct journal path in `defaultContext`
   - Check the journal's short name in OJS settings

---

## Testing Your Connection

### Method 1: Check Dashboard Alert

The dashboard automatically tests the connection on load:
- ✅ No alert = Connected successfully
- ⚠️ Yellow alert = Connection issue (see message for details)

### Method 2: Browser Console

Open Developer Tools (F12) and check the Console tab:
- Look for "Fetching publication stats..." log messages
- Check for any error messages or failed requests
- Inspect Network tab for API request details

### Method 3: Direct API Call

Test with curl:
```bash
curl -X GET "http://localhost:8000/index.php/index/api/v1/stats/publications?count=5" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE"
```

Expected response: JSON with publication statistics

---

## Security Best Practices

1. **Never commit API keys to git**
   - Add `.env.local` to `.gitignore`
   - Use environment variables in production

2. **Regenerate keys if exposed**
   - If you accidentally commit or share your key, regenerate it immediately
   - Go to OJS profile → API Key → Generate new key

3. **Use different keys for different environments**
   - Generate separate keys for development, staging, and production
   - Easier to track and revoke if needed

4. **Restrict user roles**
   - Only grant API-generating roles (Manager, Sub Editor) to trusted users
   - Regularly review user roles and permissions

---

## API Key Information

### What is the API Key?

The OJS API key is a JWT (JSON Web Token) that:
- Identifies and authenticates your user account
- Grants access to protected API endpoints
- Contains encrypted user and permission information
- Expires based on OJS session settings

### Format

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL3RqcHNkXC9pbmRleC5waHBcL2luZGV4IiwiaWF0IjoxNzM5NDk2MDAwLCJleHAiOjE3Mzk0OTk2MDAsInVzZXJJZCI6MX0.abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG
```

Parts:
1. Header: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9`
2. Payload: `eyJpc3MiOiJod...` (contains user info)
3. Signature: `abcdefgh...` (cryptographic signature)

### Where is it stored?

- In OJS database, encrypted with `api_key_secret`
- Not stored in cookies or local storage by default
- You must include it in each API request header

---

## Additional Resources

- [OJS Analytics API Documentation](./OJS_ANALYTICS_API_DOCUMENTATION.md)
- [Dashboard Configuration Guide](./OJS_API_INTEGRATION.md)
- [Quick Start Guide](./QUICK_START.md)
- [OJS Official Documentation](https://docs.pkp.sfu.ca/)

---

## Need Help?

If you're still having issues:

1. Check the dashboard connection status alert for specific error messages
2. Review browser console for detailed error logs
3. Verify OJS is running: `curl http://localhost:8000`
4. Test API endpoint manually with curl (see Testing section above)
5. Check OJS error logs: `files/usageStats/` and `cache/` directories
6. Ensure your user has the required role permissions

---

## Summary Checklist

- [ ] OJS `api_key_secret` configured in `config.inc.php`
- [ ] Web server restarted after config change
- [ ] Logged into OJS with Manager/Sub Editor/Admin role
- [ ] API key generated from profile → API Key tab
- [ ] "Enable external applications..." checkbox checked
- [ ] API key copied and added to dashboard config or `.env.local`
- [ ] Dashboard dev server restarted
- [ ] Connection test shows success (no alert on dashboard)
- [ ] Can see real data from OJS in the dashboard

Once all these are checked, your dashboard should be fully connected to OJS! 🎉
