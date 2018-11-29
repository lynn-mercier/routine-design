# Routine Design

Provides JavaScript APIs for aligning code and design.

* [GcpImage](#gcpimage)
* [LocalImage](#localimage)
* [RenderServer](#renderserver)
* [RoutesSetup](#routessetup)
* [WebsiteStatus](#websitestatus)
* [Application](./application/README.md)
* [RoutesServer](./routes-server/README.md)

## GcpImage

Manipulate a PNG image stored on [Google Cloud Platform](https://cloud.google.com/). 

### upload(png)

Uploads a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### download()

Downalds and returns PNG object.

## LocalImage

Manipulate a local PNG image. 

### getPath()

Returns the path to the local PNG image.

### getPng()

Returns a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### write(png)

Write a PNG object to the local PNG image.

### delete()

Delete the local PNG image.

## RenderServer

Turns a directory with many `React.Component` into a Webpack server. Say `./render` was the directory with the components, then JavaScript will turn it into a Webpack server.
```
import {RenderServer} from 'routine-design';
new RenderServer().run('./render');
```

You can accomplish the same thing from the Command Line Interface. 
```
routine-design render ./render
```

You can specify a different port
```
new RenderServer().run('./render', 8080 /* port */);
```

Or from the command line 
```
routine-design render ./render --port 8080
```

## RoutesSetup

Turns a directory with `React.Component` into a `routes.js` file. The `routes.js` file renders a set of `<Route>`.
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

Writes a JavaScript file to `routesPath`. The JavaScript file exports a `React.Component` that renders a set of `<Route>`. Each `<Route>` matches a JavaScript file found in the `renderDirectory`.

## WebsiteStatus

Determine if a URL resolves.

```
import {WebsiteStatus} from 'routine-design';
import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const websiteStatus = new WebsiteStatus(browser, 'http://localhost:8080');
```

### resolves()

Returns true if the URL resolves.

### waitForResolution(tryCount)

Keeps trying until the URL resolves. 
