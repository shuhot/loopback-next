// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {juggler, DataSource} from '@loopback/repository';

export class DbDataSource extends juggler.DataSource {
  constructor(@inject('datasources.config.db') dsConfig: DataSource) {
    super(dsConfig);
  }
}
