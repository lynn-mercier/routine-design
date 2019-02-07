#!/usr/bin/env node
const program = require('commander');
const DirectoryCapturer = require('../src/directory-capturer');
const DirectoryPixelValidator = require('../src/directory-pixel-validator');
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
      await new DirectoryCapturer().run(projectId, storageBucketName, componentDirectory, program.port);
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
      const result = await new DirectoryPixelValidator().run(projectId, storageBucketName, componentDirectory, program.port);
      console.log(JSON.stringify(result));
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);

