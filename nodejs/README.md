# Routine Design

Nodejs package for aligning code and design.

## Command Line Interface

`routine-design` is a Swiss army knife of simple commands for aligning code and design. The commands interact with a directory with many `React.Component`, lets call it `./render`.

Turn `./render` into a Webpack server
```
routine-design render ./render
```

See below for more commands, or run `routine-design -h` for more commands and help.

### Capturing
Saves a screenshot images of every component in [Google Cloud Platform](https://cloud.google.com/).
```
routine-design capture ./render project-id storage-bucket-name 
```

Save screenshot images of `./render/foo` on Google Cloud Platform.
```
routine-design directory capture project-id storage-bucket-name ./render --component-directory=foo 
```

### Validating Pixels
Tests that all screenshot images are identical to the golden screenshots saved on Google Cloud Platform.
```
routine-design test ./render project-id storage-bucket-name 
```

You can also check just one directory using the `pixel-validate` command. For example, here's how to check screenshot images of `./render/foo`
```
routine-design directory pixel-validate project-id storage-bucket-name ./render --component-directory=foo 
```

## JavaScript API
```
const RoutineDesign = require('routine-design');
const routineDesign = new RoutineDesign();
```

### createGcpImageBucket(projectId, storageBucketName)

Creates a new [`GpcImageBucket`](./src/gcp-image-bucket/README.md), which manages a screenshot image bucket on [Google Cloud Platform](https://cloud.google.com/).

### createTree(directory)

Creates a new [`RoutineDesignTree`](./src/routine-design-tree/README.md), which operates on a directory with `React.Component`. Say `./render` is a directory with `React.Component`.

```
const routineDesignTree = routineDesign.createTree('./render');
```

### getLocalStorage()

Creates a new [`LocalStorage`](./src/local-storage/README.md), which provides tools for writing local files.

### createComponentWorkshop(renderDirectory, gcpProjectId, storageBucketName)

Creates a new [`ComponentWorkshop`](./src/component-workshop/README.md), which connects a directory of components to a storage bucket of screenshots.

### createWebPage(browser, port, path)

Creates a new `WebPage`, which interact with a local Web page.

```
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const webPage = routineDesign.createWebPage(browser, 8080, 'path');
```

You can specify the width of the `WebPage`.

```
const webPage = routineDesign.createWebPage(browser, 8080, 'path', 320);
```

#### WebPage.screenshot()

Returns a screenshot as a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

#### WebPage.resolves()

Returns true if the URL resolves.

#### WebPage.waitForResolution(tryCount)

Keeps trying until the URL resolves.

### createApplication(cssFilename = 'bundle.css', javaScriptFilename = 'bundle.js')

Creates a new [`Application`](./src/application/README.md), which provides tools for creating a Web application.
