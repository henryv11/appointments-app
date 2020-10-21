import Boom from '@hapi/boom';
import { FastifyPluginCallback, FastifyRequest, HTTPMethods } from 'fastify';
import fp from 'fastify-plugin';

const errorsPluginCallback: FastifyPluginCallback = function (app, _, done) {
  const routeMethods: Record<string, Set<HTTPMethods>> = {};
  app.decorate('errors', Boom);
  app.addHook(
    'onRoute',
    ({ path, method }) => (
      routeMethods[path]
        ? new Array<HTTPMethods>().concat(method).forEach(method => routeMethods[path].add(method))
        : (routeMethods[path] = new Set(([] as HTTPMethods[]).concat(method))),
      void 0
    ),
  );
  app.setNotFoundHandler((req, res) =>
    routeMethods[req.url] && !routeMethods[req.url].has(req.method as HTTPMethods)
      ? res.status(405).send('Method Not Allowed')
      : res.status(404).send('Not Found'),
  );
  app.setErrorHandler((error, req, res) =>
    Boom.isBoom(error)
      ? res
          .status(error.output.payload.statusCode)
          .send(error.output.payload.message)
          .log.error({
            error: { stack: error.stack, ...error.output },
            request: formatRequest(req),
          })
      : (error.validation
          ? res.status(422).send(error.validation)
          : res.status(500).send('Internal Server Error')
        ).log.error({ error, request: formatRequest(req) }),
  );
  done();
};

const formatRequest = ({ id, body, query, method, headers, url, hostname, ip, user }: FastifyRequest) => ({
  id,
  hostname,
  ip,
  headers,
  body,
  query,
  method,
  url,
  user,
});

export const errors = fp(errorsPluginCallback);

declare module 'fastify' {
  interface FastifyInstance extends ErrorsInstance {}
}

interface ErrorsInstance {
  errors: typeof Boom;
}
