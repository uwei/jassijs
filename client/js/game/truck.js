define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Truck = void 0;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    class Truck {
        create() {
            this.dom = document.createRange().createContextualFragment("<span style='font-size:12px;'>&#9951;</span>").children[0]; //document.createElement("span");
            this.dom.style.position = "absolute";
            this.x = getRandomInt(500);
            this.y = getRandomInt(500);
        }
        update() {
            this.dom.style.top = this.y + "px";
            this.dom.style.left = this.x + "px";
        }
    }
    exports.Truck = Truck;
});
//<span style='font-size:100px;'>&#9951;</span>
//# sourceMappingURL=truck.js.map