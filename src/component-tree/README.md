# ComponentTree

Manages a directory with `React.Component`. 
```
import {ComponentTree} from 'routine-design';
const componentTree = new ComponentTree('./dir');
```

## getDirectories()

Returns a list of `ComponentDirectory`, one for the root directory, and for each sub-directory found in the `directory`. 

### ComponentDirectory.getFiles()

Returns a list of `ComponentFile`, one for each JavaScript file found in the directory.

### ComponentFile.getPath()

Returns the path from the `directory` to the JavaScript file.

### ComponentFile.getBasename()

Returns the [basename](https://nodejs.org/api/path.html#path_path_basename_path_ext) of the JavaScript file.

### ComponentFile.getDirname()

Returns the [dirname](https://nodejs.org/api/path.html#path_path_dirname_path) of the JavaScript file.

## writeRoutes(routesPath)

Turns `directory` into a `routes.js` file. The `routes.js`  file exports a `React.Component` that renders a set of `<Route>`. Each `<Route>` matches a JavaScript file found in the `directory`.

You can accomplish the same thing from the Command Line Interface. 
```
routine-design write routes ./dir ./routes.js
```




