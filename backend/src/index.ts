import { get } from 'config';
import Fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import swagger from 'fastify-swagger';
import pino from 'pino';
import { database, errors, exitHandlers, handleExit, jwtAuth } from './lib';
import { repositories } from './repositories';
import { services } from './services';

const app = Fastify({ logger: pino(get('logger')) })
    .register(exitHandlers)
    .register(errors)
    .register(helmet, get('helmet'))
    .register(cors)
    .register(jwtAuth, get('jwt'))
    .register(swagger, { ...get('docs') })
    .register(repositories)
    .register(services)
    .register(database, get('db'));

app.ready(err => {
    if (err) return handleExit(undefined, err, 1, app);
    app.listen(get('server.port'), get('server.host'), () => {
        if (err) return handleExit(undefined, err, 1, app);
        app.log.info(app.swagger({ yaml: true }));
        app.log.info(app.printRoutes());
    });
});
