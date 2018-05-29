// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  SchemaObject,
  ReferenceObject,
  isReferenceObject,
} from '@loopback/openapi-v3-types';

import * as HttpErrors from 'http-errors';

/**
 * Coerce the http raw data to a JavaScript type data of a parameter
 * according to its OpenAPI schema specification.
 *
 * @param data The raw data get from http request
 * @param schema The parameter's schema defined in OpenAPI specification
 */
export function coerceParameter(
  data: string,
  schema?: SchemaObject | ReferenceObject,
) {
  // ignore reference schema
  if (!schema || isReferenceObject(schema)) return data;
  let coercedResult;
  coercedResult = data;
  const OAIType = getOAIPrimitiveType(schema.type, schema.format);

  // Review Note: [Validation place 1] Validation rules can be applied for each case
  switch (OAIType) {
    case 'byte':
      coercedResult = Buffer.from(data, 'base64');
      break;
    case 'date':
      coercedResult = new Date(data);
      break;
    case 'float':
    case 'double':
      coercedResult = parseFloat(data);
      break;
    case 'number':
    case 'long':
      coercedResult = Number(data);
      break;
    case 'integer':
      coercedResult = parseInt(data);
      break;
    case 'boolean':
      coercedResult = isTrue(data) ? true : false;
    case 'string':
    case 'password':
    // serizlize will be supported in next PR
    case 'serialize':
      break;
    case 'unknownType':
    default:
      throw new HttpErrors.NotImplemented(
        `Type ${schema.type} with format ${
          schema.format
        } is not a valid OpenAPI schema`,
      );
  }
  return coercedResult;
}

/**
 * A set of truthy values. A data in this set will be coerced to `true`,
 * otherwise coerced to `false`.
 *
 * @param data The raw data get from http request
 * @returns The corresponding coerced boolean type
 */

function isTrue(data: string): boolean {
  const isTrueSet = ['true', '1', true, 1];
  return isTrueSet.includes(data);
}

/**
 * Return the corresponding OpenAPI data type given an OpenAPI schema
 *
 * @param type The type in an OpenAPI schema specification
 * @param format The format in an OpenAPI schema specification
 */

function getOAIPrimitiveType(type?: string, format?: string) {
  // Review Note: [Validation place 2] Validation rules can be applied for each case
  let OAIType: string = 'unknownType';
  // serizlize will be supported in next PR
  if (type === 'object' || type === 'array') OAIType = 'serialize';
  if (type === 'string') {
    switch (format) {
      case 'byte':
        OAIType = 'byte';
        break;
      case 'binary':
        OAIType = 'binary';
        break;
      case 'date':
        OAIType = 'date';
        break;
      case 'date-time':
        OAIType = 'date-time';
        break;
      case 'password':
        OAIType = 'password';
        break;
      default:
        OAIType = 'string';
        break;
    }
  }
  if (type === 'boolean') OAIType = 'boolean';
  if (type === 'number')
    OAIType =
      format === 'float' ? 'float' : format === 'double' ? 'double' : 'number';
  if (type === 'integer') OAIType = format === 'int64' ? 'long' : 'integer';
  return OAIType;
}
