const fs = require('fs');
const randomstring = require('randomstring');
const ComponentImage = require('./component-image');

class ImageStorage {
  constructor(projectId, storageBucketName, componentDirectory, 
    myFs = fs, MyComponentImage = ComponentImage, myRandomstring = randomstring) {
    this.projectId_ = projectId;
    this.storageBucketName_ = storageBucketName;
    this.componentDirectory_ = componentDirectory;
    this.myFs_ = myFs;
    this.MyComponentImage_ = MyComponentImage;
    this.debugId_ = myRandomstring.generate();
  }

  async init() {
    if (this.images_) {
      return;
    }

    let imageJson = {};
    if (this.myFs_.existsSync(this.componentDirectory_.getDirectory()+"/image.json")) {
      const imageJsonPromise = new Promise((resolve, reject) => {
        this.myFs_.readFile(this.componentDirectory_.getDirectory()+"/image.json", function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      imageJson = JSON.parse(await imageJsonPromise);
    }

    this.images_ = [];

    let componentDirectoryPath = this.componentDirectory_.getPath();
    if (componentDirectoryPath === '/') {
      componentDirectoryPath = '';
    }
    const gcpDebugPath = componentDirectoryPath + '/' + this.debugId_;

    this.componentDirectory_.getFiles().forEach((componentFile) => {
      let imageId = null;
      if (imageJson[componentFile.getBasename()]) {
        imageId = imageJson[componentFile.getBasename()].id
      }
      const componentImage = new this.MyComponentImage_(this.projectId_, this.storageBucketName_, gcpDebugPath, componentFile, imageId);
      this.images_.push(componentImage);
    });
  }

  getImages() {
    return this.images_;
  }

  async save() {
    const json = {};

    const componentFiles = this.componentDirectory_.getFiles();

    this.images_.forEach((componentImage, index) => {
      const imageId = componentImage.getId();
      if (imageId) {
        json[componentFiles[index].getBasename()] = {
          id: imageId,
          url: componentImage.createGcpImage().getUrl()
        };
      }
    });

    return new Promise((resolve, reject) => {
      this.myFs_.writeFile(this.componentDirectory_.getDirectory()+"/image.json", JSON.stringify(json, null, 2), 'utf8', function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  getDebugId() {
    return this.debugId_;
  }
}

module.exports = ImageStorage;
