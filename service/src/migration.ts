import { DataSource } from 'typeorm';
import { Client } from 'pg';
import { AppDataSource } from './config/data-source';

async function dropDatabaseIfExists() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5656,
    database: 'postgres',
  });

  await client.connect();
  const dbName = 'auto_parts';
  await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
  console.log(`❌ База ${dbName} удалена`);
  await client.end();
}

async function createDatabaseIfNotExists() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5656,
    database: 'postgres',
  });

  await client.connect();
  const dbName = 'auto_parts';
  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName]
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ База ${dbName} создана`);
  } else {
    console.log(`ℹ️ База ${dbName} уже существует`);
  }

  await client.end();
}

async function runMigrations() {
  await AppDataSource.initialize();
  console.log('📦 Подключение к БД установлено');

  await AppDataSource.runMigrations();
  console.log('🚀 Миграции выполнены');

  await AppDataSource.destroy();
}

async function main() {
  await dropDatabaseIfExists();
  await createDatabaseIfNotExists();
  // await runMigrations();
}

main().catch((err) => {
  console.error('💥 Ошибка при запуске миграции:', err);
});