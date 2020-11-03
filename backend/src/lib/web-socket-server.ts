import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import uws from 'uWebSockets.js';

const compressionOptions = {
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
};

const webSocketServerPlugin: FastifyPluginCallback<WebSocketOptions> = function (app, { port, sslOptions }, done) {
  let listenSocket: uws.us_listen_socket | undefined;
  const socketServer = sslOptions
    ? uws.SSLApp({
        key_file_name: sslOptions.keyFileName,
        cert_file_name: sslOptions.certFileName,
        passphrase: sslOptions.passphrase,
      })
    : uws.App();
  socketServer.any('/*', res => res.writeStatus('404 Not Found').end());
  app.decorate('webSocket', { handler: socketServer.ws.bind(socketServer), compressionOptions });
  app.addHook('onReady', done => {
    socketServer.listen(port, token => {
      if (token) (listenSocket = token), app.log.info(`web socket server listening at port "${port}"`);
      else app.log.error(`web socket server failed to listen ${port}`);
    });
    done();
  });
  app.addHook('onClose', (app, done) => {
    if (listenSocket)
      uws.us_listen_socket_close(listenSocket), (listenSocket = undefined), app.log.info('web socket server closed');
    done();
  });
  done();
};

export const webSocketServer = fp(webSocketServerPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    webSocket: { handler: uws.TemplatedApp['ws']; compressionOptions: typeof compressionOptions };
  }
}

interface SSLOptions {
  keyFileName: string;
  certFileName: string;
  passphrase: string;
}

interface WebSocketOptions {
  port: number;
  sslOptions?: SSLOptions;
}

export interface WebSocket extends uws.WebSocket {}
