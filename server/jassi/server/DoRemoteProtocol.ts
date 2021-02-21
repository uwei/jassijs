import registry from "jassi/remote/Registry";
import { classes } from "jassi/remote/Classes";
import { getRequest } from "./getRequest";

import { Database } from "jassi/remote/Database";
import { ECANCELED } from "constants";

export function remoteProtocol(request, response) {

    execute(request, response);
}
async function checkSimulateUser(request) {

    var rights = (await import("jassi/remote/security/Rights")).default;
    var test = request.cookies["simulateUser"];
    if (request.cookies["simulateUser"] !== undefined && request.cookies["simulateUserPassword"] !== undefined && await rights.isAdmin() === true) {
        var db = await (await import("jassi/server/DBManager")).DBManager.get();
        
            var user = await db.getUser(request.cookies["simulateUser"], request.cookies["simulateUserPassword"]);
            if (!user){
                console.log("simulateUser not found");
                return;
            }
                
            request.user.user = user.id;
            request.user.isAdmin = (user.isAdmin===null?false:user.isAdmin);
            if (!user)
                throw new Error("simulateUser not logged in");

       
        var kk = getRequest().user;

    }


}
async function execute(request, res) {
    _execute(request.rawBody,request,undefined).then((val)=>{
        res.send(val);
    });
    
}
export async function _execute(protext:string,request,runAfterCreation):Promise<string> {
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
    var path=file.split("/");
    if (path.length<2||path[1]!=="remote")
        throw "only remote packages can be loadeded";
    file = file.replace(".ts", "");
    var ret=await import(file);

        var C = classes.getClass(prot.classname);
        if (prot._this === "static") {
            try {
                await checkSimulateUser(request);
                if (prot.parameter === undefined)
                    ret = await (C[prot.method]());
                else
                    ret = await (C[prot.method](...prot.parameter));
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
            var s = new RemoteProtocol().stringify(ret);
            if (s === undefined)
                s = "$$undefined$$";
            return s;
        } else {
            var obj = new C();
            if(runAfterCreation){
                obj=runAfterCreation(obj);
            }
            if (prot._this !== undefined)
                Object.assign(obj, prot._this);
            var ret = undefined;
            try {
                await checkSimulateUser(request);
                if (prot.parameter === undefined)
                    ret = await (obj[prot.method]());
                else
                    ret = await (obj[prot.method](...prot.parameter));
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
            var s = new RemoteProtocol().stringify(ret);
           return s;
        }

}
