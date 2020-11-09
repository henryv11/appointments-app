import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Client, ClientConfig, native, Pool, QueryResult } from 'pg';
import { createDb, migrate } from 'postgres-migrations';

const databasePlugin: FastifyPluginAsync<DatabaseConnectionOptions & Partial<MigrationsOptions>> = async function (
  app,
  connectionOptions,
) {
  const pg = native
    ? (app.log.info('using native bindings'), native)
    : (app.log.info('using javascript bindings'), { Pool, Client });
  await databaseInit(pg.Client, connectionOptions, app.log);
  const pool = new pg.Pool(connectionOptions);
  pool.on('error', err => app.log.error(err, 'database pool error'));
  const query = pool.query.bind(pool);
  const database: Database = {
    query,
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

async function databaseInit(
  pgClient: typeof Client,
  {
    migrationsDirectory = './migrations',
    database,
    ...connectionOptions
  }: DatabaseConnectionOptions & Partial<MigrationsOptions>,
  logger: FastifyInstance['log'],
) {
  let client: Client | undefined = undefined;
  try {
    client = new pgClient(connectionOptions);
    await client.connect();
    logger.info(`creating database "${database}" ...`);
    await createDb(database, { client });
    await client.end();
    logger.info('running migrations ...');
    client = new pgClient({ database, ...connectionOptions });
    await client.connect();
    const migrations = await migrate({ client }, migrationsDirectory);
    migrations.length ? logger.info({ migrations }, 'ran migrations successfully') : logger.info('no migrations to run');
    await client.end();
  } catch (error) {
    logger.error(error, 'database init failed');
    await client?.end();
    throw error;
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
