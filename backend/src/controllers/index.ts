import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authControllers } from './auth';
import { boardControllers } from './board';
import { sessionControllers } from './session';
import { uploadControllers } from './upload';
import { userControllers } from './user';

const controllersPlugin: FastifyPluginCallback = function (app, _, done) {
  [authControllers, sessionControllers, boardControllers, userControllers, uploadControllers].forEach(plugin =>
    app.register(fp(plugin)),
  );
  done();
};

export const controllers = fp(controllersPlugin);
