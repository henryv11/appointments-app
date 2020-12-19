import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import uws from 'uWebSockets.js';

const compressionOptions = Object.freeze({
  disabled: uws.DISABLED,
  shared: uws.SHARED_COMPRESSOR,
  dedicated3kb: uws.DEDICATED_COMPRESSOR_3KB,
  dedicated4kb: uws.DEDICATED_COMPRESSOR_4KB,
  dedicated8kb: uws.DEDICATED_COMPRESSOR_8KB,
  dedicated16kb: uws.DEDICATED_COMPRESSOR_16KB,
  dedicated32kb: uws.DEDICATED_COMPRESSOR_32KB,
  dedicated64kb: uws.DEDICATED_COMPRESSOR_64KB,
  dedicated128kb: uws.DEDICATED_COMPRESSOR_128KB,
  dedicated256kb: uws.DEDICATED_COMPRESSOR_256KB,
});

const webSocketServerPlugin: FastifyPluginCallback<WebSocketOptions> = function (app, { sslOptions }, done) {
  let listenSocket: uws.us_listen_socket | undefined;
  const webSocketServer = sslOptions
    ? uws.SSLApp({
        key_file_name: sslOptions.keyFileName,
        cert_file_name: sslOptions.certFileName,
        passphrase: sslOptions.passphrase,
      })
    : uws.App();
  webSocketServer.any('/*', res => res.writeStatus('404 Not Found').end());
  const log = app.log.child({ plugin: 'websocket' });
  const webSocket: FastifyWebSocket = Object.freeze({
    compressionOptions,
    log,
    handler: webSocketServer.ws.bind(webSocketServer),
    listen: (port, cb = () => void 0) =>
      webSocketServer.listen(port, token =>
        token
          ? ((listenSocket = token), log.info('listening at port ' + port), cb())
          : (log.error('failed to listen to port ' + port), cb(new Error('web socket server failed to start'))),
      ),
  });
  app.decorate('webSocket', webSocket);
  app.addHook('onClose', (_, done) => {
    if (listenSocket) uws.us_listen_socket_close(listenSocket), (listenSocket = undefined), log.info('closed');
    done();
  });
  done();
};

export const webSocketServer = fp(webSocketServerPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    webSocket: Readonly<FastifyWebSocket>;
  }
}

interface FastifyWebSocket {
  handler: uws.TemplatedApp['ws'];
  compressionOptions: typeof compressionOptions;
  listen: (port: number, cb?: (err?: Error) => void) => void;
  log: FastifyInstance['log'];
}

interface SSLOptions {
  keyFileName: string;
  certFileName: string;
  passphrase: string;
}

interface WebSocketOptions {
  sslOptions?: SSLOptions;
}

export interface WebSocket extends uws.WebSocket {}
