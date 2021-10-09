define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "Hallo ${name}"
        ]
    };
    function test() {
        return {
            reportdesign,
            data: { name: Klaus } //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=1Simpledata.js.map