var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi_report/ext/pdfmake", "jassi_report/PDFViewer"], function (require, exports, Jassi_1, pdfmake_1, PDFViewer_1) {
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
        Jassi_1.$Class("jassi_report.PDFReport"),
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
        return viewer;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUERGUmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vamFzc2lfcmVwb3J0L1BERlJlcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBU0EsSUFBYSxTQUFTLEdBQXRCLE1BQWEsU0FBUztRQUdsQjtZQUNJLDBDQUEwQztZQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN2QixDQUFDO1FBRUQsTUFBTTtZQUNGLHdCQUF3QjtRQUU1QixDQUFDO1FBQ0Q7O1dBRUc7UUFDSCxJQUFJLEtBQUssQ0FBQyxLQUFLO1lBQ1gsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDekIsSUFBSSxJQUFJLEdBQVEsRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTNCLElBQUksQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRixJQUFJLElBQUksQ0FBQyxVQUFVO2dCQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRixJQUFJLElBQUksQ0FBQyxNQUFNO2dCQUNYLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRixJQUFJLElBQUksQ0FBQyxNQUFNO2dCQUNYLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENB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c3NpL3JlbW90ZS9KYXNzaVwiO1xuLy9AdHMtaWdub3JlXG5pbXBvcnQgcGRmTWFrZSBmcm9tIFwiamFzc2lfcmVwb3J0L2V4dC9wZGZtYWtlXCI7XG5pbXBvcnQgeyBQREZWaWV3ZXIgfSBmcm9tIFwiamFzc2lfcmVwb3J0L1BERlZpZXdlclwiO1xuaW1wb3J0IHsgVG9vbHMgfSBmcm9tIFwiamFzc2kvdXRpbC9Ub29sc1wiO1xuXG5cblxuQCRDbGFzcyhcImphc3NpX3JlcG9ydC5QREZSZXBvcnRcIilcbmV4cG9ydCBjbGFzcyBQREZSZXBvcnQge1xuICAgIHJlcG9ydDtcbiAgICBfZGVmaW5pdGlvbjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gQG1lbWJlciB7b2JqZWN0fSAtIHRoZSBnZW5lcmF0ZWQgcmVwb3J0XG4gICAgICAgIHRoaXMucmVwb3J0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBsYXlvdXQoKSB7XG4gICAgICAgIC8vdmFyIG1lID0gdGhpcy5tZSA9IHt9O1xuXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge29iamVjdH0gLSByZXBvcnQgZGVmaW5pdGlvblxuICAgICAqL1xuICAgIHNldCB2YWx1ZSh2YWx1ZSkgeyAvL3RoZSBDb2RlXG4gICAgICAgIHRoaXMuX2RlZmluaXRpb24gPSB2YWx1ZTtcbiAgICAgICAgdmFyIGRhdGE6IGFueSA9IHt9O1xuICAgICAgICBPYmplY3QuYXNzaWduKGRhdGEsIHZhbHVlKTtcblxuICAgICAgICBkYXRhLmNvbnRlbnQgPSByZXBsYWNlVGVtcGxhdGVzKHRoaXMuX2RlZmluaXRpb24uY29udGVudCwgdGhpcy5fZGVmaW5pdGlvbi5kYXRhKTtcbiAgICAgICAgaWYgKGRhdGEuYmFja2dyb3VuZClcbiAgICAgICAgICAgIGRhdGEuYmFja2dyb3VuZCA9IHJlcGxhY2VUZW1wbGF0ZXModGhpcy5fZGVmaW5pdGlvbi5iYWNrZ3JvdW5kLCB0aGlzLl9kZWZpbml0aW9uLmRhdGEpO1xuICAgICAgICBpZiAoZGF0YS5oZWFkZXIpXG4gICAgICAgICAgICBkYXRhLmhlYWRlciA9IHJlcGxhY2VUZW1wbGF0ZXModGhpcy5fZGVmaW5pdGlvbi5oZWFkZXIsIHRoaXMuX2RlZmluaXRpb24uZGF0YSk7XG4gICAgICAgIGlmIChkYXRhLmZvb3RlcilcbiAgICAgICAgICAgIGRhdGEuZm9vdGVyID0gcmVwbGFjZVRlbXBsYXRlcyh0aGlzLl9kZWZpbml0aW9uLmZvb3RlciwgdGhpcy5fZGVmaW5pdGlvbi5kYXRhKTtcblxuICAgICAgICBkYXRhLmNvbnRlbnQgPSByZXBsYWNlVGVtcGxhdGVzKHRoaXMuX2RlZmluaXRpb24uY29udGVudCwgdGhpcy5fZGVmaW5pdGlvbi5kYXRhKTtcbiAgICAgICAgcmVwbGFjZVBhZ2VJbmZvcm1hdGlvbihkYXRhKTtcbiAgICAgICAgZGVsZXRlIGRhdGEuZGF0YTtcbiAgICAgICAgcmVnaXN0ZXJGb250cyhkYXRhKTtcbiAgICAgICAgdGhpcy5yZXBvcnQgPSBwZGZNYWtlLmNyZWF0ZVBkZihkYXRhKTtcbiAgICB9XG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmaW5pdGlvbjtcbiAgICB9XG4gICAgb3BlbigpIHtcbiAgICAgICAgdGhpcy5yZXBvcnQub3BlbigpO1xuICAgIH1cbiAgICBkb3dubG9hZCgpIHtcbiAgICAgICAgdGhpcy5yZXBvcnQuZG93bmxvYWQoKTtcbiAgICB9XG4gICAgcHJpbnQoKSB7XG4gICAgICAgIHRoaXMucmVwb3J0LnByaW50KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QmFzZTY0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucmVwb3J0LmdldEJhc2U2NChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG5cbn1cbi8vdmFyIGF2YWlsYWJsZSA9IFtcIkFsZWdyZXlhXCIsICAgIFwiQWxlZ3JleWFTYW5zXCIsICAgIFwiQWxlZ3JleWFTYW5zU0NcIiwgICAgXCJBbGVncmV5YVNDXCIsICAgIFwiQWxtZW5kcmFTQ1wiLCAgICBcIkFtYXJhbnRoXCIsICAgIFwiQW5kYWRhXCIsICAgIFwiQW5kYWRhU0NcIiwgICAgXCJBbm9ueW1vdXNQcm9cIiwgICAgXCJBcmNoaXZvTmFycm93XCIsICAgIFwiQXJ2b1wiLCAgICBcIkFzYXBcIiwgICAgXCJBdmVyaWFMaWJyZVwiLCAgICBcIkF2ZXJpYVNhbnNMaWJyZVwiLCAgICBcIkF2ZXJpYVNlcmlmTGlicmVcIiwgICAgXCJDYW1iYXlcIiwgICAgXCJDYXVkZXhcIiwgICAgXCJDcmltc29uVGV4dFwiLCAgICBcIkN1cHJ1bVwiLCAgICBcIkVjb25vbWljYVwiLCAgICBcIkV4bzJcIiwgICAgXCJFeG9cIiwgICAgXCJFeHBsZXR1c1NhbnNcIiwgICAgXCJGaXJhU2Fuc1wiLCAgICBcIkpvc2VmaW5TYW5zXCIsICAgIFwiSm9zZWZpblNsYWJcIiwgICAgXCJLYXJsYVwiLCAgICBcIkxhdG9cIiwgICAgXCJMb2JzdGVyVHdvXCIsICAgIFwiTG9yYVwiLCAgICBcIk1hcnZlbFwiLCAgICBcIk1lcnJpd2VhdGhlclwiLCAgICBcIk1lcnJpd2VhdGhlclNhbnNcIiwgICAgXCJOb2JpbGVcIiwgICAgXCJOb3RpY2lhVGV4dFwiLCAgICBcIk92ZXJsb2NrXCIsICAgIFwiUGhpbG9zb3BoZXJcIiwgICAgXCJQbGF5ZmFpckRpc3BsYXlcIiwgICAgXCJQbGF5ZmFpckRpc3BsYXlTQ1wiLCAgICBcIlBUX1NlcmlmLVdlYlwiLCAgICBcIlB1cml0YW5cIiwgICAgXCJRdWFudGljb1wiLCAgICBcIlF1YXR0cm9jZW50b1NhbnNcIiwgICAgXCJRdWlja3NhbmRcIiwgICAgXCJSYW1ibGFcIiwgICAgXCJSb3NhcmlvXCIsICAgIFwiU2Fuc2F0aW9uXCIsICAgIFwiU2FyYWJ1blwiLCAgICBcIlNjYWRhXCIsICAgIFwiU2hhcmVcIiwgICAgXCJTaXRhcmFcIiwgICAgXCJTb3VyY2VTYW5zUHJvXCIsICAgIFwiVGl0aWxsaXVtV2ViXCIsICAgIFwiVm9sa2hvdlwiLCAgICBcIlZvbGxrb3JuXCJdO1xuZnVuY3Rpb24gcmVnaXN0ZXJGb250cyhkYXRhKSB7XG4gICAgdmFyIGZvbnRzID0gW107XG4gICAgdmFyIGJhc2UgPSBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC94RXJpay9wZGZtYWtlLWZvbnRzLWdvb2dsZUBtYXN0ZXIvbGliL29mbFwiLy9hYmVlemVlL0FCZWVaZWUtSXRhbGljLnR0ZlxuXG4gICAgSlNPTi5zdHJpbmdpZnkoZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJmb250XCImJnZhbHVlIT09XCJcIikge1xuICAgICAgICAgICAgZm9udHMucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0pO1xuICAgIGlmICghcGRmTWFrZS5mb250cykge1xuICAgICAgICBwZGZNYWtlLmZvbnRzID0ge1xuICAgICAgICAgICAgUm9ib3RvOiB7XG4gICAgICAgICAgICAgICAgbm9ybWFsOiAnUm9ib3RvLVJlZ3VsYXIudHRmJyxcbiAgICAgICAgICAgICAgICBib2xkOiAnUm9ib3RvLU1lZGl1bS50dGYnLFxuICAgICAgICAgICAgICAgIGl0YWxpY3M6ICdSb2JvdG8tSXRhbGljLnR0ZicsXG4gICAgICAgICAgICAgICAgYm9sZGl0YWxpY3M6ICdSb2JvdG8tTWVkaXVtSXRhbGljLnR0ZidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZm9udHMuZm9yRWFjaCgoZm9udDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmIChmb250ICE9PSBcIlJvYm90b1wiKSB7XG4gICAgICAgICAgICBwZGZNYWtlLmZvbnRzW2ZvbnRdID0ge307XG4gICAgICAgICAgICBwZGZNYWtlLmZvbnRzW2ZvbnRdLm5vcm1hbCA9IGJhc2UgKyBcIi9cIiArIGZvbnQudG9Mb3dlckNhc2UoKSArIFwiL1wiICsgZm9udCArIFwiLVJlZ3VsYXIudHRmXCI7XG4gICAgICAgICAgICBwZGZNYWtlLmZvbnRzW2ZvbnRdLmJvbGQgPSBiYXNlICsgXCIvXCIgKyBmb250LnRvTG93ZXJDYXNlKCkgKyBcIi9cIiArIGZvbnQgKyBcIi1Cb2xkLnR0ZlwiO1xuICAgICAgICAgICAgcGRmTWFrZS5mb250c1tmb250XS5pdGFsaWNzID0gYmFzZSArIFwiL1wiICsgZm9udC50b0xvd2VyQ2FzZSgpICsgXCIvXCIgKyBmb250ICsgXCItSXRhbGljLnR0ZlwiO1xuICAgICAgICAgICAgcGRmTWFrZS5mb250c1tmb250XS5ib2xkaXRhbGljcyA9IGJhc2UgKyBcIi9cIiArIGZvbnQudG9Mb3dlckNhc2UoKSArIFwiL1wiICsgZm9udCArIFwiLUJvbGRJdGFsaWMudHRmXCI7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZShzdHI6IHN0cmluZywgZGF0YSwgbWVtYmVyOiBzdHJpbmcpIHtcbiAgICB2YXIgb2IgPSBnZXRWYXIoZGF0YSwgbWVtYmVyKTtcbiAgICByZXR1cm4gc3RyLnNwbGl0KFwie3tcIiArIG1lbWJlciArIFwifX1cIikuam9pbihvYik7XG59XG5mdW5jdGlvbiBnZXRWYXIoZGF0YSwgbWVtYmVyKSB7XG4gICAgdmFyIG5hbWVzID0gbWVtYmVyLnNwbGl0KFwiLlwiKTtcbiAgICB2YXIgb2IgPSBkYXRhW25hbWVzWzBdXTtcbiAgICBmb3IgKGxldCB4ID0gMTsgeCA8IG5hbWVzLmxlbmd0aDsgeCsrKSB7XG5cbiAgICAgICAgaWYgKG9iID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBvYiA9IG9iW25hbWVzW3hdXTtcbiAgICB9XG4gICAgcmV0dXJuIG9iO1xufVxuLy9yZXBsYWNlIHt7Y3VycmVudFBhZ2V9fSB7e3BhZ2VXaWR0aH19IHt7cGFnZUhlaWdodH19IHt7cGFnZUNvdW50fX0gaW4gaGVhZGVyLGZvb3RlciwgYmFja2dyb3VuZFxuZnVuY3Rpb24gcmVwbGFjZVBhZ2VJbmZvcm1hdGlvbihkZWYpIHtcblxuICAgIGlmIChkZWYuYmFja2dyb3VuZCAmJiB0eXBlb2YgZGVmLmJhY2tncm91bmQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBsZXQgZCA9IEpTT04uc3RyaW5naWZ5KGRlZi5iYWNrZ3JvdW5kKTtcbiAgICAgICAgZGVmLmJhY2tncm91bmQgPSBmdW5jdGlvbiAoY3VycmVudFBhZ2UsIHBhZ2VTaXplKSB7XG4gICAgICAgICAgICBsZXQgc3JldCA9IGQucmVwbGFjZUFsbChcInt7Y3VycmVudFBhZ2V9fVwiLCBjdXJyZW50UGFnZSk7XG4gICAgICAgICAgICBzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlV2lkdGh9fVwiLCBwYWdlU2l6ZS53aWR0aCk7XG4gICAgICAgICAgICBzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlSGVpZ2h0fX1cIiwgcGFnZVNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHNyZXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChkZWYuaGVhZGVyICYmIHR5cGVvZiBkZWYuaGVhZGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgbGV0IGQgPSBKU09OLnN0cmluZ2lmeShkZWYuaGVhZGVyKTtcbiAgICAgICAgZGVmLmhlYWRlciA9IGZ1bmN0aW9uIChjdXJyZW50UGFnZSwgcGFnZUNvdW50KSB7XG4gICAgICAgICAgICBsZXQgc3JldCA9IGQucmVwbGFjZUFsbChcInt7Y3VycmVudFBhZ2V9fVwiLCBjdXJyZW50UGFnZSk7XG4gICAgICAgICAgICBzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlQ291bnR9fVwiLCBwYWdlQ291bnQpO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uoc3JldCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRlZi5mb290ZXIgJiYgdHlwZW9mIGRlZi5mb290ZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBsZXQgZCA9IEpTT04uc3RyaW5naWZ5KGRlZi5mb290ZXIpO1xuXG4gICAgICAgIGRlZi5mb290ZXIgPSBmdW5jdGlvbiAoY3VycmVudFBhZ2UsIHBhZ2VDb3VudCwgcGFnZVNpemUpIHtcbiAgICAgICAgICAgIGxldCBzcmV0ID0gZC5yZXBsYWNlQWxsKFwie3tjdXJyZW50UGFnZX19XCIsIGN1cnJlbnRQYWdlKTtcbiAgICAgICAgICAgIHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VDb3VudH19XCIsIHBhZ2VDb3VudCk7XG4gICAgICAgICAgICBzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlV2lkdGh9fVwiLCBwYWdlU2l6ZS53aWR0aCk7XG4gICAgICAgICAgICBzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlSGVpZ2h0fX1cIiwgcGFnZVNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHNyZXQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZXBsYWNlRGF0YXRhYmxlKGRlZiwgZGF0YSkge1xuXG4gICAgdmFyIGhlYWRlciA9IGRlZi5kYXRhdGFibGUuaGVhZGVyO1xuICAgIHZhciBmb290ZXIgPSBkZWYuZGF0YXRhYmxlLmZvb3RlcjtcbiAgICB2YXIgZGF0YWV4cHIgPSBkZWYuZGF0YXRhYmxlLmZvcmVhY2g7XG4gICAgdmFyIGdyb3VwcyA9IGRlZi5kYXRhdGFibGUuZ3JvdXBzO1xuICAgIHZhciBib2R5ID0gZGVmLmRhdGF0YWJsZS5ib2R5O1xuICAgIGRlZi50YWJsZSA9IHtcbiAgICAgICAgYm9keTogW11cbiAgICB9O1xuICAgIGlmIChoZWFkZXIpXG4gICAgICAgIGRlZi50YWJsZS5ib2R5LnB1c2goaGVhZGVyKTtcbiAgICBkZWYudGFibGUuYm9keS5wdXNoKHtcbiAgICAgICAgZm9yZWFjaDogZGVmLmRhdGF0YWJsZS5kYXRhZm9yZWFjaCxcbiAgICAgICAgZG86IGJvZHlcbiAgICB9KTtcbiAgICBkZWxldGUgZGVmLmRhdGF0YWJsZS5kYXRhZm9yZWFjaDtcbiAgICAvKnZhciB2YXJpYWJsZSA9IGRhdGFleHByLnNwbGl0KFwiIGluIFwiKVswXTtcbiAgICB2YXIgc2FyciA9IGRhdGFleHByLnNwbGl0KFwiIGluIFwiKVsxXTtcbiAgICB2YXIgYXJyID0gZ2V0VmFyKGRhdGEsIHNhcnIpO1xuXG4gICAgZm9yIChsZXQgeCA9IDA7eCA8IGFyci5sZW5ndGg7eCsrKSB7XG4gICAgICAgIGRhdGFbdmFyaWFibGVdID0gYXJyW3hdO1xuICAgICAgICB2YXIgY29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYm9keSkpOy8vZGVlcCBjb3B5XG4gICAgICAgIGNvcHkgPSByZXBsYWNlVGVtcGxhdGVzKGNvcHksIGRhdGEpO1xuICAgICAgICBkZWYudGFibGUuYm9keS5wdXNoKGNvcHkpO1xuICAgIH0qL1xuICAgIGlmIChmb290ZXIpXG4gICAgICAgIGRlZi50YWJsZS5ib2R5LnB1c2goZm9vdGVyKTtcbiAgICAvL2RlbGV0ZSBkYXRhW3ZhcmlhYmxlXTtcbiAgICBkZWxldGUgZGVmLmRhdGF0YWJsZS5oZWFkZXI7XG4gICAgZGVsZXRlIGRlZi5kYXRhdGFibGUuZm9vdGVyO1xuICAgIGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmZvcmVhY2g7XG4gICAgZGVsZXRlIGRlZi5kYXRhdGFibGUuZ3JvdXBzO1xuICAgIGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmJvZHk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZGVmLmRhdGF0YWJsZSkge1xuICAgICAgICBkZWYudGFibGVba2V5XSA9IGRlZi5kYXRhdGFibGVba2V5XTtcbiAgICB9XG4gICAgZGVsZXRlIGRlZi5kYXRhdGFibGU7XG4gICAgLypoZWFkZXI6W3sgdGV4dDpcIkl0ZW1cIn0seyB0ZXh0OlwiUHJpY2VcIn1dLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOlwibGluZSBpbiBpbnZvaWNlLmxpbmVzXCIsXG4gICAgICAgICAgICAgICAgICAgIC8vZm9vdGVyOlt7IHRleHQ6XCJUb3RhbFwifSx7IHRleHQ6XCJcIn1dLFxuICAgICAgICAgICAgICAgICAgICBib2R5Olt7IHRleHQ6XCJUZXh0XCJ9LHsgdGV4dDpcInByaWNlXCJ9XSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBzOiovXG5cblxufVxuZnVuY3Rpb24gcmVwbGFjZVRlbXBsYXRlcyhkZWYsIGRhdGEsIHBhcmVudEFycmF5OiBhbnlbXSA9IHVuZGVmaW5lZCkge1xuXG4gICAgaWYgKGRlZi5kYXRhdGFibGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXBsYWNlRGF0YXRhYmxlKGRlZiwgZGF0YSk7XG5cbiAgICB9XG4gICAgaWYgKGRlZi5mb3JlYWNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy9yZXNvbHZlIGZvcmVhY2hcbiAgICAgICAgLy9cdHsgZm9yZWFjaDogXCJsaW5lIGluIGludm9pY2UubGluZXNcIiwgZG86IFsne3tsaW5lLnRleHR9fScsICd7e2xpbmUucHJpY2V9fScsICdPSz8nXVx0XG4gICAgICAgIGlmIChwYXJlbnRBcnJheSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBcImZvcmVhY2ggaXMgbm90IHN1cm91bmRlZCBieSBhbiBBcnJheVwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2YXJpYWJsZSA9IGRlZi5mb3JlYWNoLnNwbGl0KFwiIGluIFwiKVswXTtcbiAgICAgICAgdmFyIHNhcnIgPSBkZWYuZm9yZWFjaC5zcGxpdChcIiBpbiBcIilbMV07XG4gICAgICAgIHZhciBhcnIgPSBnZXRWYXIoZGF0YSwgc2Fycik7XG4gICAgICAgIHZhciBwb3MgPSBwYXJlbnRBcnJheS5pbmRleE9mKGRlZik7XG4gICAgICAgIHBhcmVudEFycmF5LnNwbGljZShwb3MsIDEpO1xuXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgYXJyLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBkYXRhW3ZhcmlhYmxlXSA9IGFyclt4XTtcbiAgICAgICAgICAgIGRlbGV0ZSBkZWYuZm9yZWFjaDtcbiAgICAgICAgICAgIHZhciBjb3B5O1xuICAgICAgICAgICAgaWYgKGRlZi5kbylcbiAgICAgICAgICAgICAgICBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkZWYuZG8pKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkZWYpKTtcblxuICAgICAgICAgICAgY29weSA9IHJlcGxhY2VUZW1wbGF0ZXMoY29weSwgZGF0YSk7XG4gICAgICAgICAgICBwYXJlbnRBcnJheS5zcGxpY2UocG9zKyssIDAsIGNvcHkpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBkYXRhW3ZhcmlhYmxlXTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGVmKSkge1xuICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGRlZi5sZW5ndGg7IGErKykge1xuICAgICAgICAgICAgaWYgKGRlZlthXS5mb3JlYWNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlVGVtcGxhdGVzKGRlZlthXSwgZGF0YSwgZGVmKTtcbiAgICAgICAgICAgICAgICBhLS07XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICBkZWZbYV0gPSByZXBsYWNlVGVtcGxhdGVzKGRlZlthXSwgZGF0YSwgZGVmKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgZXJnZWJuaXMgPSBkZWYudG9TdHJpbmcoKS5tYXRjaCgvXFx7XFx7KFxcd3x8XFwuKSpcXH1cXH0vZyk7XG4gICAgICAgIGlmIChlcmdlYm5pcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCBlcmdlYm5pcy5sZW5ndGg7IGUrKykge1xuICAgICAgICAgICAgICAgIGRlZiA9IHJlcGxhY2UoZGVmLCBkYXRhLCBlcmdlYm5pc1tlXS5zdWJzdHJpbmcoMiwgZXJnZWJuaXNbZV0ubGVuZ3RoIC0gMikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgfSBlbHNlIHsvL29iamVjdFx0XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBkZWYpIHtcbiAgICAgICAgICAgIGRlZltrZXldID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZba2V5XSwgZGF0YSk7XG5cbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgZGVmLmVkaXRUb2dldGhlcjsvL1JUZXh0XG4gICAgfVxuICAgIHJldHVybiBkZWY7XG59XG5mdW5jdGlvbiByZXBsYWNlVGVtcGxhdGVzT2xkKGRlZiwgZGF0YSwgcGFyZW50QXJyYXk6IGFueVtdID0gdW5kZWZpbmVkKSB7XG5cbiAgICBpZiAoZGVmLmRhdGF0YWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlcGxhY2VEYXRhdGFibGUoZGVmLCBkYXRhKTtcblxuICAgIH0gZWxzZSBpZiAoZGVmLmZvcmVhY2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvL3Jlc29sdmUgZm9yZWFjaFxuICAgICAgICAvL1x0eyBmb3JlYWNoOiBcImxpbmUgaW4gaW52b2ljZS5saW5lc1wiLCBkbzogWyd7e2xpbmUudGV4dH19JywgJ3t7bGluZS5wcmljZX19JywgJ09LPyddXHRcbiAgICAgICAgaWYgKHBhcmVudEFycmF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IFwiZm9yZWFjaCBpcyBub3Qgc3Vyb3VuZGVkIGJ5IGFuIEFycmF5XCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhcmlhYmxlID0gZGVmLmZvcmVhY2guc3BsaXQoXCIgaW4gXCIpWzBdO1xuICAgICAgICB2YXIgc2FyciA9IGRlZi5mb3JlYWNoLnNwbGl0KFwiIGluIFwiKVsxXTtcbiAgICAgICAgdmFyIGFyciA9IGdldFZhcihkYXRhLCBzYXJyKTtcbiAgICAgICAgdmFyIHBvcyA9IHBhcmVudEFycmF5LmluZGV4T2YoZGVmKTtcbiAgICAgICAgcGFyZW50QXJyYXkuc3BsaWNlKHBvcywgMSk7XG5cbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBhcnIubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGRhdGFbdmFyaWFibGVdID0gYXJyW3hdO1xuICAgICAgICAgICAgdmFyIGNvcHkgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRlZi5kbykpOy8vZGVlcCBjb3B5XG4gICAgICAgICAgICBjb3B5ID0gcmVwbGFjZVRlbXBsYXRlcyhjb3B5LCBkYXRhKTtcbiAgICAgICAgICAgIHBhcmVudEFycmF5LnNwbGljZShwb3MrKywgMCwgY29weSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGRhdGFbdmFyaWFibGVdO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkZWYpKSB7XG4gICAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgZGVmLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgICAgICBpZiAoZGVmW2FdLmZvcmVhY2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VUZW1wbGF0ZXMoZGVmW2FdLCBkYXRhLCBkZWYpO1xuICAgICAgICAgICAgICAgIGEtLTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIGRlZlthXSA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmW2FdLCBkYXRhLCBkZWYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHZhciBlcmdlYm5pcyA9IGRlZi50b1N0cmluZygpLm1hdGNoKC9cXHtcXHsoXFx3fHxcXC4pKlxcfVxcfS9nKTtcbiAgICAgICAgaWYgKGVyZ2VibmlzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IGVyZ2VibmlzLmxlbmd0aDsgZSsrKSB7XG4gICAgICAgICAgICAgICAgZGVmID0gcmVwbGFjZShkZWYsIGRhdGEsIGVyZ2VibmlzW2VdLnN1YnN0cmluZygyLCBlcmdlYm5pc1tlXS5sZW5ndGggLSAyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9IGVsc2Ugey8vb2JqZWN0XHRcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGRlZikge1xuICAgICAgICAgICAgZGVmW2tleV0gPSByZXBsYWNlVGVtcGxhdGVzKGRlZltrZXldLCBkYXRhKTtcblxuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBkZWYuZWRpdFRvZ2V0aGVyOy8vUlRleHRcbiAgICB9XG4gICAgcmV0dXJuIGRlZjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJlcCA9IG5ldyBQREZSZXBvcnQoKTtcbiAgICB2YXIgZGVmID0ge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpbnZvaWNlOiB7XG4gICAgICAgICAgICAgICAgbnVtYmVyOiAxMDAwLFxuICAgICAgICAgICAgICAgIGRhdGU6IFwiMjAuMDcuMjAxOFwiLFxuICAgICAgICAgICAgICAgIGN1c3RvbWVyOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0bmFtZTogXCJIZW5yeVwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0bmFtZTogXCJLbGF1c1wiLFxuICAgICAgICAgICAgICAgICAgICBzdHJlZXQ6IFwiSGF1cHRzdHIuIDE1N1wiLFxuICAgICAgICAgICAgICAgICAgICBwbGFjZTogXCJjaGVtbml0elwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgeyBwb3M6IDEsIHRleHQ6IFwidGhpcyBpcyB0aGUgZmlyc3QgcG9zaXRpb24sIGxrc2pkZmxnc2QgZXIgd2Ugd2VyIHdyZSBlciBlciBlciByZSB3ZWtmZ2pzbGtkZmpqZGsgc2dmc2RnXCIsIHByaWNlOiAxMC4wMCwgYW1vdW50OiA1MCwgdmFyaWFudGU6IFt7IG06IDEgfSwgeyBtOiAyIH1dIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgcG9zOiAyLCB0ZXh0OiBcInRoaXMgaXMgdGhlIG5leHQgcG9zaXRpb25cIiwgcHJpY2U6IDIwLjUwLCB9LFxuICAgICAgICAgICAgICAgICAgICB7IHBvczogMywgdGV4dDogXCJ0aGlzIGlzIGFuIG90aGVyIHBvc2l0aW9uXCIsIHByaWNlOiAxOS41MCB9LFxuICAgICAgICAgICAgICAgICAgICB7IHBvczogNCwgdGV4dDogXCJ0aGlzIGlzIHRoZSBsYXN0IHBvc2l0aW9uXCIsIHByaWNlOiA1MC4wMCB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgc3VtbWFyeTogW1xuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiU3VidG90YWxcIiwgdmFsdWU6IDEwMC4wMCB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiVGF4XCIsIHZhbHVlOiAxOS4wMCB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiU3VidG90YWxcIiwgdmFsdWU6IDExOS4wMCB9LFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgc3RhY2s6IFt7XG4gICAgICAgICAgICAgICAgIC8vZm9udDogXCJFeHBsZXR1c1NhbnNcIixcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICd7e2ludm9pY2UuY3VzdG9tZXIuZmlyc3RuYW1lfX0ge3tpbnZvaWNlLmN1c3RvbWVyLmxhc3RuYW1lfX0nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAne3tpbnZvaWNlLmN1c3RvbWVyLnN0cmVldH19JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ3t7aW52b2ljZS5jdXN0b21lci5wbGFjZX19JyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnSW52b2ljZScsIGZvbnRTaXplOiAxOCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCIgXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiRGF0ZToge3tpbnZvaWNlLmRhdGV9fVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcIk51bWJlcjoge3tpbnZvaWNlLm51bWJlcn19XCIsIGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiIFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcIiBcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHRhYmxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFsnSXRlbScsICdQcmljZSddLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2g6IFwibGluZSBpbiBpbnZvaWNlLmxpbmVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG86IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3t7bGluZS50ZXh0fX0nLCAne3tsaW5lLnByaWNlfX0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkYXRhdGFibGU6IHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiBbeyB0ZXh0OiBcIkl0ZW1cIiB9LCB7IHRleHQ6IFwiUHJpY2VcIiB9XSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YWZvcmVhY2g6IFwibGluZSBpbiBpbnZvaWNlLmxpbmVzXCIsXG4gICAgICAgICAgICAgICAgICAgIC8vZm9vdGVyOlt7IHRleHQ6XCJUb3RhbFwifSx7IHRleHQ6XCJcIn1dLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBbeyB0ZXh0OiAne3tsaW5lLnRleHR9fScgfSwgeyB0ZXh0OiAne3tsaW5lLnByaWNlfX0nIH1dLFxuICAgICAgICAgICAgICAgICAgICBncm91cHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogXCJsaW5lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb290ZXI6IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IHRleHQ6IFwiIFwiIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yZWFjaDogXCJzdW0gaW4gaW52b2ljZS5zdW1tYXJ5XCIsXG4gICAgICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwie3tzdW0udGV4dH19XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcInt7c3VtLnZhbHVlfX1cIiB9LFxuICAgICAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH07XG4gICAgZGVmLmNvbnRlbnQgPSByZXBsYWNlVGVtcGxhdGVzKGRlZi5jb250ZW50LCBkZWYuZGF0YSk7XG4gICAgcmVwLnZhbHVlID0gZGVmO1xuICAgIHZhciB2aWV3ZXIgPSBuZXcgUERGVmlld2VyKCk7XG4gICAgdmlld2VyLnZhbHVlID0gYXdhaXQgcmVwLmdldEJhc2U2NCgpO1xuICAgIHJldHVybiB2aWV3ZXI7XG59XG5cblxuIl19