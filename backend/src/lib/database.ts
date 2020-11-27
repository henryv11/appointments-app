import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Client, ClientConfig, native, Pool, QueryResult } from 'pg';
import { createDb, migrate } from 'postgres-migrations';
export { QueryResult };

//#region [Constants]

const tag = '[database]';

//#endregion

//#region [Plugin]

export const database = fp<DatabaseConnectionOptions>(async (app, connectionOptions) => {
  const log = app.log.child({ plugin: 'database' });
  const pg = native
    ? (log.info(`${tag} using native bindings`), native)
    : (log.info(`${tag} using postgres bindings`), { Pool, Client });
  await databaseInit(pg.Client, connectionOptions, log);
  const pool = new pg.Pool(connectionOptions);
  const query = attachLogger(pool.query.bind(pool), log);
  const database: Database = Object.freeze({
    query,
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
  app.addHook('onClose', async () => (log.info(`${tag} ending database pool ...`), await pool.end()));
});

//#endregion

//#region [Utils]

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

//#endregion

//#region [Declaration merging]

declare module 'fastify' {
  interface FastifyInstance {
    database: Readonly<Database>;
  }
}

//#endregion

//#region [Types]

type DatabaseConnectionOptions = Required<Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'>>;

type MigrationsOptions = { migrationsDirectory: string };

interface Transaction {
  readonly query: Pool['query'];
  readonly commit: () => Promise<void>;
  readonly rollback: () => Promise<void>;
  readonly begin: () => Promise<void>;
}

interface Connection {
  query: Pool['query'];
  close: () => void;
}

interface Database {
  readonly query: Pool['query'];
  readonly transaction: () => Promise<Transaction>;
  readonly connection: () => Promise<Connection>;
}

//#endregion
