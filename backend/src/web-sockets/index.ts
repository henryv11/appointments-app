import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { uid } from 'rand-token';
import { WebSocket } from '../lib';

const decoder = new TextDecoder('utf-8');
const parseMessage = (message: ArrayBuffer) => JSON.parse(decoder.decode(message));

const webSocketHandlersPlugin: FastifyPluginCallback = function (app, _, done) {
  const connections: Record<string, WebSocket> = {};

  app.ws('/ws', {
    compression: app.wsCompression['32kb'],
    maxPayloadLength: 16 * 1024 * 1024,
    maxBackpressure: 1024,
    idleTimeout: 60,

    open(ws) {
      ws.id = uid(16);
      connections[ws.id] = ws;
      app.log.info(`new websocket ${ws.id} connected`);
    },

    message(ws, message) {
      const parsedMessage = parseMessage(message);
      switch (parsedMessage.type) {
      }
    },

    close(ws, code, message) {
      app.log.info({ code, message: parseMessage(message) }, `websocket ${ws.id} connection closed`);
      delete connections[ws.id];
    },

    drain(ws) {
      // handle backpressure or sth
    },
  });

  done();
};

export const webSocketHandlers = fp(webSocketHandlersPlugin);
