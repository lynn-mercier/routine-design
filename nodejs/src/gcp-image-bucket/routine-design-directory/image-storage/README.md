# ImageStorage

Connects the `React.Component` in a directory to images stored on [Google Cloud Platform](https://cloud.google.com/) (GCP).  
```
const RoutineDesign = require('routine-design');
const routineDesign = new RoutineDesign();
const routineDesignTree = routineDesign.createRoutineDesignTree('./dir');
const componentTree = routineDesignTree.getComponentTree();
const componentDirectory = componentTree.getDirectories().get('foo');
const gcpImageBucket = routineDesign.createGcpImageBucket('project-id', 'storage-bucket-name');
const routineDesignDirectory = gcpImageBucket.createRoutineDesignDirectory(componentDirectory);
const imageStorage = routineDesignDirectory.getImageStorage();
```

Requires your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be set.

## getImages()

Returns a list of `ComponentImage`, one for each JavaScript file found in the directory. Each `ComponentImage` has the latest GCP information, as pulled from the JSON file stored in this directory.

### ComponentImage.getId()

Returns the GCP ID.

### ComponentImage.saveImage(png)

Saves a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs), as the new image for the component.

### ComponentImage.getGcpPath()

Returns the GCP path.

### ComponentImage.createGcpImage()

Creates a new `GcpImage` with the GCP path.

### ComponentImage.createGcpDebugImage(filename)

Creates a new `GcpImage` in the GCP debug directory with the given `filename`.

## save()

Saves a JSON file with the latest GCP information for each JavaScript file.

## getDebugId()

Returns the ID for the GCP debug directory.

