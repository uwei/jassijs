define(["require", "exports", "jassijs/remote/RemoteProtocol", "jassijs/remote/Serverservice", "js-cookie", "jassijs/server/DoRemoteProtocol"], function (require, exports, RemoteProtocol_1, Serverservice_1, js_cookie_1, DoRemoteProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localExec = exports.test = exports.messageReceived = void 0;
    async function messageReceived(param) {
        var configm = param.data;
        var cookies = (0, js_cookie_1.getJSON)();
        var myRequest = {
            cookies,
            rawBody: JSON.stringify(configm.data),
            user: {
                isAdmin: true,
                user: 1
            }
        };
        await (0, DoRemoteProtocol_1.remoteProtocol)(myRequest, {
            send(msg) {
                navigator.serviceWorker.controller.postMessage({ type: 'RESPONSE_REMOTEPROTCOL', id: configm.id, data: msg });
            }
        });
        /*  var debugservermethods = [];//["saveFiles", "dir"];//["dir"];//for testing run on server
          if (debugservermethods.indexOf(data.method) > -1) {
              navigator.serviceWorker.controller.postMessage({ type: 'RESPONSE_REMOTEPROTCOL', id: config.id, data: "***POST_TO_SERVER***" });
              return;
          }
      
          
          var data = config.data;
          var clname = data.classname;
          var classes = (await import("jassijs/remote/Classes")).classes;
          var DBObject = await classes.loadClass("jassijs.remote.DBObject");
          var ret;
      
          {
              var sret = await localExec(data);
              ret = new RemoteProtocol().stringify(sret);
              if (ret === undefined)
                  ret = "$$undefined$$";
          }*/
    }
    exports.messageReceived = messageReceived;
    //var stest = '{"url":"remoteprotocol?1682187030801","type":"post","dataType":"text","data":"{\\"__clname__\\":\\"jassijs.remote.RemoteProtocol\\",\\"classname\\":\\"de.remote.MyRemoteObject\\",\\"_this\\":{\\"__clname__\\":\\"de.remote.MyRemoteObject\\",\\"__refid__\\":1},\\"parameter\\":[\\"Kurt\\"],\\"method\\":\\"sayHello\\",\\"__refid__\\":0}"}';
    //var config = JSON.parse(stest);
    async function test() {
        //var jj = await new Server().zip("");
        // var gg=await texec(config, undefined);
        // debugger;
    }
    exports.test = test;
    /*async function texec(config, object) {
        return await new Promise((resolve, reject) => {
            //@ts-ignore
            var xhr = new XMLHttpRequest();
            xhr.open('POST', config.url, true);
            xhr.setRequestHeader("Content-Type", "text");
    
            xhr.onload = function (data) {
                if (this.status === 200)
                    resolve(this.responseText);
                else
                    reject(this);
            };
    
            xhr.send(config.data);
            xhr.onerror = function (data) {
                reject(data);
            };
        }
        );
        //return await $.ajax(config, object);
    }
    RemoteProtocol.prototype.exec2 = async function (config, ob) {
        var clname = JSON.parse(config.data).classname;
        var classes = (await import("jassijs/remote/Classes")).classes;
        var DBObject = await classes.loadClass("jassijs.remote.DBObject");
        var ret;
    
        var data = JSON.parse(config.data);
        var debugservermethods = [];//["dir"];//for testing run on server
        if (debugservermethods.indexOf(data.method) > -1) {
            ret = await $.ajax(config);
        } else {
            var sret = await localExec(data);
            ret = new RemoteProtocol().stringify(sret);
            if (ret === undefined)
                ret = "$$undefined$$";
        }
      
        return ret;
    }*/
    async function localExec(prot, context = undefined) {
        var classes = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/Classes"], resolve_1, reject_1); })).classes;
        var p = new RemoteProtocol_1.RemoteProtocol();
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
            var Cookies = (await new Promise((resolve_2, reject_2) => { require(["jassijs/util/Cookies"], resolve_2, reject_2); })).Cookies;
            if (Cookies.get("simulateUser") && Cookies.get("simulateUserPassword")) {
                var man = await Serverservice_1.serverservices.db;
                var user = await man.login(context, Cookies.get("simulateUser"), Cookies.get("simulateUserPassword"));
                if (user === undefined) {
                    throw Error("simulated login failed");
                }
                else {
                    context.request.user.user = user.id;
                    context.request.user.isAdmin = user.isAdmin ? true : false;
                }
            }
        }
        if (prot._this === "static") {
            try {
                //await checkSimulateUser(request);
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
            //var s = new RemoteProtocol().stringify(ret);
            return ret;
        }
        else {
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
            //var s = new RemoteProtocol().stringify(ret);
            return ret;
        }
    }
    exports.localExec = localExec;
});
//# sourceMappingURL=LocalProtocol.js.map