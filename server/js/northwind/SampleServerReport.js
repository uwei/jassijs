"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleServerReport = void 0;
class SampleServerReport {
    constructor() {
        this.content = undefined;
    }
    layout(me) {
        this.content = {
            stack: [
                {
                    columns: [
                        {
                            stack: [
                                {
                                    text: "{{name}}{{name2}}"
                                },
                            ]
                        }
                    ]
                }
            ]
        };
    }
    async run(data, param) {
        //do database query with param
        //getBase64
    }
}
exports.SampleServerReport = SampleServerReport;
//# sourceMappingURL=SampleServerReport.js.map