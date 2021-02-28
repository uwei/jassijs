define(["require", "exports", "jassi_localserver/DBManager"], function (require, exports, DBManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocalDBManager = void 0;
    class LocalDBManager extends DBManager_1.DBManager {
        static async getConOpts() {
            var dbclasses = [];
            var dbobjects = await registry.getJSONData("$DBObject");
            for (var o = 0; o < dbobjects.length; o++) {
                var clname = dbobjects[o].classname;
                dbclasses.push(await classes.loadClass(clname));
                //var fname = dbobjects[o].filename;
                //dbfiles.push("js/" + fname.replace(".ts", ".js"));
            }
            var opt = {
                type: "sqljs",
                "entities": dbclasses
                //"js/client/remote/de/**/*.js"
                // "migrations": [
                //    "src/migration/**/*.ts"
                // ],
                // "subscribers": [
                //    "src/subscriber/**/*.ts"
                // ]
            };
            return opt;
        }
    }
    exports.LocalDBManager = LocalDBManager;
});
//# sourceMappingURL=LocalDBManager.js.map