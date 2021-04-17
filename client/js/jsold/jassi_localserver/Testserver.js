var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "de/remote/Kunde", "jassi/remote/Jassi", "typeorm", "de/remote/AR", "de/remote/ARZeile", "jassi/server/DBManager"], function (require, exports, Kunde_1, Jassi_1, typeorm_1, AR_1, ARZeile_1, DBManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    //@$ActionProvider("jassi.base.ActionNode")
    let Testserver = class Testserver {
        static async run() {
            var man = await DBManager_1.DBManager.get();
            var kd = new Kunde_1.Kunde();
            kd.id = 9;
            await man.save(kd);
            var all = await man.find(Kunde_1.Kunde);
            debugger;
        }
        // @$Action({ name: "Test/Testserver" })
        static async rundirect() {
            const initSqlJs = window["SQL"];
            // or if you are in a browser:
            // var initSqlJs = window.initSqlJs;
            const SQL = await window["SQL"]({
                // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
                // You can omit locateFile completely when running in node
                locateFile: file => `https://sql.js.org/dist/${file}`
            });
            var con = await typeorm_1.createConnection({
                type: "sqljs",
                entities: [
                    Kunde_1.Kunde,
                    AR_1.AR,
                    ARZeile_1.ARZeile
                ],
                synchronize: true
            });
            var kd = new Kunde_1.Kunde();
            kd.id = 500;
            kd.nachname = "Weigelt";
            var ent = await con.manager.save(kd);
            var all = await con.manager.find(Kunde_1.Kunde);
            alert(JSON.stringify(all[0]));
            /*var us=new Testuser();
            us.id=1;
            us.firstname="f";
            us.lastname="l";
            var ent=await con.manager.save(us);
            var all=await con.manager.find(Testuser);
            alert(JSON.stringify(all[0]));*/
        }
    };
    Testserver = __decorate([
        Jassi_1.$Class("jassi_localserver.Testserver")
    ], Testserver);
    async function test() {
        Testserver.run();
    }
    exports.test = test;
});
//# sourceMappingURL=Testserver.js.map
//# sourceMappingURL=Testserver.js.map