// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {runTests} from './utils';

describe('coerce param from string to number', () => {
  /*tslint:disable:max-line-length*/
  const testCases = [
    ['float', {type: 'number', format: 'float'}, '3.333333', 3.333333, new Error().stack!],
    ['double', {type: 'number', format: 'double'}, '3.3333333333', 3.3333333333, new Error().stack!],
  ];

  runTests(testCases);
});
