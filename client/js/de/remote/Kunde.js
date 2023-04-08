var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "de/remote/AR", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/DBObjectQuery", "jassijs/remote/security/Rights", "jassijs/remote/Validator", "jassijs/remote/Serverservice"], function (require, exports, DBObject_1, AR_1, Registry_1, DatabaseSchema_1, DBObjectQuery_1, Rights_1, Validator_1, Serverservice_1) {
    "use strict";
    var Kunde_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Kunde = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Kunde = Kunde_1 = class Kunde extends DBObject_1.DBObject {
        initExtensions() {
            //this function would be extended
        }
        constructor() {
            super();
            this.id = 0;
            this.vorname = "";
            this.nachname = "";
            this.strasse = "";
            this.PLZ = "";
            this.hausnummer = 0;
            this.initExtensions();
        }
        /**
        * add here all properties for the PropertyEditor
        * @param {[jassijs.ui.ComponentDescriptor]} desc - describe fields for propertyeditor
        * e.g.  desc.fields.push(new jassijs.ui.Property("id","number"));
        */
        static describeComponent(desc) {
            desc.actions.push({
                name: "Bewertung", description: "Bewerte den Kunden", icon: "mdi mdi-car", run: function (kunden) {
                    for (var x = 0; x < kunden.length; x++) {
                        // notify("bewerte..." + kunden[x].vorname, "info", { position: "right" });
                        //	alert("bewerten..."+kunden[x].vorname);
                    }
                }
            });
        }
        static async alleKundenNachNachname() {
            return await Kunde_1.find({ order: "nachname" });
        }
        static async alleKundenNachNummer() {
            return await Kunde_1.find({ order: "id" });
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.find, options, context);
            }
            else {
                return await (await Serverservice_1.serverservices.db).find(context, this, options);
            }
        }
        static async sample() {
            var kunde1 = new Kunde_1();
            Object.assign(kunde1, { id: 1, vorname: "Max", nachname: "Meier", strasse: "Dorfstrße", hausnummer: 100 });
            var kunde2 = new Kunde_1();
            Object.assign(kunde2, { id: 2, vorname: "Mario", nachname: "Meier", strasse: "Dorfstraße", hausnummer: 87 });
            var kunde3 = new Kunde_1();
            Object.assign(kunde3, { id: 3, vorname: "Alma", nachname: "Alser", strasse: "Hauptstraße", hausnummer: 7 });
            var kunde4 = new Kunde_1();
            Object.assign(kunde4, { id: 4, vorname: "Elke", nachname: "Krautz", strasse: "Gehweg", hausnummer: 5 });
            await kunde1.save();
            await kunde2.save();
            await kunde3.save();
            await kunde4.save();
            //jassijs.db.delete(kunde);
        }
    };
    __decorate([
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Kunde.prototype, "id", void 0);
    __decorate([
        (0, Validator_1.ValidateIsInt)(),
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Kunde.prototype, "vorname", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Kunde.prototype, "nachname", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Kunde.prototype, "strasse", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Kunde.prototype, "PLZ", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Kunde.prototype, "ort", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", Number)
    ], Kunde.prototype, "hausnummer", void 0);
    __decorate([
        (0, DatabaseSchema_1.OneToMany)(type => AR_1.AR, ar => ar.kunde),
        __metadata("design:type", Array)
    ], Kunde.prototype, "rechnungen", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Kunde.prototype, "land", void 0);
    __decorate([
        (0, DBObjectQuery_1.$DBObjectQuery)({ name: "Alle nach Namen", description: "Kundenliste nach Namen" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Kunde, "alleKundenNachNachname", null);
    __decorate([
        (0, DBObjectQuery_1.$DBObjectQuery)({ name: "Alle nach Nummer", description: "Kundenliste nach Nummer" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Kunde, "alleKundenNachNummer", null);
    Kunde = Kunde_1 = __decorate([
        (0, Rights_1.$ParentRights)([{ name: "Kundennummern", sqlToCheck: "me.id>=:i1 and me.id<=:i2",
                description: {
                    text: "Kundennummern",
                    i1: "von",
                    i2: "bis"
                } }]),
        (0, DBObject_1.$DBObject)(),
        (0, Registry_1.$Class)("de.Kunde"),
        __metadata("design:paramtypes", [])
    ], Kunde);
    exports.Kunde = Kunde;
    async function test() {
        //var g=test.extFunc2();   
        //var h=test.extFunc();
        //await Kunde.sample();
        var k = await Kunde.findOne({ id: 1 });
        if (k === undefined)
            k = new Kunde();
        k.id = 1;
        k.vorname = "Ella";
        k.land = "Deutschland";
        k.nachname = "Klotz";
        k.ort = "Mainz";
        k.PLZ = "99992";
        var tt = await k.validate(k);
        debugger;
        k.save();
        //	new de.Kunde().generate();
        //jassijs.db.uploadType(de.Kunde);
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=Kunde.js.map