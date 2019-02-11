# 0.5.0

## Breaking Changes

* Use exported `RoutineDesign` instead of any previously exported JavaScript class.
* Return [`PNG`](https://www.npmjs.com/package/pngjs) object, instead of `LocalImage`
* Changed CLI for capturing a directory

## Features

* RoutineDesignContainer: JavaScript API for manipulating a Routine Design [Docker](https://www.docker.com/) container
* ComponentStudio.diff: Compares the new image to the old image
* RoutineDesignDirectory.pixelValidate: Checks that all screenshot images are identical to the screenshots saved on [Google Cloud Platform](https://cloud.google.com/).
* New CLI command: `routine-design directory pixel-validate project-id storage-bucket-name ./render`

## Fixes

* CLI exits with exitCode=1 if an error is thrown
* `WebPage.waitForResolution` throws an error if it does not resolve
* `RoutesServer.start` throws an error if `WebpackDevServer.listen` throws an error

# 0.4.1

## Fixes

* Close the browser after capturing screenshots 

# 0.4.0

## Breaking Changes

* Renamed `WebsiteStatus` to `WebPage`
* Pass `port` and `path` to `WebPage`, instead of `url`
* Pass `project-id` to `GcpImage`, instead of a `storage` object
* Pass `project-id` to `ImageStorage`, instead of a `storage` object
* `ComponentTree.getDirectories()` returns a Map, instead of an Array

## Features

* Capturer: Save screenshot images on [Google Cloud Platform](https://cloud.google.com/)
* New CLI command: `routine-design capture project-id storage-bucket-name ./render foo`
* Studio: Opens a browser for a directory, then opens a tab per component file in the directory

# 0.3.0

## Breaking Changes

* Renamed `WebpackSetup` to `RoutesServer`
* Dropped support for `RoutesSetup.getRoutes()[0].importPath`
* Renamed `RoutesSetup` to `ComponentTree`

## Features

* GcpImage: Manipulate a PNG image stored on [Google Cloud Platform](https://cloud.google.com/).
* LocalImage: Manipulate a local PNG image.
* WebsiteStatus: Determine if a URL resolves.
* ImageStorage: Connects the `React.Component` in a directory to images stored on [Google Cloud Platform](https://cloud.google.com/).
