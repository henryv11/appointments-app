import Boom from '@hapi/boom';
import { FastifyPluginCallback, FastifyRequest, HTTPMethods } from 'fastify';
import fp from 'fastify-plugin';

const formatRequest = ({
  id,
  body,
  query,
  method,
  headers,
  protocol,
  url,
  hostname,
  ip,
  user,
}: FastifyRequest) => ({
  id,
  hostname,
  ip,
  headers,
  protocol,
  body,
  query,
  method,
  url,
  user,
});

const errorsPluginCallback: FastifyPluginCallback = function (app, _, done) {
  const routeMethods: Record<string, Set<HTTPMethods>> = {};
  app
    .decorate('errors', Boom)
    .addHook('onRoute', ({ path, method }) => {
      if (routeMethods[path])
        Array.isArray(method)
          ? method.forEach(routeMethods[path].add)
          : routeMethods[path].add(method);
      else
        routeMethods[path] = new Set(Array.isArray(method) ? method : [method]);
    })
    .setNotFoundHandler(({ url, method }, res) =>
      routeMethods[url] && !routeMethods[url].has(method as HTTPMethods)
        ? res.status(405).send('Method Not Allowed')
        : res.status(404).send('Not Found'),
    )
    .setErrorHandler((error, req, res) =>
      Boom.isBoom(error)
        ? res
            .status(error.output.payload.statusCode)
            .send(error.output.payload.message)
            .log.error({
              error: { stack: error.stack, ...error.output },
              request: formatRequest(req),
            })
        : res
            .status(500)
            .send('Internal Server Error')
            .log.error({ error, request: formatRequest(req) }),
    );
  done();
};

export const errors = fp(errorsPluginCallback);

interface ErrorsInstance {
  errors: typeof Boom;
}

declare module 'fastify' {
  interface FastifyInstance extends ErrorsInstance {}
}
