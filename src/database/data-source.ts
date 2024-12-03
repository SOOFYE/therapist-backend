// src/database/data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env files
let e = dotenv.config({
  path:
    process.env.ENVIRONMENT === 'production'
      ? path.join(process.cwd(), '.env.production')
      : path.join(process.cwd(), '.env.local'),
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});