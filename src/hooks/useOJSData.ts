/**
 * React Query hooks for OJS Analytics API data
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardMetrics,
  fetchAllJournalsMetrics,
  fetchContexts,
  fetchPublicationStats,
  fetchEditorialStats,
  fetchUserStats,
  fetchAbstractTimeline,
  fetchGalleyTimeline,
  testOJSConnection,
  DashboardMetrics,
  AggregatedDashboardMetrics,
  OJSContext,
  OJSPublicationsResponse,
  OJSEditorialStat,
  OJSUserStat,
  OJSTimelineItem,
} from '@/services/ojsApi';
import OJS_CONFIG from '@/config/ojs';

export function useContexts() {
  return useQuery<OJSContext[]>({
    queryKey: ['contexts'],
    queryFn: () => fetchContexts(),
    staleTime: OJS_CONFIG.staleTimes.contexts,
    retry: OJS_CONFIG.request.retries,
  });
}

export function useAllJournalsMetrics(selectedContext: string | null = null) {
  return useQuery<AggregatedDashboardMetrics>({
    queryKey: ['all-journals-metrics', selectedContext],
    queryFn: () => fetchAllJournalsMetrics(selectedContext),
    staleTime: OJS_CONFIG.staleTimes.dashboardMetrics,
    refetchInterval: OJS_CONFIG.features.autoRefresh
      ? OJS_CONFIG.refreshIntervals.dashboardMetrics
      : false,
    retry: 0, // Don't retry - fail fast if OJS is unavailable
    retryDelay: 1000,
  });
}

export function useDashboardMetrics(contextPath = OJS_CONFIG.defaultContext) {
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics', contextPath],
    queryFn: () => fetchDashboardMetrics(contextPath),
    staleTime: OJS_CONFIG.staleTimes.dashboardMetrics,
    refetchInterval: OJS_CONFIG.features.autoRefresh
      ? OJS_CONFIG.refreshIntervals.dashboardMetrics
      : false,
    retry: OJS_CONFIG.request.retries,
  });
}

export function usePublicationStats(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { dateStart?: string; dateEnd?: string; count?: number; offset?: number },
) {
  return useQuery<OJSPublicationsResponse>({
    queryKey: ['publication-stats', contextPath, params],
    queryFn: () => fetchPublicationStats(contextPath, params),
    staleTime: OJS_CONFIG.staleTimes.statistics,
    retry: OJS_CONFIG.request.retries,
  });
}

export function useEditorialStats(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { dateStart?: string; dateEnd?: string },
) {
  return useQuery<OJSEditorialStat[]>({
    queryKey: ['editorial-stats', contextPath, params],
    queryFn: () => fetchEditorialStats(contextPath, params),
    staleTime: OJS_CONFIG.staleTimes.statistics,
    retry: OJS_CONFIG.request.retries,
  });
}

export function useUserStats(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { status?: 'active' | 'disabled' },
) {
  return useQuery<OJSUserStat[]>({
    queryKey: ['user-stats', contextPath, params],
    queryFn: () => fetchUserStats(contextPath, params),
    staleTime: OJS_CONFIG.staleTimes.statistics,
    retry: OJS_CONFIG.request.retries,
  });
}

export function useAbstractTimeline(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { dateStart?: string; dateEnd?: string; timelineInterval?: 'day' | 'month' },
) {
  return useQuery<OJSTimelineItem[]>({
    queryKey: ['abstract-timeline', contextPath, params],
    queryFn: () => fetchAbstractTimeline(contextPath, params),
    staleTime: OJS_CONFIG.staleTimes.statistics,
    retry: OJS_CONFIG.request.retries,
  });
}

export function useGalleyTimeline(
  contextPath = OJS_CONFIG.defaultContext,
  params?: { dateStart?: string; dateEnd?: string; timelineInterval?: 'day' | 'month' },
) {
  return useQuery<OJSTimelineItem[]>({
    queryKey: ['galley-timeline', contextPath, params],
    queryFn: () => fetchGalleyTimeline(contextPath, params),
    staleTime: OJS_CONFIG.staleTimes.statistics,
    retry: OJS_CONFIG.request.retries,
  });
}

export function useOJSConnection(contextPath = OJS_CONFIG.defaultContext) {
  return useQuery({
    queryKey: ['ojs-connection', contextPath],
    queryFn: () => testOJSConnection(contextPath),
    staleTime: OJS_CONFIG.staleTimes.connection,
    retry: 1,
  });
}

/* ══════════════════════════════════════════════════════════════════
   Fast Stats API Hooks (Optimized)
   ══════════════════════════════════════════════════════════════════ */

import {
  fetchUnifiedDashboardMetrics,
  testFastStatsConnection,
  UnifiedDashboardMetrics,
} from '@/services/fastStatsApi';

/**
 * Use the Fast Stats API for dashboard data
 * This is the recommended hook - returns all data in ONE API call
 * 
 * @param selectedJournalId - Journal ID to filter by (null = default journal from config)
 */
export function useFastStatsDashboard(selectedJournalId: number | null = null) {
  return useQuery<UnifiedDashboardMetrics>({
    queryKey: ['fast-stats-dashboard', selectedJournalId],
    queryFn: () => fetchUnifiedDashboardMetrics(selectedJournalId),
    staleTime: OJS_CONFIG.staleTimes.dashboardMetrics,
    refetchInterval: OJS_CONFIG.features.autoRefresh
      ? OJS_CONFIG.refreshIntervals.dashboardMetrics
      : false,
    retry: 0, // Fail fast
  });
}

/**
 * Test Fast Stats API connection
 */
export function useFastStatsConnection(journalPath = OJS_CONFIG.defaultContext) {
  return useQuery({
    queryKey: ['fast-stats-connection', journalPath],
    queryFn: () => testFastStatsConnection(journalPath),
    staleTime: OJS_CONFIG.staleTimes.connection,
    retry: 1,
  });
}
