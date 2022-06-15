import jassijs, { $Class } from "jassijs/remote/Jassi";
//@ts-ignore
import pdfMake from "jassijs_report/ext/pdfmake";
import { PDFViewer } from "jassijs_report/PDFViewer";
import { Tools } from "jassijs/util/Tools";

//@ts-ignore;
import {createReportDefinition} from "jassijs_report/remote/pdfmakejassi";



@$Class("jassijs_report.PDFReport")
export class PDFReport {
    report;
    /**
     * @member {object} - report definition
     */
    value;
    data;
    parameter;
    constructor() {
        // @member {object} - the generated report
        this.report = null;
    }

    layout() {
        //var me = this.me = {};

    }
    fill() {
        var def = createReportDefinition(this.value, this.data, this.parameter)
        registerFonts(this.value);
        this.report = pdfMake.createPdf(def);
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

    };

}
//var available = ["Alegreya",    "AlegreyaSans",    "AlegreyaSansSC",    "AlegreyaSC",    "AlmendraSC",    "Amaranth",    "Andada",    "AndadaSC",    "AnonymousPro",    "ArchivoNarrow",    "Arvo",    "Asap",    "AveriaLibre",    "AveriaSansLibre",    "AveriaSerifLibre",    "Cambay",    "Caudex",    "CrimsonText",    "Cuprum",    "Economica",    "Exo2",    "Exo",    "ExpletusSans",    "FiraSans",    "JosefinSans",    "JosefinSlab",    "Karla",    "Lato",    "LobsterTwo",    "Lora",    "Marvel",    "Merriweather",    "MerriweatherSans",    "Nobile",    "NoticiaText",    "Overlock",    "Philosopher",    "PlayfairDisplay",    "PlayfairDisplaySC",    "PT_Serif-Web",    "Puritan",    "Quantico",    "QuattrocentoSans",    "Quicksand",    "Rambla",    "Rosario",    "Sansation",    "Sarabun",    "Scada",    "Share",    "Sitara",    "SourceSansPro",    "TitilliumWeb",    "Volkhov",    "Vollkorn"];
function registerFonts(data) {
    var fonts = [];
    var base = "https://cdn.jsdelivr.net/gh/xErik/pdfmake-fonts-google@master/lib/ofl"//abeezee/ABeeZee-Italic.ttf

    JSON.stringify(data, (key, value) => {
        if (key === "font" && value !== "") {
            fonts.push(value);
        }
        return value;
    });
    if (!pdfMake.fonts) {
        pdfMake.fonts = {
            Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
            }
        };
    }
    fonts.forEach((font: string) => {
        if (font !== "Roboto") {
            pdfMake.fonts[font] = {};
            pdfMake.fonts[font].normal = base + "/" + font.toLowerCase() + "/" + font + "-Regular.ttf";
            pdfMake.fonts[font].bold = base + "/" + font.toLowerCase() + "/" + font + "-Bold.ttf";
            pdfMake.fonts[font].italics = base + "/" + font.toLowerCase() + "/" + font + "-Italic.ttf";
            pdfMake.fonts[font].bolditalics = base + "/" + font.toLowerCase() + "/" + font + "-BoldItalic.ttf";
        }
    });
}


export async function test() {
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
                            '${invoice.customer.firstname} ${invoice.customer.lastname}' ,
                            '${invoice.customer.street}',
                            '${invoice.customer.place}' 
                        ]
                    },
                    {
                        stack: [
                            { text: 'Invoice', fontSize: 18 },
                             " " ,
                            "Date: ${invoice.date}",
                            { text: "Number: ${invoice.number}", bold: true },
                            " " ,
                            " " ,
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
             " " ,
            {
                foreach: "sum in invoice.summary",
                columns: [
                     "${sum.text}" ,
                    "${sum.value}" ,
                ]

            },
            ]
        }
    };
    rep.fill();
    var viewer = new PDFViewer();
    viewer.value = await rep.getBase64();
    viewer.height = 300;
    return viewer;
}


