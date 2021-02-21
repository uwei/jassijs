"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JassiServer_1 = require("./jassi/server/JassiServer");
const DBManager_1 = require("jassi/server/DBManager");
const Employees_1 = require("northwind/remote/Employees");
JassiServer_1.default();
async function test() {
    var man = await DBManager_1.DBManager.get();
    var all = [];
    var ent1 = new Employees_1.Employees();
    ent1.id = 508;
    all.push(ent1);
    var ent2 = new Employees_1.Employees();
    ent2.id = 509;
    ent1.ReportsTo = ent2;
    all.push(ent2);
    var em = (await man.connection()).createEntityManager();
    //em.insert(ent2.constructor,ent2);
}
test();
//# sourceMappingURL=main.js.map