import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { SERVER } from './config';
import { fastify } from './fastify';
import { logger } from './logger';
import { exitHandler } from './process';
import { routes } from './services';

fastify.register(helmet);
fastify.register(cors);

routes.forEach(fastify.route);

process.on('SIGINT', signal => exitHandler(signal, undefined, 0));
process.on('SIGTERM', signal => exitHandler(signal, undefined, 0));
process.on('SIGQUIT', signal => exitHandler(signal, undefined, 0));
process.on('uncaughtException', error => exitHandler(undefined, error, 1));

fastify.listen(SERVER.port, err => {
    if (err) return exitHandler(undefined, err, 1);
    logger.info(`server listening on ${SERVER.port}`);
});
