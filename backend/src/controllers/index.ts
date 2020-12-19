import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authControllers } from './auth';
import { boardControllers } from './board';
import { uploadControllers } from './upload';
import { userControllers } from './user';

const controllersPlugin: FastifyPluginCallback = function (app, _, done) {
  [authControllers, boardControllers, userControllers, uploadControllers].forEach(controller =>
    app.register(fp(controller)),
  );

  done();
};

export const controllers = fp(controllersPlugin);
