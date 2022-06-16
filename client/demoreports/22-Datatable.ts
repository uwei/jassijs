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
