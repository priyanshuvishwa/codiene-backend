import 'dotenv/config';
import app from './app.js';
import { connectToDatabase } from './db/connect.js';

const port = Number(process.env.PORT) || 8000;

try {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (error) {
  console.error(
    'Unable to start server:',
    error instanceof Error ? error.message : 'MongoDB connection failed.',
  );
  process.exitCode = 1;
}
