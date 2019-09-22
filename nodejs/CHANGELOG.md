# 0.6.5

## Fixes
* Update timeout for resolving a web page
* Fix syntax in Mocha test file 

# 0.6.4

## Fixes
* Actually throw an error when Mocha tests fail

# 0.6.3

## Fixes
* Mocha writer to use `PixelValidator.getComponentDirectoryId`

# 0.6.2

## Fixes
* Create directory before for writing mocha test file
* Add equals sign to fix syntax of mocha testfile
* Fix reference to routine-design-output directory

# 0.6.1

## Features

* Added `--try-count` option to `capture` and `test` commands

# 0.6.0

## Features

* Added `capture` and `test` commands to the CLI
* Added `ComponentWorkshop` which connects a directory of components to a storage bucket of screenshots.
* Added `LocalStorage.writeMocha`, which writes a new `index.test.js` file with [Mocha](https://mochajs.org/) tests for validating pixels.

# 0.5.8

## Fixes

* Updated `WebPage` to delete the local image after the image has been completely read into a PNG.

# 0.5.7

## Fixes

* Updated `ImageStorage` to only save one copy of `image.json`, so it doesn't miss files when run in multiple threads

# 0.5.6

## Features

* Added support for specifying viewport width in `Webpage` and `Studio`

# 0.5.5

## Fixes

* Updated `Studio` to launch only one browser, so it doesn't open multiple browsers when run in multiple threads

# 0.5.4

## Fixes

* Updated `ComponentImage.createGcpDebugImage` so it actually uploads to GCP

# 0.5.3

## Fixes

* Updated `GcpImage.download` so it works when there is no directory

# 0.5.2

## Fixes

* Updated `RoutineDesignContainer` to pull from correct Docker repository

# 0.5.1

## Fixes

* CLI option `--component-directory` actually works

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
