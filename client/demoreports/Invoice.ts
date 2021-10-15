

var reportdesign = {
	footer: [
		{
			alignment: "center",
			text: [{text: "IBAN: 5000550020"}],
			editTogether: true
		},
		{alignment: "center",text: "BIC DGGFFJ"}
	],
	content: [
		{
			columns: [{width: 325,fontSize: 20,text: "Invoice\n"},{image: "logo"}]
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
						{
							fontSize: 18,
							text: [{text: "B & M Consulting"}],
							editTogether: true
						},
						"Rastplatz 7",
						"09116 Chemnitz",
						{
							text: [{text: " "}],
							editTogether: true
						},
						{
							table: {
								widths: ["auto",100],
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
				widths: [365,110],
				header: ["Item",{alignment: "right",text: "Price"}],
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
				{width: 175,text: "\n"},
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
		{fontSize: 15,text: "Thank You!"}
	],
	images: {
		logo: "data:image/jpeg;base64,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"
	}
};



export  function test() {
    return { 
        reportdesign,
        data:{
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
        }
    };
   
}
