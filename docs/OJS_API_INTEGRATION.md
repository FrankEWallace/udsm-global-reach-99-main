# OJS API Integration Documentation

## Overview

This dashboard integrates with Open Journal Systems (OJS) 3.x REST API to display real-time metrics and analytics for UDSM research publications.

## Setup

### Prerequisites

1. **OJS Instance Running**: Ensure your OJS instance is running at `http://localhost:8000`
2. **CORS Configuration**: OJS must allow requests from your dashboard origin
3. **API Access**: Make sure the OJS API endpoints are publicly accessible or you have configured authentication

### Configuration

The API base URL is configured in `src/services/ojsApi.ts`:

```typescript
const OJS_BASE_URL = 'http://localhost:8000';
```

To change the OJS server URL, modify this constant.

## API Endpoints Used

The dashboard connects to the following OJS API endpoints:

### 1. Submissions
- **Endpoint**: `/index.php/{contextPath}/api/v1/submissions`
- **Purpose**: Fetch published submissions/articles
- **Parameters**:
  - `status`: Filter by submission status (3 = published)
  - `count`: Number of results to return
  - `offset`: Pagination offset

### 2. Publication Statistics
- **Endpoint**: `/index.php/{contextPath}/api/v1/stats/publications`
- **Purpose**: Get download and view statistics for publications
- **Parameters**:
  - `dateStart`: Start date for statistics (YYYY-MM-DD)
  - `dateEnd`: End date for statistics (YYYY-MM-DD)
  - `count`: Number of results

### 3. Context Statistics
- **Endpoint**: `/index.php/{contextPath}/api/v1/stats/context`
- **Purpose**: Get context-level (journal-level) statistics
- **Parameters**:
  - `dateStart`: Start date for statistics
  - `dateEnd`: End date for statistics

### 4. Editorial Statistics
- **Endpoint**: `/index.php/{contextPath}/api/v1/stats/editorial`
- **Purpose**: Get editorial workflow statistics

### 5. Contexts (Journals)
- **Endpoint**: `/api/v1/contexts`
- **Purpose**: List all available journals/contexts

## Dashboard Metrics

The dashboard displays the following metrics from OJS:

### Key Metrics
1. **Total Downloads**: Aggregated from publication statistics
2. **Total Publications**: Count of published submissions
3. **Active Readers**: Estimated from recent view statistics
4. **Countries Reached**: Unique countries from statistics data

### Components

#### 1. MetricCard
Displays individual metric cards with animated counters.

#### 2. LiveActivity
Shows real-time activity feed of recent paper views/downloads.
- Uses recent submissions data
- Updates every 6 seconds
- Shows country, paper title, and activity type

#### 3. TopCountries
Displays top countries by readership with progress bars.
- Extracted from statistics data
- Shows percentage and trend

#### 4. JournalStats
Table view of journal performance metrics.
- Papers published
- Readers count
- Citations
- Impact factor

## Implementation Files

### API Service Layer
- **File**: `src/services/ojsApi.ts`
- **Purpose**: Core API functions for fetching data from OJS
- **Key Functions**:
  - `fetchSubmissions()`: Get submissions from OJS
  - `fetchPublicationStats()`: Get publication statistics
  - `fetchContextStats()`: Get context statistics
  - `fetchDashboardMetrics()`: Aggregate all metrics
  - `testOJSConnection()`: Test API connectivity

### React Query Hooks
- **File**: `src/hooks/useOJSData.ts`
- **Purpose**: React Query hooks for data fetching and caching
- **Hooks**:
  - `useDashboardMetrics()`: Main hook for dashboard data
  - `useOJSSubmissions()`: Fetch submissions
  - `usePublicationStats()`: Fetch statistics
  - `useOJSConnection()`: Test connection status

### Page Components
- **File**: `src/pages/Index.tsx`
- **Purpose**: Main dashboard page that orchestrates all components
- **Features**:
  - Loading states with skeleton loaders
  - Error handling with alerts
  - Connection status display

## Data Flow

```
OJS API (localhost:8000)
    ↓
API Service Layer (ojsApi.ts)
    ↓
React Query Hooks (useOJSData.ts)
    ↓
Dashboard Components (Index.tsx)
    ↓
UI Components (MetricCard, LiveActivity, etc.)
```

## Caching & Refresh

The dashboard uses React Query for intelligent caching:

- **Dashboard Metrics**: 5-minute cache, auto-refresh every 5 minutes
- **Submissions**: 10-minute cache
- **Statistics**: 5-minute cache
- **Contexts**: 30-minute cache

## Fallback Data

If the OJS API is unavailable, the dashboard will display empty states with helpful messages prompting users to connect to the OJS API. The `useFallbackData` feature flag in configuration can be enabled to show demo data instead of empty states.

## Error Handling

The dashboard handles errors gracefully:

1. **Connection Failed**: Shows alert with connection status and empty states
2. **API Error**: Logs error and displays empty states with helpful messages
3. **Partial Success**: Uses available endpoints and shows warning for failed ones

## Troubleshooting

### Connection Issues

1. **Check OJS is running**:
   ```bash
   curl http://localhost:8000
   ```

2. **Check API accessibility**:
   ```bash
   curl http://localhost:8000/index.php/index/api/v1/submissions
   ```

3. **CORS Issues**: Add to OJS `config.inc.php`:
   ```php
   allowed_hosts = ["localhost:5173", "localhost:3000"]
   ```

### Common Problems

**Problem**: "Using Demo Data" alert appears
- **Solution**: Ensure OJS is running and accessible at localhost:8000. Dashboard now shows empty states instead of demo data when disconnected.
- **Check**: Browser console for detailed error messages

**Problem**: No statistics showing
- **Solution**: Ensure the statistics plugin is enabled in OJS
- **Check**: OJS Site Settings > Plugins > Usage Statistics Plugin

**Problem**: Country data not showing
- **Solution**: OJS needs geographic data configured
- **Check**: OJS usage statistics geo-location configuration

## API Authentication

Currently, the dashboard accesses public API endpoints. For production:

1. **Generate API Key** in OJS admin panel
2. **Add to requests** in `ojsApi.ts`:
   ```typescript
   headers: {
     'Authorization': `Bearer ${API_KEY}`,
   }
   ```

## Customization

### Change Context Path

The default context is `'index'`. To use a different journal:

```typescript
const { data: metrics } = useDashboardMetrics('your-journal-path');
```

### Adjust Refresh Intervals

Modify in `src/hooks/useOJSData.ts`:

```typescript
staleTime: 5 * 60 * 1000, // Change this value
refetchInterval: 5 * 60 * 1000, // And this value
```

### Add Custom Metrics

1. Add endpoint function in `ojsApi.ts`
2. Create hook in `useOJSData.ts`
3. Use in dashboard components

## Development

### Run Dashboard
```bash
npm run dev
```

### Test API Connection
The dashboard automatically tests the connection on load and displays status in the console and UI.

### Debug Mode
Check browser console for detailed API logs including:
- Request URLs
- Response data
- Error messages

## Production Deployment

1. **Update Base URL**: Change `OJS_BASE_URL` in `ojsApi.ts` to production URL
2. **Configure CORS**: Update OJS `allowed_hosts` configuration
3. **Add Authentication**: Implement API key authentication
4. **Enable Caching**: Consider adding a caching layer for better performance
5. **Error Tracking**: Integrate error tracking service (e.g., Sentry)

## Resources

- [OJS Documentation](https://docs.pkp.sfu.ca/)
- [OJS REST API Guide](https://docs.pkp.sfu.ca/dev/api/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [OJS GitHub Repository](https://github.com/pkp/ojs)

## Support

For issues related to:
- **Dashboard**: Check browser console and component logs
- **OJS API**: Refer to OJS documentation and logs
- **Integration**: Review the API service layer and error messages
