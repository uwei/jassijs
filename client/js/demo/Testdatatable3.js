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
                            header: ["${group1.name}", "", "${count(group1,'age')}"],
                            expression: "city",
                            footer: ["", "${group1.name}", ""]
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
    async function test() {
        // kk.o=0;
        var dlg = { reportdesign };
        dlg.value = sampleData;
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdGRhdGF0YWJsZTMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9kZW1vL1Rlc3RkYXRhdGFibGUzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxJQUFJLFlBQVksR0FBRztRQUNsQixPQUFPLEVBQUU7WUFDUjtnQkFDQyxTQUFTLEVBQUU7b0JBQ1YsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxNQUFNLENBQUM7b0JBQzNCLE1BQU0sRUFBRTt3QkFDUDs0QkFDQyxNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBQyxFQUFFLEVBQUMsd0JBQXdCLENBQUM7NEJBQ3RELFVBQVUsRUFBRSxNQUFNOzRCQUNsQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsZ0JBQWdCLEVBQUMsRUFBRSxDQUFDO3lCQUNyQzt3QkFDSTs0QkFDQyxNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDOzRCQUNoQyxVQUFVLEVBQUUsVUFBVTs0QkFDdEIsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFDLEVBQUUsRUFBQyxFQUFFLENBQUM7eUJBQzVCO3FCQUNEO29CQUNELE1BQU0sRUFBRSxDQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsTUFBTSxDQUFDO29CQUNoQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztvQkFDbEIsV0FBVyxFQUFFLE1BQU07b0JBQ25CLElBQUksRUFBRSxDQUFDLFlBQVksRUFBQyxrQkFBa0IsRUFBQyxjQUFjLENBQUM7aUJBQ3REO2FBQ0Q7U0FDRDtLQUNELENBQUM7SUFFRixJQUFJLFVBQVUsR0FBRztRQUNoQixFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7UUFDdkQsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO1FBQ3JELEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtRQUN4RCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7UUFDdkQsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1FBQ25ELEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtRQUN4RCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7UUFDcEQsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO1FBQ3JELEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtLQUNwRCxDQUFDO0lBTUssS0FBSyxVQUFVLElBQUk7UUFDdEIsVUFBVTtRQUNWLElBQUksR0FBRyxHQUFRLEVBQUUsWUFBWSxFQUFFLENBQUM7UUFDaEMsR0FBRyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7UUFFdkIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBTkQsb0JBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXBvcnREZXNpZ24gfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUmVwb3J0RGVzaWduXCI7XHJcbmltcG9ydCBqYXNzaSBmcm9tIFwiamFzc2lqcy9qYXNzaVwiO1xyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcclxuaW1wb3J0IHsgJFVJQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IEt1bmRlIH0gZnJvbSBcImRlL3JlbW90ZS9LdW5kZVwiO1xyXG5pbXBvcnQgeyBSVGV4dCB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SVGV4dFwiO1xyXG5cclxudmFyIHJlcG9ydGRlc2lnbiA9IHtcclxuXHRjb250ZW50OiBbXHJcblx0XHR7XHJcblx0XHRcdGRhdGF0YWJsZToge1xyXG5cdFx0XHRcdHdpZHRoczogWzE0MCxcImF1dG9cIixcImF1dG9cIl0sXHJcblx0XHRcdFx0Z3JvdXBzOiBbXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGhlYWRlcjogW1wiJHtncm91cDEubmFtZX1cIixcIlwiLFwiJHtjb3VudChncm91cDEsJ2FnZScpfVwiXSxcclxuXHRcdFx0XHRcdFx0ZXhwcmVzc2lvbjogXCJjaXR5XCIsXHJcblx0XHRcdFx0XHRcdGZvb3RlcjogW1wiXCIsXCIke2dyb3VwMS5uYW1lfVwiLFwiXCJdXHJcbn0sXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGhlYWRlcjogW1wiJHtncm91cDIubmFtZX1cIixcIlwiLFwiXCJdLFxyXG5cdFx0XHRcdFx0XHRleHByZXNzaW9uOiBcImN1c3RvbWVyXCIsXHJcblx0XHRcdFx0XHRcdGZvb3RlcjogW1wiY3VzdGZvb3RlclwiLFwiXCIsXCJcIl1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGhlYWRlcjogW1wiaWRcIixcImN1c3RvbWVyXCIsXCJjaXR5XCJdLFxyXG5cdFx0XHRcdGZvb3RlcjogW1wiXCIsXCJcIixcIlwiXSxcclxuXHRcdFx0XHRkYXRhZm9yZWFjaDogXCJjdXN0XCIsXHJcblx0XHRcdFx0Ym9keTogW1wiJHtjdXN0LmlkfVwiLFwiJHtjdXN0LmN1c3RvbWVyfVwiLFwiJHtjdXN0LmNpdHl9XCJdXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRdXHJcbn07XHJcblxyXG52YXIgc2FtcGxlRGF0YSA9IFtcclxuXHR7IGlkOiAxLCBjdXN0b21lcjogXCJGcmVkXCIsIGNpdHk6IFwiRnJhbmtmdXJ0XCIsIGFnZTogNTEgfSxcclxuXHR7IGlkOiA4LCBjdXN0b21lcjogXCJBbG1hXCIsIGNpdHk6IFwiRHJlc2RlblwiLCBhZ2U6IDcwIH0sXHJcblx0eyBpZDogMywgY3VzdG9tZXI6IFwiSGVpbnpcIiwgY2l0eTogXCJGcmFua2Z1cnRcIiwgYWdlOiAzMyB9LFxyXG5cdHsgaWQ6IDIsIGN1c3RvbWVyOiBcIkZyZWRcIiwgY2l0eTogXCJGcmFua2Z1cnRcIiwgYWdlOiA4OCB9LFxyXG5cdHsgaWQ6IDYsIGN1c3RvbWVyOiBcIk1heFwiLCBjaXR5OiBcIkRyZXNkZW5cIiwgYWdlOiAzIH0sXHJcblx0eyBpZDogNCwgY3VzdG9tZXI6IFwiSGVpbnpcIiwgY2l0eTogXCJGcmFua2Z1cnRcIiwgYWdlOiA2NCB9LFxyXG5cdHsgaWQ6IDUsIGN1c3RvbWVyOiBcIk1heFwiLCBjaXR5OiBcIkRyZXNkZW5cIiwgYWdlOiA1NCB9LFxyXG5cdHsgaWQ6IDcsIGN1c3RvbWVyOiBcIkFsbWFcIiwgY2l0eTogXCJEcmVzZGVuXCIsIGFnZTogMzMgfSxcclxuXHR7IGlkOiA5LCBjdXN0b21lcjogXCJPdHRvXCIsIGNpdHk6IFwiQmVybGluXCIsIGFnZTogMjEgfVxyXG5dO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgLy8ga2subz0wO1xyXG4gICAgdmFyIGRsZzogYW55ID0geyByZXBvcnRkZXNpZ24gfTtcclxuICAgIGRsZy52YWx1ZSA9IHNhbXBsZURhdGE7XHJcblxyXG4gICAgcmV0dXJuIGRsZztcclxufVxyXG4iXX0=