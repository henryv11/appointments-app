import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { uid } from 'rand-token';
import { WebSocket } from '../lib';

const decoder = new TextDecoder('utf-8');
function parseMessage(message: ArrayBuffer) {
  const decoded = decoder.decode(message);
  if (decoded[0] === '{')
    try {
      return { message: undefined, payload: JSON.parse(decoded) };
    } catch {}
  return { message: decoded, payload: undefined };
}

const webSocketControllerPlugin: FastifyPluginCallback = function (app, _, done) {
  const connections: Record<string, WebSocket> = {};

  app.ws('/*', {
    compression: app.wsCompression['32kb'],
    maxPayloadLength: 16 * 1024 * 1024,
    maxBackpressure: 1024,
    idleTimeout: 30,

    upgrade(res, req, context) {
      res.upgrade(
        {
          url: req.getUrl(),
          id: uid(16),
        },
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context,
      );
    },

    open(ws) {
      connections[ws.id] = ws;
      app.log.info(`new websocket "${ws.id}" connected`);
    },

    message(ws, messageBuffer) {
      const { message, payload } = parseMessage(messageBuffer);
      app.log.info(`message from websocket "${ws.id}" message: "${message || JSON.stringify(payload)}"`);
      const type = message || payload.type;

      switch (type) {
        case 'ping':
          ws.send('pong');
      }
    },

    close(ws, code, message) {
      app.log.info({ code, message: decoder.decode(message) }, `websocket "${ws.id}" connection closed`);
      delete connections[ws.id];
    },

    drain(ws) {
      app.log.info(`backpressure drain on websocket "${ws.id}" bufferedAmount: "${ws.getBufferedAmount()}"`);
      // handle backpressure or sth
    },

    ping(ws) {
      app.log.info(`ping from websocket "${ws.id}"`);
    },

    pong(ws) {
      app.log.info(`pong to websocket "${ws.id}"`);
    },
  });

  done();
};

export const webSocketController = fp(webSocketControllerPlugin);