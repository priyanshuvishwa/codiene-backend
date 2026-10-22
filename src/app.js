import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import ApiError from './utils/apierror.js';
import router from './routes/client.route.js';
import helmet from 'helmet';
import { ApiResponse } from './utils/apiresponse.js';

const app = express();

//cors configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// accepting data from JSON
app.use(express.json({
  limit: '16kb',
}));

// accepting data from form-data
app.use(express.urlencoded({
  extended: true,
  limit: '16kb',
}));

// helmet
app.use(helmet());

// router for client routes
app.use('/api/v1/clients', router);


app.get("/", (req, res) => {
  res.status(200).send("Backend is working!");
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (error.name === 'MulterError') {
    return res.status(400).json({ error: 'Form-data fields only; file uploads are not supported' });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ error: error.message });
  }

  console.error('Request failed:', error);
  return res.status(500).json({ error: 'Internal server error' });
});

export default app;
