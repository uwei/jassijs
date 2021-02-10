

//require.config({ paths: { vs: '//cdn.jsdelivr.net/npm/monaco-editor@0.20.0/dev/vs' } });
//require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev/vs' } });
//require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });
let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
require.config({ paths: {
    monacoLib:"jassi/ext/monacoLib",
    vs: monacopath+"/vs"
 } 
});
/*
requirejs.config({
    paths: {
        'monacoLib': '//cdn.jsdelivr.net/npm/monaco-editor@0.20.0/dev/vs/editor/editor.main', 
        'monacoMain': 'vs/editor/editor.main', 
        
        'monacoLib_editorWorkerServiceImpl':"vs/editor/common/services/editorWorkerServiceImpl",
        'monacoLib_editorSimpleWorker':"vs/editor/common/services/editorSimpleWorker",
        'tsWorker':"vs/language/typeScript/tsWorker",

    },
   shim: {
		'monacoMain': ["monacoLib"],
        "monacoLib_editorWorkerServiceImpl": ["monacoLib"],
        "monacoLib_editorSimpleWorker": ["monacoLib"],
        "tsWorker": ["monacoLib"],
    }

});*/
define("jassi/ext/monacoLib",["require"], function (require,editor) {
    window["module"]={};
    window["module"].exports={};
   
    return {
    }
});


define("jassi/ext/monaco",["jassi/ext/monacoLib","require", 'vs/editor/editor.main',"vs/language/typescript/tsWorker"/*,"monacoLib_editorWorkerServiceImpl","monacoLib_editorSimpleWorker","tsWorker"*/], function(mlib,require, monaco,tsWorker/*,editorWorkerServiceImpl,editorSimpleWorker,tsWorker*/) {
   
    //get Typescript instance
    window.ts=window["module"].exports;
    delete window["module"];
    var platform_1=require("vs/base/common/platform");
    platform_1.globals.MonacoEnvironment={};
    
    function myfunc(){
        var worker=require(['vs/language/typescript/tsWorker'],function(tsWorker){
            tsWorker.TypeScriptWorker.prototype.getCompletionsAtPosition=async function(fileName, position,properties){
               
                return await this._languageService.getCompletionsAtPosition(fileName, position, properties);
            }
          
        });
    }
   platform_1.globals.MonacoEnvironment.getWorker=function(workerId, label){
				var js="/*editorWorkerService*/self.MonacoEnvironment={baseUrl: '"+monacopath+"/'};importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev/vs/base/worker/workerMain.js');/*editorWorkerService*/"+myfunc.toString()+";myfunc();";
				const blob = new Blob([js], { type: 'application/javascript' });
				var workerUrl=URL.createObjectURL(blob);
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