var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ext/sourcemap", "jassijs/remote/Server", "jassijs/remote/Registry"], function (require, exports, sourcemap_1, Server_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TSSourceMap = void 0;
    //var sourceMap=window["sourceMap"];
    let TSSourceMap = class TSSourceMap {
        async getCode(file) {
            return $.ajax({ url: file, dataType: "text" });
            // await new Server().loadFile(file);
        }
        async getLineFromTS(tsfile, line, column) {
            var jscode;
            var mapcode = "";
            var filenumber = 0;
            var jsfilename;
            if (Server_1.Server.filesInMap && Server_1.Server.filesInMap[tsfile]) {
                var mod = Server_1.Server.filesInMap[tsfile].modul;
                jsfilename = jassijs.modules[mod];
                var mapname = jsfilename.split("").reverse().join("").replace("sj.", "pam.sj.").split("").reverse().join("").split("?")[0];
                mapcode = await this.getCode(mapname); //await $.ajax({ url: jsfilename+".map", dataType: "text" });
                filenumber = Server_1.Server.filesInMap[tsfile].id;
            }
            else {
                //replace last .ts to .js
                jsfilename = "js/" + tsfile.split("").reverse().join("").replace("st.", "sj.").split("").reverse().join("").split("?")[0];
                jscode = await this.getCode(jsfilename); // await $.ajax({ url: jsfilename, dataType: "text" });
                var pos = jscode.indexOf("//" + "# sourceMappingURL=");
                if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                    var b64 = jscode.substring(pos + 50);
                    mapcode = ts["base64decode"](undefined, b64);
                    //mapcode = decodeURIComponent(escape((b64)));
                }
                else {
                    //mapcode = await $.ajax({ url: "js/" + tsfile.replace(".ts", ".js.map"), dataType: "text" });
                    //replace last .js to .js.map
                    var mapfile = tsfile.split("").reverse().join("").replace("st.", "pam.sj.").split("").reverse().join("").split("?")[0];
                    mapcode = await this.getCode("js/" + mapfile);
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
            var data = await this.getLinesFromJS(jsfile, [{ line, column }]);
            return ((data === undefined || data.length === 0) ? undefined : data[0]);
        }
        async getLinesFromJS(jsfile, data) {
            var jscode = await this.getCode(jsfile.split("?")[0]); // await $.ajax({ url: jsfile, dataType: "text" });
            var mapcode = "";
            var pos = jscode.indexOf("//" + "# sourceMappingURL=");
            if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                var b64 = jscode.substring(pos + 50);
                mapcode = atob(b64);
            }
            else if (pos) {
                //TODO parse the correct map
                var mapfile = jsfile.split("").reverse().join("").replace("sj.", "pam.sj.").split("").reverse().join("").split("?")[0];
                mapcode = await new Server_1.Server().loadFile(mapfile);
            }
            else
                return undefined;
            sourcemap_1.default.SourceMapConsumer.initialize({
                "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
            });
            var rawSourceMap = JSON.parse(mapcode);
            var ret = [];
            for (var x = 0; x < data.length; x++) {
                var one = await new Promise((resolve, reject) => {
                    //for(var x=0;x<data.length;x++){
                    sourcemap_1.default.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                        var test = consumer.sources;
                        var l = consumer.originalPositionFor({
                            bias: sourcemap_1.default.SourceMapConsumer.GREATEST_LOWER_BOUND,
                            line: data[x].line,
                            column: data[x].column
                        });
                        return l;
                    }).then(function (whatever) {
                        resolve(whatever);
                    });
                });
                ret.push(one);
            }
            return await ret;
            //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js",function(data){
        }
    };
    TSSourceMap = __decorate([
        (0, Registry_1.$Class)("jassijs_editor.util.TSSourceMap")
    ], TSSourceMap);
    exports.TSSourceMap = TSSourceMap;
});
//# sourceMappingURL=TSSourceMap.js.map