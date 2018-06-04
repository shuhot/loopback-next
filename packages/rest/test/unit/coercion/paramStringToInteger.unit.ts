// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {runTests} from './utils';

describe('coerce param from string to integer', () => {
  /*tslint:disable:max-line-length*/
  const testCases = [
    ['integer', {type: 'integer', format: 'int32'}, '100', 100, new Error().stack!],
    ['long', {type: 'integer', format: 'int64'}, '9223372036854775807', 9223372036854775807, new Error().stack!],
  ]
  runTests(testCases);
});
