import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

export async function handleExit(
    signal: NodeJS.Signals | undefined,
    error: Error | undefined,
    code: number,
    app: FastifyInstance,
) {
    if (signal) app.log.info(signal, 'caught NodeJS exit signal');
    if (error) app.log.info(error, 'error caused process to exit');
    app.log.info('shutting down server ...');
    await app.close();
    process.exit(code);
}

const exitHandlerPlugin: FastifyPluginCallback = function (app, _, done) {
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal =>
        process.on(signal, signal => handleExit(signal, undefined, 0, app)),
    );
    process.on('uncaughtException', error => handleExit(undefined, error, 1, app));
    done();
};

export const exitHandler = fp(exitHandlerPlugin);
