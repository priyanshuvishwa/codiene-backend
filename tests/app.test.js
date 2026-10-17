import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import app from '../src/app.js';
import ApiError from '../src/utils/apierror.js';
import { ApiResponse } from '../src/utils/apiresponse.js';
import asyncHandler from '../src/utils/asyncHandler.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('unknown routes return a JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/v1/unknown`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Not found' });
});

test('POST /api/v1/clients rejects missing JSON fields without crashing', async () => {
  const response = await fetch(`${baseUrl}/api/v1/clients`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'All Fields are required' });
});

test('POST /api/v1/clients rejects a missing request body without crashing', async () => {
  const response = await fetch(`${baseUrl}/api/v1/clients`, { method: 'POST' });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'Request body must be an object',
  });
});

test('POST /api/v1/clients accepts form-data and validates its fields', async () => {
  const formData = new FormData();
  formData.set('name', 'Test Client');
  formData.set('email', 'invalid-email');
  formData.set('message', 'Test message');

  const response = await fetch(`${baseUrl}/api/v1/clients`, {
    method: 'POST',
    body: formData,
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Invalid Email address' });
});

test('POST /api/v1/clients rejects non-string fields without crashing', async () => {
  const response = await fetch(`${baseUrl}/api/v1/clients`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: { invalid: 'type' },
      email: 'test@example.com',
      message: 'Test message',
    }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'All Fields are required' });
});

test('asyncHandler forwards rejected handlers to Express error middleware', async () => {
  const expectedError = new Error('Request failed');
  let forwardedError;
  const handler = asyncHandler(async () => {
    throw expectedError;
  });

  await handler({}, {}, (error) => {
    forwardedError = error;
  });

  assert.equal(forwardedError, expectedError);
});

test('ApiError carries the HTTP status and error details', () => {
  const error = new ApiError(422, 'Invalid client', ['email is invalid']);

  assert.equal(error.statusCode, 422);
  assert.equal(error.message, 'Invalid client');
  assert.deepEqual(error.errors, ['email is invalid']);
  assert.equal(error.success, false);
});

test('ApiResponse sends its data with the configured HTTP status', () => {
  let sentStatus;
  let sentBody;
  const response = new ApiResponse(201, { client: { fullName: 'A Client' } });

  response.send({
    status(statusCode) {
      sentStatus = statusCode;
      return this;
    },
    json(body) {
      sentBody = body;
    },
  });

  assert.equal(sentStatus, 201);
  assert.deepEqual(sentBody, { client: { fullName: 'A Client' } });
  assert.equal(response.success, true);
});
