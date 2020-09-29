import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

export async function handleExit(
    signal: NodeJS.Signals | undefined,
    error: Error | undefined,
    code: number,
    fastify: FastifyInstance,
) {
    if (signal) fastify.log.info(`caught NodeJS exit signal ${signal}`);
    if (error) fastify.log.info(`error <${error}> caused process to exit`);
    fastify.log.info('shutting down server ...');
    await fastify.close();
    process.exit(code);
}

const exitHandlerPlugin: FastifyPluginCallback = function (fastify, _, done) {
    (['SIGINT', 'SIGTERM', 'SIGQUIT'] as const).forEach(signal =>
        process.on(signal, signal => handleExit(signal, undefined, 0, fastify)),
    );
    process.on('uncaughtException', error => handleExit(undefined, error, 1, fastify));
    done();
};

export const exitHandlers = fp(exitHandlerPlugin);
