import sqlts from '@rmp135/sql-ts';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { writeFileSync } from 'fs';
import migrate, { RunnerOption } from 'node-pg-migrate';
import { ClientConfig, native as pg, Pool, QueryResult } from 'pg';

const databasePlugin: FastifyPluginAsync<DatabaseConnectionOptions & Partial<MigrationsOptions>> = async function (
  app,
  { dir = './migrations', migrationsTable = 'pgmigrations', ...connectionOptions },
) {
  await createDatabase(connectionOptions, app.log);
  await runMigrations({ ...connectionOptions, dir, migrationsTable }, app.log);
  await generateTsTypes(connectionOptions, app.log);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const pool = new pg!.Pool(connectionOptions);
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const client = new pg!.Client(connectionOptions);
  try {
    await client.connect();
    const {
      rows: [{ dbExists }],
    } = await client.query<{ dbExists: boolean }>(
      `
      SELECT EXISTS (
        SELECT
          datname
        FROM
          pg_catalog.pg_database
        WHERE
          lower(datname) = lower($1)
      ) AS "dbExists"
      `,
      [database],
    );
    if (dbExists) return logger.info(`database "${database}" already exists`);
    await client.query(`CREATE DATABASE ${database}`);
  } catch (error) {
    logger.error(error, `failed to create database "${database}"`);
    throw error;
  } finally {
    await client.end();
  }
}

async function runMigrations(
  { dir, migrationsTable, ...connectionOptions }: DatabaseConnectionOptions & MigrationsOptions,
  logger: FastifyInstance['log'],
) {
  logger.info('attempting to run migrations');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const client = new pg!.Client(connectionOptions);
  try {
    await client.connect();
    await migrate({
      dir,
      migrationsTable,
      logger,
      dbClient: client,
      direction: 'up',
      count: Infinity,
    });
  } catch (error) {
    logger.error(error, 'failed to run migrations');
    throw error;
  } finally {
    await client.end();
  }
}

async function generateTsTypes(opts: DatabaseConnectionOptions, logger: FastifyInstance['log']) {
  // if (process.env.NODE_ENV !== 'development') return;
  logger.info('generating TypeScript types from database');
  const types = await sqlts.toTypeScript({
    client: 'pg',
    connection: opts,
    columnNameCasing: 'camel',
    tableNameCasing: 'pascal',
    interfaceNameFormat: '${table}',
    typeMap: {
      Date: ['timestamptz'],
      number: ['int8'],
    },
  });
  writeFileSync('./src/types/db-generated.d.ts', types);
  logger.info('TypeScript types generated');
}

export const database = fp(databasePlugin);

declare module 'fastify' {
  interface FastifyInstance {
    database: Database;
  }
}

type DatabaseConnectionOptions = Required<Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'>>;

type MigrationsOptions = Pick<RunnerOption, 'dir' | 'migrationsTable'>;

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
