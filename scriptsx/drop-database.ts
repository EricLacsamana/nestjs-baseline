import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function deleteDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');

    const databaseName = process.env.DATABASE_NAME;
    if (!databaseName) {
      throw new Error('DATABASE_NAME is not defined in environment variables.');
    }

    // Terminate connections to the database
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${databaseName}' AND pid <> pg_backend_pid();
    `);

    // Drop the database
    await client.query(`DROP DATABASE IF EXISTS "${databaseName}";`);
    console.log(`Database "${databaseName}" dropped successfully.`);
  } catch (err) {
    console.error('Error deleting database:', err);
  } finally {
    await client.end();
    console.log('Disconnected from PostgreSQL server.');
  }
}

deleteDatabase();
