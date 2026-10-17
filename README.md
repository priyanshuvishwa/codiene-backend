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

2. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB
   connection string. For MongoDB Atlas, use the connection string provided
   for your cluster and database user.
3. Start the development server (MongoDB must be reachable):

   ```sh
   npm run dev
   ```

The server connects to MongoDB before listening on port `3000` by default.
Set `PORT` in `.env` to use a different port. The health endpoint is available
at `GET /api/health`.

## Client API

- `POST /api/v1/clients` — submit a client using `name`, `email`, and
  `message`.

Send the fields as JSON or `multipart/form-data` (Postman: **Body → form-data**).
File uploads are not accepted.

## Scripts

- `npm run dev` — run with Node's watch mode
- `npm start` — run the server
- `npm test` — run the built-in Node.js test suite

## Project layout

```text
src/
  app.js          Express app and middleware
  server.js       Environment setup and HTTP server
  db/
    connect.js    MongoDB connection
  models/
    client.models.js  Client document schema
  controllers/
    client.controllers.js  Client API handlers
  utils/
    asyncHandler.js  Async Express handler wrapper
    apierror.js      Standard API error
    apiresponse.js   Standard API response helper
  routes/
    index.js      API routes
tests/
  app.test.js     API smoke tests
```
