System.config({
  transpiler: "typescript",
  typescriptOptions: {
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": true,
    "suppressImplicitAnyIndexErrors": true
  },

  // for systemjs to correctly substitute for truncated paths
  map: {
    'app' : './app',
    'typescript' : '../node_modules/typescript/lib/typescript.js',
    'blockstack' : '../node_modules/blockstack/dist/blockstack.js',
    //'socket.io-client' : '../node_modules/socket.io-client/socket.io.js',
    'socket.io-client' : '../node_modules/socket.io-client/dist/socket.io.js',
    'jasmine' : '../node_modules/jasmine/lib/jasmine.js'
  },

  // for systemjs to correctly substitute for implied files and/or ts/js
  packages: {
    'app'  : {main: 'app', defaultExtension: 'ts'},
    //'app/models/scenes'  : {main: 'test', defaultExtension: 'ts'},
    'blockstack'  : {defaultExtension: 'js'}
    //'socket.io-client' : {defaultExtension: 'js'}, // doesn't work ?!
    //'jasmine' : {defaultExtension: 'js'}, // doesn't work ?!
    //'@angular/core'                    : {main: 'index.js'},
    //'@angular/common'                  : {main: 'index.js'},
    //'@angular/compiler'                : {main: 'index.js'},
    //'@angular/router'                  : {main: 'index.js'},
    //'@angular/platform-browser'        : {main: 'index.js'},
    //'@angular/platform-browser-dynamic': {main: 'index.js'}
  }
});
