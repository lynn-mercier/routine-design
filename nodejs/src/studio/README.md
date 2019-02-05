# Studio

Opens a browser for a directory, then opens a tab per component file in the directory.

```
const {ComponentTree, Studio} = require('routine-design');
const componentTree = new ComponentTree('./dir');
const componentDirectory = componentTree.getDirectories().get('dir/foo');
const studio = new Studio('project-id', 'storage-bucket', componentDirectory);
```

You can specify the port.

```
const studio = new Studio('project-id', 'storage-bucket', componentDirectory, 8080 /* port */);
```

You can specify the number of times to retry before taking a screenshot

```
const studio = new Studio('project-id', 'storage-bucket', componentDirectory, {tryCount: 10});
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

### ComponentStudio.saveNewImage()

Updates the `image.json` file with the new image. Requires your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be set.

## save()

Saves the `image.json` file with the latest information from each `ComponentStudio`.
