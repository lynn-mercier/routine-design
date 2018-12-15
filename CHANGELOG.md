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
