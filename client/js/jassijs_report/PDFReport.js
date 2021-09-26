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
            var def = pdfmakejassi_1.createReportDefinition(this.value, this.data, this.parameter);
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
            return new Promise(function (resolve, reject) {
                _this.report.getBase64(function (data) {
                    resolve(data);
                });
            });
        }
        ;
    };
    PDFReport = __decorate([
        Jassi_1.$Class("jassijs_report.PDFReport"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUERGUmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvUERGUmVwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFZQSxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFTO1FBUWxCO1lBQ0ksMENBQTBDO1lBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxNQUFNO1lBQ0Ysd0JBQXdCO1FBRTVCLENBQUM7UUFDRCxJQUFJO1lBQ0EsSUFBSSxHQUFHLEdBQUcscUNBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUN2RSxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUdELElBQUk7WUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxRQUFRO1lBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQixDQUFDO1FBQ0QsS0FBSztZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEIsQ0FBQztRQUVELEtBQUssQ0FBQyxTQUFTO1lBQ1gsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLE9BQU8sSUFBSSxPQUFPLENBQ2QsVUFBVSxPQUFPLEVBQUUsTUFBTTtnQkFDckIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxJQUFJO29CQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWxCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFWCxDQUFDO1FB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QVMsRUFBRTs0QkFDUCxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQzs0QkFDN0MsV0FBVyxFQUFFLHVCQUF1Qjs0QkFDcEMsc0NBQXNDOzRCQUN0QyxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDOzRCQUN2QyxNQUFNLEVBQUU7Z0NBQ0o7b0NBQ0ksS0FBSyxFQUFFLE1BQU07b0NBQ2IsTUFBTSxFQUFFLEVBQUU7b0NBQ1YsTUFBTSxFQUFFLEVBQUU7aUNBQ2I7NkJBQ0o7eUJBRUo7cUJBQ0o7b0JBQ0EsR0FBRztvQkFDSjt3QkFDSSxPQUFPLEVBQUUsd0JBQXdCO3dCQUNqQyxPQUFPLEVBQUU7NEJBQ0osYUFBYTs0QkFDZCxjQUFjO3lCQUNqQjtxQkFFSjtpQkFDQTthQUNKO1NBQ0osQ0FBQztRQUNGLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLElBQUksTUFBTSxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDcEIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQS9GRCxvQkErRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbi8vQHRzLWlnbm9yZVxuaW1wb3J0IHBkZk1ha2UgZnJvbSBcImphc3NpanNfcmVwb3J0L2V4dC9wZGZtYWtlXCI7XG5pbXBvcnQgeyBQREZWaWV3ZXIgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUERGVmlld2VyXCI7XG5pbXBvcnQgeyBUb29scyB9IGZyb20gXCJqYXNzaWpzL3V0aWwvVG9vbHNcIjtcblxuLy9AdHMtaWdub3JlO1xuaW1wb3J0IHtjcmVhdGVSZXBvcnREZWZpbml0aW9ufSBmcm9tIFwiamFzc2lqc19yZXBvcnQvcmVtb3RlL3BkZm1ha2VqYXNzaVwiO1xuXG5cblxuQCRDbGFzcyhcImphc3NpanNfcmVwb3J0LlBERlJlcG9ydFwiKVxuZXhwb3J0IGNsYXNzIFBERlJlcG9ydCB7XG4gICAgcmVwb3J0O1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge29iamVjdH0gLSByZXBvcnQgZGVmaW5pdGlvblxuICAgICAqL1xuICAgIHZhbHVlO1xuICAgIGRhdGE7XG4gICAgcGFyYW1ldGVyO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyBAbWVtYmVyIHtvYmplY3R9IC0gdGhlIGdlbmVyYXRlZCByZXBvcnRcbiAgICAgICAgdGhpcy5yZXBvcnQgPSBudWxsO1xuICAgIH1cblxuICAgIGxheW91dCgpIHtcbiAgICAgICAgLy92YXIgbWUgPSB0aGlzLm1lID0ge307XG5cbiAgICB9XG4gICAgZmlsbCgpIHtcbiAgICAgICAgdmFyIGRlZiA9IGNyZWF0ZVJlcG9ydERlZmluaXRpb24odGhpcy52YWx1ZSwgdGhpcy5kYXRhLCB0aGlzLnBhcmFtZXRlcilcbiAgICAgICAgcmVnaXN0ZXJGb250cyh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy5yZXBvcnQgPSBwZGZNYWtlLmNyZWF0ZVBkZihkZWYpO1xuICAgIH1cblxuXG4gICAgb3BlbigpIHtcbiAgICAgICAgdGhpcy5yZXBvcnQub3BlbigpO1xuICAgIH1cbiAgICBkb3dubG9hZCgpIHtcbiAgICAgICAgdGhpcy5yZXBvcnQuZG93bmxvYWQoKTtcbiAgICB9XG4gICAgcHJpbnQoKSB7XG4gICAgICAgIHRoaXMucmVwb3J0LnByaW50KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QmFzZTY0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucmVwb3J0LmdldEJhc2U2NChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG5cbn1cbi8vdmFyIGF2YWlsYWJsZSA9IFtcIkFsZWdyZXlhXCIsICAgIFwiQWxlZ3JleWFTYW5zXCIsICAgIFwiQWxlZ3JleWFTYW5zU0NcIiwgICAgXCJBbGVncmV5YVNDXCIsICAgIFwiQWxtZW5kcmFTQ1wiLCAgICBcIkFtYXJhbnRoXCIsICAgIFwiQW5kYWRhXCIsICAgIFwiQW5kYWRhU0NcIiwgICAgXCJBbm9ueW1vdXNQcm9cIiwgICAgXCJBcmNoaXZvTmFycm93XCIsICAgIFwiQXJ2b1wiLCAgICBcIkFzYXBcIiwgICAgXCJBdmVyaWFMaWJyZVwiLCAgICBcIkF2ZXJpYVNhbnNMaWJyZVwiLCAgICBcIkF2ZXJpYVNlcmlmTGlicmVcIiwgICAgXCJDYW1iYXlcIiwgICAgXCJDYXVkZXhcIiwgICAgXCJDcmltc29uVGV4dFwiLCAgICBcIkN1cHJ1bVwiLCAgICBcIkVjb25vbWljYVwiLCAgICBcIkV4bzJcIiwgICAgXCJFeG9cIiwgICAgXCJFeHBsZXR1c1NhbnNcIiwgICAgXCJGaXJhU2Fuc1wiLCAgICBcIkpvc2VmaW5TYW5zXCIsICAgIFwiSm9zZWZpblNsYWJcIiwgICAgXCJLYXJsYVwiLCAgICBcIkxhdG9cIiwgICAgXCJMb2JzdGVyVHdvXCIsICAgIFwiTG9yYVwiLCAgICBcIk1hcnZlbFwiLCAgICBcIk1lcnJpd2VhdGhlclwiLCAgICBcIk1lcnJpd2VhdGhlclNhbnNcIiwgICAgXCJOb2JpbGVcIiwgICAgXCJOb3RpY2lhVGV4dFwiLCAgICBcIk92ZXJsb2NrXCIsICAgIFwiUGhpbG9zb3BoZXJcIiwgICAgXCJQbGF5ZmFpckRpc3BsYXlcIiwgICAgXCJQbGF5ZmFpckRpc3BsYXlTQ1wiLCAgICBcIlBUX1NlcmlmLVdlYlwiLCAgICBcIlB1cml0YW5cIiwgICAgXCJRdWFudGljb1wiLCAgICBcIlF1YXR0cm9jZW50b1NhbnNcIiwgICAgXCJRdWlja3NhbmRcIiwgICAgXCJSYW1ibGFcIiwgICAgXCJSb3NhcmlvXCIsICAgIFwiU2Fuc2F0aW9uXCIsICAgIFwiU2FyYWJ1blwiLCAgICBcIlNjYWRhXCIsICAgIFwiU2hhcmVcIiwgICAgXCJTaXRhcmFcIiwgICAgXCJTb3VyY2VTYW5zUHJvXCIsICAgIFwiVGl0aWxsaXVtV2ViXCIsICAgIFwiVm9sa2hvdlwiLCAgICBcIlZvbGxrb3JuXCJdO1xuZnVuY3Rpb24gcmVnaXN0ZXJGb250cyhkYXRhKSB7XG4gICAgdmFyIGZvbnRzID0gW107XG4gICAgdmFyIGJhc2UgPSBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC94RXJpay9wZGZtYWtlLWZvbnRzLWdvb2dsZUBtYXN0ZXIvbGliL29mbFwiLy9hYmVlemVlL0FCZWVaZWUtSXRhbGljLnR0ZlxuXG4gICAgSlNPTi5zdHJpbmdpZnkoZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJmb250XCIgJiYgdmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGZvbnRzLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KTtcbiAgICBpZiAoIXBkZk1ha2UuZm9udHMpIHtcbiAgICAgICAgcGRmTWFrZS5mb250cyA9IHtcbiAgICAgICAgICAgIFJvYm90bzoge1xuICAgICAgICAgICAgICAgIG5vcm1hbDogJ1JvYm90by1SZWd1bGFyLnR0ZicsXG4gICAgICAgICAgICAgICAgYm9sZDogJ1JvYm90by1NZWRpdW0udHRmJyxcbiAgICAgICAgICAgICAgICBpdGFsaWNzOiAnUm9ib3RvLUl0YWxpYy50dGYnLFxuICAgICAgICAgICAgICAgIGJvbGRpdGFsaWNzOiAnUm9ib3RvLU1lZGl1bUl0YWxpYy50dGYnXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZvbnRzLmZvckVhY2goKGZvbnQ6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAoZm9udCAhPT0gXCJSb2JvdG9cIikge1xuICAgICAgICAgICAgcGRmTWFrZS5mb250c1tmb250XSA9IHt9O1xuICAgICAgICAgICAgcGRmTWFrZS5mb250c1tmb250XS5ub3JtYWwgPSBiYXNlICsgXCIvXCIgKyBmb250LnRvTG93ZXJDYXNlKCkgKyBcIi9cIiArIGZvbnQgKyBcIi1SZWd1bGFyLnR0ZlwiO1xuICAgICAgICAgICAgcGRmTWFrZS5mb250c1tmb250XS5ib2xkID0gYmFzZSArIFwiL1wiICsgZm9udC50b0xvd2VyQ2FzZSgpICsgXCIvXCIgKyBmb250ICsgXCItQm9sZC50dGZcIjtcbiAgICAgICAgICAgIHBkZk1ha2UuZm9udHNbZm9udF0uaXRhbGljcyA9IGJhc2UgKyBcIi9cIiArIGZvbnQudG9Mb3dlckNhc2UoKSArIFwiL1wiICsgZm9udCArIFwiLUl0YWxpYy50dGZcIjtcbiAgICAgICAgICAgIHBkZk1ha2UuZm9udHNbZm9udF0uYm9sZGl0YWxpY3MgPSBiYXNlICsgXCIvXCIgKyBmb250LnRvTG93ZXJDYXNlKCkgKyBcIi9cIiArIGZvbnQgKyBcIi1Cb2xkSXRhbGljLnR0ZlwiO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJlcCA9IG5ldyBQREZSZXBvcnQoKTtcbiAgICByZXAuZGF0YSA9IHtcbiAgICAgICAgaW52b2ljZToge1xuICAgICAgICAgICAgbnVtYmVyOiAxMDAwLFxuICAgICAgICAgICAgZGF0ZTogXCIyMC4wNy4yMDE4XCIsXG4gICAgICAgICAgICBjdXN0b21lcjoge1xuICAgICAgICAgICAgICAgIGZpcnN0bmFtZTogXCJIZW5yeVwiLFxuICAgICAgICAgICAgICAgIGxhc3RuYW1lOiBcIktsYXVzXCIsXG4gICAgICAgICAgICAgICAgc3RyZWV0OiBcIkhhdXB0c3RyLiAxNTdcIixcbiAgICAgICAgICAgICAgICBwbGFjZTogXCJjaGVtbml0elwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgeyBwb3M6IDEsIHRleHQ6IFwidGhpcyBpcyB0aGUgZmlyc3QgcG9zaXRpb24sIGxrc2pkZmxnc2QgZXIgd2Ugd2VyIHdyZSBlciBlciBlciByZSB3ZWtmZ2pzbGtkZmpqZGsgc2dmc2RnXCIsIHByaWNlOiAxMC4wMCwgYW1vdW50OiA1MCwgdmFyaWFudGU6IFt7IG06IDEgfSwgeyBtOiAyIH1dIH0sXG4gICAgICAgICAgICAgICAgeyBwb3M6IDIsIHRleHQ6IFwidGhpcyBpcyB0aGUgbmV4dCBwb3NpdGlvblwiLCBwcmljZTogMjAuNTAsIH0sXG4gICAgICAgICAgICAgICAgeyBwb3M6IDMsIHRleHQ6IFwidGhpcyBpcyBhbiBvdGhlciBwb3NpdGlvblwiLCBwcmljZTogMTkuNTAgfSxcbiAgICAgICAgICAgICAgICB7IHBvczogNCwgdGV4dDogXCJ0aGlzIGlzIHRoZSBsYXN0IHBvc2l0aW9uXCIsIHByaWNlOiA1MC4wMCB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IFtcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiU3VidG90YWxcIiwgdmFsdWU6IDEwMC4wMCB9LFxuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJUYXhcIiwgdmFsdWU6IDE5LjAwIH0sXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIlN1YnRvdGFsXCIsIHZhbHVlOiAxMTkuMDAgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVwLnZhbHVlID0ge1xuICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICBzdGFjazogW3tcbiAgICAgICAgICAgICAgICAvL2ZvbnQ6IFwiRXhwbGV0dXNTYW5zXCIsXG4gICAgICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyR7aW52b2ljZS5jdXN0b21lci5maXJzdG5hbWV9ICR7aW52b2ljZS5jdXN0b21lci5sYXN0bmFtZX0nICxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJHtpbnZvaWNlLmN1c3RvbWVyLnN0cmVldH0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcke2ludm9pY2UuY3VzdG9tZXIucGxhY2V9JyBcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdJbnZvaWNlJywgZm9udFNpemU6IDE4IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFwiICxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRhdGU6ICR7aW52b2ljZS5kYXRlfVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCJOdW1iZXI6ICR7aW52b2ljZS5udW1iZXJ9XCIsIGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcIiAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIgLFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRhYmxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsnSXRlbScsICdQcmljZSddLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2g6IFwibGluZSBpbiBpbnZvaWNlLmxpbmVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG86IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyR7bGluZS50ZXh0fScsICcke2xpbmUucHJpY2V9J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGF0YXRhYmxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjogW3sgdGV4dDogXCJJdGVtXCIgfSwgeyB0ZXh0OiBcIlByaWNlXCIgfV0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGFmb3JlYWNoOiBcImxpbmUgaW4gaW52b2ljZS5saW5lc1wiLFxuICAgICAgICAgICAgICAgICAgICAvL2Zvb3RlcjpbeyB0ZXh0OlwiVG90YWxcIn0seyB0ZXh0OlwiXCJ9XSxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogWycke2xpbmUudGV4dH0nLCAnJHtsaW5lLnByaWNlfSddLFxuICAgICAgICAgICAgICAgICAgICBncm91cHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogXCJsaW5lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb290ZXI6IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgXCIgXCIgLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvcmVhY2g6IFwic3VtIGluIGludm9pY2Uuc3VtbWFyeVwiLFxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgIFwiJHtzdW0udGV4dH1cIiAsXG4gICAgICAgICAgICAgICAgICAgIFwiJHtzdW0udmFsdWV9XCIgLFxuICAgICAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVwLmZpbGwoKTtcbiAgICB2YXIgdmlld2VyID0gbmV3IFBERlZpZXdlcigpO1xuICAgIHZpZXdlci52YWx1ZSA9IGF3YWl0IHJlcC5nZXRCYXNlNjQoKTtcbiAgICB2aWV3ZXIuaGVpZ2h0ID0gMzAwO1xuICAgIHJldHVybiB2aWV3ZXI7XG59XG5cblxuIl19