import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Client, ClientConfig, native, Pool, QueryResult } from 'pg';
import { createDb, migrate } from 'postgres-migrations';
export { QueryResult };

export const database = fp<DatabaseConnectionOptions>(async (app, connectionOptions) => {
  const log = app.log.child({ plugin: 'database' });
  const pg = native
    ? (log.info('using native libpq bindings'), native)
    : (log.info('using JavaScript bindings'), { Pool, Client });
  await databaseInit(pg.Client, connectionOptions, log);
  const pool = new pg.Pool(connectionOptions);
  const database: Database = Object.freeze({
    query: attachLogger(pool.query.bind(pool), log),
    transaction: () =>
      pool.connect().then(connection => ({
        begin: () => connection.query('BEGIN').then(() => void 0),
        commit: () => connection.query('COMMIT').then(() => connection.release()),
        rollback: () => connection.query('ROLLBACK').then(() => connection.release()),
        query: attachLogger(connection.query.bind(connection), log),
      })),
    connection: () =>
      pool.connect().then(connection => ({
        query: attachLogger(connection.query.bind(connection), log),
        close: () => connection.release(),
      })),
  });
  app.decorate('database', database);
  app.addHook('onClose', async () => (log.info('closing database pool ...'), await pool.end()));
});

async function databaseInit(
  pgClient: typeof Client,
  {
    migrationsDirectory = './migrations',
    database,
    ...connectionOptions
  }: DatabaseConnectionOptions & Partial<MigrationsOptions>,
  logger: LogFn,
) {
  let client: Client | undefined = undefined;
  try {
    client = new pgClient(connectionOptions);
    await client.connect();
    logger.info('creating database ' + database + ' ...');
    await createDb(database, { client });
    await client.end();
    logger.info('running migrations ...');
    client = new pgClient({ database, ...connectionOptions });
    await client.connect();
    const migrations = await migrate({ client }, migrationsDirectory);
    migrations.length
      ? logger.info({ migrations }, 'ran migrations successfully')
      : logger.info('no migrations to run');
    await client.end();
  } catch (error) {
    logger.error(error, 'database init failed');
    await client?.end();
    throw error;
  }
}

function attachLogger(query: QueryFn, log: LogFn) {
  return function (...args: Parameters<QueryFn>) {
    log.info(
      typeof args[0] === 'string'
        ? { text: args[0], values: args[1] }
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { text: (args[0] as any).text, values: (args[0] as any).values },
      'database query',
    );
    return query(...args);
  } as QueryFn;
}

declare module 'fastify' {
  interface FastifyInstance {
    database: Readonly<Database>;
  }
}

type LogFn = FastifyInstance['log'];

type QueryFn = Pool['query'];

type DatabaseConnectionOptions = Required<Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'>>;

type MigrationsOptions = { migrationsDirectory: string };

interface Transaction {
  readonly query: QueryFn;
  readonly commit: () => Promise<void>;
  readonly rollback: () => Promise<void>;
  readonly begin: () => Promise<void>;
}

interface Connection {
  query: QueryFn;
  close: () => void;
}

interface Database {
  readonly query: QueryFn;
  readonly transaction: () => Promise<Transaction>;
  readonly connection: () => Promise<Connection>;
}
