
var reportdesign = {
    content: [

        {
            table: {
                body: [
                    [{text:"vor"},"vor"],
                    {
                        foreach: "line in invoice.lines",
                        do: [
                                "text","${line.text}"
                            ]
                       
                    },
                    ["nach","nach"]
                ]
            }
        },

    ]
};



export async function test() {
    // kk.o=0;
    var dlg: any = { reportdesign };
    dlg.value = {
        invoice: {
            name:"hh",
            lines: [
                {
                    text: "text1",
                    price: 10,
                    ulines: [{ text: "a1", price: 1 },
                    { text: "a2", price: 2 }]
                },
                {
                    text: "test2",
                    ulines: [{ text: "a3", price: 3}]
                },/*
                {
                    text: "this is an other position",
                    price: 19.5
                },
                {
                    text: "this is the last position",
                    price: 50
                }*/
            ]
        }
    };
    return dlg;
}
