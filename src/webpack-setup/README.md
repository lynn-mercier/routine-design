# WebpackSetup

Provides tools for managing a Webpack server, including the content base.
```
import {WebpackSetup} from 'routine-design';
```

Say you have a `routes.js` which exports a `React.Component` with many `<Route>`s
```
import React from 'react';
import {Route} from 'react-router-dom';
class Routes extends React.Component {
  render() {
  	return (
  	<div>
      <Route exact path='/' component={require('./bar/index.js').default} />
      <Route exact path='/baz' component={require('./bar/baz.js').default} />
    </div>);}
}
export default Routes;
```

You can quickly turn that `routes.js` into a Webpack server using `WebpackSetup`. 

`WebpackSetup` writes files to `./routine-design-output`. We recommend you add this directory to your `.gitignore`.

First, empty this directory by calling `emptyDirectory`. Then connect the content base to `routes.js` by calling `WebpackSetup.write`. And finally, start the server by calling `startServer`.

```
const webpackSetup = new WebpackSetup('./foo/webpackDir', './foo/webpackDir/index.js');
await webpackSetup.emptyDirectory();
await webpackSetup.write('./routes.js');
await webpackSetup.startServer();
```

You can accomplish the same thing from the Command Line Interface. 
```
routine-design start-server ./routes.js
```

## emptyDirectory()

Deletes all the files within the `./routine-design-output`.

## write(routesPath)

Writes Webpack config's files to disk, within the `./routine-design-output`. Includes an `index.html`. It also writes the JavaScript code to `./routine-design-output/index.js`.

## startServer()

Starts the Webpack server. You can specify the port
```
await webpackSetup.startServer(8080 /* port */);
```

