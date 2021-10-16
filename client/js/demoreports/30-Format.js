define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        header: [{}],
        content: [
            {
                table: {
                    body: [
                        [
                            "MM/DD/YYYY",
                            {
                                text: "${date}",
                                format: "MM/DD/YYYY"
                            }
                        ],
                        [
                            "DD.MM.YYYY",
                            {
                                text: "${date}",
                                format: "DD.MM.YYYY"
                            }
                        ],
                        [
                            "DD.MM.YYYY hh:mm:ss",
                            {
                                text: "${date}",
                                format: "DD.MM.YYYY hh:mm:ss"
                            }
                        ],
                        [
                            "h:mm:ss A",
                            {
                                text: "${date}",
                                format: "h:mm:ss A"
                            }
                        ],
                        [
                            "#.##0,00\n",
                            {
                                text: "${num}",
                                format: "#.##0,00"
                            }
                        ],
                        [
                            "#.##0,00 €\n",
                            {
                                text: "${num}",
                                format: "#.##0,00 €"
                            }
                        ],
                        [
                            "$#,###.00\n",
                            {
                                text: "${num}",
                                format: "$#,###.00"
                            }
                        ]
                    ]
                }
            }
        ]
    };
    function test() {
        return {
            reportdesign,
            data: {
                date: new Date(),
                num: 12502.55
            }
        };
    }
    exports.test = test;
});
//# sourceMappingURL=30-Format.js.map