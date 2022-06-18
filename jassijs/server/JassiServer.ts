//map remotepath
declare global {
    var window;
    var isServer;
    var $;
}
(global as any).window = {};
(global as any).$ = {};
require("app-module-path").addPath("./js");
import "jassijs/remote/Jassi";
import "jassijs/remote/Registry";
//import "reflect-metadata";
//important: registry must be loaded after "reflect-metadata" and before the typeorm (because delegation of Reflect.metadata)
import express = require('express');

import { staticfiles,staticsecurefiles, syncRemoteFiles } from "jassijs/server/Filesystem";
import { Indexer } from 'jassijs/server/Indexer';
import { loginRegister, manageToken } from "jassijs/server/PassportLoginRegister";
const passport = require("passport");
const cookieParser = require("cookie-parser");
const https = require("https");
import "jassijs/server/PassportSetup";
import { remoteProtocol } from "jassijs/server/DoRemoteProtocol";
import { zip } from "jassijs/server/Zip";
import { rawbody } from "jassijs/server/RawBody";
import { ServerIndexer } from "./RegistryIndexer";


class JassiConnectionProperties {
    //the port on which the http server is running by default 5000 or process.env.PORT if defined 
    port?: number;
    //updates registry.js in each module
    updeateRegistryOnStart?;
    //sync files in remote-Directory in beetween client and server
    syncRemoteFiles?: boolean;
    //allow Zip-Download of sources
    //allowDownloadAsZip?: boolean;
    //express.listen is called 
    listenToPort?: boolean;
}
/**
 * starts jassi server
 * @param properties 
 * @param expressApp 
 * @returns expressApp
 */
export default function JassiServer(properties: JassiConnectionProperties={}, expressApp = undefined) {
    let app = expressApp;
    if (app === undefined)
        app = express();
    if (properties.updeateRegistryOnStart!==false)
        new ServerIndexer().updateRegistry();
    if (properties.syncRemoteFiles!==false){
        syncRemoteFiles();
    }
    app.use(staticfiles);
    app.use(rawbody);
    app.set('etag', 'strong');  
   // app.use(installGetRequest);
    app.use(passport.initialize());
     
    app.use(cookieParser());
    app.use("/user", loginRegister);
    app.use(manageToken); 
    app.use(staticsecurefiles, passport.authenticate("jwt", { session: false }));
   
    app.post('/remoteprotocol', passport.authenticate("jwt", { session: false }), remoteProtocol);
   /* if (properties.allowDownloadAsZip!==false)
        app.get('/zip', passport.authenticate("jwt", { session: false }), zip);*/
    const PORT=(process.env.PORT || 5000)
    app.listen(PORT, () => console.log(`Listening on ${PORT} ->browse http://localhost:${PORT}/app.html`));
    return app;
}

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

