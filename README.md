# pluginArc

This repo is a playground. I've read over the Eclipse plugin architecture and thought I'd give it a try in JS. This plugin arc only serves to extend existing capabilities, the only one so far being image processing. 

## File Tree
.
├── README.md
├── arc
│   ├── core
│   │   ├── components
│   │   │   └── ImageLoader.js
│   │   ├── plugins
│   │   │   └── JPEGLoader.js
│   │   └── runtime
│   │       ├── EventBus.js
│   │       ├── ReadModulesDynamic.js
│   │       ├── Server.js
│   │       ├── State.js
│   │       └── public
│   │           ├── images
│   │           │   ├── IMG_0149.jpeg
│   │           │   └── MyImage.jpeg
│   │           └── index.html
│   └── plugins
│       └── GIFLoader.js
├── main.js
├── package-lock.json
└── package.json

`main.js` defines a class that encapsulates a state variable and an event bus accesible to other components of the app. I was running into some issues when trying to update the state across startup phases, i.e. state not being updated synchronously. Upon further reading it seem using events we can ensure our `async` portions behave synchronously. Why would we want this? Some of the code used to read modules dynamically needs to be ran asynchronously. 


## Program Flow

The program start at `main.js` by defining an `App` class, instantiating it, and emiting an event that kicks off everything else (loading core components, core plugins, and external plugins). 

The idea is to have a small set of core components that are extended either by core plugins (plugins we develop ourselves) and/or external plugins (plugins developed by other developers external to the project). 

The project also uses the `Server.js` to create an Express server that allows you to upload an image and leverage the plugins to process it according to its `mimetype`. To do so, you can upload an image to the endpoint defined in `Server.js` by sending a programatic HTTP request or you can just open the `index.html` in your browser. 
