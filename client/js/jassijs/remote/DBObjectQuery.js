define(["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Classes_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectQuery = exports.$DBObjectQuery = exports.DBObjectQueryProperties = void 0;
    class DBObjectQueryProperties {
    }
    exports.DBObjectQueryProperties = DBObjectQueryProperties;
    function $DBObjectQuery(property) {
        return function (target, propertyKey, descriptor) {
            var test = Classes_1.classes.getClassName(target);
            Registry_1.default.registerMember("$DBObjectQuery", target, propertyKey, property);
        };
    }
    exports.$DBObjectQuery = $DBObjectQuery;
    class DBObjectQuery {
        async execute() {
            return undefined;
        }
        static async getQueries(classname) {
            var cl = await Classes_1.classes.loadClass(classname);
            var ret = [];
            var all = Registry_1.default.getMemberData("$DBObjectQuery");
            var queries = all[classname];
            for (var name in queries) {
                var qu = queries[name][0][0];
                var query = new DBObjectQuery();
                query.classname = classname;
                query.name = qu.name;
                query.description = qu.description;
                query.execute = async function () {
                    return await cl[name]();
                };
                ret.push(query);
            }
            return ret;
        }
    }
    exports.DBObjectQuery = DBObjectQuery;
    async function test() {
        //	var qu=(await DBObjectQuery.getQueries("de.Kunde"))[0];
        //	var j=await qu.execute();
    }
    exports.test = test;
});
//# sourceMappingURL=DBObjectQuery.js.map