/**
 * Matomo Debug Panel
 * Shows connection status and raw data for debugging
 */
import { useEffect, useState } from 'react';
import { testMatomoConnection, MATOMO_CONFIG } from '@/services/matomoApi';
import { useMatomoRealtime } from '@/hooks/useMatomoData';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const MatomoDebug = () => {
  const [connectionTest, setConnectionTest] = useState<{ connected: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const { data, isLoading, error } = useMatomoRealtime();

  const runTest = async () => {
    setTesting(true);
    const result = await testMatomoConnection();
    setConnectionTest(result);
    setTesting(false);
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold">Matomo Debug Info</h3>
        <button
          onClick={runTest}
          disabled={testing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          Test
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Connection Status */}
        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
          {connectionTest ? (
            connectionTest.connected ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )
          ) : (
            <RefreshCw className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 animate-spin" />
          )}
          <div className="flex-1">
            <p className="font-medium">Connection Status</p>
            <p className="text-xs text-muted-foreground mt-1">
              {connectionTest?.message || 'Testing...'}
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="font-medium mb-2">Configuration</p>
          <div className="space-y-1 text-xs font-mono">
            <div><span className="text-muted-foreground">Base URL:</span> {MATOMO_CONFIG.baseUrl}</div>
            <div><span className="text-muted-foreground">Site ID:</span> {MATOMO_CONFIG.siteId}</div>
            <div><span className="text-muted-foreground">Auth Token:</span> {MATOMO_CONFIG.authToken.substring(0, 10)}...</div>
            <div><span className="text-muted-foreground">Mode:</span> {import.meta.env.DEV ? 'Development (via proxy)' : 'Production'}</div>
          </div>
        </div>

        {/* Query Status */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="font-medium mb-2">Real-time Query Status</p>
          <div className="space-y-1 text-xs">
            <div><span className="text-muted-foreground">Loading:</span> {isLoading ? 'Yes' : 'No'}</div>
            <div><span className="text-muted-foreground">Has Error:</span> {error ? 'Yes' : 'No'}</div>
            {error && (
              <div className="text-red-600 mt-2">
                <span className="font-medium">Error:</span> {error.message}
              </div>
            )}
            <div><span className="text-muted-foreground">Has Data:</span> {data ? 'Yes' : 'No'}</div>
          </div>
        </div>

        {/* Data Summary */}
        {data && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="font-medium mb-2">Data Summary</p>
            <div className="space-y-1 text-xs">
              <div><span className="text-muted-foreground">Active Visitors:</span> {data.counters?.visitors ?? 'undefined'}</div>
              <div><span className="text-muted-foreground">Visits (30m):</span> {data.counters?.visits ?? 'undefined'}</div>
              <div><span className="text-muted-foreground">Actions:</span> {data.counters?.actions ?? 'undefined'}</div>
              <div><span className="text-muted-foreground">Recent Visitors:</span> {data.visitors?.length ?? 'undefined'}</div>
              <div><span className="text-muted-foreground">Countries:</span> {data.visitorsByCountry?.length ?? 'undefined'}</div>
            </div>
            <div className="mt-2 p-2 bg-slate-100 rounded text-xs font-mono overflow-auto max-h-32">
              <p className="font-medium text-muted-foreground mb-1">Raw counters:</p>
              {JSON.stringify(data.counters, null, 2)}
            </div>
          </div>
        )}

        {/* Manual Test URL */}
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="font-medium mb-2">Manual Test</p>
          <p className="text-xs text-muted-foreground mb-2">
            Open this URL in a new tab to test the API directly:
          </p>
          <a
            href={`${MATOMO_CONFIG.baseUrl}/index.php?module=API&method=Live.getCounters&idSite=${MATOMO_CONFIG.siteId}&format=JSON&token_auth=${MATOMO_CONFIG.authToken}&lastMinutes=30`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline break-all"
          >
            {MATOMO_CONFIG.baseUrl}/index.php?module=API&method=Live.getCounters...
          </a>
        </div>
      </div>
    </div>
  );
};

export default MatomoDebug;
