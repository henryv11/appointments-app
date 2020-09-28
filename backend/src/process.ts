import { pool } from './database';
import { fastify } from './fastify';
import { logger } from './logger';

export async function exitHandler(signal: NodeJS.Signals | undefined, error: Error | undefined, code: number) {
    if (signal) logger.info(`caught NodeJS signal ${signal}`);
    if (error) logger.info(`error ${error} caused process to exit`);
    logger.info('exiting process gracefully');
    logger.info('shutting down server ...');
    await fastify.close();
    logger.info('shutting down database pool ...');
    await pool.end();
    process.exit(code);
}
