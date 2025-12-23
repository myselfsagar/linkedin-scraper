# LinkedIn Company & Profile Scraper

A small Node.js tool to extract **publicly visible data** from LinkedIn company and profile pages.

This project focuses on **practical scraping design** for a highly dynamic, authenticated platform rather than aggressive data extraction.

---

## What it does

- Scrapes employee names and profile URLs from a LinkedIn company page
- Scrapes basic public information from a LinkedIn profile
- Uses Playwright to handle JavaScript-heavy pages
- Works with authenticated session cookies (no login automation)
- Outputs JSON
- Optional CSV export

---

## Tech Stack

- Node.js
- JavaScript
- Playwright

---

## Setup

```bash
npm install
npx playwright install
```

## Authentication

- LinkedIn requires login.
- This project uses pre-authenticated session cookies.
- Export cookies from a logged-in browser session and save them as: cookies/linkedin-cookies.json
- No credentials are stored or automated.

## Usage

### Company page

```bash
npm run company -- <company-url>
```

### Profile page

```bash
npm run profile -- <profile-url>
```

## CSV Export

- Creates CSV files in the output/ directory.
- CSV generation is done after scraping and does not affect the scraping logic.

```bash
npm run company -- <url> --csv
npm run profile -- <url> --csv
```

## Notes & Limitations

- Only publicly visible data is extracted
- Some company pages do not expose employee listings
- Missing fields are returned as null
- For higher volumes (e.g., ~10,000 profiles/day), this scraper would be executed via multiple worker processes with controlled concurrency and rate limits per session.

## Author

Sagar Sahu  
LinkedIn: https://www.linkedin.com/in/myselfsagar/
