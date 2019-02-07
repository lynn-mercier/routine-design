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

Checks that all screenshot images are identical to the screenshots saved on [Google Cloud Platform](https://cloud.google.com/). Check screenshot images of `./render/foo`
```
routine-design directory pixel-validate project-id storage-bucket-name ./render --component-directory=foo 
```

Run `routine-design -h` for more commands and help.

## JavaScript APIs

* [RoutineDesignDirectory](./src/routine-design-directory/README.md): Manages screenshot images of `React.Component` on [Google Cloud Platform](https://cloud.google.com/).
* [RoutineDesignTree](./src/routine-design-tree/README.md): Provides tools for operating on a directory with `React.Component`..
* [GcpImage](./src/README.md): Manipulate a PNG image stored on [Google Cloud Platform](https://cloud.google.com/).
* [LocalStorage](./src/local-storage/README.md): Provides tools for writing local files.
* [WebPage](./src/README.md): Interact with a local Web page.
* [Application](./src/application/README.md): Provides tools for creating a Web application.
