var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs_editor/modul"], function (require, exports, modul_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    modul_1 = __importDefault(modul_1);
    //hack to make autocompletion for autoimports from other modules
    //let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
    let monacopath = modul_1.default.require.paths.vs.replace("/vs", "");
    const channel = new MessageChannel();
    async function downloadFile(file) {
        return await new Promise((resolve, reject) => {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', file.replace("./client", ""), true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status === 200)
                        resolve(xmlHttp.responseText);
                    else
                        resolve(undefined);
                }
                ;
            };
            xmlHttp.onerror = (err) => {
                resolve(undefined);
            };
            xmlHttp.send(null);
        });
    }
    ;
    async function test() {
        var s = await downloadFile(monacopath + "/vs/language/typescript/tsWorker.js?1");
        /*async getCompletionsAtPosition(fileName, position) {
            if (fileNameIsLib(fileName)) {
              return void 0;
            }
            return this._languageService.getCompletionsAtPosition(fileName, position, void 0);
          }*/
        s = s.replace("async getCompletionsAtPosition(fileName, position)", "async getCompletionsAtPosition(fileName, position,settings)");
        s = s.replace("this._languageService.getCompletionsAtPosition(fileName, position, void 0);", "this._languageService.getCompletionsAtPosition(fileName, position, settings);");
        s = s.replace("var factory2 =", "var factory2 = globalThis.tsfactory =");
        navigator.serviceWorker.controller.postMessage({
            type: 'SAVE_FILE',
            filename: (monacopath + "/vs/language/typescript/tsWorker.js"),
            code: s
        }, [channel.port2]);
    }
    test();
});
//# sourceMappingURL=monaco2.js.map