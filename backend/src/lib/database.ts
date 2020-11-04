import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Client, ClientConfig, native, Pool, QueryResult } from 'pg';
import { createDb, migrate } from 'postgres-migrations';

const pg = native
  ? (console.log('using pg-native bindings'), native)
  : (console.log('using pg-js bindings'), { Pool, Client });

const databasePlugin: FastifyPluginAsync<DatabaseConnectionOptions & Partial<MigrationsOptions>> = async function (
  app,
  { migrationsDirectory = './migrations', ...connectionOptions },
) {
  await createDatabase(connectionOptions, app.log);
  await runMigrations({ ...connectionOptions, migrationsDirectory }, app.log);
  const pool = new pg.Pool(connectionOptions);
  pool.on('error', err => app.log.error(err, 'database pool error'));
  const database: Database = {
    query: pool.query.bind(pool),
    connect: pool.connect.bind(pool),
    firstRow: queryResult => queryResult.rows[0],
    allRows: queryResult => queryResult.rows,
    transaction: () =>
      pool.connect().then(connection => ({
        begin: () => connection.query('BEGIN').then(() => void 0),
        commit: () => connection.query('COMMIT').then(() => connection.release()),
        rollback: () => connection.query('ROLLBACK').then(() => connection.release()),
        query: connection.query.bind(connection),
      })),
  };
  app.decorate('database', database);
  app.addHook('onClose', async () => (app.log.info('ending database pool ...'), await pool.end()));
};

async function createDatabase(
  { database, ...connectionOptions }: DatabaseConnectionOptions,
  logger: FastifyInstance['log'],
) {
  logger.info(`attempting to create database "${database}"`);
  const client = new pg.Client(connectionOptions);
  try {
    await client.connect();
    await createDb(database, { client });
  } catch (error) {
    logger.error(error, `failed to create database "${database}"`);
    throw error;
  } finally {
    await client.end();
  }
}

async function runMigrations(
  { migrationsDirectory, ...connectionOptions }: DatabaseConnectionOptions & MigrationsOptions,
  logger: FastifyInstance['log'],
) {
  logger.info('attempting to run migrations');
  const client = new pg.Client(connectionOptions);
  try {
    await client.connect();
    await migrate({ client }, migrationsDirectory);
  } catch (error) {
    logger.error(error, 'failed to run migrations');
    throw error;
  } finally {
    await client.end();
  }
}

export const database = fp(databasePlugin);

declare module 'fastify' {
  interface FastifyInstance {
    database: Database;
  }
}

type DatabaseConnectionOptions = Required<Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'>>;

type MigrationsOptions = { migrationsDirectory: string };

interface Transaction {
  query: Pool['query'];
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  begin: () => Promise<void>;
}

interface Database {
  query: Pool['query'];
  connect: Pool['connect'];
  transaction: () => Promise<Transaction>;
  firstRow: <T>(queryResult: QueryResult<T>) => T;
  allRows: <T>(queryResult: QueryResult<T>) => T[];
}
