define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                text: [{ text: "werqwreqwreqwreq  ewq we rqw eqw rqw qw qw eqw" }],
                editTogether: true
            },
            {
                ol: [
                    "item 1",
                    {
                        text: [
                            { text: "item 2eqw rqew q" },
                            { bold: true, text: "we qw eqw qw eqw e qwe  " },
                            {
                                text: "we lkq jklqj qälkjqkeljlkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjjjjjjjj jjjjjjjjjjjjjjjjjjjj"
                            }
                        ],
                        editTogether: true
                    },
                    "item 3"
                ],
                reversed: true
            },
            {
                ul: [{ foreach: "person", text: "${person.name}" }]
            }
        ]
    };
    async function test() {
        // kk.o=0;
        var dlg = { reportdesign };
        dlg.reportdesign.data = [{ name: "Max" }, { name: "Moritz" }];
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdExpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9kZW1vL1Rlc3RMaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFDQSxJQUFJLFlBQVksR0FBRztRQUNsQixPQUFPLEVBQUU7WUFDUjtnQkFDQyxJQUFJLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxnREFBZ0QsRUFBQyxDQUFDO2dCQUNoRSxZQUFZLEVBQUUsSUFBSTthQUNsQjtZQUNEO2dCQUNDLEVBQUUsRUFBRTtvQkFDSCxRQUFRO29CQUNSO3dCQUNDLElBQUksRUFBRTs0QkFDTCxFQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBQzs0QkFDMUIsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBQzs0QkFDN0M7Z0NBQ0MsSUFBSSxFQUFFLHdHQUF3Rzs2QkFDOUc7eUJBQ0Q7d0JBQ0QsWUFBWSxFQUFFLElBQUk7cUJBQ2xCO29CQUNELFFBQVE7aUJBQ1I7Z0JBQ0QsUUFBUSxFQUFFLElBQUk7YUFDZDtZQUNEO2dCQUNDLEVBQUUsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQzthQUNoRDtTQUNEO0tBQ0QsQ0FBQztJQUtLLEtBQUssVUFBVSxJQUFJO1FBQ3pCLFVBQVU7UUFDVixJQUFJLEdBQUcsR0FBUSxFQUFFLFlBQVksRUFBRSxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQTtRQUNwRCxPQUFPLEdBQUcsQ0FBQztJQUNaLENBQUM7SUFMRCxvQkFLQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgcmVwb3J0ZGVzaWduID0ge1xyXG5cdGNvbnRlbnQ6IFtcclxuXHRcdHtcclxuXHRcdFx0dGV4dDogW3t0ZXh0OiBcIndlcnF3cmVxd3JlcXdyZXHCoCBld3Egd2UgcnF3IGVxdyBycXcgcXcgcXcgZXF3XCJ9XSxcclxuXHRcdFx0ZWRpdFRvZ2V0aGVyOiB0cnVlXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRvbDogW1xyXG5cdFx0XHRcdFwiaXRlbSAxXCIsXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGV4dDogW1xyXG5cdFx0XHRcdFx0XHR7dGV4dDogXCJpdGVtIDJlcXcgcnFldyBxXCJ9LFxyXG5cdFx0XHRcdFx0XHR7Ym9sZDogdHJ1ZSx0ZXh0OiBcIndlIHF3IGVxdyBxdyBlcXcgZSBxd2XCoCBcIn0sXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBcIndlIGxrcSBqa2xxaiBxw6Rsa2pxa2VsamxrampqampqampqampqampqampqampqampqampqampqIGpqampqampqampqampqampqampqampqamogampqampqampqampqampqampqampcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0ZWRpdFRvZ2V0aGVyOiB0cnVlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRcIml0ZW0gM1wiXHJcblx0XHRcdF0sXHJcblx0XHRcdHJldmVyc2VkOiB0cnVlXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHR1bDogW3tmb3JlYWNoOiBcInBlcnNvblwiLHRleHQ6IFwiJHtwZXJzb24ubmFtZX1cIn1dXHJcblx0XHR9XHJcblx0XVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcblx0Ly8ga2subz0wO1xyXG5cdHZhciBkbGc6IGFueSA9IHsgcmVwb3J0ZGVzaWduIH07XHJcblx0ZGxnLnJlcG9ydGRlc2lnbi5kYXRhPVt7bmFtZTpcIk1heFwifSx7bmFtZTpcIk1vcml0elwifV1cclxuXHRyZXR1cm4gZGxnO1xyXG59XHJcbiJdfQ==