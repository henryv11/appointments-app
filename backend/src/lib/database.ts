import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import migrate, { RunnerOption } from 'node-pg-migrate';
import { Client, ClientConfig, Pool, QueryResult } from 'pg';

async function createDatabase(
    { database, ...connectionOptions }: DatabaseConnectionOptions,
    logger: FastifyInstance['log'],
) {
    logger.info(`attempting to create database ${database}`);
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
        if (dbExists) return logger.info(`database ${database} already exists`);
        await client.query(`CREATE DATABASE ${database}`); // can't use parametrized query here
    } catch (error) {
        logger.error(error, `failed to create database ${database}`);
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

const databasePlugin: FastifyPluginAsync<DatabaseConnectionOptions & Partial<MigrationsOptions>> = async function (
    app,
    { dir = './migrations', migrationsTable = 'pgmigrations', ...connectionOptions },
) {
    await createDatabase(connectionOptions, app.log);
    await runMigrations({ ...connectionOptions, dir, migrationsTable }, app.log);

    const query: DatabaseInstance['query'] = async function (query, replacements) {
        const client = await app.database.connect();
        return client.query(query, replacements).finally(client.release);
    };

    app.decorate(
        'database',
        new Pool(connectionOptions).on('error', err => app.log.error(err, 'database pool error')),
    )
        .decorate('query', query)
        .addHook('onClose', async () => {
            app.log.info('ending database pool ...');
            await app.database.end();
        });
};

export const database = fp(databasePlugin);

type DatabaseConnectionOptions = Required<Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'>>;

type MigrationsOptions = Pick<RunnerOption, 'dir' | 'migrationsTable'>;

interface DatabaseInstance {
    database: Pool;
    query: <T>(query: string, replacements?: (string | number)[]) => Promise<QueryResult<T>>;
}

declare module 'fastify' {
    interface FastifyInstance extends DatabaseInstance {}
}
