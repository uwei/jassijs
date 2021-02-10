/*requirejs.config({
    baseUrl: 'https://unpkg.com/source-map@0.7.3/dist/source-map',
    paths: {
        'mozilla.sourcemap':"https://unpkg.com/source-map@0.7.3/dist/source-map"
    }

});*/
//@ts-ignore
import sourceMap from "jassi/ext/sourcemap";


import jassi from "jassi/jassi";
import { $Class } from "remote/jassi/base/Jassi";
//var sourceMap=window["sourceMap"];
@$Class("jassi.util.TSSourceMap")
export class TSSourceMap {
    async getLineFromTS(tsfile: string, line, column) {
        var jscode = await $.ajax({ url: "js/" + tsfile.replace(".ts", ".js"), dataType: "text" });
        var mapcode = "";
        var pos = jscode.indexOf("//" + "# sourceMappingURL=");
        if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
            var b64 = jscode.substring(pos + 50);
            mapcode=ts["base64decode"](undefined,b64);
            //mapcode = decodeURIComponent(escape((b64)));
        } else {
            mapcode = await $.ajax({ url: "js/" + tsfile.replace(".ts", ".js.map"), dataType: "text" });
        }
        var ret = new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
            var isinline = false;
            sourceMap.SourceMapConsumer.initialize({
                "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
            });
            var rawSourceMap = JSON.parse(mapcode);
            sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                var test = consumer.sources;
                var l = consumer.generatedPositionFor({
                    source: rawSourceMap.sources[0],
                    line: line,
                    column: column
                })
                return l;
            }).then(function (whatever) {
                resolve(whatever.line);
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
        } else {
            mapcode = await $.ajax({ url: jsfile.replace(".js", ".js.map"), dataType: "text" });
        }

        var ret = new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
            sourceMap.SourceMapConsumer.initialize({
                "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
            });
            var rawSourceMap = JSON.parse(mapcode);
            sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                var test = consumer.sources;
                var l = consumer.originalPositionFor({
                    bias: sourceMap.SourceMapConsumer.GREATEST_LOWER_BOUND,
                    line: line,
                    column: column
                })
                return l;
            }).then(function (whatever) {
                resolve(whatever.line);
            });
        });

        return ret;
        //  jassi.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js",function(data){
    }
}

