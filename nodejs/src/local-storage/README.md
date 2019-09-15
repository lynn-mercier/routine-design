# LocalStorage

Provides tools for writing local files. Files are saved in `./routine-design-output`. We recommend you add this directory to your `.gitignore`.

## createRoutesServer(name = 'routes-server')

Creates a new [`RoutesServer`](./routes-server/README.md). By default, the server files are saved in `./routine-design-output/routes-server`. 

## createLocalImage()

Creates new `LocalImage` to represent a local PNG image. Images are saved in `./routine-design-output/images`.

## writeMocha(renderDirectory, gcpProjectId, storageBucketName)

Writes a new `index.test.js` file with [Mocha](https://mochajs.org/) tests for validating pixels. 

```
const RoutineDesign = require('routine-design');
const localStorage = new RoutineDesign().getLocalStorage();
localStorage.writeMocha('./render', 'gcp-project', 'storage-bucket');
```

By default, the `index.test.js` file is saved in `./routine-design-output/mocha-writer`. 

### LocalImage.getPath()

Returns the path to the local PNG image.

### LocalImage.getPng()

Returns a PNG object, like from [pngjs](https://www.npmjs.com/package/pngjs).

### LocalImage.prepareForWriting()

Prepare the `LocalImage` to be written to.

### LocalImage.write(png)

Write a PNG object to the local PNG image.

### LocalImage.delete()

Delete the local PNG image.

## createRoutineDesignContainer(containerName = 'routine-design')

Creates a new [`RoutineDesignContainer`](./routine-design-container/README.md). By default, the [Docker](https://www.docker.com/) container name is `routine-design`.

Google Cloud authentication is temporarily written to `./routine-design-output/routine-design`. Both the Docker container and directory name match the `containerName` argument.
