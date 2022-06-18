/*requirejs.config({
    baseUrl: 'https://unpkg.com/source-map@0.7.3/dist/source-map',
    paths: {
        'mozilla.sourcemap':"https://unpkg.com/source-map@0.7.3/dist/source-map"
    }

});*/
//@ts-ignore
import sourceMap from "jassijs/ext/sourcemap";

import { Server } from "jassijs/remote/Server";
import { $Class } from "jassijs/remote/Registry";
//var sourceMap=window["sourceMap"];
@$Class("jassijs_editor.util.TSSourceMap")
export class TSSourceMap {
    async getCode(file: string) {
        return $.ajax({ url: file, dataType: "text" });
        // await new Server().loadFile(file);
    }
    async getLineFromTS(tsfile: string, line, column): Promise<{ line: number, column: number, jsfilename: string }> {
        var jscode;
        var mapcode = "";
        var filenumber = 0;
        var jsfilename;
        if (Server.filesInMap && Server.filesInMap[tsfile]) {
            var mod = Server.filesInMap[tsfile].modul;
            jsfilename = jassijs.modules[mod];
            var mapname = jsfilename.split("").reverse().join("").replace("sj.", "pam.sj.").split("").reverse().join("").split("?")[0];
           
            mapcode = await this.getCode(mapname);//await $.ajax({ url: jsfilename+".map", dataType: "text" });
            filenumber = Server.filesInMap[tsfile].id;
        } else {
            //replace last .ts to .js
            jsfilename = "js/" + tsfile.split("").reverse().join("").replace("st.", "sj.").split("").reverse().join("").split("?")[0];
            jscode = await this.getCode(jsfilename);// await $.ajax({ url: jsfilename, dataType: "text" });

            var pos = jscode.indexOf("//" + "# sourceMappingURL=");
            if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                var b64 = jscode.substring(pos + 50);
                mapcode = ts["base64decode"](undefined, b64);
                //mapcode = decodeURIComponent(escape((b64)));
            } else {
                //mapcode = await $.ajax({ url: "js/" + tsfile.replace(".ts", ".js.map"), dataType: "text" });
                //replace last .js to .js.map
                var mapfile = tsfile.split("").reverse().join("").replace("st.", "pam.sj.").split("").reverse().join("").split("?")[0];
                mapcode = await this.getCode("js/" + mapfile);
            }
        }
        var ret: Promise<{ line: number, column: number, jsfilename: string }> = new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
            var isinline = false;
            sourceMap.SourceMapConsumer.initialize({
                "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
            });
            var rawSourceMap = JSON.parse(mapcode);
            sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                var test = consumer.sources;
                var l = consumer.generatedPositionFor({
                    source: rawSourceMap.sources[filenumber],
                    line: line,
                    column: column
                })
                l.jsfilename = jsfilename;
                return l;
            }).then(function (whatever) {
                resolve(whatever);
            });
        });
        return ret;
    }
    async getLineFromJS(jsfile:string, line:number, column:number): Promise<{ source: string, line: number, column: number }> {
        var data=await this.getLinesFromJS(jsfile,[{line,column}]);
        return ((data===undefined||data.length===0)?undefined:data[0]);
    }
    async getLinesFromJS(jsfile, data:{line:number, column:number}[]): Promise<{ source: string, line: number, column: number }[]> {
        var jscode = await this.getCode(jsfile.split("?")[0])// await $.ajax({ url: jsfile, dataType: "text" });
        var mapcode = "";
        var pos = jscode.indexOf("//" + "# sourceMappingURL=");
        if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
            var b64 = jscode.substring(pos + 50);
            mapcode = atob(b64);
        } else if (pos) {
            //TODO parse the correct map
            var mapfile = jsfile.split("").reverse().join("").replace("sj.", "pam.sj.").split("").reverse().join("").split("?")[0];
            mapcode = await new Server().loadFile(mapfile);
        } else
            return undefined;
        sourceMap.SourceMapConsumer.initialize({
                "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
            });
        var rawSourceMap = JSON.parse(mapcode);
        var ret=[];
        for(var x=0;x<data.length;x++){
            var one: any = await new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
            
                //for(var x=0;x<data.length;x++){
                sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                    var test = consumer.sources;
                    var l = consumer.originalPositionFor({
                        bias: sourceMap.SourceMapConsumer.GREATEST_LOWER_BOUND,
                        line: data[x].line,
                        column: data[x].column
                    })
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
}

