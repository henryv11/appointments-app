import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { ITestServiceServer, TestServiceService } from './generated/test_grpc_pb';
export { grpcControllers };

const registerGrpcControllersPlugin: FastifyPluginCallback = function (app, _, done) {
  app.grpc.addService<ITestServiceServer>(TestServiceService, {
    test() {
      //
    },
  });
  done();
};

const grpcControllers = fp(registerGrpcControllersPlugin);
