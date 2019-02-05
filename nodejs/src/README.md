# Routine Design

Provides JavaScript APIs for aligning code and design.

* [Application](./application/README.md)
* [ComponentTree](./component-tree/README.md)
* [DirectoryCapturer](#directorycapturer)
* [DirectoryPixelValidator](#directorypixelvalidator)
* [GcpImage](#gcpimage)
* [ImageStorage](./image-storage/README.md)
* [LocalImage](#localimage)
* [RenderServer](#renderserver)
* [RoutesServer](./routes-server/README.md)
* [RoutineDesignContainer](#routinedesigncontainer)
* [Studio](./studio/README.md)
* [WebPage](#webpage)

## DirectoryCapturer

Save screenshot images on [Google Cloud Platform](https://cloud.google.com/). Say `./render` is a directory with many `React.Component`.

```
import {DirectoryCapturer, ComponentTree} from 'routine-design';
const componentTree = new ComponentTree('./render');
const componentDirectory = componentTree.getDirectories().get('foo');
new DirectoryCapturer().run('project-id', 'storage-bucket-name', componentDirectory);
```

You can accomplish the same thing from the Command Line Interface.
```
routine-design directory capture project-id storage-bucket-name ./render --component-directory=foo 
```

You can specify a different port
```
new DirectoryCapturer().run('project-id', 'storage-bucket-name', componentDirectory, 8080 /* port */);
```

Or from the command line 
```
routine-design directory capture project-id storage-bucket-name ./render foo --component-directory=foo --port 8080
```

Requires your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be set.


## DirectoryPixelValidator

Checks that all screenshot images are identical to the screenshots saved on [Google Cloud Platform](https://cloud.google.com/). If the images are not identical, it uploads the new image and a `diff` image. Say `./render` is a directory with many `React.Component`.

```
import {DirectoryPixelValidator, ComponentTree} from 'routine-design';
const componentTree = new ComponentTree('./render');
const componentDirectory = componentTree.getDirectories().get('foo');
new DirectoryPixelValidator().run('project-id', 'storage-bucket-name', componentDirectory);
```

You can accomplish the same thing from the Command Line Interface.
```
routine-design directory pixel-validate project-id storage-bucket-name ./render --component-directory=foo 
```

You can specify a different port
```
new DirectoryPixelValidator().run('project-id', 'storage-bucket-name', componentDirectory, 8080 /* port */);
```

Or from the command line 
```
routine-design directory pixel-validate project-id storage-bucket-name ./render foo --component-directory=foo --port 8080
```

Requires your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be set.

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

## LocalImage

Manipulate a local PNG image. 

### getPath()

Returns the path to the local PNG image.

### getPng()

Returns a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### prepareForWriting()

Prepare the `LocalImage` to be written to.

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

## RoutineDesignContainer

Manages a routine design [Docker](https://www.docker.com/) container. Requires your `ROUTINE_DESIGN_GOOGLE_CREDS` environment variable to be set to valid [Google Cloud](https://cloud.google.com/) JSON credentials.

### start()

Starts a new Docker container from the routine design Docker image. 

### run(command)

Runs a command in the Docker container.

### cleanup()

Stops and removes the Docker container. 

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
