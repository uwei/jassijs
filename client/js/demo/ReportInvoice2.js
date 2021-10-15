var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportInvoice = void 0;
    var reportdesign = {
        content: [
            {
                columns: [
                    [
                        "${invoice.customer.firstname} ${invoice.customer.lastname}",
                        "${invoice.customer.street}",
                        "${invoice.customer.place}"
                    ],
                    [
                        { fontSize: 18, text: "Invoice" },
                        "\n",
                        {
                            table: {
                                widths: ["auto", 100],
                                body: [
                                    [
                                        "Date:",
                                        {
                                            text: "${invoice.date}",
                                            format: "YYYY-MM-DD"
                                        }
                                    ],
                                    ["Number:", "${invoice.number}"]
                                ]
                            },
                            layout: "noBorders"
                        },
                        "",
                        "",
                        "\n"
                    ]
                ]
            },
            {
                datatable: {
                    header: ["Item", "Price"],
                    dataforeach: "line in invoice.lines",
                    body: [
                        "${line.text}",
                        {
                            bold: false,
                            text: "${line.price}",
                            format: "#.##0,00"
                        }
                    ]
                }
            },
            "\n",
            {
                foreach: "summ in invoice.summary",
                columns: ["${summ.text}", "${summ.value}"]
            }
        ]
    };
    let ReportInvoice = class ReportInvoice {
        constructor() {
            this.reportdesign = reportdesign;
        }
        get title() {
            return "Invoicreport";
        }
    };
    ReportInvoice = __decorate([
        Jassi_1.$Class("demo.ReportInvoice"),
        __metadata("design:paramtypes", [])
    ], ReportInvoice);
    exports.ReportInvoice = ReportInvoice;
    async function test() {
        // kk.o=0;
        var dlg = new ReportInvoice();
        dlg.parameter = { date: "21.05.2022" };
        dlg.value = {
            invoice: {
                number: 1000,
                date: new Date(),
                customer: {
                    firstname: "Henry",
                    lastname: "Klaus",
                    street: "Hauptstr. 157",
                    place: "chemnitz",
                },
                lines: [
                    { pos: 1, text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg", price: 10.00, amount: 50, variante: [{ m: 1 }, { m: 2 }] },
                    { pos: 2, text: "this is the next position", price: 20.50, },
                    { pos: 3, text: "this is an other position", price: 19.50 },
                    { pos: 4, text: "this is the last position", price: 50.00 },
                ],
                summary: [
                    { text: "Subtotal", value: 100.00 },
                    { text: "Tax", value: 19.00 },
                    { text: "Subtotal", value: 119.00 },
                ]
            }
        };
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0SW52b2ljZTIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9kZW1vL1JlcG9ydEludm9pY2UyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFRQSxJQUFJLFlBQVksR0FBRztRQUNsQixPQUFPLEVBQUU7WUFDUjtnQkFDQyxPQUFPLEVBQUU7b0JBQ1I7d0JBQ0MsNERBQTREO3dCQUM1RCw0QkFBNEI7d0JBQzVCLDJCQUEyQjtxQkFDM0I7b0JBQ0Q7d0JBQ0MsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUM7d0JBQzlCLElBQUk7d0JBQ0o7NEJBQ0MsS0FBSyxFQUFFO2dDQUNOLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBQyxHQUFHLENBQUM7Z0NBQ3BCLElBQUksRUFBRTtvQ0FDTDt3Q0FDQyxPQUFPO3dDQUNQOzRDQUNDLElBQUksRUFBRSxpQkFBaUI7NENBQ3ZCLE1BQU0sRUFBRSxZQUFZO3lDQUNwQjtxQ0FDRDtvQ0FDRCxDQUFDLFNBQVMsRUFBQyxtQkFBbUIsQ0FBQztpQ0FDL0I7NkJBQ0Q7NEJBQ0QsTUFBTSxFQUFFLFdBQVc7eUJBQ25CO3dCQUNELEVBQUU7d0JBQ0YsRUFBRTt3QkFDRixJQUFJO3FCQUNKO2lCQUNEO2FBQ0Q7WUFDRDtnQkFDQyxTQUFTLEVBQUU7b0JBQ1YsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFDLE9BQU8sQ0FBQztvQkFDeEIsV0FBVyxFQUFFLHVCQUF1QjtvQkFDcEMsSUFBSSxFQUFFO3dCQUNMLGNBQWM7d0JBQ2Q7NEJBQ0MsSUFBSSxFQUFFLEtBQUs7NEJBQ1gsSUFBSSxFQUFFLGVBQWU7NEJBQ3JCLE1BQU0sRUFBRSxVQUFVO3lCQUNsQjtxQkFDRDtpQkFDRDthQUNEO1lBQ0QsSUFBSTtZQUNKO2dCQUNDLE9BQU8sRUFBRSx5QkFBeUI7Z0JBQ2xDLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBQyxlQUFlLENBQUM7YUFDekM7U0FDRDtLQUNELENBQUM7SUFJRixJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO1FBSXRCO1lBSEEsaUJBQVksR0FBRyxZQUFZLENBQUM7UUFLNUIsQ0FBQztRQUNELElBQUksS0FBSztZQUNMLE9BQU8sY0FBYyxDQUFDO1FBQzFCLENBQUM7S0FFSixDQUFBO0lBWFksYUFBYTtRQUR6QixjQUFNLENBQUMsb0JBQW9CLENBQUM7O09BQ2hCLGFBQWEsQ0FXekI7SUFYWSxzQ0FBYTtJQVluQixLQUFLLFVBQVUsSUFBSTtRQUN0QixVQUFVO1FBQ1YsSUFBSSxHQUFHLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNqQyxHQUFHLENBQUMsU0FBUyxHQUFDLEVBQUMsSUFBSSxFQUFDLFlBQVksRUFBQyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxLQUFLLEdBQUc7WUFDUixPQUFPLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLElBQUk7Z0JBQ1osSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFO2dCQUNoQixRQUFRLEVBQUU7b0JBQ04sU0FBUyxFQUFFLE9BQU87b0JBQ2xCLFFBQVEsRUFBRSxPQUFPO29CQUNqQixNQUFNLEVBQUUsZUFBZTtvQkFDdkIsS0FBSyxFQUFFLFVBQVU7aUJBQ3BCO2dCQUNELEtBQUssRUFBRTtvQkFDSCxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLHlGQUF5RixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUNySyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLDJCQUEyQixFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUc7b0JBQzVELEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtvQkFDM0QsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO2lCQUM5RDtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7b0JBQ25DLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO29CQUM3QixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtpQkFDdEM7YUFDSjtTQUNKLENBQUM7UUFDRixnRkFBZ0Y7UUFDaEYsNENBQTRDO1FBQzVDLDRDQUE0QztRQUM1QyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUEvQkQsb0JBK0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xyXG5pbXBvcnQgamFzc2kgZnJvbSBcImphc3NpanMvamFzc2lcIjtcclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcbmltcG9ydCB7ICRVSUNvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBLdW5kZSB9IGZyb20gXCJkZS9yZW1vdGUvS3VuZGVcIjtcclxuaW1wb3J0IHsgUlRleHQgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUlRleHRcIjtcclxuXHJcbnZhciByZXBvcnRkZXNpZ24gPSB7XHJcblx0Y29udGVudDogW1xyXG5cdFx0e1xyXG5cdFx0XHRjb2x1bW5zOiBbXHJcblx0XHRcdFx0W1xyXG5cdFx0XHRcdFx0XCIke2ludm9pY2UuY3VzdG9tZXIuZmlyc3RuYW1lfSAke2ludm9pY2UuY3VzdG9tZXIubGFzdG5hbWV9XCIsXHJcblx0XHRcdFx0XHRcIiR7aW52b2ljZS5jdXN0b21lci5zdHJlZXR9XCIsXHJcblx0XHRcdFx0XHRcIiR7aW52b2ljZS5jdXN0b21lci5wbGFjZX1cIlxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0W1xyXG5cdFx0XHRcdFx0e2ZvbnRTaXplOiAxOCx0ZXh0OiBcIkludm9pY2VcIn0sXHJcblx0XHRcdFx0XHRcIlxcblwiLFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0YWJsZToge1xyXG5cdFx0XHRcdFx0XHRcdHdpZHRoczogW1wiYXV0b1wiLDEwMF0sXHJcblx0XHRcdFx0XHRcdFx0Ym9keTogW1xyXG5cdFx0XHRcdFx0XHRcdFx0W1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcIkRhdGU6XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0ZXh0OiBcIiR7aW52b2ljZS5kYXRlfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvcm1hdDogXCJZWVlZLU1NLUREXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0XHRcdFtcIk51bWJlcjpcIixcIiR7aW52b2ljZS5udW1iZXJ9XCJdXHJcblx0XHRcdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRsYXlvdXQ6IFwibm9Cb3JkZXJzXCJcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcIlwiLFxyXG5cdFx0XHRcdFx0XCJcIixcclxuXHRcdFx0XHRcdFwiXFxuXCJcclxuXHRcdFx0XHRdXHJcblx0XHRcdF1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGRhdGF0YWJsZToge1xyXG5cdFx0XHRcdGhlYWRlcjogW1wiSXRlbVwiLFwiUHJpY2VcIl0sXHJcblx0XHRcdFx0ZGF0YWZvcmVhY2g6IFwibGluZSBpbiBpbnZvaWNlLmxpbmVzXCIsXHJcblx0XHRcdFx0Ym9keTogW1xyXG5cdFx0XHRcdFx0XCIke2xpbmUudGV4dH1cIixcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0Ym9sZDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdHRleHQ6IFwiJHtsaW5lLnByaWNlfVwiLFxyXG5cdFx0XHRcdFx0XHRmb3JtYXQ6IFwiIy4jIzAsMDBcIlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFwiXFxuXCIsXHJcblx0XHR7XHJcblx0XHRcdGZvcmVhY2g6IFwic3VtbSBpbiBpbnZvaWNlLnN1bW1hcnlcIixcclxuXHRcdFx0Y29sdW1uczogW1wiJHtzdW1tLnRleHR9XCIsXCIke3N1bW0udmFsdWV9XCJdXHJcblx0XHR9XHJcblx0XVxyXG59O1xyXG5cclxuXHJcbkAkQ2xhc3MoXCJkZW1vLlJlcG9ydEludm9pY2VcIilcclxuZXhwb3J0IGNsYXNzIFJlcG9ydEludm9pY2Uge1xyXG4gICAgcmVwb3J0ZGVzaWduID0gcmVwb3J0ZGVzaWduO1xyXG5cdHBhcmFtZXRlcjtcclxuICAgIHZhbHVlO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG4gICAgZ2V0IHRpdGxlKCkge1xyXG4gICAgICAgIHJldHVybiBcIkludm9pY3JlcG9ydFwiO1xyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIC8vIGtrLm89MDtcclxuICAgIHZhciBkbGcgPSBuZXcgUmVwb3J0SW52b2ljZSgpO1xyXG5cdGRsZy5wYXJhbWV0ZXI9e2RhdGU6XCIyMS4wNS4yMDIyXCJ9O1xyXG4gICAgZGxnLnZhbHVlID0ge1xyXG4gICAgICAgIGludm9pY2U6IHtcclxuICAgICAgICAgICAgbnVtYmVyOiAxMDAwLFxyXG4gICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICBjdXN0b21lcjoge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RuYW1lOiBcIkhlbnJ5XCIsXHJcbiAgICAgICAgICAgICAgICBsYXN0bmFtZTogXCJLbGF1c1wiLFxyXG4gICAgICAgICAgICAgICAgc3RyZWV0OiBcIkhhdXB0c3RyLiAxNTdcIixcclxuICAgICAgICAgICAgICAgIHBsYWNlOiBcImNoZW1uaXR6XCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICAgICB7IHBvczogMSwgdGV4dDogXCJ0aGlzIGlzIHRoZSBmaXJzdCBwb3NpdGlvbiwgbGtzamRmbGdzZCBlciB3ZSB3ZXIgd3JlIGVyIGVyIGVyIHJlIHdla2ZnanNsa2RmampkayBzZ2ZzZGdcIiwgcHJpY2U6IDEwLjAwLCBhbW91bnQ6IDUwLCB2YXJpYW50ZTogW3sgbTogMSB9LCB7IG06IDIgfV0gfSxcclxuICAgICAgICAgICAgICAgIHsgcG9zOiAyLCB0ZXh0OiBcInRoaXMgaXMgdGhlIG5leHQgcG9zaXRpb25cIiwgcHJpY2U6IDIwLjUwLCB9LFxyXG4gICAgICAgICAgICAgICAgeyBwb3M6IDMsIHRleHQ6IFwidGhpcyBpcyBhbiBvdGhlciBwb3NpdGlvblwiLCBwcmljZTogMTkuNTAgfSxcclxuICAgICAgICAgICAgICAgIHsgcG9zOiA0LCB0ZXh0OiBcInRoaXMgaXMgdGhlIGxhc3QgcG9zaXRpb25cIiwgcHJpY2U6IDUwLjAwIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHN1bW1hcnk6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJTdWJ0b3RhbFwiLCB2YWx1ZTogMTAwLjAwIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiVGF4XCIsIHZhbHVlOiAxOS4wMCB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIlN1YnRvdGFsXCIsIHZhbHVlOiAxMTkuMDAgfSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyAgdGhpcy5kZXNpZ24gPSB7XCJjb250ZW50XCI6e1wic3RhY2tcIjpbe1widGV4dFwiOlwiSGFsbG9zb1wifSx7XCJ0ZXh0XCI6XCJzZHNmc2RmXCJ9XX19O1xyXG4gICAgLy9cdGRsZy52YWx1ZT1qYXNzaWpzLmRiLmxvYWQoXCJkZS5LdW5kZVwiLDkpO1x0XHJcbiAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGRsZy50b0pTT04oKSkpO1xyXG4gICAgcmV0dXJuIGRsZztcclxufVxyXG4iXX0=