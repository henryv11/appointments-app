import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import uws from 'uWebSockets.js';

const compressionOptions = {
  disabled: uws.DISABLED,
  shared: uws.SHARED_COMPRESSOR,
  '3kb': uws.DEDICATED_COMPRESSOR_3KB,
  '4kb': uws.DEDICATED_COMPRESSOR_4KB,
  '8kb': uws.DEDICATED_COMPRESSOR_8KB,
  '16kb': uws.DEDICATED_COMPRESSOR_16KB,
  '32kb': uws.DEDICATED_COMPRESSOR_32KB,
  '64kb': uws.DEDICATED_COMPRESSOR_64KB,
  '128kb': uws.DEDICATED_COMPRESSOR_128KB,
  '256kb': uws.DEDICATED_COMPRESSOR_256KB,
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
  app.decorate('ws', socketServer.ws);
  app.decorate('wsCompression', compressionOptions);
  app.addHook('onReady', done => {
    socketServer.listen(port, token => {
      if (token) (listenSocket = token), app.log.info(`web socket listening to port ${port}`);
      else app.log.error(`web socket failed to listen ${port}`);
      done();
    });
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
    ws: uws.TemplatedApp['ws'];
    wsCompression: typeof compressionOptions;
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
