# OJS Management & Analytics Dashboard - Complete Data Guide

Comprehensive guide to all important data available through OJS APIs for administrators, managers, editorial teams, and stakeholders.

---

## 📊 Table of Contents

1. [Downloads & Views Analytics](#1-downloads--views-analytics)
2. [Publication Metrics](#2-publication-metrics)
3. [Submissions & Workflow Data](#3-submissions--workflow-data)
4. [Editorial Performance](#4-editorial-performance)
5. [Issues & Publishing](#5-issues--publishing)
6. [User & Community Analytics](#6-user--community-analytics)
7. [Financial & Revenue Data](#7-financial--revenue-data)
8. [Complete Dashboard Examples](#8-complete-dashboard-examples)

---

## 1. DOWNLOADS & VIEWS ANALYTICS

### 1.1 Total Downloads by Publication

**Endpoint:** `GET /api/v1/stats/publications`

**Use Case:** See which articles are most downloaded

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/stats/publications?count=100&orderDirection=DESC',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
const data = await response.json();
```

**Response:**
```json
{
  "items": [
    {
      "abstractViews": 1250,
      "galleyViews": 987,      // Total downloads (all formats)
      "pdfViews": 850,         // PDF downloads
      "htmlViews": 120,        // HTML views
      "otherViews": 17,        // EPUB, XML, etc.
      "publication": {
        "id": 123,
        "fullTitle": "Article Title",
        "authorsStringShort": "Smith et al."
      }
    }
  ],
  "itemsMax": 156  // Total number of publications
}
```

**Key Metrics:**
- `galleyViews` = **Total Downloads** (all formats combined)
- `pdfViews` = PDF downloads specifically
- `abstractViews` = Page views (not downloads)

---

### 1.2 Downloads Over Time (Timeline)

**Endpoint:** `GET /api/v1/stats/publications/galley`

**Use Case:** Track download trends monthly or daily

```javascript
// Monthly downloads for the year
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/stats/publications/galley?timelineInterval=month&dateStart=2025-01-01&dateEnd=2025-12-31',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

**Response:**
```json
[
  { "date": "2025-01", "value": 3450 },
  { "date": "2025-02", "value": 3780 },
  { "date": "2025-03", "value": 4120 },
  { "date": "2025-04", "value": 3890 }
]
```

**Chart Ready:** Perfect for line/bar charts showing download trends

---

### 1.3 Downloads by Article Type/Section

**Endpoint:** `GET /api/v1/stats/publications?sectionIds=X,Y,Z`

**Use Case:** Compare research articles vs reviews vs editorials

```javascript
// Get stats for specific sections
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/stats/publications?sectionIds=1,2,3&count=100',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

---

### 1.4 Top Downloaded Articles (Last 30 Days)

```javascript
const today = new Date().toISOString().split('T')[0];
const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];

const response = await fetch(
  `http://localhost:8000/index.php/tjpsd/api/v1/stats/publications?dateStart=${thirtyDaysAgo}&dateEnd=${today}&count=10&orderDirection=DESC`,
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

---

## 2. PUBLICATION METRICS

### 2.1 Total Published Papers

**Endpoint:** `GET /api/v1/submissions?status=3`

**Use Case:** Get count of all published articles

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/submissions?status=3&count=1',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
const data = await response.json();
const totalPublished = data.itemsMax;  // Total published papers
```

**Status Codes:**
- `1` = Queued (not submitted)
- `3` = Published
- `4` = Declined
- `5` = Scheduled

---

### 2.2 Publications by Year

```javascript
async function getPublishedByYear(year) {
  const response = await fetch(
    `http://localhost:8000/index.php/tjpsd/api/v1/submissions?status=3&count=1`,
    { headers: { 'Authorization': `Bearer ${API_KEY}` }}
  );
  // Note: You'll need to filter by publication date in your code
  // OJS doesn't have a publishedYear parameter
}
```

---

### 2.3 Recent Publications

**Endpoint:** `GET /api/v1/submissions?status=3&count=10&orderBy=datePublished&orderDirection=DESC`

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/submissions?status=3&count=10&orderBy=datePublished&orderDirection=DESC',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

**Response:**
```json
{
  "itemsMax": 234,
  "items": [
    {
      "id": 156,
      "urlPublished": "http://...",
      "status": 3,
      "dateSubmitted": "2025-12-15",
      "datePublished": "2026-02-01",
      "currentPublicationId": 167,
      "publications": [
        {
          "id": 167,
          "title": { "en_US": "Article Title" },
          "authors": [...],
          "datePublished": "2026-02-01"
        }
      ]
    }
  ]
}
```

---

## 3. SUBMISSIONS & WORKFLOW DATA

### 3.1 Total Submissions (All Time)

**Endpoint:** `GET /api/v1/submissions?count=1`

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/submissions?count=1',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
const data = await response.json();
const totalSubmissions = data.itemsMax;
```

---

### 3.2 Submissions by Status

```javascript
async function getSubmissionsByStatus() {
  const statuses = {
    1: 'Queued',
    3: 'Published',
    4: 'Declined',
    5: 'Scheduled'
  };
  
  const results = {};
  for (const [code, label] of Object.entries(statuses)) {
    const response = await fetch(
      `http://localhost:8000/index.php/tjpsd/api/v1/submissions?status=${code}&count=1`,
      { headers: { 'Authorization': `Bearer ${API_KEY}` }}
    );
    const data = await response.json();
    results[label] = data.itemsMax;
  }
  
  return results;
  // Returns: { "Queued": 45, "Published": 234, "Declined": 67, "Scheduled": 5 }
}
```

---

### 3.3 Active Submissions (In Review)

**Endpoint:** `GET /api/v1/submissions?status=1&stageIds=3,4,5`

```javascript
// Get submissions in review/editing stage
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/submissions?status=1&stageIds=3',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

**Stage IDs:**
- `1` = Submission
- `3` = Review
- `4` = Copyediting
- `5` = Production

---

## 4. EDITORIAL PERFORMANCE

### 4.1 Editorial Overview Dashboard

**Endpoint:** `GET /api/v1/stats/editorial`

**Use Case:** Complete editorial metrics for management

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/stats/editorial?dateStart=2025-01-01&dateEnd=2025-12-31',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

**Response:**
```json
[
  { "key": "submissionsReceived", "name": "Submissions Received", "value": 125 },
  { "key": "submissionsAccepted", "name": "Accepted", "value": 45 },
  { "key": "submissionsDeclined", "name": "Declined", "value": 30 },
  { "key": "submissionsPublished", "name": "Published", "value": 42 },
  { "key": "daysToDecision", "name": "Avg Days to Decision", "value": 45.5 },
  { "key": "daysToAccept", "name": "Avg Days to Accept", "value": 89.2 },
  { "key": "daysToReject", "name": "Avg Days to Reject", "value": 23.7 }
]
```

**Key Metrics:**
- **Acceptance Rate:** `(submissionsAccepted / submissionsReceived) * 100`
- **Rejection Rate:** `(submissionsDeclined / submissionsReceived) * 100`
- **Time to First Decision:** `daysToDecision`
- **Processing Speed:** Lower days = faster

---

### 4.2 Yearly Editorial Averages

**Endpoint:** `GET /api/v1/stats/editorial/averages`

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/stats/editorial/averages',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

**Response:**
```json
{
  "submissionsReceivedPerYear": 52.3,
  "submissionsAcceptedPerYear": 18.7,
  "submissionsDeclinedPerYear": 12.4,
  "submissionsPublishedPerYear": 17.2
}
```

---

### 4.3 Manuscript Turnaround Time

Calculate from editorial stats:

```javascript
const stats = await getEditorialStats();
const turnaroundMetrics = {
  avgDaysToFirstDecision: stats.find(s => s.key === 'daysToDecision').value,
  avgDaysToAcceptance: stats.find(s => s.key === 'daysToAccept').value,
  avgDaysToRejection: stats.find(s => s.key === 'daysToReject').value,
  
  // Calculate acceptance rate
  received: stats.find(s => s.key === 'submissionsReceived').value,
  accepted: stats.find(s => s.key === 'submissionsAccepted').value,
  acceptanceRate: (accepted / received * 100).toFixed(1) + '%'
};
```

---

## 5. ISSUES & PUBLISHING

### 5.1 Total Published Issues

**Endpoint:** `GET /api/v1/issues?count=1`

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/issues?count=1&isPublished=true',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
const data = await response.json();
const totalIssues = data.itemsMax;
```

---

### 5.2 Current Issue

**Endpoint:** `GET /api/v1/issues/current`

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/issues/current',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

**Response:**
```json
{
  "id": 45,
  "title": {
    "en_US": "Vol. 23 No. 1 (2026)"
  },
  "description": {
    "en_US": "Special Issue on AI in Healthcare"
  },
  "volume": 23,
  "number": "1",
  "year": 2026,
  "datePublished": "2026-01-15",
  "published": true,
  "articles": [
    {
      "id": 234,
      "title": "Article Title 1",
      "authors": "..."
    }
  ]
}
```

---

### 5.3 All Issues (with article counts)

**Endpoint:** `GET /api/v1/issues?count=100&isPublished=true`

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/issues?count=100&isPublished=true',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

---

## 6. USER & COMMUNITY ANALYTICS

### 6.1 User Statistics by Role

**Endpoint:** `GET /api/v1/stats/users`

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/stats/users',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

**Response:**
```json
[
  { "key": "reader", "name": "Readers", "value": 3450 },
  { "key": "author", "name": "Authors", "value": 567 },
  { "key": "reviewer", "name": "Reviewers", "value": 234 },
  { "key": "editor", "name": "Editors", "value": 45 }
]
```

---

### 6.2 New User Registrations (Time Period)

**Endpoint:** `GET /api/v1/stats/users?registeredAfter=YYYY-MM-DD&registeredBefore=YYYY-MM-DD`

```javascript
// Users registered in last 30 days
const today = new Date().toISOString().split('T')[0];
const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];

const response = await fetch(
  `http://localhost:8000/index.php/tjpsd/api/v1/stats/users?registeredAfter=${thirtyDaysAgo}&registeredBefore=${today}`,
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
```

---

### 6.3 Total Registered Users

**Endpoint:** `GET /api/v1/users?count=1`

```javascript
const response = await fetch(
  'http://localhost:8000/index.php/tjpsd/api/v1/users?count=1',
  { headers: { 'Authorization': `Bearer ${API_KEY}` }}
);
const totalUsers = response.json().itemsMax;
```

---

## 7. FINANCIAL & REVENUE DATA

### 7.1 Article Processing Charges (APCs)

**Endpoint:** Custom query or payment records

```javascript
// Not directly available via API - requires database query or custom plugin
// Typical implementation would track payments via _payments API
```

**Alternative:** Export from database:
```sql
SELECT COUNT(*) as paid_articles, SUM(amount) as total_revenue
FROM completed_payments
WHERE date_completed BETWEEN '2025-01-01' AND '2025-12-31';
```

---

## 8. COMPLETE DASHBOARD EXAMPLES

### 8.1 Executive Summary Dashboard

```javascript
async function getExecutiveSummary(journalPath) {
  const API_BASE = `http://localhost:8000/index.php/${journalPath}/api/v1`;
  
  // Fetch all data in parallel
  const [
    totalPapers,
    publishedPapers,
    editorial,
    users,
    topArticles,
    issues
  ] = await Promise.all([
    fetch(`${API_BASE}/submissions?count=1`).then(r => r.json()),
    fetch(`${API_BASE}/submissions?status=3&count=1`).then(r => r.json()),
    fetch(`${API_BASE}/stats/editorial`).then(r => r.json()),
    fetch(`${API_BASE}/stats/users`).then(r => r.json()),
    fetch(`${API_BASE}/stats/publications?count=5&orderDirection=DESC`).then(r => r.json()),
    fetch(`${API_BASE}/issues?count=1&isPublished=true`).then(r => r.json())
  ]);
  
  return {
    totalSubmissions: totalPapers.itemsMax,
    publishedArticles: publishedPapers.itemsMax,
    totalIssues: issues.itemsMax,
    
    editorial: {
      submissionsReceived: editorial.find(s => s.key === 'submissionsReceived')?.value || 0,
      acceptanceRate: ((editorial.find(s => s.key === 'submissionsAccepted')?.value || 0) / 
                      (editorial.find(s => s.key === 'submissionsReceived')?.value || 1) * 100).toFixed(1) + '%',
      avgDaysToDecision: editorial.find(s => s.key === 'daysToDecision')?.value || 0
    },
    
    community: {
      totalReaders: users.find(u => u.key === 'reader')?.value || 0,
      authors: users.find(u => u.key === 'author')?.value || 0,
      reviewers: users.find(u => u.key === 'reviewer')?.value || 0
    },
    
    topArticles: topArticles.items.slice(0, 5).map(item => ({
      title: item.publication.fullTitle,
      downloads: item.galleyViews,
      views: item.abstractViews
    }))
  };
}
```

**Output:**
```json
{
  "totalSubmissions": 456,
  "publishedArticles": 234,
  "totalIssues": 45,
  "editorial": {
    "submissionsReceived": 125,
    "acceptanceRate": "36.0%",
    "avgDaysToDecision": 45.5
  },
  "community": {
    "totalReaders": 3450,
    "authors": 567,
    "reviewers": 234
  },
  "topArticles": [
    { "title": "...", "downloads": 1250, "views": 2340 }
  ]
}
```

---

### 8.2 Download Analytics Dashboard

```javascript
async function getDownloadAnalytics(journalPath, months = 12) {
  const API_BASE = `http://localhost:8000/index.php/${journalPath}/api/v1`;
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const dateStart = startDate.toISOString().split('T')[0];
  const dateEnd = endDate.toISOString().split('T')[0];
  
  const [timeline, topArticles, sections] = await Promise.all([
    fetch(`${API_BASE}/stats/publications/galley?timelineInterval=month&dateStart=${dateStart}&dateEnd=${dateEnd}`).then(r => r.json()),
    fetch(`${API_BASE}/stats/publications?count=10&dateStart=${dateStart}&dateEnd=${dateEnd}`).then(r => r.json()),
    fetch(`${API_BASE}/stats/publications?dateStart=${dateStart}&dateEnd=${dateEnd}&count=100`).then(r => r.json())
  ]);
  
  // Calculate totals
  const totalDownloads = timeline.reduce((sum, point) => sum + point.value, 0);
  const avgMonthlyDownloads = (totalDownloads / months).toFixed(0);
  
  // Calculate by format
  const formatBreakdown = topArticles.items.reduce((acc, item) => {
    acc.pdf += item.pdfViews;
    acc.html += item.htmlViews;
    acc.other += item.otherViews;
    return acc;
  }, { pdf: 0, html: 0, other: 0 });
  
  return {
    totalDownloads,
    avgMonthlyDownloads,
    timeline,
    topArticles: topArticles.items.map(item => ({
      title: item.publication.fullTitle,
      downloads: item.galleyViews,
      pdfDownloads: item.pdfViews
    })),
    formatBreakdown: {
      pdf: formatBreakdown.pdf,
      html: formatBreakdown.html,
      other: formatBreakdown.other,
      pdfPercentage: ((formatBreakdown.pdf / totalDownloads) * 100).toFixed(1) + '%'
    }
  };
}
```

---

### 8.3 Editorial Workflow Dashboard

```javascript
async function getWorkflowDashboard(journalPath) {
  const API_BASE = `http://localhost:8000/index.php/${journalPath}/api/v1`;
  
  const [submissions, editorial, currentIssue] = await Promise.all([
    fetch(`${API_BASE}/submissions?status=1&count=100`).then(r => r.json()),
    fetch(`${API_BASE}/stats/editorial`).then(r => r.json()),
    fetch(`${API_BASE}/issues/current`).then(r => r.json())
  ]);
  
  // Group submissions by stage
  const byStage = submissions.items.reduce((acc, sub) => {
    const stage = sub.stageId;
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});
  
  return {
    activeSubmissions: submissions.itemsMax,
    byStage: {
      submission: byStage[1] || 0,
      review: byStage[3] || 0,
      copyediting: byStage[4] || 0,
      production: byStage[5] || 0
    },
    performance: {
      avgDaysToDecision: editorial.find(s => s.key === 'daysToDecision')?.value,
      acceptanceRate: (editorial.find(s => s.key === 'submissionsAccepted')?.value / 
                      editorial.find(s => s.key === 'submissionsReceived')?.value * 100).toFixed(1) + '%'
    },
    currentIssue: {
      title: currentIssue.title?.en_US,
      articleCount: currentIssue.articles?.length || 0,
      published: currentIssue.datePublished
    }
  };
}
```

---

## 9. MULTI-JOURNAL ANALYTICS

### 9.1 Compare All Journals

```javascript
async function compareAllJournals() {
  // Get all journals
  const contextsResponse = await fetch(
    'http://localhost:8000/api/v1/_context',
    { headers: { 'Authorization': `Bearer ${API_KEY}` }}
  );
  const contexts = await contextsResponse.json();
  
  // Get stats for each journal
  const journalStats = await Promise.all(
    contexts.items.filter(j => j.enabled).map(async journal => {
      const [published, downloads] = await Promise.all([
        fetch(`http://localhost:8000/index.php/${journal.urlPath}/api/v1/submissions?status=3&count=1`).then(r => r.json()),
        fetch(`http://localhost:8000/index.php/${journal.urlPath}/api/v1/stats/publications?count=10`).then(r => r.json())
      ]);
      
      const totalDownloads = downloads.items.reduce((sum, item) => sum + item.galleyViews, 0);
      
      return {
        name: journal.name.en_US,
        urlPath: journal.urlPath,
        publishedArticles: published.itemsMax,
        totalDownloads,
        avgDownloadsPerArticle: (totalDownloads / (published.itemsMax || 1)).toFixed(0)
      };
    })
  );
  
  return journalStats.sort((a, b) => b.totalDownloads - a.totalDownloads);
}
```

---

## 10. EXPORT & REPORTING

### 10.1 Generate CSV Report

```javascript
function exportToCSV(data, filename) {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => row[h]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

// Usage
const topArticles = await getTopArticles();
exportToCSV(topArticles, 'top-articles-2026.csv');
```

---

## 11. KEY METRICS SUMMARY

### For Administrators:
- Total Submissions (all time)
- Published Articles
- Acceptance Rate
- Average Time to Decision
- Total Downloads
- Active Users (by role)
- Issues Published

### For Journal Managers:
- Submissions in Review
- Manuscripts in Each Stage
- Reviewer Performance
- Time to Publication
- Top Downloaded Articles
- Current Issue Status

### For Marketing/Communications:
- Download Trends
- Most Popular Articles
- New User Registrations
- Social Reach (if tracked)
- Citation Metrics (external)

### For Authors:
- Article Downloads
- Article Views
- Publication Date
- Issue/Volume Info

---

## 12. DASHBOARD REFRESH RECOMMENDATIONS

**Real-time Metrics:** Update every 5-10 minutes
- Active submissions
- Current editorial queue

**Daily Updates:** Refresh once per day
- Download statistics
- User registrations
- Editorial performance

**Weekly/Monthly:** Refresh weekly
- Historical trends
- Comparative analytics
- Long-term averages

---

**Last Updated:** February 14, 2026  
**Covers:** OJS 3.3.0+ API v1
