import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Client, ClientConfig, native, Pool, QueryResult } from 'pg';
import { createDb, migrate } from 'postgres-migrations';
import sql from './pg-template-string';

const tag = '[database]';

export const database = fp<DatabaseConnectionOptions>(async (app, connectionOptions) => {
  const log = app.log.child({ plugin: 'database' });
  const pg = native
    ? (log.info(`${tag} using native bindings`), native)
    : (log.info(`${tag} using postgres bindings`), { Pool, Client });
  await databaseInit(pg.Client, connectionOptions, log);
  const pool = new pg.Pool(connectionOptions);
  pool.on('error', err => log.error(err, `${tag} database pool error`));
  const query = attachLogger(pool.query.bind(pool), log);
  const database: Database = Object.freeze({
    query,
    sql,
    firstRow: queryResult => {
      if (queryResult.rowCount > 1) throw app.errors?.badData?.() || new Error('bad data');
      if (!queryResult.rowCount) throw app.errors?.notFound?.() || new Error('not found');
      return queryResult.rows[0];
    },
    allRows: queryResult => queryResult.rows,
    transaction: () =>
      pool.connect().then(connection => ({
        begin: () => connection.query('BEGIN').then(() => void 0),
        commit: () => connection.query('COMMIT').then(() => connection.release()),
        rollback: () => connection.query('ROLLBACK').then(() => connection.release()),
        query: attachLogger(connection.query.bind(connection), log),
      })),
  });
  app.decorate('database', database);
  app.addHook('onClose', async () => (log.info(`${tag} ending database pool ...`), await pool.end()));
});

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
    logger.info(`${tag} creating database "${database}" ...`);
    await createDb(database, { client });
    await client.end();
    logger.info(`${tag} running migrations ...`);
    client = new pgClient({ database, ...connectionOptions });
    await client.connect();
    const migrations = await migrate({ client }, migrationsDirectory);
    migrations.length
      ? logger.info({ migrations }, `${tag} ran migrations successfully`)
      : logger.info(`${tag} no migrations to run`);
    await client.end();
  } catch (error) {
    logger.error(error, `${tag} database init failed`);
    await client?.end();
    throw error;
  }
}

const attachLogger = (query: Pool['query'], log: FastifyInstance['log']) =>
  ((...args: Parameters<Pool['query']>) => (
    log.info(
      typeof args[0] === 'string'
        ? { text: args[0], values: args[1] }
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { text: (args[0] as any).text, values: (args[0] as any).values },
      `${tag} query`,
    ),
    query(...args)
  )) as Pool['query'];

declare module 'fastify' {
  interface FastifyInstance {
    database: Readonly<Database>;
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
  sql: typeof sql;
  transaction: () => Promise<Transaction>;
  firstRow: <T>(queryResult: QueryResult<T>) => T;
  allRows: <T>(queryResult: QueryResult<T>) => T[];
}
