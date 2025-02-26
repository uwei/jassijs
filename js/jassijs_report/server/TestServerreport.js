"use strict";
//synchronize-server-client
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
                        text: "name"
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
    if ((parameter === null || parameter === void 0 ? void 0 : parameter.sort) === "name")
        data = data.sort((a, b) => { return a.name.localeCompare(b.name); });
    if ((parameter === null || parameter === void 0 ? void 0 : parameter.sort) === "lastname")
        data = data.sort((a, b) => { return a.lastname.localeCompare(b.lastname); });
    return {
        reportdesign,
        data
    };
}
exports.fill = fill;
async function test() {
    return await fill(undefined);
}
exports.test = test;
//ok
//# sourceMappingURL=TestServerreport.js.map