# RoutineDesignDirectory

Manages screenshot images of `React.Component` on [Google Cloud Platform](https://cloud.google.com/). Say `./render/foo` is a directory with `React.Component`.

```
const RoutineDesign = require('routine-design');
const routineDesign = new RoutineDesign();
const routineDesignTree = routineDesign.createRoutineDesignTree('./render');
const componentDirectory = routineDesignTree.getComponentTree().getDirectories().get('foo');
const gcpImageBucket = routineDesign.createGcpImageBucket('project-id', 'storage-bucket-name');
const routineDesignDirectory = gcpImageBucket.createRoutineDesignDirectory(componentDirectory);
```

Requires your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be set.

## createScreenshotCollection()

Returns a new `ScreenshotCollection`.

You can specify a different port
```
const screenshotCollection = routineDesignDirectory.createScreenshotCollection(8080 /* port */);
```

You can specify the number of times to retry before taking a screenshot
```
const screenshotCollection = routineDesignDirectory.createScreenshotCollection(8080 /* port */, 10 /* tryCount */);
```

### ScreenshotCollection.capture()

Save screenshot images on [Google Cloud Platform](https://cloud.google.com/). 

You can accomplish the same thing from the Command Line Interface.
```
routine-design directory capture project-id storage-bucket-name ./render --component-directory=foo 
```

You can specify a different port
```
routine-design directory capture project-id storage-bucket-name ./render --component-directory=foo --port=8080
```

You can specify how many times to try capturing a screenshot
```
routine-design directory capture project-id storage-bucket-name ./render --component-directory=foo --try-count=20
```

### ScreenshotCollection.pixelValidate()

Checks that all screenshot images are identical to the screenshots saved on [Google Cloud Platform](https://cloud.google.com/). If the images are not identical, it uploads the new image and a `diff` image. 

You can accomplish the same thing from the Command Line Interface.
```
routine-design directory pixel-validate project-id storage-bucket-name ./render --component-directory=foo 
```

You can specify a different port
```
routine-design directory pixel-validate project-id storage-bucket-name ./render --component-directory=foo --port=8080
```

You can specify how many times to try capturing a screenshot
```
routine-design directory pixel-validate project-id storage-bucket-name ./render --component-directory=foo --try-count=20
```

### ScreenshotCollection.getStudio()

Returns [`Studio`](./studio/README.md).

## getImageStorage()

Returns [`ImageStorage`](./image-storage/README.md).

