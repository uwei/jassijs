define(["require", "exports", "vs/editor/editor.main", "vs/language/typescript/tsWorker", "jassijs_editor/modul"], function (require, exports, _monaco, tsWorker, modul_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="vs/editor/editor.main" name="_monaco"/>
    /// <amd-dependency path="vs/language/typescript/tsWorker" name="tsWorker"/>
    //hack to make autocompletion for autoimports from other modules
    //let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
    let monacopath = modul_1.default.require.paths.vs.replace("/vs", "");
    var platform_1 = require("vs/base/common/platform");
    platform_1.globals.MonacoEnvironment = {};
    function myfunc() {
        if (require.getConfig().baseUrl === "") {
            setTimeout(() => { myfunc(); }, 10);
        }
        else {
            require(['vs/language/typescript/tsWorker'], function (tsWorker) {
                tsWorker.TypeScriptWorker.prototype.getCompletionsAtPosition = async function (fileName, position, properties) {
                    return await this._languageService.getCompletionsAtPosition(fileName, position, properties);
                };
            });
        }
        //   }
    }
    platform_1.globals.MonacoEnvironment.getWorker = function (workerId, label) {
        const myPath = 'vs/base/worker/defaultWorkerFactory.js';
        //"https://cdn.jsdelivr.net/npm/monaco-editor@0.26.1/dev/vs/base/worker/workerMain.js"
        let scriptPath = monacopath + "/vs/base/worker/workerMain.js"; // require.toUrl('./' + workerId);
        //"https://cdn.jsdelivr.net/npm/monaco-editor@0.26.1/dev/"
        const workerBaseUrl = require.toUrl(myPath).slice(0, -myPath.length); // explicitly using require.toUrl(), see https://github.com/microsoft/vscode/issues/107440#issuecomment-698982321
        let js = `/*${label}*/self.MonacoEnvironment={baseUrl: '${workerBaseUrl}'};const ttPolicy = self.trustedTypes?.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });importScripts(ttPolicy?.createScriptURL('${scriptPath}') ?? '${scriptPath}');/*${label}*/;`;
        if (label === "typescript")
            js += myfunc.toString() + ";myfunc();";
        const blob = new Blob([js], { type: 'application/javascript' });
        var workerUrl = URL.createObjectURL(blob);
        //var workerUrl=URL.createObjectURL(blob);
        return new Worker(workerUrl, { name: label });
    };
});
//# sourceMappingURL=monaco.js.map