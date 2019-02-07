# Routine Design

Provides JavaScript APIs for aligning code and design.

* [Application](./application/README.md)
* [GcpImage](#gcpimage)
* [LocalStorage](./local-storage/README.md)
* [RoutineDesignDirectory](./routine-design-directory/README.md)
* [RoutineDesignTree](./routine-design-tree/README.md)
* [WebPage](#webpage)

## GcpImage

Manipulate a PNG image stored on [Google Cloud Platform](https://cloud.google.com/). Requires your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be set.

```
const {GcpImage} = require('routine-design');
const gcpImage = new GcpImage('project-id', 'storage-bucket-name', 'foo.png');
```

### upload(png)

Uploads a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### download()

Downalds and returns PNG object.

### getUrl()

Returns the URL for viewing the image.

## WebPage

Interact with a local Web page.

```
import {WebPage} from 'routine-design';
import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const webPage = new WebPage(browser, 8080, 'path');
```

### screenshot()

Returns a screenshot as a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### resolves()

Returns true if the URL resolves.

### waitForResolution(tryCount)

Keeps trying until the URL resolves. 
