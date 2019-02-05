#!/usr/bin/env node
const program = require('commander');
const DirectoryPixelValidator = require('../src/directory-pixel-validator');
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
      const result = await new DirectoryPixelValidator().run(projectId, storageBucketName, componentDirectory, program.port);
      console.log(JSON.stringify(result));
    } catch (err) {
      console.log(err.message);
    }
  });

program.parse(process.argv);
