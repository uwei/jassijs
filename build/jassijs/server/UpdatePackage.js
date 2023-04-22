"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackage = void 0;
const fs = require("fs");
var fpath = require('path');
/**
 * updates serviceworker and create files in root package
 */
function updatePackage() {
    var client_path = "./client";
    var module_path = "./node_modules/jassijs/client";
    if (!fs.existsSync(client_path)) {
        fs.mkdirSync(client_path);
    }
    if (!fs.existsSync(client_path + "/js")) {
        fs.mkdirSync(client_path + "/js");
    }
    if (!fs.existsSync("./jassijs.json")) {
        fs.copyFileSync(module_path.replace("/client", "") + "/jassijs.json", "./jassijs.json");
    }
    if (!fs.existsSync("./tsconfig.json")) {
        fs.copyFileSync(module_path.replace("/client", "") + "/tsconfig.json", "./tsconfig.json");
    }
    if (fs.existsSync(module_path)) {
        var list = fs.readdirSync(module_path);
        list.forEach(function (filename) {
            if (!fs.lstatSync(module_path + "/" + filename).isDirectory()) {
                if (!fs.existsSync(client_path + "/" + filename)) {
                    fs.copyFileSync(module_path + "/" + filename, client_path + "/" + filename);
                }
                if (filename === "jassistart.js" || filename === "service-worker.js") {
                    if (fs.statSync(module_path + "/" + filename).mtime.getTime() > fs.statSync(client_path + "/" + filename).mtime.getTime()) {
                        //update serviceworker if newer
                        console.log("update " + filename);
                        fs.copyFileSync(module_path + "/" + filename, client_path + "/" + filename);
                    }
                }
            }
        });
    }
    if (!fs.existsSync(client_path + "/js/app.js")) {
        fs.copyFileSync(module_path + "/" + "/js/app.js", client_path + "/" + "/js/app.js");
    }
}
exports.updatePackage = updatePackage;
//# sourceMappingURL=UpdatePackage.js.map