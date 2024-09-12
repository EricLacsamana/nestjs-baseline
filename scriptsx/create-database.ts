import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });


console.log('DATABASE_NAME:', process.env.DATABASE_NAME);

async function createDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: 'postgres', // Connect to the default database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');

    const databaseName = process.env.DATABASE_NAME;
    if (!databaseName) {
      throw new Error('DATABASE_NAME is not defined in environment variables.');
    }

    try {
      await client.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`Database "${databaseName}" created successfully.`);
    } catch (createError) {
      if (createError.code === '42P04') {
        console.log(`Database "${databaseName}" already exists.`);
      } else {
        throw createError;
      }
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
    console.log('Disconnected from PostgreSQL server.');
  }
}

createDatabase();
