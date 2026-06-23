import mongoose from 'mongoose';

export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

const cached = globalThis as typeof globalThis & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

cached.mongoose ??= { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.mongoose?.conn) return cached.mongoose.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  const store = cached.mongoose;

  if (!store) {
    throw new Error('Mongo cache failed to initialize');
  }

  try {
    store.promise ??= mongoose.connect(process.env.MONGODB_URI);
    store.conn = await store.promise;
    return store.conn;
  } catch (error) {
    store.conn = null;
    store.promise = null;
    const message = error instanceof Error ? error.message : 'Database connection failed';
    throw new DatabaseConnectionError(message);
  }
}

export async function tryConnectToDatabase() {
  try {
    await connectToDatabase();
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database connection failed';
    return { ok: false as const, error: message };
  }
}

