import { loadSync, Options } from '@grpc/proto-loader';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { GrpcObject, loadPackageDefinition, Server, ServerCredentials } from 'grpc';

const grpcServerPlugin: FastifyPluginCallback = function (app, _, done) {
  const grpcServer = new Server();
  const grpc: FastifyGrpc = {
    addService: grpcServer.addService.bind(grpcServer),
    register: grpcServer.register.bind(grpcServer),
    loadProto: (filename: string, opts) =>
      loadPackageDefinition(
        loadSync(filename, {
          keepCase: true,
          longs: String,
          enums: String,
          arrays: true,
          ...opts,
        }),
      ),
    listen(host, port, cb = () => void 0) {
      try {
        grpcServer.bind(`${host}:${port}`, ServerCredentials.createInsecure());
        grpcServer.start();
        app.log.info(`grpc server listening at "${host}:${port}"`);
        cb();
      } catch (error) {
        app.log.error(error, `failed to start grpc server`);
        cb(error);
      }
    },
  };
  app.decorate('grpc', grpc);
  app.addHook(
    'onClose',
    (app, done) => (app.log.info('shutting down grpc server ...'), grpcServer.tryShutdown(() => done())),
  );
  done();
};

export const grpcServer = fp(grpcServerPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    grpc: FastifyGrpc;
  }
}

interface FastifyGrpc {
  addService: Server['addService'];
  register: Server['register'];
  loadProto: (filename: string, opts?: Options) => GrpcObject;
  listen: (host: string, port: number, cb?: (error?: Error) => void) => void;
}
