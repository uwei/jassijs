define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
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
    function test() {
        var sampleData = [
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
        return {
            reportdesign,
            data: sampleData, //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjMtRGF0YXRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGVtb3JlcG9ydHMvMjMtRGF0YXRhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFBQSxJQUFJLFlBQVksR0FBRztRQUNsQixPQUFPLEVBQUU7WUFDUixnREFBZ0Q7WUFDaEQsbUNBQW1DO1lBQ25DO2dCQUNDLFNBQVMsRUFBRTtvQkFDVixNQUFNLEVBQUU7d0JBQ1A7NEJBQ0MsTUFBTSxFQUFFLENBQUMsbUJBQW1CLEVBQUMsSUFBSSxFQUFDLEVBQUUsRUFBQyxFQUFFLENBQUM7NEJBQ3hDLFVBQVUsRUFBRSxNQUFNOzRCQUNsQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxJQUFJLENBQUM7eUJBQ3pCO3dCQUNEOzRCQUNDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQzs0QkFDckIsVUFBVSxFQUFFLFVBQVU7NEJBQ3RCLE1BQU0sRUFBRTtnQ0FDUCxJQUFJO2dDQUNKLElBQUk7Z0NBQ0o7b0NBQ0MsSUFBSSxFQUFFO3dDQUNMOzRDQUNDLElBQUksRUFBRSxpQkFBaUI7eUNBQ3ZCO3dDQUNELEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDO3dDQUM1QixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUM7cUNBQ1o7b0NBQ0QsWUFBWSxFQUFFLElBQUk7aUNBQ2xCO2dDQUNELHdCQUF3Qjs2QkFDeEI7eUJBQ0Q7cUJBQ0Q7b0JBQ0QsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsS0FBSyxDQUFDO29CQUN0QyxNQUFNLEVBQUUsQ0FBQywrQkFBK0IsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLElBQUksQ0FBQztvQkFDcEQsV0FBVyxFQUFFLE1BQU07b0JBQ25CLElBQUksRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGtCQUFrQjt3QkFDbEIsY0FBYzt3QkFDZCxhQUFhO3FCQUNiO2lCQUNEO2FBQ0Q7U0FDRDtLQUNELENBQUM7SUFFRixTQUFnQixJQUFJO1FBQ2hCLElBQUksVUFBVSxHQUFHO1lBQ2IsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO1lBQ3ZELEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtZQUNyRCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7WUFDeEQsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO1lBQ3ZELEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtZQUNuRCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7WUFDeEQsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO1lBQ3BELEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtZQUNyRCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7U0FDdkQsQ0FBQztRQUNGLE9BQU87WUFDSCxZQUFZO1lBQ1osSUFBSSxFQUFFLFVBQVUsRUFBVSxNQUFNO1lBQ2hDLGdDQUFnQztTQUNuQyxDQUFDO0lBQ04sQ0FBQztJQWpCRCxvQkFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcmVwb3J0ZGVzaWduID0ge1xuXHRjb250ZW50OiBbXG5cdFx0XCJBIGRhdGF0YWJsZSB3aXRoIDIgZ3JvdXBzIGFuZCAgZ3JvdXAtZnVuY3Rpb25zXCIsXG5cdFx0XCJ3ZSBjYW4gdXNlIHN1bSBtYXggbWluIGF2ZyBjb3VudCBcIixcblx0XHR7XG5cdFx0XHRkYXRhdGFibGU6IHtcblx0XHRcdFx0Z3JvdXBzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aGVhZGVyOiBbXCJpbiAke2dyb3VwMS5uYW1lfVwiLFwiXFxuXCIsXCJcIixcIlwiXSxcblx0XHRcdFx0XHRcdGV4cHJlc3Npb246IFwiY2l0eVwiLFxuXHRcdFx0XHRcdFx0Zm9vdGVyOiBbXCJcXG5cIixcIlwiLFwiXCIsXCJcXG5cIl1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGhlYWRlcjogW1wiXCIsXCJcIixcIlwiLFwiXCJdLFxuXHRcdFx0XHRcdFx0ZXhwcmVzc2lvbjogXCJjdXN0b21lclwiLFxuXHRcdFx0XHRcdFx0Zm9vdGVyOiBbXG5cdFx0XHRcdFx0XHRcdFwiXFxuXCIsXG5cdFx0XHRcdFx0XHRcdFwiXFxuXCIsXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0OiBbXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6IFwiJHtncm91cDIubmFtZX3CoFwiXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0e2NvbG9yOiBcIiMyMDIxMjRcIix0ZXh0OiBcIsOYXCJ9LFxuXHRcdFx0XHRcdFx0XHRcdFx0e3RleHQ6IFwiXFxuXCJ9XG5cdFx0XHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdFx0XHRlZGl0VG9nZXRoZXI6IHRydWVcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XCIke2F2Zyhncm91cDIsXFxcImFnZVxcXCIpfVwiXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRoZWFkZXI6IFtcImlkXCIsXCJjdXN0b21lclwiLFwiY2l0eVwiLFwiYWdlXCJdLFxuXHRcdFx0XHRmb290ZXI6IFtcImNvdW50OiAke2NvdW50KGl0ZW1zLFxcXCJpZFxcXCIpfVwiLFwiXCIsXCJcIixcIlxcblwiXSxcblx0XHRcdFx0ZGF0YWZvcmVhY2g6IFwiY3VzdFwiLFxuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0XCIke2N1c3QuaWR9XCIsXG5cdFx0XHRcdFx0XCIke2N1c3QuY3VzdG9tZXJ9XCIsXG5cdFx0XHRcdFx0XCIke2N1c3QuY2l0eX1cIixcblx0XHRcdFx0XHRcIiR7Y3VzdC5hZ2V9XCJcblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH1cblx0XVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHNhbXBsZURhdGEgPSBbXG4gICAgICAgIHsgaWQ6IDEsIGN1c3RvbWVyOiBcIkZyZWRcIiwgY2l0eTogXCJGcmFua2Z1cnRcIiwgYWdlOiA1MSB9LFxuICAgICAgICB7IGlkOiA4LCBjdXN0b21lcjogXCJBbG1hXCIsIGNpdHk6IFwiRHJlc2RlblwiLCBhZ2U6IDcwIH0sXG4gICAgICAgIHsgaWQ6IDMsIGN1c3RvbWVyOiBcIkhlaW56XCIsIGNpdHk6IFwiRnJhbmtmdXJ0XCIsIGFnZTogMzMgfSxcbiAgICAgICAgeyBpZDogMiwgY3VzdG9tZXI6IFwiRnJlZFwiLCBjaXR5OiBcIkZyYW5rZnVydFwiLCBhZ2U6IDg4IH0sXG4gICAgICAgIHsgaWQ6IDYsIGN1c3RvbWVyOiBcIk1heFwiLCBjaXR5OiBcIkRyZXNkZW5cIiwgYWdlOiAzIH0sXG4gICAgICAgIHsgaWQ6IDQsIGN1c3RvbWVyOiBcIkhlaW56XCIsIGNpdHk6IFwiRnJhbmtmdXJ0XCIsIGFnZTogNjQgfSxcbiAgICAgICAgeyBpZDogNSwgY3VzdG9tZXI6IFwiTWF4XCIsIGNpdHk6IFwiRHJlc2RlblwiLCBhZ2U6IDU0IH0sXG4gICAgICAgIHsgaWQ6IDcsIGN1c3RvbWVyOiBcIkFsbWFcIiwgY2l0eTogXCJEcmVzZGVuXCIsIGFnZTogMzMgfSxcbiAgICAgICAgeyBpZDogOSwgY3VzdG9tZXI6IFwiT3R0b1wiLCBjaXR5OiBcIkJlcmxpblwiLCBhZ2U6IDIxIH1cbiAgICBdO1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlcG9ydGRlc2lnbixcbiAgICAgICAgZGF0YTogc2FtcGxlRGF0YSwgICAgICAgICAvL2RhdGFcbiAgICAgICAgLy8gcGFyYW1ldGVyOnt9ICAgICAgLy9wYXJhbWV0ZXJcbiAgICB9O1xufSJdfQ==