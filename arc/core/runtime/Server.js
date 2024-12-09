const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.app.use(fileUpload());
    this.routes();
    this.state;
  }
  routes() {
    this.app.get("/image/formats", (req, res) => {
      res.send(this.state.sharedState.get("imageloader").acceptedImageFormats);
    });
    this.app.post("/upload/image", (req, res) => {
      // Get the file that was set to our field named "image"
      const { image } = req.files;

      // If no image submitted, exit
      if (!image) return res.status(400).send("only images please!");

      // If doesn't have image mime type prevent from uploading
      if (!/^image/.test(image.mimetype))
        return res.status(400).send("file format not accepted!");

      const imageProcessor =
        this.state.get("imageloader").imageFormatters[image.mimetype];
      if (!imageProcessor)
        return res
          .status(400)
          .send(`file processor for ${image.mimetype} not available`);

      // Move the uploaded image to our upload folder
      const filePath = __dirname + "/public/images/" + image.name;
      image.mv(filePath);

      imageProcessor.process(filePath);
      console.log(`processed file ${image.name}`);

      // All good
      res.sendFile(filePath);
    });
  }

  listen(app) {
    this.state = app.sharedState;
    this.acceptedImageFormats =
      app.sharedState.get("imageloader").acceptedImageFormats;
    this.app.listen(this.port, () => {
      console.log(`server running on port ${this.port}`);
    });
  }
}

module.exports = Server;
