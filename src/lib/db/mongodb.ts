import { MongoClient } from "mongodb";
import dns from "node:dns";

// Fix Node.js DNS resolver issue with MongoDB SRV records (EBADRESP)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore in environments where setServers is unsupported
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    'Missing environment variable "MONGODB_URI". Set it in your .env file or deployment environment (e.g. Vercel, Railway, etc.).'
  );
}
const options = {
  serverSelectionTimeoutMS: 5000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient is not repeated on hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = undefined;
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(dbName?: string) {
  try {
    const client = await (global._mongoClientPromise || clientPromise);
    return client.db(dbName || process.env.MONGODB_DB || "anguillabonthesea");
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      global._mongoClientPromise = undefined;
    }
    throw err;
  }
}
