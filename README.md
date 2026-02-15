# UDSM Global Reach - OJS Metrics Dashboard

A modern, real-time analytics dashboard for Open Journal Systems (OJS), built with React, TypeScript, and TanStack Query.

## 🚀 Quick Start

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- OJS 3.x instance running (e.g., at `http://localhost:8000`)
- OJS API key with Manager/Sub Editor/Admin permissions

### Setup

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Step 2: Install dependencies
npm i

# Step 3: Configure API Key (REQUIRED)
# Create .env.local file:
echo "VITE_OJS_API_KEY=your-api-key-here" > .env.local
echo "VITE_OJS_BASE_URL=http://localhost:8000" >> .env.local

# Step 4: Start development server
npm run dev
```

**Dashboard will be available at:** `http://localhost:8081`

## 🔑 Getting Your API Key

1. Log into OJS with Manager/Sub Editor/Admin role
2. Navigate to: **User Profile → API Key tab**
3. Check "✅ Enable external applications"
4. Check "✅ Generate new API key"
5. Click **Save** and copy the generated key
6. Add key to `.env.local` or [src/config/ojs.ts](src/config/ojs.ts)

**Detailed instructions:** See [docs/API_KEY_SETUP.md](docs/API_KEY_SETUP.md)

## 📊 Features

- **Real-time Metrics**: Publication views, downloads, editorial statistics
- **Live Activity Feed**: Recent submission and user activity
- **Geographic Analytics**: Top countries by readership
- **Editorial Workflow Stats**: Submissions, acceptances, review times
- **Auto-refresh**: Updates every 5 minutes
- **Smart Caching**: Optimized with TanStack Query
- **No Dummy Data**: Shows empty states when disconnected

## 🛠️ Technologies

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **TanStack Query (React Query)** - Data fetching & caching
- **Vite** - Fast build tool
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first styling
- **OJS Analytics API v3** - Data source

## 📁 Project Structure

```
src/
├── services/
│   └── ojsApi.ts           # OJS Analytics API integration
├── hooks/
│   └── useOJSData.ts       # React Query hooks for data fetching
├── config/
│   └── ojs.ts              # Configuration (API key, URL, etc.)
├── pages/
│   └── Index.tsx           # Main dashboard page
└── components/
    ├── LiveActivity.tsx     # Real-time activity feed
    ├── TopCountries.tsx     # Geographic statistics
    ├── JournalStats.tsx     # Publication metrics
    └── MetricCard.tsx       # Metric display component
```

## 📚 Documentation

- [**API_KEY_SETUP.md**](docs/API_KEY_SETUP.md) - ⭐ **START HERE**: Complete API key setup guide
- [**OJS_ANALYTICS_API_DOCUMENTATION.md**](OJS_ANALYTICS_API_DOCUMENTATION.md) - Official OJS API reference
- [**IMPLEMENTATION_SUMMARY.md**](IMPLEMENTATION_SUMMARY.md) - Implementation details
- [**OJS_API_INTEGRATION.md**](docs/OJS_API_INTEGRATION.md) - Technical integration guide
- [**QUICK_START.md**](docs/QUICK_START.md) - Quick reference

## 🔧 Configuration

### Environment Variables (`.env.local`)
```env
VITE_OJS_API_KEY=your-api-key-here
VITE_OJS_BASE_URL=http://localhost:8000
VITE_OJS_CONTEXT=index
```

### Or in Code ([src/config/ojs.ts](src/config/ojs.ts))
```typescript
export const OJS_CONFIG = {
  baseUrl: 'http://localhost:8000',
  defaultContext: 'index',
  auth: {
    apiKey: 'your-api-key-here'
  }
}
```

## 🧪 Testing Connection

Dashboard automatically tests connection on load. Check for:
- ✅ **No alert** = Connected successfully
- ⚠️ **Yellow alert** = Not connected (check API key & OJS URL)

Manual API test:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://localhost:8000/index.php/index/api/v1/stats/publications"
```

## 🚨 Troubleshooting

### "API key not configured"
1. Generate key from OJS profile (see [docs/API_KEY_SETUP.md](docs/API_KEY_SETUP.md))
2. Add to `.env.local` or [src/config/ojs.ts](src/config/ojs.ts)
3. Restart dev server

### "Could not connect to OJS"
1. Verify OJS is running: `curl http://localhost:8000`
2. Check API key is valid (regenerate if needed)
3. Verify you have Manager/Sub Editor/Admin role
4. Check browser console for detailed errors

### CORS Errors
Add to OJS `config.inc.php`:
```ini
allowed_hosts = ["localhost:8081"]
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Environment Setup
1. Update `VITE_OJS_BASE_URL` to production OJS URL
2. Configure CORS in OJS for production domain
3. Deploy to your hosting platform (Vercel, Netlify, etc.)

## 📖 OJS API Endpoints Used

```
/api/v1/stats/publications   # Publication views & downloads
/api/v1/stats/editorial      # Editorial workflow statistics
/api/v1/stats/users          # User role breakdown
```

All require Bearer token authentication.
