const Application = require('./src/application');
const ComponentTree = require('./src/component-tree');
const ImageStorage = require('./src/image-storage');
const LocalStorage = require('./src/local-storage');
const Studio = require('./src/studio');
const DirectoryCapturer = require('./src/directory-capturer');
const DirectoryPixelValidator = require('./src/directory-pixel-validator');
const GcpImage = require('./src/gcp-image');
const RenderServer = require('./src/render-server');
const WebPage = require('./src/web-page');

module.exports = {Application, ComponentTree, ImageStorage, LocalStorage, Studio, DirectoryCapturer, DirectoryPixelValidator, GcpImage, RenderServer, WebPage};
