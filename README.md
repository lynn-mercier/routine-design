# Routine Design

Provides tools for aligning code and design.

## Command Line Interface

Turns a directory with many `React.Component` into a Webpack server. Say `./render` was the directory with the components, then this command will turn it into a Webpack server.
```
routine-design render ./render
```

Run `routine-design -h` for more commands and help.

## JavaScript APIs

* [RenderServer](./src/README.md): Turns a directory with `React.Component` into a Webpack server.
* [RoutesSetup](./src/README.md): Turns a directory with `React.Component` into a `routes.js` file. The `routes.js` file renders a set of `<Route>`.
* [Application](./src/application/README.md): Provides tools for creating a Web application.
* [WebpackSetup](./src/webpack-setup/README.md): Provides tools for managing a Webpack server, including the content base.
