# 22131310013 Submission

## Overview
HTTP URL Shortener Microservice for Afford Medical Technologies.

## Folder Structure
- `logging-middleware`: Logging middleware (not integrated due to 401 errors).
- `backend-test-submission`: Microservice implementation.

## Setup
1. Clone the repository.
2. Install dependencies: `cd backend-test-submission && npm install`.
3. Run: `npx tsc && node dist/index.js`.

## Notes
- Test server (http://20.244.56.144) returned 401 errors ("invalid authorization token"). Logging middleware integration is commented out with mock responses:
  ```json
  {
    "logID": "mock-log-id",
    "message": "log created successfully (mocked)"
  }
  ```
- Screenshots in `backend-test-submission/screenshots`.
- Design document in `DESIGN.md`.