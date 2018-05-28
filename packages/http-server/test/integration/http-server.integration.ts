// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/http-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {RestServer, RestComponent} from '@loopback/rest';
import {Application, ApplicationConfig} from '@loopback/core';
import * as assert from 'assert';

describe('HttpServer', () => {
  it('starts server', async () => {
    const server = await givenAServer();
    await server.start();
    assert(server.listening, 'Server not started');
    await server.stop();
  });

  it('stops server', async () => {
    const server = await givenAServer();
    await server.start();
    await server.stop();
    assert(!server.listening, 'Server not stopped');
  });

  async function givenAServer(options?: ApplicationConfig) {
    const app = new Application(options);
    app.component(RestComponent);
    return await app.getServer(RestServer);
  }
});
