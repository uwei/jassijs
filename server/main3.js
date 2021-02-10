var requirejs = require('requirejs');

requirejs.config({
   baseUrl:"js/server",
   paths:{
      "remote":"../client/remote"
   },
    //load the mode modules to top level JS file 
    //by passing the top level main.js require function to requirejs
    nodeRequire: require
 });
 
 requirejs(["./main"],
    function () {
       var k=9;
    }
 );