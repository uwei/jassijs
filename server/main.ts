
//map remotepath
declare global {
  var window;
  var isServer;
  var $;
}
(global as any).window = {};
(global as any).$ = {};

require("app-module-path").addPath("./js/client");
require("app-module-path").addPath("./js/server");

import "reflect-metadata";
//important: registry must be loaded after "reflect-metadata" and before the typeorm (because delegation of Reflect.metadata)
import express = require('express');
import fs = require('fs');
import { staticfiles } from "jassi/server/Filessystem";
import { Indexer } from 'jassi/server/Indexer';
import { loginRegister, manageToken } from "jassi/server/PassportLoginRegister";
const passport = require("passport");
const cookieParser = require("cookie-parser");
const https=require("https");
import "jassi/server/PassportSetup";
import { remoteProtocol } from "jassi/server/DoRemoteProtocol";
import { zip } from "jassi/server/Zip";
import { rawbody } from "jassi/server/RawBody";
import { manageRequest, getRequest } from "jassi/server/getRequest";
import rights from "remote/jassi/security/Rights";
import { User } from "remote/jassi/security/User";
import { DBManager } from "jassi/server/DBManager";

const PORT = process.env.PORT || 5000

let app = express();
new Indexer().updateRegistry();
app.use(staticfiles);
app.use(rawbody);
app.use(manageRequest);
app.use(passport.initialize());
app.use(cookieParser());
app.use("/user", loginRegister);
app.use(manageToken);
app.post('/remoteprotocol', passport.authenticate("jwt", { session: false }), remoteProtocol);
app.get('/zip', passport.authenticate("jwt", { session: false }), zip);
app.use("/test", function (req, res) {
  var b = getRequest();
});
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
/*
if(process.env.PORT){
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}else{
  var server=https.createServer({
    key:fs.readFileSync("mycert/uwei.selfhost.key"),
    cert:fs.readFileSync("mycert/uwei.selfhost.crt")
    //pfx:fs.readFileSync("mycert/mycert.pfx"),
    //passphrase:"j@ssi"
  },app);
  server.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`)
  })
}*/

//process.env.PORT


async function test2(){
  console.log("test2");
  var man=await DBManager.get();
  console.log("test3");
  var user=await man.connection().manager.find(User);
  console.log(user[0].id);
}