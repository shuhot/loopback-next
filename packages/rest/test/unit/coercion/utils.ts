import {
  OperationObject,
  ParameterObject,
  SchemaObject,
} from '@loopback/openapi-v3-types';

import {
  ShotRequestOptions,
  expect,
  stubExpressContext,
} from '@loopback/testlab';

import {
  PathParameterValues,
  Request,
  Route,
  createResolvedRoute,
  parseOperationArgs,
  ResolvedRoute,
} from '../../..';

export function givenOperationWithParameters(params?: ParameterObject[]) {
  return <OperationObject>{
    'x-operation-name': 'testOp',
    parameters: params,
    responses: {},
  };
}

export function givenRequest(options?: ShotRequestOptions): Request {
  return stubExpressContext(options).request;
}

export interface TestArgs<T> {
  expectedResult: T;
  valueFromReq: string;
  schema?: SchemaObject;
  specConfig?: Partial<ParameterObject>;
  caller: string;
}

export function givenResolvedRoute(
  spec: OperationObject,
  pathParams: PathParameterValues = {},
): ResolvedRoute {
  const route = new Route('get', '/', spec, () => {});
  return createResolvedRoute(route, pathParams);
}

export async function testCoercion<T>(config: TestArgs<T>) {
  try {
    const req = givenRequest();
    const spec = givenOperationWithParameters([
      {
        name: 'aparameter',
        in: 'path',
        schema: config.schema,
      },
    ]);
    const route = givenResolvedRoute(spec, {aparameter: config.valueFromReq});
    const args = await parseOperationArgs(req, route);
    expect(args).to.eql([config.expectedResult]);
  } catch (err) {
    throw new Error(`${err} \n Failed ${config.caller.split(/\n/)[1]}`);
  }
}

// tslint:disable-next-line:no-any
export function runTests(tests: any[][]) {
  for (let t of tests) {
    it(t[0] as string, async () => {
      await testCoercion({
        schema: t[1] as SchemaObject,
        valueFromReq: t[2] as string,
        expectedResult: t[3],
        caller: t[4] as string,
      });
    });
  }
}
