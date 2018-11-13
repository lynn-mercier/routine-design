# Routine Design

Provides JavaScript APIs for aligning code and design.

## RenderServer

Turns a directory with `React.Component`s into a Webpack server.
```
import {RenderServer} from 'routine-design';
new RenderServer().run('./render', './tmp');
```

You can accomplish the same thing from the Command Line Interface. 
```
routine-design render routes ./routes.js -d ./tmp
```

You can specify a different port
```
new RenderServer().run('./render', './tmp', 8080 /* port */);
```

Or from the command line 
```
routine-design render routes ./routes.js -d ./tmp --port 8080
```

## RoutesSetup

Turns a directory with `React.Component`s into a `routes.js` file. The `routes.js` file renders a set of `<Route>`s.
```
import {RoutesSetup} from 'routine-design';
new RoutesSetup('./dir', './routes.js').writeRoutes();
```

You can accomplish the same thing from the Command Line Interface. 
```
routine-design write routes ./dir ./routes.js
```

### getRoutes()

Returns a list of route objects, one for each JavaScript file found in the `renderDirectory`. Each route object has an `importPath` and `path` field. `importPath` is the path from `routes.js` to the JavaScript file. `path` is from the `renderDirectory` to the same JavaScript file.

### writeRoutes()

Writes a JavaScript file to `routesPath`. The JavaScript file exports a `React.Component` that renders a set of `<Route>`s. Each `<Route>` matches a JavaScript file found in the `renderDirectory`.

## Application

Provides tools for creating a Web application.

## WebpackSetup

Provides tools for managing a Webpack server, including the content base.
