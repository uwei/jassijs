define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendDBManager = void 0;
    function extendDBManager(manager) {
        define("jassijs/server/DBManager", ["jassijs_localserver/DBManager", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs_localserver/DBManager", "jassijs_localserver/TypeORMListener", "typeorm", "jassijs/remote/Database"], function (db, Classes_1, Registry_1, dbman, TypeORMListener, to, Database) {
            //create Admin User if doesn't a user exists 
            manager["hasLoaded"] = async function () {
                var User = await Classes_1.classes.loadClass("jassijs.security.User");
                var us = User.findOne();
                if (us) {
                    us = new User();
                    us.email = "admin";
                    us.password = "jassi";
                    us.isAdmin = true;
                    await us.save();
                }
            };
            manager["login"] = async function (context, user, password) {
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
            manager.__protot__["getConOpts"] = async function () {
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
                db.DBManager.clearMetadata();
                Database.db.fillDecorators();
                var tcl = await Classes_1.classes.loadClass("jassijs_localserver.TypeORMListener");
                to.EventSubscriber()(tcl);
                var Filesystem = await Classes_1.classes.loadClass("jassijs_localserver.Filesystem");
                var data = await new Filesystem().loadFile("__default.db");
                var opt = {
                    database: data,
                    type: "sqljs",
                    subscribers: [TypeORMListener.TypeORMListener],
                    "entities": dbclasses
                };
                return opt;
            };
            return db;
        });
    }
    exports.extendDBManager = extendDBManager;
});
//# sourceMappingURL=ExtendDBManager.js.map