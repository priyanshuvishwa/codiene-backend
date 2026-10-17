import mongoose from 'mongoose';

export async function connectToDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error('MONGODB_URI is required to start the server.');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}
