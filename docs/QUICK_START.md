# OJS API Quick Start Guide

## Quick Test

To test the OJS API integration:

1. **Start your OJS instance** at `http://localhost:8000`
2. **Run the dashboard**:
   ```bash
   npm run dev
   ```
3. **Check the dashboard** - it should show either:
   - Real data from OJS (with green "Live updates" indicator)
   - Empty states with messages to connect to OJS if API is not accessible

## API Endpoints Quick Reference

All endpoints are prefixed with: `http://localhost:8000/index.php/{context}/api/v1/`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/submissions` | GET | List submissions/articles |
| `/stats/publications` | GET | Publication statistics |
| `/stats/context` | GET | Journal-level statistics |
| `/stats/editorial` | GET | Editorial workflow stats |
| `/contexts` | GET | List all journals |

## Example API Calls

### Get 10 published submissions
```bash
curl "http://localhost:8000/index.php/index/api/v1/submissions?status=3&count=10"
```

### Get statistics for last 30 days
```bash
curl "http://localhost:8000/index.php/index/api/v1/stats/publications?dateStart=2026-01-15&dateEnd=2026-02-14"
```

### Test connection
```bash
curl "http://localhost:8000/index.php/index/api/v1/_submissions"
```

## Dashboard Features with OJS API

✅ **Real-time Metrics**
- Total Downloads (from stats API)
- Total Publications (from submissions API)
- Active Readers (calculated from stats)
- Countries Reached (from geo-location data)

✅ **Live Activity Feed**
- Recent paper views/downloads
- Country of origin
- Activity type (download/view/citation)
- Auto-updates every 6 seconds

✅ **Top Countries**
- Reader distribution by country
- Visual progress bars
- Percentage breakdowns
- Trend indicators

✅ **Journal Performance**
- Papers published per journal
- Readers count
- Citations count
- Impact factors

## Configuration

### Change OJS Server URL

Edit `src/services/ojsApi.ts`:

```typescript
const OJS_BASE_URL = 'http://your-ojs-server.com';
```

### Change Context (Journal)

Edit `src/pages/Index.tsx`:

```typescript
const { data: metrics } = useDashboardMetrics('your-journal-path');
```

### Adjust Data Refresh Rate

Edit `src/hooks/useOJSData.ts`:

```typescript
refetchInterval: 5 * 60 * 1000, // 5 minutes in milliseconds
```

## Troubleshooting

### "Using Demo Data" Alert

**Cause**: Cannot connect to OJS API
**Fix**: 
1. Verify OJS is running: `curl http://localhost:8000`
2. Check browser console for errors
3. Verify CORS settings in OJS config

### CORS Errors

**Fix**: Add to OJS `config.inc.php`:
```ini
allowed_hosts = ["localhost:5173"]
```

### No Statistics Data

**Fix**: Enable Usage Statistics plugin in OJS:
1. Go to OJS Admin > Settings > Website > Plugins
2. Enable "Usage Statistics Plugin"
3. Wait for statistics to be processed

## Architecture

```
┌─────────────────────────────────────┐
│   Dashboard (React + TypeScript)    │
│   - Index.tsx (Main page)           │
│   - Components (UI elements)        │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   React Query Hooks                  │
│   - useDashboardMetrics()           │
│   - useOJSSubmissions()             │
│   - usePublicationStats()           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   API Service Layer                  │
│   - fetchSubmissions()              │
│   - fetchPublicationStats()         │
│   - fetchDashboardMetrics()         │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   OJS REST API (localhost:8000)     │
│   - /api/v1/submissions             │
│   - /api/v1/stats/*                 │
└─────────────────────────────────────┘
```

## Key Files

- `src/services/ojsApi.ts` - API service with all endpoint functions
- `src/hooks/useOJSData.ts` - React Query hooks for data fetching
- `src/pages/Index.tsx` - Main dashboard page
- `src/components/LiveActivity.tsx` - Live activity feed
- `src/components/TopCountries.tsx` - Top countries widget
- `src/components/JournalStats.tsx` - Journal statistics table

## Next Steps

1. ✅ API service layer created
2. ✅ React Query hooks implemented
3. ✅ Dashboard components updated
4. 🔄 Test with live OJS instance
5. ⏭️ Add authentication (if needed)
6. ⏭️ Configure production deployment
