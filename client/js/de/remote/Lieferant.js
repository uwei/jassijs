var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/DBObject", "jassi/util/DatabaseSchema"], function (require, exports, Jassi_1, DBObject_1, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Lieferant = void 0;
    //import { Entity, PrimaryColumn, Column,OneToOne,ManyToMany,ManyToOne,OneToMany } from "typeorm";
    let Lieferant = class Lieferant extends DBObject_1.DBObject {
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Lieferant.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: false }),
        __metadata("design:type", String)
    ], Lieferant.prototype, "name", void 0);
    Lieferant = __decorate([
        Jassi_1.$Class("de.Lieferant"),
        DBObject_1.$DBObject()
    ], Lieferant);
    exports.Lieferant = Lieferant;
});
/*export async function test(){
    var l=new Lieferant();
    l.id=900;
    l.name="kkkkkk";
    l.save();
    //var z:Lieferant=(await Lieferant.find({id:900}))[0];
   // z.plz="09456";
//    console.log(JSON.stringify(z));
}*/ 
//# sourceMappingURL=Lieferant.js.map