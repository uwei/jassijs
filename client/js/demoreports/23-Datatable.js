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
//# sourceMappingURL=23-Datatable.js.map