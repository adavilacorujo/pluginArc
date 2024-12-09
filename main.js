const State = require("./arc/core/runtime/State.js");
const EventBus = require("./arc/core/runtime/EventBus.js");
const Server = require("./arc/core/runtime/Server.js");
const ReadModulesDynamic = require("./arc/core/runtime/ReadModulesDynamic.js");

class App {
  constructor() {
    this.sharedState = new State();
    this.eventBus = new EventBus();
    this.server = new Server();
  }
  setup() {
    this.eventBus.on("stateinit", () => {
      console.log("[*] loading core components");
      this.loadCoreComponents();
    });
    this.eventBus.on("stateinit:registercore", () => {
      console.log("[*] loading core plugins");
      this.loadCorePlugins();
    });
    this.eventBus.on("stateinit:registercoreplugins", () => {
      console.log("[*] loading external plugins");
      this.loadPlugins();
    });
    this.eventBus.on("stateinit:registerexternalplugins", () => {
      console.log("[*] starting express server");
      this.eventBus.emit("serverready");
    });

    // cleanup...not sure how to do this
    delete this.eventBus["stateinint"];
    delete this.eventBus["stateinit:registercore"];
    delete this.eventBus["stateinit:registercoreplugins"];
    delete this.eventBus["stateinit:registerexternalplugins"];
  }
  start() {
    this.eventBus.on("serverready", () => {
      this.server.listen(this);
    });
  }
  async loadCoreComponents() {
    const components = await new ReadModulesDynamic(
      "./arc/core/components/*.js"
    ).loadModules(this);
    Promise.all(components)
      .then((components) => {
        for (const component of components) {
          const componentInstance = new component.default();
          this.updateState(componentInstance.name, componentInstance, "set");
        }
        this.eventBus.emit("stateinit:registercore");
      })
      .catch((error) => console.log("error!", error));
  }
  async loadCorePlugins() {
    const plugins = await new ReadModulesDynamic(
      "./arc/core/plugins/*.js"
    ).loadModules();
    Promise.all(plugins)
      .then((plugins) => {
        for (const plugin of plugins) {
          const pluginInstance = new plugin.default();
          try {
            // check core component exists or is specified
            const coreComponent = this.sharedState.get(
              pluginInstance.coreComponent
            );
            coreComponent.registerPlugin(pluginInstance);
          } catch (error) {
            console.log(
              `Plugin ${pluginInstance.name} does not define core component!`
            );
          }
        }
        this.eventBus.emit("stateinit:registercoreplugins");
      })
      .catch((error) => console.log("error!", error));
  }
  async loadPlugins() {
    const plugins = await new ReadModulesDynamic(
      "./arc/plugins/*.js"
    ).loadModules();
    Promise.all(plugins)
      .then((plugins) => {
        for (const plugin of plugins) {
          try {
            const pluginInstance = new plugin.default();
            // check core component exists or is specified
            const coreComponent = this.sharedState.get(
              pluginInstance.coreComponent
            );
            coreComponent.registerPlugin(pluginInstance);
          } catch (error) {
            console.log(error);
          }
        }
        this.eventBus.emit("stateinit:registerexternalplugins");
      })
      .catch((error) => console.log("error!", error));
  }
  updateState(key, value, action) {
    switch (action) {
      case "set":
        this.sharedState.set(key, value);
      case "get":
        this.sharedState.get(key);
    }
  }
}

const app = new App();
app.setup();
app.eventBus.emit("stateinit", app);
app.start();
