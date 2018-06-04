// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {runTests} from './utils';

describe('coerce param from string to buffer', () => {
  const testValues = {
    base64: Buffer.from('Hello World').toString('base64')
  }
  /*tslint:disable:max-line-length*/
  const testCases = [
    ['base64', {type: 'string', format: 'byte'}, testValues.base64, Buffer.from(testValues.base64, 'base64'), new Error().stack!],
  ];

  runTests(testCases);
});
