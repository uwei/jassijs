var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "de/remote/AR", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "jassijs/remote/DBObjectQuery", "jassijs/remote/security/Rights"], function (require, exports, DBObject_1, AR_1, Jassi_1, DatabaseSchema_1, DBObjectQuery_1, Rights_1) {
    "use strict";
    var Kunde_1, _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Kunde = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Kunde = Kunde_1 = class Kunde extends DBObject_1.DBObject {
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
        initExtensions() {
            //this function would be extended
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
                        // $.notify("bewerte..." + kunden[x].vorname, "info", { position: "right" });
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
                //@ts-ignore
                var man = await (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/DBManager"], resolve_1, reject_1); })).DBManager.get();
                return man.find(context, this, options);
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
            //  $(document.body).html(h);
            //jassijs.db.delete(kunde);
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Kunde.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Kunde.prototype, "vorname", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Kunde.prototype, "nachname", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Kunde.prototype, "strasse", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Kunde.prototype, "PLZ", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Kunde.prototype, "ort", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", Number)
    ], Kunde.prototype, "hausnummer", void 0);
    __decorate([
        DatabaseSchema_1.OneToMany(type => AR_1.AR, ar => ar.kunde),
        __metadata("design:type", Array)
    ], Kunde.prototype, "rechnungen", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Kunde.prototype, "land", void 0);
    __decorate([
        DBObjectQuery_1.$DBObjectQuery({ name: "Alle nach Namen", description: "Kundenliste nach Namen" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
    ], Kunde, "alleKundenNachNachname", null);
    __decorate([
        DBObjectQuery_1.$DBObjectQuery({ name: "Alle nach Nummer", description: "Kundenliste nach Nummer" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
    ], Kunde, "alleKundenNachNummer", null);
    Kunde = Kunde_1 = __decorate([
        Rights_1.$ParentRights([{ name: "Kundennummern", sqlToCheck: "me.id>=:i1 and me.id<=:i2",
                description: {
                    text: "Kundennummern",
                    i1: "von",
                    i2: "bis"
                } }]),
        DBObject_1.$DBObject(),
        Jassi_1.$Class("de.Kunde"),
        __metadata("design:paramtypes", [])
    ], Kunde);
    exports.Kunde = Kunde;
    async function test() {
        let test = new Kunde();
        var g = test.extFunc2();
        var h = test.extFunc();
        //await Kunde.sample();
        var k = await Kunde.findOne({ id: 1 });
        k.vorname = "Ella";
        k.land = "Deutschland";
        k.nachname = "Klotz";
        k.ort = "Mainz";
        k.PLZ = "99992";
        k.save();
        //	new de.Kunde().generate();
        //jassijs.db.uploadType(de.Kunde);
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS3VuZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9kZS9yZW1vdGUvS3VuZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFRQSxtREFBbUQ7SUFTbkQsSUFBYSxLQUFLLGFBQWxCLE1BQWEsS0FBTSxTQUFRLG1CQUFRO1FBb0IvQjtZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBWkQsY0FBYztZQUNWLGlDQUFpQztRQUNyQyxDQUFDO1FBV0Q7Ozs7VUFJRTtRQUNGLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNkLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLFVBQVUsTUFBTTtvQkFDNUYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3BDLDZFQUE2RTt3QkFDN0UsMENBQTBDO3FCQUM3QztnQkFDTCxDQUFDO2FBQ0osQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsc0JBQXNCO1lBQy9CLE9BQU8sTUFBTSxPQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxF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LEdBQUMsYUFBYSxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNULDZCQUE2QjtRQUM3QixrQ0FBa0M7SUFDdEMsQ0FBQztJQWZELG9CQWVDO0lBQ0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERCT2JqZWN0LCAkREJPYmplY3QgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvREJPYmplY3RcIjtcclxuaW1wb3J0IHsgQVIgfSBmcm9tIFwiZGUvcmVtb3RlL0FSXCI7XHJcbmltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5pbXBvcnQgeyBFbnRpdHksIFByaW1hcnlDb2x1bW4sIENvbHVtbiwgT25lVG9PbmUsIE1hbnlUb01hbnksIE1hbnlUb09uZSwgT25lVG9NYW55IH0gZnJvbSBcImphc3NpanMvdXRpbC9EYXRhYmFzZVNjaGVtYVwiO1xyXG5pbXBvcnQgeyBFeHRlbnNpb25Qcm92aWRlciB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9FeHRlbnNpb25zXCI7XHJcbmltcG9ydCB7ICREQk9iamVjdFF1ZXJ5IH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0RCT2JqZWN0UXVlcnlcIjtcclxuaW1wb3J0IHsgJFBhcmVudFJpZ2h0cyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9zZWN1cml0eS9SaWdodHNcIjtcclxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZW1vdGVPYmplY3RcIjtcclxuLy9pbXBvcnQgXCJqYXNzaWpzL2V4dC9lbmFibGVFeHRlbnNpb24uanM/ZGUuS3VuZGVcIjtcclxuQCRQYXJlbnRSaWdodHMoW3sgbmFtZTogXCJLdW5kZW5udW1tZXJuXCIsIHNxbFRvQ2hlY2s6IFwibWUuaWQ+PTppMSBhbmQgbWUuaWQ8PTppMlwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiS3VuZGVubnVtbWVyblwiLFxyXG4gICAgICAgICAgICBpMTogXCJ2b25cIixcclxuICAgICAgICAgICAgaTI6IFwiYmlzXCJcclxuICAgICAgICB9IH1dKVxyXG5AJERCT2JqZWN0KClcclxuQCRDbGFzcyhcImRlLkt1bmRlXCIpIFxyXG5leHBvcnQgY2xhc3MgS3VuZGUgZXh0ZW5kcyBEQk9iamVjdCBpbXBsZW1lbnRzIEV4dGVuc2lvblByb3ZpZGVyIHtcclxuICAgIEBQcmltYXJ5Q29sdW1uKClcclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBAQ29sdW1uKClcclxuICAgIHZvcm5hbWU6IHN0cmluZztcclxuICAgIEBDb2x1bW4oKVxyXG4gICAgbmFjaG5hbWU6IHN0cmluZzsgXHJcbiAgICBAQ29sdW1uKClcclxuICAgIHN0cmFzc2U6IHN0cmluZztcclxuICAgIEBDb2x1bW4oKVxyXG4gICAgUExaOiBzdHJpbmc7XHJcbiAgICBAQ29sdW1uKHsgbnVsbGFibGU6IHRydWUgfSlcclxuICAgIG9ydDogc3RyaW5nO1xyXG4gICAgQENvbHVtbigpXHJcbiAgICBoYXVzbnVtbWVyOiBudW1iZXI7XHJcbiAgICBAT25lVG9NYW55KHR5cGUgPT4gQVIsIGFyID0+IGFyLmt1bmRlKVxyXG4gICAgcmVjaG51bmdlbjogQVJbXTtcclxuICAgIGluaXRFeHRlbnNpb25zKCkge1xyXG4gICAgICAgIC8vdGhpcyBmdW5jdGlvbiB3b3VsZCBiZSBleHRlbmRlZFxyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmlkID0gMDtcclxuICAgICAgICB0aGlzLnZvcm5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMubmFjaG5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuc3RyYXNzZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5QTFogPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuaGF1c251bW1lciA9IDA7XHJcbiAgICAgICAgdGhpcy5pbml0RXh0ZW5zaW9ucygpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIGFkZCBoZXJlIGFsbCBwcm9wZXJ0aWVzIGZvciB0aGUgUHJvcGVydHlFZGl0b3JcclxuICAgICogQHBhcmFtIHtbamFzc2lqcy51aS5Db21wb25lbnREZXNjcmlwdG9yXX0gZGVzYyAtIGRlc2NyaWJlIGZpZWxkcyBmb3IgcHJvcGVydHllZGl0b3JcclxuICAgICogZS5nLiAgZGVzYy5maWVsZHMucHVzaChuZXcgamFzc2lqcy51aS5Qcm9wZXJ0eShcImlkXCIsXCJudW1iZXJcIikpO1xyXG4gICAgKi9cclxuICAgIHN0YXRpYyBkZXNjcmliZUNvbXBvbmVudChkZXNjKSB7XHJcbiAgICAgICAgZGVzYy5hY3Rpb25zLnB1c2goe1xyXG4gICAgICAgICAgICBuYW1lOiBcIkJld2VydHVuZ1wiLCBkZXNjcmlwdGlvbjogXCJCZXdlcnRlIGRlbiBLdW5kZW5cIiwgaWNvbjogXCJtZGkgbWRpLWNhclwiLCBydW46IGZ1bmN0aW9uIChrdW5kZW4pIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwga3VuZGVuLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gJC5ub3RpZnkoXCJiZXdlcnRlLi4uXCIgKyBrdW5kZW5beF0udm9ybmFtZSwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwicmlnaHRcIiB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL1x0YWxlcnQoXCJiZXdlcnRlbi4uLlwiK2t1bmRlblt4XS52b3JuYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgQCREQk9iamVjdFF1ZXJ5KHsgbmFtZTogXCJBbGxlIG5hY2ggTmFtZW5cIiwgZGVzY3JpcHRpb246IFwiS3VuZGVubGlzdGUgbmFjaCBOYW1lblwiIH0pXHJcbiAgICBzdGF0aWMgYXN5bmMgYWxsZUt1bmRlbk5hY2hOYWNobmFtZSgpOiBQcm9taXNlPGFueVtdPiB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IEt1bmRlLmZpbmQoeyBvcmRlcjogXCJuYWNobmFtZVwiIH0pO1xyXG4gICAgfVxyXG4gICAgQCREQk9iamVjdFF1ZXJ5KHsgbmFtZTogXCJBbGxlIG5hY2ggTnVtbWVyXCIsIGRlc2NyaXB0aW9uOiBcIkt1bmRlbmxpc3RlIG5hY2ggTnVtbWVyXCIgfSlcclxuICAgIHN0YXRpYyBhc3luYyBhbGxlS3VuZGVuTmFjaE51bW1lcigpOiBQcm9taXNlPGFueVtdPiB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IEt1bmRlLmZpbmQoeyBvcmRlcjogXCJpZFwiIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGZpbmQob3B0aW9ucyA9IHVuZGVmaW5lZCxjb250ZXh0OkNvbnRleHQ9dW5kZWZpbmVkKTogUHJvbWlzZTxhbnlbXT4ge1xyXG4gICAgICAgIGlmICghY29udGV4dD8uaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbCh0aGlzLmZpbmQsIG9wdGlvbnMsY29udGV4dCk7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBtYW4gPSBhd2FpdCAoYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9zZXJ2ZXIvREJNYW5hZ2VyXCIpKS5EQk1hbmFnZXIuZ2V0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYW4uZmluZChjb250ZXh0LHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBzYW1wbGUoKSB7XHJcbiAgICAgICAgdmFyIGt1bmRlMSA9IG5ldyBLdW5kZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oa3VuZGUxLCB7IGlkOiAxLCB2b3JuYW1lOiBcIk1heFwiLCBuYWNobmFtZTogXCJNZWllclwiLCBzdHJhc3NlOiBcIkRvcmZzdHLDn2VcIiwgaGF1c251bW1lcjogMTAwIH0pO1xyXG4gICAgICAgIHZhciBrdW5kZTIgPSBuZXcgS3VuZGUoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGt1bmRlMiwgeyBpZDogMiwgdm9ybmFtZTogXCJNYXJpb1wiLCBuYWNobmFtZTogXCJNZWllclwiLCBzdHJhc3NlOiBcIkRvcmZzdHJhw59lXCIsIGhhdXNudW1tZXI6IDg3IH0pO1xyXG4gICAgICAgIHZhciBrdW5kZTMgPSBuZXcgS3VuZGUoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGt1bmRlMywgeyBpZDogMywgdm9ybmFtZTogXCJBbG1hXCIsIG5hY2huYW1lOiBcIkFsc2VyXCIsIHN0cmFzc2U6IFwiSGF1cHRzdHJhw59lXCIsIGhhdXNudW1tZXI6IDcgfSk7XHJcbiAgICAgICAgdmFyIGt1bmRlNCA9IG5ldyBLdW5kZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oa3VuZGU0LCB7IGlkOiA0LCB2b3JuYW1lOiBcIkVsa2VcIiwgbmFjaG5hbWU6IFwiS3JhdXR6XCIsIHN0cmFzc2U6IFwiR2Vod2VnXCIsIGhhdXNudW1tZXI6IDUgfSk7XHJcbiAgICAgICAgYXdhaXQga3VuZGUxLnNhdmUoKTtcclxuICAgICAgICBhd2FpdCBrdW5kZTIuc2F2ZSgpO1xyXG4gICAgICAgIGF3YWl0IGt1bmRlMy5zYXZlKCk7XHJcbiAgICAgICAgYXdhaXQga3VuZGU0LnNhdmUoKTtcclxuICAgICAgICAvLyAgJChkb2N1bWVudC5ib2R5KS5odG1sKGgpO1xyXG4gICAgICAgIC8vamFzc2lqcy5kYi5kZWxldGUoa3VuZGUpO1xyXG4gICAgfVxyXG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXHJcbiAgICBsYW5kOiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICBsZXQgdGVzdD1uZXcgS3VuZGUoKTtcclxuICAgIHZhciBnPXRlc3QuZXh0RnVuYzIoKTsgICBcclxuICAgIHZhciBoPXRlc3QuZXh0RnVuYygpO1xyXG4gICAgXHJcbiAgICAvL2F3YWl0IEt1bmRlLnNhbXBsZSgpO1xyXG4gICAgdmFyIGsgPSA8S3VuZGU+YXdhaXQgS3VuZGUuZmluZE9uZSh7IGlkOiAxIH0pO1xyXG4gICAgay52b3JuYW1lID0gXCJFbGxhXCI7XHJcbiAgICBrLmxhbmQ9XCJEZXV0c2NobGFuZFwiO1xyXG4gICAgay5uYWNobmFtZSA9IFwiS2xvdHpcIjtcclxuICAgIGsub3J0ID0gXCJNYWluelwiO1xyXG4gICAgay5QTFogPSBcIjk5OTkyXCI7XHJcbiAgICBrLnNhdmUoKTtcclxuICAgIC8vXHRuZXcgZGUuS3VuZGUoKS5nZW5lcmF0ZSgpO1xyXG4gICAgLy9qYXNzaWpzLmRiLnVwbG9hZFR5cGUoZGUuS3VuZGUpO1xyXG59XHJcbjtcclxuIl19