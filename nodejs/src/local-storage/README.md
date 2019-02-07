# LocalStorage

Provides tools for writing local files. Files are saved in `./routine-design-output`. We recommend you add this directory to your `.gitignore`.

## createRoutesServer(name = 'routes-server')

Creates a new [`RoutesServer`](./routes-server/README.md). By default, the server files are saved in `./routine-design-output/routes-server`. 

## createLocalImage()

Creates new `LocalImage` to represent a local PNG image. Images are saved in `./routine-design-output/images`.

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

Creates a new `RoutineDesignContainer`. By default, the [Docker](https://www.docker.com/) container name is `routine-design`. Requires your `ROUTINE_DESIGN_GOOGLE_CREDS` environment variable to be set to valid [Google Cloud](https://cloud.google.com/) JSON credentials.

Google Cloud authentication is temporarily written to `./routine-design-output/routine-design`. Both the Docker container and directory name match the `containerName` argument.

### RoutineDesignContainer.start()

Starts a new Docker container from the routine design Docker image. 

### RoutineDesignContainer.run(command)

Runs a command in the Docker container.

### RoutineDesignContainer.cleanup()

Stops and removes the Docker container. 

