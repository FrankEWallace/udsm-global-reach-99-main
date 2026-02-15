/**
 * OJS API Service
 * Connects to Open Journal Systems REST API v3
 *
 * Endpoints used:
 *   GET /api/v1/stats/publications         publication view stats
 *   GET /api/v1/stats/publications/abstract abstract-view timeline
 *   GET /api/v1/stats/publications/galley   galley (download) timeline
 *   GET /api/v1/stats/editorial             editorial workflow stats
 *   GET /api/v1/stats/editorial/averages    yearly editorial averages
 *   GET /api/v1/stats/users                 user role counts
 */

import OJS_CONFIG from '@/config/ojs';

const OJS_BASE_URL = OJS_CONFIG.baseUrl;
const API_VERSION  = OJS_CONFIG.apiVersion;

/* ── Helpers ────────────────────────────────────────────────────── */

/** Extract localized string, preferring English variants then any available language */
function extractLocalizedString(value: string | Record<string, string> | undefined, fallback = ''): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  // Try en_US, en, then first available key
  return value.en_US || value.en || Object.values(value)[0] || fallback;
}

/* ── Types ──────────────────────────────────────────────────────── */

export interface OJSPublicationStats {
  abstractViews: number;
  galleyViews: number;
  pdfViews: number;
  htmlViews: number;
  otherViews: number;
  publication: {
    id: number;
    _href: string;
    urlWorkflow?: string;
    urlPublished?: string;
    authorsStringShort: string;
    fullTitle: string | Record<string, string>; // Can be string or locale object like {en_US: "title"}
  };
}

export interface OJSPublicationsResponse {
  items: OJSPublicationStats[];
  itemsMax: number;
}

export interface OJSEditorialStat {
  key: string;
  name: string;
  value: number;
}

export interface OJSEditorialAverages {
  submissionsReceivedPerYear: number;
  submissionsAcceptedPerYear: number;
  submissionsDeclinedPerYear: number;
}

export interface OJSUserStat {
  key: string;
  name: string;
  value: number;
}

export interface OJSTimelineItem {
  date: string;
  value: number;
}

export interface OJSContext {
  id: number;
  urlPath: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  enabled: boolean;
  _href: string;
}

export interface OJSContextsResponse {
  items: OJSContext[];
  itemsMax: number;
}

export interface AggregatedDashboardMetrics extends DashboardMetrics {
  contexts: OJSContext[];
  perContextMetrics: Map<string, DashboardMetrics>;
  selectedContext: string | null; // null = all journals aggregated
}

export interface DashboardMetrics {
  // Publication metrics
  totalDownloads: number;
  totalAbstractViews: number;
  totalGalleyViews: number;
  totalPdfViews: number;
  totalHtmlViews: number;
  totalOtherViews: number;
  totalPublications: number;
  
  // Submission & Issue counts (fast lookups)
  totalSubmissions: number;
  totalPublishedSubmissions: number;
  totalIssues: number;
  
  // User metrics
  activeReaders: number;
  totalAuthors: number;
  totalReviewers: number;
  totalEditors: number;
  totalManagers: number;
  totalUsers: number;
  
  // Editorial metrics
  submissionsReceived: number;
  submissionsAccepted: number;
  submissionsDeclined: number;
  submissionsDeclinedDeskReject: number;
  submissionsDeclinedPostReview: number;
  submissionsPublished: number;
  submissionsSkipped: number;
  submissionsImported: number;
  submissionsInReview: number;
  daysToDecision: number;
  daysToAccept: number;
  daysToReject: number;
  acceptanceRate: number;
  declineRate: number;
  declinedDeskRate: number;
  declinedReviewRate: number;
  
  // Yearly averages
  submissionsPerYear: number;
  acceptedPerYear: number;
  declinedPerYear: number;
  
  // Timeline data
  abstractViewsTimeline: OJSTimelineItem[];
  galleyViewsTimeline: OJSTimelineItem[];
  
  // Lists
  recentActivity: ActivityItem[];
  topPublications: TopPublication[];
  editorialStats: OJSEditorialStat[];
  userStats: OJSUserStat[];
}

export interface ActivityItem {
  id: string;
  title: string;
  authors: string;
  type: 'download' | 'view' | 'citation';
  abstractViews: number;
  pdfViews: number;
  timestamp: Date;
}

export interface TopPublication {
  id: number;
  title: string;
  authors: string;
  abstractViews: number;
  galleyViews: number;
  pdfViews: number;
}

/* ── Auth helper ────────────────────────────────────────────────── */

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (OJS_CONFIG.auth.apiKey) {
    headers['Authorization'] = `Bearer ${OJS_CONFIG.auth.apiKey}`;
  }
  return headers;
}

/* ── Date helpers ───────────────────────────────────────────────── */

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDateRange(days: number) {
  const end = new Date();
  end.setDate(end.getDate() - 1); // OJS requires end date to be yesterday or earlier
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { dateStart: formatDate(start), dateEnd: formatDate(end) };
}

/* ── Publication stats ──────────────────────────────────────────── */

export async function fetchPublicationStats(
  contextPath = OJS_CONFIG.defaultContext,
  params?: {
    dateStart?: string;
    dateEnd?: string;
    count?: number;
    offset?: number;
    orderDirection?: 'ASC' | 'DESC';
    searchPhrase?: string;
  },
): Promise<OJSPublicationsResponse> {
  const qp = new URLSearchParams();
  if (params?.dateStart) qp.append('dateStart', params.dateStart);
  if (params?.dateEnd) qp.append('dateEnd', params.dateEnd);
  if (params?.count) qp.append('count', params.count.toString());
  if (params?.offset) qp.append('offset', params.offset.toString());
  if (params?.orderDirection) qp.append('orderDirection', params.orderDirection);
  if (params?.searchPhrase) qp.append('searchPhrase', params.searchPhrase);

  const url = `${OJS_BASE_URL}/index.php/${contextPath}/${API_VERSION}/stats/publications?${qp}`;
  if (OJS_CONFIG.features.debugMode) console.log('[OJS] fetchPublicationStats:', url);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const res = await fetch(url, { 
      headers: getAuthHeaders(),
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    
    console.log('[OJS] Publication Stats Response Status:', res.status, res.statusText);
    
    if (!res.ok) {
      const txt = await res.text();
      console.error('[OJS] API Error Response:', txt.substring(0, 500));
      throw new Error(`Publication stats failed: ${res.status} ${res.statusText}`);
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const txt = await res.text();
      console.error('[OJS] Non-JSON Response:', txt.substring(0, 500));
      throw new Error(`Expected JSON but got ${contentType}. Response: ${txt.substring(0, 200)}`);
    }
    
    const data = await res.json();
    console.log('[OJS] Publication Stats Success:', { itemsMax: data.itemsMax, itemsCount: data.items?.length });
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[OJS] fetchPublicationStats timeout after 15s');
      throw new Error('Request timeout - OJS server took too long to respond');
    }
    console.error('[OJS] fetchPublicationStats error:', error);
    throw error;
  }
}

/* ── Abstract-view timeline ─────────────────────────────────────── */

export async function fetchAbstractTimeline(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { dateStart?: string; dateEnd?: string; timelineInterval?: 'day' | 'month' },
): Promise<OJSTimelineItem[]> {
  const qp = new URLSearchParams();
  if (params?.dateStart) qp.append('dateStart', params.dateStart);
  if (params?.dateEnd) qp.append('dateEnd', params.dateEnd);
  if (params?.timelineInterval) qp.append('timelineInterval', params.timelineInterval);

  const url = `${OJS_BASE_URL}/index.php/${contextPath}/${API_VERSION}/stats/publications/abstract?${qp}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Abstract timeline failed: ${res.status}`);
  return res.json();
}

/* ── Galley-view timeline ───────────────────────────────────────── */

export async function fetchGalleyTimeline(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { dateStart?: string; dateEnd?: string; timelineInterval?: 'day' | 'month' },
): Promise<OJSTimelineItem[]> {
  const qp = new URLSearchParams();
  if (params?.dateStart) qp.append('dateStart', params.dateStart);
  if (params?.dateEnd) qp.append('dateEnd', params.dateEnd);
  if (params?.timelineInterval) qp.append('timelineInterval', params.timelineInterval);

  const url = `${OJS_BASE_URL}/index.php/${contextPath}/${API_VERSION}/stats/publications/galley?${qp}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Galley timeline failed: ${res.status}`);
  return res.json();
}

/* ── Editorial stats ────────────────────────────────────────────── */

export async function fetchEditorialStats(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { dateStart?: string; dateEnd?: string },
): Promise<OJSEditorialStat[]> {
  const qp = new URLSearchParams();
  if (params?.dateStart) qp.append('dateStart', params.dateStart);
  if (params?.dateEnd) qp.append('dateEnd', params.dateEnd);

  const url = `${OJS_BASE_URL}/index.php/${contextPath}/${API_VERSION}/stats/editorial?${qp}`;
  if (OJS_CONFIG.features.debugMode) console.log('[OJS] fetchEditorialStats:', url);

  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const txt = await res.text();
    console.error('[OJS] Editorial API Error:', txt.substring(0, 500));
    throw new Error(`Editorial stats failed: ${res.status} ${res.statusText}`);
  }
  
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const txt = await res.text();
    console.error('[OJS] Non-JSON Response:', txt.substring(0, 500));
    throw new Error(`Expected JSON but got ${contentType}`);
  }
  
  return res.json();
}

/* ── Editorial averages ─────────────────────────────────────────── */

export async function fetchEditorialAverages(
  contextPath = OJS_CONFIG.defaultContext,
): Promise<OJSEditorialAverages> {
  const url = `${OJS_BASE_URL}/index.php/${contextPath}/${API_VERSION}/stats/editorial/averages`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Editorial averages failed: ${res.status}`);
  return res.json();
}

/* ── User stats ─────────────────────────────────────────────────── */

export async function fetchUserStats(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { status?: 'active' | 'disabled' },
): Promise<OJSUserStat[]> {
  const qp = new URLSearchParams();
  if (params?.status) qp.append('status', params.status);

  const url = `${OJS_BASE_URL}/index.php/${contextPath}/${API_VERSION}/stats/users?${qp}`;
  if (OJS_CONFIG.features.debugMode) console.log('[OJS] fetchUserStats:', url);
  
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const txt = await res.text();
    console.error('[OJS] User API Error:', txt.substring(0, 500));
    throw new Error(`User stats failed: ${res.status} ${res.statusText}`);
  }
  
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const txt = await res.text();
    console.error('[OJS] Non-JSON Response:', txt.substring(0, 500));
    throw new Error(`Expected JSON but got ${contentType}`);
  }
  
  return res.json();
}

/* ── Contexts (Journals) ────────────────────────────────────────── */

export async function fetchContexts(): Promise<OJSContext[]> {
  // Contexts endpoint is at site level, not journal level
  const url = `${OJS_BASE_URL}/index.php/index/${API_VERSION}/contexts`;
  if (OJS_CONFIG.features.debugMode) console.log('[OJS] fetchContexts:', url);

  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const txt = await res.text();
    console.error('[OJS] Contexts API Error:', txt.substring(0, 500));
    throw new Error(`Contexts failed: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const txt = await res.text();
    console.error('[OJS] Non-JSON Response:', txt.substring(0, 500));
    throw new Error(`Expected JSON but got ${contentType}`);
  }

  const data: OJSContextsResponse = await res.json();
  return data.items || [];
}

/* ── Fast count-only queries (no data fetch) ────────────────────── */

export async function fetchSubmissionsCount(
  contextPath = OJS_CONFIG.defaultContext,
  status?: number,
): Promise<number> {
  const qp = new URLSearchParams({ count: '1' });
  if (status !== undefined) qp.append('status', status.toString());
  
  const url = `${OJS_BASE_URL}/index.php/${contextPath}/${API_VERSION}/submissions?${qp}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Submissions count failed: ${res.status}`);
  const data = await res.json();
  return data.itemsMax || 0;
}

export async function fetchIssuesCount(
  contextPath = OJS_CONFIG.defaultContext,
): Promise<number> {
  const qp = new URLSearchParams({ count: '1', isPublished: 'true' });
  
  const url = `${OJS_BASE_URL}/index.php/${contextPath}/${API_VERSION}/issues?${qp}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Issues count failed: ${res.status}`);
  const data = await res.json();
  return data.itemsMax || 0;
}

/* ── Aggregate dashboard metrics ────────────────────────────────── */

export async function fetchDashboardMetrics(
  contextPath = OJS_CONFIG.defaultContext,
): Promise<DashboardMetrics> {
  try {
    // Use a longer date range for timeline to get more historical data  
    const dateRange = getDateRange(365); // 1 year for better timeline visibility

    // Fetch all available data in parallel
    // Note: Publication stats fetched WITHOUT date filter to get all-time totals
    // Timeline data uses date range for the charts
    const [
      publicationStats,
      editorialStats,
      editorialAverages,
      userStats,
      abstractTimeline,
      galleyTimeline,
    ] = await Promise.all([
      // Only need itemsMax, not actual items - count: 1 is fastest
      fetchPublicationStats(contextPath, { count: 1, orderDirection: 'DESC' }),
      fetchEditorialStats(contextPath).catch(() => [] as OJSEditorialStat[]), // All-time stats
      fetchEditorialAverages(contextPath).catch(() => null),
      fetchUserStats(contextPath).catch(() => [] as OJSUserStat[]), // All-time user counts
      // Timeline data uses date range for charts
      fetchAbstractTimeline(contextPath, { ...dateRange, timelineInterval: 'month' }).catch(() => [] as OJSTimelineItem[]),
      fetchGalleyTimeline(contextPath, { ...dateRange, timelineInterval: 'month' }).catch(() => [] as OJSTimelineItem[]),
    ]);
    
    console.log('[OJS] Publication Stats Response:', {
      itemsCount: publicationStats.items.length,
      itemsMax: publicationStats.itemsMax,
      firstItem: publicationStats.items[0],
    });

    // Calculate publication totals
    const totalDownloads = publicationStats.items.reduce(
      (s, i) => s + (i.pdfViews || 0) + (i.htmlViews || 0) + (i.otherViews || 0), 0,
    );
    const totalAbstractViews = publicationStats.items.reduce(
      (s, i) => s + (i.abstractViews || 0), 0,
    );
    const totalGalleyViews = publicationStats.items.reduce(
      (s, i) => s + (i.galleyViews || 0), 0,
    );
    const totalPdfViews = publicationStats.items.reduce(
      (s, i) => s + (i.pdfViews || 0), 0,
    );
    const totalHtmlViews = publicationStats.items.reduce(
      (s, i) => s + (i.htmlViews || 0), 0,
    );
    const totalOtherViews = publicationStats.items.reduce(
      (s, i) => s + (i.otherViews || 0), 0,
    );
    
    console.log('[OJS] Calculated View Totals:', {
      totalDownloads,
      totalAbstractViews,
      totalGalleyViews,
      totalPdfViews,
    });

    // Extract editorial stats
    console.log('[OJS] Editorial Stats Response:', editorialStats);
    const submissionsReceived = editorialStats.find(s => s.key === 'submissionsReceived')?.value || 0;
    const submissionsAccepted = editorialStats.find(s => s.key === 'submissionsAccepted')?.value || 0;
    const submissionsDeclined = editorialStats.find(s => s.key === 'submissionsDeclined')?.value || 0;
    const submissionsDeclinedDeskReject = editorialStats.find(s => s.key === 'submissionsDeclinedDeskReject')?.value || 0;
    const submissionsDeclinedPostReview = editorialStats.find(s => s.key === 'submissionsDeclinedPostReview')?.value || 0;
    const submissionsPublished = editorialStats.find(s => s.key === 'submissionsPublished')?.value || 0;
    const submissionsSkipped = editorialStats.find(s => s.key === 'submissionsSkipped')?.value || 0;
    const submissionsImported = editorialStats.find(s => s.key === 'submissionsImported')?.value || 0;
    const daysToDecision = editorialStats.find(s => s.key === 'daysToDecision')?.value || 0;
    const daysToAccept = editorialStats.find(s => s.key === 'daysToAccept')?.value || 0;
    const daysToReject = editorialStats.find(s => s.key === 'daysToReject')?.value || 0;
    
    // OJS API provides rates as decimal (0.17 = 17%), convert to percentage
    const acceptanceRateDecimal = editorialStats.find(s => s.key === 'acceptanceRate')?.value || 0;
    const acceptanceRate = Math.round(acceptanceRateDecimal * 100);
    const declineRateDecimal = editorialStats.find(s => s.key === 'declineRate')?.value || 0;
    const declineRate = Math.round(declineRateDecimal * 100);
    const declinedDeskRateDecimal = editorialStats.find(s => s.key === 'declinedDeskRate')?.value || 0;
    const declinedDeskRate = Math.round(declinedDeskRateDecimal * 100);
    const declinedReviewRateDecimal = editorialStats.find(s => s.key === 'declinedReviewRate')?.value || 0;
    const declinedReviewRate = Math.round(declinedReviewRateDecimal * 100);
    
    // Use OJS-provided submissionsInProgress if available, otherwise calculate
    const submissionsInProgressFromAPI = editorialStats.find(s => s.key === 'submissionsInProgress')?.value;
    const submissionsInReview = submissionsInProgressFromAPI !== undefined 
      ? submissionsInProgressFromAPI
      : Math.max(0, submissionsReceived - submissionsAccepted - submissionsDeclined);

    // Extract user stats
    console.log('[OJS] User Stats Response:', userStats);
    const totalReaders = userStats.find(s => s.key === 'reader')?.value || 0;
    const totalAuthors = userStats.find(s => s.key === 'author')?.value || 0;
    const totalReviewers = userStats.find(s => s.key === 'reviewer')?.value || 0;
    const totalEditors = userStats.find(s => s.key === 'editor')?.value || 0;
    const totalManagers = userStats.find(s => s.key === 'manager')?.value || 0;
    const totalUsers = userStats.reduce((sum, stat) => sum + (stat.value || 0), 0);

    // Editorial averages (per year)
    const submissionsPerYear = editorialAverages?.submissionsReceivedPerYear || 0;
    const acceptedPerYear = editorialAverages?.submissionsAcceptedPerYear || 0;
    const declinedPerYear = editorialAverages?.submissionsDeclinedPerYear || 0;

    // Build top publications list
    const topPublications: TopPublication[] = publicationStats.items.slice(0, 10).map(i => ({
      id: i.publication.id,
      title: extractLocalizedString(i.publication.fullTitle, 'Untitled'),
      authors: i.publication.authorsStringShort || 'Unknown',
      abstractViews: i.abstractViews || 0,
      galleyViews: i.galleyViews || 0,
      pdfViews: i.pdfViews || 0,
    }));

    // Build recent activity from publication stats
    const recentActivity: ActivityItem[] = publicationStats.items.slice(0, 8).map((item, idx) => ({
      id: item.publication.id.toString(),
      title: extractLocalizedString(item.publication.fullTitle, 'Untitled'),
      authors: item.publication.authorsStringShort || 'Unknown',
      type: (item.pdfViews || 0) > (item.abstractViews || 0) ? 'download' : 'view',
      abstractViews: item.abstractViews || 0,
      pdfViews: item.pdfViews || 0,
      timestamp: new Date(Date.now() - idx * 120_000),
    }));

    const metrics = {
      // Publication metrics (articles with view statistics)
      totalDownloads,
      totalAbstractViews,
      totalGalleyViews,
      totalPdfViews,
      totalHtmlViews,
      totalOtherViews,
      // totalPublications = total number of articles/publications in the journal
      totalPublications: publicationStats.itemsMax || publicationStats.items.length,
      
      // These are removed from UI but kept for API compatibility
      totalSubmissions: 0,
      totalPublishedSubmissions: 0,
      totalIssues: 0,
      
      // User metrics
      activeReaders: totalReaders,
      totalAuthors,
      totalReviewers,
      totalEditors,
      totalManagers,
      totalUsers,
      
      // Editorial metrics
      submissionsReceived,
      submissionsAccepted,
      submissionsDeclined,
      submissionsDeclinedDeskReject,
      submissionsDeclinedPostReview,
      submissionsPublished,
      submissionsSkipped,
      submissionsImported,
      submissionsInReview,
      daysToDecision,
      daysToAccept,
      daysToReject,
      acceptanceRate,
      declineRate,
      declinedDeskRate,
      declinedReviewRate,
      
      // Yearly averages
      submissionsPerYear,
      acceptedPerYear,
      declinedPerYear,
      
      // Timeline data
      abstractViewsTimeline: abstractTimeline,
      galleyViewsTimeline: galleyTimeline,
      
      // Lists
      recentActivity,
      topPublications,
      editorialStats,
      userStats,
    };
    
    console.log('[OJS] Dashboard Metrics:', {
      context: contextPath,
      totalDownloads,
      totalAbstractViews,
      totalPublications: publicationStats.itemsMax,
      editorialSubmissions: submissionsReceived,
      acceptanceRate,
      topPublications: topPublications.length,
      recentActivity: recentActivity.length,
      timelineData: abstractTimeline.length,
    });
    
    return metrics;
  } catch (error) {
    console.error('[OJS] fetchDashboardMetrics failed:', error);
    throw error;
  }
}

/* ── Aggregated metrics across all journals ─────────────────────── */

export async function fetchAllJournalsMetrics(
  selectedContext: string | null = null,
): Promise<AggregatedDashboardMetrics> {
  // Use manually configured journals from config (contexts API often requires site admin)
  const configuredJournals = (OJS_CONFIG as any).journals || [];
  
  let contexts: OJSContext[] = configuredJournals.map((j: { urlPath: string; name: string }, idx: number) => ({
    id: idx + 1,
    urlPath: j.urlPath,
    name: { en: j.name },
    enabled: true,
    _href: '',
  }));

  // If no journals configured, try fetching from API
  if (contexts.length === 0) {
    try {
      contexts = await fetchContexts();
    } catch (e) {
      console.error('[OJS] Could not fetch contexts and no journals configured:', e);
      // Use default context as last resort
      contexts = [{
        id: 1,
        urlPath: OJS_CONFIG.defaultContext,
        name: { en: OJS_CONFIG.defaultContext },
        enabled: true,
        _href: '',
      }];
    }
  }

  // Filter to enabled contexts only
  const enabledContexts = contexts.filter(c => c.enabled);
  
  if (enabledContexts.length === 0) {
    throw new Error('No enabled journals found');
  }

  console.log('[OJS] fetchAllJournalsMetrics:', {
    selectedContext,
    enabledContexts: enabledContexts.map(c => c.urlPath),
  });

  // If a specific context is selected, only fetch that one
  if (selectedContext && selectedContext !== 'all') {
    const metrics = await fetchDashboardMetrics(selectedContext);
    const perContextMetrics = new Map<string, DashboardMetrics>();
    perContextMetrics.set(selectedContext, metrics);
    
    return {
      ...metrics,
      contexts: enabledContexts,
      perContextMetrics,
      selectedContext,
    };
  }

  // If only one journal, fetch it directly (no aggregation needed)
  if (enabledContexts.length === 1) {
    const ctx = enabledContexts[0];
    const metrics = await fetchDashboardMetrics(ctx.urlPath);
    const perContextMetrics = new Map<string, DashboardMetrics>();
    perContextMetrics.set(ctx.urlPath, metrics);
    
    return {
      ...metrics,
      contexts: enabledContexts,
      perContextMetrics,
      selectedContext: null,
    };
  }

  // Fetch metrics for all journals in parallel
  const metricsPromises = enabledContexts.map(ctx => 
    fetchDashboardMetrics(ctx.urlPath).catch(err => {
      console.warn(`[OJS] Failed to fetch metrics for ${ctx.urlPath}:`, err);
      return null;
    })
  );

  console.log('[OJS] Waiting for metrics from', enabledContexts.length, 'journals...');
  const metricsResults = await Promise.all(metricsPromises);
  console.log('[OJS] Metrics results:', metricsResults.map((m, i) => ({ 
    journal: enabledContexts[i].urlPath, 
    success: !!m 
  })));
  
  // Build per-context metrics map and aggregate
  const perContextMetrics = new Map<string, DashboardMetrics>();
  
  // Publication metrics
  let totalDownloads = 0;
  let totalAbstractViews = 0;
  let totalGalleyViews = 0;
  let totalPdfViews = 0;
  let totalHtmlViews = 0;
  let totalOtherViews = 0;
  let totalPublications = 0;
  
  // Fast counts
  let totalSubmissions = 0;
  let totalPublishedSubmissions = 0;
  let totalIssues = 0;
  
  // User metrics
  let activeReaders = 0;
  let totalAuthors = 0;
  let totalReviewers = 0;
  let totalEditors = 0;
  let totalManagers = 0;
  let totalUsers = 0;
  
  // Editorial metrics
  let submissionsReceived = 0;
  let submissionsAccepted = 0;
  let submissionsDeclined = 0;
  let submissionsDeclinedDeskReject = 0;
  let submissionsDeclinedPostReview = 0;
  let submissionsPublished = 0;
  let submissionsSkipped = 0;
  let submissionsImported = 0;
  let submissionsInReview = 0;
  let totalDaysToDecision = 0;
  let totalDaysToAccept = 0;
  let totalDaysToReject = 0;
  let daysToDecisionCount = 0;
  let daysToAcceptCount = 0;
  let daysToRejectCount = 0;
  let totalAcceptanceRate = 0;
  let totalDeclineRate = 0;
  let totalDeclinedDeskRate = 0;
  let totalDeclinedReviewRate = 0;
  let rateCount = 0;
  
  // Yearly averages
  let submissionsPerYear = 0;
  let acceptedPerYear = 0;
  let declinedPerYear = 0;
  
  // Timeline data
  const abstractViewsTimeline: OJSTimelineItem[] = [];
  const galleyViewsTimeline: OJSTimelineItem[] = [];
  
  // Lists
  const allRecentActivity: ActivityItem[] = [];
  const allTopPublications: TopPublication[] = [];
  const allEditorialStats: OJSEditorialStat[] = [];
  const allUserStats: OJSUserStat[] = [];

  enabledContexts.forEach((ctx, idx) => {
    const metrics = metricsResults[idx];
    if (metrics) {
      perContextMetrics.set(ctx.urlPath, metrics);
      
      // Publication metrics
      totalDownloads += metrics.totalDownloads;
      totalAbstractViews += metrics.totalAbstractViews;
      totalGalleyViews += metrics.totalGalleyViews || 0;
      totalPdfViews += metrics.totalPdfViews || 0;
      totalHtmlViews += metrics.totalHtmlViews || 0;
      totalOtherViews += metrics.totalOtherViews || 0;
      totalPublications += metrics.totalPublications;
      
      // Fast counts
      totalSubmissions += metrics.totalSubmissions || 0;
      totalPublishedSubmissions += metrics.totalPublishedSubmissions || 0;
      totalIssues += metrics.totalIssues || 0;
      
      // User metrics
      activeReaders += metrics.activeReaders;
      totalAuthors += metrics.totalAuthors;
      totalReviewers += metrics.totalReviewers;
      totalEditors += metrics.totalEditors || 0;
      totalManagers += metrics.totalManagers || 0;
      totalUsers += metrics.totalUsers || 0;
      
      // Editorial metrics
      submissionsReceived += metrics.submissionsReceived;
      submissionsAccepted += metrics.submissionsAccepted;
      submissionsDeclined += metrics.submissionsDeclined;
      submissionsDeclinedDeskReject += metrics.submissionsDeclinedDeskReject || 0;
      submissionsDeclinedPostReview += metrics.submissionsDeclinedPostReview || 0;
      submissionsPublished += metrics.submissionsPublished || 0;
      submissionsSkipped += metrics.submissionsSkipped || 0;
      submissionsImported += metrics.submissionsImported || 0;
      submissionsInReview += metrics.submissionsInReview || 0;
      
      if (metrics.daysToDecision > 0) {
        totalDaysToDecision += metrics.daysToDecision;
        daysToDecisionCount++;
      }
      if (metrics.daysToAccept && metrics.daysToAccept > 0) {
        totalDaysToAccept += metrics.daysToAccept;
        daysToAcceptCount++;
      }
      if (metrics.daysToReject && metrics.daysToReject > 0) {
        totalDaysToReject += metrics.daysToReject;
        daysToRejectCount++;
      }
      
      // Aggregate rates (they're already percentages)
      if (metrics.acceptanceRate > 0 || metrics.declineRate > 0) {
        totalAcceptanceRate += metrics.acceptanceRate || 0;
        totalDeclineRate += metrics.declineRate || 0;
        totalDeclinedDeskRate += metrics.declinedDeskRate || 0;
        totalDeclinedReviewRate += metrics.declinedReviewRate || 0;
        rateCount++;
      }
      
      // Yearly averages
      submissionsPerYear += metrics.submissionsPerYear || 0;
      acceptedPerYear += metrics.acceptedPerYear || 0;
      declinedPerYear += metrics.declinedPerYear || 0;
      
      // Aggregate timeline data
      if (metrics.abstractViewsTimeline) {
        metrics.abstractViewsTimeline.forEach(item => {
          const existing = abstractViewsTimeline.find(t => t.date === item.date);
          if (existing) {
            existing.value += item.value;
          } else {
            abstractViewsTimeline.push({ ...item });
          }
        });
      }
      if (metrics.galleyViewsTimeline) {
        metrics.galleyViewsTimeline.forEach(item => {
          const existing = galleyViewsTimeline.find(t => t.date === item.date);
          if (existing) {
            existing.value += item.value;
          } else {
            galleyViewsTimeline.push({ ...item });
          }
        });
      }
      
      // Add context info to activity items
      metrics.recentActivity.forEach(item => {
        allRecentActivity.push({
          ...item,
          id: `${ctx.urlPath}-${item.id}`,
        });
      });
      
      // Add context info to top publications
      metrics.topPublications.forEach(pub => {
        allTopPublications.push({
          ...pub,
          id: pub.id + ctx.id * 10000, // Ensure unique IDs
        });
      });
    }
  });

  // Sort timeline data by date
  abstractViewsTimeline.sort((a, b) => a.date.localeCompare(b.date));
  galleyViewsTimeline.sort((a, b) => a.date.localeCompare(b.date));

  // Sort and limit recent activity
  allRecentActivity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const recentActivity = allRecentActivity.slice(0, 10);

  // Sort and limit top publications by views
  allTopPublications.sort((a, b) => (b.abstractViews + b.pdfViews) - (a.abstractViews + a.pdfViews));
  const topPublications = allTopPublications.slice(0, 10);

  // Calculate averaged metrics
  const daysToDecision = daysToDecisionCount > 0 
    ? Math.round(totalDaysToDecision / daysToDecisionCount) 
    : 0;
  const daysToAccept = daysToAcceptCount > 0
    ? Math.round(totalDaysToAccept / daysToAcceptCount)
    : 0;
  const daysToReject = daysToRejectCount > 0
    ? Math.round(totalDaysToReject / daysToRejectCount)
    : 0;
  
  // Calculate averaged rates
  const acceptanceRate = rateCount > 0
    ? Math.round(totalAcceptanceRate / rateCount)
    : 0;
  const declineRate = rateCount > 0
    ? Math.round(totalDeclineRate / rateCount)
    : 0;
  const declinedDeskRate = rateCount > 0
    ? Math.round(totalDeclinedDeskRate / rateCount)
    : 0;
  const declinedReviewRate = rateCount > 0
    ? Math.round(totalDeclinedReviewRate / rateCount)
    : 0;

  const aggregated = {
    // Publication metrics
    totalDownloads,
    totalAbstractViews,
    totalGalleyViews,
    totalPdfViews,
    totalHtmlViews,
    totalOtherViews,
    totalPublications,
    
    // Fast counts
    totalSubmissions,
    totalPublishedSubmissions,
    totalIssues,
    
    // User metrics
    activeReaders,
    totalAuthors,
    totalReviewers,
    totalEditors,
    totalManagers,
    totalUsers,
    
    // Editorial metrics
    submissionsReceived,
    submissionsAccepted,
    submissionsDeclined,
    submissionsDeclinedDeskReject,
    submissionsDeclinedPostReview,
    submissionsPublished,
    submissionsSkipped,
    submissionsImported,
    submissionsInReview,
    daysToDecision,
    daysToAccept,
    daysToReject,
    acceptanceRate,
    declineRate,
    declinedDeskRate,
    declinedReviewRate,
    
    // Yearly averages
    submissionsPerYear,
    acceptedPerYear,
    declinedPerYear,
    
    // Timeline data
    abstractViewsTimeline,
    galleyViewsTimeline,
    
    // Lists
    recentActivity,
    topPublications,
    editorialStats: allEditorialStats,
    userStats: allUserStats,
    
    // Multi-journal data
    contexts: enabledContexts,
    perContextMetrics,
    selectedContext: null,
  };
  
  console.log('[OJS] Aggregated metrics complete:', {
    totalPublications,
    totalDownloads,
    totalAbstractViews,
    journalsProcessed: enabledContexts.length
  });
  
  return aggregated;
}

/* ── Connection test ────────────────────────────────────────────── */

export async function testOJSConnection(contextPath = OJS_CONFIG.defaultContext): Promise<{
  connected: boolean;
  message: string;
  endpoints: Record<string, boolean>;
}> {
  const endpoints: Record<string, boolean> = {
    publications: false,
    editorial: false,
    users: false,
  };

  try {
    if (!OJS_CONFIG.auth.apiKey) {
      return {
        connected: false,
        message: 'API key not configured. Add your OJS API key to src/config/ojs.ts or set VITE_OJS_API_KEY.',
        endpoints,
      };
    }

    const checks = await Promise.allSettled([
      fetchPublicationStats(contextPath, { count: 1 }),
      fetchEditorialStats(contextPath),
      fetchUserStats(contextPath),
    ]);

    if (checks[0].status === 'fulfilled') endpoints.publications = true;
    if (checks[1].status === 'fulfilled') endpoints.editorial = true;
    if (checks[2].status === 'fulfilled') endpoints.users = true;

    const total = Object.values(endpoints).filter(Boolean).length;
    if (total === 0) {
      return { connected: false, message: 'Could not reach any OJS API endpoint. Verify base URL and API key.', endpoints };
    }
    return { connected: true, message: `Connected (${total}/3 endpoints available)`, endpoints };
  } catch (error) {
    return {
      connected: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      endpoints,
    };
  }
}
