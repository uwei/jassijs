undefined/*requirejs.config({
    paths: {
        'ace':'lib/ace/src-min-noconflict/ace',
        'ace.lang':'lib/ace/src-min-noconflict/ext-language_tools'
    },
   shim: {
        'ace.lang': ['ace'],
    }
});*/
requirejs.config({
    paths: {
        'ace': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/',
        'ace/ext/language_tools': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools'
    },
    shim: {
        'ace/ext/language_tools': ['ace/ace'],
    }
});
define("jassi/ext/acelib",["require",'ace/ace',
    'ace/ext/language_tools'], function (require,ac) {
              //  var tsmode= require("ace/mode/typescript");
              /*  var WorkerClient = require("ace/worker/worker_client").WorkerClient;
                var createWorker = function (session) {
                    var worker = new WorkerClient(["ace"], "jassi/ext/ace_tsmode", "WorkerModule");
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
                  /*  createWorker:createWorker,
                    changeTSMode:function(session){
                      //  var tsmode=session.$mode;
                        session.$mode.createWorker=createWorker;
                        var k=9;
                    }*/
                }
            });
