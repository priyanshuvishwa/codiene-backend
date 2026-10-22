# Codiene Backend

A Node.js and Express API for collecting client contact submissions. Each
submission is stored in MongoDB, and the server sends notification and
confirmation emails through SMTP.

## Requirements

- Node.js 20 or newer
- npm
- A reachable MongoDB database
- SMTP credentials for sending emails

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root and configure the environment
   variables described below. `.env` is excluded from version control.
3. Start the development server:

   ```sh
   npm run dev
   ```

   The server connects to MongoDB before it begins listening. If the database
   connection fails or `MONGODB_URI` is missing, startup fails.

## Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `8000` | HTTP port. The checked-in `.env.example` sets this to `3000`. |
| `MONGODB_URI` | Yes | — | MongoDB connection string. |
| `CORS_ORIGIN` | No | `*` | Origin value used by CORS. CORS credentials are enabled; configure an explicit origin for credentialed browser requests. |
| `ZOHO_EMAIL` | For email delivery | — | SMTP username and sender/notification email address. |
| `ZOHO_APP_PASSWORD` | For email delivery | — | SMTP account or app password. |
| `ZOHO_SMTP_HOST` | For email delivery | — | SMTP server hostname. |
| `ZOHO_SMTP_PORT` | No | `465` | SMTP server port. TLS is enabled when this is `465`. |

The server does not validate SMTP configuration at startup. Contact submissions
are persisted before email is sent; an email delivery error can therefore
result in an error response even though the client record was saved.

## API

### Create a client submission

`POST /api/v1/clients`

Accepts `application/json` and `multipart/form-data` with the following fields:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Client's name; must not be empty. |
| `email` | Yes | Client's email address; must have a valid basic email format. |
| `message` | Yes | Contact message; must not be empty. |

File uploads are not accepted. The request body is limited to 16 KB for JSON
and URL-encoded requests.

On success, the endpoint responds with HTTP `201` and a JSON object containing
`success`, `message`, and the created MongoDB client document in `data`.
Submitted emails are trimmed and stored in lowercase.

Requests are rate-limited to 15 per 15-minute window per server process.

### Errors

Validation errors return HTTP `400` with a JSON `error` message. Unknown routes
return HTTP `404`:

```json
{ "error": "Not found" }
```

Unexpected server errors return HTTP `500` with a generic error message.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the server with Node.js watch mode. |
| `npm start` | Start the server. |
| `npm test` | Run the built-in Node.js test suite. |

## Project structure

```text
src/
  app.js                         Express app, middleware, and error handling
  server.js                      Database connection and HTTP server startup
  controllers/
    client.controllers.js        Client submission handler
  db/
    connect.js                   MongoDB connection
  middleware/
    rateLimiter.middleware.js    Contact endpoint rate limit
  models/
    client.models.js             Mongoose client schema
  routes/
    client.route.js               Client API route
  utils/
    apierror.js                   API error type
    apiresponse.js                API response helper
    asyncHandler.js               Async Express handler wrapper
    sendEmails.js                 SMTP email transport and sender
tests/
  app.test.js                     API and utility tests
```
