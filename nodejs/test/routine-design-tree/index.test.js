const {expect} = require('chai');
const td = require('testdouble');
const fs = require('fs');
const RoutineDesignTree = require('../../src/routine-design-tree');
const LocalStorage = td.constructor(require('../../src/local-storage'));
const RoutesServer = td.constructor(require('../../src/local-storage/routes-server'));
const ComponentTree = td.constructor(require('../../src/routine-design-tree/component-tree'));

describe('RoutineDesignTree', function() {
  const routineDesignTree = new RoutineDesignTree('./render', LocalStorage, ComponentTree);
  it('#render', async function() {
    const routesServer = new RoutesServer();
    td.when(LocalStorage.prototype.createRoutesServer()).thenReturn(routesServer);
    td.when(RoutesServer.prototype.getWebpackDir()).thenReturn('./routine-design-output');
    return routineDesignTree.render(1234).then(() => {
      expect(td.explain(RoutesServer.prototype.emptyDirectory).calls.length).to.equal(1);
      expect(td.explain(ComponentTree).calls[0].args[0]).to.equal('./render');
      expect(td.explain(ComponentTree.prototype.writeRoutes).calls[0].args[0]).to.equal('./routine-design-output/routes.js');
      expect(td.explain(RoutesServer.prototype.writeFiles).calls[0].args[0]).to.equal('./routine-design-output/routes.js');
      expect(td.explain(RoutesServer.prototype.start).calls[0].args[0]).to.equal(1234);
    });
  });
});
