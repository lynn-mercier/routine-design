#!/usr/bin/env node
const program = require('commander');
const GcpImageBucket = require('../src/gcp-image-bucket');
const RoutineDesignTree = require('../src/routine-design-tree');

program
  .command('capture <projectId> <storageBucketName> <renderDirectory>')
  .option('--component-directory <componentDirectoryId>', 'Specify a sub-directory')
  .option('--port <port>', 'Specify port')
  .option('--try-count <tryCount>', 'Specify number of times to try capturing a screenshot')
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
      const screenshotCollection = routineDesignDirectory.createScreenshotCollection(options.port, options.tryCount);
      try {
        await screenshotCollection.capture();
      } finally {
        await screenshotCollection.cleanup();
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program
  .command('pixel-validate <projectId> <storageBucketName> <renderDirectory>')
  .option('--component-directory <componentDirectoryId>', 'Specify a sub-directory')
  .option('--port <port>', 'Specify port')
  .option('--try-count <tryCount>', 'Specify number of times to try capturing a screenshot')
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
      const screenshotCollection = routineDesignDirectory.createScreenshotCollection(options.port, options.tryCount);
      try {
        const result = await screenshotCollection.pixelValidate();
        console.log(JSON.stringify(result));
      } finally {
        await screenshotCollection.cleanup();
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
