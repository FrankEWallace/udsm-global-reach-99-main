# Fast Stats API - Comprehensive Documentation

## Overview

The Fast Stats API Plugin provides optimized, pre-aggregated statistics endpoints for OJS (Open Journal Systems). Unlike the default OJS statistics APIs which calculate metrics on-demand, this plugin uses efficient single queries to deliver fast responses even for large datasets.

**Version:** 1.1.0.0  
**Compatibility:** OJS 3.3.0+  
**Base URL:** `/{journalPath}/api/v1/fast-stats`

**Example:** `http://localhost:8000/tjpsd/api/v1/fast-stats/dashboard`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Common Filter Parameters](#common-filter-parameters)
3. [API Endpoints](#api-endpoints)
   - [Dashboard](#1-dashboard)
   - [Counts](#2-counts)
   - [Aggregated Stats](#3-aggregated-stats)
   - [Journals](#4-journals)
   - [Downloads](#5-downloads)
   - [Downloads by Journal](#6-downloads-by-journal)
   - [Views Timeline](#7-views-timeline)
   - [Top Publications](#8-top-publications)
   - [Recent Publications](#9-recent-publications)
   - [Publications](#10-publications)
   - [Publications by Year](#11-publications-by-year)
   - [Publications by Section](#12-publications-by-section)
   - [Sections](#13-sections)
   - [Issues](#14-issues)
   - [Users](#15-users)
   - [Editorial](#16-editorial)
   - [Citations](#17-citations)
     - [Citation Summary](#171-citation-summary-legacy)
     - [Crossref Citations](#172-crossref-citations)
     - [Publications with DOIs](#173-publications-with-dois)
     - [Fetch Citations from Crossref](#174-fetch-citations-from-crossref)
     - [Clear Citation Cache](#175-clear-citation-cache)
     - [Publications Without DOIs](#176-publications-without-dois)
     - [All Citations (Unified View)](#177-all-citations-unified-view)
     - [Fetch Citations from OpenAlex](#178-fetch-citations-from-openalex)
4. [TypeScript Interfaces](#typescript-interfaces)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)

---

## Authentication

All endpoints require a valid OJS API token (JWT format).

### Header Format
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Getting an API Token

**Method 1: Via OJS UI**
1. Log in to OJS as an administrator
2. Go to User Profile → API Key
3. Check "Enable external applications with the API key to access this account"
4. Click "Create API Key" or "Regenerate API Key"
5. Copy the displayed JWT token

**Method 2: Via PHP Script**
```php
<?php
// generate_token.php
require('lib/pkp/lib/vendor/autoload.php');
use Firebase\JWT\JWT;

// Get config
$config = parse_ini_file('config.inc.php', true);
$secret = $config['security']['api_key_secret'];

// Connect to database and get user's API key
$pdo = new PDO(
    "mysql:host={$config['database']['host']};dbname={$config['database']['name']}",
    $config['database']['username'],
    $config['database']['password']
);

// Get admin user's apiKey (user_id = 112 in this example)
$userId = 112;
$stmt = $pdo->prepare("SELECT setting_value FROM user_settings WHERE user_id = ? AND setting_name = 'apiKey'");
$stmt->execute([$userId]);
$row = $stmt->fetch();
$apiKey = $row['setting_value'];

// Generate JWT
$jwt = JWT::encode($apiKey, $secret, 'HS256');
echo "JWT Token: " . $jwt;
```

**Requirements:**
- The `api_key_secret` must be set in `config.inc.php`:
  ```ini
  [security]
  api_key_secret = "your-very-long-random-secret-key"
  ```
- User must have API key enabled in their profile

---

## Common Filter Parameters

These query parameters are available across multiple endpoints:

### Date Filters

| Parameter | Type | Format | Description | Example |
|-----------|------|--------|-------------|---------|
| `dateStart` | string | YYYY-MM-DD | Start date for filtering | `2024-01-01` |
| `dateEnd` | string | YYYY-MM-DD | End date for filtering | `2024-12-31` |

### Pagination

| Parameter | Type | Default | Min | Max | Description |
|-----------|------|---------|-----|-----|-------------|
| `count` | integer | 20 | 1 | 500 | Number of items to return |
| `offset` | integer | 0 | 0 | - | Number of items to skip |

### Sorting

| Parameter | Type | Default | Options | Description |
|-----------|------|---------|---------|-------------|
| `orderBy` | string | varies | `total_views`, `abstract_views`, `file_downloads`, `date_published`, `title`, `submission_id` | Field to sort by |
| `orderDirection` | string | `DESC` | `ASC`, `DESC` | Sort direction |

### Filtering

| Parameter | Type | Format | Description | Example |
|-----------|------|--------|-------------|---------|
| `journalId` | integer | - | Filter by journal ID | `1` |
| `sectionIds` | string | comma-separated | Filter by section IDs | `1,2,3` |
| `issueIds` | string | comma-separated | Filter by issue IDs | `10,11,12` |
| `submissionIds` | string | comma-separated | Filter by submission IDs | `100,101,102` |
| `status` | integer | - | Submission status (1=queued, 3=published, 4=declined, 5=scheduled) | `3` |
| `searchPhrase` | string | - | Search in title/abstract | `climate change` |
| `timelineInterval` | string | `month` | Timeline grouping: `day`, `month`, `year` | `month` |
| `months` | integer | 12 | Number of months for timeline | `24` |
| `year` | integer | - | Filter by publication year | `2024` |

---

## API Endpoints

### 1. Dashboard

**GET** `/api/v1/fast-stats/dashboard`

Complete dashboard data in a single call. Combines counts, downloads, editorial stats, users, top publications, recent publications, publications by year, by section, and views timeline.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal |
| `dateStart` | No | Start date |
| `dateEnd` | No | End date |
| `months` | No | Months for timeline (default: 12) |

#### Response
```json
{
  "counts": {
    "totalSubmissions": 150,
    "publishedArticles": 120,
    "activeSubmissions": 15,
    "declinedSubmissions": 10,
    "scheduledSubmissions": 5,
    "totalIssues": 24,
    "publishedIssues": 20,
    "totalUsers": 500,
    "contextId": 1,
    "lastUpdated": "2024-01-15 10:30:00"
  },
  "downloads": {
    "abstractViews": 50000,
    "fileDownloads": 25000,
    "totalViews": 75000,
    "contextId": 1,
    "dateStart": null,
    "dateEnd": null
  },
  "editorial": {
    "submissionsReceived": 150,
    "submissionsQueued": 15,
    "submissionsPublished": 120,
    "submissionsDeclined": 10,
    "submissionsScheduled": 5,
    "acceptanceRate": 80.0,
    "rejectionRate": 6.7,
    "contextId": 1,
    "dateStart": null,
    "dateEnd": null
  },
  "users": {
    "totalUsers": 500,
    "byRole": [
      { "roleId": 65536, "roleName": "Author", "count": 300 },
      { "roleId": 1048576, "roleName": "Reader", "count": 150 }
    ],
    "contextId": 1
  },
  "topPublications": [...],
  "recentPublications": [...],
  "publicationsByYear": [...],
  "publicationsBySection": [...],
  "viewsTimeline": [...],
  "lastUpdated": "2024-01-15 10:30:00"
}
```

---

### 2. Counts

**GET** `/api/v1/fast-stats/counts`

Basic counts for submissions, issues, and users.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal |

#### Response
```json
{
  "totalSubmissions": 150,
  "publishedArticles": 120,
  "activeSubmissions": 15,
  "declinedSubmissions": 10,
  "scheduledSubmissions": 5,
  "totalIssues": 24,
  "publishedIssues": 20,
  "totalUsers": 500,
  "contextId": 1,
  "lastUpdated": "2024-01-15 10:30:00"
}
```

---

### 3. Aggregated Stats

**GET** `/api/v1/fast-stats/aggregated`

Aggregated statistics across all journals.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `dateStart` | No | Start date for views/downloads |
| `dateEnd` | No | End date for views/downloads |

#### Response
```json
{
  "totalJournals": 3,
  "activeJournals": 3,
  "totalSubmissions": 450,
  "totalPublished": 380,
  "totalActive": 40,
  "totalDeclined": 25,
  "totalIssues": 60,
  "totalUsers": 1200,
  "totalAbstractViews": 150000,
  "totalDownloads": 75000,
  "dateStart": "2024-01-01",
  "dateEnd": "2024-12-31",
  "lastUpdated": "2024-01-15 10:30:00"
}
```

---

### 4. Journals

**GET** `/api/v1/fast-stats/journals`

List all journals with their statistics.

#### Query Parameters
None

#### Response
```json
[
  {
    "id": 1,
    "path": "journal-path",
    "name": "Journal of Example Studies",
    "abbreviation": "JES",
    "description": "A scholarly journal...",
    "enabled": true,
    "totalSubmissions": 150,
    "publishedArticles": 120,
    "activeSubmissions": 15,
    "publishedIssues": 20
  }
]
```

---

### 5. Downloads

**GET** `/api/v1/fast-stats/downloads`

Download and view statistics.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal |
| `dateStart` | No | Start date |
| `dateEnd` | No | End date |

#### Response
```json
{
  "abstractViews": 50000,
  "fileDownloads": 25000,
  "totalViews": 75000,
  "contextId": 1,
  "dateStart": "2024-01-01",
  "dateEnd": "2024-12-31"
}
```

---

### 6. Downloads by Journal

**GET** `/api/v1/fast-stats/downloads/by-journal`

Downloads broken down by journal.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `dateStart` | No | Start date |
| `dateEnd` | No | End date |

#### Response
```json
[
  {
    "journalId": 1,
    "path": "journal-path",
    "name": "Journal of Example Studies",
    "abstractViews": 30000,
    "fileDownloads": 15000,
    "totalViews": 45000
  }
]
```

---

### 7. Views Timeline

**GET** `/api/v1/fast-stats/views/timeline`

Views and downloads over time.

#### Query Parameters
| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `journalId` | No | - | Filter by journal |
| `timelineInterval` | No | `month` | Grouping: `day`, `month`, `year` |
| `months` | No | 12 | Number of months to include |
| `dateStart` | No | - | Override start date |
| `dateEnd` | No | - | Override end date |

#### Response
```json
[
  {
    "period": "202401",
    "date": "2024-01",
    "abstractViews": 5000,
    "fileDownloads": 2500,
    "totalViews": 7500
  },
  {
    "period": "202402",
    "date": "2024-02",
    "abstractViews": 5500,
    "fileDownloads": 2700,
    "totalViews": 8200
  }
]
```

---

### 8. Top Publications

**GET** `/api/v1/fast-stats/publications/top`

Publications sorted by total views.

#### Query Parameters
| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `journalId` | No | - | Filter by journal |
| `count` | No | 10 | Number of results (max: 500) |
| `sectionIds` | No | - | Filter by sections |
| `dateStart` | No | - | Filter views by date |
| `dateEnd` | No | - | Filter views by date |

#### Response
```json
[
  {
    "submissionId": 123,
    "publicationId": 456,
    "contextId": 1,
    "title": "A Study on Example Topics",
    "journalPath": "journal-path",
    "journalName": "Journal of Example Studies",
    "sectionId": 1,
    "sectionName": "Articles",
    "datePublished": "2024-01-15",
    "abstractViews": 5000,
    "fileDownloads": 2500,
    "totalViews": 7500
  }
]
```

---

### 9. Recent Publications

**GET** `/api/v1/fast-stats/publications/recent`

Most recently published articles.

#### Query Parameters
| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `journalId` | No | - | Filter by journal |
| `count` | No | 10 | Number of results (max: 500) |
| `sectionIds` | No | - | Filter by sections |
| `dateStart` | No | - | Published after date |
| `dateEnd` | No | - | Published before date |

#### Response
```json
[
  {
    "submissionId": 123,
    "publicationId": 456,
    "contextId": 1,
    "title": "A Study on Example Topics",
    "journalPath": "journal-path",
    "journalName": "Journal of Example Studies",
    "sectionId": 1,
    "sectionName": "Articles",
    "datePublished": "2024-01-15"
  }
]
```

---

### 10. Publications

**GET** `/api/v1/fast-stats/publications`

Paginated list of publications with full filtering.

#### Query Parameters
| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `journalId` | No | - | Filter by journal |
| `count` | No | 50 | Items per page (max: 500) |
| `offset` | No | 0 | Skip items |
| `orderBy` | No | `total_views` | Sort field |
| `orderDirection` | No | `DESC` | Sort direction |
| `sectionIds` | No | - | Filter by sections |
| `status` | No | 3 | Submission status |
| `searchPhrase` | No | - | Search title/abstract |
| `dateStart` | No | - | Published after date |
| `dateEnd` | No | - | Published before date |

#### Response
```json
{
  "items": [
    {
      "submissionId": 123,
      "publicationId": 456,
      "contextId": 1,
      "status": 3,
      "title": "A Study on Example Topics",
      "journalPath": "journal-path",
      "journalName": "Journal of Example Studies",
      "sectionId": 1,
      "sectionName": "Articles",
      "datePublished": "2024-01-15",
      "abstractViews": 5000,
      "fileDownloads": 2500,
      "totalViews": 7500
    }
  ],
  "itemsMax": 150
}
```

---

### 11. Publications by Year

**GET** `/api/v1/fast-stats/publications/by-year`

Publication counts grouped by year.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal |
| `sectionIds` | No | Filter by sections |

#### Response
```json
[
  { "year": 2024, "count": 45 },
  { "year": 2023, "count": 52 },
  { "year": 2022, "count": 38 }
]
```

---

### 12. Publications by Section

**GET** `/api/v1/fast-stats/publications/by-section`

Publication counts grouped by section.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal |

#### Response
```json
[
  { "sectionId": 1, "sectionName": "Articles", "count": 100 },
  { "sectionId": 2, "sectionName": "Reviews", "count": 30 },
  { "sectionId": 3, "sectionName": "Case Studies", "count": 20 }
]
```

---

### 13. Sections

**GET** `/api/v1/fast-stats/sections`

List all sections with publication counts.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal |

#### Response
```json
[
  {
    "sectionId": 1,
    "journalId": 1,
    "title": "Articles",
    "abbreviation": "ART",
    "sequence": 1,
    "publicationCount": 100
  }
]
```

---

### 14. Issues

**GET** `/api/v1/fast-stats/issues`

List issues with article counts.

#### Query Parameters
| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `journalId` | No | - | Filter by journal |
| `count` | No | 50 | Items per page |
| `offset` | No | 0 | Skip items |

#### Response
```json
{
  "items": [
    {
      "issueId": 1,
      "journalId": 1,
      "title": "Vol. 10 No. 1 (2024)",
      "volume": "10",
      "number": "1",
      "year": 2024,
      "published": true,
      "datePublished": "2024-01-15",
      "articleCount": 8
    }
  ],
  "itemsMax": 24
}
```

---

### 15. Users

**GET** `/api/v1/fast-stats/users`

User statistics by role.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal context |

#### Response
```json
{
  "totalUsers": 500,
  "byRole": [
    { "roleId": 1, "roleName": "Site Admin", "count": 2 },
    { "roleId": 16, "roleName": "Manager", "count": 5 },
    { "roleId": 17, "roleName": "Sub Editor", "count": 10 },
    { "roleId": 4096, "roleName": "Reviewer", "count": 50 },
    { "roleId": 65536, "roleName": "Author", "count": 300 },
    { "roleId": 1048576, "roleName": "Reader", "count": 133 }
  ],
  "contextId": 1
}
```

---

### 16. Editorial

**GET** `/api/v1/fast-stats/editorial`

Editorial workflow statistics.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal |
| `dateStart` | No | Submission date start |
| `dateEnd` | No | Submission date end |

#### Response
```json
{
  "submissionsReceived": 150,
  "submissionsQueued": 15,
  "submissionsPublished": 120,
  "submissionsDeclined": 10,
  "submissionsScheduled": 5,
  "acceptanceRate": 80.0,
  "rejectionRate": 6.7,
  "contextId": 1,
  "dateStart": "2024-01-01",
  "dateEnd": "2024-12-31"
}
```

---

### 17. Citations

The plugin provides comprehensive citation management, including automatic fetching from Crossref.

#### 17.1 Citation Summary (Legacy)

**GET** `/api/v1/fast-stats/citations`

Basic citation statistics from OJS citations table.

#### Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `journalId` | No | Filter by journal |

#### Response
```json
{
  "available": true,
  "totalCitations": 500,
  "publicationsWithCitations": 80,
  "contextId": 1
}
```

---

#### 17.2 Crossref Citations

**GET** `/api/v1/fast-stats/citations/crossref`

Get citation counts fetched from Crossref for all publications with DOIs.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `journalId` | number | context | Filter by journal |
| `count` | number | 50 | Results per page (max 500) |
| `offset` | number | 0 | Pagination offset |
| `orderBy` | string | `citation_count` | Sort field: `citation_count`, `last_updated`, `title`, `date_published` |
| `orderDirection` | string | `DESC` | Sort direction: `ASC` or `DESC` |

#### Response
```json
{
  "items": [
    {
      "submissionId": 42,
      "publicationId": 42,
      "contextId": 1,
      "title": "Article Title",
      "doi": "10.1234/example.001",
      "datePublished": "2024-01-15",
      "citationCount": 15,
      "citationLastUpdated": "2026-02-14 12:30:00",
      "citationSource": "crossref",
      "journalPath": "myjournal",
      "journalName": "My Journal"
    }
  ],
  "itemsMax": 179,
  "summary": {
    "totalPublications": 179,
    "publicationsWithCitations": 128,
    "totalCitations": 67,
    "maxCitations": 6,
    "avgCitations": 0.52
  },
  "contextId": 1
}
```

---

#### 17.3 Publications with DOIs

**GET** `/api/v1/fast-stats/citations/dois`

Get list of publications that have DOIs assigned.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `journalId` | number | context | Filter by journal |
| `count` | number | 1000 | Results per page |
| `offset` | number | 0 | Pagination offset |
| `onlyMissing` | boolean | false | Only return publications without citation data |

#### Response
```json
{
  "items": [
    {
      "submissionId": 42,
      "publicationId": 42,
      "contextId": 1,
      "title": "Article Title",
      "doi": "10.1234/example.001",
      "datePublished": "2024-01-15",
      "journalPath": "myjournal"
    }
  ],
  "itemsMax": 179
}
```

---

#### 17.4 Fetch Citations from Crossref

**POST** `/api/v1/fast-stats/citations/fetch`

Trigger fetching of citation counts from Crossref API for publications with DOIs.

**Roles:** Site Admin, Manager

#### Query/Body Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `onlyMissing` | boolean | true | Only fetch for publications without existing data |
| `limit` | number | 100 | Max publications to process (max 500) |
| `email` | string | null | Contact email for Crossref polite pool (recommended) |

#### Response
```json
{
  "success": true,
  "message": "Processed 100 publications",
  "processed": 100,
  "successful": 95,
  "failed": 5,
  "results": [
    {
      "doi": "10.1234/example.001",
      "title": "Article Title",
      "citationCount": 15,
      "status": "success"
    },
    {
      "doi": "10.1234/example.002",
      "title": "Another Article",
      "status": "fetch_failed",
      "error": "DOI not found in Crossref"
    }
  ],
  "log": [
    "SUCCESS: DOI 10.1234/example.001 has 15 citations",
    "DOI not found in Crossref: 10.1234/example.002"
  ]
}
```

#### Notes
- Crossref API requests are rate-limited (100ms between requests)
- Providing an email enables Crossref's "polite pool" with higher rate limits
- Results are stored in the database for future queries
- Use `?onlyMissing=true` to only fetch citations for new publications

---

#### 17.5 Clear Citation Cache

**POST** `/api/v1/fast-stats/citations/clear`

Remove all stored citation counts (useful before full refresh).

**Roles:** Site Admin only

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `journalId` | number | null | Clear only for specific journal (omit for all) |

#### Response
```json
{
  "success": true,
  "message": "Cleared citation cache",
  "deletedRecords": 150,
  "contextId": null
}
```

---

#### 17.6 Publications Without DOIs

**GET** `/api/v1/fast-stats/citations/no-doi`

List published articles that don't have a DOI assigned. These publications can use OpenAlex's title-based search instead.

**Roles:** Site Admin, Journal Manager, Editor

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `journalId` | number | null | Filter by journal |
| `count` | number | 50 | Number of results to return |
| `offset` | number | 0 | Pagination offset |
| `onlyMissing` | boolean | false | Only show those without citation data |

#### Response
```json
{
  "items": [
    {
      "submissionId": 45,
      "publicationId": 47,
      "contextId": 1,
      "title": "Sample Article Title Without DOI",
      "datePublished": "2023-06-15",
      "authors": "Smith, J.; Johnson, K.",
      "journalPath": "tjpsd",
      "journalName": "Tanzania Journal for Population Studies and Development",
      "citationCount": null,
      "hasCitationData": false
    }
  ],
  "itemsMax": 0
}
```

---

#### 17.7 All Citations (Unified View)

**GET** `/api/v1/fast-stats/citations/all`

Get a unified view of all publications with their citation counts, regardless of source (Crossref, OpenAlex, or none).

**Roles:** Site Admin, Journal Manager, Editor

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `journalId` | number | null | Filter by journal |
| `count` | number | 50 | Number of results to return |
| `offset` | number | 0 | Pagination offset |
| `orderBy` | string | "citation_count" | Sort by: citation_count, last_updated, title, date_published |
| `orderDirection` | string | "DESC" | Sort direction: ASC or DESC |

#### Response
```json
{
  "items": [
    {
      "submissionId": 125,
      "publicationId": 129,
      "contextId": 1,
      "title": "Population and Economic Growth in Tanzania",
      "doi": "10.56279/tjpsd.v28i2.125",
      "hasDoi": true,
      "datePublished": "2021-12-31",
      "citationCount": 6,
      "citationLastUpdated": "2026-02-14 12:59:52",
      "citationSource": "crossref",
      "journalPath": "tjpsd",
      "journalName": "Tanzania Journal for Population Studies and Development"
    }
  ],
  "itemsMax": 179,
  "summary": {
    "totalPublications": 179,
    "publicationsWithCitations": 128,
    "totalCitations": 67,
    "maxCitations": 6,
    "avgCitations": 1.81,
    "fromCrossref": 128,
    "fromOpenalex": 0
  },
  "contextId": 1
}
```

---

#### 17.8 Fetch Citations from OpenAlex

**POST** `/api/v1/fast-stats/citations/fetch-openalex`

Fetch citation counts from OpenAlex API using title-based search. This is useful for publications without DOIs that can't use Crossref's API.

**Roles:** Site Admin, Journal Manager

#### Query Parameters / Body
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `journalId` | number | null | Filter by journal |
| `limit` | number | 50 | Max publications to process (max: 200) |
| `onlyMissing` | boolean | true | Only fetch for publications without citation data |
| `email` | string | null | Contact email for OpenAlex API (recommended) |
| `includeWithDoi` | boolean | false | Also search publications that have DOIs |

#### Response
```json
{
  "success": true,
  "message": "OpenAlex citation fetch completed",
  "processed": 15,
  "found": 8,
  "notFound": 7,
  "sourcesUpdated": {
    "new": 8,
    "existing": 0
  },
  "totalCitations": 12,
  "sampleResults": [
    {
      "publicationId": 47,
      "title": "Sample Article Title",
      "citationCount": 3,
      "confidence": 0.92
    }
  ]
}
```

#### Notes
- OpenAlex uses fuzzy title matching with a minimum 70% confidence threshold
- Results include publication year and author matching for better accuracy
- Rate limits: 10 requests/second (100/s with polite pool email)
- Use sparingly as title search is slower and less accurate than DOI lookup

---

### Scheduled Citation Fetching

The plugin includes a scheduled task that automatically fetches Crossref citations daily at 3 AM.

#### Configuration (scheduledTasks.xml)
```xml
<task class="plugins.generic.fastStatsApi.classes.CrossrefCitationTask">
  <frequency hour="3" />
  <args>
    <!-- Contact email for Crossref polite pool (recommended) -->
    <arg>admin@yourjournal.org</arg>
    <!-- Batch size per run (default: 50) -->
    <arg>50</arg>
  </args>
</task>
```

#### Manual Execution via CLI
```bash
php tools/runScheduledTasks.php plugins/generic/fastStatsApi/scheduledTasks.xml
```

---

## TypeScript Interfaces

```typescript
// Common types
type OrderDirection = 'ASC' | 'DESC';
type TimelineInterval = 'day' | 'month' | 'year';
type SubmissionStatus = 1 | 3 | 4 | 5; // 1=queued, 3=published, 4=declined, 5=scheduled
type OrderByField = 'total_views' | 'abstract_views' | 'file_downloads' | 'date_published' | 'title' | 'submission_id';

// Filter parameters
interface FastStatsFilters {
  journalId?: number;
  dateStart?: string; // YYYY-MM-DD
  dateEnd?: string;   // YYYY-MM-DD
  count?: number;     // 1-500
  offset?: number;
  orderBy?: OrderByField;
  orderDirection?: OrderDirection;
  sectionIds?: number[];
  issueIds?: number[];
  submissionIds?: number[];
  status?: SubmissionStatus;
  searchPhrase?: string;
  timelineInterval?: TimelineInterval;
  months?: number;    // 1-120
  year?: number;
}

// Response types
interface CountsResponse {
  totalSubmissions: number;
  publishedArticles: number;
  activeSubmissions: number;
  declinedSubmissions: number;
  scheduledSubmissions: number;
  totalIssues: number;
  publishedIssues: number;
  totalUsers: number;
  contextId: number | null;
  lastUpdated: string;
}

interface DownloadsResponse {
  abstractViews: number;
  fileDownloads: number;
  totalViews: number;
  contextId: number | null;
  dateStart: string | null;
  dateEnd: string | null;
}

interface AggregatedStatsResponse {
  totalJournals: number;
  activeJournals: number;
  totalSubmissions: number;
  totalPublished: number;
  totalActive: number;
  totalDeclined: number;
  totalIssues: number;
  totalUsers: number;
  totalAbstractViews: number;
  totalDownloads: number;
  dateStart: string | null;
  dateEnd: string | null;
  lastUpdated: string;
}

interface JournalStats {
  id: number;
  path: string;
  name: string;
  abbreviation: string;
  description: string;
  enabled: boolean;
  totalSubmissions: number;
  publishedArticles: number;
  activeSubmissions: number;
  publishedIssues: number;
}

interface JournalDownloads {
  journalId: number;
  path: string;
  name: string;
  abstractViews: number;
  fileDownloads: number;
  totalViews: number;
}

interface TimelineEntry {
  period: string;
  date: string;
  abstractViews: number;
  fileDownloads: number;
  totalViews: number;
}

interface PublicationWithStats {
  submissionId: number;
  publicationId: number;
  contextId: number;
  status?: number;
  title: string;
  journalPath: string;
  journalName: string;
  sectionId: number;
  sectionName: string;
  datePublished: string | null;
  abstractViews?: number;
  fileDownloads?: number;
  totalViews?: number;
}

interface PaginatedResponse<T> {
  items: T[];
  itemsMax: number;
}

interface YearCount {
  year: number;
  count: number;
}

interface SectionCount {
  sectionId: number;
  sectionName: string;
  count: number;
}

interface Section {
  sectionId: number;
  journalId: number;
  title: string;
  abbreviation: string;
  sequence: number;
  publicationCount: number;
}

interface Issue {
  issueId: number;
  journalId: number;
  title: string;
  volume: string;
  number: string;
  year: number;
  published: boolean;
  datePublished: string | null;
  articleCount: number;
}

interface RoleCount {
  roleId: number;
  roleName: string;
  count: number;
}

interface UsersResponse {
  totalUsers: number;
  byRole: RoleCount[];
  contextId: number | null;
}

interface EditorialResponse {
  submissionsReceived: number;
  submissionsQueued: number;
  submissionsPublished: number;
  submissionsDeclined: number;
  submissionsScheduled: number;
  acceptanceRate: number;
  rejectionRate: number;
  contextId: number | null;
  dateStart: string | null;
  dateEnd: string | null;
}

interface CitationsResponse {
  available: boolean;
  message?: string;
  totalCitations: number;
  publicationsWithCitations?: number;
  citationsByPublication?: any[];
  contextId?: number | null;
}

// Crossref Citation Types
interface CrossrefCitationItem {
  submissionId: number;
  publicationId: number;
  contextId: number;
  title: string;
  doi: string;
  datePublished: string | null;
  citationCount: number;
  citationLastUpdated: string | null;
  citationSource: string | null;
  journalPath: string;
  journalName: string;
}

interface CrossrefCitationSummary {
  totalPublications: number;
  publicationsWithCitations: number;
  totalCitations: number;
  maxCitations: number;
  avgCitations: number;
}

interface CrossrefCitationsResponse {
  items: CrossrefCitationItem[];
  itemsMax: number;
  summary: CrossrefCitationSummary;
  contextId: number | null;
}

interface PublicationWithDOI {
  submissionId: number;
  publicationId: number;
  contextId: number;
  title: string;
  doi: string;
  datePublished: string | null;
  journalPath: string;
}

interface FetchCitationsResult {
  doi: string;
  title: string;
  citationCount?: number;
  status: 'success' | 'fetch_failed' | 'save_failed';
  error?: string;
}

interface FetchCitationsResponse {
  success: boolean;
  message: string;
  processed: number;
  successful: number;
  failed: number;
  results: FetchCitationsResult[];
  log: string[];
}

interface ClearCitationsResponse {
  success: boolean;
  message: string;
  deletedRecords: number;
  contextId: number | null;
}

interface DashboardResponse {
  counts: CountsResponse;
  downloads: DownloadsResponse;
  editorial: EditorialResponse;
  users: UsersResponse;
  topPublications: PublicationWithStats[];
  recentPublications: PublicationWithStats[];
  publicationsByYear: YearCount[];
  publicationsBySection: SectionCount[];
  viewsTimeline: TimelineEntry[];
  lastUpdated: string;
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid API token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Endpoint doesn't exist |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "error": "Error message description",
  "errorCode": "ERROR_CODE",
  "details": {
    "parameter": "Invalid value provided"
  }
}
```

---

## Rate Limiting

Currently, no rate limiting is applied. However, for production deployments, consider implementing:
- Request throttling (e.g., 100 requests/minute)
- Caching of frequently accessed data

---

## Examples

### JavaScript/TypeScript Fetch Examples

```typescript
const API_BASE = 'http://localhost:8000/api/v1/fast-stats';
const API_TOKEN = 'your-api-token';

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

// Get complete dashboard
async function getDashboard(journalId?: number) {
  const params = new URLSearchParams();
  if (journalId) params.append('journalId', journalId.toString());
  
  const response = await fetch(`${API_BASE}/dashboard?${params}`, { headers });
  return response.json();
}

// Get paginated publications with search
async function searchPublications(search: string, page: number = 1) {
  const params = new URLSearchParams({
    searchPhrase: search,
    count: '20',
    offset: ((page - 1) * 20).toString(),
    orderBy: 'total_views',
    orderDirection: 'DESC'
  });
  
  const response = await fetch(`${API_BASE}/publications?${params}`, { headers });
  return response.json();
}

// Get views timeline for last 24 months
async function getViewsTimeline(journalId?: number) {
  const params = new URLSearchParams({
    months: '24',
    timelineInterval: 'month'
  });
  if (journalId) params.append('journalId', journalId.toString());
  
  const response = await fetch(`${API_BASE}/views/timeline?${params}`, { headers });
  return response.json();
}

// Get publications by section for a specific journal
async function getPublicationsBySection(journalId: number) {
  const params = new URLSearchParams({ journalId: journalId.toString() });
  
  const response = await fetch(`${API_BASE}/publications/by-section?${params}`, { headers });
  return response.json();
}

// Get top 10 publications in a date range
async function getTopPublications(dateStart: string, dateEnd: string) {
  const params = new URLSearchParams({
    dateStart,
    dateEnd,
    count: '10'
  });
  
  const response = await fetch(`${API_BASE}/publications/top?${params}`, { headers });
  return response.json();
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface UseFastStatsOptions {
  journalId?: number;
  dateStart?: string;
  dateEnd?: string;
}

function useFastStats(options: UseFastStatsOptions = {}) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (options.journalId) params.append('journalId', options.journalId.toString());
        if (options.dateStart) params.append('dateStart', options.dateStart);
        if (options.dateEnd) params.append('dateEnd', options.dateEnd);

        const response = await fetch(
          `/api/v1/fast-stats/dashboard?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_OJS_API_TOKEN}`
            }
          }
        );

        if (!response.ok) throw new Error('Failed to fetch stats');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.journalId, options.dateStart, options.dateEnd]);

  return { data, loading, error };
}

// Usage
function Dashboard() {
  const { data, loading, error } = useFastStats({ journalId: 1 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Published Articles: {data?.counts.publishedArticles}</p>
      <p>Total Views: {data?.downloads.totalViews}</p>
      <p>Acceptance Rate: {data?.editorial.acceptanceRate}%</p>
    </div>
  );
}
```

### cURL Examples

```bash
# Generate your JWT token first using generate_token.php or OJS UI
JWT="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.YOUR_ENCODED_TOKEN"

# Get dashboard
curl -X GET "http://localhost:8000/tjpsd/api/v1/fast-stats/dashboard?journalId=1" \
  -H "Authorization: Bearer $JWT"

# Get publications with search and pagination
curl -X GET "http://localhost:8000/tjpsd/api/v1/fast-stats/publications?searchPhrase=climate&count=20&offset=0" \
  -H "Authorization: Bearer $JWT"

# Get views timeline by day for last 30 days
curl -X GET "http://localhost:8000/tjpsd/api/v1/fast-stats/views/timeline?timelineInterval=day&months=1" \
  -H "Authorization: Bearer $JWT"

# Get downloads between dates
curl -X GET "http://localhost:8000/tjpsd/api/v1/fast-stats/downloads?dateStart=2024-01-01&dateEnd=2024-06-30" \
  -H "Authorization: Bearer $JWT"

# Get top 5 publications in specific sections
curl -X GET "http://localhost:8000/tjpsd/api/v1/fast-stats/publications/top?count=5&sectionIds=1,2,3" \
  -H "Authorization: Bearer $JWT"
```

**Note:** Replace `tjpsd` with your journal path, and use your actual JWT token.

---

## Installation

1. Copy the `fastStatsApi` folder to `plugins/generic/` in your OJS installation
2. Enable the plugin in Website Settings → Plugins → Generic Plugins
3. The API endpoints will be available at `/api/v1/fast-stats/`

## Portability

This plugin is designed to be portable across OJS installations:
- No core OJS code modifications required
- Self-contained with all dependencies
- Compatible with OJS 3.3.0+
- Uses standard OJS database schema

---

## Changelog

### Version 1.0.0.0
- Initial release
- 17 optimized API endpoints
- Comprehensive filtering support
- TypeScript interface definitions


# Citation Fetching Service - Guide

## 📖 Overview

The Fast Stats API plugin includes **two citation services** that pull citation counts from external sources:

1. **Crossref API** - For publications **with DOIs** (most accurate)
2. **OpenAlex API** - For publications **without DOIs** (uses title matching)

Citation data is stored in the `fast_stats_citation_counts` database table and cached for fast retrieval.

---

## 🔄 How It Works

### Automatic Mode (Scheduled Task)

The plugin automatically fetches citations **daily at 3 AM** when the scheduled task is enabled.

**Configuration:** `scheduledTasks.xml`
```xml
<task class="plugins.generic.fastStatsApi.classes.CrossrefCitationTask">
  <frequency hour="3" />
  <args>
    <arg>admin@yourjournal.org</arg>  <!-- Your email for polite pool -->
    <arg>50</arg>                      <!-- Batch size: 50 publications per run -->
  </args>
</task>
```

**To Enable Automatic Fetching:**

**Option 1: Using Acron Plugin (Easiest)**
```
1. In OJS Admin → Plugins → Generic Plugins
2. Enable "Acron Plugin"
3. Done! Tasks run automatically on page visits
```

**Option 2: Using System Cron**
```bash
# Add to crontab (Linux/Mac)
0 * * * * php /path/to/ojs/tools/runScheduledTasks.php plugins/generic/fastStatsApi/scheduledTasks.xml

# Or Windows Task Scheduler
php C:\path\to\ojs\tools\runScheduledTasks.php plugins/generic/fastStatsApi/scheduledTasks.xml
```

---

## 🚀 Manual Activation

### Method 1: Via API Endpoint (Recommended)

You can trigger citation fetching manually using the API endpoints.

#### Fetch from Crossref (for DOIs)

```powershell
# PowerShell
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch?limit=100&email=your@email.com" `
  -Headers @{Authorization="Bearer YOUR_JWT_TOKEN"}
```

```bash
# Bash/cURL
curl -X POST "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch?limit=100&email=your@email.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `onlyMissing` | `true` | Only fetch for publications without citation data |
| `limit` | `100` | Max publications to process (max: 500) |
| `email` | `null` | Your email for Crossref polite pool (recommended) |
| `journalId` | `null` | Limit to specific journal |

**Response:**
```json
{
  "success": true,
  "message": "Processed 100 publications",
  "processed": 100,
  "successful": 95,
  "failed": 5,
  "results": [
    {
      "doi": "10.1234/example.001",
      "title": "Article Title",
      "citationCount": 15,
      "status": "success"
    }
  ],
  "log": [
    "SUCCESS: DOI 10.1234/example.001 has 15 citations"
  ]
}
```

#### Fetch from OpenAlex (for publications without DOIs)

```powershell
# PowerShell
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch-openalex?limit=50&email=your@email.com" `
  -Headers @{Authorization="Bearer YOUR_JWT_TOKEN"}
```

**Parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `onlyMissing` | `true` | Only fetch for publications without citation data |
| `limit` | `50` | Max publications to process (max: 200) |
| `email` | `null` | Your email for OpenAlex API |
| `includeWithDoi` | `false` | Also search publications that have DOIs |
| `journalId` | `null` | Limit to specific journal |

---

### Method 2: Via Command Line

Run the scheduled task manually from the command line:

```bash
# Navigate to OJS directory
cd /path/to/ojs

# Run the scheduled task
php tools/runScheduledTasks.php plugins/generic/fastStatsApi/scheduledTasks.xml
```

```powershell
# Windows PowerShell
cd C:\path\to\ojs
php tools\runScheduledTasks.php plugins\generic\fastStatsApi\scheduledTasks.xml
```

---

## 🎯 Step-by-Step: First Time Setup

### Complete Citation Fetch Process

```powershell
# 1. Get your API token first
$token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.YOUR_TOKEN_HERE"
$email = "admin@yourjournal.com"
$baseUrl = "http://localhost:8000/tjpsd/api/v1/fast-stats"

# 2. Check which publications have DOIs
$pubsWithDois = Invoke-RestMethod -Uri "$baseUrl/citations/dois" `
  -Headers @{Authorization="Bearer $token"}
Write-Host "Publications with DOIs: $($pubsWithDois.itemsMax)"

# 3. Fetch Crossref citations for publications with DOIs
Write-Host "Fetching Crossref citations..."
$crossrefResult = Invoke-RestMethod -Method POST `
  -Uri "$baseUrl/citations/fetch?limit=200&email=$email" `
  -Headers @{Authorization="Bearer $token"}
Write-Host "Crossref: $($crossrefResult.successful) successful, $($crossrefResult.failed) failed"

# 4. Check publications without DOIs
$pubsWithoutDois = Invoke-RestMethod -Uri "$baseUrl/citations/no-doi" `
  -Headers @{Authorization="Bearer $token"}
Write-Host "Publications without DOIs: $($pubsWithoutDois.itemsMax)"

# 5. Fetch OpenAlex citations for publications without DOIs
Write-Host "Fetching OpenAlex citations..."
$openalexResult = Invoke-RestMethod -Method POST `
  -Uri "$baseUrl/citations/fetch-openalex?limit=50&email=$email" `
  -Headers @{Authorization="Bearer $token"}
Write-Host "OpenAlex: $($openalexResult.found) found, $($openalexResult.notFound) not found"

# 6. View all citations
$allCitations = Invoke-RestMethod -Uri "$baseUrl/citations/all" `
  -Headers @{Authorization="Bearer $token"}
Write-Host "Total citations indexed: $($allCitations.summary.totalCitations)"
Write-Host "Publications with citations: $($allCitations.summary.publicationsWithCitations)"
```

---

## 📊 View Citation Data

### Get All Citations

```powershell
GET /api/v1/fast-stats/citations/all
```

**Parameters:**
- `count` - Number of results (default: 50)
- `offset` - Pagination offset
- `orderBy` - Sort by: `citation_count`, `last_updated`, `title`, `date_published`
- `orderDirection` - `ASC` or `DESC`

**Example:**
```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/all?orderBy=citation_count&orderDirection=DESC&count=20" `
  -Headers @{Authorization="Bearer $token"}
```

### Get Summary Statistics

```powershell
GET /api/v1/fast-stats/citations
```

**Response:**
```json
{
  "available": true,
  "totalCitations": 1250,
  "publicationsWithCitations": 180,
  "lastUpdated": "2026-02-14 14:30:00"
}
```

---

## 🔧 Advanced Options

### Clear Citation Cache (Before Refresh)

```powershell
# Clear all citations
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/clear" `
  -Headers @{Authorization="Bearer $token"}

# Then fetch fresh data
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch?limit=500" `
  -Headers @{Authorization="Bearer $token"}
```

### Fetch Only Missing Citations

```powershell
# Only fetch for publications that don't have citation data yet
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch?onlyMissing=true" `
  -Headers @{Authorization="Bearer $token"}
```

### Force Update All Citations

```powershell
# Fetch for all publications, even those with existing data
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch?onlyMissing=false&limit=500" `
  -Headers @{Authorization="Bearer $token"}
```

---

## ⚙️ Rate Limits & Best Practices

### Crossref API
- **Default limit:** 50 requests/second
- **With polite pool (email):** Higher limits + priority queue
- **Built-in delay:** 100ms between requests (10/second) for safety
- **Best practice:** Always provide your email in requests

### OpenAlex API
- **Default limit:** ~10 requests/second
- **With polite pool (email):** 100 requests/second
- **Built-in delay:** 100ms between requests
- **Best practice:** 
  - Use for publications without DOIs only
  - Provide email for better rate limits
  - Title matching requires at least 10 characters

### Recommendations
1. **Provide your email** - Gets you into the "polite pool" with better limits
2. **Use scheduled tasks** - Automatic daily updates are better than bulk fetching
3. **Fetch Crossref first** - More accurate for DOI-based articles
4. **OpenAlex as backup** - Only for articles without DOIs
5. **Monitor rate limits** - The plugin respects rate limits automatically

---

## 📝 Example Workflow

### Initial Setup (One-time)

```powershell
# 1. Fetch all Crossref citations (publications with DOIs)
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch?limit=500&email=admin@journal.com" `
  -Headers @{Authorization="Bearer $token"}

# 2. Fetch OpenAlex citations (publications without DOIs)
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch-openalex?limit=100&email=admin@journal.com" `
  -Headers @{Authorization="Bearer $token"}

# 3. View results
Invoke-RestMethod `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/all" `
  -Headers @{Authorization="Bearer $token"}
```

### Monthly Refresh

```powershell
# Update only new publications (onlyMissing=true)
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch?onlyMissing=true" `
  -Headers @{Authorization="Bearer $token"}
```

### Complete Refresh (Annual)

```powershell
# 1. Clear cache
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/clear" `
  -Headers @{Authorization="Bearer $token"}

# 2. Fetch all citations again
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:8000/tjpsd/api/v1/fast-stats/citations/fetch?limit=500&onlyMissing=false" `
  -Headers @{Authorization="Bearer $token"}
```

---

## 🐛 Troubleshooting

### Citations Not Appearing

1. **Check if publications have DOIs:**
   ```powershell
   GET /api/v1/fast-stats/citations/dois
   ```

2. **Check for publications without DOIs:**
   ```powershell
   GET /api/v1/fast-stats/citations/no-doi
   ```

3. **Check citation fetch logs in response**

### Rate Limit Errors

- **Symptom:** "429 Too Many Requests" errors
- **Solution:** 
  - Add your email to requests
  - Reduce batch size (use smaller `limit`)
  - Wait a few minutes between batches

### No Citations Found

- **For Crossref:** Check if DOI is valid and exists in Crossref
- **For OpenAlex:** Check if title is at least 10 characters and publication is indexed

---

## 📧 Contact Information

When using the APIs, it's **highly recommended** to provide your email:

```powershell
# Good - with email
?email=admin@yourjournal.org

# Less good - without email (slower, lower limits)
```

**Why provide email?**
- ✅ Gets you into "polite pool" with higher rate limits
- ✅ Priority access during high traffic
- ✅ API providers can contact you if issues arise
- ✅ Shows you're using the API responsibly

---

## 🎯 Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/citations/fetch` | POST | Fetch Crossref citations (DOIs) |
| `/citations/fetch-openalex` | POST | Fetch OpenAlex citations (titles) |
| `/citations/all` | GET | View all citations |
| `/citations/dois` | GET | List publications with DOIs |
| `/citations/no-doi` | GET | List publications without DOIs |
| `/citations/clear` | POST | Clear citation cache |
| `/citations` | GET | Get citation summary |

---

**Last Updated:** February 14, 2026  
**Version:** 1.1.0
