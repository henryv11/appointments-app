import { get } from 'config';
import Fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import swagger from 'fastify-swagger';
import pino from 'pino';
import { database, errors, exitHandler, handleExit, healthCheck, jwtAuth } from './lib';
import { repositories } from './repositories';
import { routes } from './routes';
import { services } from './services';

const app = Fastify({ logger: pino(get('logger')) })
    .register(exitHandler)
    .register(errors)
    .register(database, get('db'))
    .register(helmet, get('helmet'))
    .register(cors)
    .register(jwtAuth, get('jwt'))
    .register(healthCheck)
    .register(swagger, { ...get('docs') })
    .register(repositories)
    .register(services)
    .register(routes);

app.ready(err => {
    if (err) return handleExit(undefined, err, 1, app);
    app.listen(get('server.port'), get('server.host'), () => {
        if (err) return handleExit(undefined, err, 1, app);
        app.log.info(app.swagger({ yaml: true }));
        app.log.info(app.printRoutes());
    });
});
