import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5656,
  username: 'postgres',
  password: 'postgres',
  database: 'auto_parts',
});

import { Client } from 'pg';

async function createDatabaseIfNotExists() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5656,
    database: 'postgres', // подключаемся к системной БД
  });

  await client.connect();
  const dbName = 'auto_parts';

  // Проверка и создание базы
  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName],
  );
  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database "${dbName}" created.`);
  } else {
    console.log(`Database "${dbName}" already exists.`);
  }

  await client.end();
}

async function dropDatabaseIfNotExists() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5656,
    database: 'postgres', // подключаемся к системной БД
  });

  await client.connect();
  const dbName = 'auto_parts';

  await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
  // Проверка и создание базы
  // const result = await client.query(
  //   `SELECT 1 FROM pg_database WHERE datname = $1`,
  //   [dbName],
  // );
  // if (result.rowCount === 1) {
  //   await client.query(`CREATE DATABASE ${dbName}`);
  //   console.log(`Database "${dbName}" created.`);
  // } else {
  //   console.log(`Database "${dbName}" already exists.`);
  // }

  await client.end();
}

async function run() {
  await createDatabaseIfNotExists();
  // await dropDatabaseIfNotExists();

  // await AppDataSource.initialize();
  // const query = fs.readFileSync(
  //   path.join(__dirname, '/database/init.sql'),
  //   'utf-8',
  // );
  // await AppDataSource.query(query);
  // await AppDataSource.destroy();
  // console.log('SQL script executed');
}

run().catch((err) => {
  console.error('Error running init.sql:', err);
});
