import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authControllers } from './auth';
import { webSocketController } from './web-socket';

const controllersPlugin: FastifyPluginCallback = function (app, _, done) {
  [authControllers, webSocketController].forEach(app.register);
  done();
};

export const controllers = fp(controllersPlugin);
