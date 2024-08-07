var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Transaction", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, DBObject_1, Registry_1, DatabaseSchema_1, Transaction_1, Serverservice_1, Validator_1) {
    "use strict";
    var Employees_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.Employees = void 0;
    let Employees = Employees_1 = class Employees extends DBObject_1.DBObject {
        constructor() {
            super();
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if ((options === null || options === void 0 ? void 0 : options.relations) === undefined) {
                    if (options === undefined)
                        options = {};
                    options = { relations: ["ReportsTo"] };
                }
                var ret = await this.call(this.find, options, context);
                return ret;
            }
            else {
                //@ts-ignore
                var man = await (await Serverservice_1.serverservices.db);
                return man.find(context, this, options);
            }
        }
    };
    __decorate([
        (0, Validator_1.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Employees.prototype, "id", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "LastName", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "FirstName", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Title", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "TitleOfCourtesy", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Address", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "City", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Region", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PostalCode", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Country", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "HomePhone", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Extension", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Photo", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Notes", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PhotoPath", void 0);
    __decorate([
        (0, Validator_1.ValidateIsInstanceOf)({ type: type => Employees_1, optional: true }),
        (0, DatabaseSchema_1.JoinColumn)(),
        (0, DatabaseSchema_1.ManyToOne)(type => Employees_1),
        __metadata("design:type", Employees)
    ], Employees.prototype, "ReportsTo", void 0);
    __decorate([
        (0, Validator_1.ValidateIsDate)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "BirthDate", void 0);
    __decorate([
        (0, Validator_1.ValidateIsDate)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "HireDate", void 0);
    Employees = Employees_1 = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, Registry_1.$Class)("northwind.Employees"),
        __metadata("design:paramtypes", [])
    ], Employees);
    exports.Employees = Employees;
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    async function test() {
        var all = await Employees.find({ where: "id>:p", whereParams: { p: 5 } });
    }
    exports.test = test;
    async function test2() {
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
    exports.test2 = test2;
    ;
});
//# sourceMappingURL=Employees.js.map