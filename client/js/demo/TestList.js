define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                text: [{ text: "werqwreqwreqwreq  ewq we rqw eqw rqw qw qw eqw" }],
                editTogether: true
            },
            {
                ol: [
                    "item 1",
                    {
                        text: [
                            { text: "item 2eqw rqew q" },
                            { bold: true, text: "we qw eqw qw eqw e qwe  " },
                            {
                                text: "we lkq jklqj qälkjqkeljlkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjjj"
                            }
                        ],
                        editTogether: true
                    },
                    "item 3"
                ],
                reversed: true
            },
            {
                ul: [{ foreach: "person", text: "${person.name}" }]
            }
        ]
    };
    async function test() {
        // kk.o=0;
        var dlg = { reportdesign };
        dlg.data = [{ name: "Max" }, { name: "Moritz" }];
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=TestList.js.map