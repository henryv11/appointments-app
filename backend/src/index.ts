import { get } from 'config';
import Fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import swagger from 'fastify-swagger';
import pino from 'pino';
import { controllers } from './controllers';
import { database, errors, exitHandler, grpcServer, healthCheck, jwtAuth, webSocketServer } from './lib';
import { grpcControllers } from './proto';
import { repositories } from './repositories';
import { services } from './services';
import { webSocketController } from './web-socket';

const app = Fastify({ logger: pino(get('logger')) })
  .register(exitHandler)
  .register(errors)
  .register(database, get('db'))
  .register(helmet, get('helmet'))
  .register(cors)
  .register(jwtAuth, get('jwt'))
  .register(healthCheck)
  .register(webSocketServer, get('webSocket'))
  .register(grpcServer)
  .register(swagger, { ...get('docs') })
  .register(repositories)
  .register(services)
  .register(controllers)
  .register(webSocketController)
  .register(grpcControllers);

app.ready(err =>
  err
    ? app.exit(1, err)
    : (app.grpc.listen('0.0.0.0', 30000, err => err && app.exit(1, err)),
      app.webSocket.listen(9000, err => err && app.exit(1, err)),
      app.listen(get('server.port'), get('server.host'), err =>
        err ? app.exit(1, err) : app.log.info(app.printRoutes()),
      )),
);
