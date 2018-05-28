// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/http-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {HttpServer} from '../..';
import {RestServer, RestComponent, RestBindings} from '@loopback/rest';
import {Application, ApplicationConfig} from '@loopback/core';
import {expect, createClientForHandler} from '@loopback/testlab';

describe('HttpServer', () => {
  // it('updates rest.port binding when listening on ephemeral port', async () => {
  //   const server = await givenAServer();
  //   await server.start();
  //   expect(server.getSync(RestBindings.PORT)).to.be.above(0);
  //   await server.stop();
  // });
  // it('stops the HTTP server', async () => {});
  // async function givenAServer(options?: ApplicationConfig) {
  //   const app = new Application(options);
  //   app.component(RestComponent);
  //   return await app.getServer(RestServer);
  // }
});
