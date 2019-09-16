const {expect} = require('chai');
const td = require('testdouble');
const ComponentWorkshop = require('../../src/component-workshop');
const LocalStorage = require('../../src/local-storage');
const RoutineDesignContainer = require('../../src/local-storage/routine-design-container');
const RoutineDesignTree = require('../../src/routine-design-tree');
const ComponentTree = require('../../src/routine-design-tree/component-tree');
const ComponentDirectory = td.constructor(require('../../src/routine-design-tree/component-tree/component-directory'));

describe('ComponentWorkshop', function() {
  describe('has a componentDirectoryId', function() {
    const MyComponentTree = td.constructor(ComponentTree);
    const componentTree = new MyComponentTree();
    const MyRoutineDesignTree = td.constructor(RoutineDesignTree);
    td.when(MyRoutineDesignTree.prototype.getComponentTree()).thenReturn(componentTree);
    const componentDirectory = new ComponentDirectory();
    const directoriesMap = new Map();
    directoriesMap.set('componentDirectoryId', componentDirectory);
    td.when(MyComponentTree.prototype.getDirectories()).thenReturn(directoriesMap);

    it('#setup', async function() {
      const MyLocalStorage = td.constructor(LocalStorage);
      const MyRoutineDesignContainer = td.constructor(RoutineDesignContainer);
      const routineDesignContainer = new MyRoutineDesignContainer();
      td.when(MyLocalStorage.prototype.createRoutineDesignContainer()).thenReturn(routineDesignContainer);
      const componentWorkshop = 
        new ComponentWorkshop('./render', 'gcp-project-id', 'storage-bucket', MyLocalStorage, MyRoutineDesignTree);
      return componentWorkshop.setup().then(function() {
        expect(td.explain(routineDesignContainer.start).calls.length).to.equal(1);
        expect(td.explain(routineDesignContainer.run).calls[0].args[0]).to.equal('routine-design render ./render');
      });
    });

    it('#captureAll', async function() {
      const MyLocalStorage = td.constructor(LocalStorage);
      const MyRoutineDesignContainer = td.constructor(RoutineDesignContainer);
      const routineDesignContainer = new MyRoutineDesignContainer();
      td.when(MyLocalStorage.prototype.createRoutineDesignContainer()).thenReturn(routineDesignContainer);
      const componentWorkshop = 
        new ComponentWorkshop('./render', 'gcp-project-id', 'storage-bucket', MyLocalStorage, MyRoutineDesignTree);
      return componentWorkshop.captureAll().then(function() {
        expect(td.explain(routineDesignContainer.run).calls[0].args[0]).to.equal(
          'routine-design directory capture gcp-project-id storage-bucket ./render --component-directory=componentDirectoryId');
      });
    });

    describe('#getPixelValidators', function() {
      const MyLocalStorage = td.constructor(LocalStorage);
      const MyRoutineDesignContainer = td.constructor(RoutineDesignContainer);
      const routineDesignContainer = new MyRoutineDesignContainer();
      td.when(MyLocalStorage.prototype.createRoutineDesignContainer()).thenReturn(routineDesignContainer);
      td.when(MyRoutineDesignContainer.prototype.run(td.matchers.anything())).thenResolve('{"allPass":true,"debugId":"debugId"}');
      const componentWorkshop = 
        new ComponentWorkshop('./render', 'gcp-project-id', 'storage-bucket', MyLocalStorage, MyRoutineDesignTree);
      const pixelValidators = componentWorkshop.getPixelValidators();

      it('return a pixel validator', function() {
        expect(pixelValidators.length).to.equal(1);
      });

      it('PixelValidator.getComponentDirectoryId', function() {
        expect(pixelValidators[0].getComponentDirectoryId()).to.equal('componentDirectoryId');
      });

      it('PixelValidator.validate', async function() {
        return pixelValidators[0].validate().then(function(result) {
          expect(td.explain(routineDesignContainer.run).calls[0].args[0]).to.equal(
            'routine-design directory pixel-validate gcp-project-id storage-bucket ./render --component-directory=componentDirectoryId');
          expect(result.allPass).to.be.true;
          expect(result.gcpUrl).to.equal('https://console.cloud.google.com/storage/browser/storage-bucket/componentDirectoryId/debugId/?project=gcp-project-id');
        });
      });
    });

    it('#cleanup', async function() {
      const MyLocalStorage = td.constructor(LocalStorage);
      const MyRoutineDesignContainer = td.constructor(RoutineDesignContainer);
      const routineDesignContainer = new MyRoutineDesignContainer();
      td.when(MyLocalStorage.prototype.createRoutineDesignContainer()).thenReturn(routineDesignContainer);
      const componentWorkshop = 
        new ComponentWorkshop('./render', 'gcp-project-id', 'storage-bucket', MyLocalStorage, MyRoutineDesignTree);
      return componentWorkshop.cleanup().then(function() {
        expect(td.explain(routineDesignContainer.cleanup).calls.length).to.equal(1);
      });
    });
  });
  describe('does not have a componentDirectoryId', function() {
    const MyComponentTree = td.constructor(ComponentTree);
    const componentTree = new MyComponentTree();
    const MyRoutineDesignTree = td.constructor(RoutineDesignTree);
    td.when(MyRoutineDesignTree.prototype.getComponentTree()).thenReturn(componentTree);
    const componentDirectory = new ComponentDirectory();
    const directoriesMap = new Map();
    directoriesMap.set('', componentDirectory);
    td.when(MyComponentTree.prototype.getDirectories()).thenReturn(directoriesMap);

    describe('#getPixelValidators', function() {
      const MyLocalStorage = td.constructor(LocalStorage);
      const MyRoutineDesignContainer = td.constructor(RoutineDesignContainer);
      const routineDesignContainer = new MyRoutineDesignContainer();
      td.when(MyLocalStorage.prototype.createRoutineDesignContainer()).thenReturn(routineDesignContainer);
      td.when(MyRoutineDesignContainer.prototype.run(td.matchers.anything())).thenResolve('{"allPass":true,"debugId":"debugId"}');
      const componentWorkshop = 
        new ComponentWorkshop('./render', 'gcp-project-id', 'storage-bucket', MyLocalStorage, MyRoutineDesignTree);
      const pixelValidators = componentWorkshop.getPixelValidators();

      it('PixelValidator.validate', async function() {
        const result = await pixelValidators[0].validate();
        return pixelValidators[0].validate().then(function(result) {
          expect(td.explain(routineDesignContainer.run).calls[0].args[0]).to.equal(
            'routine-design directory pixel-validate gcp-project-id storage-bucket ./render');
          expect(result.allPass).to.be.true;
          expect(result.gcpUrl).to.equal('https://console.cloud.google.com/storage/browser/storage-bucket/debugId/?project=gcp-project-id');
        });
      });
    });
  });
});
