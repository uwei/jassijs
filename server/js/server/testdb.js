"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDBManager = void 0;
const MyUser_1 = require("remote/de/MyUser");
const DBManager_1 = require("jassi/server/DBManager");
const Kunde_1 = require("remote/de/Kunde");
async function startDBManager() {
    var man = await DBManager_1.DBManager.get();
    man.connection();
    var ourr = await (await DBManager_1.DBManager.get()).findOne(Kunde_1.Kunde);
    /*var k=new Kunde();
    k.id=6;
    k.vorname="Hilde";
   k.nachname="Heier";
   k.ort="Mainz";
   k.PLZ="99992";
   var h2=await (await DBManager.get()).connection().manager.insert(Kunde,k);
    */
    var u = new MyUser_1.MyUser();
    u.firstName = "Udo";
    u.lastName = "kkop";
    u.id = 509;
    u.age = 9;
    var h = (await DBManager_1.DBManager.get()).connection().getMetadata(MyUser_1.MyUser);
    //  var c=await con.connect();
    // var kop=await(await DBManager.get()).save(u);
    var ou = await (await DBManager_1.DBManager.get()).findOne(MyUser_1.MyUser, 500);
    return u.firstName;
}
exports.startDBManager = startDBManager;
//# sourceMappingURL=testdb.js.map