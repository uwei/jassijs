
import modul from "jassijs_editor/modul";
//hack to make autocompletion for autoimports from other modules
//let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
let monacopath = modul.require.paths.vs.replace("/vs", "");
export { };
const channel = new MessageChannel();


async function downloadFile(file: string) {
    return await new Promise((resolve, reject) => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', file.replace("./client", ""), true);

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status === 200)
                    resolve(xmlHttp.responseText);
                else
                    resolve(undefined);
            };
        };
        xmlHttp.onerror = (err) => {
            resolve(undefined);
        }
        xmlHttp.send(null);

    })
};

async function test(){

    var s=<string>await downloadFile(monacopath+"/vs/language/typescript/tsWorker.js?1");
    /*async getCompletionsAtPosition(fileName, position) {
        if (fileNameIsLib(fileName)) {
          return void 0;
        }
        return this._languageService.getCompletionsAtPosition(fileName, position, void 0);
      }*/
    s=s.replace("async getCompletionsAtPosition(fileName, position)","async getCompletionsAtPosition(fileName, position,settings)");
    s=s.replace("this._languageService.getCompletionsAtPosition(fileName, position, void 0);","this._languageService.getCompletionsAtPosition(fileName, position, settings);");
    
    navigator.serviceWorker.controller.postMessage({
        type: 'SAVE_FILE',
        filename:(monacopath+"/vs/language/typescript/tsWorker.js"),
        code: s
    }, [channel.port2]);
 }
test();