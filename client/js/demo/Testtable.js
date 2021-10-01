define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                table: {
                    widths: [15, "auto", 75, "auto"],
                    body: [
                        ["d", "qwr", "ewr", "\n"],
                        ["3", "qwer", "eee", "\n"],
                        ["3", "er", "\n", ""],
                        ["", "wqe", "", ""]
                    ]
                }
            }
        ]
    };
    async function test() {
        // kk.o=0;
        var dlg = { reportdesign };
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=Testtable.js.map