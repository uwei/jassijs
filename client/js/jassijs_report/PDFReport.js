var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/ext/pdfmake", "jassijs_report/PDFViewer"], function (require, exports, Jassi_1, pdfmake_1, PDFViewer_1) {
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
        /**
         * @member {object} - report definition
         */
        set value(value) {
            this._definition = value;
            var data = {};
            Object.assign(data, value);
            data.content = replaceTemplates(this._definition.content, this._definition.data);
            if (data.background)
                data.background = replaceTemplates(this._definition.background, this._definition.data);
            if (data.header)
                data.header = replaceTemplates(this._definition.header, this._definition.data);
            if (data.footer)
                data.footer = replaceTemplates(this._definition.footer, this._definition.data);
            data.content = replaceTemplates(this._definition.content, this._definition.data);
            replacePageInformation(data);
            delete data.data;
            registerFonts(data);
            this.report = pdfmake_1.default.createPdf(data);
        }
        get value() {
            return this._definition;
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
    function replace(str, data, member) {
        var ob = getVar(data, member);
        return str.split("{{" + member + "}}").join(ob);
    }
    function getVar(data, member) {
        var names = member.split(".");
        var ob = data[names[0]];
        for (let x = 1; x < names.length; x++) {
            if (ob === undefined)
                return undefined;
            ob = ob[names[x]];
        }
        return ob;
    }
    //replace {{currentPage}} {{pageWidth}} {{pageHeight}} {{pageCount}} in header,footer, background
    function replacePageInformation(def) {
        if (def.background && typeof def.background !== "function") {
            let d = JSON.stringify(def.background);
            def.background = function (currentPage, pageSize) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageWidth}}", pageSize.width);
                sret = sret.replaceAll("{{pageHeight}}", pageSize.height);
                return JSON.parse(sret);
            };
        }
        if (def.header && typeof def.header !== "function") {
            let d = JSON.stringify(def.header);
            def.header = function (currentPage, pageCount) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageCount}}", pageCount);
                return JSON.parse(sret);
            };
        }
        if (def.footer && typeof def.footer !== "function") {
            let d = JSON.stringify(def.footer);
            def.footer = function (currentPage, pageCount, pageSize) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageCount}}", pageCount);
                sret = sret.replaceAll("{{pageWidth}}", pageSize.width);
                sret = sret.replaceAll("{{pageHeight}}", pageSize.height);
                return JSON.parse(sret);
            };
        }
    }
    function replaceDatatable(def, data) {
        var header = def.datatable.header;
        var footer = def.datatable.footer;
        var dataexpr = def.datatable.foreach;
        var groups = def.datatable.groups;
        var body = def.datatable.body;
        def.table = {
            body: []
        };
        if (header)
            def.table.body.push(header);
        def.table.body.push({
            foreach: def.datatable.dataforeach,
            do: body
        });
        delete def.datatable.dataforeach;
        /*var variable = dataexpr.split(" in ")[0];
        var sarr = dataexpr.split(" in ")[1];
        var arr = getVar(data, sarr);
    
        for (let x = 0;x < arr.length;x++) {
            data[variable] = arr[x];
            var copy = JSON.parse(JSON.stringify(body));//deep copy
            copy = replaceTemplates(copy, data);
            def.table.body.push(copy);
        }*/
        if (footer)
            def.table.body.push(footer);
        //delete data[variable];
        delete def.datatable.header;
        delete def.datatable.footer;
        delete def.datatable.foreach;
        delete def.datatable.groups;
        delete def.datatable.body;
        for (var key in def.datatable) {
            def.table[key] = def.datatable[key];
        }
        delete def.datatable;
        /*header:[{ text:"Item"},{ text:"Price"}],
                        data:"line in invoice.lines",
                        //footer:[{ text:"Total"},{ text:""}],
                        body:[{ text:"Text"},{ text:"price"}],
                        groups:*/
    }
    function replaceTemplates(def, data, parentArray = undefined) {
        if (def.datatable !== undefined) {
            replaceDatatable(def, data);
        }
        if (def.foreach !== undefined) {
            //resolve foreach
            //	{ foreach: "line in invoice.lines", do: ['{{line.text}}', '{{line.price}}', 'OK?']	
            if (parentArray === undefined) {
                throw "foreach is not surounded by an Array";
            }
            var variable = def.foreach.split(" in ")[0];
            var sarr = def.foreach.split(" in ")[1];
            var arr = getVar(data, sarr);
            var pos = parentArray.indexOf(def);
            parentArray.splice(pos, 1);
            for (let x = 0; x < arr.length; x++) {
                data[variable] = arr[x];
                delete def.foreach;
                var copy;
                if (def.do)
                    copy = JSON.parse(JSON.stringify(def.do));
                else
                    copy = JSON.parse(JSON.stringify(def));
                copy = replaceTemplates(copy, data);
                parentArray.splice(pos++, 0, copy);
            }
            delete data[variable];
            return undefined;
        }
        else if (Array.isArray(def)) {
            for (var a = 0; a < def.length; a++) {
                if (def[a].foreach !== undefined) {
                    replaceTemplates(def[a], data, def);
                    a--;
                }
                else
                    def[a] = replaceTemplates(def[a], data, def);
            }
            return def;
        }
        else if (typeof def === "string") {
            var ergebnis = def.toString().match(/\{\{(\w||\.)*\}\}/g);
            if (ergebnis !== null) {
                for (var e = 0; e < ergebnis.length; e++) {
                    def = replace(def, data, ergebnis[e].substring(2, ergebnis[e].length - 2));
                }
            }
            return def;
        }
        else { //object	
            for (var key in def) {
                def[key] = replaceTemplates(def[key], data);
            }
            delete def.editTogether; //RText
        }
        return def;
    }
    function replaceTemplatesOld(def, data, parentArray = undefined) {
        if (def.datatable !== undefined) {
            replaceDatatable(def, data);
        }
        else if (def.foreach !== undefined) {
            //resolve foreach
            //	{ foreach: "line in invoice.lines", do: ['{{line.text}}', '{{line.price}}', 'OK?']	
            if (parentArray === undefined) {
                throw "foreach is not surounded by an Array";
            }
            var variable = def.foreach.split(" in ")[0];
            var sarr = def.foreach.split(" in ")[1];
            var arr = getVar(data, sarr);
            var pos = parentArray.indexOf(def);
            parentArray.splice(pos, 1);
            for (let x = 0; x < arr.length; x++) {
                data[variable] = arr[x];
                var copy = JSON.parse(JSON.stringify(def.do)); //deep copy
                copy = replaceTemplates(copy, data);
                parentArray.splice(pos++, 0, copy);
            }
            delete data[variable];
            return undefined;
        }
        else if (Array.isArray(def)) {
            for (var a = 0; a < def.length; a++) {
                if (def[a].foreach !== undefined) {
                    replaceTemplates(def[a], data, def);
                    a--;
                }
                else
                    def[a] = replaceTemplates(def[a], data, def);
            }
            return def;
        }
        else if (typeof def === "string") {
            var ergebnis = def.toString().match(/\{\{(\w||\.)*\}\}/g);
            if (ergebnis !== null) {
                for (var e = 0; e < ergebnis.length; e++) {
                    def = replace(def, data, ergebnis[e].substring(2, ergebnis[e].length - 2));
                }
            }
            return def;
        }
        else { //object	
            for (var key in def) {
                def[key] = replaceTemplates(def[key], data);
            }
            delete def.editTogether; //RText
        }
        return def;
    }
    async function test() {
        var rep = new PDFReport();
        var def = {
            data: {
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
            },
            content: {
                stack: [{
                        //font: "ExpletusSans",
                        columns: [
                            {
                                stack: [
                                    { text: '{{invoice.customer.firstname}} {{invoice.customer.lastname}}' },
                                    { text: '{{invoice.customer.street}}' },
                                    { text: '{{invoice.customer.place}}' }
                                ]
                            },
                            {
                                stack: [
                                    { text: 'Invoice', fontSize: 18 },
                                    { text: " " },
                                    { text: "Date: {{invoice.date}}" },
                                    { text: "Number: {{invoice.number}}", bold: true },
                                    { text: " " },
                                    { text: " " },
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
                                        '{{line.text}}', '{{line.price}}'
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
                            body: [{ text: '{{line.text}}' }, { text: '{{line.price}}' }],
                            groups: [
                                {
                                    field: "line",
                                    header: [],
                                    footer: []
                                }
                            ]
                        }
                    },
                    { text: " " },
                    {
                        foreach: "sum in invoice.summary",
                        columns: [
                            { text: "{{sum.text}}" },
                            { text: "{{sum.value}}" },
                        ]
                    },
                ]
            }
        };
        def.content = replaceTemplates(def.content, def.data);
        rep.value = def;
        var viewer = new PDFViewer_1.PDFViewer();
        viewer.value = await rep.getBase64();
        viewer.height = 300;
        return viewer;
    }
    exports.test = test;
});
//# sourceMappingURL=PDFReport.js.map