"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fill = void 0;
var reportdesign = {
    content: [
        {
            datatable: {
                dataforeach: "person",
                body: [
                    "${person.name}", "${person.lastname}"
                ]
            }
        }
    ]
};
async function fill(parameter) {
    var data = [
        { name: "Aoron", lastname: "Müller" },
        { name: "Heino", lastname: "Brecht" }
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
//# sourceMappingURL=TestServerreport.js.map