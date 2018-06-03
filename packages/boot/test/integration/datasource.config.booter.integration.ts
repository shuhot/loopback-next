// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect, TestSandbox} from '@loopback/testlab';
import {resolve} from 'path';
import {BooterApp} from '../fixtures/application';
import {promisify} from 'util';
import {writeFile} from 'fs';

const writeFileAsync = promisify(writeFile);

describe('datasource config booter integration tests', () => {
  const SANDBOX_PATH = resolve(__dirname, '../../.sandbox');
  const sandbox = new TestSandbox(SANDBOX_PATH);

  const DATASOURCES_CONFIG_PREFIX = 'datasources.config';
  const DATASOURCES_CONFIG_TAG = 'datasource:config';

  const config = {name: 'test'};

  let app: BooterApp;

  beforeEach('reset sandbox', () => sandbox.reset());
  beforeEach(getApp);

  it('boots datasources when app.boot() is called', async () => {
    const expectedBindings = [`${DATASOURCES_CONFIG_PREFIX}.test`];

    await app.boot();

    const bindings = app.findByTag(DATASOURCES_CONFIG_TAG).map(b => b.key);
    expect(bindings.sort()).to.eql(expectedBindings.sort());
    expect(await app.get(bindings[0])).to.eql(config);
  });

  async function getApp() {
    await sandbox.copyFile(resolve(__dirname, '../fixtures/application.js'));
    await sandbox.mkdir('datasources');
    await writeFileAsync(
      resolve(SANDBOX_PATH, 'datasources/test.datasource.json'),
      JSON.stringify(config),
    );

    const MyApp = require(resolve(SANDBOX_PATH, 'application.js')).BooterApp;
    app = new MyApp();
  }
});
