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
//# sourceMappingURL=21-Datatable.js.map