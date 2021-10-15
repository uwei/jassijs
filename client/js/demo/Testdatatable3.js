define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                datatable: {
                    widths: [140, "auto", "auto"],
                    groups: [
                        {
                            header: ["${group1.name}", "\n", ""],
                            expression: "city",
                            footer: ["${sum(group1,'name')}", "${group1.name}", ""]
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
    async function test() {
        // kk.o=0;
        var dlg = { reportdesign };
        dlg.value = sampleData;
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdGRhdGF0YWJsZTMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9kZW1vL1Rlc3RkYXRhdGFibGUzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxJQUFJLFlBQVksR0FBRztRQUNsQixPQUFPLEVBQUU7WUFDUjtnQkFDQyxTQUFTLEVBQUU7b0JBQ1YsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxNQUFNLENBQUM7b0JBQzNCLE1BQU0sRUFBRTt3QkFDUDs0QkFDQyxNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBQyxJQUFJLEVBQUMsRUFBRSxDQUFDOzRCQUNsQyxVQUFVLEVBQUUsTUFBTTs0QkFDbEIsTUFBTSxFQUFFLENBQUMsdUJBQXVCLEVBQUMsZ0JBQWdCLEVBQUMsRUFBRSxDQUFDO3lCQUMxRDt3QkFDSTs0QkFDQyxNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDOzRCQUNoQyxVQUFVLEVBQUUsVUFBVTs0QkFDdEIsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFDLEVBQUUsRUFBQyxFQUFFLENBQUM7eUJBQzVCO3FCQUNEO29CQUNELE1BQU0sRUFBRSxDQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsTUFBTSxDQUFDO29CQUNoQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztvQkFDbEIsV0FBVyxFQUFFLE1BQU07b0JBQ25CLElBQUksRUFBRSxDQUFDLFlBQVksRUFBQyxrQkFBa0IsRUFBQyxjQUFjLENBQUM7aUJBQ3REO2FBQ0Q7U0FDRDtLQUNELENBQUM7SUFFRixJQUFJLFVBQVUsR0FBRztRQUNiLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7UUFDOUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUM1QyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1FBQy9DLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7UUFDOUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUMzQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO1FBQy9DLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7UUFDM0MsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUM1QyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0tBQzlDLENBQUM7SUFLSyxLQUFLLFVBQVUsSUFBSTtRQUN0QixVQUFVO1FBQ1YsSUFBSSxHQUFHLEdBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQztRQUNoQyxHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUV2QixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFORCxvQkFNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcG9ydERlc2lnbiB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SZXBvcnREZXNpZ25cIjtcclxuaW1wb3J0IGphc3NpIGZyb20gXCJqYXNzaWpzL2phc3NpXCI7XHJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xyXG5pbXBvcnQgeyAkVUlDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgS3VuZGUgfSBmcm9tIFwiZGUvcmVtb3RlL0t1bmRlXCI7XHJcbmltcG9ydCB7IFJUZXh0IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JUZXh0XCI7XHJcblxyXG52YXIgcmVwb3J0ZGVzaWduID0ge1xyXG5cdGNvbnRlbnQ6IFtcclxuXHRcdHtcclxuXHRcdFx0ZGF0YXRhYmxlOiB7XHJcblx0XHRcdFx0d2lkdGhzOiBbMTQwLFwiYXV0b1wiLFwiYXV0b1wiXSxcclxuXHRcdFx0XHRncm91cHM6IFtcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aGVhZGVyOiBbXCIke2dyb3VwMS5uYW1lfVwiLFwiXFxuXCIsXCJcIl0sXHJcblx0XHRcdFx0XHRcdGV4cHJlc3Npb246IFwiY2l0eVwiLFxyXG5cdFx0XHRcdFx0XHRmb290ZXI6IFtcIiR7c3VtKGdyb3VwMSwnbmFtZScpfVwiLFwiJHtncm91cDEubmFtZX1cIixcIlwiXVxyXG59LFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRoZWFkZXI6IFtcIiR7Z3JvdXAyLm5hbWV9XCIsXCJcIixcIlwiXSxcclxuXHRcdFx0XHRcdFx0ZXhwcmVzc2lvbjogXCJjdXN0b21lclwiLFxyXG5cdFx0XHRcdFx0XHRmb290ZXI6IFtcImN1c3Rmb290ZXJcIixcIlwiLFwiXCJdXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRoZWFkZXI6IFtcImlkXCIsXCJjdXN0b21lclwiLFwiY2l0eVwiXSxcclxuXHRcdFx0XHRmb290ZXI6IFtcIlwiLFwiXCIsXCJcIl0sXHJcblx0XHRcdFx0ZGF0YWZvcmVhY2g6IFwiY3VzdFwiLFxyXG5cdFx0XHRcdGJvZHk6IFtcIiR7Y3VzdC5pZH1cIixcIiR7Y3VzdC5jdXN0b21lcn1cIixcIiR7Y3VzdC5jaXR5fVwiXVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XVxyXG59O1xyXG5cclxudmFyIHNhbXBsZURhdGEgPSBbXHJcbiAgICB7IGlkOiAxLCBjdXN0b21lcjogXCJGcmVkXCIsIGNpdHk6IFwiRnJhbmtmdXJ0XCIgfSxcclxuICAgIHsgaWQ6IDgsIGN1c3RvbWVyOiBcIkFsbWFcIiwgY2l0eTogXCJEcmVzZGVuXCIgfSxcclxuICAgIHsgaWQ6IDMsIGN1c3RvbWVyOiBcIkhlaW56XCIsIGNpdHk6IFwiRnJhbmtmdXJ0XCIgfSxcclxuICAgIHsgaWQ6IDIsIGN1c3RvbWVyOiBcIkZyZWRcIiwgY2l0eTogXCJGcmFua2Z1cnRcIiB9LFxyXG4gICAgeyBpZDogNiwgY3VzdG9tZXI6IFwiTWF4XCIsIGNpdHk6IFwiRHJlc2RlblwiIH0sXHJcbiAgICB7IGlkOiA0LCBjdXN0b21lcjogXCJIZWluelwiLCBjaXR5OiBcIkZyYW5rZnVydFwiIH0sXHJcbiAgICB7IGlkOiA1LCBjdXN0b21lcjogXCJNYXhcIiwgY2l0eTogXCJEcmVzZGVuXCIgfSxcclxuICAgIHsgaWQ6IDcsIGN1c3RvbWVyOiBcIkFsbWFcIiwgY2l0eTogXCJEcmVzZGVuXCIgfSxcclxuICAgIHsgaWQ6IDksIGN1c3RvbWVyOiBcIk90dG9cIiwgY2l0eTogXCJCZXJsaW5cIiB9XHJcbl07XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIC8vIGtrLm89MDtcclxuICAgIHZhciBkbGc6IGFueSA9IHsgcmVwb3J0ZGVzaWduIH07XHJcbiAgICBkbGcudmFsdWUgPSBzYW1wbGVEYXRhO1xyXG5cclxuICAgIHJldHVybiBkbGc7XHJcbn1cclxuIl19