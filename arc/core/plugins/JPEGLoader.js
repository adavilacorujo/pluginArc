const path = require("path");
const fs = require("fs");

const ImageLoader = require(path.resolve(
  "./arc/core/components/ImageLoader.js"
));

class JPEGLoader extends ImageLoader {
  constructor() {
    super();
    this.image = null;
    this.coreComponent = "imageloader";
    this.name = "jpegloader";
    this.imageFormat = ["image/jpeg", "image/jpg"];
  }
  process(filepath) {
    return fs.readFileSync(path.resolve(filepath), "utf-8");
  }
}

module.exports = JPEGLoader;
