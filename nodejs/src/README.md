# Routine Design

Provides JavaScript APIs for aligning code and design.

* [Application](./application/README.md)
* [GcpImageBucket](./gcp-image-bucket/README.md)
* [LocalStorage](./local-storage/README.md)
* [RoutineDesignDirectory](./routine-design-directory/README.md)
* [RoutineDesignTree](./routine-design-tree/README.md)
* [WebPage](#webpage)

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
