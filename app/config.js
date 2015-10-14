require.config({
  // make bower_components more sensible
  // expose jquery 
  paths: {
    "bower_components": "../bower_components",
    "jquery": "../bower_components/jquery/dist/jquery",
    "flowchart":"../bower_components/flowchart/release/flowchart.amd",
    "raphael":"../bower_components/raphael/raphael",
    "clipboard":"../bower_components/clipboard/dist/clipboard",
  },
  map: {
    "*": {
      "knockout": "../bower_components/knockout/dist/knockout",
      "ko": "../bower_components/knockout/dist/knockout"
    }
  }
});

// Use the debug version of knockout it development only
// When compiling with grunt require js will only look at the first 
// require.config({}) found in this file
require.config({
  map: {
    "*": {
      "knockout": "../bower_components/knockout/dist/knockout.debug",
      "ko": "../bower_components/knockout/dist/knockout.debug"
    }
  }
});

if (!window.requireTestMode) {
  require(['main'], function(){ });
}

