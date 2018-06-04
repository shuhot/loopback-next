// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {runTests} from './utils';

describe('coerce param from string to boolean', () => {
  /*tslint:disable:max-line-length*/
  const testCases = [
    ['false', {type: 'boolean'}, 'false', false, new Error().stack],
    ['true', {type: 'boolean'}, 'true', true, new Error().stack],
  ];

  runTests(testCases);
});
