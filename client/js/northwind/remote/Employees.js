var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema", "jassi/remote/Transaction"], function (require, exports, DBObject_1, Jassi_1, DatabaseSchema_1, Transaction_1) {
    "use strict";
    var Employees_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Employees = void 0;
    let Employees = Employees_1 = class Employees extends DBObject_1.DBObject {
        constructor() {
            super();
        }
        /* static async find(options = undefined,context:Context=undefined): Promise<any[]> {
             if (!context?.isServer) {
                 return await this.call(this.find, options,context);
             }
             else {
                 //@ts-ignore
                 var man = await (await import("jassi/server/DBManager")).DBManager.get();
                 return man.find(context,this, options);
             }
         }*/
        async hallo(num) {
            if (!Jassi_1.default.isServer) {
                var ret = await this.call(this, this.hallo, num);
                return ret * 10;
            }
            else {
                return num + 1;
                // return ["jassi/base/ChromeDebugger.ts"];
            }
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Employees.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "LastName", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "FirstName", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Title", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "TitleOfCourtesy", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Address", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "City", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Region", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PostalCode", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Country", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "HomePhone", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Extension", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Photo", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Notes", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PhotoPath", void 0);
    __decorate([
        DatabaseSchema_1.JoinColumn(),
        DatabaseSchema_1.ManyToOne(type => Employees_1),
        __metadata("design:type", Employees)
    ], Employees.prototype, "ReportsTo", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "BirthDate", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "HireDate", void 0);
    Employees = Employees_1 = __decorate([
        DBObject_1.$DBObject(),
        Jassi_1.$Class("northwind.Employees"),
        __metadata("design:paramtypes", [])
    ], Employees);
    exports.Employees = Employees;
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    async function test() {
        var em = new Employees();
        em.id = getRandomInt(100000);
        var em2 = new Employees();
        em2.id = getRandomInt(100000);
        var trans = new Transaction_1.Transaction();
        console.log(em.id + " " + em2.id);
        trans.add(em, em.save);
        trans.add(em2, em2.save);
        var h = await trans.execute();
        h = h;
        /*  var emp = new Employees();
          emp.id = 100003;
          emp.BirthDate = new Date(Date.now());
          //await emp.save();
          var emp2 = new Employees();
          emp2.id = 200000;
          emp2.ReportsTo = emp;
          //await emp2.save();*/
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=Employees.js.map