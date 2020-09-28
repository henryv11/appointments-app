import {
    RouteOptions as FastifyRouteOptions,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerBase,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';

export interface RouteOptions<T extends RouteGenericInterface>
    extends FastifyRouteOptions<RawServerBase, RawRequestDefaultExpression, RawReplyDefaultExpression, T> {}
