var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Rights", "de/remote/AR", "jassijs/remote/Serverservice"], function (require, exports, DBObject_1, Registry_1, DatabaseSchema_1, Rights_1, AR_1, Serverservice_1) {
    "use strict";
    var ARZeile_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ARZeile = void 0;
    let ARZeile = ARZeile_1 = class ARZeile extends DBObject_1.DBObject {
        constructor() {
            super();
        }
        static async find(options = undefined, context = undefined) {
            if (!jassijs.isServer) {
                return await this.call(this.find, options, context);
            }
            else {
                return (await Serverservice_1.serverservices.db).find(context, this, options);
            }
        }
        get oo2() {
            var o = 12;
            var a = 9;
            var t = 1;
            return "gpp";
        }
        async sample() {
            var ret;
            var az = await jassijs.db.load("de.ARZeile", 120);
            var h = await az.ar.resolve();
            var ar2 = await jassijs.db.load("de.AR", 30);
            var az3 = new ARZeile_1();
            var h = await ar2.zeilen.resolve();
            ar2.zeilen.add(az3);
            ar2.zeilen.remove(az3);
            /*var z1=new de.ARZeile();
            z1.id=110;
            z1.text="lkjlk";
            jassijs.db.save(z1);
            var z2=new de.ARZeile();
            z2.id=120;
            z2.text="lddkjlk";
            jassijs.db.save(z2);
            var ar=jassijs.db.load("de.AR",30);
            ar.zeilen=new jassijs.base.DBArray(z1,z2);
            jassijs.db.save(ar);
            var arz=jassijs.db.load("de.ARZeile",1);
            var test=ar.zeilen;*/
        }
    };
    __decorate([
        (0, DatabaseSchema_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], ARZeile.prototype, "text", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "position", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "preis", void 0);
    __decorate([
        (0, Rights_1.$CheckParentRight)(),
        (0, DatabaseSchema_1.ManyToOne)(type => AR_1.AR, ar => ar.zeilen),
        __metadata("design:type", AR_1.AR)
    ], ARZeile.prototype, "ar", void 0);
    ARZeile = ARZeile_1 = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, Registry_1.$Class)("de.ARZeile"),
        __metadata("design:paramtypes", [])
    ], ARZeile);
    exports.ARZeile = ARZeile;
    jassijs.test = async function () {
        //	var k=new Kunde();
        //k=k;
        var test = await jassijs.db.load("de.ARZeile");
        var z = new ARZeile();
        z.id = 150;
        z.text = "jjj";
        //   jassijs.db.save(z);
        return undefined;
    };
});
//# sourceMappingURL=ARZeile.js.map