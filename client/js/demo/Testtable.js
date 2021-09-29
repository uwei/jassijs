define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                table: {
                    body: [
                        ["www"],
                    ]
                }
            }
        ],
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            }
        }
    };
    async function test() {
        // kk.o=0;
        var dlg = { reportdesign };
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=Testtable.js.map