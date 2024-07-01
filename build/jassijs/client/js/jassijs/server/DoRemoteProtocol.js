define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/Serverservice", "jassijs/remote/Config"], function (require, exports, Registry_1, Classes_1, Serverservice_1, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._execute = exports.remoteProtocol = void 0;
    function remoteProtocol(request, response) {
        execute(request, response);
    }
    exports.remoteProtocol = remoteProtocol;
    async function checkSimulateUser(context, request) {
        var rights = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/security/Rights"], resolve_1, reject_1); })).default;
        var test = request.cookies["simulateUser"];
        if (request.cookies["simulateUser"] !== undefined && request.cookies["simulateUserPassword"] !== undefined && context.request.user.isAdmin) {
            var db = await Serverservice_1.serverservices.db;
            var user = await db.login(context, context.request.cookies["simulateUser"], context.request.cookies["simulateUserPassword"]);
            if (!user) {
                console.log("simulateUser not found");
                return;
            }
            request.user.user = user.id;
            request.user.isAdmin = (user.isAdmin === null ? false : user.isAdmin);
            if (!user)
                throw new Classes_1.JassiError("simulateUser not logged in");
        }
    }
    async function execute(request, res) {
        var RemoteProtocol = (await new Promise((resolve_2, reject_2) => { require(["jassijs/remote/RemoteProtocol"], resolve_2, reject_2); })).RemoteProtocol;
        var context = {
            isServer: true,
            request: request
        };
        var val = await _execute(request.rawBody, request, context);
        var s = new RemoteProtocol().stringify(val);
        if (s === undefined)
            s = "$$undefined$$";
        res.send(s);
    }
    async function _execute(protext, request, context) {
        // await new Promise((resolve)=>{docls(request,response,resolve)});
        var h = Config_1.config;
        var RemoteProtocol = (await new Promise((resolve_3, reject_3) => { require(["jassijs/remote/RemoteProtocol"], resolve_3, reject_3); })).RemoteProtocol;
        var prot = new RemoteProtocol();
        var vdata = await prot.parse(protext);
        Object.assign(prot, vdata);
        var files = Registry_1.default.getAllFilesForService("$Class", prot.classname);
        if (files === undefined || files.length === 0) {
            throw new Classes_1.JassiError("file for " + prot.classname + " not found");
        }
        var file = files[0];
        var path = file.split("/");
        if (path.length < 2 || path[1] !== "remote")
            throw new Classes_1.JassiError("only remote packages can be loadeded");
        file = file.replace(".ts", "");
        //var ret = await import(file);
        var C = await Classes_1.classes.loadClass(prot.classname);
        ///await Promise.resolve().then(() => require.main.require(file));
        //var C = classes.getClass(prot.classname);
        if (prot._this === "static") {
            try {
                await checkSimulateUser(context, request);
                if (prot.parameter === undefined)
                    ret = await (C[prot.method](context));
                else
                    ret = await (C[prot.method](...prot.parameter, context));
            }
            catch (ex) {
                console.error(ex.stack);
                var msg = ex.message;
                if (!msg)
                    msg = ex;
                if (!ex)
                    ex = "";
                ret = {
                    "**throw error**": msg
                };
            }
            return ret;
        }
        else {
            var obj = new C();
            if (prot._this !== undefined)
                Object.assign(obj, prot._this);
            var ret = undefined;
            try {
                await checkSimulateUser(context, request);
                if (prot.parameter === undefined)
                    ret = await (obj[prot.method](context));
                else
                    ret = await (obj[prot.method](...prot.parameter, context));
            }
            catch (ex) {
                if (!(ex instanceof Classes_1.JassiError)) {
                    console.error(ex.stack);
                }
                var msg = ex.message;
                if (!msg)
                    msg = ex;
                if (!ex)
                    ex = "";
                ret = {
                    "**throw error**": msg
                };
            }
            return ret;
        }
    }
    exports._execute = _execute;
});
//# sourceMappingURL=DoRemoteProtocol.js.map