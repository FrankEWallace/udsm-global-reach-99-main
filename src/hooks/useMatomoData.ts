/**
 * React Query hooks for Matomo Analytics
 */
import { useQuery } from '@tanstack/react-query';
import {
  fetchMatomoRealtimeData,
  testMatomoConnection,
  getLiveCounters,
  getLastVisitorsDetails,
  getVisitorsByCountry,
  getVisitsSummary,
  getTopPages,
  getVisitsOverTime,
  type MatomoRealtimeData,
  type MatomoLiveCounters,
  type MatomoVisitor,
  type MatomoCountry,
  type MatomoVisitsSummary,
  type MatomoPageView,
} from '@/services/matomoApi';

/**
 * Hook for real-time dashboard data
 * Refreshes every 3 seconds for live updates
 */
export function useMatomoRealtime() {
  return useQuery<MatomoRealtimeData>({
    queryKey: ['matomo', 'realtime'],
    queryFn: fetchMatomoRealtimeData,
    refetchInterval: 3_000, // Refresh every 3 seconds
    staleTime: 1_000,
    retry: 2,
  });
}

/**
 * Hook for live visitor counters
 * Refreshes every 2 seconds
 */
export function useMatomoLiveCounters(lastMinutes: number = 30) {
  return useQuery<MatomoLiveCounters[]>({
    queryKey: ['matomo', 'liveCounters', lastMinutes],
    queryFn: () => getLiveCounters(lastMinutes),
    refetchInterval: 2_000, // Refresh every 2 seconds
    staleTime: 1_000,
    retry: 2,
  });
}

/**
 * Hook for last visitors details
 * Refreshes every 5 seconds
 */
export function useMatomoVisitors(count: number = 10) {
  return useQuery<MatomoVisitor[]>({
    queryKey: ['matomo', 'visitors', count],
    queryFn: () => getLastVisitorsDetails(count),
    refetchInterval: 5_000,
    staleTime: 2_000,
    retry: 2,
  });
}

/**
 * Hook for visitors by country
 */
export function useMatomoCountries(period: string = 'day', date: string = 'today') {
  return useQuery<MatomoCountry[]>({
    queryKey: ['matomo', 'countries', period, date],
    queryFn: () => getVisitorsByCountry(period, date),
    refetchInterval: 30_000, // Refresh every 30 seconds
    staleTime: 15_000,
    retry: 2,
  });
}

/**
 * Hook for visits summary
 */
export function useMatomoSummary(period: string = 'day', date: string = 'today') {
  return useQuery<MatomoVisitsSummary>({
    queryKey: ['matomo', 'summary', period, date],
    queryFn: () => getVisitsSummary(period, date),
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 2,
  });
}

/**
 * Hook for top pages
 */
export function useMatomoTopPages(period: string = 'day', date: string = 'today', limit: number = 10) {
  return useQuery<MatomoPageView[]>({
    queryKey: ['matomo', 'topPages', period, date, limit],
    queryFn: () => getTopPages(period, date, limit),
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 2,
  });
}

/**
 * Hook for visits over time (for charts)
 */
export function useMatomoVisitsOverTime(period: string = 'day', date: string = 'last30') {
  return useQuery<Record<string, number>>({
    queryKey: ['matomo', 'visitsOverTime', period, date],
    queryFn: () => getVisitsOverTime(period, date),
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 2,
  });
}

/**
 * Hook for testing Matomo connection
 */
export function useMatomoConnection() {
  return useQuery({
    queryKey: ['matomo', 'connection'],
    queryFn: testMatomoConnection,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  });
}
