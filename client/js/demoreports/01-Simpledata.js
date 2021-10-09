define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "Hallo ${name}",
            "${address.street}",
            "${parameter.date}"
        ]
    };
    function test() {
        return {
            reportdesign,
            data: {
                name: "Klaus",
                address: {
                    street: "Mainstreet 8"
                }
            },
            parameter: { date: "2021-10-10" } //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=01-Simpledata.js.map