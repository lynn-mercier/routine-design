#!/usr/bin/env node
const program = require('commander');
const DirectoryCapturer = require('../src/directory-capturer');
const ComponentTree = require('../src/component-tree');

program
  .option('--component-directory <componentDirectoryId>', 'Specify a sub-directory')
  .option('--port <port>', 'Specify port');

program
  .arguments('<projectId> <storageBucketName> <renderDirectory>')
  .action(async function(projectId, storageBucketName, renderDirectory) {
    try {
      const componentTree = new ComponentTree(renderDirectory);
      let componentDirectoryId = '';
      if (program.componentDirectory) {
        componentDirectoryId = program.componentDirectory;
      }
      const componentDirectory = componentTree.getDirectories().get(componentDirectoryId);
      await new DirectoryCapturer().run(projectId, storageBucketName, componentDirectory, program.port);
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);
