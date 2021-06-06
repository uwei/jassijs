/*
requirejs.config({
    paths: {
        'ace': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/',
        'ace/ext/language_tools': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools'
    },
    shim: {
        'ace/ext/language_tools': ['ace/ace'],
    }
});*/
define("jassijs_editor/ext/acelib", ["require", 'ace/ace',
    'ace/ext/language_tools'], function (require, ac) {
    //  var tsmode= require("ace/mode/typescript");
    /*  var WorkerClient = require("ace/worker/worker_client").WorkerClient;
      var createWorker = function (session) {
          var worker = new WorkerClient(["ace"], "jassijs/ext/ace_tsmode", "WorkerModule");
          worker.attachToDocument(session.getDocument());

          worker.on("lint", function (results) {
              session.setAnnotations(results.data);
          });

          worker.on("terminate", function () {
              session.clearAnnotations();
          });

          return worker;
      };*/
    return {
        default: ac,
    };
});
//# sourceMappingURL=acelib.js.map
//# sourceMappingURL=acelib.js.map