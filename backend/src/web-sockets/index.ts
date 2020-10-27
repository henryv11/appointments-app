import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const webSocketHandlersPlugin: FastifyPluginCallback = function (app, _, done) {
  app.ws('/ws', {
    compression: app.wsCompression['32kb'],
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60,

    open(ws) {
      ws.subscribe('');
    },

    message(ws, message, isBinary) {
      //
    },

    close(ws, code, message) {
      //
    },

    drain(ws) {
      //
    },

    ping(ws) {
      //
    },

    pong(ws) {
      //
    },
  });

  done();
};

export const webSocketHandlers = fp(webSocketHandlersPlugin);
