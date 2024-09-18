import { DataSource } from 'typeorm';
import { AppDataSource } from './dataSource';
import * as fs from 'fs';
import * as path from 'path';

const createDatabaseFile = async () => {
  const dbPath = path.resolve(
    __dirname,
    '..',
    AppDataSource.options.database as string,
  );

  if (!fs.existsSync(dbPath)) {
    console.log(`Creating database file at ${dbPath}`);
    fs.writeFileSync(dbPath, '');
    console.log('Database file created successfully.');
  } else {
    console.log('Database file already exists.');
  }

  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    await AppDataSource.destroy();
  } catch (err) {
    console.error('Error during Data Source initialization', err);
  }
};

createDatabaseFile().catch((error) => console.log(error));
