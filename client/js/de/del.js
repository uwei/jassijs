define(["require", "exports", "de/remote/Kunde"], function (require, exports, Kunde_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    async function test() {
        let test = new Kunde_1.Kunde();
        Kunde_1.Kunde.prototype = Object.create(Kunde_1.Kunde.prototype, {
            setPosition: {
                value: function () {
                    //... etc
                },
                writable: true,
                enumerable: true,
                configurable: true
            }
        });
        for (var key in test) {
            console.log(key);
        }
    }
    exports.test = test;
});
//# sourceMappingURL=del.js.map