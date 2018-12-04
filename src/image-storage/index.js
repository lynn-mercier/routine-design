const fs = require('fs');
const ComponentImage = require('./component-image');

class ImageStorage {
  constructor(storage, storageBucketName, componentDirectory, myFs = fs, 
    MyComponentImage = ComponentImage) {
    this.storage_ = storage;
    this.storageBucketName_ = storageBucketName;
    this.componentDirectory_ = componentDirectory;
    this.myFs_ = myFs;
    this.MyComponentImage_ = MyComponentImage;
  }

  async getImages() {
    if (this.images_) {
      return this.images_;
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
    this.componentDirectory_.getFiles().forEach((componentFile) => {
      let imageId = null;
      if (imageJson[componentFile.getBasename()]) {
        imageId = imageJson[componentFile.getBasename()].id
      }
      const componentImage = new this.MyComponentImage_(this.storage_, this.storageBucketName_, componentFile, imageId);
      this.images_.push(componentImage);
    });
    return this.images_;
  }

  async save() {
    const json = {};

    const componentFiles = this.componentDirectory_.getFiles();
    const componentImages = await this.getImages();

    componentImages.forEach((componentImage, index) => {
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
}

module.exports = ImageStorage;
