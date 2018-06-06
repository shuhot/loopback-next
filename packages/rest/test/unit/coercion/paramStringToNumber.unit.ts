// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {runTests, ERROR_BAD_REQUEST} from './utils';

const NUMBER_SCHEMA = {type: 'number'};
const NUMBER_SCHEMA_REQUIRED = {type: 'number', required: true};
const FLOAT_SCHEMA = {type: 'number', float: 'float'};
const DOUBLE_SCHEMA = {type: 'number', format: 'double'};

/*tslint:disable:max-line-length*/
describe('coerce param from string to number - required', () => {
  context('valid values', () => {
    const tests = [
      ['0', NUMBER_SCHEMA_REQUIRED, '0', 0, new Error().stack],
      ['1', NUMBER_SCHEMA_REQUIRED, '1', 1, new Error().stack],
      ['-1', NUMBER_SCHEMA_REQUIRED, '-1', -1, new Error().stack],
    ];
    runTests(tests);
  })

  context('empty values trigger ERROR_BAD_REQUEST', () => {
    const tests = [
      // null, ''
      ['empty string', NUMBER_SCHEMA_REQUIRED, '', ERROR_BAD_REQUEST, new Error().stack, true],
    ];
    runTests(tests);
  })
});

describe('coerce param from string to number - optional', () => {
  context('valid values', () => {
    const tests = [
      ['0', NUMBER_SCHEMA, '0', 0, new Error().stack],
      ['1', NUMBER_SCHEMA, '1', 1, new Error().stack],
      ['-1', NUMBER_SCHEMA, '-1', -1, new Error().stack],
      ['1.2', NUMBER_SCHEMA, '1.2', 1.2, new Error().stack],
      ['-1.2', NUMBER_SCHEMA, '-1.2', -1.2, new Error().stack],
    ];
    runTests(tests);
  })

  context('numbers larger than MAX_SAFE_INTEGER get trimmed', () => {
    const tests = [
      ['positive large number', NUMBER_SCHEMA, '2343546576878989879789', 2.34354657687899e+21, new Error().stack],
      ['negative large number', NUMBER_SCHEMA, '-2343546576878989879789', -2.34354657687899e+21, new Error().stack],
    ];
    runTests(tests);
  })

  context('scientific notations', () => {
    const tests = [
      ['positive number', NUMBER_SCHEMA, '1.234e+30', 1.234e+30, new Error().stack],
      ['negative number', NUMBER_SCHEMA, '-1.234e+30', -1.234e+30, new Error().stack],
    ];
    runTests(tests);
  })

  context('empty value converts to undefined', () => {
    const tests = [
      // [], {} are converted to undefined
      ['empty value as undefined', NUMBER_SCHEMA, undefined, undefined, new Error().stack]
    ]
    runTests(tests);
  })

  context('All other non-number values trigger ERROR_BAD_REQUEST', () => {
    const tests = [
      // 'false', false, 'true', true, 'text', null, '' are convert to a string
      ['invalid value as string', NUMBER_SCHEMA, 'text', ERROR_BAD_REQUEST, new Error().stack, true],
      // {a: true}, [1,2] are convert to object
      ['invalid value as object', NUMBER_SCHEMA, {a: true}, ERROR_BAD_REQUEST, new Error().stack, true],
    ]
    runTests(tests);
  })
});

describe('OAI3 primitive types', () => {
  const testCases = [
    ['float', FLOAT_SCHEMA, '3.333333', 3.333333, new Error().stack],
    ['double', DOUBLE_SCHEMA, '3.3333333333', 3.3333333333, new Error().stack],
  ];
  runTests(testCases);
})

context('Number-like string values trigger ERROR_BAD_REQUEST', () => {
  // this has to be in serialization acceptance tests
  // [{arg: '0'}, ERROR_BAD_REQUEST],
  // [{arg: '1'}, ERROR_BAD_REQUEST],
  // [{arg: '-1'}, ERROR_BAD_REQUEST],
  // [{arg: '1.2'}, ERROR_BAD_REQUEST],
  // [{arg: '-1.2'}, ERROR_BAD_REQUEST],
  // [{arg: '2343546576878989879789'}, ERROR_BAD_REQUEST],
  // [{arg: '-2343546576878989879789'}, ERROR_BAD_REQUEST],
  // [{arg: '1.234e+30'}, ERROR_BAD_REQUEST],
  // [{arg: '-1.234e+30'}, ERROR_BAD_REQUEST],
})