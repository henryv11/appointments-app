import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authControllers } from './auth';
import { boardControllers } from './board';
import { sessionControllers } from './session';

const controllersPlugin: FastifyPluginCallback = function (app, _, done) {
  [authControllers, sessionControllers, boardControllers].forEach(app.register);
  done();
};

export const controllers = fp(controllersPlugin);
