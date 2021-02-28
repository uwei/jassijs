"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.window = {};
global.$ = {};
require("app-module-path").addPath("./js");
require("jassi/remote/Registry");
//import "reflect-metadata";
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
class JassiConnectionProperties {
}
/**
 * starts jassi server
 * @param properties
 * @param expressApp
 * @returns expressApp
 */
function JassiServer(properties = {}, expressApp = undefined) {
    let app = expressApp;
    if (app === undefined)
        app = express();
    if (properties.updeateRegistryOnStart !== false)
        new Indexer_1.Indexer().updateRegistry();
    if (properties.syncRemoteFiles !== false)
        Filessystem_1.syncRemoteFiles();
    app.use(Filessystem_1.staticfiles);
    app.use(RawBody_1.rawbody);
    // app.use(installGetRequest);
    app.use(passport.initialize());
    app.use(cookieParser());
    app.use("/user", PassportLoginRegister_1.loginRegister);
    app.use(PassportLoginRegister_1.manageToken);
    app.post('/remoteprotocol', passport.authenticate("jwt", { session: false }), DoRemoteProtocol_1.remoteProtocol);
    if (properties.allowDownloadAsZip !== false)
        app.get('/zip', passport.authenticate("jwt", { session: false }), Zip_1.zip);
    const PORT = (process.env.PORT || 5000);
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    return app;
}
exports.default = JassiServer;
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
//# sourceMappingURL=JassiServer.js.map