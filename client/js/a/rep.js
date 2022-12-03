define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Rep = void 0;
    var reportdesign = {
        content: {
            stack: [
                {
                    text: "Das ist der Titel",
                    bold: true
                },
                {
                    text: [
                        {
                            text: " "
                        }
                    ],
                    editTogether: true
                },
                {
                    text: "Hallo"
                }
            ]
        }
    };
    class Rep {
        constructor() {
            this.reportdesign = reportdesign;
        }
    }
    exports.Rep = Rep;
    async function test() {
        // kk.o=0;
        var dlg = new Rep();
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=rep.js.map