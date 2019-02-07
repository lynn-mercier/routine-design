# RoutesServer

Manages a Webpack server built for a `routes.js`.
```
import {LocalStorage} from 'routine-design';
const localStorage = new LocalStorage();
const routesServer = localStorage.createRoutesServer();
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
      </div>
    );
  }
}
export default Routes;
```

You can quickly turn that `routes.js` into a Webpack server using `RoutesServer`. 

First, empty this directory by calling `emptyDirectory`. Then connect the content base to `routes.js` by calling `RoutesServer.writeFiles`. And finally, start the server by calling `start`.

```
await routesServer.emptyDirectory();
await routesServer.writeFiles('./routes.js');
await routesServer.start();
```

You can accomplish the same thing from the Command Line Interface. 
```
routine-design start-server ./routes.js
```

## emptyDirectory()

Deletes all the files within the `./routine-design-output`.

## writeFiles(routesPath)

Writes all files to disk, within `./routine-design-output`. Includes an `index.html` and `index.js`.

## start()

Starts the Routes server. You can specify the port
```
await routesServer.start(8080 /* port */);
```

