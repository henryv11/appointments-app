import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Pool, PoolConfig, QueryResult } from 'pg';

const databasePlugin: FastifyPluginCallback<PoolConfig> = function (fastify, options, done) {
    const pool = new Pool(options).on('error', err => fastify.log.error('database pool error', err));

    const query: DatabaseFastifyInstance['query'] = async function (query, replacements) {
        const client = await pool.connect();
        return client.query(query, replacements).finally(client.release);
    };

    fastify
        .decorate('database', pool)
        .decorate('query', query)
        .addHook('onClose', async function () {
            fastify.log.info('closing database connection ...');
            await pool.end();
        });
    done();
};

export const database = fp(databasePlugin);

interface DatabaseFastifyInstance {
    database: Pool;
    query: <T>(query: string, replacements?: (string | number)[]) => Promise<QueryResult<T>>;
}

declare module 'fastify' {
    interface FastifyInstance extends DatabaseFastifyInstance {}
}
