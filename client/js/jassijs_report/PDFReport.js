var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/ext/pdfmake", "jassijs_report/PDFViewer", "jassijs_report/remote/pdfmakejassi"], function (require, exports, Jassi_1, pdfmake_1, PDFViewer_1, pdfmakejassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.PDFReport = void 0;
    let PDFReport = class PDFReport {
        constructor() {
            // @member {object} - the generated report
            this.report = null;
        }
        layout() {
            //var me = this.me = {};
        }
        fill() {
            var def = (0, pdfmakejassi_1.createReportDefinition)(this.value, this.data, this.parameter);
            registerFonts(this.value);
            this.report = pdfmake_1.default.createPdf(def);
        }
        open() {
            this.report.open();
        }
        download() {
            this.report.download();
        }
        print() {
            this.report.print();
        }
        async getBase64() {
            var _this = this;
            return await this.report.getBase64();
            /*return new Promise(
                function (resolve, reject) {
                    _this.report.getBase64(function (data) {
                        resolve(data);
    
                    });
                });*/
        }
        ;
    };
    PDFReport = __decorate([
        (0, Jassi_1.$Class)("jassijs_report.PDFReport"),
        __metadata("design:paramtypes", [])
    ], PDFReport);
    exports.PDFReport = PDFReport;
    //var available = ["Alegreya",    "AlegreyaSans",    "AlegreyaSansSC",    "AlegreyaSC",    "AlmendraSC",    "Amaranth",    "Andada",    "AndadaSC",    "AnonymousPro",    "ArchivoNarrow",    "Arvo",    "Asap",    "AveriaLibre",    "AveriaSansLibre",    "AveriaSerifLibre",    "Cambay",    "Caudex",    "CrimsonText",    "Cuprum",    "Economica",    "Exo2",    "Exo",    "ExpletusSans",    "FiraSans",    "JosefinSans",    "JosefinSlab",    "Karla",    "Lato",    "LobsterTwo",    "Lora",    "Marvel",    "Merriweather",    "MerriweatherSans",    "Nobile",    "NoticiaText",    "Overlock",    "Philosopher",    "PlayfairDisplay",    "PlayfairDisplaySC",    "PT_Serif-Web",    "Puritan",    "Quantico",    "QuattrocentoSans",    "Quicksand",    "Rambla",    "Rosario",    "Sansation",    "Sarabun",    "Scada",    "Share",    "Sitara",    "SourceSansPro",    "TitilliumWeb",    "Volkhov",    "Vollkorn"];
    function registerFonts(data) {
        var fonts = [];
        var base = "https://cdn.jsdelivr.net/gh/xErik/pdfmake-fonts-google@master/lib/ofl"; //abeezee/ABeeZee-Italic.ttf
        JSON.stringify(data, (key, value) => {
            if (key === "font" && value !== "") {
                fonts.push(value);
            }
            return value;
        });
        if (!pdfmake_1.default.fonts) {
            pdfmake_1.default.fonts = {
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                }
            };
        }
        fonts.forEach((font) => {
            if (font !== "Roboto") {
                pdfmake_1.default.fonts[font] = {};
                pdfmake_1.default.fonts[font].normal = base + "/" + font.toLowerCase() + "/" + font + "-Regular.ttf";
                pdfmake_1.default.fonts[font].bold = base + "/" + font.toLowerCase() + "/" + font + "-Bold.ttf";
                pdfmake_1.default.fonts[font].italics = base + "/" + font.toLowerCase() + "/" + font + "-Italic.ttf";
                pdfmake_1.default.fonts[font].bolditalics = base + "/" + font.toLowerCase() + "/" + font + "-BoldItalic.ttf";
            }
        });
    }
    async function test() {
        var rep = new PDFReport();
        rep.data = {
            invoice: {
                number: 1000,
                date: "20.07.2018",
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
        rep.value = {
            content: {
                stack: [{
                        //font: "ExpletusSans",
                        columns: [
                            {
                                stack: [
                                    '${invoice.customer.firstname} ${invoice.customer.lastname}',
                                    '${invoice.customer.street}',
                                    '${invoice.customer.place}'
                                ]
                            },
                            {
                                stack: [
                                    { text: 'Invoice', fontSize: 18 },
                                    " ",
                                    "Date: ${invoice.date}",
                                    { text: "Number: ${invoice.number}", bold: true },
                                    " ",
                                    " ",
                                ]
                            }
                        ]
                    }, {
                        table: {
                            body: [
                                ['Item', 'Price'],
                                {
                                    foreach: "line in invoice.lines",
                                    do: [
                                        '${line.text}', '${line.price}'
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        datatable: {
                            header: [{ text: "Item" }, { text: "Price" }],
                            dataforeach: "line in invoice.lines",
                            //footer:[{ text:"Total"},{ text:""}],
                            body: ['${line.text}', '${line.price}'],
                            groups: [
                                {
                                    field: "line",
                                    header: [],
                                    footer: []
                                }
                            ]
                        }
                    },
                    " ",
                    {
                        foreach: "sum in invoice.summary",
                        columns: [
                            "${sum.text}",
                            "${sum.value}",
                        ]
                    },
                ]
            }
        };
        rep.fill();
        var viewer = new PDFViewer_1.PDFViewer();
        viewer.value = await rep.getBase64();
        viewer.height = 300;
        return viewer;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUERGUmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvUERGUmVwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFZQSxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFTO1FBUWxCO1lBQ0ksMENBQTBDO1lBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxNQUFNO1lBQ0Ysd0JBQXdCO1FBRTVCLENBQUM7UUFDRCxJQUFJO1lBQ0EsSUFBSSxHQUFHLEdBQUcsSUFBQSxxQ0FBc0IsRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ3ZFLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxpQkFBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBR0QsSUFBSTtZQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELFFBQVE7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFDRCxLQUFLO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBRUQsS0FBSyxDQUFDLFNBQVM7WUFDWCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsT0FBTyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDckM7Ozs7OztxQkFNUztRQUViLENBQUM7UUFBQSxDQUFDO0tBRUwsQ0FBQTtJQS9DWSxTQUFTO1FBRHJCLElBQUEsY0FBTSxFQUFDLDBCQUEwQixDQUFDOztPQUN0QixTQUFTLENBK0NyQjtJQS9DWSw4QkFBUztJ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NEJBQzdDLFdBQVcsRUFBRSx1QkFBdUI7NEJBQ3BDLHNDQUFzQzs0QkFDdEMsSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQzs0QkFDdkMsTUFBTSxFQUFFO2dDQUNKO29DQUNJLEtBQUssRUFBRSxNQUFNO29DQUNiLE1BQU0sRUFBRSxFQUFFO29DQUNWLE1BQU0sRUFBRSxFQUFFO2lDQUNiOzZCQUNKO3lCQUVKO3FCQUNKO29CQUNBLEdBQUc7b0JBQ0o7d0JBQ0ksT0FBTyxFQUFFLHdCQUF3Qjt3QkFDakMsT0FBTyxFQUFFOzRCQUNKLGFBQWE7NEJBQ2QsY0FBYzt5QkFDakI7cUJBRUo7aUJBQ0E7YUFDSjtTQUNKLENBQUM7UUFDRixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxJQUFJLE1BQU0sR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQUM3QixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUEvRkQsb0JBK0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG4vL0B0cy1pZ25vcmVcbmltcG9ydCBwZGZNYWtlIGZyb20gXCJqYXNzaWpzX3JlcG9ydC9leHQvcGRmbWFrZVwiO1xuaW1wb3J0IHsgUERGVmlld2VyIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1BERlZpZXdlclwiO1xuaW1wb3J0IHsgVG9vbHMgfSBmcm9tIFwiamFzc2lqcy91dGlsL1Rvb2xzXCI7XG5cbi8vQHRzLWlnbm9yZTtcbmltcG9ydCB7Y3JlYXRlUmVwb3J0RGVmaW5pdGlvbn0gZnJvbSBcImphc3NpanNfcmVwb3J0L3JlbW90ZS9wZGZtYWtlamFzc2lcIjtcblxuXG5cbkAkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5QREZSZXBvcnRcIilcbmV4cG9ydCBjbGFzcyBQREZSZXBvcnQge1xuICAgIHJlcG9ydDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IC0gcmVwb3J0IGRlZmluaXRpb25cbiAgICAgKi9cbiAgICB2YWx1ZTtcbiAgICBkYXRhO1xuICAgIHBhcmFtZXRlcjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gQG1lbWJlciB7b2JqZWN0fSAtIHRoZSBnZW5lcmF0ZWQgcmVwb3J0XG4gICAgICAgIHRoaXMucmVwb3J0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBsYXlvdXQoKSB7XG4gICAgICAgIC8vdmFyIG1lID0gdGhpcy5tZSA9IHt9O1xuXG4gICAgfVxuICAgIGZpbGwoKSB7XG4gICAgICAgIHZhciBkZWYgPSBjcmVhdGVSZXBvcnREZWZpbml0aW9uKHRoaXMudmFsdWUsIHRoaXMuZGF0YSwgdGhpcy5wYXJhbWV0ZXIpXG4gICAgICAgIHJlZ2lzdGVyRm9udHModGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMucmVwb3J0ID0gcGRmTWFrZS5jcmVhdGVQZGYoZGVmKTtcbiAgICB9XG5cblxuICAgIG9wZW4oKSB7XG4gICAgICAgIHRoaXMucmVwb3J0Lm9wZW4oKTtcbiAgICB9XG4gICAgZG93bmxvYWQoKSB7XG4gICAgICAgIHRoaXMucmVwb3J0LmRvd25sb2FkKCk7XG4gICAgfVxuICAgIHByaW50KCkge1xuICAgICAgICB0aGlzLnJlcG9ydC5wcmludCgpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEJhc2U2NCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVwb3J0LmdldEJhc2U2NCgpO1xuICAgICAgICAvKnJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZXBvcnQuZ2V0QmFzZTY0KGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyovXG5cbiAgICB9O1xuXG59XG4vL3ZhciBhdmFpbGFibGUgPSBbXCJBbGVncmV5YVwiLCAgICBcIkFsZWdyZXlhU2Fuc1wiLCAgICBcIkFsZWdyZXlhU2Fuc1NDXCIsICAgIFwiQWxlZ3JleWFTQ1wiLCAgICBcIkFsbWVuZHJhU0NcIiwgICAgXCJBbWFyYW50aFwiLCAgICBcIkFuZGFkYVwiLCAgICBcIkFuZGFkYVNDXCIsICAgIFwiQW5vbnltb3VzUHJvXCIsICAgIFwiQXJjaGl2b05hcnJvd1wiLCAgICBcIkFydm9cIiwgICAgXCJBc2FwXCIsICAgIFwiQXZlcmlhTGlicmVcIiwgICAgXCJBdmVyaWFTYW5zTGlicmVcIiwgICAgXCJBdmVyaWFTZXJpZkxpYnJlXCIsICAgIFwiQ2FtYmF5XCIsICAgIFwiQ2F1ZGV4XCIsICAgIFwiQ3JpbXNvblRleHRcIiwgICAgXCJDdXBydW1cIiwgICAgXCJFY29ub21pY2FcIiwgICAgXCJFeG8yXCIsICAgIFwiRXhvXCIsICAgIFwiRXhwbGV0dXNTYW5zXCIsICAgIFwiRmlyYVNhbnNcIiwgICAgXCJKb3NlZmluU2Fuc1wiLCAgICBcIkpvc2VmaW5TbGFiXCIsICAgIFwiS2FybGFcIiwgICAgXCJMYXRvXCIsICAgIFwiTG9ic3RlclR3b1wiLCAgICBcIkxvcmFcIiwgICAgXCJNYXJ2ZWxcIiwgICAgXCJNZXJyaXdlYXRoZXJcIiwgICAgXCJNZXJyaXdlYXRoZXJTYW5zXCIsICAgIFwiTm9iaWxlXCIsICAgIFwiTm90aWNpYVRleHRcIiwgICAgXCJPdmVybG9ja1wiLCAgICBcIlBoaWxvc29waGVyXCIsICAgIFwiUGxheWZhaXJEaXNwbGF5XCIsICAgIFwiUGxheWZhaXJEaXNwbGF5U0NcIiwgICAgXCJQVF9TZXJpZi1XZWJcIiwgICAgXCJQdXJpdGFuXCIsICAgIFwiUXVhbnRpY29cIiwgICAgXCJRdWF0dHJvY2VudG9TYW5zXCIsICAgIFwiUXVpY2tzYW5kXCIsICAgIFwiUmFtYmxhXCIsICAgIFwiUm9zYXJpb1wiLCAgICBcIlNhbnNhdGlvblwiLCAgICBcIlNhcmFidW5cIiwgICAgXCJTY2FkYVwiLCAgICBcIlNoYXJlXCIsICAgIFwiU2l0YXJhXCIsICAgIFwiU291cmNlU2Fuc1Byb1wiLCAgICBcIlRpdGlsbGl1bVdlYlwiLCAgICBcIlZvbGtob3ZcIiwgICAgXCJWb2xsa29yblwiXTtcbmZ1bmN0aW9uIHJlZ2lzdGVyRm9udHMoZGF0YSkge1xuICAgIHZhciBmb250cyA9IFtdO1xuICAgIHZhciBiYXNlID0gXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvZ2gveEVyaWsvcGRmbWFrZS1mb250cy1nb29nbGVAbWFzdGVyL2xpYi9vZmxcIi8vYWJlZXplZS9BQmVlWmVlLUl0YWxpYy50dGZcblxuICAgIEpTT04uc3RyaW5naWZ5KGRhdGEsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09IFwiZm9udFwiICYmIHZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBmb250cy5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSk7XG4gICAgaWYgKCFwZGZNYWtlLmZvbnRzKSB7XG4gICAgICAgIHBkZk1ha2UuZm9udHMgPSB7XG4gICAgICAgICAgICBSb2JvdG86IHtcbiAgICAgICAgICAgICAgICBub3JtYWw6ICdSb2JvdG8tUmVndWxhci50dGYnLFxuICAgICAgICAgICAgICAgIGJvbGQ6ICdSb2JvdG8tTWVkaXVtLnR0ZicsXG4gICAgICAgICAgICAgICAgaXRhbGljczogJ1JvYm90by1JdGFsaWMudHRmJyxcbiAgICAgICAgICAgICAgICBib2xkaXRhbGljczogJ1JvYm90by1NZWRpdW1JdGFsaWMudHRmJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmb250cy5mb3JFYWNoKChmb250OiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGZvbnQgIT09IFwiUm9ib3RvXCIpIHtcbiAgICAgICAgICAgIHBkZk1ha2UuZm9udHNbZm9udF0gPSB7fTtcbiAgICAgICAgICAgIHBkZk1ha2UuZm9udHNbZm9udF0ubm9ybWFsID0gYmFzZSArIFwiL1wiICsgZm9udC50b0xvd2VyQ2FzZSgpICsgXCIvXCIgKyBmb250ICsgXCItUmVndWxhci50dGZcIjtcbiAgICAgICAgICAgIHBkZk1ha2UuZm9udHNbZm9udF0uYm9sZCA9IGJhc2UgKyBcIi9cIiArIGZvbnQudG9Mb3dlckNhc2UoKSArIFwiL1wiICsgZm9udCArIFwiLUJvbGQudHRmXCI7XG4gICAgICAgICAgICBwZGZNYWtlLmZvbnRzW2ZvbnRdLml0YWxpY3MgPSBiYXNlICsgXCIvXCIgKyBmb250LnRvTG93ZXJDYXNlKCkgKyBcIi9cIiArIGZvbnQgKyBcIi1JdGFsaWMudHRmXCI7XG4gICAgICAgICAgICBwZGZNYWtlLmZvbnRzW2ZvbnRdLmJvbGRpdGFsaWNzID0gYmFzZSArIFwiL1wiICsgZm9udC50b0xvd2VyQ2FzZSgpICsgXCIvXCIgKyBmb250ICsgXCItQm9sZEl0YWxpYy50dGZcIjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciByZXAgPSBuZXcgUERGUmVwb3J0KCk7XG4gICAgcmVwLmRhdGEgPSB7XG4gICAgICAgIGludm9pY2U6IHtcbiAgICAgICAgICAgIG51bWJlcjogMTAwMCxcbiAgICAgICAgICAgIGRhdGU6IFwiMjAuMDcuMjAxOFwiLFxuICAgICAgICAgICAgY3VzdG9tZXI6IHtcbiAgICAgICAgICAgICAgICBmaXJzdG5hbWU6IFwiSGVucnlcIixcbiAgICAgICAgICAgICAgICBsYXN0bmFtZTogXCJLbGF1c1wiLFxuICAgICAgICAgICAgICAgIHN0cmVldDogXCJIYXVwdHN0ci4gMTU3XCIsXG4gICAgICAgICAgICAgICAgcGxhY2U6IFwiY2hlbW5pdHpcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgIHsgcG9zOiAxLCB0ZXh0OiBcInRoaXMgaXMgdGhlIGZpcnN0IHBvc2l0aW9uLCBsa3NqZGZsZ3NkIGVyIHdlIHdlciB3cmUgZXIgZXIgZXIgcmUgd2VrZmdqc2xrZGZqamRrIHNnZnNkZ1wiLCBwcmljZTogMTAuMDAsIGFtb3VudDogNTAsIHZhcmlhbnRlOiBbeyBtOiAxIH0sIHsgbTogMiB9XSB9LFxuICAgICAgICAgICAgICAgIHsgcG9zOiAyLCB0ZXh0OiBcInRoaXMgaXMgdGhlIG5leHQgcG9zaXRpb25cIiwgcHJpY2U6IDIwLjUwLCB9LFxuICAgICAgICAgICAgICAgIHsgcG9zOiAzLCB0ZXh0OiBcInRoaXMgaXMgYW4gb3RoZXIgcG9zaXRpb25cIiwgcHJpY2U6IDE5LjUwIH0sXG4gICAgICAgICAgICAgICAgeyBwb3M6IDQsIHRleHQ6IFwidGhpcyBpcyB0aGUgbGFzdCBwb3NpdGlvblwiLCBwcmljZTogNTAuMDAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdW1tYXJ5OiBbXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIlN1YnRvdGFsXCIsIHZhbHVlOiAxMDAuMDAgfSxcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiVGF4XCIsIHZhbHVlOiAxOS4wMCB9LFxuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJTdWJ0b3RhbFwiLCB2YWx1ZTogMTE5LjAwIH0sXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJlcC52YWx1ZSA9IHtcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgc3RhY2s6IFt7XG4gICAgICAgICAgICAgICAgLy9mb250OiBcIkV4cGxldHVzU2Fuc1wiLFxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFjazogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcke2ludm9pY2UuY3VzdG9tZXIuZmlyc3RuYW1lfSAke2ludm9pY2UuY3VzdG9tZXIubGFzdG5hbWV9JyAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyR7aW52b2ljZS5jdXN0b21lci5zdHJlZXR9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJHtpbnZvaWNlLmN1c3RvbWVyLnBsYWNlfScgXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnSW52b2ljZScsIGZvbnRTaXplOiAxOCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIiAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEYXRlOiAke2ludm9pY2UuZGF0ZX1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiTnVtYmVyOiAke2ludm9pY2UubnVtYmVyfVwiLCBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiICxcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB0YWJsZToge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbJ0l0ZW0nLCAnUHJpY2UnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoOiBcImxpbmUgaW4gaW52b2ljZS5saW5lc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcke2xpbmUudGV4dH0nLCAnJHtsaW5lLnByaWNlfSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRhdGF0YWJsZToge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IFt7IHRleHQ6IFwiSXRlbVwiIH0sIHsgdGV4dDogXCJQcmljZVwiIH1dLFxuICAgICAgICAgICAgICAgICAgICBkYXRhZm9yZWFjaDogXCJsaW5lIGluIGludm9pY2UubGluZXNcIixcbiAgICAgICAgICAgICAgICAgICAgLy9mb290ZXI6W3sgdGV4dDpcIlRvdGFsXCJ9LHsgdGV4dDpcIlwifV0sXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IFsnJHtsaW5lLnRleHR9JywgJyR7bGluZS5wcmljZX0nXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IFwibGluZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcjogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9vdGVyOiBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgIFwiIFwiICxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3JlYWNoOiBcInN1bSBpbiBpbnZvaWNlLnN1bW1hcnlcIixcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiBbXG4gICAgICAgICAgICAgICAgICAgICBcIiR7c3VtLnRleHR9XCIgLFxuICAgICAgICAgICAgICAgICAgICBcIiR7c3VtLnZhbHVlfVwiICxcbiAgICAgICAgICAgICAgICBdXG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJlcC5maWxsKCk7XG4gICAgdmFyIHZpZXdlciA9IG5ldyBQREZWaWV3ZXIoKTtcbiAgICB2aWV3ZXIudmFsdWUgPSBhd2FpdCByZXAuZ2V0QmFzZTY0KCk7XG4gICAgdmlld2VyLmhlaWdodCA9IDMwMDtcbiAgICByZXR1cm4gdmlld2VyO1xufVxuXG5cbiJdfQ==