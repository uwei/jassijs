var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/Classes", "./Serverservice"], function (require, exports, Registry_1, RemoteObject_1, Classes_1, Serverservice_1) {
    "use strict";
    var DatabaseTools_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DatabaseTools = void 0;
    let DatabaseTools = DatabaseTools_1 = class DatabaseTools extends RemoteObject_1.RemoteObject {
        //this is a sample remote function
        static async runSQL(sql, parameter = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.runSQL, sql, parameter, context);
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_1.JassiError("only admins can delete");
                return (await Serverservice_1.serverservices.db).runSQL(context, sql, parameter);
            }
        }
        static async dropTables(tables) {
            for (var i = 0; i < tables.length; i++) {
                if ((/[A-Z,a-z,_,0-9]+/g).exec(tables[i])[0] !== tables[i]) {
                    throw new Classes_1.JassiError(tables[i] + " is not a valid tablename");
                }
            }
            if (tables.length === 0) {
                throw new Classes_1.JassiError("no tables to drop");
            }
            return await DatabaseTools_1.runSQL("DROP TABLE " + tables.join(","));
        }
    };
    DatabaseTools = DatabaseTools_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.remote.DatabaseTools")
    ], DatabaseTools);
    exports.DatabaseTools = DatabaseTools;
    async function test() {
        /*  var h=await DatabaseTools.runSQL('DROP TABLE :p1,:p2',[
                              {p1:"te_person2",
                                          p2:"tg_person"}]);//,"te_person2"]);*/
        //var h=await DatabaseTools.runSQL('select * from $1'); 
    }
    exports.test = test;
});
//# sourceMappingURL=DatabaseTools.js.map