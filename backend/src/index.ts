import { get as config } from 'config';
import Fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import swagger from 'fastify-swagger';
import pino from 'pino';
import { controllers } from './controllers';
import { grpcControllers } from './grpc';
import { database, errors, exitHandler, fastifyUtils, grpcServer, healthCheck, jwtAuth, webSocketServer } from './lib';
import { repositories } from './repositories';
import { services } from './services';
import { webSocketController } from './web-socket';

const app = Fastify({ logger: pino(config('logger')) })
  .register(exitHandler)
  .register(fastifyUtils)
  .register(errors)
  .register(fastifyMultipart)
  .register(database, config('db'))
  .register(helmet, config('helmet'))
  .register(cors)
  .register(jwtAuth, config('jwt'))
  .register(healthCheck)
  .register(webSocketServer, config('webSocket'))
  .register(grpcServer)
  .register(swagger, { ...config('docs') })
  .register(repositories)
  .register(services)
  .register(controllers)
  .register(webSocketController)
  .register(grpcControllers);

app.ready(error => {
  if (error) return app.exit(1, error);
  app.grpc.listen('0.0.0.0', 30000, error => {
    if (error) return app.exit(1, error);
    app.webSocket.listen(9000, error => {
      if (error) return app.exit(1, error);
      app.listen(config('server.port'), config('server.host'), error => {
        if (error) return app.exit(1, error);
        app.log.info(app.printRoutes());
      });
    });
  });
});
