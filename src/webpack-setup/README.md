# WebpackSetup

Provides tools for managing a Webpack server, including the content base.
```
import {WebpackSetup} from 'routine-design';
```

Say you have an entry point `index.js`
```
document.getElementById('foo').addEventListener('click', () => {
  console.log('foo was clicked');
});
```

You can quickly turn that `index.js` into a Webpack server using `WebpackSetup`. You need to specify a `webpackDir` and a `javaScriptPath`. `webpackDir` is where `WebpackSetup` will write files. `javaScriptPath` should point to your entry point JavaScript file. 
```
const webpackSetup = new WebpackSetup('./foo/webpackDir', './index.js');
```

First empty `webpackDir` by calling `emptyDirectory`. Then write an HTML file in the `webpackDir`. And finally, start the server by calling `startServer`.
```
import {Application} from 'routine-design';
await webpackSetup.emptyDirectory();
await new Application().writeHtml('./foo/webpackDir/index.html', htmlBodyInnerHtml);
await webpackSetup.startServer();
```

If your `index.js` is going to render the rest of the DOM client side, then you can use the Command Line Interface. 
```
routine-design start-server javascript ./index.js "<div id='foo'></div>"
```

Or maybe, instead of an `index.js` you have a `routes.js` which exports a `React.Component` with many `<Route>`s
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

You can also turn that `routes.js` into a Webpack server using `WebpackSetup`. This time, `javaScriptPath` is where `WebpackSetup` will write the entry point JavaScript. Connect the content base to `routes.js` by calling `WebpackSetup.write`.
```
const webpackSetup = new WebpackSetup('./foo/webpackDir', './foo/webpackDir/index.js');
await webpackSetup.emptyDirectory();
await webpackSetup.write('./routes.js');
await webpackSetup.startServer();
```

You can accomplish the same thing from the Command Line Interface. 
```
routine-design start-server routes ./routes.js
```

## emptyDirectory()

Deletes all the files within the `webpackDir`.

## write(routesPath)

Writes Webpack config's files to disk, within the `webpackDir`. Includes an `index.html`. It also writes the JavaScript code to `javaScriptPath`.

## startServer()

Starts the Webpack server. You can specify the port
```
await webpackSetup.startServer(8080 /* port */);
```

