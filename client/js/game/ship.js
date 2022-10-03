define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ship = void 0;
    class Ship {
        create() {
            var ret = document.createRange().createContextualFragment("<span style='font-size:100px;'>&#9951;</span>").children[0]; //document.createElement("span");
            ret.style.fontSize = "100px";
            return ret;
        }
    }
    exports.Ship = Ship;
});
//<span style='font-size:100px;'>&#9951;</span>
//# sourceMappingURL=ship.js.map