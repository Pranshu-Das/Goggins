import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { MongoMemoryServer } from "mongodb-memory-server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// No external MongoDB install needed: this spins up a real MongoDB
// process bundled inside node_modules and points Mongoose at it. Data is
// written to backend/.data/mongodb so it survives restarts of the app.
//
// If you'd rather use a real MongoDB (local install or Atlas) later,
// just set MONGO_URI in .env and this will connect to that instead.
const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      const dbPath = path.join(__dirname, "../../.data/mongodb");
      // Make sure the folder exists first - on some systems (especially
      // Windows paths with spaces) mongodb-memory-server doesn't create
      // nested folders on its own.
      fs.mkdirSync(dbPath, { recursive: true });

      const mongod = await MongoMemoryServer.create({
        instance: {
          dbPath,
          storageEngine: "wiredTiger",
        },
      });
      uri = mongod.getUri();
      console.log("Using embedded MongoDB (no install needed) - data saved to backend/.data");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;