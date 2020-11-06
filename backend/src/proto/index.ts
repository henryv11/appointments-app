import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { ITestServiceServer, TestServiceService } from './test_grpc_pb';

const registerGrpcControllersPlugin: FastifyPluginCallback = function (app, _, done) {
  app.grpc.addService<ITestServiceServer>(TestServiceService, {
    test() {
      //
    },
  });
  done();
};

export const grpcControllers = fp(registerGrpcControllersPlugin);
