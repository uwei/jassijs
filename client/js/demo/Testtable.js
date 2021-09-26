define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                table: {
                    body: [
                        ['Column 1', 'Column 2', 'Column 3'],
                        ['One value goes here', 'Another one here', 'OK?']
                    ]
                }
            },
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