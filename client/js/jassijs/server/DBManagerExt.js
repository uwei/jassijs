var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Database", "jassijs/remote/Registry", "./DBManager", "./TypeORMListener", "typeorm", "./NativeAdapter"], function (require, exports, Classes_1, Database_1, Registry_1, DBManager_1, TypeORMListener_1, typeorm_1, NativeAdapter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendDBManager = void 0;
    Registry_1 = __importDefault(Registry_1);
    function extendDBManager() {
        //create Admin User if doesn't a user exists 
        DBManager_1.DBManager.prototype["hasLoaded"] = async function () {
            var User = await Classes_1.classes.loadClass("jassijs.security.User");
            //@ts-ignore
            var us = User.findOne();
            if (us) {
                us = new User();
                us.email = "admin";
                us.password = "jassi";
                us.isAdmin = true;
                await us.save();
            }
        };
        DBManager_1.DBManager.prototype["login"] = async function (context, user, password) {
            try {
                var User = await Classes_1.classes.loadClass("jassijs.security.User");
                var ret = await this.connection().manager.createQueryBuilder().
                    select("me").from(User, "me").addSelect("me.password").
                    andWhere("me.email=:email", { email: user });
                var auser = await ret.getOne();
                if (!auser || !password)
                    return undefined;
                if (auser.password === password) {
                    delete auser.password;
                    return auser;
                }
            }
            catch (err) {
                err = err;
            }
            return undefined;
        };
        //@ts-ignore
        DBManager_1.DBManager["getConOpts"] = async function () {
            var dbclasses = [];
            const initSqlJs = window["SQL"];
            const SQL = await window["SQL"]({
                // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
                // You can omit locateFile completely when running in node
                locateFile: file => `https://sql.js.org/dist/${file}`
            });
            var dbobjects = await Registry_1.default.getJSONData("$DBObject");
            var dbfiles = [];
            for (var o = 0; o < dbobjects.length; o++) {
                var clname = dbobjects[o].classname;
                try {
                    dbfiles.push(dbobjects[o].filename.replace(".ts", ""));
                    dbclasses.push(await Classes_1.classes.loadClass(clname));
                }
                catch (err) {
                    console.log(err);
                    throw err;
                }
            }
            //@ts-ignore
            DBManager_1.DBManager.clearMetadata();
            Database_1.db.fillDecorators();
            var tcl = await Classes_1.classes.loadClass("jassijs.server.TypeORMListener");
            //@ts-ignore 
            new typeorm_1.EventSubscriber()(tcl);
            var Filesystem = await Classes_1.classes.loadClass("jassijs.server.Filesystem");
            var data = undefined;
            if (await (0, NativeAdapter_1.exists)("./client/__default.db"))
                data = await NativeAdapter_1.myfs.readFile("./client/__default.db", "binary", false);
            var opt = {
                database: data,
                type: "sqljs",
                subscribers: [TypeORMListener_1.TypeORMListener],
                "entities": dbclasses
            };
            return opt;
        };
    }
    exports.extendDBManager = extendDBManager;
});
//# sourceMappingURL=DBManagerExt.js.map