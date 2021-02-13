"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteProtocol = void 0;
const Registry_1 = require("jassi/remote/Registry");
const Classes_1 = require("jassi/remote/Classes");
const getRequest_1 = require("./getRequest");
function remoteProtocol(request, response) {
    execute(request, response);
}
exports.remoteProtocol = remoteProtocol;
async function checkSimulateUser(request) {
    var rights = (await Promise.resolve().then(() => require("jassi/remote/security/Rights"))).default;
    var test = request.cookies["simulateUser"];
    if (request.cookies["simulateUser"] !== undefined && request.cookies["simulateUserPassword"] !== undefined && await rights.isAdmin() === true) {
        var db = await (await Promise.resolve().then(() => require("jassi/server/DBManager"))).DBManager.get();
        var user = await db.getUser(request.cookies["simulateUser"], request.cookies["simulateUserPassword"]);
        if (!user) {
            console.log("simulateUser not found");
            return;
        }
        request.user.user = user.id;
        request.user.isAdmin = (user.isAdmin === null ? false : user.isAdmin);
        if (!user)
            throw new Error("simulateUser not logged in");
        var kk = getRequest_1.getRequest().user;
    }
}
async function execute(request, response) {
    // await new Promise((resolve)=>{docls(request,response,resolve)});
    var RemoteProtocol = (await Promise.resolve().then(() => require("jassi/remote/RemoteProtocol"))).RemoteProtocol;
    var prot = new RemoteProtocol();
    var vdata = await prot.parse(request.rawBody);
    Object.assign(prot, vdata);
    var files = Registry_1.default.getAllFilesForService("$Class", prot.classname);
    if (files === undefined || files.length === 0) {
        response.send("file for " + prot.classname + " not found");
        return;
    }
    var file = files[0];
    var path = file.split("/");
    if (path.length < 2 || path[1] !== "remote")
        throw "only remote packages can be loadeded";
    file = file.replace(".ts", "");
    Promise.resolve().then(() => require(file)).then(async function (ret) {
        var C = Classes_1.classes.getClass(prot.classname);
        if (prot._this === "static") {
            try {
                await checkSimulateUser(request);
                if (prot.parameter === undefined)
                    ret = await (C[prot.method]());
                else
                    ret = await (C[prot.method](...prot.parameter));
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
            var s = new RemoteProtocol().stringify(ret);
            if (s === undefined)
                s = "$$undefined$$";
            response.send(s);
        }
        else {
            var obj = new C();
            if (prot._this !== undefined)
                Object.assign(obj, prot._this);
            var ret = undefined;
            try {
                await checkSimulateUser(request);
                if (prot.parameter === undefined)
                    ret = await (obj[prot.method]());
                else
                    ret = await (obj[prot.method](...prot.parameter));
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
            var s = new RemoteProtocol().stringify(ret);
            response.send(s);
        }
    });
}
//# sourceMappingURL=DoRemoteProtocol.js.map