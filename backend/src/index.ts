import { get } from 'config';
import Fastify from 'fastify';
import blipp from 'fastify-blipp';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import swagger from 'fastify-swagger';
import pino from 'pino';
import { database, errors, exitHandlers, handleExit, jwtAuth } from './lib';
import { userService } from './services';

const port: number = get('server.port');

const fastify = Fastify({ logger: pino(get('logger')) })
    .register(exitHandlers)
    .register(errors)
    .register(helmet, get('helmet'))
    .register(cors)
    .register(jwtAuth, get('jwt'))
    .register(swagger, { ...get('swagger') })
    .register(blipp)
    .register(database, get('db'))
    .register(userService);

fastify.ready(err => {
    if (err) return handleExit(undefined, err, 1, fastify);
    fastify.listen(port, () => {
        if (err) return handleExit(undefined, err, 1, fastify);
        fastify.blipp();
        fastify.swagger();
    });
});
