const { glob } = require("glob");
const path = require("path");

class ReadModulesDynamic {
  constructor(path) {
    this.path = path;
  }

  init(app) {
    // app.eventBus.on("stateinit", this.loadModules);
    this.loadModules(app);
  }
  async readModules(path) {
    return glob(path);
  }
  async importModule(module) {
    return import(path.resolve(module));
  }
  async loadModules() {
    // const modulePaths = await this.readModules("./arc/core/components/*.js");
    const modulePaths = await this.readModules(this.path);

    return modulePaths.map(
      async (component) => await this.importModule(component)
    );
  }
  register(module) {
    this.state.set(module.name, module);
  }
  remove(module) {
    this.state.remove(module.name);
  }
}

module.exports = ReadModulesDynamic;
