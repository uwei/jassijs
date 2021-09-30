define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                table: {
                    widths: ["auto", 50, "auto", "auto"],
                    body: [
                        ["d", "\n", "", ""],
                        ["3", "", "", ""],
                        ["3", "", "", ""],
                        ["", "", "", ""]
                    ]
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? 'yellow' : null;
                    },
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 4 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 4 : 1;
                    },
                    hLineColor: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'red';
                    },
                    vLineColor: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 'blue' : 'green';
                    }
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