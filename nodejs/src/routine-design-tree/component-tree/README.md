# ComponentTree

Manages a directory with `React.Component`. 
```
import {RoutineDesignTree} from 'routine-design';
const routineDesignTree = new RoutineDesignTree('./dir');
const componentTree = routineDesignTree.getComponentTree();
```

## getDirectories()

Returns a Map of entries, each with a `ComponentDirectory` value. There is an entry for the root directory, and an entry for each sub-directory found in the `directory`. Say `./dir` has one subdirectory, `./dir/foo`. Then you could access the two directories with the following code
```
const rootComponentDirectory = componentTree.getDirectories().get('');
const fooComponentDirectory = componentTree.getDirectories().get('foo');
```

### ComponentDirectory.getFiles()

Returns a list of `ComponentFile`, one for each JavaScript file found in the directory.

### ComponentDirectory.getDirectory()

Returns the path to the directory.

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
