# HTTP URL Shortener Microservice Design Document

## Overview
This microservice provides URL shortening with analytics, built using Node.js, Express.js, and TypeScript.

## Architecture
- **Microservice**: Single Express.js server handling `POST /shorturls`, `GET /:shortcode`, and `GET /shorturls/:shortcode`.
- **Storage**: In-memory object (`urlStore`) due to time constraints and lack of MongoDB setup.
- **Shortcode Generation**: Uses `nanoid` for 5-character unique codes; custom shortcodes are validated.
- **Logging**: Placeholder for logging middleware due to test server 401 errors.
- **Error Handling**: Uses HTTP status codes (400, 404, 409, 410, 500) with JSON responses.

## Data Model
- **Url Object**:
  - `originalUrl`: String, validated with `new URL`.
  - `shortcode`: String, unique.
  - `shortLink`: String, derived from `HOSTNAME/shortcode`.
  - `createdAt`: Date, defaults to now.
  - `expiry`: Date, defaults to 30 minutes.
  - `clicks`: Array of `{ timestamp: Date, referrer: String, location: String }`.

## Technology Choices
- **Node.js/Express.js**: Lightweight for RESTful APIs.
- **TypeScript**: Ensures type safety.
- **nanoid**: Generates compact, unique shortcodes.
- **dotenv**: Manages environment variables.

## Assumptions
- Pre-authorized users (no authentication).
- Location data is 'unknown' due to no geolocation service.
- Test server 401 errors prevent logging; mock responses used.

## Future Improvements
- Use MongoDB for persistent storage.
- Add geolocation for click data.
- Implement caching for performance.