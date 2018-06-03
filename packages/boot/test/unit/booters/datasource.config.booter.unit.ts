// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect, TestSandbox} from '@loopback/testlab';
import {resolve} from 'path';
import {writeFile} from 'fs';
import {promisify} from 'util';
import {DataSourceConfigBooter, DataSourceConfigDefaults} from '../../../src';
import {Application} from '@loopback/core';

const writeFileAsync = promisify(writeFile);

describe('datasource config booter unit tests', () => {
  const SANDBOX_PATH = resolve(__dirname, './.sandbox');
  const sandbox = new TestSandbox(SANDBOX_PATH);

  const DATASOURCES_CONFIG_PREFIX = 'datasources.config';
  const DATASOURCES_CONFIG_TAG = 'datasource:config';

  let app: Application;

  beforeEach('reset sandbox', () => sandbox.reset());
  beforeEach(getApp);

  it(`uses DataSourceConfigDefaults for 'options' if none are given`, () => {
    const booterInst = new DataSourceConfigBooter(app, SANDBOX_PATH);
    expect(booterInst.options).to.deepEqual(DataSourceConfigDefaults);
  });

  it('overrides defaults with provided options and uses defaults for the rest', () => {
    const options = {
      dirs: ['test'],
      extensions: ['.ext1'],
    };
    const expected = Object.assign({}, options, {
      nested: DataSourceConfigDefaults.nested,
    });

    const booterInst = new DataSourceConfigBooter(app, SANDBOX_PATH, options);
    expect(booterInst.options).to.deepEqual(expected);
  });

  it('binds datasource config during the load phase', async () => {
    const file = resolve(SANDBOX_PATH, 'test.datasource.json');
    const expected = [`${DATASOURCES_CONFIG_PREFIX}.test`];

    await writeFileAsync(file, JSON.stringify({name: 'test'}));
    const booterInst = new DataSourceConfigBooter(app, SANDBOX_PATH);
    booterInst.discovered = [file];
    await booterInst.load();

    const datasources = app.findByTag(DATASOURCES_CONFIG_TAG);
    const keys = datasources.map(binding => binding.key);
    expect(keys).to.have.lengthOf(1);
    expect(keys).to.eql(expected);
    expect(await app.get(keys[0])).to.eql({name: 'test'});
  });

  it(`throws an error if DataSource config is missing 'name' property`, async () => {
    const file = resolve(SANDBOX_PATH, 'test.datasource.json');

    await writeFileAsync(file, JSON.stringify({random: 'property'}));
    const booterInst = new DataSourceConfigBooter(app, SANDBOX_PATH);
    booterInst.discovered = [file];

    expect(booterInst.load()).to.be.rejectedWith(
      /Property 'name' must be defined in/,
    );
  });

  function getApp() {
    app = new Application();
  }
});
