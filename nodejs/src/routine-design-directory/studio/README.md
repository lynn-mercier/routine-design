# Studio

Opens a browser for a directory, then opens a tab per component file in the directory.

```
const {RoutineDesignTree, RoutineDesignDirectory} = require('routine-design');
const routineDesignTree = new RoutineDesignTree('./dir');
const componentTree = routineDesignTree.getComponentTree();
const componentDirectory = componentTree.getDirectories().get('dir/foo');
const routineDesignDirectory = new RoutineDesignDirectory('project-id', 'storage-bucket-name', componentDirectory);
const screenshotCollection = routineDesignDirectory.createScreenshotCollection();
const studio = screenshotCollection.getStudio();
```

## getComponentImages()

Returns a list of `ComponentImage`, one for each component file in the `directory`.

## getBrowser()

Returns a Puppeteer browser object.

## getComponentCount()

Return the number of components, one for each component file in the `directory`. 

## getComponent(index)

Return `ComponentStudio` at the given index.

### ComponentStudio.isImageSet()

Returns true if this component is saved in the `image.json` file.

### ComponentStudio.getNewImage()

Returns a screenshot of the component as a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### ComponentStudio.getOldImage()

Returns the image saved in the `image.json` file as a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### ComponentStudio.isSame()

Returns true if the new image is the same as the image saved in the `image.json` file.

### ComponentStudio.diff()

Compares the new image to the old image. Returns the `pixelDiffCount`. Uploads a `diff.png` and `new.png` to the GCP debug directory if the `pixelDiffCount` is greater than zero.

### ComponentStudio.saveNewImage()

Updates the `image.json` file with the new image. Requires your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be set.

## save()

Saves the `image.json` file with the latest information from each `ComponentStudio`.

## getDebugId()

Returns the ID for the GCP debug directory.
