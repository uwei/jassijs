define(["require", "exports", "remote/de/Kunde"], function (require, exports, Kunde_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function test() {
        var kd = new Kunde_1.Kunde();
        console.log(kd.extFunc());
    }
    exports.test = test;
});
//# sourceMappingURL=TestExtension.js.map