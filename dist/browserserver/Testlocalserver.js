"use strict";
var exports = typeof exports !== 'undefined' ? exports : {};
exports.test = async function () {
    await startServer();
};
async function testPDF() {
    try {
        //   debugger;
        var u = "l";
        var k = jrequire("./servertest/run", "", true);
        k.erstelleZip();
    }
    catch (err) {
        throw err;
    }
}
exports.testPDF = testPDF;
async function testpdfMake() {
    try {
        debugger;
        var DoServerreport = jrequire("./jassijs_report/server/DoServerreport").DoServerreport;
        var data = await new DoServerreport().getBase64("jassijs_report/server/TestServerreport", undefined);
        debugger;
    }
    catch (err) {
        debugger;
        throw err;
    }
}
exports.testpdfMake = testpdfMake;
async function testWebpack() {
    try {
        var startWebpack = jrequire("./servertest/startwebpack").startWebpack;
        var data = await startWebpack();
        if (globalThis.requestHandler === undefined)
            globalThis.requestHandler = {};
        //globalThis.requestHandler["http://localhost:3000/__webpack_hmr"]=async (event)=>{
        globalThis.requestHandler["http://localhost:5000/events"] = async (event) => {
            const { Readable } = jrequire('stream');
            // 1. Erstelle einen Node-kompatiblen Readable Stream
            const nodeStream = new Readable({
                read() { } // keine automatische Push-Logik
            });
            // 2. Schreibe initiale Daten
            nodeStream.push('data: Hallo\n\n');
            setTimeout(() => {
                nodeStream.push('data: Nach 1 Sekunde\n\n');
                //nodeStream.push(null); // optional: Stream beenden
            }, 1000);
            const str = new ReadableStream({
                start(controller) {
                    const reader = nodeStream[Symbol.asyncIterator]();
                    async function pump() {
                        for await (const chunk of reader) {
                            controller.enqueue(new TextEncoder().encode(chunk));
                        }
                    }
                    pump();
                }
            });
            /*var str=new ReadableStream({
                start(controller) {
                  controller.enqueue(new TextEncoder().encode('data: Hallo\n\n'));
                  // Kein close() aufrufen, damit die Verbindung offen bleibt
                }
              });
              */
            var res = new Response(str, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                }
            });
            event.respondWith(res);
        };
    }
    catch (err) {
        debugger;
        throw err;
    }
    setInterval(() => {
        const fs = jrequire("fs");
        var tm = new Date().toString();
        console.log("Update Code" + tm);
        fs.writeFileSync("./servertest/print.js", `import { aa } from "./print2";

        export default function printMe() { 
            console.log('Code has changed: ${tm} ! ');  
          }
        
          export function bb(){ 
            aa();   
}
`);
    }, 10000);
}
exports.testWebpack = testWebpack;
async function testExpress2() {
    const express = require('express');
    const path = require('path');
    const app = express();
    const PORT = 3000;
    var countges = 0;
    app.get('/events', (req, res) => {
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        res.write(`data: start`);
        let count = 0;
        const interval = setInterval(() => {
            res.write(`data: Nachricht- #${++count}/${++countges}\n\n`);
            if (count >= 5) {
                clearInterval(interval);
                res.write('event: end\ndata: 👋 Stream beendet\n\n');
                res.end();
            }
        }, 1000);
        // Verbindung geschlossen?
        req.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    });
    // Optional: eigene Route
    app.get('/index.html', (req, res) => {
        try {
            debugger;
            res.send('Hallo Welt von Express!');
        }
        catch (err) {
            debugger;
        }
    });
    app.listen(PORT, () => {
        console.log(`🚀 Server läuft unter http://localhost:${PORT} ` + new Date().toString());
    });
}
exports.testExpress2 = testExpress2;
async function testLocalServer() {
    await runLocalServerIfNeeded();
    try {
        var testExpress = jrequire("./servertest/run").testExpress;
        var data = await testExpress();
        var http = jrequire("http");
        var server = http.serverListening[5001];
        setTimeout(() => {
            var hh = server.requestListener({ url: "/index.html", method: "get" }, new http.ServerResponse(), () => 1);
        }, 3000);
    }
    catch (err) {
        debugger;
        throw err;
    }
}
exports.testLocalServer = testLocalServer;
async function testJSSQL() {
    try {
        var jssql = jrequire("./servertest/run").jssql;
        var data = await jssql();
    }
    catch (err) {
        debugger;
        throw err;
    }
}
exports.testJSSQL = testJSSQL;
async function testDB() {
    try {
        var testDB = jrequire("./servertest/run").testDB;
        var data = await testDB();
        debugger;
    }
    catch (err) {
        debugger;
        throw err;
    }
}
exports.testDB = testDB;
async function startServer() {
    try {
        var JassiServer = jrequire("./jassijs/server/JassiServer").default;
        await JassiServer();
    }
    catch (err) {
        debugger;
        throw err;
    }
}
exports.startServer = startServer;
//# sourceMappingURL=Testlocalserver.js.map