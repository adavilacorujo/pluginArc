const path = require("path");
const ImageLoader = require(path.resolve(
  "./arc/core/components/ImageLoader.js"
));

class GIFLoader extends ImageLoader {
  constructor() {
    super();
    this.image = null;
    this.coreComponent = "imageloader";
    this.name = "gifloader";
    this.imageFormat = ["image/gif"];
  }
  process(filepath) {
    var base64Image;
    fs.readFile(filepath, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      // Convert the buffer to a base64 string
      base64Image = data.toString("base64");
    });
    return base64Image;
  }
}

module.exports = GIFLoader;
