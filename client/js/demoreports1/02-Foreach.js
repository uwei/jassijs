define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            //for each could be in each element e.g. text
            {
                foreach: "line",
                text: "${line.name}"
            },
            "or in table",
            {
                table: {
                    body: [
                        {
                            foreach: "line",
                            do: ["${line.name}"]
                        }
                    ]
                }
            }
        ]
    };
    function test() {
        return {
            reportdesign,
            data: [
                { name: "line1" },
                { name: "line2" },
                { name: "line3" }
            ]
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=02-Foreach.js.map