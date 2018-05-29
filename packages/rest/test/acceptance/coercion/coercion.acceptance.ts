import {
  supertest,
  createClientForHandler,
  sinon,
  SinonSpy,
} from '@loopback/testlab';
import {RestApplication, RestServer, get, param} from '../../..';

describe('Coercion', () => {
  let app: RestApplication;
  let server: RestServer;
  let client: supertest.SuperTest<supertest.Test>;

  before(givenAnApplication);
  before(givenAServer);
  before(givenAClient);

  after(async () => {
    await app.stop();
  });

  class MyController {
    @get('/create-number-from-path/{num}')
    createNumberFromPath(@param.path.number('num') num: number) {
      return num;
    }

    @get('/create-number-from-query')
    createNumberFromQuery(@param.query.number('num') num: number) {
      return num;
    }

    @get('/create-number-from-header')
    createNumberFromHeader(@param.header.number('num') num: number) {
      return num;
    }
  }

  it('coerces parameter in path from string to number', async () => {
    const spy = sinon.spy(MyController.prototype, 'createNumberFromPath');
    await client.get('/create-number-from-path/100').expect(200);
    assertCoercion(spy);
  });

  it('coerces parameter in header from string to number', async () => {
    const spy = sinon.spy(MyController.prototype, 'createNumberFromHeader');
    await client.get('/create-number-from-header').set({num: 100});
    assertCoercion(spy);
  });

  it('coerces parameter in query from string to number', async () => {
    const spy = sinon.spy(MyController.prototype, 'createNumberFromQuery');
    await client
      .get('/create-number-from-query')
      .query({num: 100})
      .expect(200);
    assertCoercion(spy);
  });

  function assertCoercion(spy: SinonSpy) {
    sinon.assert.calledWithExactly(spy, 100);
    sinon.assert.neverCalledWith(spy, '100');
  }

  async function givenAnApplication() {
    app = new RestApplication();
    app.controller(MyController);
    await app.start();
  }

  async function givenAServer() {
    server = await app.getServer(RestServer);
  }

  async function givenAClient() {
    client = await createClientForHandler(server.requestHandler);
  }
});
