import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { parse } from 'querystring';
import { uid } from 'rand-token';
import { WebSocket } from '../lib';

const webSocketControllerPlugin: FastifyPluginCallback = function (app, _, done) {
  const connections: Record<string, WebSocket> = {};
  const decoder = new TextDecoder('utf-8');
  function parseMessage(message: ArrayBuffer) {
    const decoded = decoder.decode(message);
    if (decoded[0] === '{')
      try {
        return JSON.parse(decoded);
      } catch {}
    return { message: decoded };
  }

  app.webSocket.handler('/*', {
    compression: app.webSocket.compressionOptions.shared,
    maxPayloadLength: 16 * 1024 * 1024,
    maxBackpressure: 1024,
    idleTimeout: 30,

    upgrade(res, req, context) {
      const url = '/' + req.getUrl().replace(/(^\/+|\/+$)/, '');
      const query = parse(req.getQuery());
      const { token } = query;
      let user;
      try {
        user = app.jwt.decode(token as string);
      } catch (error) {
        app.webSocket.log.error(error, 'websocket upgrade request failed to authorize');
        return res.writeStatus('401 Unauthorized').end();
      }
      res.upgrade(
        {
          url,
          query,
          user,
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
      app.webSocket.log.info(`new websocket ${ws.id} connected`);
    },

    message(ws, messageBuffer) {
      const payload = parseMessage(messageBuffer);
      app.webSocket.log.info(`message from websocket ${ws.id} payload: ${JSON.stringify(payload)}`);

      switch (payload.message) {
        case 'ping':
          ws.send('pong');
        case 'hello':
          ws.send('hello');
      }
    },

    close(ws, code, message) {
      app.webSocket.log.info({ code, message: decoder.decode(message) }, `websocket ${ws.id} connection closed`);
      delete connections[ws.id];
    },

    drain(ws) {
      app.webSocket.log.info(`backpressure drain on websocket ${ws.id} bufferedAmount: ${ws.getBufferedAmount()}`);
    },

    ping(ws) {
      app.webSocket.log.info(`ping from websocket ${ws.id}`);
    },

    pong(ws) {
      app.webSocket.log.info(`pong to websocket ${ws.id}`);
    },
  });

  done();
};

export const webSocketController = fp(webSocketControllerPlugin);
