/**
 * OJS API Configuration
 *
 * Centralized configuration for OJS 3.x REST API integration.
 * Endpoints: stats/publications, stats/editorial, stats/users
 * Auth: Bearer token via Authorization header
 * Docs: See OJS_ANALYTICS_API_DOCUMENTATION.md
 */

export const OJS_CONFIG = {
  /**
   * Base URL of your OJS installation (including journal path)
   * @example 'http://localhost/tjpsd'
   * @example 'https://journals.udsm.ac.tz/index.php/tjpsd'
   */
  baseUrl: '',  // empty = same origin; Vite proxy forwards /index.php/* to OJS on port 8000

  /** Default context / journal short-name */
  defaultContext: 'tjpsd',

  /** OJS 3.x REST API version path */
  apiVersion: 'api/v1',

  /** Data refresh intervals (ms) */
  refreshIntervals: {
    dashboardMetrics: 5 * 60 * 1000,
    submissions: 10 * 60 * 1000,
    statistics: 5 * 60 * 1000,
    contexts: 30 * 60 * 1000,
    connection: 60 * 1000,
  },

  /** Cache stale times (ms) */
  staleTimes: {
    dashboardMetrics: 5 * 60 * 1000,
    submissions: 10 * 60 * 1000,
    statistics: 5 * 60 * 1000,
    contexts: 30 * 60 * 1000,
    connection: 60 * 1000,
  },

  /** HTTP request settings */
  request: {
    retries: 0, // Fail fast - don't retry if OJS is down
    timeout: 10_000, // 10 second timeout
    includeCredentials: false,
  },

  /**
   * Authentication - JWT API key
   * Generate from OJS: User Profile -> API Key tab
   * The server config.inc.php must have api_key_secret set.
   */
  auth: {
    apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImZkYjU3NGU2NjgxY2ExMzg0YTk3MjA1YTYwZjNkMzlmOGE4NDlhYjMi.d1NKmyEhGCZclI5_nO_vsXmc1JnOGy0m2b2qFUjRH3s',
  },

  /** Feature flags */
  features: {
    autoRefresh: true,
    showConnectionAlerts: true,
    useFallbackData: false,
    debugMode: false,
  },

  /**
   * Manually configured journals (if /api/v1/contexts endpoint is restricted)
   * Add your journal paths here. Leave empty to fetch from API.
   */
  journals: [
    { urlPath: 'tjpsd', name: 'TJPSD' },
    { urlPath: 'ter', name: 'TER' },
    // Add more journals as needed:
    // { urlPath: 'another-journal', name: 'Another Journal' },
  ],

  /** Default date-range for stats queries */
  statistics: {
    defaultRangeDays: 30,
    maxRangeDays: 365,
  },
};

/* -- Helpers --------------------------------------------------------- */

export function getApiUrl(context: string, endpoint: string): string {
  return `${OJS_CONFIG.baseUrl}/index.php/${context}/${OJS_CONFIG.apiVersion}${endpoint}`;
}

export function getContextUrl(context: string): string {
  return `${OJS_CONFIG.baseUrl}/index.php/${context}`;
}

export function isAuthConfigured(): boolean {
  return !!OJS_CONFIG.auth.apiKey;
}

/* -- Environment variable overrides ---------------------------------- */
if (import.meta.env.VITE_OJS_BASE_URL) {
  OJS_CONFIG.baseUrl = import.meta.env.VITE_OJS_BASE_URL;
}
if (import.meta.env.VITE_OJS_CONTEXT) {
  OJS_CONFIG.defaultContext = import.meta.env.VITE_OJS_CONTEXT;
}
if (import.meta.env.VITE_OJS_API_KEY) {
  OJS_CONFIG.auth.apiKey = import.meta.env.VITE_OJS_API_KEY;
}
if (import.meta.env.DEV) {
  OJS_CONFIG.features.debugMode = true;
}

export default OJS_CONFIG;
