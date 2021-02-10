var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "remote/jassi/base/DBObject", "remote/jassi/base/Jassi", "jassi/util/DatabaseSchema", "remote/jassi/security/Rights", "remote/de/AR"], function (require, exports, DBObject_1, Jassi_1, DatabaseSchema_1, Rights_1, AR_1) {
    "use strict";
    var ARZeile_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ARZeile = void 0;
    let ARZeile = ARZeile_1 = class ARZeile extends DBObject_1.DBObject {
        constructor() {
            super();
        }
        static async find(options = undefined) {
            if (!Jassi_1.default.isServer) {
                return await this.call("find", options);
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_1, reject_1) => { require(["jassi/server/DBManager"], resolve_1, reject_1); })).DBManager.get();
                return man.find(this, options);
            }
        }
        get oo2() {
            var o = 12;
            var a = 9;
            var t = 1;
            return "gpp";
        }
        test() {
            var h = 9;
            var kk = 3;
            var b = 3;
            return this.tt + "pko01" + this.oo2;
        }
        async sample() {
            var ret;
            var az = await Jassi_1.default.db.load("de.ARZeile", 120);
            var h = await az.ar.resolve();
            var ar2 = await Jassi_1.default.db.load("de.AR", 30);
            var az3 = new ARZeile_1();
            var h = await ar2.zeilen.resolve();
            ar2.zeilen.add(az3);
            ar2.zeilen.remove(az3);
            // $(document.body).html(ret);
            /*var z1=new de.ARZeile();
            z1.id=110;
            z1.text="lkjlk";
            jassi.db.save(z1);
            var z2=new de.ARZeile();
            z2.id=120;
            z2.text="lddkjlk";
            jassi.db.save(z2);
            var ar=jassi.db.load("de.AR",30);
            ar.zeilen=new jassi.base.DBArray(z1,z2);
            jassi.db.save(ar);
            var arz=jassi.db.load("de.ARZeile",1);
            var test=ar.zeilen;*/
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], ARZeile.prototype, "text", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "position", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "preis", void 0);
    __decorate([
        Rights_1.$CheckParentRight(),
        DatabaseSchema_1.ManyToOne(type => AR_1.AR, ar => ar.zeilen),
        __metadata("design:type", AR_1.AR)
    ], ARZeile.prototype, "ar", void 0);
    ARZeile = ARZeile_1 = __decorate([
        DBObject_1.$DBObject(),
        Jassi_1.$Class("de.ARZeile"),
        __metadata("design:paramtypes", [])
    ], ARZeile);
    exports.ARZeile = ARZeile;
    Jassi_1.default.test = async function () {
        //	var k=new Kunde();
        //k=k;
        var test = await Jassi_1.default.db.load("de.ARZeile");
        var z = new ARZeile();
        z.id = 150;
        z.text = "jjj";
        //   jassi.db.save(z);
        return undefined;
    };
});
//# sourceMappingURL=ARZeile.js.map