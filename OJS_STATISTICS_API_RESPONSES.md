# OJS Statistics API - Complete Response Documentation

Complete reference for all response formats from OJS Statistics and Metrics APIs.

---

## Table of Contents

1. [Publication Statistics API](#1-publication-statistics-api)
2. [Editorial Statistics API](#2-editorial-statistics-api)
3. [User Statistics API](#3-user-statistics-api)
4. [Context/Journals API](#4-contextjournals-api)
5. [Common Response Patterns](#5-common-response-patterns)
6. [Error Responses](#6-error-responses)

---

## 1. PUBLICATION STATISTICS API

### 1.1 GET Multiple Publications Stats
**Endpoint:** `GET /api/v1/stats/publications`

#### Response Structure:
```json
{
  "items": [
    {
      "abstractViews": 245,
      "galleyViews": 189,
      "pdfViews": 150,
      "htmlViews": 30,
      "otherViews": 9,
      "publication": {
        "id": 123,
        "_href": "http://localhost:8000/index.php/tjpsd/api/v1/submissions/123",
        "urlWorkflow": "http://localhost:8000/index.php/tjpsd/workflow/access/123",
        "urlPublished": "http://localhost:8000/index.php/tjpsd/article/view/123",
        "authorsStringShort": "Smith et al.",
        "fullTitle": "Complete Article Title Here"
      }
    }
  ],
  "itemsMax": 45
}
```

#### Field Descriptions:

| Field | Type | Description |
|-------|------|-------------|
| `items` | Array | Array of publication statistic objects |
| `abstractViews` | Integer | Total number of abstract page views |
| `galleyViews` | Integer | Total downloads/views of all file formats |
| `pdfViews` | Integer | Downloads of PDF files only |
| `htmlViews` | Integer | Views of HTML galleys only |
| `otherViews` | Integer | Views of other formats (EPUB, XML, etc.) |
| `publication.id` | Integer | Unique submission/publication ID |
| `publication._href` | String | API URL to retrieve full submission details |
| `publication.urlWorkflow` | String | URL to editorial workflow (for editors) |
| `publication.urlPublished` | String | Public URL to view the article |
| `publication.authorsStringShort` | String | Abbreviated author list (e.g., "Smith et al.") |
| `publication.fullTitle` | String | Complete article title |
| `itemsMax` | Integer | Total count of publications matching the query |

#### Empty Result:
```json
{
  "items": [],
  "itemsMax": 0
}
```

---

### 1.2 GET Publications Abstract Views Timeline
**Endpoint:** `GET /api/v1/stats/publications/abstract`

#### Response Structure (Monthly):
```json
[
  {
    "date": "2025-01",
    "value": 1250
  },
  {
    "date": "2025-02",
    "value": 980
  },
  {
    "date": "2025-03",
    "value": 1105
  }
]
```

#### Response Structure (Daily):
```json
[
  {
    "date": "2025-02-01",
    "value": 45
  },
  {
    "date": "2025-02-02",
    "value": 52
  },
  {
    "date": "2025-02-03",
    "value": 38
  }
]
```

#### Field Descriptions:

| Field | Type | Description |
|-------|------|-------------|
| `date` | String | Date in YYYY-MM format (monthly) or YYYY-MM-DD (daily) |
| `value` | Integer | Total abstract views for that time period |

#### Empty Result (No Data):
```json
[]
```

---

### 1.3 GET Publications Galley Views Timeline
**Endpoint:** `GET /api/v1/stats/publications/galley`

**Response:** Same format as Abstract Views Timeline (see 1.2)

The `value` represents total file downloads/views for all galleys (PDF, HTML, etc.)

---

### 1.4 GET Single Publication Stats
**Endpoint:** `GET /api/v1/stats/publications/{submissionId}`

#### Response Structure:
```json
{
  "abstractViews": 245,
  "galleyViews": 189,
  "pdfViews": 150,
  "htmlViews": 30,
  "otherViews": 9,
  "publication": {
    "id": 123,
    "_href": "http://localhost:8000/index.php/tjpsd/api/v1/submissions/123",
    "authorsStringShort": "Smith et al.",
    "fullTitle": "Complete Article Title Here"
  }
}
```

**Note:** Same structure as items in the multiple publications response, but returns a single object instead of an array.

---

### 1.5 GET Single Publication Abstract Timeline
**Endpoint:** `GET /api/v1/stats/publications/{submissionId}/abstract`

**Response:** Same format as 1.2 (timeline array), but filtered to one publication

---

### 1.6 GET Single Publication Galley Timeline
**Endpoint:** `GET /api/v1/stats/publications/{submissionId}/galley`

**Response:** Same format as 1.2 (timeline array), but filtered to one publication

---

## 2. EDITORIAL STATISTICS API

### 2.1 GET Editorial Overview
**Endpoint:** `GET /api/v1/stats/editorial`

#### Response Structure:
```json
[
  {
    "key": "submissionsReceived",
    "name": "Submissions Received",
    "value": 125
  },
  {
    "key": "submissionsAccepted",
    "name": "Submissions Accepted",
    "value": 45
  },
  {
    "key": "submissionsDeclined",
    "name": "Submissions Declined",
    "value": 30
  },
  {
    "key": "submissionsPublished",
    "name": "Submissions Published",
    "value": 42
  },
  {
    "key": "daysToDecision",
    "name": "Days to Decision (Average)",
    "value": 45.5
  },
  {
    "key": "daysToAccept",
    "name": "Days to Accept (Average)",
    "value": 89.2
  },
  {
    "key": "daysToReject",
    "name": "Days to Reject (Average)",
    "value": 23.7
  }
]
```

#### Field Descriptions:

| Field | Type | Description |
|-------|------|-------------|
| `key` | String | Unique identifier for the metric |
| `name` | String | Human-readable localized label |
| `value` | Integer/Float | Metric value (count or average days) |

#### Available Metrics:

| Key | Description | Value Type |
|-----|-------------|------------|
| `submissionsReceived` | Total new submissions | Integer |
| `submissionsAccepted` | Submissions accepted for publication | Integer |
| `submissionsDeclined` | Submissions rejected/declined | Integer |
| `submissionsPublished` | Submissions actually published | Integer |
| `daysToDecision` | Average days from submission to any decision | Float |
| `daysToAccept` | Average days from submission to acceptance | Float |
| `daysToReject` | Average days from submission to rejection | Float |

#### Empty Result:
```json
[]
```

---

### 2.2 GET Editorial Averages
**Endpoint:** `GET /api/v1/stats/editorial/averages`

#### Response Structure:
```json
{
  "submissionsReceivedPerYear": 52.3,
  "submissionsAcceptedPerYear": 18.7,
  "submissionsDeclinedPerYear": 12.4,
  "submissionsPublishedPerYear": 17.2
}
```

#### Field Descriptions:

| Field | Type | Description |
|-------|------|-------------|
| `submissionsReceivedPerYear` | Float | Average number of submissions received per year |
| `submissionsAcceptedPerYear` | Float | Average number of submissions accepted per year |
| `submissionsDeclinedPerYear` | Float | Average number of submissions declined per year |
| `submissionsPublishedPerYear` | Float | Average number of submissions published per year |

#### Empty/No Data Result:
```json
{
  "submissionsReceivedPerYear": 0,
  "submissionsAcceptedPerYear": 0,
  "submissionsDeclinedPerYear": 0,
  "submissionsPublishedPerYear": 0
}
```

---

## 3. USER STATISTICS API

### 3.1 GET User Role Overview
**Endpoint:** `GET /api/v1/stats/users`

#### Response Structure:
```json
[
  {
    "key": "reader",
    "name": "Reader",
    "value": 450
  },
  {
    "key": "author",
    "name": "Author",
    "value": 125
  },
  {
    "key": "reviewer",
    "name": "Reviewer",
    "value": 67
  },
  {
    "key": "editor",
    "name": "Editor",
    "value": 12
  },
  {
    "key": "sectionEditor",
    "name": "Section Editor",
    "value": 8
  },
  {
    "key": "manager",
    "name": "Journal Manager",
    "value": 3
  }
]
```

#### Field Descriptions:

| Field | Type | Description |
|-------|------|-------------|
| `key` | String | Role identifier (internal key) |
| `name` | String | Localized role name |
| `value` | Integer | Count of users with this role |

#### Available Roles:

| Key | Typical Name | Description |
|-----|-------------|-------------|
| `reader` | Reader | Registered readers |
| `author` | Author | Users who can submit articles |
| `reviewer` | Reviewer | Users assigned as reviewers |
| `editor` | Editor | Editorial board members |
| `sectionEditor` | Section Editor | Editors for specific sections |
| `manager` | Journal Manager | Journal administrators |

**Note:** Users can have multiple roles, so the totals may exceed the total number of users.

#### Empty Result:
```json
[]
```

---

## 4. CONTEXT/JOURNALS API

### 4.1 GET All Contexts (Journals)
**Endpoint:** `GET /api/v1/_context`

#### Response Structure:
```json
{
  "itemsMax": 2,
  "items": [
    {
      "id": 1,
      "urlPath": "tjpsd",
      "name": {
        "en_US": "The Journal of Public Service and Development",
        "fr_CA": "Revue du service public et du développement"
      },
      "description": {
        "en_US": "<p>A leading journal in public service research...</p>",
        "fr_CA": "<p>Une revue de premier plan...</p>"
      },
      "enabled": true,
      "url": "http://localhost:8000/index.php/tjpsd",
      "about": {
        "en_US": "<p>About the journal...</p>"
      },
      "contactName": "Editorial Office",
      "contactEmail": "editor@tjpsd.com",
      "supportEmail": "support@tjpsd.com",
      "abbreviation": {
        "en_US": "TJPSD"
      },
      "printIssn": "1234-5678",
      "onlineIssn": "2345-6789",
      "publisherInstitution": "University Press",
      "numAnnouncementsHomepage": 3,
      "themePluginPath": "default"
    },
    {
      "id": 2,
      "urlPath": "ter",
      "name": {
        "en_US": "Technology and Education Review"
      },
      "description": {
        "en_US": "<p>Exploring educational technology...</p>"
      },
      "enabled": true,
      "url": "http://localhost:8000/index.php/ter",
      "contactEmail": "editor@ter.com",
      "onlineIssn": "3456-7890"
    }
  ]
}
```

#### Field Descriptions:

| Field | Type | Description |
|-------|------|-------------|
| `itemsMax` | Integer | Total number of contexts |
| `items` | Array | Array of context objects |
| `id` | Integer | Unique journal ID |
| `urlPath` | String | URL path segment (use in API calls) |
| `name` | Object | Journal name in multiple locales |
| `description` | Object | Journal description (may contain HTML) |
| `enabled` | Boolean | Whether journal is active/published |
| `url` | String | Full URL to journal homepage |
| `about` | Object | About text in multiple locales |
| `contactName` | String | Name of primary contact |
| `contactEmail` | String | Primary contact email |
| `supportEmail` | String | Support/technical contact email |
| `abbreviation` | Object | Journal abbreviation |
| `printIssn` | String | Print ISSN (if applicable) |
| `onlineIssn` | String | Online ISSN |
| `publisherInstitution` | String | Publishing institution name |
| `numAnnouncementsHomepage` | Integer | Number of announcements to show |
| `themePluginPath` | String | Active theme identifier |

#### Minimal Response (Some Fields Optional):
```json
{
  "itemsMax": 1,
  "items": [
    {
      "id": 1,
      "urlPath": "journal",
      "name": {
        "en_US": "My Journal"
      },
      "enabled": true,
      "url": "http://localhost:8000/index.php/journal"
    }
  ]
}
```

#### Empty Result:
```json
{
  "itemsMax": 0,
  "items": []
}
```

---

### 4.2 GET Single Context
**Endpoint:** `GET /api/v1/_context/{contextId}`

**Response:** Returns a single context object (same structure as items in 4.1, but with more detailed fields)

---

## 5. COMMON RESPONSE PATTERNS

### 5.1 Pagination Structure
Many endpoints support pagination with this query pattern:

**Query Parameters:**
- `count`: Number of items per page (max 100)
- `offset`: Starting position (0-based)

**Response includes:**
- `items`: Array of results
- `itemsMax`: Total available items

**Example:**
```javascript
// Get items 20-40
fetch('/api/v1/stats/publications?count=20&offset=20')
```

---

### 5.2 Localized Fields
Fields like `name`, `description`, `about` are objects with locale keys:

```json
{
  "name": {
    "en_US": "English Name",
    "fr_CA": "Nom français",
    "es_ES": "Nombre español"
  }
}
```

**Accessing in Code:**
```javascript
const name = journal.name['en_US'] || Object.values(journal.name)[0];
```

---

### 5.3 Date Formats

**Input (Query Parameters):**
- Format: `YYYY-MM-DD`
- Example: `dateStart=2026-01-15`

**Output (Response):**
- Monthly timeline: `YYYY-MM` (e.g., `"2026-01"`)
- Daily timeline: `YYYY-MM-DD` (e.g., `"2026-01-15"`)

---

### 5.4 Null/Missing Values

**Scenarios:**
1. **No data available:** Returns empty array `[]` or zero values
2. **Field not set:** Field may be omitted or `null`
3. **No permissions:** Returns error instead of empty data

**Example - No Stats:**
```json
{
  "items": [],
  "itemsMax": 0
}
```

---

## 6. ERROR RESPONSES

### 6.1 Standard Error Format
```json
{
  "error": "error.key.identifier",
  "errorMessage": "Human readable error message"
}
```

### 6.2 Common Errors

#### 400 Bad Request - Invalid Date Format
```json
{
  "error": "api.stats.400.wrongDateFormat",
  "errorMessage": "The date must be in the format YYYY-MM-DD."
}
```

#### 400 Bad Request - Invalid Order Direction
```json
{
  "error": "api.stats.400.invalidOrderDirection",
  "errorMessage": "Order direction must be ASC or DESC."
}
```

#### 400 Bad Request - Invalid Timeline Interval
```json
{
  "error": "api.stats.400.wrongTimelineInterval",
  "errorMessage": "Timeline interval must be day or month."
}
```

#### 401 Unauthorized
```json
{
  "error": "api.401.unauthorized",
  "errorMessage": "You are not authorized to access this resource."
}
```

#### 403 Forbidden - No Context
```json
{
  "error": "user.authorization.noContext",
  "errorMessage": "No journal in context!"
}
```

#### 403 Forbidden - Insufficient Permissions
```json
{
  "error": "api.403.forbidden",
  "errorMessage": "You do not have permission to access this resource."
}
```

#### 404 Not Found - Resource
```json
{
  "error": "api.404.resourceNotFound",
  "errorMessage": "The requested resource was not found."
}
```

#### 404 Not Found - Context
```json
{
  "error": "api.contexts.404.contextNotFound",
  "errorMessage": "The requested journal was not found."
}
```

#### 500 Internal Server Error - Missing API Secret
```json
{
  "error": "api.500.apiSecretKeyMissing",
  "errorMessage": "The API secret key is not configured in config.inc.php"
}
```

---

## 7. TYPESCRIPT INTERFACES

For TypeScript users, here are complete interface definitions:

```typescript
// Publication Statistics
interface PublicationStats {
  items: PublicationStatsItem[];
  itemsMax: number;
}

interface PublicationStatsItem {
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
    fullTitle: string;
  };
}

// Timeline Data
interface TimelineData {
  date: string; // YYYY-MM or YYYY-MM-DD
  value: number;
}

// Editorial Statistics
interface EditorialStats {
  key: string;
  name: string;
  value: number;
}

interface EditorialAverages {
  submissionsReceivedPerYear: number;
  submissionsAcceptedPerYear: number;
  submissionsDeclinedPerYear: number;
  submissionsPublishedPerYear: number;
}

// User Statistics
interface UserRoleStats {
  key: string;
  name: string;
  value: number;
}

// Context/Journal
interface Context {
  id: number;
  urlPath: string;
  name: LocalizedString;
  description?: LocalizedString;
  enabled: boolean;
  url: string;
  about?: LocalizedString;
  contactName?: string;
  contactEmail?: string;
  supportEmail?: string;
  abbreviation?: LocalizedString;
  printIssn?: string;
  onlineIssn?: string;
  publisherInstitution?: string;
  numAnnouncementsHomepage?: number;
  themePluginPath?: string;
}

interface LocalizedString {
  [locale: string]: string;
}

interface ContextCollection {
  itemsMax: number;
  items: Context[];
}

// Error Response
interface APIError {
  error: string;
  errorMessage: string;
}
```

---

## 8. COMPLETE REQUEST/RESPONSE EXAMPLES

### Example 1: Get Top 10 Publications with Stats

**Request:**
```javascript
fetch('http://localhost:8000/index.php/tjpsd/api/v1/stats/publications?count=10&orderDirection=DESC', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
```

**Response:** See section 1.1

---

### Example 2: Get Monthly Abstract Views for Last Year

**Request:**
```javascript
const dateStart = '2025-01-01';
const dateEnd = '2026-01-31';
fetch(`http://localhost:8000/index.php/tjpsd/api/v1/stats/publications/abstract?timelineInterval=month&dateStart=${dateStart}&dateEnd=${dateEnd}`, {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
```

**Response:** See section 1.2

---

### Example 3: Get Editorial Overview

**Request:**
```javascript
fetch('http://localhost:8000/index.php/tjpsd/api/v1/stats/editorial', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
```

**Response:** See section 2.1

---

### Example 4: Get All Journals

**Request:**
```javascript
fetch('http://localhost:8000/api/v1/_context', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
})
```

**Response:** See section 4.1

---

## 9. WORKING WITH THE DATA

### Calculate Total Views
```javascript
const totalViews = stats.items.reduce((sum, item) => 
  sum + item.abstractViews + item.galleyViews, 0
);
```

### Get Most Popular Article
```javascript
const mostPopular = stats.items.reduce((max, item) => 
  item.abstractViews > max.abstractViews ? item : max
, stats.items[0]);
```

### Format Timeline for Charts
```javascript
const chartData = timeline.map(point => ({
  x: new Date(point.date),
  y: point.value
}));
```

### Extract Localized Text
```javascript
function getLocalizedText(obj, locale = 'en_US') {
  if (typeof obj === 'string') return obj;
  return obj?.[locale] || obj?.['en_US'] || Object.values(obj || {})[0] || '';
}

const journalName = getLocalizedText(journal.name);
```

---

## 10. NOTES AND BEST PRACTICES

1. **Always include date ranges** for better performance
2. **Pagination:** Use `count` and `offset` for large datasets
3. **Check `itemsMax`** to determine if there are more results
4. **Handle empty arrays** - APIs return `[]` when no data exists
5. **Timeline intervals:** Use `month` for overview, `day` for detailed analysis
6. **User counts may overlap** - users can have multiple roles
7. **Disabled journals** are excluded from most responses unless you're a Site Admin
8. **All counts are cumulative** unless filtered by date range
9. **Cache responses** when possible - statistics don't change frequently
10. **Rate limiting:** OJS doesn't enforce strict limits, but be reasonable

---

**Last Updated:** February 14, 2026  
**OJS Version:** 3.3.0+  
**API Version:** v1
