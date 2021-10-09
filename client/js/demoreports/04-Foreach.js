define(["require", "exports", "jassijs_report/remote/pdfmakejassi"], function (require, exports, pdfmakejassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "A complex nested foreach. This could be better done with a datatable",
            {
                table: {
                    body: [
                        {
                            foreach: "group1 in entries",
                            do: {
                                foreach: "group2 in group1.entries",
                                dofirst: [{ bold: true, text: "${group1.name}", colSpan: 2 }, "dd"],
                                do: {
                                    foreach: "ar in group2.entries",
                                    dofirst: [{ text: "${group2.name}", colSpan: 2 }, "dd"],
                                    do: [
                                        "${ar.id}",
                                        "${ar.customer} from ${ar.city}"
                                    ],
                                    dolast: ["", ""],
                                },
                                dolast: ["End", "${group1.name}"],
                            }
                        }
                    ]
                }
            },
        ]
    };
    function test() {
        var sampleData = [
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
        var groupedData = pdfmakejassi_1.doGroup(sampleData, ["city", "customer"]);
        return {
            reportdesign,
            data: groupedData, //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDQtRm9yZWFjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2RlbW9yZXBvcnRzLzA0LUZvcmVhY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUVBLElBQUksWUFBWSxHQUFHO1FBQ2YsT0FBTyxFQUFFO1lBQ0wsc0VBQXNFO1lBQ3RFO2dCQUNJLEtBQUssRUFBRTtvQkFDSCxJQUFJLEVBQUU7d0JBQ0Y7NEJBQ0ksT0FBTyxFQUFFLG1CQUFtQjs0QkFFNUIsRUFBRSxFQUNGO2dDQUNJLE9BQU8sRUFBRSwwQkFBMEI7Z0NBQ25DLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQ0FDbkUsRUFBRSxFQUFFO29DQUNBLE9BQU8sRUFBRSxzQkFBc0I7b0NBQy9CLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7b0NBQ3ZELEVBQUUsRUFBRTt3Q0FDQSxVQUFVO3dDQUNWLGdDQUFnQztxQ0FDbkM7b0NBQ0QsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztpQ0FDbkI7Z0NBQ0QsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDOzZCQUNwQzt5QkFFSjtxQkFDSjtpQkFDSjthQUNKO1NBRUo7S0FDSixDQUFDO0lBQ0YsU0FBZ0IsSUFBSTtRQUNoQixJQUFJLFVBQVUsR0FBRztZQUNiLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQy9DLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDOUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMzQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQy9DLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDM0MsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUM1QyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO1NBQzlDLENBQUM7UUFDRixJQUFJLFdBQVcsR0FBRyxzQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzVELE9BQU87WUFDSCxZQUFZO1lBQ1osSUFBSSxFQUFFLFdBQVcsRUFBVSxNQUFNO1lBQ2pDLGdDQUFnQztTQUNuQyxDQUFDO0lBQ04sQ0FBQztJQWxCRCxvQkFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkb0dyb3VwIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L3JlbW90ZS9wZGZtYWtlamFzc2lcIjtcblxudmFyIHJlcG9ydGRlc2lnbiA9IHtcbiAgICBjb250ZW50OiBbXG4gICAgICAgIFwiQSBjb21wbGV4IG5lc3RlZCBmb3JlYWNoLiBUaGlzIGNvdWxkIGJlIGJldHRlciBkb25lIHdpdGggYSBkYXRhdGFibGVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgdGFibGU6IHtcbiAgICAgICAgICAgICAgICBib2R5OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2g6IFwiZ3JvdXAxIGluIGVudHJpZXNcIixcblxuICAgICAgICAgICAgICAgICAgICAgICAgZG86XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaDogXCJncm91cDIgaW4gZ3JvdXAxLmVudHJpZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2ZpcnN0OiBbeyBib2xkOiB0cnVlLCB0ZXh0OiBcIiR7Z3JvdXAxLm5hbWV9XCIsIGNvbFNwYW46IDIgfSwgXCJkZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoOiBcImFyIGluIGdyb3VwMi5lbnRyaWVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvZmlyc3Q6IFt7IHRleHQ6IFwiJHtncm91cDIubmFtZX1cIiwgY29sU3BhbjogMiB9LCBcImRkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkbzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIke2FyLmlkfVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIke2FyLmN1c3RvbWVyfSBmcm9tICR7YXIuY2l0eX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2xhc3Q6IFtcIlwiLCBcIlwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbGFzdDogW1wiRW5kXCIsIFwiJHtncm91cDEubmFtZX1cIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgIF1cbn07XG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgc2FtcGxlRGF0YSA9IFtcbiAgICAgICAgeyBpZDogMSwgY3VzdG9tZXI6IFwiRnJlZFwiLCBjaXR5OiBcIkZyYW5rZnVydFwiIH0sXG4gICAgICAgIHsgaWQ6IDgsIGN1c3RvbWVyOiBcIkFsbWFcIiwgY2l0eTogXCJEcmVzZGVuXCIgfSxcbiAgICAgICAgeyBpZDogMywgY3VzdG9tZXI6IFwiSGVpbnpcIiwgY2l0eTogXCJGcmFua2Z1cnRcIiB9LFxuICAgICAgICB7IGlkOiAyLCBjdXN0b21lcjogXCJGcmVkXCIsIGNpdHk6IFwiRnJhbmtmdXJ0XCIgfSxcbiAgICAgICAgeyBpZDogNiwgY3VzdG9tZXI6IFwiTWF4XCIsIGNpdHk6IFwiRHJlc2RlblwiIH0sXG4gICAgICAgIHsgaWQ6IDQsIGN1c3RvbWVyOiBcIkhlaW56XCIsIGNpdHk6IFwiRnJhbmtmdXJ0XCIgfSxcbiAgICAgICAgeyBpZDogNSwgY3VzdG9tZXI6IFwiTWF4XCIsIGNpdHk6IFwiRHJlc2RlblwiIH0sXG4gICAgICAgIHsgaWQ6IDcsIGN1c3RvbWVyOiBcIkFsbWFcIiwgY2l0eTogXCJEcmVzZGVuXCIgfSxcbiAgICAgICAgeyBpZDogOSwgY3VzdG9tZXI6IFwiT3R0b1wiLCBjaXR5OiBcIkJlcmxpblwiIH1cbiAgICBdO1xuICAgIHZhciBncm91cGVkRGF0YSA9IGRvR3JvdXAoc2FtcGxlRGF0YSwgW1wiY2l0eVwiLCBcImN1c3RvbWVyXCJdKTtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXBvcnRkZXNpZ24sXG4gICAgICAgIGRhdGE6IGdyb3VwZWREYXRhLCAgICAgICAgIC8vZGF0YVxuICAgICAgICAvLyBwYXJhbWV0ZXI6e30gICAgICAvL3BhcmFtZXRlclxuICAgIH07XG59Il19