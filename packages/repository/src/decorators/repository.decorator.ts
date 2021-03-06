// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as assert from 'assert';
import {Model, Entity} from '../model';
import {Repository, DefaultCrudRepository} from '../repositories';
import {DataSource} from '../datasource';
import {juggler} from '../repositories/legacy-juggler-bridge';
import {inject, Context, Injection} from '@loopback/context';
import {Class} from '../common-types';

/**
 * Type definition for decorators returned by `@repository` decorator factory
 */
export type RepositoryDecorator = (
  target: Object,
  key?: string,
  // tslint:disable-next-line:no-any
  descriptorOrIndex?: TypedPropertyDescriptor<any> | number,
) => void;

/**
 * Metadata for a repository
 */
export class RepositoryMetadata {
  /**
   * Name of the predefined repository
   */
  name?: string;
  /**
   * Name of the model
   */
  modelName?: string;
  /**
   * Class of the model
   */
  modelClass?: typeof Entity;
  /**
   * Name of the data source
   */
  dataSourceName?: string;
  /**
   * Instance of the data source
   */
  dataSource?: juggler.DataSource | DataSource;

  /**
   * Constructor for RepositoryMetadata
   *
   * @param modelOrRepo Name or class of the model. If the value is a string and
   * `dataSource` is not present, it will treated as the name of a predefined
   * repository
   * @param dataSource Name or instance of the data source
   *
   * For example:
   *
   * - new RepositoryMetadata(repoName);
   * - new RepositoryMetadata(modelName, dataSourceName);
   * - new RepositoryMetadata(modelClass, dataSourceInstance);
   * - new RepositoryMetadata(modelName, dataSourceInstance);
   * - new RepositoryMetadata(modelClass, dataSourceName);
   */
  constructor(
    modelOrRepo: string | typeof Entity,
    dataSource?: string | juggler.DataSource | DataSource,
  ) {
    this.name =
      typeof modelOrRepo === 'string' && dataSource === undefined
        ? modelOrRepo
        : undefined;
    this.modelName =
      typeof modelOrRepo === 'string' && dataSource != null
        ? modelOrRepo
        : undefined;
    this.modelClass =
      typeof modelOrRepo === 'function' ? modelOrRepo : undefined;
    this.dataSourceName =
      typeof dataSource === 'string' ? dataSource : undefined;
    this.dataSource = typeof dataSource === 'object' ? dataSource : undefined;
  }
}

/**
 * Decorator for repository injections on properties or method arguments
 *
 * ```ts
 * class CustomerController {
 *   @repository(CustomerRepository) public custRepo: CustomerRepository;
 *
 *   constructor(
 *     @repository(ProductRepository) public prodRepo: ProductRepository,
 *   ) {}
 *   // ...
 * }
 * ```
 *
 * @param repositoryName Name of the repo
 */
export function repository(
  repositoryName: string | Class<Repository<Model>>,
): RepositoryDecorator;

/**
 * Decorator for DefaultCrudRepository generation and injection on properties
 * or method arguments based on the given model and dataSource (or their names)
 *
 * ```ts
 * class CustomerController {
 *   @repository('Customer', 'mySqlDataSource')
 *   public custRepo: DefaultCrudRepository<
 *     Customer,
 *     typeof Customer.prototype.id
 *   >;
 *
 *   constructor(
 *     @repository(Product, mySqlDataSource)
 *     public prodRepo: DefaultCrudRepository<
 *       Product,
 *       typeof Product.prototype.id
 *     >,
 *   ) {}
 *   // ...
 * }
 * ```
 *
 * @param model Name/class of the model
 * @param dataSource Name/instance of the dataSource
 */
export function repository(
  model: string | typeof Entity,
  dataSource: string | juggler.DataSource,
): RepositoryDecorator;

export function repository(
  modelOrRepo: string | Class<Repository<Model>> | typeof Entity,
  dataSource?: string | juggler.DataSource,
) {
  const stringOrModel =
    typeof modelOrRepo !== 'string' && modelOrRepo.prototype.execute
      ? modelOrRepo.name
      : (modelOrRepo as typeof Entity);
  const meta = new RepositoryMetadata(stringOrModel, dataSource);
  return function(
    target: Object,
    key?: string,
    // tslint:disable-next-line:no-any
    descriptorOrIndex?: TypedPropertyDescriptor<any> | number,
  ) {
    if (key || typeof descriptorOrIndex === 'number') {
      if (meta.name) {
        // Make it shortcut to `@inject('repositories.MyRepo')`
        // Please note key is undefined for constructor. If strictNullChecks
        // is true, the compiler will complain as reflect-metadata won't
        // accept undefined or null for key. Use ! to fool the compiler.
        inject('repositories.' + meta.name, meta)(
          target,
          key!,
          descriptorOrIndex,
        );
      } else {
        // Use repository-factory to create a repository from model + dataSource
        inject('', meta, resolve)(target, key!, descriptorOrIndex);
      }
      return;
    }
    // Mixin repository into the class
    throw new Error('Class level @repository is not implemented');
  };
}

/**
 * Resolve the @repository injection
 * @param ctx Context
 * @param injection Injection metadata
 */
async function resolve(ctx: Context, injection: Injection) {
  const meta = injection.metadata as RepositoryMetadata;
  let modelClass = meta.modelClass;
  if (meta.modelName) {
    modelClass = (await ctx.get('models.' + meta.modelName)) as typeof Entity;
  }
  if (!modelClass) {
    throw new Error(
      'Invalid repository config: ' +
        ' neither modelClass nor modelName was specified.',
    );
  }

  let dataSource = meta.dataSource;
  if (meta.dataSourceName) {
    dataSource = await ctx.get<DataSource>(
      'datasources.' + meta.dataSourceName,
    );
  }
  assert(
    dataSource instanceof juggler.DataSource,
    'DataSource must be provided',
  );
  return new DefaultCrudRepository(
    modelClass,
    dataSource! as juggler.DataSource,
  );
}
