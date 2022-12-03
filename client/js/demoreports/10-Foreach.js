reportdesign = {
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
                        do: ["${line.name}"]
                    }
                ]
            }
        }
    ]
};
reportdesign.data = [
    { name: "line1" },
    { name: "line2" },
    { name: "line3" }
];
//# sourceMappingURL=10-Foreach.js.map