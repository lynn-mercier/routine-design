# Routine Design

Nodejs package for aligning code and design.

## Command Line Interface

`routine-design` is a Swiss army knife of simple commands for aligning code and design. The commands interact with a directory with many `React.Component`, lets call it `./render`.

Turn `./render` into a Webpack server
```
routine-design render ./render
```

Save screenshot images of `./render/foo` on [Google Cloud Platform](https://cloud.google.com/)
```
routine-design directory capture project-id storage-bucket-name ./render --component-directory=foo 
```

Run `routine-design -h` for more commands and help.

## JavaScript APIs

* [DirectoryCapturer](./src/README.md): Save screenshot images on [Google Cloud Platform](https://cloud.google.com/).
* [RenderServer](./src/README.md): Turns a directory with `React.Component` into a Webpack server.
* [GcpImage](./src/README.md): Manipulate a PNG image stored on [Google Cloud Platform](https://cloud.google.com/).
* [LocalImage](./src/README.md): Manipulate a local PNG image.
* [Studio](./src/studio/README.md): Opens a browser for a directory, then opens a tab per component file in the directory.
* [WebPage](./src/README.md): Interact with a local Web page.
* [ComponentTree](./src/component-tree/README.md): Manages a directory with `React.Component`.
* [ImageStorage](./image-storage/README.md): Connects the `React.Component` in a directory to images stored on [Google Cloud Platform](https://cloud.google.com/).
* [Application](./src/application/README.md): Provides tools for creating a Web application.
* [RoutesServer](./src/routes-server/README.md): Manages a Webpack server built for a `routes.js`.
