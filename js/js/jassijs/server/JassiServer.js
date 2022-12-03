"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.window = {};
global.$ = {};
require("app-module-path").addPath("./js");
require("jassijs/remote/Jassi");
require("jassijs/remote/Registry");
//import "reflect-metadata";
//important: registry must be loaded after "reflect-metadata" and before the typeorm (because delegation of Reflect.metadata)
const express = require("express");
const Filesystem_1 = require("jassijs/server/Filesystem");
const PassportLoginRegister_1 = require("jassijs/server/PassportLoginRegister");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const https = require("https");
require("jassijs/server/PassportSetup");
const DoRemoteProtocol_1 = require("jassijs/server/DoRemoteProtocol");
const RawBody_1 = require("jassijs/server/RawBody");
const RegistryIndexer_1 = require("./RegistryIndexer");
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
        new RegistryIndexer_1.ServerIndexer().updateRegistry();
    if (properties.syncRemoteFiles !== false) {
        try {
            (0, Filesystem_1.syncRemoteFiles)();
        }
        catch (_a) {
            console.log("could not sync remotefiles");
        }
    }
    app.use(Filesystem_1.staticfiles);
    app.use(RawBody_1.rawbody);
    app.set('etag', 'strong');
    // app.use(installGetRequest);
    app.use(passport.initialize());
    app.use(cookieParser());
    app.use("/user", PassportLoginRegister_1.loginRegister);
    app.use(PassportLoginRegister_1.manageToken);
    app.use(Filesystem_1.staticsecurefiles, passport.authenticate("jwt", { session: false }));
    app.post('/remoteprotocol', passport.authenticate("jwt", { session: false }), DoRemoteProtocol_1.remoteProtocol);
    /* if (properties.allowDownloadAsZip!==false)
         app.get('/zip', passport.authenticate("jwt", { session: false }), zip);*/
    const PORT = (process.env.PORT || 5000);
    app.listen(PORT, () => console.log(`Listening on ${PORT} ->browse http://localhost:${PORT}/app.html`));
    return app;
}
exports.default = JassiServer;
//# sourceMappingURL=JassiServer.js.map