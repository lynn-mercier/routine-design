#!/usr/bin/env node
const program = require('commander');
const GcpImageBucket = require('../src/gcp-image-bucket');
const RoutineDesignTree = require('../src/routine-design-tree');

program
  .command('capture <projectId> <storageBucketName> <renderDirectory>')
  .option('--component-directory <componentDirectoryId>', 'Specify a sub-directory')
  .option('--port <port>', 'Specify port')
  .action(async function(projectId, storageBucketName, renderDirectory, options) {
    try {
      const routineDesignTree = new RoutineDesignTree(renderDirectory);
      let componentDirectoryId = '';
      if (options.componentDirectory) {
        componentDirectoryId = options.componentDirectory;
      }
      const componentDirectory = routineDesignTree.getComponentTree().getDirectories().get(componentDirectoryId);
      const gcpImageBucket = new GcpImageBucket(projectId, storageBucketName);
      const routineDesignDirectory = gcpImageBucket.createRoutineDesignDirectory(componentDirectory);
      const screenshotCollection = routineDesignDirectory.createScreenshotCollection(options.port);
      await screenshotCollection.capture();
      await screenshotCollection.cleanup();
    } catch (err) {
      console.error(err);
    }
  });

program
  .command('pixel-validate <projectId> <storageBucketName> <renderDirectory>')
  .option('--component-directory <componentDirectoryId>', 'Specify a sub-directory')
  .option('--port <port>', 'Specify port')
  .action(async function(projectId, storageBucketName, renderDirectory, options) {
    try {
      const routineDesignTree = new RoutineDesignTree(renderDirectory);
      let componentDirectoryId = '';
      if (options.componentDirectory) {
        componentDirectoryId = options.componentDirectoryId;
      }
      const componentDirectory = routineDesignTree.getComponentTree().getDirectories().get(componentDirectoryId);
      const gcpImageBucket = new GcpImageBucket(projectId, storageBucketName);
      const routineDesignDirectory = gcpImageBucket.createRoutineDesignDirectory(componentDirectory);
      const screenshotCollection = routineDesignDirectory.createScreenshotCollection(options.port);
      const result = await screenshotCollection.pixelValidate();
      console.log(JSON.stringify(result));
      await screenshotCollection.cleanup();
    } catch (err) {
      console.error(err);
    }
  });

program.parse(process.argv);
