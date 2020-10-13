import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authControllers } from './auth';

const controllersPlugin: FastifyPluginCallback = function (app, _, done) {
  [authControllers].forEach(app.register);
  done();
};

export const controllers = fp(controllersPlugin);
