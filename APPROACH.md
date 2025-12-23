# Technical Approach

## Overview

The goal was to build a small scraper that works reliably on LinkedIn, a platform that is both **dynamic and protected**.

The focus is on:

- Correct handling of authentication
- Defensive scraping
- Clean, maintainable code

---

## Tools & Reasoning

- **Node.js + Playwright**
- Playwright is used because LinkedIn is a JavaScript-heavy SPA
- HTTP-only scraping would not be reliable here

---

## Authentication

LinkedIn content requires login.

Instead of automating credentials, the scraper:

- Uses pre-authenticated session cookies
- Injects them into the Playwright browser context

This avoids MFA issues and reflects how authenticated scraping is handled in practice.

---

## Company Page Scraping

- Navigates to the company’s **People** section
- Scrolls the internal employee container to trigger lazy loading
- Extracts employee names and profile URLs using stable `/in/` links
- Limits extraction to a small number of employees for demo purposes

If a company does not publicly expose employees, the scraper returns an empty list instead of failing.

---

## Profile Page Scraping

- Waits for the profile name (`<h1>`) to appear
- Extracts basic public information such as name, headline, location, and connections
- Uses minimal, defensive selectors to reduce breakage

---

## Rate Limiting & Stability

- Sequential execution
- Small delays between actions
- No parallel tabs or aggressive requests

This helps avoid detection and improves stability.

---

## Error Handling

- Missing elements return `null`
- Timeouts are handled gracefully
- The scraper exits cleanly on authentication or page structure issues

---

## Bonus: CSV Export

Scraped data can optionally be exported to CSV using a command-line flag.  
This is implemented as a post-processing step and does not affect scraping behavior.

---

## Summary

This solution prioritizes **reliability, clarity, and real-world constraints** over aggressive scraping.  
It demonstrates a practical approach to working with an authenticated, fast-changing platform like LinkedIn.
