# RoutesSetup

Turns a directory with `React.Component` into a `routes.js` file. The `routes.js` file renders a set of `<Route>`.
```
import {RoutesSetup} from 'routine-design';
new RoutesSetup('./dir', './routes.js').writeRoutes();
```

You can accomplish the same thing from the Command Line Interface. 
```
routine-design write routes ./dir ./routes.js
```

## getComponentFiles()

Returns a list of `ComponentFile`, one for each JavaScript file found in the `renderDirectory`. 

### ComponentFile.getPath()

Returns the path from the `renderDirectory` to the JavaScript file.

### ComponentFile.getImportPath()

Returns the path from `routes.js` to the JavaScript file.

### ComponentFile.getRoute()

Returns a `<Route>` element that imports the JavaScript file.

## writeRoutes()

Writes a JavaScript file to `routesPath`. The JavaScript file exports a `React.Component` that renders a set of `<Route>`. Each `<Route>` matches a JavaScript file found in the `renderDirectory`.

