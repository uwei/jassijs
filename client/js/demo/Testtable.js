define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    //Defning row heights
    //heaercount
    //headerLineOnly
    var reportdesign = {
        content: [
            {
                table: {
                    widths: [10, "auto", 75, "auto", "auto"],
                    body: [
                        [
                            {
                                fillColor: "yellow",
                                border: [true, true, true, true],
                                text: "d"
                            },
                            { background: "yellow", text: "qwr" },
                            "ewr",
                            "\n",
                            ""
                        ],
                        [
                            "3",
                            "qwer",
                            { border: [true, true, false, false], text: "eee" },
                            "\n",
                            ""
                        ],
                        [
                            "3",
                            { border: [true, true, false, false], text: "er" },
                            {
                                bold: true,
                                border: [true, false, false, false],
                                text: "eee"
                            },
                            "",
                            ""
                        ],
                        ["", "wqe", "", "", ""]
                    ]
                },
                layout: { defaultBorder: false }
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