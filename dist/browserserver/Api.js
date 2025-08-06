"use strict";
var browserserverapihandler = {
    apis: {},
    addAPI(method, path, handler) {
        //@ts-ignore
        this.apis[method + " " + path] = handler;
    }
};
browserserverworker.handleAPI = async (request) => {
    //if(!(<any>event).request.url.startsWith(self.location.origin+"/api/"))
    //    throw new Error("invalid path");
    var path = request.url.substring((baseroot + "/api/").length);
    var query = undefined;
    if (path.split("?").length > 1) {
        query = path.split("?")[1];
        path = path.split("?")[0];
    }
    var key = (request.method + " " + path).toLowerCase();
    try {
        //@ts-ignore
        var hand = browserserverapihandler.apis[key];
        if (hand === undefined) {
            throw new Error("API " + key + " not found ");
        }
        var data = undefined;
        if (request.method.toLowerCase() !== "get")
            data = await request.clone().json();
        let ret = await hand(data, query);
        let res = new Response(JSON.stringify(ret), {
            headers: { 'Content-Type': 'text/plain' }
        });
        return res;
    }
    catch (err) {
        new Response(err.message, {
            status: 500,
            statusText: 'Internal Server Error',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
};
browserserverapihandler.addAPI("post", "app", async (data) => {
    //@ts-ignore
    data.hasModified = true;
    await browserserverworker.writeIndexDB("browserserver", data.name, "config", data);
    return data;
});
browserserverapihandler.addAPI("get", "app", async (data, query) => {
    var ret = await browserserverworker.readIndexDB("browserserver", query, "config");
    return ret;
});
browserserverapihandler.addAPI("get", "apps", async (data, query) => {
    var ret = [];
    let keys = await browserserverworker.keysIndexDB("browserserver");
    for (let x = 0; x < keys.length; x++) {
        let key = keys[x];
        if (key.endsWith("-config")) {
            let app = key.substring(0, key.length - ("config").length);
            try {
                let vapp = ret = await browserserverworker.readIndexDB("browserserver", app, "config");
                ret.push(vapp);
            }
            catch {
            }
        }
    }
    return ret;
});
//# sourceMappingURL=Api.js.map