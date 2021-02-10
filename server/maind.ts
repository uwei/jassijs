import "reflect-metadata";
require("app-module-path").addPath("./js/client");
require("app-module-path").addPath("./js/server");

import { createConnection, ConnectionOptions } from "typeorm";
import registry from "remote/jassi/base/Registry";
import express = require('express');

function getConOpts(): ConnectionOptions {
  var stype: string = "postgres";
  var shost = "localhost"; 
  var suser = "postgres";
  var spass = "ja$$1";
  var iport = 5432;
  var sdb = "jassi";
  //the default is the sqlite3
  //this is the default way: define an environment var DATABASSE_URL
  //type://user:password@hostname:port/database
  //eg: postgres://abcknhlveqwqow:polc78b98e8cd7168d35a66e392d2de6a8d5710e854c084ff47f90643lce2876@ec2-174-102-251-1.compute-1.amazonaws.com:5432/dcpqmp4rcmu182
  var test = process.env.DATABASE_URL;
  if (test !== undefined) {

    var all = test.split(":");
    stype = all[0];
    var h = all[2].split("@");
    shost = h[1];
    iport = Number(all[3].split("/")[0]);
    suser = all[1].replace("//", "");
    spass = h[0];
    sdb = all[3].split("/")[1];
  }
  var dbobjects = registry.getJSONData("$DBObject");
  var dbfiles = [];
  for (var o = 0; o < dbobjects.length; o++) {
    var fname = dbobjects[o].filename;

    dbfiles.push("js/client/" + fname.replace(".ts", ".js"));
  }
  var opt: ConnectionOptions = {

    //@ts-ignore
    "type": stype,
    "host": shost,
    "port": iport,
    "username": suser,
    "password": spass,
    "database": sdb,
    "synchronize": true,
  //  logger:"advanced-console",
//    maxQueryExecutionTime:

    "logging": false,
    "entities": dbfiles, 
    //"js/client/remote/de/**/*.js"

    // "migrations": [
    //    "src/migration/**/*.ts"
    // ],
    // "subscribers": [
    //    "src/subscriber/**/*.ts"
    // ]
  };
  return opt;
}
declare global {
    var window;
    var isServer;
    var $;
  }
  (global as any).window = {};
  const PORT = process.env.PORT || 5000
  
async function run(){
  console.log("start");
  var con=await createConnection(getConOpts());
  
    console.log("done");
}
run();
let app = express();
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
