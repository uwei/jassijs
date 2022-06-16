reportdesign = {
    header: [],
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
reportdesign.data = {
    date: new Date(),
    num: 12502.55
};
//# sourceMappingURL=30-Format.js.map