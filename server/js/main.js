"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.window = {};
global.$ = {};
const fs = require("fs");
var hj = fs.existsSync("./js");
//require("app-module-path").addPath("./js/client");
require("app-module-path").addPath("./js");
require("reflect-metadata");
//important: registry must be loaded after "reflect-metadata" and before the typeorm (because delegation of Reflect.metadata)
const express = require("express");
const Filessystem_1 = require("jassi/server/Filessystem");
const Indexer_1 = require("jassi/server/Indexer");
const PassportLoginRegister_1 = require("jassi/server/PassportLoginRegister");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const https = require("https");
require("jassi/server/PassportSetup");
const DoRemoteProtocol_1 = require("jassi/server/DoRemoteProtocol");
const Zip_1 = require("jassi/server/Zip");
const RawBody_1 = require("jassi/server/RawBody");
const getRequest_1 = require("jassi/server/getRequest");
const User_1 = require("jassi/remote/security/User");
const DBManager_1 = require("jassi/server/DBManager");
const PORT = process.env.PORT || 5000;
let app = express();
new Indexer_1.Indexer().updateRegistry();
Filessystem_1.syncRemoteFiles();
app.use(Filessystem_1.staticfiles);
app.use(RawBody_1.rawbody);
app.use(getRequest_1.manageRequest);
app.use(passport.initialize());
app.use(cookieParser());
app.use("/user", PassportLoginRegister_1.loginRegister);
app.use(PassportLoginRegister_1.manageToken);
app.post('/remoteprotocol', passport.authenticate("jwt", { session: false }), DoRemoteProtocol_1.remoteProtocol);
app.get('/zip', passport.authenticate("jwt", { session: false }), Zip_1.zip);
app.use("/test", function (req, res) {
    var b = getRequest_1.getRequest();
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
async function test2() {
    console.log("test2");
    var man = await DBManager_1.DBManager.get();
    console.log("test3");
    var user = await man.connection().manager.find(User_1.User);
    console.log(user[0].id);
}
//# sourceMappingURL=main.js.map