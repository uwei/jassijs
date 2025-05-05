reportdesign = {
    defaultStyle: { fontSize: 12 },
    styles: {
        header: { bold: true, fontSize: 15 }
    },
    content: [
        { style: "header", text: "Unordered list" },
        {
            ul: [
                "it 1",
                "ssssss",
                "dsssssss\n",
                "item 3sss\nssss\n"
            ]
        },
        { style: "header", text: "Unordered list with longer lines" },
        {
            ul: [
                "item 1",
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                "item 3"
            ]
        },
        { style: "header", text: "Ordered list" },
        { ol: ["item 1", "item 2", "item 3"] },
        { style: "header", text: "Ordered list with longer lines" },
        {
            ol: [
                "item 1",
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                "item 3"
            ]
        },
        { style: "header", text: "Ordered list should be descending" },
        { ol: ["item 1", "item 2", "item 3"], reversed: true },
        { style: "header", text: "Ordered list with start value" },
        { ol: ["item 1", "item 2", "item 3"], start: 50 },
        { style: "header", text: "Ordered list with own values" },
        {
            ol: [
                { counter: 10, text: "item 1" },
                { counter: 20, text: "item 2" },
                { counter: 30, text: "item 3" },
                "item 4 without own value"
            ]
        },
        { style: "header", text: "Nested lists (ordered)" },
        {
            ol: [
                "item 1",
                [
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                    {
                        ol: [
                            "subitem 1",
                            "subitem 2",
                            "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                            "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                            "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                            {
                                text: [
                                    "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                    "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                    "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                    "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                    "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                    "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                    "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                    "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit"
                                ]
                            },
                            "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                            "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                            "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                            "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                            "subitem 4",
                            "subitem 5"
                        ]
                    }
                ],
                "item 3\nsecond line of item3"
            ]
        },
        { style: "header", text: "Nested lists (unordered)" },
        {
            ol: [
                "item 1",
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                {
                    ul: [
                        "subitem 1",
                        "subitem 2",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        {
                            text: [
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit"
                            ]
                        },
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 4",
                        "subitem 5"
                    ]
                },
                "item 3\nsecond line of item3"
            ]
        },
        { style: "header", text: "Unordered lists inside columns" },
        {
            columns: [
                {
                    ul: [
                        "item 1",
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit"
                    ]
                },
                {
                    ul: [
                        "item 1",
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit"
                    ]
                }
            ]
        },
        { style: "header", text: "Ordered lists inside columns" },
        {
            columns: [
                {
                    ol: [
                        "item 1",
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit"
                    ]
                },
                {
                    ol: [
                        "item 1",
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit"
                    ]
                }
            ]
        },
        { style: "header", text: "Nested lists width columns" },
        {
            ul: [
                "item 1",
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                {
                    ol: [
                        [
                            {
                                columns: [
                                    "column 1",
                                    [
                                        "column 2",
                                        {
                                            ul: [
                                                "item 1",
                                                "item 2",
                                                {
                                                    ul: [
                                                        "item",
                                                        "item",
                                                        "item"
                                                    ]
                                                },
                                                "item 4"
                                            ]
                                        }
                                    ],
                                    "column 3",
                                    "column 4"
                                ]
                            },
                            "subitem 1 in a vertical container",
                            "subitem 2 in a vertical container"
                        ],
                        "subitem 2",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        {
                            text: [
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                                "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit"
                            ]
                        },
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit",
                        "subitem 4",
                        "subitem 5"
                    ]
                },
                "item 3\nsecond line of item3"
            ]
        },
        { style: "header", text: "Unordered list with square marker type" },
        { ul: ["item 1", "item 2", "item 3"], type: "square" },
        { style: "header", text: "Unordered list with circle marker type" },
        { ul: ["item 1", "item 2", "item 3"], type: "circle" },
        { style: "header", text: "Colored unordered list" },
        { color: "blue", ul: ["item 1", "item 2", "item 3"] },
        {
            style: "header",
            text: "Colored unordered list with own marker color"
        },
        {
            color: "blue",
            markerColor: "red",
            ul: ["item 1", "item 2", "item 3"]
        },
        { style: "header", text: "Colored ordered list" },
        { color: "blue", ol: ["item 1", "item 2", "item 3"] },
        { style: "header", text: "Colored ordered list with own marker color" },
        {
            color: "blue",
            markerColor: "red",
            ol: ["item 1", "item 2", "item 3"]
        },
        { style: "header", text: "Ordered list - type: lower-alpha" },
        { ol: ["item 1", "item 2", "item 3"], type: "lower-alpha" },
        { style: "header", text: "Ordered list - type: upper-alpha" },
        { ol: ["item 1", "item 2", "item 3"], type: "upper-alpha" },
        { style: "header", text: "Ordered list - type: upper-roman" },
        {
            ol: ["item 1", "item 2", "item 3", "item 4", "item 5"],
            type: "upper-roman"
        },
        { style: "header", text: "Ordered list - type: lower-roman" },
        {
            ol: ["item 1", "item 2", "item 3", "item 4", "item 5"],
            type: "lower-roman"
        },
        { style: "header", text: "Ordered list - type: none" },
        { ol: ["item 1", "item 2", "item 3"], type: "none" },
        { style: "header", text: "Unordered list - type: none" },
        { ul: ["item 1", "item 2", "item 3"], type: "none" },
        { style: "header", text: "Ordered list with own separator" },
        { separator: ")", ol: ["item 1", "item 2", "item 3"] },
        { style: "header", text: "Ordered list with own complex separator" },
        { separator: ["(", ")"], ol: ["item 1", "item 2", "item 3"] },
        { style: "header", text: "Ordered list with own items type" },
        {
            ol: [
                "item 1",
                { listType: "none", text: "item 2" },
                { listType: "upper-roman", text: "item 3" }
            ]
        },
        { style: "header", text: "Unordered list with own items type" },
        {
            ul: [
                "item 1",
                { listType: "none", text: "item 2" },
                { listType: "circle", text: "item 3" }
            ]
        }
    ]
};
//# sourceMappingURL=Testreport.js.map