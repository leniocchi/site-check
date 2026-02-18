# Site Check

A web-based analysis tool that automatically audits any public website for **accessibility**, **privacy**, and **security** issues — all in one place.

---

## Table of Contents

- [Site Check](#site-check)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Screenshots](#screenshots)
    - [Home](#home)
    - [Report Overview](#report-overview)
    - [Detailed Results](#detailed-results)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the project](#running-the-project)
  - [API](#api)
    - [Check a URL](#check-a-url)
  - [Project Structure](#project-structure)
  - [Notes](#notes)
  - [License](#license)

---

## Features

**Accessibility**
- Lighthouse – Performance, Accessibility & Best Practices scoring
- axe-core – WCAG 2.1 violation detection
- Pa11y – WCAG2AA compliance testing

**Privacy**
- Cookie Scanner – detects session, persistent and third-party cookies
- Tracker Detection – identifies known trackers (Google Analytics, Facebook, Hotjar and more)

**Security**
- CSP Evaluator – checks for missing or misconfigured Content Security Policy headers
- Mozilla Observatory – evaluates HTTP security headers (HSTS, X-Frame-Options, etc.)
- SSL Certificate Check – validates certificate validity and expiry

---

## Screenshots

### Home
![Home](/frontend/public/screen_1.png)

### Report Overview
![Report Overview](/frontend/public/donut.png)

### Detailed Results
![Detailed Results](/frontend/public/screen_3.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue.js 3, Vuetify, Chart.js |
| Backend | Node.js, Express.js |
| Browser Automation | Puppeteer, chrome-launcher |
| Accessibility | Lighthouse, axe-core, Pa11y |
| Security | Mozilla Observatory API, custom SSL/CSP checks |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)
- Google Chrome or Chromium (required for Puppeteer and Lighthouse)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/lenniocchi/site-check.git
cd site-check
```

**2. Install root dependencies**

```bash
npm install
```

**3. Install backend dependencies**

```bash
cd backend
npm install
cd ..
```

**4. Install frontend dependencies**

```bash
cd frontend
npm install
cd ..
```

### Running the project

Start both frontend and backend with a single command from the root directory:

```bash
npm start
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |

---

## API

### Check a URL

```http
POST /api/check
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response**

```json
{
  "url": "https://example.com",
  "scores": {
    "accessibility": 78,
    "privacy": 60,
    "security": 85
  },
  "accessibility": {
    "lighthouse": { "score": 82, "message": "...", "details": [] },
    "axe": { "score": 74, "message": "...", "details": [] },
    "pa11y": { "score": 78, "message": "...", "details": [] }
  },
  "privacy": {
    "cookies": { "score": 65, "message": "...", "details": [] },
    "trackers": { "score": 55, "message": "...", "details": [] }
  },
  "security": {
    "csp": { "score": 80, "message": "...", "details": [] },
    "observatory": { "score": 90, "message": "...", "details": [] },
    "ssl": { "score": 100, "message": "...", "details": [] }
  }
}
```

---

## Project Structure

```
site-check/
├── backend/
│   └── src/
│       ├── checks/
│       │   ├── accessibility/
│       │   │   ├── lighthouse.js
│       │   │   ├── axe.js
│       │   │   └── pa11y.js
│       │   ├── privacy/
│       │   │   ├── cookies.js
│       │   │   └── tracker.js
│       │   └── security/
│       │       ├── csp.js
│       │       ├── observatory.js
│       │       └── ssllabs.js
│       ├── routes/
│       │   └── api.js
│       └── index.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── UrlChecker.vue
│       │   ├── ReportView.vue
│       │   ├── DonutChart.vue
│       │   └── ToolAccordion.vue
│       ├── App.vue
│       └── main.js
└── package.json
```

---

## Notes

- Scans run **sequentially** to avoid conflicts between multiple headless browser instances. A full scan typically takes **30–60 seconds** depending on the target website.
- The tool only works with **publicly accessible URLs**.
- Some websites may block automated requests, which can result in failed checks for individual tools.

---

## License

MIT

[def]: #site-check