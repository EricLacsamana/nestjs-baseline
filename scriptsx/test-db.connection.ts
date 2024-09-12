import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    await createConnection({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [],
      synchronize: true,
    });
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testConnection();
