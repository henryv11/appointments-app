import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

//#region [Plugin]

const fastifyUtilsPlugin: FastifyPluginCallback = function (app, _, done) {
  const registerServices: RegisterServices = function (name, services) {
    app.decorate(name, services);
    Object.values(app[name]).forEach(service => service.register(app));
  };
  app.decorate('registerServices', registerServices);
  done();
};

export const fastifyUtils = fp(fastifyUtilsPlugin);

//#endregion

//#region [Declaration merging]

declare module 'fastify' {
  interface FastifyInstance {
    registerServices: RegisterServices;
  }
}

//#endregion

//#region [Types]

type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];

type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;

type ServicesObject = Readonly<Record<string, FastifyService>>;

interface RegisterServices {
  (name: keyof SubType<FastifyInstance, ServicesObject>, services: ServicesObject): void;
}

export interface FastifyService {
  register(app: FastifyInstance): void;
}

//#endregion
