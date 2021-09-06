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
Object.defineProperty(exports, "__esModule", { value: true });
const Extensions_1 = require("jassijs/remote/Extensions");
const Jassi_1 = require("jassijs/remote/Jassi");
let KundeExt2 = class KundeExt2 {
    /**
    * sample Extension
    */
    constructor() {
    }
    extFunc2() { return 8; }
    /**
     * is called after main class is loaded
     * example type.prototype.hallo=function(){}
     * @param {class} type - the type to extend
     */
    static extend(type) {
        type.prototype.extFunc2 = function () { return 8; };
    }
};
KundeExt2 = __decorate([
    (0, Extensions_1.$Extension)("de.Kunde"),
    (0, Jassi_1.$Class)("de.KundeExt2"),
    __metadata("design:paramtypes", [])
], KundeExt2);
//jassijs.register("extensions", "de.Kunde", KundeExt2, "KundeExt2");
//# sourceMappingURL=KundeExt2.js.map