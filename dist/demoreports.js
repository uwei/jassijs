reportdesign = {
    content: [
        "Hallo ${name}",
        "${address.street}",
        "${parameter.date}"
    ]
};
reportdesign.data = {
    name: "Klaus",
    address: {
        street: "Mainstreet 8"
    }
};
reportdesign.parameter = { date: "2021-10-10" }; //parameter
/*export function test() {
    return {
        reportdesign,
        data:{
            name:"Klaus",
            address:{
                street:"Mainstreet 8"
            }
        },
        parameter:{date:"2021-10-10"}      //parameter
    };
}*/
reportdesign = {
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
reportdesign.data = [
    { name: "line1" },
    { name: "line2" },
    { name: "line3" }
];
reportdesign = {
    content: [
        {
            columns: [
                [
                    "${invoice.customer.firstname} ${invoice.customer.lastname}",
                    "${invoice.customer.street}",
                    "${invoice.customer.place}"
                ],
                [
                    { fontSize: 18, text: "Invoice" },
                    "\n",
                    "Date: ${invoice.date}",
                    "Number: ${invoice.number}"
                ],
            ]
        },
        {
            table: {
                body: [
                    ["Item", "Price"],
                    {
                        foreach: "line in invoice.lines",
                        do: ["${line.text}", "${line.price}"]
                    }
                ]
            }
        },
        "\n",
        {
            foreach: "sum in invoice.summary",
            do: {
                columns: [
                    {
                        text: "${sum.text}"
                    },
                    {
                        text: "${sum.value}"
                    }
                ]
            }
        }
    ]
};
reportdesign.data = {
    invoice: {
        number: 1000,
        date: "2018-07-02",
        customer: {
            firstname: "Henry",
            lastname: "Klaus",
            street: "Hauptstr. 157",
            place: "Chemnitz"
        },
        lines: [
            {
                pos: 1,
                text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg",
                price: 10,
                amount: 50
            },
            {
                pos: 2,
                text: "this is the next position",
                price: 20.5
            },
            {
                pos: 3,
                text: "this is an other position",
                price: 19.5
            },
            {
                pos: 4,
                text: "this is the last position",
                price: 50
            }
        ],
        summary: [
            {
                text: "Net",
                value: 100
            },
            {
                text: "Tax",
                value: 19
            },
            {
                text: "Gross",
                value: 119
            }
        ]
    }
};
define("demoreports/12-Foreach", ["require", "exports", "jassijs_report/remote/pdfmakejassi"], function (require, exports, pdfmakejassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "A complex nested foreach. This could be better done with a datatable",
            {
                table: {
                    body: [
                        {
                            foreach: "group1 in entries",
                            do: {
                                foreach: "group2 in group1.entries",
                                dofirst: [{ bold: true, text: "${group1.name}", colSpan: 2 }, "dd"],
                                do: {
                                    foreach: "ar in group2.entries",
                                    dofirst: [{ text: "${group2.name}", colSpan: 2 }, "dd"],
                                    do: [
                                        "${ar.id}",
                                        "${ar.customer} from ${ar.city}"
                                    ],
                                    dolast: ["", ""],
                                },
                                dolast: ["End", "${group1.name}"],
                            }
                        }
                    ]
                }
            },
        ]
    };
    function test() {
        var sampleData = [
            { id: 1, customer: "Fred", city: "Frankfurt" },
            { id: 8, customer: "Alma", city: "Dresden" },
            { id: 3, customer: "Heinz", city: "Frankfurt" },
            { id: 2, customer: "Fred", city: "Frankfurt" },
            { id: 6, customer: "Max", city: "Dresden" },
            { id: 4, customer: "Heinz", city: "Frankfurt" },
            { id: 5, customer: "Max", city: "Dresden" },
            { id: 7, customer: "Alma", city: "Dresden" },
            { id: 9, customer: "Otto", city: "Berlin" }
        ];
        var groupedData = (0, pdfmakejassi_1.doGroup)(sampleData, ["city", "customer"]);
        return {
            reportdesign,
            data: groupedData, //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
reportdesign = {
    content: [
        "A Simple datatable",
        {
            datatable: {
                header: ["id", "customer", "city"],
                footer: ["", "", ""],
                dataforeach: "cust",
                body: ["${cust.id}", "${cust.customer}", "${cust.city}"]
            }
        }
    ]
};
reportdesign.data = [
    { id: 1, customer: "Fred", city: "Frankfurt" },
    { id: 8, customer: "Alma", city: "Dresden" },
    { id: 3, customer: "Heinz", city: "Frankfurt" },
    { id: 2, customer: "Fred", city: "Frankfurt" },
    { id: 6, customer: "Max", city: "Dresden" },
    { id: 4, customer: "Heinz", city: "Frankfurt" },
    { id: 5, customer: "Max", city: "Dresden" },
    { id: 7, customer: "Alma", city: "Dresden" },
    { id: 9, customer: "Otto", city: "Berlin" }
];
reportdesign = {
    content: [
        "A datatable with 2 groups",
        {
            datatable: {
                groups: [
                    {
                        header: ["${group1.name}", "", ""],
                        expression: "city",
                        footer: ["", "", ""]
                    },
                    {
                        header: ["${group2.name}", "", ""],
                        expression: "customer",
                        footer: ["custfooter", "", ""]
                    }
                ],
                header: ["id", "customer", "city"],
                footer: ["", "", ""],
                dataforeach: "cust",
                body: ["${cust.id}", "${cust.customer}", "${cust.city}"]
            }
        }
    ]
};
reportdesign.data = [
    { id: 1, customer: "Fred", city: "Frankfurt" },
    { id: 8, customer: "Alma", city: "Dresden" },
    { id: 3, customer: "Heinz", city: "Frankfurt" },
    { id: 2, customer: "Fred", city: "Frankfurt" },
    { id: 6, customer: "Max", city: "Dresden" },
    { id: 4, customer: "Heinz", city: "Frankfurt" },
    { id: 5, customer: "Max", city: "Dresden" },
    { id: 7, customer: "Alma", city: "Dresden" },
    { id: 9, customer: "Otto", city: "Berlin" }
];
reportdesign = {
    content: [
        "A datatable with 2 groups and  group-functions",
        "we can use sum max min avg count ",
        {
            datatable: {
                groups: [
                    {
                        header: ["in ${group1.name}", "\n", "", ""],
                        expression: "city",
                        footer: ["\n", "", "", "\n"]
                    },
                    {
                        header: ["", "", "", ""],
                        expression: "customer",
                        footer: [
                            "\n",
                            "\n",
                            {
                                text: [
                                    {
                                        text: "${group2.name} "
                                    },
                                    { color: "#202124", text: "Ø" },
                                    { text: "\n" }
                                ],
                                editTogether: true
                            },
                            "${avg(group2,\"age\")}"
                        ]
                    }
                ],
                header: ["id", "customer", "city", "age"],
                footer: ["count: ${count(items,\"id\")}", "", "", "\n"],
                dataforeach: "cust",
                body: [
                    "${cust.id}",
                    "${cust.customer}",
                    "${cust.city}",
                    "${cust.age}"
                ]
            }
        }
    ]
};
reportdesign.data = [
    { id: 1, customer: "Fred", city: "Frankfurt", age: 51 },
    { id: 8, customer: "Alma", city: "Dresden", age: 70 },
    { id: 3, customer: "Heinz", city: "Frankfurt", age: 33 },
    { id: 2, customer: "Fred", city: "Frankfurt", age: 88 },
    { id: 6, customer: "Max", city: "Dresden", age: 3 },
    { id: 4, customer: "Heinz", city: "Frankfurt", age: 64 },
    { id: 5, customer: "Max", city: "Dresden", age: 54 },
    { id: 7, customer: "Alma", city: "Dresden", age: 33 },
    { id: 9, customer: "Otto", city: "Berlin", age: 21 }
];
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
reportdesign = {
    content: []
};
reportdesign.data = {};
reportdesign.parameter = {};
reportdesign = {
    footer: [
        { alignment: "center", text: "IBAN: 5000550020" },
        { alignment: "center", text: "BIC DGGFFJ" }
    ],
    content: [
        {
            columns: [{ width: 325, fontSize: 20, text: "Invoice\n" }, { image: "logo" }]
        },
        {
            columns: [
                {
                    width: 320,
                    stack: [
                        "\n",
                        "\n",
                        "${invoice.customer.firstname} ${invoice.customer.lastname}",
                        "${invoice.customer.street}",
                        "${invoice.customer.place}"
                    ]
                },
                {
                    width: 170,
                    stack: [
                        "B & M Consulting",
                        "Rastplatz 7",
                        "09116 Chemnitz",
                        "\n",
                        {
                            table: {
                                widths: ["auto", 100],
                                body: [
                                    [
                                        "Date:",
                                        {
                                            alignment: "right",
                                            text: "${invoice.date}",
                                            format: "YYYY-MM-DD"
                                        }
                                    ],
                                    [
                                        "Number:",
                                        {
                                            alignment: "right",
                                            text: "${invoice.number}"
                                        }
                                    ]
                                ]
                            },
                            layout: "noBorders"
                        },
                        "",
                        "\n"
                    ]
                }
            ]
        },
        {
            datatable: {
                widths: [360, 110],
                header: ["Item", { alignment: "right", text: "Price" }],
                dataforeach: "line in invoice.lines",
                body: [
                    "${line.text}",
                    {
                        alignment: "right",
                        bold: false,
                        text: "${line.price}",
                        format: "#,##0.00"
                    }
                ]
            }
        },
        "\n",
        {
            foreach: "summ in invoice.summary",
            columns: [
                { width: 245, text: "\n" },
                {
                    width: 150,
                    text: "${summ.text}"
                },
                {
                    width: 100,
                    alignment: "right",
                    text: "${summ.value}",
                    format: "$#,###.00"
                }
            ]
        },
        "\n",
        "\n",
        "\n",
        { fontSize: 15, text: "Thank You!" }
    ],
    images: {
        logo: "data:image/jpeg;base64,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"
    }
};
reportdesign.data = {
    invoice: {
        number: 1200,
        date: new Date(),
        customer: {
            firstname: "Henry",
            lastname: "Klaus",
            street: "Hauptstr. 157",
            place: "9430 Drebach",
        },
        lines: [
            { pos: 1, text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg", price: 10.00, amount: 50, variante: [{ m: 1 }, { m: 2 }] },
            { pos: 2, text: "this is the next position", price: 20.50, },
            { pos: 3, text: "this is an other position", price: 19.50 },
            { pos: 4, text: "this is the last position", price: 50.00 },
        ],
        summary: [
            { text: "Subtotal", value: 100.00 },
            { text: "Tax", value: 19.00 },
            { text: "Subtotal", value: 119.00 },
        ]
    }
};
define("demoreports/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "types": {
            "jassijs_report/pdfMake-interface.ts": "https://cdn.jsdelivr.net/gh/uwei/jassijs@main/client/jassijs_report/pdfMake-interface.ts",
            "jassijs_report/ReportDesignGlobal.ts": "https://cdn.jsdelivr.net/gh/uwei/jassijs@main/client/jassijs_report/ReportDesignGlobal.ts"
        },
    };
});
//this file is autogenerated don't modify
define("demoreports/registry", ["require"], function (require) {
    return {
        default: {
            "demoreports/01-Simpledata.ts": {
                "date": 1655640800970
            },
            "demoreports/10-Foreach.ts": {
                "date": 1655407641261
            },
            "demoreports/11-Foreach.ts": {
                "date": 1656025255234
            },
            "demoreports/12-Foreach.ts": {
                "date": 1634336976000
            },
            "demoreports/21-Datatable.ts": {
                "date": 1655407847485
            },
            "demoreports/22-Datatable.ts": {
                "date": 1655407875091
            },
            "demoreports/23-Datatable.ts": {
                "date": 1656024793633
            },
            "demoreports/30-Format.ts": {
                "date": 1655407998923
            },
            "demoreports/Empty.ts": {
                "date": 1655408032703
            },
            "demoreports/Invoice.ts": {
                "date": 1655408066557
            },
            "demoreports/pdfmake-playground/Basics.ts": {
                "date": 1655408093593
            },
            "demoreports/pdfmake-playground/Columns.ts": {
                "date": 1655408107807
            },
            "demoreports/pdfmake-playground/Images.ts": {
                "date": 1655408119438
            },
            "demoreports/pdfmake-playground/Lists.ts": {
                "date": 1655408133565
            },
            "demoreports/pdfmake-playground/Margin.ts": {
                "date": 1655408161243
            },
            "demoreports/pdfmake-playground/Styles1.ts": {
                "date": 1655408172956
            },
            "demoreports/pdfmake-playground/Styles2.ts": {
                "date": 1655408180437
            },
            "demoreports/pdfmake-playground/Styles3.ts": {
                "date": 1655408187427
            },
            "demoreports/pdfmake-playground/Tables.ts": {
                "date": 1655408197639
            },
            "demoreports/modul.ts": {
                "date": 1655641244993
            }
        }
    };
});
reportdesign = {
    content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    ]
};
reportdesign = {
    content: [
        'By default paragraphs are stacked one on top of (or actually - below) another. ',
        'It\'s possible however to split any paragraph (or even the whole document) into columns.\n\n',
        'Here we go with 2 star-sized columns, with justified text and gap set to 20:\n\n',
        {
            alignment: 'justify',
            columns: [
                {
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                },
                {
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                }
            ]
        },
        '\nStar-sized columns have always equal widths, so if we define 3 of those, it\'ll look like this (make sure to scroll to the next page, as we have a couple of more examples):\n\n',
        {
            columns: [
                {
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                },
                {
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                },
                {
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                }
            ]
        },
        '\nYou can also specify accurate widths for some (or all columns). Let\'s make the first column and the last one narrow and let the layout engine divide remaining space equally between other star-columns:\n\n',
        {
            columns: [
                {
                    width: 90,
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                },
                {
                    width: '*',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                },
                {
                    width: '*',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                },
                {
                    width: 90,
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                }
            ]
        },
        '\nWe also support auto columns. They set their widths based on the content:\n\n',
        {
            columns: [
                {
                    width: 'auto',
                    text: 'auto column'
                },
                {
                    width: '*',
                    text: 'This is a star-sized column. It should get the remaining space divided by the number of all star-sized columns.'
                },
                {
                    width: 50,
                    text: 'this one has specific width set to 50'
                },
                {
                    width: 'auto',
                    text: 'another auto column'
                },
                {
                    width: '*',
                    text: 'This is a star-sized column. It should get the remaining space divided by the number of all star-sized columns.'
                },
            ]
        },
        '\nIf all auto columns fit within available width, the table does not occupy whole space:\n\n',
        {
            columns: [
                {
                    width: 'auto',
                    text: 'val1'
                },
                {
                    width: 'auto',
                    text: 'val2'
                },
                {
                    width: 'auto',
                    text: 'value3'
                },
                {
                    width: 'auto',
                    text: 'value 4'
                },
            ]
        },
        '\nAnother cool feature of pdfmake is the ability to have nested elements. Each column is actually quite similar to the whole document, so we can have inner paragraphs and further divisions, like in the following example:\n\n',
        {
            columns: [
                {
                    width: 100,
                    fontSize: 9,
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Conveniunt quieti extremum severitatem disseretur virtute locum virtus declarant. Greges telos detrimenti persius possint eripuit appellat democrito suscipere existimant. Facere usus levitatibus confirmavit, provincia rutilius libris accommodare valetudinis ignota fugienda arbitramur falsarum commodius. Voluptas summis arbitrarer cognitio temperantiamque, fuit posidonium pro assueverit animos inferiorem, affecti honestum ferreum cum tot nemo ius partes dissensio opinor, tuum intellegunt numeris ignorant, odia diligenter licet, sublatum repellere, maior ficta severa quantum mortem. Aut evertitur impediri vivamus.'
                },
                [
                    'As you can see in the document definition - this column is not defined with an object, but an array, which means it\'s treated as an array of paragraphs rendered one below another.',
                    'Just like on the top-level of the document. Let\'s try to divide the remaing space into 3 star-sized columns:\n\n',
                    {
                        columns: [
                            { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                            { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                            { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                        ]
                    }
                ]
            ]
        },
        '\n\nOh, don\'t forget, we can use everything from styling examples (named styles, custom overrides) here as well.\n\n',
        'For instance - our next paragraph will use the \'bigger\' style (with fontSize set to 15 and italics - true). We\'ll split it into three columns and make sure they inherit the style:\n\n',
        {
            style: 'bigger',
            columns: [
                'First column (BTW - it\'s defined as a single string value. pdfmake will turn it into appropriate structure automatically and make sure it inherits the styles',
                {
                    fontSize: 20,
                    text: 'In this column, we\'ve overriden fontSize to 20. It means the content should have italics=true (inherited from the style) and be a little bit bigger',
                },
                {
                    style: 'header',
                    text: 'Last column does not override any styling properties, but applies a new style (header) to itself. Eventually - texts here have italics=true (from bigger) and derive fontSize from the style. OK, but which one? Both styles define it. As we already know from our styling examples, multiple styles can be applied to the element and their order is important. Because \'header\' style has been set after \'bigger\' its fontSize takes precedence over the fontSize from \'bigger\'. This is how it works. You will find more examples in the unit tests.'
                }
            ]
        },
        '\n\nWow, you\'ve read the whole document! Congratulations :D'
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true
        },
        bigger: {
            fontSize: 15,
            italics: true
        }
    },
    defaultStyle: {
        columnGap: 20
    }
};
//this sample is modified a litle, because we have no node running in server
reportdesign = {
    content: [
        'pdfmake (since it\'s based on pdfkit) supports JPEG and PNG format',
        'If no width/height/fit is provided, image original size will be used',
        {
            image: 'https://cdn.jsdelivr.net/gh/bpampuch/pdfmake@master/examples/fonts/sampleImage.jpg',
        },
        'If you specify width, image will scale proportionally',
        {
            image: 'https://cdn.jsdelivr.net/gh/bpampuch/pdfmake@master/examples/fonts/sampleImage.jpg',
            width: 150
        },
        'If you specify both width and height - image will be stretched',
        {
            image: 'https://cdn.jsdelivr.net/gh/bpampuch/pdfmake@master/examples/fonts/sampleImage.jpg',
            width: 150,
            height: 150,
        },
        'You can also fit the image inside a rectangle',
        {
            image: 'https://cdn.jsdelivr.net/gh/bpampuch/pdfmake@master/examples/fonts/sampleImage.jpg',
            fit: [100, 100],
            pageBreak: 'after'
        },
        // Warning! Make sure to copy this definition and paste it to an
        // external text editor, as the online AceEditor has some troubles
        // with long dataUrl lines and the following image values look like
        // they're empty.
        'Images can be also provided in dataURL format...',
        {
            image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAE2ArcDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwT/xAA5EAACAgAEBAUDBAECBAcAAAAAAQIRAxIhURMxQWEiMlJxkQSBoRQzQmIjQ3KCscHwNERTY5Ki4f/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABoRAQEBAAMBAAAAAAAAAAAAAAARARIhQTH/2gAMAwEAAhEDEQA/APSADTIAAAAAAAAAAFgAgWLFgoWAAAAAWLIANWQhQAAAgAAAAAAAAAAApAAAAAAAAAAAAoIUCopkEVoGbLYACyWBSmbLYFsEFgUEsWBQSxYFJYIAsEBUWwBQAoBFBZGQDVkshSgCAIoIisACWLAFJYsCkFkAoIAKQAoAAIAAK0ACAAAAAAAAgAAoAAAAAAAAAACAoAgAApAAAAAAAAAAAAAAAAAAAAAAAAAAABQIClygZKMpAKRgAAAAsAACkKBBYAAAAAABUCAC2LIAKCCwKCWAIVAAUgAEABQAAAAAAAAAAAAAAABoAGQAAAAAAAAAAAAAAAAABQAAAAAAAAAAEBQBAUgAAAAAAAAAAAAAAAAApCgQAAUqZkAasgIQAAUAAAAAAAAAAAAAACgABQBKAAACgAAAAAgFIAUAAAAAAAAAAAAAAAAAABoAGQAAAAAACgQFIAAAAAAAAAABQAAAAAAAAAAAAAAAAAAEBQBAUAQFAEBQBCgAQFIAAAAAAAAAAAAAAAAAAAAqIANWSyAC2QAAWiCwKCAAAABCgCAoAgKKAgNUKAgKQCApCgAAAAAAADYAMgAAAAAAAACFAAACFAAgKQAAUCAoAgKAICgCAAoAAAAAAAAAAAAAAFCiAC0SigBQAAAAAAICgCAoAgKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFIAKCAAAAAAAAUABCgCAoA0ACKAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEKAIAAAAKAKQg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",
            width: 200
        },
        'or be declared in an "images" dictionary and referenced by name',
        {
            image: 'sampleImage',
            width: 200
        },
        'and opacity is supported:',
        {
            image: 'sampleImage',
            width: 150,
            opacity: 0.5
        },
    ],
    images: {
        sampleImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAE2ArcDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwT/xAA5EAACAgAEBAUDBAECBAcAAAAAAQIRAxIhURMxQWEiMlJxkQSBoRQzQmIjQ3KCscHwNERTY5Ki4f/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABoRAQEBAAMBAAAAAAAAAAAAAAARARIhQTH/2gAMAwEAAhEDEQA/APSADTIAAAAAAAAAAFgAgWLFgoWAAAAAWLIANWQhQAAAgAAAAAAAAAAApAAAAAAAAAAAAoIUCopkEVoGbLYACyWBSmbLYFsEFgUEsWBQSxYFJYIAsEBUWwBQAoBFBZGQDVkshSgCAIoIisACWLAFJYsCkFkAoIAKQAoAAIAAK0ACAAAAAAAAgAAoAAAAAAAAAACAoAgAApAAAAAAAAAAAAAAAAAAAAAAAAAAABQIClygZKMpAKRgAAAAsAACkKBBYAAAAAABUCAC2LIAKCCwKCWAIVAAUgAEABQAAAAAAAAAAAAAAABoAGQAAAAAAAAAAAAAAAAABQAAAAAAAAAAEBQBAUgAAAAAAAAAAAAAAAAApCgQAAUqZkAasgIQAAUAAAAAAAAAAAAAACgABQBKAAACgAAAAAgFIAUAAAAAAAAAAAAAAAAAABoAGQAAAAAACgQFIAAAAAAAAAABQAAAAAAAAAAAAAAAAAAEBQBAUAQFAEBQBCgAQFIAAAAAAAAAAAAAAAAAAAAqIANWSyAC2QAAWiCwKCAAAABCgCAoAgKKAgNUKAgKQCApCgAAAAAAADYAMgAAAAAAAACFAAACFAAgKQAAUCAoAgKAICgCAAoAAAAAAAAAAAAAAFCiAC0SigBQAAAAAAICgCAoAgKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFIAKCAAAAAAAAUABCgCAoA0ACKAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEKAIAAAAKAKQg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"
    }
};
reportdesign = {
    content: [
        { text: 'Unordered list', style: 'header' },
        {
            ul: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nUnordered list with longer lines', style: 'header' },
        {
            ul: [
                'item 1',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list', style: 'header' },
        {
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list with longer lines', style: 'header' },
        {
            ol: [
                'item 1',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list should be descending', style: 'header' },
        {
            reversed: true,
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list with start value', style: 'header' },
        {
            start: 50,
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list with own values', style: 'header' },
        {
            ol: [
                { text: 'item 1', counter: 10 },
                { text: 'item 2', counter: 20 },
                { text: 'item 3', counter: 30 },
                { text: 'item 4 without own value' }
            ]
        },
        { text: '\n\nNested lists (ordered)', style: 'header' },
        {
            ol: [
                'item 1',
                [
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    {
                        ol: [
                            'subitem 1',
                            'subitem 2',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            { text: [
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                ] },
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 4',
                            'subitem 5',
                        ]
                    }
                ],
                'item 3\nsecond line of item3'
            ]
        },
        { text: '\n\nNested lists (unordered)', style: 'header' },
        {
            ol: [
                'item 1',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                {
                    ul: [
                        'subitem 1',
                        'subitem 2',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        { text: [
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            ] },
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 4',
                        'subitem 5',
                    ]
                },
                'item 3\nsecond line of item3',
            ]
        },
        { text: '\n\nUnordered lists inside columns', style: 'header' },
        {
            columns: [
                {
                    ul: [
                        'item 1',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    ]
                },
                {
                    ul: [
                        'item 1',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    ]
                }
            ]
        },
        { text: '\n\nOrdered lists inside columns', style: 'header' },
        {
            columns: [
                {
                    ol: [
                        'item 1',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    ]
                },
                {
                    ol: [
                        'item 1',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    ]
                }
            ]
        },
        { text: '\n\nNested lists width columns', style: 'header' },
        {
            ul: [
                'item 1',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                {
                    ol: [
                        [
                            {
                                columns: [
                                    'column 1',
                                    {
                                        stack: [
                                            'column 2',
                                            {
                                                ul: [
                                                    'item 1',
                                                    'item 2',
                                                    {
                                                        ul: [
                                                            'item',
                                                            'item',
                                                            'item',
                                                        ]
                                                    },
                                                    'item 4',
                                                ]
                                            }
                                        ]
                                    },
                                    'column 3',
                                    'column 4',
                                ]
                            },
                            'subitem 1 in a vertical container',
                            'subitem 2 in a vertical container',
                        ],
                        'subitem 2',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        { text: [
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            ] },
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        'subitem 4',
                        'subitem 5',
                    ]
                },
                'item 3\nsecond line of item3',
            ]
        },
        { text: '\n\nUnordered list with square marker type', style: 'header' },
        {
            type: 'square',
            ul: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nUnordered list with circle marker type', style: 'header' },
        {
            type: 'circle',
            ul: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nColored unordered list', style: 'header' },
        {
            color: 'blue',
            ul: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nColored unordered list with own marker color', style: 'header' },
        {
            color: 'blue',
            markerColor: 'red',
            ul: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nColored ordered list', style: 'header' },
        {
            color: 'blue',
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nColored ordered list with own marker color', style: 'header' },
        {
            color: 'blue',
            markerColor: 'red',
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list - type: lower-alpha', style: 'header' },
        {
            type: 'lower-alpha',
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list - type: upper-alpha', style: 'header' },
        {
            type: 'upper-alpha',
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list - type: upper-roman', style: 'header' },
        {
            type: 'upper-roman',
            ol: [
                'item 1',
                'item 2',
                'item 3',
                'item 4',
                'item 5'
            ]
        },
        { text: '\n\nOrdered list - type: lower-roman', style: 'header' },
        {
            type: 'lower-roman',
            ol: [
                'item 1',
                'item 2',
                'item 3',
                'item 4',
                'item 5'
            ]
        },
        { text: '\n\nOrdered list - type: none', style: 'header' },
        {
            type: 'none',
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nUnordered list - type: none', style: 'header' },
        {
            type: 'none',
            ul: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list with own separator', style: 'header' },
        {
            separator: ')',
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list with own complex separator', style: 'header' },
        {
            separator: ['(', ')'],
            ol: [
                'item 1',
                'item 2',
                'item 3'
            ]
        },
        { text: '\n\nOrdered list with own items type', style: 'header' },
        {
            ol: [
                'item 1',
                { text: 'item 2', listType: 'none' },
                { text: 'item 3', listType: 'upper-roman' }
            ]
        },
        { text: '\n\nUnordered list with own items type', style: 'header' },
        {
            ul: [
                'item 1',
                { text: 'item 2', listType: 'none' },
                { text: 'item 3', listType: 'circle' }
            ]
        },
    ],
    styles: {
        header: {
            bold: true,
            fontSize: 15
        }
    },
    defaultStyle: {
        fontSize: 12
    }
};
reportdesign = {
    content: [
        {
            stack: [
                'This header has both top and bottom margins defined',
                { text: 'This is a subheader', style: 'subheader' },
            ],
            style: 'header'
        },
        {
            text: [
                'Margins have slightly different behavior than other layout properties. They are not inherited, unlike anything else. They\'re applied only to those nodes which explicitly ',
                'set margin or style property.\n',
            ]
        },
        {
            text: 'This paragraph (consisting of a single line) directly sets top and bottom margin to 20',
            margin: [0, 20],
        },
        {
            stack: [
                { text: [
                        'This line begins a stack of paragraphs. The whole stack uses a ',
                        { text: 'superMargin', italics: true },
                        ' style (with margin and fontSize properties).',
                    ]
                },
                { text: ['When you look at the', { text: ' document definition', italics: true }, ', you will notice that fontSize is inherited by all paragraphs inside the stack.'] },
                'Margin however is only applied once (to the whole stack).'
            ],
            style: 'superMargin'
        },
        {
            stack: [
                'I\'m not sure yet if this is the desired behavior. I find it a better approach however. One thing to be considered in the future is an explicit layout property called inheritMargin which could opt-in the inheritance.\n\n',
                {
                    fontSize: 15,
                    text: [
                        'Currently margins for ',
                        /* the following margin definition doesn't change anything */
                        { text: 'inlines', margin: 20 },
                        ' are ignored\n\n'
                    ],
                },
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
            ],
            margin: [0, 20, 0, 0],
            alignment: 'justify'
        }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            alignment: 'right',
            margin: [0, 190, 0, 80]
        },
        subheader: {
            fontSize: 14
        },
        superMargin: {
            margin: [20, 0, 40, 0],
            fontSize: 15
        }
    }
};
reportdesign = {
    content: [
        {
            text: 'This is a header, using header style',
            style: 'header'
        },
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n',
        {
            text: 'Subheader 1 - using subheader style',
            style: 'subheader'
        },
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
        {
            text: 'Subheader 2 - using subheader style',
            style: 'subheader'
        },
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
        {
            text: 'It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties',
            style: ['quote', 'small']
        }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true
        },
        subheader: {
            fontSize: 15,
            bold: true
        },
        quote: {
            italics: true
        },
        small: {
            fontSize: 8
        }
    }
};
reportdesign = {
    content: [
        {
            text: 'This is a header (whole paragraph uses the same header style)\n\n',
            style: 'header'
        },
        {
            text: [
                'It is however possible to provide an array of texts ',
                'to the paragraph (instead of a single string) and have ',
                { text: 'a better ', fontSize: 15, bold: true },
                'control over it. \nEach inline can be ',
                { text: 'styled ', fontSize: 20 },
                { text: 'independently ', italics: true, fontSize: 40 },
                'then.\n\n'
            ]
        },
        { text: 'Mixing named styles and style-overrides', style: 'header' },
        {
            style: 'bigger',
            italics: false,
            text: [
                'We can also mix named-styles and style-overrides at both paragraph and inline level. ',
                'For example, this paragraph uses the "bigger" style, which changes fontSize to 15 and sets italics to true. ',
                'Texts are not italics though. It\'s because we\'ve overriden italics back to false at ',
                'the paragraph level. \n\n',
                'We can also change the style of a single inline. Let\'s use a named style called header: ',
                { text: 'like here.\n', style: 'header' },
                'It got bigger and bold.\n\n',
                'OK, now we\'re going to mix named styles and style-overrides at the inline level. ',
                'We\'ll use header style (it makes texts bigger and bold), but we\'ll override ',
                'bold back to false: ',
                { text: 'wow! it works!', style: 'header', bold: false },
                '\n\nMake sure to take a look into the sources to understand what\'s going on here.'
            ]
        }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true
        },
        bigger: {
            fontSize: 15,
            italics: true
        }
    }
};
reportdesign = {
    content: [
        {
            text: 'This paragraph uses header style and extends the alignment property',
            style: 'header',
            alignment: 'center'
        },
        {
            text: [
                'This paragraph uses header style and overrides bold value setting it back to false.\n',
                'Header style in this example sets alignment to justify, so this paragraph should be rendered \n',
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
            ],
            style: 'header',
            bold: false
        }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            alignment: 'justify'
        }
    }
};
reportdesign = {
    content: [
        { text: 'Tables', style: 'header' },
        'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
        { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
        'The following table has nothing more than a body array',
        {
            style: 'tableExample',
            table: {
                body: [
                    ['Column 1', 'Column 2', 'Column 3'],
                    ['One value goes here', 'Another one here', 'OK?']
                ]
            }
        },
        { text: 'A simple table with nested elements', style: 'subheader' },
        'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
        {
            style: 'tableExample',
            table: {
                body: [
                    ['Column 1', 'Column 2', 'Column 3'],
                    [
                        {
                            stack: [
                                'Let\'s try an unordered list',
                                {
                                    ul: [
                                        'item 1',
                                        'item 2'
                                    ]
                                }
                            ]
                        },
                        [
                            'or a nested table',
                            {
                                table: {
                                    body: [
                                        ['Col1', 'Col2', 'Col3'],
                                        ['1', '2', '3'],
                                        ['1', '2', '3']
                                    ]
                                },
                            }
                        ],
                        { text: [
                                'Inlines can be ',
                                { text: 'styled\n', italics: true },
                                { text: 'easily as everywhere else', fontSize: 10 }
                            ]
                        }
                    ]
                ]
            }
        },
        { text: 'Defining column widths', style: 'subheader' },
        'Tables support the same width definitions as standard columns:',
        {
            bold: true,
            ul: [
                'auto',
                'star',
                'fixed value'
            ]
        },
        {
            style: 'tableExample',
            table: {
                widths: [100, '*', 200, '*'],
                body: [
                    ['width=100', 'star-sized', 'width=200', 'star-sized'],
                    ['fixed-width cells have exactly the specified width', { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }]
                ]
            }
        },
        {
            style: 'tableExample',
            table: {
                widths: ['*', 'auto'],
                body: [
                    ['This is a star-sized column. The next column over, an auto-sized column, will wrap to accomodate all the text in this cell.', 'I am auto sized.'],
                ]
            }
        },
        {
            style: 'tableExample',
            table: {
                widths: ['*', 'auto'],
                body: [
                    ['This is a star-sized column. The next column over, an auto-sized column, will not wrap to accomodate all the text in this cell, because it has been given the noWrap style.', { text: 'I am auto sized.', noWrap: true }],
                ]
            }
        },
        { text: 'Defining row heights', style: 'subheader' },
        {
            style: 'tableExample',
            table: {
                heights: [20, 50, 70],
                body: [
                    ['row 1 with height 20', 'column B'],
                    ['row 2 with height 50', 'column B'],
                    ['row 3 with height 70', 'column B']
                ]
            }
        },
        'With same height:',
        {
            style: 'tableExample',
            table: {
                heights: 40,
                body: [
                    ['row 1', 'column B'],
                    ['row 2', 'column B'],
                    ['row 3', 'column B']
                ]
            }
        },
        'With height from function:',
        {
            style: 'tableExample',
            table: {
                heights: function (row) {
                    return (row + 1) * 25;
                },
                body: [
                    ['row 1', 'column B'],
                    ['row 2', 'column B'],
                    ['row 3', 'column B']
                ]
            }
        },
        { text: 'Column/row spans', pageBreak: 'before', style: 'subheader' },
        'Each cell-element can set a rowSpan or colSpan',
        {
            style: 'tableExample',
            color: '#444',
            table: {
                widths: [200, 'auto', 'auto'],
                headerRows: 2,
                // keepWithHeaderRows: 1,
                body: [
                    [{ text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
                    [{ text: 'Header 1', style: 'tableHeader', alignment: 'center' }, { text: 'Header 2', style: 'tableHeader', alignment: 'center' }, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    [{ rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }, 'Sample value 2', 'Sample value 3'],
                    ['', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, ''],
                    ['Sample value 1', '', ''],
                ]
            }
        },
        { text: 'Headers', pageBreak: 'before', style: 'subheader' },
        'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',
        { text: ['It is also possible to set keepWithHeaderRows to make sure there will be no page-break between the header and these rows. Take a look at the document-definition and play with it. If you set it to one, the following table will automatically start on the next page, since there\'s not enough space for the first row to be rendered here'], color: 'gray', italics: true },
        {
            style: 'tableExample',
            table: {
                headerRows: 1,
                // dontBreakRows: true,
                // keepWithHeaderRows: 1,
                body: [
                    [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                    [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    ]
                ]
            }
        },
        { text: 'Styling tables', style: 'subheader' },
        'You can provide a custom styler for the table. Currently it supports:',
        {
            ul: [
                'line widths',
                'line colors',
                'cell paddings',
            ]
        },
        'with more options coming soon...\n\npdfmake currently has a few predefined styles (see them on the next page)',
        { text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
        {
            style: 'tableExample',
            table: {
                headerRows: 1,
                body: [
                    [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ]
            },
            layout: 'noBorders'
        },
        { text: 'headerLineOnly:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
        {
            style: 'tableExample',
            table: {
                headerRows: 1,
                body: [
                    [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ]
            },
            layout: 'headerLineOnly'
        },
        { text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
        {
            style: 'tableExample',
            table: {
                headerRows: 1,
                body: [
                    [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ]
            },
            layout: 'lightHorizontalLines'
        },
        { text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
        {
            style: 'tableExample',
            table: {
                headerRows: 1,
                body: [
                    [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                },
                // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                // paddingLeft: function(i, node) { return 4; },
                // paddingRight: function(i, node) { return 4; },
                // paddingTop: function(i, node) { return 2; },
                // paddingBottom: function(i, node) { return 2; },
                // fillColor: function (rowIndex, node, columnIndex) { return null; }
            }
        },
        { text: 'zebra style', margin: [0, 20, 0, 8] },
        {
            style: 'tableExample',
            table: {
                body: [
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ]
            },
            layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        },
        { text: 'and can be used dash border', margin: [0, 20, 0, 8] },
        {
            style: 'tableExample',
            table: {
                headerRows: 1,
                body: [
                    [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return 'black';
                },
                vLineColor: function (i, node) {
                    return 'black';
                },
                hLineStyle: function (i, node) {
                    if (i === 0 || i === node.table.body.length) {
                        return null;
                    }
                    return { dash: { length: 10, space: 4 } };
                },
                vLineStyle: function (i, node) {
                    if (i === 0 || i === node.table.widths.length) {
                        return null;
                    }
                    return { dash: { length: 4 } };
                },
                // paddingLeft: function(i, node) { return 4; },
                // paddingRight: function(i, node) { return 4; },
                // paddingTop: function(i, node) { return 2; },
                // paddingBottom: function(i, node) { return 2; },
                // fillColor: function (i, node) { return null; }
            }
        },
        { text: 'Optional border', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
        'Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.',
        {
            style: 'tableExample',
            table: {
                body: [
                    [
                        {
                            border: [false, true, false, false],
                            fillColor: '#eeeeee',
                            text: 'border:\n[false, true, false, false]'
                        },
                        {
                            border: [false, false, false, false],
                            fillColor: '#dddddd',
                            text: 'border:\n[false, false, false, false]'
                        },
                        {
                            border: [true, true, true, true],
                            fillColor: '#eeeeee',
                            text: 'border:\n[true, true, true, true]'
                        }
                    ],
                    [
                        {
                            rowSpan: 3,
                            border: [true, true, true, true],
                            fillColor: '#eeeeff',
                            text: 'rowSpan: 3\n\nborder:\n[true, true, true, true]'
                        },
                        {
                            border: undefined,
                            fillColor: '#eeeeee',
                            text: 'border:\nundefined'
                        },
                        {
                            border: [true, false, false, false],
                            fillColor: '#dddddd',
                            text: 'border:\n[true, false, false, false]'
                        }
                    ],
                    [
                        '',
                        {
                            colSpan: 2,
                            border: [true, true, true, true],
                            fillColor: '#eeffee',
                            text: 'colSpan: 2\n\nborder:\n[true, true, true, true]'
                        },
                        ''
                    ],
                    [
                        '',
                        {
                            border: undefined,
                            fillColor: '#eeeeee',
                            text: 'border:\nundefined'
                        },
                        {
                            border: [false, false, true, true],
                            fillColor: '#dddddd',
                            text: 'border:\n[false, false, true, true]'
                        }
                    ]
                ]
            },
            layout: {
                defaultBorder: false,
            }
        },
        'For every cell without a border property, whether it has all borders or not is determined by layout.defaultBorder, which is false in the table above and true (by default) in the table below.',
        {
            style: 'tableExample',
            table: {
                body: [
                    [
                        {
                            border: [false, false, false, false],
                            fillColor: '#eeeeee',
                            text: 'border:\n[false, false, false, false]'
                        },
                        {
                            fillColor: '#dddddd',
                            text: 'border:\nundefined'
                        },
                        {
                            fillColor: '#eeeeee',
                            text: 'border:\nundefined'
                        },
                    ],
                    [
                        {
                            fillColor: '#dddddd',
                            text: 'border:\nundefined'
                        },
                        {
                            fillColor: '#eeeeee',
                            text: 'border:\nundefined'
                        },
                        {
                            border: [true, true, false, false],
                            fillColor: '#dddddd',
                            text: 'border:\n[true, true, false, false]'
                        },
                    ]
                ]
            }
        },
        'And some other examples with rowSpan/colSpan...',
        {
            style: 'tableExample',
            table: {
                body: [
                    [
                        '',
                        'column 1',
                        'column 2',
                        'column 3'
                    ],
                    [
                        'row 1',
                        {
                            rowSpan: 3,
                            colSpan: 3,
                            border: [true, true, true, true],
                            fillColor: '#cccccc',
                            text: 'rowSpan: 3\ncolSpan: 3\n\nborder:\n[true, true, true, true]'
                        },
                        '',
                        ''
                    ],
                    [
                        'row 2',
                        '',
                        '',
                        ''
                    ],
                    [
                        'row 3',
                        '',
                        '',
                        ''
                    ]
                ]
            },
            layout: {
                defaultBorder: false,
            }
        },
        {
            style: 'tableExample',
            table: {
                body: [
                    [
                        {
                            colSpan: 3,
                            text: 'colSpan: 3\n\nborder:\n[false, false, false, false]',
                            fillColor: '#eeeeee',
                            border: [false, false, false, false]
                        },
                        '',
                        ''
                    ],
                    [
                        'border:\nundefined',
                        'border:\nundefined',
                        'border:\nundefined'
                    ]
                ]
            }
        },
        {
            style: 'tableExample',
            table: {
                body: [
                    [
                        { rowSpan: 3, text: 'rowSpan: 3\n\nborder:\n[false, false, false, false]', fillColor: '#eeeeee', border: [false, false, false, false] },
                        'border:\nundefined',
                        'border:\nundefined'
                    ],
                    [
                        '',
                        'border:\nundefined',
                        'border:\nundefined'
                    ],
                    [
                        '',
                        'border:\nundefined',
                        'border:\nundefined'
                    ]
                ]
            }
        }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        },
        subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
        },
        tableExample: {
            margin: [0, 5, 0, 15]
        },
        tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
        }
    },
    defaultStyle: {
    // alignment: 'justify'
    }
};
//# sourceMappingURL=demoreports.js.map