var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("jassi_report/PDFReport", ["require", "exports", "jassi/remote/Jassi", "jassi_report/ext/pdfmake", "jassi_report/PDFViewer"], function (require, exports, Jassi_1, pdfmake_1, PDFViewer_1) {
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
define("jassi_report/PDFViewer", ["require", "exports", "jassi/ui/Button", "jassi_report/ext/pdfjs", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/BoxPanel"], function (require, exports, Button_1, pdfjs_1, Component_1, Jassi_2, Panel_1, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.PDFViewer = void 0;
    class Canavas extends Component_1.Component {
        constructor() {
            super();
            super.init($('<canvas type="pdfviewer"></canvas>')[0]);
        }
    }
    let PDFViewer = class PDFViewer extends Panel_1.Panel {
        constructor() {
            super();
            this._page = 1;
            //super.init(undefined);//$('<canvas type="pdfviewer"></canvas>')[0]);
            this.pdfjsLib = pdfjs_1.default;
            this.pdfDoc = null;
            this.pageNum = 1;
            this.pageRendering = false;
            this.pageNumPending = null;
            this.scale = 0.8;
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.toolbar = new BoxPanel_1.BoxPanel();
            me.canavasPanel = new Canavas();
            me.plus = new Button_1.Button();
            me.minus = new Button_1.Button();
            var _this = this;
            me.download = new Button_1.Button();
            //me.canavasPanel.height="90%";
            //	me.canavasPanel.width="90%";
            //	var cn=$('<canvas type="pdfviewer"></canvas>')[0]
            this.canvas = me.canavasPanel.dom;
            //this.dom.appendChild(cn);
            //this.canvas = cn;
            this.ctx = this.canvas.getContext('2d');
            this.add(me.toolbar);
            this.add(me.canavasPanel);
            me.toolbar.add(me.plus);
            me.toolbar.horizontal = true;
            me.toolbar.add(me.download);
            me.toolbar.add(me.minus);
            me.plus.text = "+";
            me.plus.onclick(function (event) {
                _this.scale = _this.scale * 1.4;
                _this.renderPage(_this._page);
            });
            me.minus.text = "-";
            me.minus.onclick(function (event) {
                _this.scale = _this.scale / 1.4;
                _this.renderPage(_this._page);
            });
            me.download.text = "download";
            me.download.onclick(function (event) {
                _this.report.open();
            });
        }
        renderPage(num) {
            // The workerSrc property shall be specified.
            this.pageRendering = true;
            // Using promise to fetch the page
            var _this = this;
            this.pdfDoc.getPage(num).then(function (page) {
                var viewport = page.getViewport({ scale: _this.scale });
                _this.canvas.height = viewport.height;
                _this.canvas.width = viewport.width;
                _this.width = viewport.width;
                _this.height = viewport.height;
                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: _this.ctx,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                // Wait for rendering to finish
                renderTask.promise.then(function () {
                    _this.pageRendering = false;
                    if (_this.pageNumPending !== null) {
                        // New page rendering is pending
                        _this.renderPage(_this.pageNumPending);
                        _this.pageNumPending = null;
                    }
                });
            });
        }
        queueRenderPage(num) {
            if (this.pageRendering) {
                this.pageNumPending = num;
            }
            else {
                this.renderPage(num);
            }
        }
        /**
         * Displays previous page.
         */
        onPrevPage() {
            if (this.pageNum <= 1) {
                return;
            }
            this.pageNum--;
            this.queueRenderPage(this.pageNum);
        }
        /**
         * Displays next page.
         */
        onNextPage() {
            if (this.pageNum >= this.pdfDoc.numPages) {
                return;
            }
            this.pageNum++;
            this.queueRenderPage(this.pageNum);
        }
        /**
         * @member {data} - the caption of the button
         */
        set value(value) {
            this._data = value;
            var pdfData = atob(this._data);
            var loadingTask = this.pdfjsLib.getDocument({ data: pdfData });
            var _this = this;
            loadingTask.promise.then(function (pdf) {
                _this.pdfDoc = pdf;
                _this.queueRenderPage(_this._page);
            }, function (e) {
                var g = e;
            });
        }
        get value() {
            return this._data;
            //return  $(this.checkbox).prop("checked");
        }
        /**
         * @member {number} - the current page number
         */
        set page(value) {
            this._page = value;
        }
        get page() {
            return this._page;
            //return  $(this.checkbox).prop("checked");
        }
    };
    PDFViewer = __decorate([
        Jassi_2.$Class("jassi_report.PDFViewer"),
        __metadata("design:paramtypes", [])
    ], PDFViewer);
    exports.PDFViewer = PDFViewer;
    async function test() {
        var ret = new PDFViewer();
        //testdocument
        var data = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
            'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
            'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
            'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
            'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
            'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
            'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
            'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
            'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
            'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
            'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
            'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
            'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';
        ret.value = data;
        return ret;
    }
    exports.test = test;
});
define("jassi_report/RColumns", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property", "jassi_report/ReportDesign", "jassi_report/ReportComponent"], function (require, exports, Jassi_3, Property_1, ReportDesign_1, ReportComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RColumns = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RColumns = class RColumns extends ReportComponent_1.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "columns";
            $(this.domWrapper).addClass('BoxPanel').removeClass('Panel');
            $(this.dom).css("display", "table");
            $(this.dom).css("min-width", "50px");
            // this.width="300px"
        }
        /**
       * adds a component to the container before an other component
       * @param {jassi.ui.Component} component - the component to add
       * @param {jassi.ui.Component} before - the component before then component to add
       */
        addBefore(component, before) {
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter=true;
            }
            super.addBefore(component, before);
            $(component.domWrapper).css("display", "table-cell");
        }
        /**
      * adds a component to the container
      * @param {jassi.ui.Component} component - the component to add
      */
        add(component) {
            super.add(component);
            $(component.domWrapper).css("display", "table-cell");
        }
        toJSON() {
            var ret = super.toJSON();
            ret.columns = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.columns.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            for (let x = 0; x < ob.columns.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(ob.columns[x]));
            }
            delete ob.columns;
            super.fromJSON(ob);
            return ret;
        }
    };
    RColumns = __decorate([
        ReportComponent_1.$ReportComponent({ fullPath: "report/Columns", icon: "mdi mdi-view-parallel-outline", editableChildComponents: ["this"] }),
        Jassi_3.$Class("jassi_report.RColumns"),
        Property_1.$Property({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], RColumns);
    exports.RColumns = RColumns;
});
//    jassi.register("reportcomponent","jassi_report.Stack","report/Stack","res/boxpanel.ico");
define("jassi_report/RDatatable", ["require", "exports", "jassi/remote/Jassi", "jassi_report/RText", "jassi_report/ReportComponent", "jassi_report/RTablerow", "jassi/ui/Property"], function (require, exports, Jassi_4, RText_1, ReportComponent_2, RTablerow_1, Property_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RDatatable = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let RDatatable = class RDatatable extends ReportComponent_2.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "datatable";
            this.headerPanel = new RTablerow_1.RTablerow();
            this.bodyPanel = new RTablerow_1.RTablerow();
            this.footerPanel = new RTablerow_1.RTablerow();
            this.widths = [];
            super.init($("<table style='nin-width:50px;table-layout: fixed'></table>")[0]);
            //	this.backgroundPanel.width="500px";
            //$(this.backgroundPanel.dom).css("min-width","200px");
            //$(this.dom).css("display", "table");
            // $(this.dom).css("min-width", "50px");
            $(this.footerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tablefooter</text></svg>" + '")');
            $(this.headerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tableheader</text></svg>" + '")');
            this.add(this.headerPanel);
            this.add(this.bodyPanel);
            this.add(this.footerPanel);
        }
        _setDesignMode(enable) {
            //do nothing - no add button
        }
        /*	get design():any{
                return this.toJSON();
            };
            set design(value:any){
                ReportDesign.fromJSON(value,this);
            }*/
        fillTableRow(row, count) {
            if (!row._designMode || count - row._components.length !== 1)
                return;
            for (var x = row._components.length; x < count; x++) {
                var rr = new RText_1.RText();
                row.addBefore(rr, row._components[row._components.length - 1]); //after addbutton
            }
        }
        addEmptyCellsIfNeeded(row) {
            var count = row._components.length;
            this.fillTableRow(this.headerPanel, count);
            this.fillTableRow(this.bodyPanel, count);
            this.fillTableRow(this.footerPanel, count);
        }
        /**
        * sets the width of a table cell
        * @param component - the table cell
        * @param width - the new width
        **/
        setChildWidth(component, width) {
            var max = 0;
            var found = -1;
            for (var x = 0; x < this._components.length; x++) {
                for (var i = 0; i < this._components[x]._components.length; i++) {
                    if (i > max)
                        max = i;
                    var row = this._components[x]._components[i];
                    if (row === component)
                        found = i;
                }
            }
            for (var t = this.widths.length; t < max; t++) {
                this.widths.push("auto");
            }
            if (found !== -1) {
                this.widths[found] = width;
                var test = this.headerPanel._components[found].domWrapper;
                $(this._components[0]._components[found].domWrapper).attr("width", width);
            }
            //this._parent.setChildWidth(component,value);
        }
        /**
         * gets the width of a table cell
         * @param component - the table cell
         **/
        getChildWidth(component) {
            var found = -1;
            for (var x = 0; x < this._components.length; x++) {
                if (this._components[x]._components) {
                    for (var i = 0; i < this._components[x]._components.length; i++) {
                        var row = this._components[x]._components[i];
                        if (row === component)
                            found = i;
                    }
                }
            }
            if (found !== -1)
                return this.widths[found];
            //this._parent.setChildWidth(component,value);
        }
        create(ob) {
        }
        fromJSON(obj, target = undefined) {
            var ob = obj.datatable;
            var ret = this;
            // this.removeAll();
            //ret.headerPanel.removeAll();
            //ret.bodyPanel.removeAll();
            //ret.footerPanel.removeAll();
            /* this.add(this.backgroundPanel);
             this.add(this.headerPanel);
             this.add(this.content);
             this.add(this.footerPanel);*/
            if (ob.header) {
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.header);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.headerPanel.add(obp); });
                delete ob.header;
                obb.destroy();
            }
            if (ob.body) {
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.body);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.bodyPanel.add(obp); });
                delete ob.body;
                obb.destroy();
            }
            if (ob.footer) {
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.footer);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.footerPanel.add(obp); });
                delete ob.footer;
                obb.destroy();
            }
            if (ob.widths) {
                ret.widths = ob.widths;
                delete ob.widths;
            }
            var tr = this._components[0];
            for (var x = 0; x < tr._components.length; x++) {
                $(tr._components[x].domWrapper).attr("width", this.widths[x]);
            }
            ret.dataforeach = ob.dataforeach;
            delete ob.dataforeach;
            delete ob.datatable;
            super.fromJSON(ob);
            for (var x = 0; x < ret._components.length; x++) {
                ret._components[x].correctHideAfterSpan();
            }
            return ret;
        }
        toJSON() {
            var r = {};
            var ret = super.toJSON();
            ret.datatable = r;
            //var _this = this;
            if (this.widths && this.widths.length > 0) {
                r.widths = this.widths;
                var len = this.headerPanel._components.length;
                if (this.headerPanel._designMode)
                    len--;
                for (var t = r.widths.length; t < len; t++) {
                    r.widths.push("auto");
                }
                //remove width
                while (r.widths.length > len) {
                    r.widths.pop();
                }
            }
            if (!(this.headerPanel._components.length === 0 || (this.headerPanel._designMode && this.headerPanel._components.length === 1))) {
                r.header = this.headerPanel.toJSON();
            }
            if (!(this.footerPanel._components.length === 0 || (this.footerPanel._designMode && this.footerPanel._components.length === 1))) {
                r.footer = this.footerPanel.toJSON();
            }
            r.dataforeach = this.dataforeach;
            r.body = this.bodyPanel.toJSON();
            return ret;
        }
    };
    __decorate([
        Property_2.$Property(),
        __metadata("design:type", String)
    ], RDatatable.prototype, "dataforeach", void 0);
    RDatatable = __decorate([
        ReportComponent_2.$ReportComponent({ fullPath: "report/Datatable", icon: "mdi mdi-file-table-box-multiple-outline", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] }),
        Jassi_4.$Class("jassi_report.RDatatable"),
        __metadata("design:paramtypes", [Object])
    ], RDatatable);
    exports.RDatatable = RDatatable;
    async function test() {
    }
    exports.test = test;
});
define("jassi_report/RStack", ["require", "exports", "jassi/remote/Jassi", "jassi_report/ReportDesign", "jassi_report/ReportComponent"], function (require, exports, Jassi_5, ReportDesign_2, ReportComponent_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RStack = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RStack = 
    //@$Property({name:"horizontal",hide:true})
    class RStack extends ReportComponent_3.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "stack";
            $(this.dom).css("flex-direction", "column");
        }
        toJSON() {
            var ret = super.toJSON();
            ret.stack = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.stack.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            for (let x = 0; x < ob.stack.length; x++) {
                ret.add(ReportDesign_2.ReportDesign.fromJSON(ob.stack[x]));
            }
            delete ob.stack;
            super.fromJSON(ob);
            return ret;
        }
    };
    RStack = __decorate([
        ReportComponent_3.$ReportComponent({ fullPath: "report/Stack", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        Jassi_5.$Class("jassi_report.RStack")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RStack);
    exports.RStack = RStack;
});
//    jassi.register("reportcomponent","jassi_report.Stack","report/Stack","res/boxpanel.ico");
define("jassi_report/RTablerow", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi_report/ReportDesign", "jassi_report/ReportComponent"], function (require, exports, Jassi_6, Component_2, ReportDesign_3, ReportComponent_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTablerow = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RTablerow = 
    //@$Property({name:"horizontal",hide:true})
    class RTablerow extends ReportComponent_4.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "tablerow";
            properties = undefined === properties ? {} : properties;
            properties.noWrapper = true;
            super.init($("<tr></tr>")[0], properties);
        }
        toJSON() {
            var columns = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                columns.push(this._components[x].toJSON());
            }
            //Object.assign(ret, this["otherProperties"]);
            return columns;
        }
        oncomponentAdded(callback) {
            this.addEvent("componentAdded", callback);
        }
        get _editorselectthis() {
            return this._parent;
        }
        setChildWidth(component, value) {
            var _a;
            (_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth(component, value);
        }
        getChildWidth(component) {
            var _a;
            return (_a = this._parent) === null || _a === void 0 ? void 0 : _a.getChildWidth(component);
        }
        wrapComponent(component) {
            var colspan = $(component.domWrapper).attr("colspan"); //save colspan
            Component_2.Component.replaceWrapper(component, document.createElement("td"));
            $(component.domWrapper).attr("colspan", colspan);
            $(component.domWrapper).css("word-break", "break-all");
            $(component.domWrapper).css("display", "");
        }
        correctHideAfterSpan() {
            //rowspan
            var span;
            for (var x = 0; x < this._components.length; x++) {
                if (this._components[x]["colSpan"]) {
                    span = this._components[x]["colSpan"];
                }
                else {
                    span--;
                    if (span > 0) {
                        $(this._components[x].domWrapper).addClass("invisibleAfterColspan");
                    }
                    else {
                        $(this._components[x].domWrapper).removeClass("invisibleAfterColspan");
                    }
                }
            }
        }
        /**
        * adds a component to the container
        * @param {jassi.ui.Component} component - the component to add
        */
        add(component) {
            this.wrapComponent(component);
            super.add(component);
            // $(component.domWrapper).css("display", "table-cell");
            this.callEvent("componentAdded", component, this);
            if (this._parent)
                this._parent.addEmptyCellsIfNeeded(this);
        }
        /**
      * adds a component to the container before an other component
      * @param {jassi.ui.Component} component - the component to add
      * @param {jassi.ui.Component} before - the component before then component to add
      */
        addBefore(component, before) {
            this.wrapComponent(component);
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter = true;
            }
            super.addBefore(component, before);
            // $(component.domWrapper).css("display", "table-cell");
            this.callEvent("componentAdded", component, this);
            if (this._parent)
                this._parent.addEmptyCellsIfNeeded(this);
        }
        fromJSON(columns) {
            var ret = this;
            for (let x = 0; x < columns.length; x++) {
                ret.add(ReportDesign_3.ReportDesign.fromJSON(columns[x]));
            }
            return ret;
        }
    };
    RTablerow = __decorate([
        ReportComponent_4.$ReportComponent({ editableChildComponents: ["this"] }),
        Jassi_6.$Class("jassi_report.RTablerow")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RTablerow);
    exports.RTablerow = RTablerow;
});
//    jassi.register("reportcomponent","jassi_report.Stack","report/Stack","res/boxpanel.ico");
define("jassi_report/RText", ["require", "exports", "jassi/remote/Jassi", "jassi_report/ReportComponent", "jassi/ui/HTMLPanel", "jassi/ui/Property", "jassi_report/ReportDesign"], function (require, exports, Jassi_7, ReportComponent_5, HTMLPanel_1, Property_3, ReportDesign_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RText = void 0;
    class InlineStyling {
    }
    let RText = class RText extends ReportComponent_5.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.toolbar = ['undo redo | bold italic underline', 'forecolor backcolor | fontsizeselect  '];
            this.reporttype = "text";
            super.init($('<div class="RText jdisableaddcomponents" ><div  class="HTMLPanelContent"></div></div>')[0]);
            $(this.__dom).css("text-overflow", "ellipsis");
            $(this.__dom).css("overflow", "hidden");
            //  super.init($('<div class="RText"></div>')[0]);
            var el = this.dom.children[0];
            this._designMode = false;
            $(this.dom).css("display", "block");
            this.css({ font_family: "Roboto", font_size: "12px" });
            //   $(this.dom.children[0]).css("display","inline-block");
            this.extensionCalled = HTMLPanel_1.HTMLPanel.prototype.extensionCalled.bind(this);
            this._setDesignMode = HTMLPanel_1.HTMLPanel.prototype._setDesignMode.bind(this);
        }
        get value() {
            var el = this.dom.children[0];
            if (el === undefined)
                return "";
            var ret = $(el).html();
            return ret;
        }
        set value(code) {
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(code);
                this.dom.appendChild(el);
            }
            else
                $(el).html(code);
        }
        get bold() {
            return this._bold;
        }
        set bold(value) {
            this._bold = value;
            $(this.dom).css("font-weight", value ? "bold" : "normal");
        }
        get italics() {
            return this._italics;
        }
        set italics(value) {
            this._italics = value;
            $(this.dom).css("font-style", value ? "italic" : "normal");
        }
        get fontSize() {
            return this._fontSize;
        }
        set fontSize(value) {
            if (value === undefined)
                $(this.dom).css("font-size", "");
            else
                $(this.dom).css("font-size", value + "px");
        }
        get background() {
            return this._background;
        }
        set background(value) {
            this._background = value;
            $(this.dom).css("background-color", value);
        }
        get color() {
            return this._color;
        }
        set color(value) {
            this._color = value;
            $(this.dom).css("color", value);
        }
        get alignment() {
            return this._alignment;
        }
        set alignment(value) {
            this._alignment = value;
            $(this.dom).css("text-align", value);
        }
        get decoration() {
            return this._decoration;
        }
        set decoration(value) {
            this._decoration = value;
            var val = "none";
            if (value === "underline")
                val = "underline";
            if (value === "lineThrough")
                val = "line-through";
            if (value === "overline")
                val = "overline";
            $(this.dom).css("text-decoration", val);
        }
        get decorationColor() {
            return this._decorationColor;
        }
        set decorationColor(value) {
            this._decorationColor = value;
            $(this.dom).css("textDecorationColor", value);
        }
        get decorationStyle() {
            return this._decorationStyle;
        }
        set decorationStyle(value) {
            this._decorationStyle = value;
            var val = "solid";
            if (value === "dashed")
                val = "dashed";
            if (value === "dotted")
                val = "dotted";
            if (value === "double")
                val = "double";
            if (value === "wavy")
                val = "wavy";
            $(this.dom).css("textDecorationStyle", val);
        }
        get lineHeight() {
            return this._lineHeight;
        }
        set lineHeight(value) {
            this._lineHeight = value;
            $(this.dom).css("line-height", value);
            //  super.width = value;
        }
        /*@$Property()
        get text():string{
            //check for htmlcode
            
            return super.value;
        }
        set text(val:string){
            if(val!==undefined&&val!==""){
                var h="<span>hallo<b>du</b></span>";
                var node=$("<span>"+val+"</span>");
                if(node[0].innerText!==node[0].innerHTML){
                    
                }
            }
            super.value=val;
        }*/
        fromJSON(ob) {
            var ret = this;
            if (ob.editTogether) {
                delete ob.editTogether;
                ret.convertToHTML(ob.text);
            }
            else
                ret.value = ob.text;
            delete ob.text;
            if (ob.width) {
                ret.width = ob.width;
                delete ob.width;
            }
            if (ob.bold) {
                ret.bold = ob.bold;
                delete ob.bold;
            }
            if (ob.italics) {
                ret.italics = ob.italics;
                delete ob.italics;
            }
            if (ob.color) {
                ret.color = ob.color;
                delete ob.color;
            }
            if (ob.decoration) {
                ret.decoration = ob.decoration;
                delete ob.decoration;
            }
            if (ob.decorationStyle) {
                ret.decorationStyle = ob.decorationStyle;
                delete ob.decorationStyle;
            }
            if (ob.decorationColor) {
                ret.decorationColor = ob.decorationColor;
                delete ob.decorationColor;
            }
            if (ob.fontSize) {
                ret.fontSize = ob.fontSize;
                delete ob.fontSize;
            }
            if (ob.lineHeight) {
                ret.lineHeight = ob.lineHeight;
                delete ob.lineHeight;
            }
            if (ob.alignment) {
                ret.alignment = ob.alignment;
                delete ob.alignment;
            }
            if (ob.background) {
                ret.background = ob.background;
                delete ob.background;
            }
            super.fromJSON(ob);
            // ret.otherProperties = ob;
            return this;
        }
        convertFromHTMLNode(node, list, style) {
            for (var x = 0; x < node.childNodes.length; x++) {
                var child = node.childNodes[x];
                if (child.nodeName === "#text") {
                    var rt = {};
                    if (style.bold)
                        rt.bold = true;
                    if (style.background)
                        rt.background = style.background;
                    if (style.color)
                        rt.color = style.color;
                    if (style.fontsize)
                        rt.fontSize = style.fontsize;
                    if (style.underline)
                        rt.decoration = "underline";
                    if (style.italics)
                        rt.italics = style.italics;
                    rt.text = child["data"];
                    list.push(rt);
                }
                else if (child.nodeName === "STRONG") {
                    style.bold = true;
                    this.convertFromHTMLNode(child, list, style);
                    delete style.bold;
                }
                else if (child.nodeName === "EM") {
                    style.italics = true;
                    this.convertFromHTMLNode(child, list, style);
                    delete style.italics;
                }
                if (child.nodeName === "SPAN" && child["style"].color !== "") {
                    style.color = this.fullColorHex(child["style"].color);
                    this.convertFromHTMLNode(child, list, style);
                    delete style.color;
                }
                else if (child.nodeName === "SPAN" && child["style"]["background-color"] !== "") {
                    style.background = this.fullColorHex(child["style"]["background-color"]);
                    this.convertFromHTMLNode(child, list, style);
                    delete style.background;
                }
                else if (child.nodeName === "SPAN" && child["style"]["font-size"] !== "") {
                    style.fontsize = Number(child["style"]["font-size"].replace("pt", ""));
                    this.convertFromHTMLNode(child, list, style);
                    delete style.fontsize;
                }
                else if (child.nodeName === "SPAN" && child["style"]["text-decoration"] !== "") {
                    style.underline = (child["style"]["text-decoration"] === "underline");
                    this.convertFromHTMLNode(child, list, style);
                    delete style.underline;
                }
            }
        }
        rgbToHex(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex;
        }
        ;
        //rgb(1,2,3)
        fullColorHex(text) {
            var c = text.split("(")[1].split(")")[0].split(",");
            var red = this.rgbToHex(c[0]);
            var green = this.rgbToHex(c[1]);
            var blue = this.rgbToHex(c[2]);
            return "#" + red + green + blue;
        }
        ;
        convertToHTML(obs) {
            var html = "";
            for (var x = 0; x < obs.length; x++) {
                var ob = obs[x];
                var anz = 0;
                var tagcount = 0;
                if (ob.bold) {
                    html += "<strong>";
                }
                if (ob.italics) {
                    html += "<em>";
                }
                if (ob.background || ob.color || ob.decoration === "underline" || ob.fontSize) {
                    if (ob.color) {
                        html += "<span style='color:" + ob.color + "'>";
                        tagcount++;
                    }
                    if (ob.background) {
                        html += "<span style='background-color:" + ob.background + "'>";
                        tagcount++;
                    }
                    if (ob.decoration) {
                        html += "<span style='text-decoration:" + ob.decoration + "'>";
                        tagcount++;
                    }
                    if (ob.fontSize) {
                        html += "<span style='font-size:" + ob.fontSize + "pt'>";
                        tagcount++;
                    }
                }
                html += ob.text.replaceAll("\n", "<br/>");
                for (var t = 0; t < tagcount; t++) {
                    html += "</span>";
                }
                if (ob.italics) {
                    html += "</em>";
                }
                if (ob.bold) {
                    html += "</strong>";
                }
            }
            this.value = html;
        }
        convertFromHTML(ret) {
            var sval = decodeURI(this.value);
            sval = sval.replaceAll("<br>", "\n");
            ret.text = sval; //.replaceAll("<br>","\\n");
            var node = $("<span>" + ret.text + "</span>");
            if (node[0].innerText !== node[0].innerHTML) { //htmltext
                var style = new InlineStyling();
                var list = [];
                this.convertFromHTMLNode(node[0], list, style);
                ret.editTogether = true;
                ret.text = list;
            }
            return ret;
        }
        toJSON() {
            var _a;
            var ret = super.toJSON();
            this.convertFromHTML(ret);
            if (this.width !== undefined && !((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth))
                ret.width = this.width;
            if (this.bold !== undefined)
                ret.bold = this.bold;
            if (this.italics !== undefined)
                ret.italics = this.italics;
            if (this.color !== undefined)
                ret.color = this.color;
            if (this.decoration !== undefined)
                ret.decoration = this.decoration;
            if (this.decorationStyle !== undefined)
                ret.decorationStyle = this.decorationStyle;
            if (this.decorationColor !== undefined)
                ret.decorationColor = this.decorationColor;
            if (this.fontSize !== undefined)
                ret.fontSize = this.fontSize;
            if (this.lineHeight !== undefined)
                ret.lineHeight = this.lineHeight;
            if (this.alignment !== undefined)
                ret.alignment = this.alignment;
            if (this.background !== undefined)
                ret.background = this.background;
            return ret;
        }
    };
    __decorate([
        Property_3.$Property({ chooseFrom: function (component) {
                return ReportDesign_4.ReportDesign.getVariables(component);
            } }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "value", null);
    __decorate([
        Property_3.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RText.prototype, "bold", null);
    __decorate([
        Property_3.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RText.prototype, "italics", null);
    __decorate([
        Property_3.$Property(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RText.prototype, "fontSize", null);
    __decorate([
        Property_3.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "background", null);
    __decorate([
        Property_3.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "color", null);
    __decorate([
        Property_3.$Property({ chooseFrom: ["left", "center", "right"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "alignment", null);
    __decorate([
        Property_3.$Property({ chooseFrom: ["underline", "lineThrough", "overline"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "decoration", null);
    __decorate([
        Property_3.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "decorationColor", null);
    __decorate([
        Property_3.$Property({ chooseFrom: ["dashed", "dotted", "double", "wavy"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "decorationStyle", null);
    __decorate([
        Property_3.$Property({ default: 1 }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RText.prototype, "lineHeight", null);
    RText = __decorate([
        ReportComponent_5.$ReportComponent({ fullPath: "report/Text", icon: "mdi mdi-format-color-text" }),
        Jassi_7.$Class("jassi_report.RText")
        //@$Property({hideBaseClassProperties:true})
        ,
        Property_3.$Property({ name: "value", type: "string", description: "text" }),
        __metadata("design:paramtypes", [Object])
    ], RText);
    exports.RText = RText;
    function test() {
        var t = new RText();
        t.value = "a<em>b<strong>cd</strong>e</em><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>fg<span style='background-color: rgb(186, 55, 42);' data-mce-style='background-color: #ba372a;'>h</span></span><span style='background-color: rgb(186, 55, 42);' data-mce-style='background-color: #ba372a;'>ij<span style='font-size: 14pt;' data-mce-style='font-size: 14pt;'>k</span></span><span style='font-size: 14pt;' data-mce-style='font-size: 14pt;'>l<span style='text-decoration: underline;' data-mce-style='text-decoration: underline;'>m</span></span><span style='text-decoration: underline;' data-mce-style='text-decoration: underline;'>no</span>";
        var obb = t.toJSON();
        //var test = RText.fromJSON(obb);
    }
    exports.test = test;
});
define("jassi_report/RUnknown", ["require", "exports", "jassi/remote/Jassi", "jassi_report/ReportComponent"], function (require, exports, Jassi_8, ReportComponent_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUnknown = void 0;
    //@$ReportComponent({fullPath:"report/Text",icon:"res/textbox.ico",initialize:{value:"text"}})
    let RUnknown = class RUnknown extends ReportComponent_6.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "unkown";
            super.init($('<span class="InvisibleComponent"></span>')[0]);
            this.horizonzal = false;
        }
        fromJSON(ob) {
            var ret = this;
            super.fromJSON(ob);
            // Object.assign(ret,this.otherProperties);
            return ret;
        }
        toJSON() {
            var ret = super.toJSON();
            Object.assign(ret, this.otherProperties);
            return ret;
        }
    };
    RUnknown = __decorate([
        Jassi_8.$Class("jassi_report.RUnknown"),
        __metadata("design:paramtypes", [Object])
    ], RUnknown);
    exports.RUnknown = RUnknown;
});
define("jassi_report/ReportComponent", ["require", "exports", "jassi/ui/Component", "jassi/remote/Registry", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Property"], function (require, exports, Component_3, Registry_1, Jassi_9, Panel_2, Property_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReportComponent = exports.$ReportComponent = exports.ReportComponentProperties = void 0;
    class ReportComponentProperties extends Component_3.UIComponentProperties {
    }
    exports.ReportComponentProperties = ReportComponentProperties;
    function $ReportComponent(properties) {
        return function (pclass) {
            Registry_1.default.register("$ReportComponent", pclass, properties);
        };
    }
    exports.$ReportComponent = $ReportComponent;
    let ReportComponent = class ReportComponent extends Panel_2.Panel {
        constructor() {
            super(...arguments);
            this.reporttype = "nothing";
        }
        get colSpan() {
            /*if(this._parent?.setChildWidth!==undefined)
                return this._parent.getChildWidth(this);
            else
                return this._width;*/
            return this._colSpan;
        }
        set colSpan(value) {
            $(this.domWrapper).attr("colspan", value === undefined ? "" : value);
            /*	if(this._parent?.setChildWidth!==undefined)
                    this._parent.setChildWidth(this,value);
                else{
                    this._width = value;
                    console.log(value);
                    super.width = value;
                }*/
            this._colSpan = value;
            if (this._parent)
                this._parent.correctHideAfterSpan();
        }
        get width() {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                return this._parent.getChildWidth(this);
            else
                return this._width;
        }
        set width(value) {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                this._parent.setChildWidth(this, value);
            else {
                this._width = value;
                console.log(value);
                super.width = value;
            }
        }
        fromJSON(ob) {
            var ret = this;
            if (ob.foreach) {
                ret.foreach = ob.foreach;
                delete ob.foreach;
            }
            if (ob.colSpan) {
                ret.colSpan = ob.colSpan;
                delete ob.colSpan;
            }
            ret.otherProperties = ob;
            return ret;
        }
        toJSON() {
            var ret = {};
            if (this.colSpan !== undefined)
                ret.colSpan = this.colSpan;
            if (this.foreach !== undefined)
                ret.foreach = this.foreach;
            Object.assign(ret, this["otherProperties"]);
            return ret;
        }
    };
    __decorate([
        Property_4.$Property(),
        __metadata("design:type", String)
    ], ReportComponent.prototype, "foreach", void 0);
    __decorate([
        Property_4.$Property({
            type: "string",
            isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], ReportComponent.prototype, "colSpan", null);
    __decorate([
        Property_4.$Property({ type: "string", isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns";
            } }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ReportComponent.prototype, "width", null);
    ReportComponent = __decorate([
        Jassi_9.$Class("jassi_report.ReportComponent"),
        Property_4.$Property({ hideBaseClassProperties: true })
    ], ReportComponent);
    exports.ReportComponent = ReportComponent;
});
define("jassi_report/ReportDesign", ["require", "exports", "jassi/ui/BoxPanel", "jassi/remote/Jassi", "jassi_report/RStack", "jassi_report/RText", "jassi_report/RColumns", "jassi_report/RUnknown", "jassi_report/ReportComponent", "jassi_report/RDatatable", "jassi/ui/Property"], function (require, exports, BoxPanel_2, Jassi_10, RStack_1, RText_2, RColumns_1, RUnknown_1, ReportComponent_7, RDatatable_1, Property_5) {
    "use strict";
    var ReportDesign_5;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportDesign = void 0;
    let InfoProperties = class InfoProperties {
    };
    __decorate([
        Property_5.$Property({ description: "the title of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "title", void 0);
    __decorate([
        Property_5.$Property({ description: "the name of the author" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "author", void 0);
    __decorate([
        Property_5.$Property({ description: "the subject of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "subject", void 0);
    __decorate([
        Property_5.$Property({ description: "keywords associated with the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "keywords", void 0);
    __decorate([
        Property_5.$Property({ description: "the creator of the document (default is ‘pdfmake’)" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "creator", void 0);
    __decorate([
        Property_5.$Property({ description: "the producer of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "producer", void 0);
    InfoProperties = __decorate([
        Jassi_10.$Class("jassi_report.InfoProperties")
    ], InfoProperties);
    let PermissionProperties = class PermissionProperties {
        constructor() {
            this.modifying = true;
            this.copying = true;
            this.annotating = true;
            this.fillingForms = true;
            this.contentAccessibility = true;
            this.documentAssembly = true;
        }
    };
    __decorate([
        Property_5.$Property({ chooseFrom: ["lowResolution", "highResolution"], description: 'whether printing is allowed. Specify "lowResolution" to allow degraded printing, or "highResolution" to allow printing with high resolution' }),
        __metadata("design:type", String)
    ], PermissionProperties.prototype, "printing", void 0);
    __decorate([
        Property_5.$Property({ description: "whether modifying the file is allowed. Specify true to allow modifying document content" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "modifying", void 0);
    __decorate([
        Property_5.$Property({ description: "whether copying text or graphics is allowed. Specify true to allow copying" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "copying", void 0);
    __decorate([
        Property_5.$Property({ description: "whether annotating, form filling is allowed. Specify true to allow annotating and form filling" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "annotating", void 0);
    __decorate([
        Property_5.$Property({ description: "whether form filling and signing is allowed. Specify true to allow filling in form fields and signing" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "fillingForms", void 0);
    __decorate([
        Property_5.$Property({ description: "whether copying text for accessibility is allowed. Specify true to allow copying for accessibility" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "contentAccessibility", void 0);
    __decorate([
        Property_5.$Property({ description: "whether assembling document is allowed. Specify true to allow document assembly" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "documentAssembly", void 0);
    PermissionProperties = __decorate([
        Jassi_10.$Class("jassi_report.PermissionProperties")
    ], PermissionProperties);
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let ReportDesign = ReportDesign_5 = class ReportDesign extends BoxPanel_2.BoxPanel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "report";
            this.backgroundPanel = new RStack_1.RStack();
            this.headerPanel = new RStack_1.RStack();
            this.contentPanel = new RStack_1.RStack();
            this.footerPanel = new RStack_1.RStack();
            this._pageSize = undefined;
            /**
           * adds a component to the container
           * @param {jassi.ui.Component} component - the component to add
           */
            /* add(component) {
                 if (component["designPanel"])
                     super.add(component);
                 else
                     super.addBefore(component, this.footerPanel);
         
             }*/
            this.pageSized = {
                '4A0': [4767.87, 6740.79],
                '2A0': [3370.39, 4767.87],
                A0: [2383.94, 3370.39],
                A1: [1683.78, 2383.94],
                A2: [1190.55, 1683.78],
                A3: [841.89, 1190.55],
                A4: [595.28, 841.89],
                A5: [419.53, 595.28],
                A6: [297.64, 419.53],
                A7: [209.76, 297.64],
                A8: [147.40, 209.76],
                A9: [104.88, 147.40],
                A10: [73.70, 104.88],
                B0: [2834.65, 4008.19],
                B1: [2004.09, 2834.65],
                B2: [1417.32, 2004.09],
                B3: [1000.63, 1417.32],
                B4: [708.66, 1000.63],
                B5: [498.90, 708.66],
                B6: [354.33, 498.90],
                B7: [249.45, 354.33],
                B8: [175.75, 249.45],
                B9: [124.72, 175.75],
                B10: [87.87, 124.72],
                C0: [2599.37, 3676.54],
                C1: [1836.85, 2599.37],
                C2: [1298.27, 1836.85],
                C3: [918.43, 1298.27],
                C4: [649.13, 918.43],
                C5: [459.21, 649.13],
                C6: [323.15, 459.21],
                C7: [229.61, 323.15],
                C8: [161.57, 229.61],
                C9: [113.39, 161.57],
                C10: [79.37, 113.39],
                RA0: [2437.80, 3458.27],
                RA1: [1729.13, 2437.80],
                RA2: [1218.90, 1729.13],
                RA3: [864.57, 1218.90],
                RA4: [609.45, 864.57],
                SRA0: [2551.18, 3628.35],
                SRA1: [1814.17, 2551.18],
                SRA2: [1275.59, 1814.17],
                SRA3: [907.09, 1275.59],
                SRA4: [637.80, 907.09],
                EXECUTIVE: [521.86, 756.00],
                FOLIO: [612.00, 936.00],
                LEGAL: [612.00, 1008.00],
                LETTER: [612.00, 792.00],
                TABLOID: [792.00, 1224.00]
            };
            //	this.backgroundPanel.width="500px";
            //$(this.backgroundPanel.dom).css("min-width","200px");
            $(this.backgroundPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Background</text></svg>" + '")');
            $(this.footerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Footer</text></svg>" + '")');
            $(this.headerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Header</text></svg>" + '")');
            //select the Report if the user click the Panel
            this.backgroundPanel["_editorselectthis"] = this;
            this.headerPanel["_editorselectthis"] = this;
            //this.contentPanel["_editorselectthis"]=this;     
            this.footerPanel["_editorselectthis"] = this;
            this.add(this.backgroundPanel);
            this.add(this.headerPanel);
            this.add(this.contentPanel);
            this.add(this.footerPanel);
            //this.pageSize = "A4";
            //this.pageMargins = [40, 40, 40, 40];
        }
        get pageMargins() {
            return this._pageMargins;
        }
        set pageMargins(value) {
            this._pageMargins = value;
            if (value === undefined)
                value = [40, 40, 40, 40];
            this.updateWidth();
            $(this.contentPanel.dom).css("margin-left", value[1] + "px");
            $(this.contentPanel.dom).css("margin-right", value[3] + "px");
        }
        get pageSize() {
            return this._pageSize;
        }
        set pageSize(value) {
            this._pageSize = value;
            this.updateWidth();
        }
        get pageOrientation() {
            return this._pageOrientation;
        }
        set pageOrientation(value) {
            this._pageOrientation = value;
            this.updateWidth();
        }
        updateWidth() {
            var ps = this.pageSize === undefined ? "A4" : this.pageSize;
            var po = this.pageOrientation === 'landscape' ? 1 : 0;
            var pm = this.pageMargins == undefined ? [40, 40, 40, 40] : this.pageMargins;
            this.width = this.pageSized[ps][po]; //-pm[0]-pm[2];
        }
        _setDesignMode(enable) {
            //do nothing - no add button
        }
        static collectForEach(component, allforeach) {
            if (component.foreach)
                allforeach.unshift(component.foreach);
            if (component["dataforeach"])
                allforeach.unshift(component["dataforeach"]);
            if (component.reporttype === "report")
                return component;
            return ReportDesign_5.collectForEach(component._parent, allforeach);
        }
        static getVariable(path, data) {
            var mems = path.split(".");
            var curdata = data;
            for (var x = 0; x < mems.length; x++) {
                curdata = curdata[mems[x]];
                if (curdata === undefined)
                    return undefined;
            }
            return curdata;
        }
        static addVariablenames(path, data, names) {
            for (var key in data) {
                var val = data[key];
                if (Array.isArray(val)) {
                }
                else if (typeof (val) === "object") {
                    ReportDesign_5.addVariablenames(path + (path === "" ? "" : ".") + key, val, names);
                }
                else {
                    names.push("{{" + path + (path === "" ? "" : ".") + key + "}}");
                }
            }
        }
        //get all possible variabelnames
        static getVariables(component) {
            var allforeach = [];
            var report = ReportDesign_5.collectForEach(component, allforeach);
            var data = {};
            Object.assign(data, report.otherProperties.data);
            for (var x = 0; x < allforeach.length; x++) {
                var fe = allforeach[x].split(" in ");
                if (fe.length !== 2)
                    continue;
                var test = ReportDesign_5.getVariable(fe[1], data);
                if (test && test.length > 0)
                    data[fe[0]] = test[0];
            }
            Object.assign(data, report.otherProperties.data);
            var ret = [];
            ReportDesign_5.addVariablenames("", data, ret);
            return ret;
        }
        static fromJSON(ob, target = undefined) {
            var ret = undefined;
            if (ob.content !== undefined) {
                ret = target;
                if (ret === undefined)
                    ret = new ReportDesign_5();
                ret.create(ob);
            }
            else if (ob.text !== undefined) {
                ret = new RText_2.RText().fromJSON(ob);
            }
            else if (ob.stack !== undefined) {
                ret = new RStack_1.RStack().fromJSON(ob);
            }
            else if (ob.columns !== undefined) {
                ret = new RColumns_1.RColumns().fromJSON(ob);
            }
            else if (ob.datatable !== undefined) {
                ret = new RDatatable_1.RDatatable().fromJSON(ob);
            }
            else {
                ret = new RUnknown_1.RUnknown().fromJSON(ob);
            }
            return ret;
        }
        create(ob) {
            var _this = this;
            // this.removeAll();
            this.backgroundPanel.removeAll();
            this.headerPanel.removeAll();
            this.contentPanel.removeAll();
            this.footerPanel.removeAll();
            if (ob.background) {
                let obb = ReportDesign_5.fromJSON(ob.background);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.backgroundPanel.add(obp); });
                delete ob.background;
                obb.destroy();
            }
            if (ob.header) {
                let obb = ReportDesign_5.fromJSON(ob.header);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.headerPanel.add(obp); });
                delete ob.header;
                obb.destroy();
            }
            let obb = ReportDesign_5.fromJSON(ob.content);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { _this.contentPanel.add(obp); });
            delete ob.content;
            obb.destroy();
            if (ob.footer) {
                let obb = ReportDesign_5.fromJSON(ob.footer);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.footerPanel.add(obp); });
                delete ob.footer;
                obb.destroy();
            }
            if (ob.pageOrientation) {
                this.pageOrientation = ob.pageOrientation;
                delete ob.pageOrientation;
            }
            if (ob.pageMargins) {
                this.pageMargins = ob.pageMargins;
                delete ob.pageMargins;
            }
            if (ob.pageSize) {
                this.pageSize = ob.pageSize;
                delete ob.pageSize;
            }
            if (ob.info) {
                this.info = ob.info;
                delete ob.info;
            }
            if (ob.compress) {
                this.compress = ob.compress;
                delete ob.compress;
            }
            if (ob.userPassword) {
                this.userPassword = ob.userPassword;
                delete ob.userPassword;
            }
            if (ob.ownerPassword) {
                this.ownerPassword = ob.ownerPassword;
                delete ob.ownerPassword;
            }
            if (ob.permissions) {
                this.permissions = ob.permissions;
                delete ob.permissions;
            }
            this.otherProperties = ob;
        }
        toJSON() {
            var r = {};
            //var _this = this;
            if (!(this.backgroundPanel._components.length === 0 || (this.backgroundPanel._designMode && this.backgroundPanel._components.length === 1))) {
                r.background = this.backgroundPanel.toJSON();
            }
            if (!(this.headerPanel._components.length === 0 || (this.headerPanel._designMode && this.headerPanel._components.length === 1))) {
                r.header = this.headerPanel.toJSON();
            }
            if (!(this.footerPanel._components.length === 0 || (this.footerPanel._designMode && this.footerPanel._components.length === 1))) {
                r.footer = this.footerPanel.toJSON();
            }
            r.content = this.contentPanel.toJSON();
            if (this.pageOrientation) {
                r.pageOrientation = this.pageOrientation;
            }
            if (this.pageMargins)
                r.pageMargins = this.pageMargins;
            if (this.pageSize)
                r.pageSize = this.pageSize;
            if (this.info)
                r.info = this.info;
            if (this.compress)
                r.compress = this.compress;
            if (this.userPassword)
                r.userPassword = this.userPassword;
            if (this.ownerPassword)
                r.ownerPassword = this.ownerPassword;
            if (this.permissions)
                r.permissions = this.permissions;
            Object.assign(r, this["otherProperties"]);
            return r;
        }
    };
    __decorate([
        Property_5.$Property(),
        __metadata("design:type", Boolean)
    ], ReportDesign.prototype, "compress", void 0);
    __decorate([
        Property_5.$Property({ description: "To enable encryption set user password in userPassword (string value). The PDF file will be encrypted when a user password is provided, and users will be prompted to enter the password to decrypt the file when opening it." }),
        __metadata("design:type", String)
    ], ReportDesign.prototype, "userPassword", void 0);
    __decorate([
        Property_5.$Property({ description: "To set access privileges for the PDF file, you need to provide an owner password in ownerPassword (string value) and object permissions with permissions. By default, all operations are disallowed. You need to explicitly allow certain operations." }),
        __metadata("design:type", String)
    ], ReportDesign.prototype, "ownerPassword", void 0);
    __decorate([
        Property_5.$Property({ type: "json", componentType: "jassi_report.InfoProperties" }),
        __metadata("design:type", InfoProperties)
    ], ReportDesign.prototype, "info", void 0);
    __decorate([
        Property_5.$Property({ type: "json", componentType: "jassi_report.PermissionProperties" }),
        __metadata("design:type", PermissionProperties)
    ], ReportDesign.prototype, "permissions", void 0);
    __decorate([
        Property_5.$Property({ type: "number[]", default: [40, 40, 40, 40], description: "margin of the page: left, top, right, bottom" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], ReportDesign.prototype, "pageMargins", null);
    __decorate([
        Property_5.$Property({ description: "the size of the page", default: "A4", chooseFrom: ['4A0', '2A0', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'RA0', 'RA1', 'RA2', 'RA3', 'RA4', 'SRA0', 'SRA1', 'SRA2', 'SRA3', 'SRA4', 'EXECUTIVE', 'FOLIO', 'LEGAL', 'LETTER', 'TABLOID'] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ReportDesign.prototype, "pageSize", null);
    __decorate([
        Property_5.$Property({ chooseFrom: ['landscape', 'portrait'], default: "portrait", description: "the orientation of the page landscape or portrait" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ReportDesign.prototype, "pageOrientation", null);
    ReportDesign = ReportDesign_5 = __decorate([
        ReportComponent_7.$ReportComponent({ fullPath: undefined, icon: undefined, editableChildComponents: ["this", "this.backgroundPanel", "this.headerPanel", "this.contentPanel", "this.footerPanel"] }),
        Jassi_10.$Class("jassi_report.ReportDesign"),
        __metadata("design:paramtypes", [Object])
    ], ReportDesign);
    exports.ReportDesign = ReportDesign;
    async function test() {
    }
    exports.test = test;
});
define("jassi_report/ReportEditor", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/VariablePanel", "jassi/ui/DockingContainer", "jassi/ui/Button", "jassi/util/Tools", "jassi_report/designer/ReportDesigner", "jassi_editor/AcePanel"], function (require, exports, Jassi_11, Panel_3, VariablePanel_1, DockingContainer_1, Button_2, Tools_1, ReportDesigner_1, AcePanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportEditor = void 0;
    /**
     * Panel for editing sources
     * @class jassi_report.ReportEditor
     */
    let ReportEditor = class ReportEditor extends Panel_3.Panel {
        constructor() {
            super();
            this.maximize();
            this._main = new DockingContainer_1.DockingContainer();
            this._codeView = new Panel_3.Panel();
            this._codePanel = new AcePanel_1.AcePanel();
            this._design = new ReportDesigner_1.ReportDesigner();
            this._variables = new VariablePanel_1.VariablePanel();
            this._codeToolbar = new Panel_3.Panel();
            this._init();
        }
        _init() {
            var _this = this;
            this._codePanel.width = "100%";
            this._codePanel.mode = "typescript";
            /*  this._codePanel.getDocTooltip = function (item) {
                  return _this.getDocTooltip(item);
              }*/
            this._codeToolbar["horizontal"] = false;
            this._codeToolbar.height = "30";
            this._codeView["horizontal"] = true;
            this._codeView.add(this._codeToolbar);
            this._codeView.add(this._codePanel);
            this._codePanel.height = "calc(100% - 31px)";
            this._codePanel.width = "100%";
            this._main.width = "calc(100% - 1px)";
            this._main.height = "99%";
            var undo = new Button_2.Button();
            undo.icon = "mdi mdi-undo";
            undo.tooltip = "Undo (Strg+Z)";
            undo.onclick(function () {
                console.log(_this._main.layout);
                _this._main.layout = _this._main.layout;
                _this._codePanel.undo();
            });
            this._codeToolbar.add(undo);
            var lasttop = this._main.dom.offsetTop;
            var lasttop2 = 0;
            this._main.onresize = function () {
                setTimeout(function () {
                    _this._codePanel.resize();
                }, 1000);
                /*     if(_this._main.dom.offsetTop!==lasttop){//resize to height
                        lasttop=_this._main.dom.offsetTop;
                        var i="calc(100% - "+(lasttop+1)+"px)";
                        _this._main.height=i;
                    }*/
                //TODO _this._designView.resize();
            };
            super.add(this._main);
            this._variables.value = [];
            this._variables.addVariable(this, {});
            this._installView();
            //Dockingview
            this._design.codeEditor = this;
            //   this._codePanel.setCompleter(this);
        }
        _installView() {
            //	debugger;
            this._main.add(this._codeView, "Code..", "code");
            this._main.add(this._design, "Design", "design");
            var des = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},        "content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"",	        "content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,		        "content":[		        	{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,			        "content":[	{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},			        			{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}			        		  ]		        },		        {"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,		        "content":[		        	{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,			        "content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}			        		]		        	},			        {"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,			        	"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true			        					        	}]			        },			         {"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,			        	"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true			        					        	}]			        },			     ]}			     ]},			 ]	        }	    	],	    	"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
            this._design.mainLayout = JSON.stringify(des);
        }
        /**
        * get all known instances for type
        * @param {type} type - the type we are interested
        * @returns {[string]}
        */
        getVariablesForType(type) {
            return this._variables.getVariablesForType(type);
        }
        /**
         * gets the name of the variabel that holds the object
         * @param {object} ob - the
         */
        getVariableFromObject(ob) {
            return this._variables.getVariableFromObject(ob);
        }
        /**
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        getObjectFromVariable(varname) {
            return this._variables.getObjectFromVariable(varname);
        }
        /**
          * renames a variable in design
          * @param {string} oldName
          * @param {string} newName
          */
        renameVariable(oldName, newName) {
        }
        /**
         * @member { jassi.ui.VariablePanel} - the variable
         */
        set variables(value) {
            this._variables = value;
        }
        get variables() {
            return undefined;
            return this._variables;
        }
        /**
         * @member {string} - the code
         */
        set value(value) {
            // this._codePanel.file = this._file;
            this._codePanel.value = value;
        }
        get value() {
            return this._codePanel.value;
        }
        setCursorPorition(position) {
            this.cursorPosition = this._codePanel.numberToPosition(position);
        }
        /**
        * @param {object} position - the current cursor position {row= ,column=}
        */
        set cursorPosition(cursor) {
            this._codePanel.cursorPosition = cursor;
        }
        get cursorPosition() {
            return this._codePanel.cursorPosition;
        }
        destroy() {
            this._codeView.destroy();
            this._codePanel.destroy();
            this._design.destroy();
            this._codeToolbar.destroy();
            //this._main.destroy();
            super.destroy();
        }
        /**
        * undo action
        */
        undo() {
            this._codePanel.undo();
        }
    };
    ReportEditor = __decorate([
        Jassi_11.$Class("jassi_report.ReportEditor"),
        __metadata("design:paramtypes", [])
    ], ReportEditor);
    exports.ReportEditor = ReportEditor;
    async function test() {
        var editor = new ReportEditor();
        editor.height = 500;
        var rep = { "content": { "stack": [{ "text": "Halloso" }, { "text": "sdsfsdf" }] } };
        editor.value = Tools_1.Tools.objectToJson(rep, "", true);
        return editor;
    }
    exports.test = test;
    ;
});
define("jassi_report/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "css": ["jassi_report.css"],
        "require": {
            paths: {
                'pdfjs-dist/build/pdf': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min',
                'pdfjs-dist/build/pdf.worker': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min',
                'pdfmake': '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/vfs_fonts',
                'pdfMakeLib': '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/pdfmake' //'../../lib/pdfmake'
            },
            shim: {
                'pdfjs-dist/build/pdf': ['pdfjs-dist/build/pdf.worker'],
                pdfMakeLib: {
                    exports: 'pdfMake'
                },
                pdfmake: {
                    deps: ['pdfMakeLib'],
                    exports: 'pdfMake'
                }
            },
        }
    };
});
//this file is autogenerated don't modify
define("jassi_report/registry", ["require"], function (require) {
    return {
        default: {
            "jassi_report/designer/Report.ts": {
                "date": 1613218544157,
                "jassi_report.Report": {}
            },
            "jassi_report/designer/ReportDesigner.ts": {
                "date": 1613218544160,
                "jassi_report.designer.ReportDesigner": {}
            },
            "jassi_report/modul.ts": {
                "date": 1613312029291
            },
            "jassi_report/PDFReport.ts": {
                "date": 1613218544158,
                "jassi_report.PDFReport": {}
            },
            "jassi_report/PDFViewer.ts": {
                "date": 1613218544158,
                "jassi_report.PDFViewer": {}
            },
            "jassi_report/RColumns.ts": {
                "date": 1613218544158,
                "jassi_report.RColumns": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Columns",
                            "icon": "mdi mdi-view-parallel-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                }
            },
            "jassi_report/RComponent.ts": {
                "date": 1611935803813
            },
            "jassi_report/RDatatable.ts": {
                "date": 1613218566582,
                "jassi_report.RDatatable": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Datatable",
                            "icon": "mdi mdi-file-table-box-multiple-outline",
                            "editableChildComponents": [
                                "this",
                                "this.headerPanel",
                                "this.bodyPanel",
                                "this.footerPanel"
                            ]
                        }
                    ]
                }
            },
            "jassi_report/ReportComponent.ts": {
                "date": 1613218566582,
                "jassi_report.ReportComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                }
            },
            "jassi_report/ReportComponentProperties.ts.ts": {
                "date": 1611935804327
            },
            "jassi_report/ReportDesign.ts": {
                "date": 1613218566582,
                "jassi_report.InfoProperties": {},
                "jassi_report.PermissionProperties": {},
                "jassi_report.ReportDesign": {
                    "$ReportComponent": [
                        {
                            "fullPath": "undefined",
                            "icon": "undefined",
                            "editableChildComponents": [
                                "this",
                                "this.backgroundPanel",
                                "this.headerPanel",
                                "this.contentPanel",
                                "this.footerPanel"
                            ]
                        }
                    ]
                }
            },
            "jassi_report/ReportEditor.ts": {
                "date": 1613218609627,
                "jassi_report.ReportEditor": {}
            },
            "jassi_report/RStack.ts": {
                "date": 1613218544158,
                "jassi_report.RStack": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Stack",
                            "icon": "mdi mdi-view-sequential-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassi_report/RTablerow.ts": {
                "date": 1613218544158,
                "jassi_report.RTablerow": {
                    "$ReportComponent": [
                        {
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassi_report/RText.ts": {
                "date": 1613218544158,
                "jassi_report.RText": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Text",
                            "icon": "mdi mdi-format-color-text"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "value",
                            "type": "string",
                            "description": "text"
                        }
                    ]
                }
            },
            "jassi_report/RUnknown.ts": {
                "date": 1613218544158,
                "jassi_report.RUnknown": {}
            }
        }
    };
});
define("jassi_report/designer/Report", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/BoxPanel"], function (require, exports, Jassi_12, BoxPanel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Report = void 0;
    let Report = 
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    class Report extends BoxPanel_3.BoxPanel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties) {
            super(properties);
        }
    };
    Report = __decorate([
        Jassi_12.$Class("jassi_report.Report")
        //@$UIComponent({editableChildComponents:["this"]})
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], Report);
    exports.Report = Report;
});
//jassi.register("reportcomponent", "jassi_report.Report", "report/Report", "res/report.ico");
// return CodeEditor.constructor;
define("jassi_report/designer/ReportDesigner", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/PropertyEditor", "jassi_editor/ComponentExplorer", "jassi_editor/ComponentPalette", "jassi_editor/CodeEditorInvisibleComponents", "jassi_editor/ComponentDesigner", "jassi_report/PDFReport", "jassi_report/PDFViewer", "jassi_report/ReportDesign", "jassi/util/Tools"], function (require, exports, Jassi_13, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, CodeEditorInvisibleComponents_1, ComponentDesigner_1, PDFReport_1, PDFViewer_2, ReportDesign_6, Tools_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportDesigner = void 0;
    let ReportDesigner = class ReportDesigner extends ComponentDesigner_1.ComponentDesigner {
        constructor() {
            super();
            this.pdfviewer = new PDFViewer_2.PDFViewer();
            this.lastView = undefined;
            this._codeChanger = undefined;
            this.mainLayout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        set codeEditor(value) {
            var _this = this;
            this._codeEditor = value;
            this._variables = this._codeEditor._variables;
            this._propertyEditor = new PropertyEditor_1.PropertyEditor(undefined);
            this._codeChanger = new PropertyEditor_1.PropertyEditor(this._codeEditor);
            this._errors = this._codeEditor._errors;
            this._componentPalette = new ComponentPalette_1.ComponentPalette();
            this._componentExplorer = new ComponentExplorer_1.ComponentExplorer(value, this._propertyEditor);
            this._invisibleComponents = new CodeEditorInvisibleComponents_1.CodeEditorInvisibleComponents(value);
            this.add(this._invisibleComponents);
            this._initComponentExplorer();
            this._installView();
            this._codeEditor._codePanel.onblur(function (evt) {
                _this._propertyEditor.updateParser();
            });
            this._propertyEditor.readPropertyValueFromDesign = true;
            this._propertyEditor.addEvent("propertyChanged", function () {
                _this.propertyChanged();
            });
            this._propertyEditor.addEvent("codeChanged", function () {
                _this.propertyChanged();
            });
            $(this.__dom).addClass("ReportDesigner");
            $(this.dom).css("overflow", "scroll");
            $(this.dom).css("width", "");
        }
        editDialog(enable) {
            if (enable === false) {
                super.editDialog(enable);
                var rep = new PDFReport_1.PDFReport();
                //rep.content=this.designedComponent["design];
                var data = this._codeChanger.value.toJSON();
                rep.value = Tools_2.Tools.copyObject(data); // designedComponent["design"];
                //viewer.value = await rep.getBase64();
                rep.getBase64().then((data) => {
                    this.pdfviewer.report = rep;
                    //make a copy because the data would be modified 
                    this.pdfviewer.value = data;
                });
                this.lastView = this._designPlaceholder._components[0];
                if (this._designPlaceholder._components.length > 0)
                    this._designPlaceholder.remove(this._designPlaceholder._components[0], false);
                this._designPlaceholder.add(this.pdfviewer);
            }
            else if (this.lastView) {
                if (this._designPlaceholder._components.length > 0)
                    this._designPlaceholder.remove(this._designPlaceholder._components[0], false);
                this._designPlaceholder.add(this.lastView);
                this.lastView = undefined;
                super.editDialog(enable);
            }
            else
                super.editDialog(enable);
        }
        propertyChanged() {
            if (this._codeChanger.parser.sourceFile === undefined)
                this._codeChanger.updateParser();
            //@ts-ignore
            let ob = Tools_2.Tools.objectToJson(this.designedComponent.toJSON(), undefined, false);
            this._codeChanger.setPropertyInCode("design", ob);
        }
        createComponent(type, component, top, left, newParent, beforeComponent) {
            //this._variables.updateCache();
            //this._componentExplorer.update();
            var ret = super.createComponent(type, component, top, left, newParent, beforeComponent);
            this.addVariables(ret);
            this._componentExplorer.update();
            this.propertyChanged();
            return ret;
        }
        addVariables(component) {
            var name = component["reporttype"];
            if (this.nextComponentvariable[name] === undefined) {
                this.nextComponentvariable[name] = 0;
            }
            this.nextComponentvariable[name]++;
            this._codeEditor.variables.addVariable(name + this.nextComponentvariable[name], component);
            this.allComponents[name + this.nextComponentvariable[name]] = component;
            if (component["_components"]) {
                for (let x = 0; x < component["_components"].length; x++) {
                    this.addVariables(component["_components"][x]);
                }
            }
        }
        /**
          * @member {jassi.ui.Component} - the designed component
          */
        set designedComponent(component) {
            //create _children
            ReportDesign_6.ReportDesign.fromJSON(component["design"], component);
            //populate Variables
            this.allComponents = {};
            this.nextComponentvariable = {};
            this.allComponents["this"] = component;
            this._codeEditor.variables.addVariable("this", component);
            this.addVariables(component);
            this._propertyEditor.value = component;
            this._codeChanger.parser = this._propertyEditor.parser;
            super.designedComponent = component;
            //@ts.ignore
            this._codeChanger.value = component;
        }
        get designedComponent() {
            return super.designedComponent;
        }
        //    	_this.variables.addVariable("this", rep);
        get codeEditor() {
            return this._codeEditor;
        }
        _installView() {
            this._componentPalette = new ComponentPalette_1.ComponentPalette();
            this._componentPalette.service = "$ReportComponent";
            this._codeEditor._main.add(this._propertyEditor, "Properties", "properties");
            this._codeEditor._main.add(this._componentExplorer, "Components", "components");
            this._codeEditor._main.add(this._componentPalette, "Palette", "componentPalette");
            if (this.mainLayout)
                this._codeEditor._main.layout = this.mainLayout;
        }
        destroy() {
            //	this._codeChanger.destroy();
            this.pdfviewer.destroy();
            super.destroy();
        }
        _initComponentExplorer() {
            var _this = this;
            this._componentExplorer.onclick(function (data) {
                var ob = data.data;
                _this._propertyEditor.value = ob;
            });
            this._componentExplorer.getComponentName = function (item) {
                var varname = _this._codeEditor.getVariableFromObject(item);
                if (varname === undefined)
                    return;
                if (varname.startsWith("this."))
                    return varname.substring(5);
                return varname;
            };
        }
    };
    ReportDesigner = __decorate([
        Jassi_13.$Class("jassi_report.designer.ReportDesigner"),
        __metadata("design:paramtypes", [])
    ], ReportDesigner);
    exports.ReportDesigner = ReportDesigner;
    async function test() {
        var rep = new PDFReport_1.PDFReport();
        var def = {
            content: {
                stack: [{
                        columns: [
                            { stack: [
                                    { text: '{{invoice.customer.firstname}} {{invoice.customer.lastname}}' },
                                    { text: '{{invoice.customer.street}}' },
                                    { text: '{{invoice.customer.place}}' }
                                ]
                            },
                            { stack: [
                                    { text: 'Invoice', fontSize: 18 },
                                    { text: " " },
                                    { text: "Date: {{invoice.date}}" },
                                    { text: "Number: {{invoice.number}}", bold: true },
                                    { text: " " },
                                    { text: " " },
                                ]
                            }
                        ]
                    }
                ]
            }
        };
        //	def.content=replaceTemplates(def.content,def.data);
        rep.value = def;
        var viewer = new PDFViewer_2.PDFViewer();
        viewer.value = await rep.getBase64();
        return viewer;
    }
    exports.test = test;
    ;
});
/*require.config(
    {
       // 'pdfjs-dist/build/pdf': 'myfolder/pdf.min',
       // 'pdfjs-dist/build/pdf.worker': 'myfolder/pdf.worker.min'
      paths: {
          'pdfjs-dist/build/pdf': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min',
          'pdfjs-dist/build/pdf.worker': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min',
        //  'pdf.worker.entry': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.entry.min'
         },
      shim: {
        'pdfjs-dist/build/pdf': ['pdfjs-dist/build/pdf.worker'],
        }
  });*/
define("jassi_report/ext/pdfjs", ["pdfjs-dist/build/pdf", "pdfjs-dist/build/pdf.worker"], function (pdfjs, worker, pdfjsWorker) {
    pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
    //pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    return {
        default: pdfjs
    };
});
/*require.config(
    {
      paths :
      {
          'pdfmake' : '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/vfs_fonts',// '../../lib/vfs_fonts',
          'pdfMakeLib' :'//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/pdfmake'  //'../../lib/pdfmake'
      },
      shim :
      {
          pdfMakeLib :
          {
              exports: 'pdfMake'
          },
          pdfmake :
          {
              deps: ['pdfMakeLib'],
              exports: 'pdfMake'
          }
      }
    });*/
define("jassi_report/ext/pdfmake", ['pdfmake'], function (ttt) {
    return {
        default: pdfMake
    };
});
//# sourceMappingURL=jassi_report.js.map