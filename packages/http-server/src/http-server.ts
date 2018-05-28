// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/http-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createServer, Server} from 'http';
import {RestServer, HttpRequestListener} from '@loopback/rest';
import {AddressInfo} from 'net';
import * as pEvent from 'p-event';

export type HttpOptions = {
  port: number;
  host: string | undefined;
};

export class HttpServer {
  private restServer: RestServer;
  private httpPort: number;
  private httpHost: string | undefined;
  private httpServer: Server;

  constructor(
    restServer: RestServer,
    httpOptions: HttpOptions,
    httpRequestListener: HttpRequestListener,
  ) {
    this.restServer = restServer;
    this.httpPort = httpOptions.port;
    this.httpHost = httpOptions.host;
    this.httpServer = createServer(httpRequestListener);
  }

  public start(): Promise<void> {
    this.httpServer.listen(this.httpPort, this.httpHost);
    return new Promise<void>(async (resolve, reject) => {
      try {
        await pEvent(this.httpServer, 'listening');
        const address = this.httpServer.address() as AddressInfo;
        this.restServer.bind('rest.port').to(address.port);
        resolve();
      } catch (e) {
        reject();
      }
    });
  }

  public stop(): Promise<void> {
    this.httpServer.close();
    return new Promise<void>(async (resolve, reject) => {
      try {
        await pEvent(this.httpServer, 'close');
        resolve();
      } catch (e) {
        reject();
      }
    });
  }
}
