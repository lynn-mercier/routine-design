# Routine Design

Provides tools for aligning code and design.

## Command Line Interface

Turns a directory with `React.Component`s into a Webpack server.
```
routine-design render ./render -d ./tmp
```

Run `routine-design -h` for more commands and help.

## JavaScript APIs

* RenderServer: Turns a directory with `React.Component`s into a Webpack server.
* RoutesSetup: Turns a directory with `React.Component`s into a `routes.js` file. The `routes.js` file renders a set of `<Route>`s.
* Application: Provides tools for creating a Web application.
* WebpackSetup: Provides tools for managing a Webpack server, including the content base.
