import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const healthCheckPlugin: FastifyPluginCallback = function (app, _, done) {
  app.get('/ping', {}, async () => (await app.database?.query?.('select 1 + 1'), 'pong'));
  done();
};

export const healthCheck = fp(healthCheckPlugin);
