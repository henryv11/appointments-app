import { get } from 'config';
import Fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import swagger from 'fastify-swagger';
import pino from 'pino';
import { controllers } from './controllers';
import { database, errors, exitHandler, handleExit, healthCheck, jwtAuth, webSocketServer } from './lib';
import { repositories } from './repositories';
import { services } from './services';

const app = Fastify({ logger: pino(get('logger')) })
  .register(exitHandler)
  .register(errors)
  .register(database, get('db'))
  .register(helmet, get('helmet'))
  .register(cors)
  .register(jwtAuth, get('jwt'))
  .register(healthCheck)
  .register(webSocketServer, get('webSocket'))
  .register(swagger, { ...get('docs') })
  .register(repositories)
  .register(services)
  .register(controllers);

app.ready(err =>
  err
    ? handleExit(undefined, err, 1, app)
    : app.listen(get('server.port'), get('server.host'), err =>
        err ? handleExit(undefined, err, 1, app) : app.log.info(app.printRoutes()),
      ),
);
