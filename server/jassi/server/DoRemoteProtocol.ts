import registry from "jassi/remote/Registry";
import { classes } from "jassi/remote/Classes";



import { Context } from "jassi/remote/RemoteObject";

export function remoteProtocol(request, response) {

    execute(request, response);
}
async function checkSimulateUser(context: Context, request) {

    var rights = (await import("jassi/remote/security/Rights")).default;
    var test = request.cookies["simulateUser"];
    if (request.cookies["simulateUser"] !== undefined && request.cookies["simulateUserPassword"] !== undefined && await rights.isAdmin() === true) {
        var db = await (await import("jassi/server/DBManager")).DBManager.get();

        var user = await db.getUser(context, context.request.cookies["simulateUser"], context.request.cookies["simulateUserPassword"]);
        if (!user) {
            console.log("simulateUser not found");
            return;
        }

        request.user.user = user.id;
        request.user.isAdmin = (user.isAdmin === null ? false : user.isAdmin);
        if (!user)
            throw new Error("simulateUser not logged in");



    }


}
async function execute(request, res) {
    var RemoteProtocol = (await import("jassi/remote/RemoteProtocol")).RemoteProtocol;

    var context: Context = {
        isServer: true,
        request: request
    }
    var val = await _execute(request.rawBody, request, context);
    var s = new RemoteProtocol().stringify(val);
    if (s === undefined)
        s = "$$undefined$$";

    res.send(s);

}
export async function _execute(protext: string, request, context: Context): Promise<string> {
    // await new Promise((resolve)=>{docls(request,response,resolve)});

    var RemoteProtocol = (await import("jassi/remote/RemoteProtocol")).RemoteProtocol;


    var prot = new RemoteProtocol();
    var vdata = await prot.parse(protext);
    Object.assign(prot, vdata);

    var files = registry.getAllFilesForService("$Class", prot.classname);

    if (files === undefined || files.length === 0) {
        return "file for " + prot.classname + " not found";
    }
    var file: string = files[0];
    var path = file.split("/");
    if (path.length < 2 || path[1] !== "remote")
        throw "only remote packages can be loadeded";
    file = file.replace(".ts", "");
    var ret = await import(file);

    var C = classes.getClass(prot.classname);
    if (prot._this === "static") {
        try {
            await checkSimulateUser(context, request);
            if (prot.parameter === undefined)
                ret = await (C[prot.method](context));
            else
                ret = await (C[prot.method](...prot.parameter, context));
        } catch (ex) {
            console.error(ex.stack);
            var msg = ex.message;
            if (!msg)
                msg = ex;
            if (!ex)
                ex = "";
            ret = {
                "**throw error**": msg
            }
        }

        return ret;
    } else {
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
        } catch (ex) {
            console.error(ex.stack);
            var msg = ex.message;
            if (!msg)
                msg = ex;
            if (!ex)
                ex = "";
            ret = {
                "**throw error**": msg
            }
        }

        return ret;
    }

}
