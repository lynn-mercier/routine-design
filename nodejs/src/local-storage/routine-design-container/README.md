# RoutineDesignContainer

JavaScript API for manipulating a Routine Design [Docker](https://www.docker.com/) container.

Requires your `ROUTINE_DESIGN_GOOGLE_CREDS` environment variable to be set to valid [Google Cloud](https://cloud.google.com/) JSON credentials.

Google Cloud authentication is temporarily written to `./routine-design-output/routine-design`.

## start()

Starts a new Docker container from the routine design Docker image. 

## buildNodeSass()

Builds `node-sass` for Linux.

You can accomplish the same thing on the command line, which starts and cleans up the Docker container.
```
routine-design docker build-node-sass
```

You can specify the name of the Docker container.
```
routine-design docker build-node-sass --container-name=foo
```

## run(command)

Runs a command in the Docker container.

You can accomplish the same thing on the command line, which starts and cleans up the Docker container. Say you want to run `ls`
```
routine-design docker run ls
```

You can specify the name of the Docker container.
```
routine-design docker run ls --container-name=foo
```

## cleanup()

Stops and removes the Docker container. 

