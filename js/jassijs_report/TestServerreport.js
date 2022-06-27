"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.fill = void 0;
var reportdesign = {
    content: [
        {
            datatable: {
                widths: ["auto", "auto", 140],
                header: [
                    {
                        bold: true,
                        italics: true,
                        font: "Asap",
                        text: "name2233"
                    },
                    "lastname",
                    ""
                ],
                footer: ["", "", "\n"],
                dataforeach: "person",
                body: [
                    "${person.name}",
                    "${person.lastname}",
                    "${person.fullname()}"
                ]
            }
        }
    ]
};
async function fill(parameter) {
    var data = [
        { name: "Aoron", lastname: "Müllera", fullname() { return this.name + ", " + this.lastname; } },
        { name: "Heino", lastname: "Brechtp", fullname() { return this.name + ", " + this.lastname; } }
    ];
    if (parameter.sort === "name")
        data = data.sort((a, b) => { return a.name.localeCompare(b.name); });
    if (parameter.sort === "lastname")
        data = data.sort((a, b) => { return a.lastname.localeCompare(b.lastname); });
    return {
        reportdesign,
        data
    };
}
exports.fill = fill;
async function test() {
    return await fill({ sort: "lastname" });
}
exports.test = test;
//ok
//# sourceMappingURL=TestServerreport.js.map