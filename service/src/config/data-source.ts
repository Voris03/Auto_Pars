// src/config/data-source.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5656,
  username: 'postgres',
  password: 'postgres',
  database: 'auto_parts',
  synchronize: false,
  entities: ['src/database/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});