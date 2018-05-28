# @loopback/http-server

This package implements the HTTP / HTTPS server endpoint for LoopBack 4 apps.

## Overview

This is an internal package used by `RestServer` for creating its HTTP / HTTPS server.

## Installation

To use this package, you'll need to install `@loopback/http-server`.

```sh
npm i @loopback/htp-server
```

## Usage

`@loopback/http-server` should be instantiated with an instance of `RestServer`, HTTP / HTTPS options object, and a request handler function.

```js
import {RestServer} from '@loopback/rest';
import {Application} from '@loopback/core';

const app = new Application();
const restServer = new RestServer(app);
const httpServer = new HttpServer(restServer, {port: 3000, host: ''}, (req, res) => {});
```

Call the `start()` method to start the server.

```js
httpServer.start()
```

Call the `stop()` method to stop the server.

Use the `listening` property to check whether the server is listening for connections or not.

```js
if (httpServer.listening) {
  console.log('Server is running');
} else {
  console.log('Server is not running');
}
```

## Contributions

- [Guidelines](https://github.com/strongloop/loopback-next/wiki/Contributing#guidelines)
- [Join the team](https://github.com/strongloop/loopback-next/issues/110)

## Tests

Run `npm test` from the root folder.

## Contributors

See [all contributors](https://github.com/strongloop/loopback-next/graphs/contributors).

## License

MIT
