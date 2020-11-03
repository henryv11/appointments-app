import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const grpcControllerPlugin: FastifyPluginCallback = function (app, _, done) {
  // const packageDef = app.grpc.loadProto('');
  // app.grpc.addService(packageDef.TestService.prototype, {});
  done();
};

export const grpcController = fp(grpcControllerPlugin);
