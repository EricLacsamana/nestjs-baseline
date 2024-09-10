import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');

    try {
      await client.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
      console.log(
        `Database "${process.env.DATABASE_NAME}" created successfully.`,
      );
    } catch (createError) {
      if (createError.code === '42P04') {
        console.log(`Database "${process.env.DATABASE_NAME}" already exists.`);
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
