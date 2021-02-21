"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AR_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.AR = void 0;
const ARZeile_1 = require("de/remote/ARZeile");
const Kunde_1 = require("de/remote/Kunde");
const DBObject_1 = require("jassi/remote/DBObject");
const Jassi_1 = require("jassi/remote/Jassi");
const DatabaseSchema_1 = require("jassi/util/DatabaseSchema");
const Rights_1 = require("jassi/remote/security/Rights");
/**
* Ausgangsrechnung
* @class de.AR
*/
let AR = AR_1 = class AR extends DBObject_1.DBObject {
    constructor() {
        super();
        this.ort = "";
        this.id = 0;
        this.strasse = "";
        this.nummer = 0;
    }
    static async myfind(options = undefined) {
        if (!Jassi_1.default.isServer) {
            return await this.call(this.myfind, options);
        }
        else {
            //@ts-ignore
            var Brackets = (await Promise.resolve().then(() => require("typeorm"))).Brackets;
            //@ts-ignore
            var man = await (await Promise.resolve().then(() => require("jassi/server/DBManager"))).DBManager.get();
            var man2 = man;
            var ret = await man.connection().manager.createQueryBuilder().
                select("me").from(AR_1, "me").
                leftJoinAndSelect("me.kunde", ",me.kunde").
                where("me.kunde=:id", { id: 5 }).getMany();
            var ret2 = await man.connection().manager.createQueryBuilder().
                select("me").from(ARZeile_1.ARZeile, "me").
                leftJoin("me.ar", "me_ar").
                leftJoin("me_ar.kunde", "me_ar_kunde").
                where("me_ar_kunde.id>:id", { id: 0 }).
                andWhere(new Brackets(qp => {
                qp.where("me_ar.id>=:p1 and me_ar.id<=:p2", { p1: 1, p2: 90 }).
                    orWhere("me_ar.id>=:p3 and me_ar.id<=:p4", { p3: 500, p4: 1000 });
            })).
                andWhere(new Brackets(qp => {
                qp.where("me_ar_kunde.id>=:von and me_ar_kunde.id<=:bis", { von: 1, bis: 90 }).
                    orWhere("me_ar_kunde.id>=:von and me_ar_kunde.id<=:bis", { von: 1, bis: 90 });
            })).
                getMany();
            return ret;
        }
    }
    async sample() {
        var all = AR_1.myfind();
        debugger;
        // $(document.body).html(ret);
        var ar = new AR_1();
        ar.strasse = "gemeindeberg";
        ar.nummer = 7;
        ar.id = 30;
        ar.save();
        /*        var ar2 = await jassi.db.load("de.AR", 30);
                var test = await ar2.kunden.resolve();
                var kd = await jassi.db.load("de.Kunde", 9);
                ar.kunde = kd;
                await jassi.db.save(ar);
                var arneu = await jassi.db.load("de.AR", 30);
                var test = await arneu.kunde.resolve();
                await jassi.db.save(ar);
        */
        //jassi.db.delete(kunde);
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], AR.prototype, "id", void 0);
__decorate([
    DatabaseSchema_1.Column(),
    __metadata("design:type", String)
], AR.prototype, "strasse", void 0);
__decorate([
    DatabaseSchema_1.Column(),
    __metadata("design:type", Number)
], AR.prototype, "nummer", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], AR.prototype, "ort", void 0);
__decorate([
    Rights_1.$CheckParentRight()
    //@JoinTable()
    ,
    DatabaseSchema_1.ManyToOne(type => Kunde_1.Kunde, kunde => kunde.rechnungen),
    __metadata("design:type", Kunde_1.Kunde)
], AR.prototype, "kunde", void 0);
__decorate([
    DatabaseSchema_1.OneToMany(type => ARZeile_1.ARZeile, zeile => zeile.ar),
    __metadata("design:type", Array)
], AR.prototype, "zeilen", void 0);
AR = AR_1 = __decorate([
    Rights_1.$Rights([{ name: "Auftragswesen/Ausgangsrechnung/festschreiben" },
        { name: "Auftragswesen/Ausgangsrechnung/löschen" }]),
    DBObject_1.$DBObject(),
    Jassi_1.$Class("de.AR"),
    __metadata("design:paramtypes", [])
], AR);
exports.AR = AR;
async function test() {
    //jassi.db.clearCache();
    //var ar = await jassi.db.load("de.AR", 30, "kunde");
    //ar.zeilen = await jassi.db.load("de.ARZeile");
    var ak = await AR.myfind();
    return;
    //var z: AR = (await AR.find({ id: 902 }))[0];
    // z.plz="09456";
    //console.log(JSON.stringify(z));
    // z.save();
    /*	var hh=ar.kunde;
        var test=await ar.kunde.resolve();
        var kkk=ar.kunde.rechnungen;
        var kkk=ar.kunde.rechnungen.resolve();
        */
}
exports.test = test;
//# sourceMappingURL=AR.js.map