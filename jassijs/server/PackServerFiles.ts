

const fs = require('fs');
const path = require('path');
const textExt = ["js", "ts", "cfg", "xml", "json", "txt", "css", "map", "md", "npmignore", "nycrc", "css", "scss", "yml"]
//import {  myfs as fs   } from './NativeAdapter';

export function startCodeServer() {
    const http = require('http');

    const hostname = '127.0.0.1';  // localhost
    const port = 4000;

    const server = http.createServer((req, res) => {
        // Setze HTTP-Header
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Cache-Control');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Content-Type', 'text/plain');
        if (req.url.startsWith("/getcodechanges")) {
            var dat = new Date(req.url.split("?")[1]);
            var ret = packServerFiles(dat);

            res.end(JSON.stringify(ret));
        } else {
            res.statusCode = 404; // Not Found
            res.end(JSON.stringify({ error: 'use e.g. /getcodechanges?2025-07-20T13:55:50.064Z' }));
        }
        // Antwort-Text

    });

    server.listen(port, hostname, () => {
        //console.log(`Server läuft unter http://${hostname}:${port}/`);
    });
}

function packServerFiles(date) {
    var all = readJSFiles("./", date, [/*"./client",*/"./dist", "./jassichrome", "./build", "./private", "./.git","./node_modules/pg"]);

    return all;

    /*{
         var all = await readJSFiles("./node_modules", true);
         var code = JSON.stringify(all)
         var file = "./client/jassijs/server/servermodules.json";
 
         fs.writeFileSync(file, code);
     }*/
    //console.log("serverfiles packed");
    //return;
}


function readJSFiles(dir: string, date, ignoreDirs: string[] = undefined) {
    const result = {};

    function readDirRecursive(currentDir) {

        if (ignoreDirs && ignoreDirs.indexOf(currentDir.toLowerCase()) > -1)
            return;
        if (currentDir.toLowerCase() === "./node_modules") {
            const stats = fs.statSync("./package.json");
            if (stats.mtime < date) {
                return;
            }
        }
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.name === "servercode.json" || entry.name === "servermodules.json")
                continue;
            if (entry.isDirectory()) {
                readDirRecursive((currentDir + "/" + entry.name).replace("//", "/").replaceAll("\\", "/"));
            } else if (entry.isFile()) {

                let coding = 'base64';
                if (textExt.some(suffix => fullPath.toLowerCase().endsWith(suffix)))
                    coding = "utf8";

                const content = fs.readFileSync(fullPath, coding);
                const stats = fs.statSync(fullPath);
                if (stats.mtime < date) {
                    continue;
                }
                const relativePath = path.relative(dir, fullPath);
                var mpath = ((currentDir + "/" + entry.name).substring(dir.length)).replaceAll("\\", "/");

                result[mpath] = {
                    content,
                    coding:(coding==="utf8"?undefined:coding),
                    mtime: stats.mtime
                };
            }
        }
    }

    readDirRecursive(dir);
    return result;
}