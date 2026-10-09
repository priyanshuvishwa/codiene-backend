import express from 'express';
import apiRouter from './routes/index.js';

const app = express();

app.use(express.json());
app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
