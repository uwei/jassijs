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
            { ol: ["kkkk", "hhhh", "item 3"] },
            {
                ul: [{ foreach: "person", text: "${person.name}" }]
            }
        ]
    };
    async function test() {
        // kk.o=0;
        var dlg = { reportdesign };
        dlg.reportdesign.data = [{ name: "Max" }, { name: "Moritz" }];
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=TestList.js.map