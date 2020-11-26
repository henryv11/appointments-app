import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

//#region [Plugin]

const fastifyUtilPlugin: FastifyPluginCallback = function (app, _, done) {
  // const registerController: RegisterContoller = function (path, opts, controller) {
  //   app[opts.method](path, opts, controller as RouteHandlerMethod);
  // };
  const registerService: RegisterService = function (name, services) {
    app.decorate(name, services);
    Object.values(app[name] as Record<string, FastifyService>).forEach(service => service.register(app));
  };
  // app.decorate('registerController', registerController);
  app.decorate('registerService', registerService);
  done();
};

export const fastifyUtil = fp(fastifyUtilPlugin);

//#endregion
//#region [Declaration merging]

declare module 'fastify' {
  interface FastifyInstance {
    registerService: RegisterService;
    // registerController: RegisterContoller;
  }
}

//#endregion

//#region [Types]

interface RegisterService {
  (name: keyof FastifyInstance, services: Record<string, FastifyService>): void;
}

// type RegisterContoller<
//   Body extends TObject<TProperties> = TObject<TProperties>,
//   Params extends TObject<TProperties> = TObject<TProperties>,
//   Querystring extends TObject<TProperties> = TObject<TProperties>,
//   Reply extends TObject<TProperties> = TObject<TProperties>
// > = {
//   (
//     path: string,
//     opts: {
//       method: 'get' | 'head' | 'post' | 'put' | 'delete' | 'options' | 'patch' | 'all';
//       schema?: Partial<{ body: Body; params: Params; querystring: Querystring; response: Record<number, Reply> }> &
//         RouteShorthandOptions['schema'];
//     } & RouteShorthandOptions,
//     controller: (
//       req: FastifyRequest<{ Body: Static<Body>; Params: Static<Params>; Querystring: Static<Querystring> }>,
//       res: FastifyReply<FastifyInstance['server']>,
//     ) => Promise<Static<Reply>> | Static<Reply>,
//   ): void;
// };

export interface FastifyService {
  register(app: FastifyInstance): void;
}

//#endregion
