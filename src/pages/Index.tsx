import { useState } from "react";
import {
  Download, Eye, Users, BookOpen, Globe, AlertCircle,
  FileText, GraduationCap, Clock, BarChart3, TrendingUp,
  CheckCircle, XCircle, UserCheck, Edit, ShieldCheck, FileCheck,
  Layers, Building2, Quote, Calendar, Archive, Send
} from "lucide-react";
import Header from "@/components/Header";
import WorldMap from "@/components/WorldMap";
import MetricCard from "@/components/MetricCard";
import LiveActivity from "@/components/LiveActivity";
import TopCountries from "@/components/TopCountries";
import RealtimeVisitors from "@/components/RealtimeVisitors";
import MatomoDebug from "@/components/MatomoDebug";
import JournalStats from "@/components/JournalStats";
import ViewsTimeline from "@/components/ViewsTimeline";
import { JournalSelector } from "@/components/JournalSelector";
import { useFastStatsDashboard, useFastStatsConnection } from "@/hooks/useOJSData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import OJS_CONFIG from "@/config/ojs";

const Index = () => {
  const [selectedJournalId, setSelectedJournalId] = useState<number | null>(null);
  const { data: metrics, isLoading, error } = useFastStatsDashboard(selectedJournalId);
  const { data: connectionStatus } = useFastStatsConnection();

  // Debug logging
  console.log('[Dashboard] Fast Stats:', {
    selectedJournalId,
    isLoading,
    hasError: !!error,
    hasMetrics: !!metrics,
  });

  if (error) {
    console.error('[Dashboard] Error loading metrics:', error);
  }

  // Convert journals to contexts format for JournalSelector
  // Use API data if available, fallback to configured journals
  const apiJournals = (Array.isArray(metrics?.journals) ? metrics.journals : []).map(j => ({
    id: j.id,
    urlPath: j.path,
    name: { en_US: j.name },
    enabled: j.enabled,
    _href: '',
  }));
  
  // Fallback to configured journals if API doesn't return any
  const configuredJournals = OJS_CONFIG.journals.map((j, idx) => ({
    id: idx + 1,
    urlPath: j.urlPath,
    name: { en_US: j.name },
    enabled: true,
    _href: '',
  }));
  
  const contexts = apiJournals.length > 0 ? apiJournals : configuredJournals;

  // Convert timeline for ViewsTimeline component
  const abstractViewsTimeline = metrics?.viewsTimeline?.map(t => ({
    date: t.date,
    value: t.abstractViews,
  })) || [];
  
  const galleyViewsTimeline = metrics?.viewsTimeline?.map(t => ({
    date: t.date,
    value: t.fileDownloads,
  })) || [];

  // Convert top publications for TopCountries component (TopPublication interface)
  const topPublicationsFormatted = (Array.isArray(metrics?.topPublications) ? metrics.topPublications : []).map(p => ({
    id: p.publicationId,
    title: p.title,
    authors: '', // Fast Stats doesn't include authors
    abstractViews: p.abstractViews || 0,
    galleyViews: p.fileDownloads || 0,
    pdfViews: p.fileDownloads || 0,
  }));

  // Find user counts by role
  const findRoleCount = (roleName: string) => 
    metrics?.usersByRole?.find(r => r.roleName.toLowerCase().includes(roleName.toLowerCase()))?.count || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-8 md:py-12">
        <div className="container mx-auto px-4 relative z-10">

          {/* Title */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(210,100%,20%,0.06)] border border-[hsl(210,100%,20%,0.12)] mb-4">
              <GraduationCap className="w-4 h-4 text-[hsl(210,100%,20%)]" />
              <span className="text-sm font-medium text-[hsl(210,100%,20%)]">
                OJS Analytics Dashboard
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              UDSM Research <span className="text-gradient-gold">Global Impact</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Real-time analytics powered by the Fast Stats API plugin.
            </p>
          </div>

          {/* Journal Selector - Always visible */}
          <div className="flex justify-center mb-6">
            <JournalSelector
              contexts={contexts}
              selectedJournalId={selectedJournalId}
              onJournalChange={setSelectedJournalId}
              isLoading={isLoading}
            />
          </div>

          {/* Selected Journal Info */}
          {selectedJournalId && metrics && (
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing statistics for: <span className="font-semibold text-[hsl(210,100%,20%)]">
                  {contexts.find(c => c.id === selectedJournalId)?.name?.en_US || `Journal ${selectedJournalId}`}
                </span>
              </p>
            </div>
          )}
          {!selectedJournalId && contexts.length > 1 && (
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing aggregated statistics from <span className="font-semibold text-[hsl(210,100%,20%)]">{contexts.length} journals</span>
              </p>
            </div>
          )}

          {/* Connection Status Alert */}
          {connectionStatus && !connectionStatus.connected && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Fast Stats API Not Connected</AlertTitle>
              <AlertDescription className="text-amber-700">
                {connectionStatus.message}
                <div className="mt-2 text-xs text-amber-600">
                  <p className="font-medium">Ensure the Fast Stats plugin is installed and enabled in OJS.</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Key Metrics */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              <MetricCard
                title="Total Downloads"
                value={metrics?.totalDownloads || 0}
                icon={<Download className="w-5 h-5" />}
                trend={{ value: 12.5, positive: true }}
                delay={0}
                accentColor="hsl(210, 100%, 20%)"
              />
              <MetricCard
                title="Abstract Views"
                value={metrics?.totalAbstractViews || 0}
                icon={<Eye className="w-5 h-5" />}
                trend={{ value: 18.3, positive: true }}
                delay={100}
                accentColor="hsl(42, 100%, 50%)"
              />
              <MetricCard
                title="Total Views"
                value={metrics?.totalViews || 0}
                icon={<TrendingUp className="w-5 h-5" />}
                trend={{ value: 15.2, positive: true }}
                delay={200}
                accentColor="hsl(142, 76%, 36%)"
              />
              <MetricCard
                title="Total Users"
                value={metrics?.totalUsers || 0}
                icon={<Users className="w-5 h-5" />}
                trend={{ value: 24.1, positive: true }}
                delay={300}
                accentColor="hsl(42, 100%, 50%)"
              />
            </div>
          )}

          {/* Submissions & Publications Overview */}
          {!isLoading && metrics && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Submissions & Publications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="glass-card p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Send className="w-4 h-4 text-[hsl(210,100%,20%)]" />
                  </div>
                  <p className="text-2xl font-bold text-[hsl(210,100%,20%)]">{metrics.totalSubmissions || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Total Submissions</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BookOpen className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{metrics.totalPublications || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Published</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{metrics.activeSubmissions || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Active</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-purple-500">{metrics.submissionsScheduled || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Scheduled</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Archive className="w-4 h-4 text-slate-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-600">{metrics.totalIssues || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Total Issues</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{metrics.publishedIssues || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Published Issues</p>
                </div>
              </div>
            </div>
          )}

          {/* Editorial Metrics - All-Time */}
          {!isLoading && metrics && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Editorial Activity (All-Time)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-[hsl(210,100%,20%)]">{metrics.submissionsReceived || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Received</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{metrics.submissionsAccepted || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Accepted</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalPublications || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Published</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-red-500">{metrics.submissionsDeclined || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Declined</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-amber-500">{metrics.submissionsQueued || 0}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">In Queue</p>
                </div>
              </div>
            </div>
          )}

          {/* User Role Breakdown */}
          {!isLoading && metrics && metrics.usersByRole?.length > 0 && (
            <div className="glass-card p-4 mb-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Users by Role</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {metrics.usersByRole.slice(0, 8).map((role) => (
                  <div key={role.roleId} className="text-center">
                    <p className="text-xl font-bold text-[hsl(210,70%,45%)]">{role.count}</p>
                    <p className="text-xs text-muted-foreground mt-1">{role.roleName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Third Metrics Row - Rates */}
          {!isLoading && metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 md:mb-10">
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Edit className="w-4 h-4 text-[hsl(42,100%,45%)]" />
                </div>
                <p className="text-2xl font-bold text-[hsl(42,100%,45%)]">{findRoleCount('author')}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Authors</p>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <UserCheck className="w-4 h-4 text-[hsl(210,70%,45%)]" />
                </div>
                <p className="text-2xl font-bold text-[hsl(210,70%,45%)]">{findRoleCount('reviewer')}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Reviewers</p>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-500">{metrics.acceptanceRate || 0}%</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Acceptance Rate</p>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-red-500">{metrics.rejectionRate || 0}%</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Rejection Rate</p>
              </div>
            </div>
          )}

          {/* Citations Section - Unified (Crossref + OpenAlex) */}
          {!isLoading && metrics && (
            <div className="glass-card p-6 mb-8 md:mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Quote className="w-5 h-5 text-[hsl(210,100%,20%)]" />
                <h3 className="font-display text-lg font-semibold text-foreground">Citation Metrics</h3>
                {metrics.allCitations && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-2">
                    Crossref + OpenAlex
                  </span>
                )}
              </div>
              
              {metrics.allCitations?.summary ? (
                <>
                  {/* Citation Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">{metrics.allCitations.summary.totalCitations || 0}</p>
                      <p className="text-sm text-purple-700 mt-1">Total Citations</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <p className="text-3xl font-bold text-indigo-600">{metrics.allCitations.summary.publicationsWithCitations || 0}</p>
                      <p className="text-sm text-indigo-700 mt-1">Cited Publications</p>
                    </div>
                    <div className="text-center p-4 bg-violet-50 rounded-lg">
                      <p className="text-3xl font-bold text-violet-600">{metrics.allCitations.summary.totalPublications || 0}</p>
                      <p className="text-sm text-violet-700 mt-1">Total Indexed</p>
                    </div>
                    <div className="text-center p-4 bg-fuchsia-50 rounded-lg">
                      <p className="text-3xl font-bold text-fuchsia-600">{metrics.allCitations.summary.maxCitations || 0}</p>
                      <p className="text-sm text-fuchsia-700 mt-1">Max Citations</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <p className="text-3xl font-bold text-pink-600">{(metrics.allCitations.summary.avgCitations || 0).toFixed(2)}</p>
                      <p className="text-sm text-pink-700 mt-1">Avg Citations</p>
                    </div>
                  </div>
                  
                  {/* Citation Sources Breakdown */}
                  {(metrics.allCitations.summary.fromCrossref !== undefined || metrics.allCitations.summary.fromOpenalex !== undefined) && (
                    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Source Breakdown:</span>
                      </div>
                      {metrics.allCitations.summary.fromCrossref !== undefined && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-sm font-medium text-blue-700">
                            Crossref: {metrics.allCitations.summary.fromCrossref}
                          </span>
                        </div>
                      )}
                      {metrics.allCitations.summary.fromOpenalex !== undefined && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-sm font-medium text-green-700">
                            OpenAlex: {metrics.allCitations.summary.fromOpenalex}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Top Cited Publications */}
                  {metrics.topCitedPublications && metrics.topCitedPublications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3">Top Cited Publications</h4>
                      <div className="space-y-3">
                        {metrics.topCitedPublications.slice(0, 5).map((pub, index) => (
                          <div key={pub.publicationId} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground line-clamp-2">{pub.title}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                {pub.doi && (
                                  <a 
                                    href={`https://doi.org/${pub.doi}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {pub.doi}
                                  </a>
                                )}
                                {pub.datePublished && <span>{pub.datePublished}</span>}
                                {pub.citationSource && (
                                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                                    pub.citationSource === 'crossref' 
                                      ? 'bg-blue-100 text-blue-600' 
                                      : pub.citationSource === 'openalex'
                                      ? 'bg-green-100 text-green-600'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {pub.citationSource}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-xl font-bold text-purple-600">{pub.citationCount}</p>
                              <p className="text-xs text-muted-foreground">citations</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : metrics.citations?.available ? (
                // Fallback to legacy citations
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">{metrics.citations.totalCitations || 0}</p>
                    <p className="text-sm text-purple-700 mt-1">Total Citations</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <p className="text-3xl font-bold text-indigo-600">{metrics.citations.publicationsWithCitations || 0}</p>
                    <p className="text-sm text-indigo-700 mt-1">Cited Publications</p>
                  </div>
                  <div className="text-center p-4 bg-violet-50 rounded-lg">
                    <p className="text-3xl font-bold text-violet-600">
                      {metrics.totalPublications && metrics.citations.publicationsWithCitations 
                        ? ((metrics.citations.publicationsWithCitations / metrics.totalPublications) * 100).toFixed(1)
                        : 0}%
                    </p>
                    <p className="text-sm text-violet-700 mt-1">Citation Rate</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Quote className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Citation data not available</p>
                  <p className="text-xs mt-1">
                    {metrics.citations?.message || 'Crossref citation tracking requires DOIs on publications'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Views Timeline Chart */}
          {!isLoading && metrics && metrics.viewsTimeline?.length > 0 && (
            <div className="mb-8 md:mb-10">
              <ViewsTimeline
                abstractViews={abstractViewsTimeline}
                galleyViews={galleyViewsTimeline}
              />
            </div>
          )}

          {/* Publications by Year */}
          {!isLoading && metrics && metrics.publicationsByYear?.length > 0 && (
            <div className="glass-card p-6 mb-8 md:mb-10">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-[hsl(210,100%,20%)]" />
                <h3 className="font-display text-lg font-semibold text-foreground">Publications by Year</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {metrics.publicationsByYear.slice(0, 6).map((item) => (
                  <div key={item.year} className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{item.count}</p>
                    <p className="text-sm text-blue-700 mt-1">{item.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publications by Section */}
          {!isLoading && metrics && metrics.publicationsBySection?.length > 0 && (
            <div className="glass-card p-6 mb-8 md:mb-10">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[hsl(210,100%,20%)]" />
                <h3 className="font-display text-lg font-semibold text-foreground">Publications by Section</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {metrics.publicationsBySection.map((item) => (
                  <div key={item.sectionId} className="text-center p-3 bg-amber-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">{item.count}</p>
                    <p className="text-sm text-amber-700 mt-1 truncate" title={item.sectionName}>{item.sectionName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 md:mb-10">
            {/* World Map */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[hsl(210,100%,20%)]" />
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                    Global Readership Map
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Live updates</span>
                </div>
              </div>
              <WorldMap />
            </div>
            
            {/* Real-time Visitors from Matomo */}
            <div className="lg:col-span-1">
              <RealtimeVisitors />
            </div>
          </div>

          {/* Matomo Debug Panel */}
          {import.meta.env.DEV && (
            <div className="mb-8">
              <MatomoDebug />
            </div>
          )}

          {/* Two Column Layout — Recent Publications + Top Publications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 md:mb-10">
            {isLoading ? (
              <>
                <Skeleton className="h-96 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-xl" />
              </>
            ) : (
              <>
                {/* Recent Publications */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-[hsl(210,100%,20%)]" />
                    <h3 className="font-display text-lg font-semibold text-foreground">Recent Publications</h3>
                  </div>
                  <div className="space-y-3">
                    {metrics?.recentPublications?.slice(0, 5).map((pub) => (
                      <div key={pub.publicationId} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{pub.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{pub.sectionName}</span>
                          {pub.datePublished && (
                            <span className="text-xs text-muted-foreground">• {pub.datePublished}</span>
                          )}
                        </div>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No recent publications</p>}
                  </div>
                </div>
                
                {/* Top Publications */}
                <TopCountries publications={topPublicationsFormatted} />
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-[hsl(210,100%,20%)]" />
              <span className="font-display font-semibold text-foreground">
                UDSM Journals Dashboard
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              University of Dar es Salaam &bull; Empowering Research, Inspiring Change
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by Fast Stats API &bull; &copy; 2026 University of Dar es Salaam. All rights reserved.
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Index;
