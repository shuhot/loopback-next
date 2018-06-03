---
lang: en
title: 'DataSources'
keywords: LoopBack 4.0, LoopBack 4
tags:
sidebar: lb4_sidebar
permalink: /doc/en/lb4/DataSources.html
summary:
---

## Overview

A `DataSource` in LoopBack 4 is a named configuration for a Connector instance
that represents data in an external system. The Connector is used by
`legacy-juggler-bridge` to power LoopBack 4 Repositories for Data operations.

### Creating a DataSource

It is recommended to use the `lb4 datasource` [command](DataSource-generator.html)
provided by the CLI to generate a DataSource. The CLI will prompt for all necessary connector information and create the following files:

- `${connector.name}.datasource.json` containing the connector configuration
- `${connector.name}.datasource.ts` containing a class extending `juggler.DataSource`. This class can be used to override the default DataSource
behaviour programaticaly. Note: The connector configuration stored in the `.json`
file is injected into this class using [Dependency Injection](Dependency-inecjtion.html).

Both the above files are generated in `src/datasources/` directory by the CLI. It
will also update `src/datasources/index.ts` to export the new DataSource class.

Example DataSource Class:

```ts
import {inject} from '@loopback/core';
import {juggler, DataSource} from '@loopback/repository';

export class DbDataSource extends juggler.DataSource {
  constructor(@inject('datasources.config.db') dsConfig: DataSource) {
    super(dsConfig);
  }
}
```
