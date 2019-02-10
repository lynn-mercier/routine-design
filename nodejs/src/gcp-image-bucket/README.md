# GcpImageBucket

Manages a screenshot image bucket on [Google Cloud Platform](https://cloud.google.com/).

Requires your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be set.

## createGcpImage(gcpPath)

Creates a new `GcpImage` for managing a PNG image stored on Google Cloud Platform.

```
const RoutineDesign = require('routine-design');
const routineDesign = new RoutineDesign();
const gcpImageBucket = routineDesign.createGcpImageBucket('project-id', 'storage-bucket-name');
const gcpImage = gcpImageBucket.createGcpImage('foo.png');
```

### GcpImage.upload(png)

Uploads a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### GcpImage.download()

Downalds and returns PNG object.

### GcpImage.getUrl()

Returns the URL for viewing the image.

## createRoutineDesignDirectory(componentDirectory)

Creates a new [`RoutineDesignDirectory`](./routine-design-directory/README.md).