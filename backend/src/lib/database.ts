import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import migrate, { RunnerOption } from 'node-pg-migrate';
import { Client, ClientConfig, Pool, QueryResult } from 'pg';

const databasePlugin: FastifyPluginAsync<DatabaseConnectionOptions & Partial<MigrationsOptions>> = async function (
  app,
  { dir = './migrations', migrationsTable = 'pgmigrations', ...connectionOptions },
) {
  await createDatabase(connectionOptions, app.log);
  await runMigrations({ ...connectionOptions, dir, migrationsTable }, app.log);
  const pool = new Pool(connectionOptions).on('error', err => app.log.error(err, 'database pool error'));
  const database: Database = {
    // async query(query, replacements) {
    //   const connection = await pool.connect();
    //   return connection.query(query, replacements).finally(connection.release);
    // },
    query: pool.query.bind(pool),
    connect: pool.connect.bind(pool),
    firstRow: queryResult => queryResult.rows[0],
    allRows: queryResult => queryResult.rows,
  };
  app.decorate('database', database);
  app.addHook('onClose', async () => {
    app.log.info('ending database pool ...');
    await pool.end();
  });
};

async function createDatabase(
  { database, ...connectionOptions }: DatabaseConnectionOptions,
  logger: FastifyInstance['log'],
) {
  logger.info(`attempting to create database "${database}"`);
  const client = new Client(connectionOptions);
  try {
    await client.connect();
    const {
      rows: [{ dbExists }],
    } = await client.query(
      `SELECT EXISTS(
                SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)
            ) AS "dbExists"`,
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
  const client = new Client(connectionOptions);
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

export const database = fp(databasePlugin);

declare module 'fastify' {
  interface FastifyInstance {
    database: Database;
  }
}

type DatabaseConnectionOptions = Required<Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'>>;

type MigrationsOptions = Pick<RunnerOption, 'dir' | 'migrationsTable'>;

interface Database {
  // query: <T>(query: string, replacements?: (string | number | boolean | null | undefined)[]) => Promise<QueryResult<T>>;
  query: Pool['query'];
  connect: Pool['connect'];
  firstRow: <T>(queryResult: QueryResult<T>) => T;
  allRows: <T>(queryResult: QueryResult<T>) => T[];
}
