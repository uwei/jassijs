define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //  de.Kunde.prototype.extFunc=function(){return 6;}
    class KundeExt2 {
        /**
        * sample Extension
        */
        constructor() {
        }
        /**
         * is called after main class is loaded
         * example type.prototype.hallo=function(){}
         * @param {class} type - the type to extend
         */
        static extend(type) {
            type.prototype.extFunc2 = function () { return 8; };
        }
    }
});
//jassi.register("extensions", "de.Kunde", KundeExt2, "KundeExt2");
//# sourceMappingURL=KundeExt2.js.map