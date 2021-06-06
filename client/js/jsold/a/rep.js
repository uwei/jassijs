define(["require", "exports", "jassijs_report/ReportDesign"], function (require, exports, ReportDesign_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Rep = void 0;
    class Rep extends ReportDesign_1.ReportDesign {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        layout(me) {
            this.design = {
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
//# sourceMappingURL=rep.js.map