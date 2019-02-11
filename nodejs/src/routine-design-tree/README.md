# RoutineDesignTree

Provides tools for operating on a directory with `React.Component`.

## render()

Turns the directory a Webpack server. Say `./render` was the directory with the components, then JavaScript will turn it into a Webpack server.
```
const RoutineDesign = require('routine-design');
const routineDesign = new RoutineDesign();
const routineDesignTree = routineDesign.createRoutineDesignTree('./render');
routineDesignTree.render();
```

You can accomplish the same thing from the Command Line Interface. 
```
routine-design render ./render
```

You can specify a different port
```
routineDesignTree.render(8080 /* port */);
```

Or from the command line 
```
routine-design render ./render --port 8080
```

## getComponentTree()

Returns the [`ComponentTree`](./component-tree/README.md) for managing the directory.