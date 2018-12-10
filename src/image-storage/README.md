# ImageStorage

Connects the `React.Component` in a directory to images stored on [Google Cloud Platform](https://cloud.google.com/)(GCP).  
```
import {ImageJson, ComponentTree} from 'routine-design';
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({projectId: 'project-id'});
const componentTree = new ComponentTree('./dir');
componentTree.getDirectories().forEach((componentDirectory) => {
  const imageJson = new ImageJson(storage, 'storage-bucket-name', componentDirectory);
});
```

## getImages()

Returns a list of `ComponentImage`, one for each JavaScript file found in the directory. Each `ComponentImage` has the latest GCP information, as pulled from the JSON file stored in this directory.

### ComponentImage.getId()

Returns the GCP ID.

### ComponentImage.saveImage(localImage)

Saves a `LocalImage` as the new image for the component.

### ComponentImage.getGcpPath()

Returns the GCP path.

### ComponentImage.createGcpImage()

Creates a new `GcpImage` with the GCP path.

## save()

Saves a JSON file with the latest GCP information for each JavaScript file.
