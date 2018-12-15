# Routine Design

Provides tools for aligning code and design.

## Command Line Interface

Turns a directory with many `React.Component` into a Webpack server. Say `./render` was the directory with the components, then this command will turn it into a Webpack server.
```
routine-design render ./render
```

Run `routine-design -h` for more commands and help.

## JavaScript APIs

* [Capturer](./src/README.md): Capture screenshot images on a given port.
* [RenderServer](./src/README.md): Turns a directory with `React.Component` into a Webpack server.
* [GcpImage](./src/README.md): Manipulate a PNG image stored on [Google Cloud Platform](https://cloud.google.com/).
* [LocalImage](./src/README.md): Manipulate a local PNG image.
* [WebPage](./src/README.md): Interact with a local Web page.
* [ComponentTree](./src/component-tree/README.md): Manages a directory with `React.Component`.
* [ImageStorage](./image-storage/README.md): Connects the `React.Component` in a directory to images stored on [Google Cloud Platform](https://cloud.google.com/).
* [Application](./src/application/README.md): Provides tools for creating a Web application.
* [RoutesServer](./src/routes-server/README.md): Manages a Webpack server built for a `routes.js`.
