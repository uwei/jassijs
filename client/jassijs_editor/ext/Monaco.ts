/// <amd-dependency path="vs/editor/editor.main" name="_monaco"/>
/// <amd-dependency path="vs/language/typescript/tsWorker" name="tsWorker"/>
declare var _monaco;
declare var tsWorker;
declare var require;

//var defaultWorkerFactory= require("vs/base/browser/defaultWorkerFactory");

//  /tsWorker.js
/*
    async getCompletionsAtPosition(fileName, position) {
      if (fileNameIsLib(fileName)) {
        return void 0;
      }
      return this._languageService.getCompletionsAtPosition(fileName, position, void 0);
    }*/

//hack to make autocompletion for autoimports from other modules
//let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
/*let monacopath = modul.require.paths.vs.replace("/vs", "");
var defaultWorkerFactory= require("vs/base/browser/defaultWorkerFactory");
var orgfunc=defaultWorkerFactory.DefaultWorkerFactory.prototype.create;
defaultWorkerFactory.DefaultWorkerFactory.prototype.create=function(p1,p2,p3){
    debugger;
    return orgfunc(p1,p2,p3);
}
function myfunc() {
    if (require.getConfig().baseUrl === "") {
        setTimeout(() => { myfunc(); }, 10);
    } else {
        require(['vs/language/typescript/tsWorker'], function (tsWorker) {
            tsWorker.TypeScriptWorker.prototype.getCompletionsAtPosition = async function (fileName, position, properties) {

                return await this._languageService.getCompletionsAtPosition(fileName, position, properties);
            }
        });
    }
    //   }

}*/
/*defaultWorkerFactory.getWorkerBootstrapUrl=function(scriptPath,label){
    debugger;
    var labelneu="";
    if(label==="typescript"){
        labelneu="typescript"+myfunc.toString() + ";myfunc();"+label
    }
    orgfunc(scriptPath,labelneu);
}*/
//var platform_1 = require("vs/base/common/platform");
//platform_1.globals.MonacoEnvironment = {};
export { };


