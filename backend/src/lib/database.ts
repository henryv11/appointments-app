import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import migrate, { RunnerOption } from 'node-pg-migrate';
import { Client, ClientConfig, Pool, QueryResult } from 'pg';

async function createDatabase(
    { host, port, user, password, database }: Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'>,
    logger: FastifyInstance['log'],
) {
    logger.info('attempting to create database');
    const client = new Client({ host, port, user, password });
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
        if (dbExists) return logger.info('database already exists');
        await client.query(`CREATE DATABASE ${database}`); // can't use parametrized query here
    } catch (error) {
        logger.error(error, 'failed to create database');
        throw error;
    } finally {
        await client.end();
    }
}

async function runMigrations(
    {
        host,
        port,
        user,
        password,
        database,
        dir,
        migrationsTable,
    }: Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'> &
        Pick<RunnerOption, 'dir' | 'migrationsTable'>,
    logger: FastifyInstance['log'],
) {
    logger.info('attempting to run migrations');
    const client = new Client({ host, port, user, password, database });
    try {
        await client.connect();
        await migrate({
            dbClient: client,
            dir,
            migrationsTable,
            direction: 'up',
            count: Infinity,
            logger,
        });
    } catch (error) {
        logger.error(error, 'failed to run migrations');
        throw error;
    } finally {
        await client.end();
    }
}

const databasePlugin: FastifyPluginAsync<
    Pick<ClientConfig, 'host' | 'port' | 'user' | 'password' | 'database'> &
        Partial<Pick<RunnerOption, 'dir' | 'migrationsTable'>>
> = async function (
    fastify,
    { dir = './migrations', migrationsTable = 'migrations', host, port, user, password, database },
) {
    await createDatabase({ host, port, user, password, database }, fastify.log);
    await runMigrations({ host, port, user, password, database, dir, migrationsTable }, fastify.log);

    const pool = new Pool({ host, port, user, password, database }).on('error', err =>
        fastify.log.error(err, 'database pool error'),
    );

    const query: DatabaseFastifyInstance['query'] = async function (query, replacements) {
        const client = await pool.connect();
        return client.query(query, replacements).finally(client.release);
    };

    fastify
        .decorate('database', pool)
        .decorate('query', query)
        .addHook('onClose', async function () {
            fastify.log.info('ending database pool ...');
            await pool.end();
        });
};

export const database = fp(databasePlugin);

interface DatabaseFastifyInstance {
    database: Pool;
    query: <T>(query: string, replacements?: (string | number)[]) => Promise<QueryResult<T>>;
}

declare module 'fastify' {
    interface FastifyInstance extends DatabaseFastifyInstance {}
}
