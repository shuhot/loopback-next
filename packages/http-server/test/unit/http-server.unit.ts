// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/http-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {HttpServer} from '../..';
import {RestServer} from '@loopback/rest';
import {Application} from '@loopback/core';
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

  async function givenAServer() {
    const app = new Application();
    const restServer = new RestServer(app);
    return new HttpServer(restServer, {port: 3000, host: ''}, (req, res) => {});
  }
});
