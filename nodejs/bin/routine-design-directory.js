#!/usr/bin/env node
const program = require('commander');
const GcpImageBucket = require('../src/gcp-image-bucket');
const RoutineDesignTree = require('../src/routine-design-tree');

program
  .command('capture <projectId> <storageBucketName> <renderDirectory>')
  .option('--component-directory <componentDirectoryId>', 'Specify a sub-directory')
  .option('--port <port>', 'Specify port')
  .action(async function(projectId, storageBucketName, renderDirectory) {
    try {
      const routineDesignTree = new RoutineDesignTree(renderDirectory);
      let componentDirectoryId = '';
      if (program.componentDirectory) {
        componentDirectoryId = program.componentDirectory;
      }
      const componentDirectory = routineDesignTree.getComponentTree().getDirectories().get(componentDirectoryId);
      const gcpImageBucket = new GcpImageBucket(projectId, storageBucketName);
      const routineDesignDirectory = gcpImageBucket.createRoutineDesignDirectory(componentDirectory);
      await (routineDesignDirectory.createScreenshotCollection(program.port)).capture();
    } catch (err) {
      console.log(err.message);
    }
  });

program
  .command('pixel-validate <projectId> <storageBucketName> <renderDirectory>')
  .option('--component-directory <componentDirectoryId>', 'Specify a sub-directory')
  .option('--port <port>', 'Specify port')
  .action(async function(projectId, storageBucketName, renderDirectory) {
    try {
      const routineDesignTree = new RoutineDesignTree(renderDirectory);
      let componentDirectoryId = '';
      if (program.componentDirectory) {
        componentDirectoryId = program.componentDirectoryId;
      }
      const componentDirectory = routineDesignTree.getComponentTree().getDirectories().get(componentDirectoryId);
      const gcpImageBucket = new GcpImageBucket(projectId, storageBucketName);
      const routineDesignDirectory = gcpImageBucket.createRoutineDesignDirectory(componentDirectory);
      const result = await (routineDesignDirectory.createScreenshotCollection(program.port)).pixelValidate();
      console.log(JSON.stringify(result));
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);
