import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authControllers } from './auth';
import { grpcController } from './grpc';
import { webSocketController } from './web-socket';

const controllersPlugin: FastifyPluginCallback = function (app, _, done) {
  [authControllers, webSocketController, grpcController].forEach(app.register);
  done();
};

export const controllers = fp(controllersPlugin);
