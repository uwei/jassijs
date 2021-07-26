define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class OldC {
        constructor() { console.log("old"); }
    }
    class NewC {
        constructor() { console.log("new"); }
    }
    class A {
        constructor() {
            alert(8);
        }
    }
    function test() {
        NewC.prototype = OldC.prototype;
        NewC.prototype.constructor = NewC;
        OldC = NewC;
        new NewC();
    }
    exports.test = test;
});
//# sourceMappingURL=T.js.map