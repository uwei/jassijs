

//require.config({ paths: { vs: '//cdn.jsdelivr.net/npm/monaco-editor@0.20.0/dev/vs' } });
//require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev/vs' } });
//require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });
//let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
/*require.config({ paths: {
    monacoLib:"jassijs_editor/ext/monacoLib",
    vs: monacopath+"/vs"
 } 
});
*/
define("jassijs_editor/ext/monacoLib", ["require"], function (require, editor) {
    //window["globalThis"] = {};
    
    return {
    }
});

//hach to make autocompletion for autoimports from other modules
define("jassijs_editor/ext/monaco", ["jassijs_editor/ext/monacoLib", "require", 'vs/editor/editor.main', "vs/language/typescript/tsWorker"/*,"monacoLib_editorWorkerServiceImpl","monacoLib_editorSimpleWorker","tsWorker"*/], function (mlib, require, monaco, tsWorker/*,editorWorkerServiceImpl,editorSimpleWorker,tsWorker*/) {
    //let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
    let monacopath = require("jassijs_editor/modul").default.require.paths.vs.replace("/vs", "");
    //get Typescript instance
    //window.ts = window["globalThis"].ts;
    //window.globalThisOld = window["globalThis"];
    
    //delete window["globalThis"];
    var platform_1 = require("vs/base/common/platform");
    platform_1.globals.MonacoEnvironment = {};

    function myfunc() {
        
       /* if(require.defined('vs/language/typescript/tsWorker')){
            require(['vs/language/typescript/tsWorker'], function (tsWorker) {
                tsWorker.TypeScriptWorker.prototype.getCompletionsAtPosition = async function (fileName, position, properties) {

                    return await this._languageService.getCompletionsAtPosition(fileName, position, properties);
                }
            });
        }else{*/
        //    debugger;
        if(require.getConfig().baseUrl===""){
            setTimeout(()=>{                myfunc();},10);
        }else{
            require(['vs/language/typescript/tsWorker'], function (tsWorker) {
                tsWorker.TypeScriptWorker.prototype.getCompletionsAtPosition = async function (fileName, position, properties) {

                    return await this._languageService.getCompletionsAtPosition(fileName, position, properties);
                }
            });
        }
     //   }
      
    }
    platform_1.globals.MonacoEnvironment.getWorker = function (workerId, label) {
        //var js="/*editorWorkerService*/self.MonacoEnvironment={baseUrl: '"+monacopath+"/'};importScripts('"+monacopath+"/vs/base/worker/"+workerId+"');/*editorWorkerService*/"+myfunc.toString()+";myfunc();";
        //const blob = new Blob([js], { type: 'application/javascript' });
        const myPath = 'vs/base/worker/defaultWorkerFactory.js';
        //"https://cdn.jsdelivr.net/npm/monaco-editor@0.26.1/dev/vs/base/worker/workerMain.js"
        let scriptPath = monacopath + "/vs/base/worker/workerMain.js";// require.toUrl('./' + workerId);
        //"https://cdn.jsdelivr.net/npm/monaco-editor@0.26.1/dev/"
        const workerBaseUrl = require.toUrl(myPath).slice(0, -myPath.length); // explicitly using require.toUrl(), see https://github.com/microsoft/vscode/issues/107440#issuecomment-698982321
        let js = `/*${label}*/self.MonacoEnvironment={baseUrl: '${workerBaseUrl}'};const ttPolicy = self.trustedTypes?.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });importScripts(ttPolicy?.createScriptURL('${scriptPath}') ?? '${scriptPath}');/*${label}*/;`;
        if (label === "typescript")
            js += myfunc.toString() + ";myfunc();";
        const blob = new Blob([js], { type: 'application/javascript' });
        var workerUrl = URL.createObjectURL(blob);

        //var workerUrl=URL.createObjectURL(blob);
        return new Worker(workerUrl, { name: label });
    }





    return {};
});
/*
 //hack to get languageService
    /*var orgLS=ts.createLanguageService;

    var funcResolve=undefined;
    var waiter=new Promise((resolve)=>{
        funcResolve=resolve;
    });
    ts.createLanguageService=function(host, documentRegistry, syntaxOnlyOrLanguageServiceMode){
            let ret=orgLS(host, documentRegistry, syntaxOnlyOrLanguageServiceMode);
            funcResolve(ret);
            return ret;
    }
    var ret = {
        getLanguageService:async function(){
            return await waiter;
        }
    }
    //hack monaco allways create a worker which not run as serviceWorker - so we can share the languageservice
    var EditorWorkerHost = require("vs/editor/common/services/editorWorkerServiceImpl").EditorWorkerHost;
    var EditorSimpleWorker = require("vs/editor/common/services/editorSimpleWorker").EditorSimpleWorker;
    var EditorWorkerClient = require("vs/editor/common/services/editorWorkerServiceImpl").EditorWorkerClient;
    class SynchronousWorkerClient {
        constructor(instance) {
            this._instance = instance;
            this._proxyObj = Promise.resolve(this._instance);
        }
        dispose() {
            this._instance.dispose();
        }
        getProxyObject() {
            return this._proxyObj;
        }
    }
    EditorWorkerClient.prototype._getOrCreateWorker = function() {
        if (!this._worker)
            this._worker = new SynchronousWorkerClient(new EditorSimpleWorker(new EditorWorkerHost(this), null));
        return this._worker;

    }*/