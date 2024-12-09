class ImageLoader {
  constructor() {
    this.image = null;
    this.name = "imageloader";
    this.acceptedImageFormats = [];
    this.imageFormatters = {};
  }
  registerPlugin(plugin) {
    const name = plugin.name;
    this[name] = plugin.process;
    plugin.imageFormat.forEach((format) => {
      this.acceptedImageFormats.push(format.toLowerCase());
      this.imageFormatters[format.toLowerCase()] = plugin;
    });
  }
  process(filepath) {}
}

module.exports = ImageLoader;
