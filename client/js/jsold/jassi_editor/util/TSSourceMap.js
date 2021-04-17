var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/ext/sourcemap", "jassi/jassi", "jassi/remote/Server", "jassi/remote/Jassi"], function (require, exports, sourcemap_1, jassi_1, Server_1, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TSSourceMap = void 0;
    //var sourceMap=window["sourceMap"];
    let TSSourceMap = class TSSourceMap {
        async getLineFromTS(tsfile, line, column) {
            var jscode;
            var mapcode = "";
            var filenumber = 0;
            var jsfilename;
            if (Server_1.Server.filesInMap && Server_1.Server.filesInMap[tsfile]) {
                var mod = Server_1.Server.filesInMap[tsfile].modul;
                jsfilename = jassi_1.default.modules[mod];
                mapcode = await $.ajax({ url: jsfilename + ".map", dataType: "text" });
                filenumber = Server_1.Server.filesInMap[tsfile].id;
            }
            else {
                jsfilename = "js/" + tsfile.replace(".ts", ".js");
                jscode = await $.ajax({ url: jsfilename, dataType: "text" });
                var pos = jscode.indexOf("//" + "# sourceMappingURL=");
                if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                    var b64 = jscode.substring(pos + 50);
                    mapcode = ts["base64decode"](undefined, b64);
                    //mapcode = decodeURIComponent(escape((b64)));
                }
                else {
                    mapcode = await $.ajax({ url: "js/" + tsfile.replace(".ts", ".js.map"), dataType: "text" });
                }
            }
            var ret = new Promise((resolve, reject) => {
                var isinline = false;
                sourcemap_1.default.SourceMapConsumer.initialize({
                    "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
                });
                var rawSourceMap = JSON.parse(mapcode);
                sourcemap_1.default.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                    var test = consumer.sources;
                    var l = consumer.generatedPositionFor({
                        source: rawSourceMap.sources[filenumber],
                        line: line,
                        column: column
                    });
                    l.jsfilename = jsfilename;
                    return l;
                }).then(function (whatever) {
                    resolve(whatever);
                });
            });
            return ret;
        }
        async getLineFromJS(jsfile, line, column) {
            var jscode = await $.ajax({ url: jsfile, dataType: "text" });
            var mapcode = "";
            var pos = jscode.indexOf("//" + "# sourceMappingURL=");
            if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                var b64 = jscode.substring(pos + 50);
                mapcode = atob(b64);
            }
            else {
                mapcode = await $.ajax({ url: jsfile.replace(".js", ".js.map"), dataType: "text" });
            }
            var ret = new Promise((resolve, reject) => {
                sourcemap_1.default.SourceMapConsumer.initialize({
                    "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
                });
                var rawSourceMap = JSON.parse(mapcode);
                sourcemap_1.default.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                    var test = consumer.sources;
                    var l = consumer.originalPositionFor({
                        bias: sourcemap_1.default.SourceMapConsumer.GREATEST_LOWER_BOUND,
                        line: line,
                        column: column
                    });
                    return l;
                }).then(function (whatever) {
                    resolve(whatever.line);
                });
            });
            return ret;
            //  jassi.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js",function(data){
        }
    };
    TSSourceMap = __decorate([
        Jassi_1.$Class("jassi_editor.util.TSSourceMap")
    ], TSSourceMap);
    exports.TSSourceMap = TSSourceMap;
});
//# sourceMappingURL=TSSourceMap.js.map
//# sourceMappingURL=TSSourceMap.js.map