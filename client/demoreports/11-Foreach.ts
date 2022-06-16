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
                {}
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
        {},
        {},
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