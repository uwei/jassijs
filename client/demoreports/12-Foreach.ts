import { doGroup } from "jassijs_report/remote/pdfmakejassi";

var reportdesign = {
    content: [
        "A complex nested foreach. This could be better done with a datatable",
        {
            table: {
                body: [
                    {
                        foreach: "group1 in entries",

                        do:
                        {
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
export function test() {
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
    var groupedData = doGroup(sampleData, ["city", "customer"]);
    return {
        reportdesign,
        data: groupedData,         //data
        // parameter:{}      //parameter
    };
}