define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        header: [{}],
        content: [
            {
                table: {
                    body: [
                        [
                            "MM/DD/YYYY",
                            {
                                text: "${date}",
                                format: "MM/DD/YYYY"
                            }
                        ],
                        [
                            "DD.MM.YYYY",
                            {
                                text: "${date}",
                                format: "DD.MM.YYYY"
                            }
                        ],
                        [
                            "DD.MM.YYYY hh:mm:ss",
                            {
                                text: "${date}",
                                format: "DD.MM.YYYY hh:mm:ss"
                            }
                        ],
                        [
                            "h:mm:ss A",
                            {
                                text: "${date}",
                                format: "h:mm:ss A"
                            }
                        ],
                        [
                            "#.##0,00\n",
                            {
                                text: "${num}",
                                format: "#.##0,00"
                            }
                        ],
                        [
                            "#.##0,00 €\n",
                            {
                                text: "${num}",
                                format: "#.##0,00 €"
                            }
                        ],
                        [
                            "$#,###.00\n",
                            {
                                text: "${num}",
                                format: "$#,###.00"
                            }
                        ]
                    ]
                }
            }
        ]
    };
    function test() {
        return {
            reportdesign,
            data: {
                date: new Date(),
                num: 12502.55
            }
        };
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMzAtRm9ybWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGVtb3JlcG9ydHMvMzAtRm9ybWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFBQSxJQUFJLFlBQVksR0FBRztRQUNsQixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDWixPQUFPLEVBQUU7WUFDUjtnQkFDQyxLQUFLLEVBQUU7b0JBQ04sSUFBSSxFQUFFO3dCQUNMOzRCQUNDLFlBQVk7NEJBQ1o7Z0NBQ0MsSUFBSSxFQUFFLFNBQVM7Z0NBQ2YsTUFBTSxFQUFFLFlBQVk7NkJBQ3BCO3lCQUNEO3dCQUNEOzRCQUNDLFlBQVk7NEJBQ1o7Z0NBQ0MsSUFBSSxFQUFFLFNBQVM7Z0NBQ2YsTUFBTSxFQUFFLFlBQVk7NkJBQ3BCO3lCQUNEO3dCQUNEOzRCQUNDLHFCQUFxQjs0QkFDckI7Z0NBQ0MsSUFBSSxFQUFFLFNBQVM7Z0NBQ2YsTUFBTSxFQUFFLHFCQUFxQjs2QkFDN0I7eUJBQ0Q7d0JBQ0Q7NEJBQ0MsV0FBVzs0QkFDWDtnQ0FDQyxJQUFJLEVBQUUsU0FBUztnQ0FDZixNQUFNLEVBQUUsV0FBVzs2QkFDbkI7eUJBQ0Q7d0JBQ0Q7NEJBQ0MsWUFBWTs0QkFDWjtnQ0FDQyxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxNQUFNLEVBQUUsVUFBVTs2QkFDbEI7eUJBQ0Q7d0JBQ0Q7NEJBQ0MsY0FBYzs0QkFDZDtnQ0FDQyxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxNQUFNLEVBQUUsWUFBWTs2QkFDcEI7eUJBQ0Q7d0JBQ0Q7NEJBQ0MsYUFBYTs0QkFDYjtnQ0FDQyxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxNQUFNLEVBQUUsV0FBVzs2QkFDbkI7eUJBQ0Q7cUJBQ0Q7aUJBQ0Q7YUFDRDtTQUNEO0tBQ0QsQ0FBQztJQUVGLFNBQWdCLElBQUk7UUFDaEIsT0FBTztZQUNILFlBQVk7WUFDWixJQUFJLEVBQUM7Z0JBQ0QsSUFBSSxFQUFDLElBQUksSUFBSSxFQUFFO2dCQUNmLEdBQUcsRUFBQyxRQUFRO2FBQ2Y7U0FDSixDQUFDO0lBQ04sQ0FBQztJQVJELG9CQVFDIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHJlcG9ydGRlc2lnbiA9IHtcblx0aGVhZGVyOiBbe31dLFxuXHRjb250ZW50OiBbXG5cdFx0e1xuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFwiTU0vREQvWVlZWVwiLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0ZXh0OiBcIiR7ZGF0ZX1cIixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiBcIk1NL0REL1lZWVlcIlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0XCJERC5NTS5ZWVlZXCIsXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRleHQ6IFwiJHtkYXRlfVwiLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6IFwiREQuTU0uWVlZWVwiXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcIkRELk1NLllZWVkgaGg6bW06c3NcIixcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGV4dDogXCIke2RhdGV9XCIsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogXCJERC5NTS5ZWVlZIGhoOm1tOnNzXCJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFwiaDptbTpzcyBBXCIsXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRleHQ6IFwiJHtkYXRlfVwiLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6IFwiaDptbTpzcyBBXCJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFwiIy4jIzAsMDBcXG5cIixcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGV4dDogXCIke251bX1cIixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiBcIiMuIyMwLDAwXCJcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFwiIy4jIzAsMDAg4oKsXFxuXCIsXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRleHQ6IFwiJHtudW19XCIsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogXCIjLiMjMCwwMCDigqxcIlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0XCIkIywjIyMuMDBcXG5cIixcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGV4dDogXCIke251bX1cIixcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiBcIiQjLCMjIy4wMFwiXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fVxuXHRdXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICByZXR1cm4geyBcbiAgICAgICAgcmVwb3J0ZGVzaWduLFxuICAgICAgICBkYXRhOntcbiAgICAgICAgICAgIGRhdGU6bmV3IERhdGUoKSxcbiAgICAgICAgICAgIG51bToxMjUwMi41NVxuICAgICAgICB9XG4gICAgfTtcbn0iXX0=