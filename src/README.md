# Routine Design

Provides JavaScript APIs for aligning code and design.

* [Application](./application/README.md)
* [GcpImage](#gcpimage)
* [LocalImage](#localimage)
* [RenderServer](#renderserver)
* [RoutesServer](./routes-server/README.md)
* [RoutesSetup](./routes-setup/README.md)
* [WebsiteStatus](#websitestatus)

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
