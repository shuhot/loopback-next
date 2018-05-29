// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {testCoercion} from './utils';

describe('coerce param from string to boolean', () => {
  it("value 'false' is coerced to false", async () => {
    const caller = new Error().stack!.split(/\n/)[1];
    await testCoercion<boolean>({type: 'boolean'}, 'false', false, caller);
  });

  it("value 'true' is coerced to true", async () => {
    const caller = new Error().stack!.split(/\n/)[1];
    await testCoercion<boolean>({type: 'boolean'}, 'true', true, caller);
  });
});
