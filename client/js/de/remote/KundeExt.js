var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "jassijs/remote/Extensions"], function (require, exports, Jassi_1, DatabaseSchema_1, Extensions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Extensions_1.extensions.annotateMember("de.Kunde", "extField", String, DatabaseSchema_1.Column({ nullable: true }));
    //  de.Kunde.prototype.extFunc=function(){return 6;}
    let KundeExt = class KundeExt {
        get hello2() {
            return "pp";
        }
        //this is called on Kunde
        /**
        * sample Extension
        */
        initExtensions() {
        }
        extFunc() {
            return 3;
        }
        /**
         * is called after main class is loaded
         * example type.prototype.hallo=function(){}
         * @param {class} type - the type to extend
         */
        static extend(type) {
            //type.prototype.extFunc = function () { return 8; }
        }
    };
    KundeExt = __decorate([
        Extensions_1.$Extension("de.Kunde"),
        Jassi_1.$Class("de.KundeExt")
    ], KundeExt);
    //Hack for tabulator.js
    KundeExt.prototype.extFunc["match"] = function () { return false; };
});
//jassijs.register("extensions", "de.Kunde", KundeExt, "KundeExt");
//# sourceMappingURL=KundeExt.js.map