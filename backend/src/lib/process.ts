import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const exitHandlerPlugin: FastifyPluginCallback = (app, _, done) => (
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal =>
    process.on(signal, signal => handleExit(signal, undefined, 0, app)),
  ),
  process.on('uncaughtException', error => handleExit(undefined, error, 1, app)),
  app.decorate('exit', (code: number, error?: Error, signal?: NodeJS.Signals) => handleExit(signal, error, code, app)),
  done()
);

async function handleExit(
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

export const exitHandler = fp(exitHandlerPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    exit: (code: number, error?: Error, signal?: NodeJS.Signals) => Promise<never>;
  }
}
