# Codiene Backend

A Node.js and Express API starter.

## Requirements

- Node.js 20 or newer
- npm

## Getting started

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and update the values if needed.
3. Start the development server:

   ```sh
   npm run dev
   ```

The API listens on port `3000` by default. Set `PORT` in `.env` to use a
different port. The health endpoint is available at `GET /api/health`.

## Scripts

- `npm run dev` — run with Node's watch mode
- `npm start` — run the server
- `npm test` — run the built-in Node.js test suite

## Project layout

```text
src/
  app.js          Express app and middleware
  server.js       Environment setup and HTTP server
  routes/
    index.js      API routes
tests/
  app.test.js     API smoke tests
```
