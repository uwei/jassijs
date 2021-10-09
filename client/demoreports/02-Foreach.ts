var reportdesign = {
    content: [
        //for each could be in each element e.g. text
        {
            foreach: "line",
            text: "${line.name}"
        },
        "or in table",
        {
            table: {
                body: [
                    {
                        foreach: "line",
                        do:["${line.name}"]
                    }
                ]
            }
        }
        
    ]
};

export function test() {
    return {
        reportdesign,
        data: [
            { name: "line1" },
            { name: "line2" },
            { name: "line3" }
        ]
        //data:{},         //data
        // parameter:{}      //parameter
    };
}