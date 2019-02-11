# RoutineDesignContainer

JavaScript API for manipulating a Routine Design [Docker](https://www.docker.com/) container.

Requires your `ROUTINE_DESIGN_GOOGLE_CREDS` environment variable to be set to valid [Google Cloud](https://cloud.google.com/) JSON credentials.

Google Cloud authentication is temporarily written to `./routine-design-output/routine-design`.

## start()

Starts a new Docker container from the routine design Docker image. 

## buildNodeSass()

Builds `node-sass` for Linux.

## run(command)

Runs a command in the Docker container.

## cleanup()

Stops and removes the Docker container. 

