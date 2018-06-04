// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {runTests} from './utils';

describe('coerce param from string to date', () => {
  /*tslint:disable:max-line-length*/
  const testCases = [
    ['date', {type: 'string', format: 'date'}, '2015-03-01', new Date('2015-03-01'), new Error().stack!],
  ];

  runTests(testCases);
});
