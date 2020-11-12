import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Client, ClientConfig, native, Pool, QueryResult } from 'pg';
import { createDb, migrate } from 'postgres-migrations';

const tag = '[database]';

export const database = fp<DatabaseConnectionOptions>(async (app, connectionOptions) => {
  const log = app.log.child({ plugin: 'database' });
  const pg = native
    ? (log.info(`${tag} using native bindings`), native)
    : (log.info(`${tag} using postgres bindings`), { Pool, Client });
  await databaseInit(pg.Client, connectionOptions, log);
  const pool = new pg.Pool(connectionOptions);
  pool.on('error', err => log.error(err, `${tag} database pool error`));
  const query = pool.query.bind(pool);
  const database: Database = Object.freeze({
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
  connect: Pool['connect'];
  transaction: () => Promise<Transaction>;
  firstRow: <T>(queryResult: QueryResult<T>) => T;
  allRows: <T>(queryResult: QueryResult<T>) => T[];
}
