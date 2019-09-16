# Component Workshop

Connects a directory of components to a storage bucket of screenshots.

```
const RoutineDesign = require('routine-design');
const routineDesign = new RoutineDesign();
const componentWorkshop = routineDesign.createComponentWorkshop('./render', 'gcp-project-id', 'storage-bucket-name');
```

## captureAll()

Saves a screenshot images of every component in the `renderDirectory` in the GCP storage bucket.

## getPixelValidators()

Returns an array of `PixelValidator`, one for each directory in the `renderDirectory`.

### PixelValidator.validate()

Checks that all screenshot images are identical to the screenshots saved in the GCP storage bucket. Returns a map with two fields
* allPass: a boolean that is true if all screenshot images are identical to the screenshots saved in GCP
* gcpUrl: a link to the "debug" GCP directory, containing new and diff images

