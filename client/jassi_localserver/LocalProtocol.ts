import jassi from "jassi/remote/Jassi";
import { Context } from "jassi/remote/RemoteObject";
import { RemoteProtocol } from "jassi/remote/RemoteProtocol";

RemoteProtocol.prototype.exec = async function (config, ob) {
    var clname = JSON.parse(config.data).classname;
    var local = ["jassi.remote.Transaction", "northwind.Employees", "northwind.Customer"];
    var classes = (await import("jassi/remote/Classes")).classes;
    var DBObject = await classes.loadClass("jassi.remote.DBObject");
    var ret;
    //
    if (clname === "jassi.remote.Server") {
        var tst = JSON.parse(config.data);
        if (tst.method === "dir") {
            var retserver = JSON.parse(await $.ajax(config));
            var sret = await localExec(JSON.parse(config.data));
            for(let i=0;i<retserver.files.length;i++){
                if(retserver.files[i].name==="local"){
                    retserver.files.splice(i,1);
                }
            }
            for(let i=0;i<sret.files.length;i++){
                if(sret.files[i].name==="local")
                    retserver.files.push(sret.files[i]);
            }
            return JSON.stringify(retserver);
        }else if(tst.method==="saveFiles"){
            if(tst.parameter[0][0].startsWith("local/")||tst.parameter[0][0].startsWith("js/local/")){
                var sret = await localExec(JSON.parse(config.data));
                ret = new RemoteProtocol().stringify(sret);
                if (ret === undefined)
                    ret = "$$undefined$$";
                return ret;
            }
        } else if(tst.parameter.length>0&&tst.parameter[0].startsWith("local/")) {
            var sret = await localExec(JSON.parse(config.data));
            ret = new RemoteProtocol().stringify(sret);
            if (ret === undefined)
                ret = "$$undefined$$";
            return ret;
        }

    }
    if (local.indexOf(clname) > -1) {
        var sret = await localExec(JSON.parse(config.data));
        ret = new RemoteProtocol().stringify(sret);
        if (ret === undefined)
            ret = "$$undefined$$";
    } else
        ret = await $.ajax(config);
    return ret;
}
export async function localExec(prot: RemoteProtocol, context: Context = undefined) {
    var classes = (await import("jassi/remote/Classes")).classes;
    var p = new RemoteProtocol();

    var C = await classes.loadClass(prot.classname);
    if (context === undefined) {
        context = {
            isServer: true,
            request: {
                user: {
                    isAdmin: true,
                    user: 1
                }
            }
        };
    }

    if (prot._this === "static") {
        try {
            //await checkSimulateUser(request);
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
        //var s = new RemoteProtocol().stringify(ret);

        return ret;
    } else {
        var obj = new C();
        //if(runAfterCreation){
        //    obj=runAfterCreation(obj);
        //}
        if (prot._this !== undefined)
            Object.assign(obj, prot._this);
        var ret = undefined;
        try {
            //await checkSimulateUser(request);
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
        //var s = new RemoteProtocol().stringify(ret);
        return ret;
    }
}
