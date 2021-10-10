var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define("jassijs_report/PDFReport", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/ext/pdfmake", "jassijs_report/PDFViewer", "jassijs_report/remote/pdfmakejassi"], function (require, exports, Jassi_1, pdfmake_1, PDFViewer_1, pdfmakejassi_1) {
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
            return new Promise(function (resolve, reject) {
                _this.report.getBase64(function (data) {
                    resolve(data);
                });
            });
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
define("jassijs_report/PDFViewer", ["require", "exports", "jassijs/ui/Button", "jassijs_report/ext/pdfjs", "jassijs/ui/Component", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/BoxPanel"], function (require, exports, Button_1, pdfjs_1, Component_1, Jassi_2, Panel_1, BoxPanel_1) {
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
            this.css({
                overflow: "auto"
            });
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
                //   _this.width=viewport.width;
                //   _this.height=viewport.height;
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
        (0, Jassi_2.$Class)("jassijs_report.PDFViewer"),
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
        //    ret.height=160;
        return ret;
    }
    exports.test = test;
});
define("jassijs_report/RColumns", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Jassi_3, ReportDesign_1, RComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RColumns = void 0;
    //Limitations: columnGap not implemented defaultStyle: {columnGap: 20}
    let RColumns = 
    //@$Property({ hideBaseClassProperties: true })
    class RColumns extends RComponent_1.RComponent {
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
            $(this.dom).addClass("designerNoResizable");
            $(this.dom).css("display", "table");
            $(this.dom).css("min-width", "50px");
            // this.width="300px"
        }
        /**
       * adds a component to the container before an other component
       * @param {jassijs.ui.Component} component - the component to add
       * @param {jassijs.ui.Component} before - the component before then component to add
       */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter=true;
            }
            super.addBefore(component, before);
            $(component.domWrapper).css("display", "table-cell");
            $(component.dom).removeClass("designerNoResizable");
            $(component.dom).addClass("designerNoResizableY");
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            super.add(component);
            $(component.domWrapper).css("display", "table-cell");
            $(component.dom).removeClass("designerNoResizable");
            $(component.dom).addClass("designerNoResizableY");
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
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Columns", icon: "mdi mdi-view-parallel-outline", editableChildComponents: ["this"] }),
        (0, Jassi_3.$Class)("jassijs_report.RColumns")
        //@$Property({ hideBaseClassProperties: true })
        ,
        __metadata("design:paramtypes", [Object])
    ], RColumns);
    exports.RColumns = RColumns;
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
define("jassijs_report/RComponent", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Property"], function (require, exports, Component_2, Registry_1, Jassi_4, Panel_2, Property_1) {
    "use strict";
    var RComponent_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RComponent = exports.$ReportComponent = exports.ReportComponentProperties = void 0;
    //Limitations Styles1 -> not implemented	style as array e.g. style: ['quote', 'small']  
    class ReportComponentProperties extends Component_2.UIComponentProperties {
    }
    exports.ReportComponentProperties = ReportComponentProperties;
    function $ReportComponent(properties) {
        return function (pclass) {
            Registry_1.default.register("$ReportComponent", pclass, properties);
        };
    }
    exports.$ReportComponent = $ReportComponent;
    let RComponent = RComponent_2 = class RComponent extends Panel_2.Panel {
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "nothing";
        }
        onstylechanged(func) {
            this.addEvent("stylechanged", func);
        }
        set counter(value) {
            this._counter = value;
            if (value === undefined)
                $(this.domWrapper).removeAttr("value");
            else
                $(this.domWrapper).attr("value", value);
        }
        get counter() {
            return this._counter;
        }
        set listType(value) {
            this._listType = value;
            if (value === undefined)
                $(this.domWrapper).css("list-style-type", "");
            else
                $(this.domWrapper).css("list-style-type", value);
        }
        get listType() {
            return this._listType;
        }
        get fillColor() {
            return this._fillColor;
        }
        set fillColor(value) {
            this._fillColor = value;
            $(this.dom).css("background-color", value);
        }
        get colSpan() {
            return this._colSpan;
        }
        set colSpan(value) {
            var _a, _b, _c, _d;
            $(this.domWrapper).attr("colspan", value === undefined ? "" : value);
            this._colSpan = value;
            if ((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._parent) === null || _b === void 0 ? void 0 : _b.updateLayout)
                (_d = (_c = this._parent) === null || _c === void 0 ? void 0 : _c._parent) === null || _d === void 0 ? void 0 : _d.updateLayout(true);
        }
        get rowSpan() {
            return this._rowSpan;
        }
        set rowSpan(value) {
            var _a, _b, _c, _d;
            $(this.domWrapper).attr("rowspan", value === undefined ? "" : value);
            this._rowSpan = value;
            if ((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._parent) === null || _b === void 0 ? void 0 : _b.updateLayout)
                (_d = (_c = this._parent) === null || _c === void 0 ? void 0 : _c._parent) === null || _d === void 0 ? void 0 : _d.updateLayout(true);
        }
        get border() {
            return this._border;
        }
        set border(value) {
            this._border = value;
            if (value === undefined)
                value = [false, false, false, false];
            $(this.domWrapper).css("border-left-style", value[0] ? "solid" : "none");
            $(this.domWrapper).css("border-top-style", value[1] ? "solid" : "none");
            $(this.domWrapper).css("border-right-style", value[2] ? "solid" : "none");
            $(this.domWrapper).css("border-bottom-style", value[3] ? "solid" : "none");
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
        get height() {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) !== undefined)
                return this._parent.getChildHeight(this);
            else
                return this._height;
        }
        set height(value) {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) !== undefined)
                this._parent.setChildHeight(this, value);
            else {
                this._height = value;
                console.log(value);
                super.height = value;
            }
        }
        get bold() {
            return this._bold;
        }
        set bold(value) {
            this._bold = value;
            $(this.dom).css("font-weight", value ? "bold" : "normal");
            this.callEvent("stylechanged", "font-weight", value);
        }
        get italics() {
            return this._italics;
        }
        set italics(value) {
            this._italics = value;
            $(this.dom).css("font-style", value ? "italic" : "normal");
            this.callEvent("stylechanged", "font-style", value);
        }
        get font() {
            return this._font;
        }
        set font(value) {
            this._font = value;
            //copy from CSSProperties
            var api = 'https://fonts.googleapis.com/css?family=';
            var sfont = value.replaceAll(" ", "+");
            if (!document.getElementById("-->" + api + sfont)) { //"-->https://fonts.googleapis.com/css?family=Aclonica">
                Jassi_4.default.myRequire(api + sfont);
            }
            if (value === undefined)
                $(this.dom).css("font_family", "");
            else
                $(this.dom).css("font_family", value);
            this.callEvent("stylechanged", "font", value);
        }
        get fontSize() {
            return this._fontSize;
        }
        set fontSize(value) {
            this._fontSize = value;
            if (value === undefined)
                $(this.dom).css("font-size", "");
            else
                $(this.dom).css("font-size", value + "px");
            this.callEvent("stylechanged", "fontSize", value);
        }
        get background() {
            return this._background;
        }
        set background(value) {
            this._background = value;
            $(this.dom).css("background-color", value);
            this.callEvent("stylechanged", "background", value);
        }
        get color() {
            return this._color;
        }
        set color(value) {
            this._color = value;
            $(this.dom).css("color", value);
            this.callEvent("stylechanged", "color", value);
        }
        get alignment() {
            return this._alignment;
        }
        set alignment(value) {
            this._alignment = value;
            $(this.dom).css("text-align", value);
            this.callEvent("stylechanged", "alignment", value);
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
            this.callEvent("stylechanged", "decoration", value);
        }
        get decorationColor() {
            return this._decorationColor;
        }
        set decorationColor(value) {
            this._decorationColor = value;
            $(this.dom).css("textDecorationColor", value);
            this.callEvent("stylechanged", "textDecorationColor", value);
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
            this.callEvent("stylechanged", "decorationStyle", value);
        }
        static findReport(parent) {
            if (parent === undefined)
                return undefined;
            if ((parent === null || parent === void 0 ? void 0 : parent.reporttype) === "report")
                return parent;
            else
                return RComponent_2.findReport(parent._parent);
        }
        get style() {
            return this._style;
        }
        set style(value) {
            var old = this._style;
            this._style = value;
            var report = RComponent_2.findReport(this);
            if (report) {
                report.styleContainer._components.forEach((comp) => {
                    if (comp.name === old) {
                        $(this.dom).removeClass(comp.styleid);
                    }
                });
                report.styleContainer._components.forEach((comp) => {
                    if (comp.name === value) {
                        $(this.dom).addClass(comp.styleid);
                    }
                });
            }
            //  super.width = value;
        }
        get lineHeight() {
            return this._lineHeight;
        }
        set lineHeight(value) {
            this._lineHeight = value;
            $(this.dom).css("line-height", value);
            this.callEvent("stylechanged", "lineHeight", value);
            //  super.width = value;
        }
        get margin() {
            return this._margin;
        }
        set margin(value) {
            if (value === undefined) {
                this._margin = value;
                $(this.dom).css("margin", "");
            }
            else {
                if (Number.isInteger(value)) {
                    //@ts-ignore
                    value = [value, value, value, value];
                }
                if (value.length === 2) {
                    value = [value[0], value[1], value[0], value[1]];
                }
                this._margin = value;
                $(this.dom).css("margin", value[1] + "px " + value[2] + "px " + value[3] + "px " + value[0] + "px ");
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
            if (ob.rowSpan) {
                ret.rowSpan = ob.rowSpan;
                delete ob.rowSpan;
            }
            if (ob.height) {
                ret.height = ob.height;
                delete ob.height;
            }
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
            if (ob.font) {
                ret.font = ob.font;
                delete ob.font;
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
            if (ob.style) {
                ret.style = ob.style;
                delete ob.style;
            }
            if (ob.fillColor) {
                ret.fillColor = ob.fillColor;
                delete ob.fillColor;
            }
            if (ob.border) {
                ret.border = ob.border;
                delete ob.border;
            }
            if (ob.counter) {
                ret.counter = ob.counter;
                delete ob.counter;
            }
            if (ob.listType) {
                ret.listType = ob.listType;
                delete ob.listType;
            }
            if (ob.margin) {
                ret.margin = ob.margin;
                delete ob.margin;
            }
            ret.otherProperties = ob;
            return ret;
        }
        toJSON() {
            var _a, _b;
            var ret = {};
            if (this.colSpan !== undefined)
                ret.colSpan = this.colSpan;
            if (this.rowSpan !== undefined)
                ret.rowSpan = this.rowSpan;
            if (this.foreach !== undefined)
                ret.foreach = this.foreach;
            if (this.width !== undefined && !((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth))
                ret.width = this.width;
            if (this.height !== undefined && !((_b = this._parent) === null || _b === void 0 ? void 0 : _b.setChildHeight))
                ret.height = this.height;
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
            if (this.font !== undefined)
                ret.font = this.font;
            if (this.fontSize !== undefined)
                ret.fontSize = this.fontSize;
            if (this.lineHeight !== undefined)
                ret.lineHeight = this.lineHeight;
            if (this.alignment !== undefined)
                ret.alignment = this.alignment;
            if (this.background !== undefined)
                ret.background = this.background;
            if (this.style !== undefined)
                ret.style = this.style;
            if (this.fillColor !== undefined)
                ret.fillColor = this.fillColor;
            if (this.border !== undefined)
                ret.border = this.border;
            if (this.counter)
                ret.counter = this.counter;
            if (this.listType)
                ret.listType = this.listType;
            if (this.margin)
                ret.margin = this.margin;
            Object.assign(ret, this["otherProperties"]);
            return ret;
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], RComponent.prototype, "foreach", void 0);
    __decorate([
        (0, Property_1.$Property)({
            default: undefined,
            isVisible: (component) => {
                var _a;
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "ol";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "counter", null);
    __decorate([
        (0, Property_1.$Property)({
            name: "listType",
            default: undefined,
            isVisible: (component) => {
                var _a, _b;
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "ul" || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "ol";
            },
            chooseFrom: function (it) {
                if (it._parent.reporttype === "ol")
                    return ["lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "none"];
                else
                    return ["square", "circle", "none"];
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "listType", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "color", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "fillColor", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "string", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "colSpan", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "string", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "rowSpan", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "boolean[]",
            default: [false, false, false, false],
            isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns";
            },
            description: "border of the tablecell: left, top, right, bottom"
        }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RComponent.prototype, "border", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "string", isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns" || component.reporttype === "image";
            }
        }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RComponent.prototype, "width", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "string", isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns" || component.reporttype === "image";
            }
        }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RComponent.prototype, "height", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RComponent.prototype, "bold", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RComponent.prototype, "italics", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["Alegreya", "AlegreyaSans", "AlegreyaSansSC", "AlegreyaSC", "AlmendraSC", "Amaranth", "Andada", "AndadaSC", "AnonymousPro", "ArchivoNarrow", "Arvo", "Asap", "AveriaLibre", "AveriaSansLibre", "AveriaSerifLibre", "Cambay", "Caudex", "CrimsonText", "Cuprum", "Economica", "Exo2", "Exo", "ExpletusSans", "FiraSans", "JosefinSans", "JosefinSlab", "Karla", "Lato", "LobsterTwo", "Lora", "Marvel", "Merriweather", "MerriweatherSans", "Nobile", "NoticiaText", "Overlock", "Philosopher", "PlayfairDisplay", "PlayfairDisplaySC", "PT_Serif-Web", "Puritan", "Quantico", "QuattrocentoSans", "Quicksand", "Rambla", "Rosario", "Sansation", "Sarabun", "Scada", "Share", "Sitara", "SourceSansPro", "TitilliumWeb", "Volkhov", "Vollkorn"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "font", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "fontSize", null);
    __decorate([
        (0, Property_1.$Property)({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "background", null);
    __decorate([
        (0, Property_1.$Property)({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "color", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["left", "center", "right"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "alignment", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["underline", "lineThrough", "overline"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decoration", null);
    __decorate([
        (0, Property_1.$Property)({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decorationColor", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["dashed", "dotted", "double", "wavy"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decorationStyle", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "style", null);
    __decorate([
        (0, Property_1.$Property)({ default: 1 }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "lineHeight", null);
    __decorate([
        (0, Property_1.$Property)({ type: "number[]", description: "margin left, top, right, bottom" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RComponent.prototype, "margin", null);
    RComponent = RComponent_2 = __decorate([
        (0, Jassi_4.$Class)("jassijs_report.ReportComponent"),
        (0, Property_1.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], RComponent);
    exports.RComponent = RComponent;
});
define("jassijs_report/RDatatable", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RComponent", "jassijs_report/RTablerow", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs_report/RGroupTablerow", "jassijs_report/RTable"], function (require, exports, Jassi_5, RComponent_3, RTablerow_1, Property_2, Classes_1, RGroupTablerow_1, RTable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RDatatable = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let RDatatable = class RDatatable extends RTable_1.RTable {
        /**
    *
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    *
    */
        constructor(properties = {}) {
            properties.isdatatable = true;
            super(properties);
            this.reporttype = "datatable";
            this.headerPanel = new RTablerow_1.RTablerow();
            this.groupHeaderPanel = [];
            this.bodyPanel = new RTablerow_1.RTablerow();
            this.groupFooterPanel = [];
            this.groupExpression = [];
            this.footerPanel = new RTablerow_1.RTablerow();
            // super.init($("<table style='min-width:50px;table-layout: fixed'></table>")[0]);
            var _this;
            //	this.backgroundPanel.width="500px";
            //$(this.backgroundPanel.dom).css("min-width","200px");
            //$(this.dom).css("display", "table");
            // $(this.dom).css("min-width", "50px");
            $(this.footerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tablefooter</text></svg>" + '")');
            $(this.headerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tableheader</text></svg>" + '")');
            this.removeAll(); //from Table Constructor
            this.add(this.headerPanel);
            this.add(this.bodyPanel);
            this.add(this.footerPanel);
            // $(this.dom).addClass("designerNoResizable");
            this.headerPanel.parent = this;
            this.footerPanel.parent = this;
            this.bodyPanel.parent = this;
        }
        _setDesignMode(enable) {
            //do nothing - no add button
        }
        /*private fillTableRow(row: RTablerow, count: number) {
            if (!row._designMode || count - row._components.length !== 1)
                return;
            for (var x = row._components.length; x < count; x++) {
                var rr = new RText();
                row.addBefore(rr, row._components[row._components.length - 1]);//after addbutton
            }
        }*/
        addEmptyCellsIfNeeded(row) {
            var count = row._components.length;
            this.fillTableRow(this.headerPanel, count);
            this.fillTableRow(this.bodyPanel, count);
            this.fillTableRow(this.footerPanel, count);
        }
        /*
         setChildWidth(component: Component, width: any) {
             var max = 0;
             var found = -1;
             for (var x = 0; x < this._components.length; x++) {
                 for (var i = 0; i < (<Container>this._components[x])._components.length; i++) {
                     if (i > max)
                         max = i;
                     var row = (<Container>this._components[x])._components[i];
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
                 $((<Container>this._components[0])._components[found].domWrapper).attr("width", width);
             }
             //this._parent.setChildWidth(component,value);
         }
        
         getChildWidth(component: Component): any {
             var found = -1;
             for (var x = 0; x < this._components.length; x++) {
                 if ((<Container>this._components[x])._components) {
                     for (var i = 0; i < (<Container>this._components[x])._components.length; i++) {
                         var row = (<Container>this._components[x])._components[i];
                         if (row === component)
                             found = i;
                     }
                 }
             }
     
             if (found !== -1)
                 return this.widths[found];
             //this._parent.setChildWidth(component,value);
         }
         */
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
            }
            super.extensionCalled(action);
        }
        set groupCount(value) {
            var _a;
            if (value < 0 || value > 5) {
                throw new Classes_1.JassiError("groupCount must be a value between 0 and 5");
            }
            if (this.groupHeaderPanel.length === value)
                return;
            //remove unused
            while (this.groupHeaderPanel.length > value) {
                this.remove(this.groupHeaderPanel[this.groupHeaderPanel.length - 1], true);
                this.groupHeaderPanel.splice(this.groupHeaderPanel.length - 1, 1);
            }
            while (this.groupFooterPanel.length > value) {
                this.remove(this.groupFooterPanel[this.groupFooterPanel.length - 1], true);
                this.groupFooterPanel.splice(this.groupFooterPanel.length - 1, 1);
            }
            while (this.groupExpression.length > value) {
                this.groupExpression.splice(this.groupExpression.length - 1, 1);
            }
            //add new
            while (this.groupHeaderPanel.length < value) {
                let tr = new RGroupTablerow_1.RGroupTablerow();
                tr.parent = this;
                var id = this.groupHeaderPanel.length + 1;
                $(tr.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Group" + id + "-Header</text></svg>" + '")');
                this.addBefore(tr, this.bodyPanel);
                this.groupHeaderPanel.push(tr);
            }
            while (this.groupFooterPanel.length < value) {
                let tr = new RGroupTablerow_1.RGroupTablerow();
                tr.parent = this;
                var id = this.groupFooterPanel.length + 1;
                $(tr.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Group" + id + "-Footer</text></svg>" + '")');
                var prev = this.footerPanel;
                if (this.groupFooterPanel.length > 0)
                    prev = this.groupFooterPanel[this.groupFooterPanel.length - 1];
                this.addBefore(tr, prev);
                this.groupFooterPanel.push(tr);
            }
            while (this.groupExpression.length < value) {
                this.groupExpression.push("");
            }
            (_a = this._componentDesigner) === null || _a === void 0 ? void 0 : _a.editDialog(this._componentDesigner.editMode);
        }
        get groupCount() {
            return this.groupHeaderPanel.length;
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
            if (ob.groups) {
                this.groupCount = ob.groups.length; //create Panels
                for (var x = 0; x < ob.groups.length; x++) {
                    this.groupExpression[x] = ob.groups[x].expression;
                    if (ob.groups[x].header) {
                        let obb = new RGroupTablerow_1.RGroupTablerow().fromJSON(ob.groups[x].header);
                        obb.parent = ret;
                        let all = [];
                        obb._components.forEach((obp) => all.push(obp));
                        all.forEach((obp) => { ret.groupHeaderPanel[x].add(obp); });
                        obb.destroy();
                    }
                    if (ob.groups[x].footer) {
                        let obb = new RGroupTablerow_1.RGroupTablerow().fromJSON(ob.groups[x].footer);
                        obb.parent = ret;
                        let all = [];
                        obb._components.forEach((obp) => all.push(obp));
                        all.forEach((obp) => { ret.groupFooterPanel[x].add(obp); });
                        obb.destroy();
                    }
                }
            }
            delete ob.groups;
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
            if (ob === null || ob === void 0 ? void 0 : ob.widths) {
                ret.widths = ob.widths;
                delete ob.widths;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.heights) {
                ret.heights = ob.heights;
                delete ob.heights;
            }
            /* if (ob.widths) {
                 ret.widths = ob.widths;
                 delete ob.widths;
     
             }
             var tr = (<RTablerow>this._components[0]);
             for (var x = 0; x < tr._components.length; x++) {
     
                 $(tr._components[x].domWrapper).attr("width", this.widths[x]);
             }
             */
            ret.dataforeach = ob.dataforeach;
            delete ob.dataforeach;
            delete obj.datatable;
            super.fromJSON(obj, ob);
            return ret;
        }
        toJSON() {
            var ret = super.toJSON(true);
            ret.datatable = ret.table;
            delete ret.table;
            var r = ret.datatable;
            //TODO hack
            r.groups = ret.groups;
            delete ret.groups;
            //var _this = this;
            /*if (this.widths && this.widths.length > 0) {
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
            }*/
            if (this.groupHeaderPanel.length > 0) {
                r.groups = [];
                for (var x = 0; x < this.groupHeaderPanel.length; x++) {
                    var gheader = undefined;
                    var gfooter = undefined;
                    if (!(this.groupHeaderPanel[x]._components.length === 0 || (this.groupHeaderPanel[x]._designMode && this.groupHeaderPanel[x]._components.length === 1))) {
                        gheader = this.groupHeaderPanel[x].toJSON();
                    }
                    if (!(this.groupFooterPanel[x]._components.length === 0 || (this.groupFooterPanel[x]._designMode && this.groupFooterPanel[x]._components.length === 1))) {
                        gfooter = this.groupFooterPanel[x].toJSON();
                    }
                    r.groups.push({
                        header: gheader,
                        expression: this.groupExpression[x],
                        footer: gfooter
                    });
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
        (0, Property_2.$Property)(),
        __metadata("design:type", String)
    ], RDatatable.prototype, "dataforeach", void 0);
    __decorate([
        (0, Property_2.$Property)(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RDatatable.prototype, "groupCount", null);
    RDatatable = __decorate([
        (0, RComponent_3.$ReportComponent)({ fullPath: "report/Datatable", icon: "mdi mdi-table-cog", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] }),
        (0, Jassi_5.$Class)("jassijs_report.RDatatable"),
        __metadata("design:paramtypes", [Object])
    ], RDatatable);
    exports.RDatatable = RDatatable;
    async function test() {
    }
    exports.test = test;
});
define("jassijs_report/RTable", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RText", "jassijs/util/Tools", "jassijs_report/RComponent", "jassijs_report/RTablerow", "jassijs/ui/Property", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Button", "jassijs/util/Runlater", "jassijs_report/RTableLayouts"], function (require, exports, Jassi_6, RText_1, Tools_1, RComponent_4, RTablerow_2, Property_3, ContextMenu_1, MenuItem_1, Button_2, Runlater_1, RTableLayouts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RTable = void 0;
    var allLayouts = Object.keys(RTableLayouts_1.tableLayouts);
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let RTable = class RTable extends RComponent_4.RComponent {
        /**
    *
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    *
    */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "table";
            // bodyPanel: RTablerow[] = [new RTablerow()];
            this.insertEmptyCells = true;
            this.widths = [];
            this.heights = [];
            super.init($("<table  style='border-spacing:0px;min-width:50px;table-layout: fixed'></table>")[0]);
            //	this.backgroundPanel.width="500px";
            //$(this.backgroundPanel.dom).css("min-width","200px");
            //$(this.dom).css("display", "table");
            // $(this.dom).css("min-width", "50px");
            this.updater = new Runlater_1.Runlater(() => {
                _this.updateLayout(false);
            }, 100);
            let tr = new RTablerow_2.RTablerow();
            tr.parent = this;
            this.add(tr);
            $(this.dom).addClass("designerNoResizable");
            this.initContextMenu(properties === null || properties === void 0 ? void 0 : properties.isdatatable);
            var _this = this;
            this.initKeys();
        }
        initKeys() {
            var _this = this;
            this.on("keydown", (evt) => {
                var _a, _b, _c;
                if (evt.key === "Tab") { //Tabelle erweitern?
                    if (((_b = (_a = evt.target) === null || _a === void 0 ? void 0 : _a._this) === null || _b === void 0 ? void 0 : _b.reporttype) === "text" && this.reporttype === "table") {
                        var rt = (_c = evt.target) === null || _c === void 0 ? void 0 : _c._this;
                        if (rt._parent._components.indexOf(rt) === rt._parent._components.length - 2) { //last row
                            if (rt._parent.parent._components.indexOf(rt._parent) + 1 === rt._parent.parent._components.length) { //lastline
                                var row = new RTablerow_2.RTablerow();
                                row.parent = this;
                                _this.add(row);
                                var cell = new RText_1.RText();
                                row.add(cell);
                                _this._componentDesigner.editDialog(true);
                                _this.addEmptyCellsIfNeeded(_this._components[0]);
                                _this._componentDesigner.editDialog(true);
                                evt.preventDefault();
                                setTimeout(() => {
                                    cell.dom.focus();
                                }, 100);
                            }
                        }
                    }
                }
            });
        }
        getInfoFromEvent(evt) {
            var ret = {};
            ret.cell = this.contextMenu.target.parentNode._this;
            ret.tableRow = ret.cell.parent;
            ret.column = ret.tableRow._components.indexOf(ret.cell);
            ret.row = this._components.indexOf(ret.tableRow);
            return ret;
        }
        async initContextMenu(isDatatable) {
            var _this = this;
            this.contextMenu = new ContextMenu_1.ContextMenu();
            this.contextMenu._isNotEditableInDesigner = true;
            $(this.contextMenu.menu.dom).css("font-family", "Roboto");
            $(this.contextMenu.menu.dom).css("font-size", "12px");
            this.contextMenu.menu._setDesignMode = (nothing) => { }; //should net be editable in designer
            if (isDatatable !== true) {
                var insertRowBefore = new MenuItem_1.MenuItem();
                //@ts-ignore
                insertRowBefore._setDesignMode = (nothing) => { }; //should net be editable in designer
                //@ts-ignore
                insertRowBefore.items._setDesignMode = (nothing) => { };
                insertRowBefore.text = "insert row before";
                insertRowBefore.onclick((evt) => {
                    var info = _this.getInfoFromEvent(evt);
                    var newRow = new RTablerow_2.RTablerow();
                    if (_this.heights && Array.isArray(_this.heights))
                        _this.heights.splice(info.row, 0, "auto");
                    newRow.parent = _this;
                    _this.addBefore(newRow, _this._components[info.row]);
                    newRow.add(new RText_1.RText());
                    //@ts-ignore
                    newRow._setDesignMode(true);
                    _this.fillTableRow(newRow, info.tableRow._components.length);
                    _this._componentDesigner.editDialog(true);
                    _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
                });
                this.contextMenu.menu.add(insertRowBefore);
                var insertRowAfter = new MenuItem_1.MenuItem();
                //@ts-ignore
                insertRowAfter._setDesignMode = (nothing) => { }; //should net be editable in designer
                //@ts-ignore
                insertRowAfter.items._setDesignMode = (nothing) => { };
                insertRowAfter.text = "insert row after";
                insertRowAfter.onclick((evt) => {
                    var info = _this.getInfoFromEvent(evt);
                    var newRow = new RTablerow_2.RTablerow();
                    if (_this.heights && Array.isArray(_this.heights))
                        _this.heights.splice(info.row + 1, 0, "auto");
                    newRow.parent = _this;
                    if (_this._components.length === info.row + 1)
                        _this.add(newRow);
                    else
                        _this.addBefore(newRow, _this._components[info.row + 1]);
                    newRow.add(new RText_1.RText());
                    //@ts-ignore
                    newRow._setDesignMode(true);
                    _this.fillTableRow(newRow, info.tableRow._components.length);
                    _this._componentDesigner.editDialog(true);
                    _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
                });
                this.contextMenu.menu.add(insertRowAfter);
            }
            var insertColumnBefore = new MenuItem_1.MenuItem();
            //@ts-ignore
            insertColumnBefore._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            insertColumnBefore.items._setDesignMode = (nothing) => { };
            insertColumnBefore.text = "insert column before";
            insertColumnBefore.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newCell = new RText_1.RText();
                if (_this.widths && _this.widths.length > 0)
                    _this.widths.splice(info.column, 0, "auto");
                _this.insertEmptyCells = false;
                for (var x = 0; x < _this._components.length; x++) {
                    if (_this._components[x]._components.length > 1)
                        _this._components[x].addBefore(new RText_1.RText(), _this._components[x]._components[info.column]);
                }
                _this.insertEmptyCells = true;
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(insertColumnBefore);
            var insertColumnAfter = new MenuItem_1.MenuItem();
            //@ts-ignore
            insertColumnAfter._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            insertColumnAfter.items._setDesignMode = (nothing) => { };
            insertColumnAfter.text = "insert column after";
            insertColumnAfter.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newCell = new RText_1.RText();
                if (_this.widths && _this.widths.length > 0)
                    _this.widths.splice(info.column + 1, 0, "auto");
                _this.insertEmptyCells = false;
                for (var x = 0; x < _this._components.length; x++) {
                    if (_this._components[x]._components.length > 1)
                        _this._components[x].addBefore(new RText_1.RText(), _this._components[x]._components[info.column + 1]);
                }
                _this.insertEmptyCells = true;
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(insertColumnAfter);
            var removeColumn = new MenuItem_1.MenuItem();
            //@ts-ignore
            removeColumn._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            removeColumn.items._setDesignMode = (nothing) => { };
            removeColumn.text = "delete column";
            removeColumn.onclick((evt) => {
                var _a;
                var info = _this.getInfoFromEvent(evt);
                if (_this.widths && _this.widths.length > 0)
                    _this.widths.slice(info.column, 0);
                for (var x = 0; x < _this._components.length; x++) {
                    var tr = _this._components[x];
                    //@ts-ignore
                    if (((_a = tr._components[info.column]) === null || _a === void 0 ? void 0 : _a.designDummyFor) === undefined) {
                        if (tr._components.length > 1)
                            tr.remove(tr._components[info.column], true);
                    }
                }
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(removeColumn);
            if (isDatatable !== true) {
                var removeRow = new MenuItem_1.MenuItem();
                //@ts-ignore
                removeRow._setDesignMode = (nothing) => { }; //should net be editable in designer
                //@ts-ignore
                removeRow.items._setDesignMode = (nothing) => { };
                removeRow.text = "delete row";
                removeRow.onclick((evt) => {
                    var info = _this.getInfoFromEvent(evt);
                    if (_this.heights && Array.isArray(_this.heights))
                        _this.heights.slice(info.row, 0);
                    _this.remove(_this._components[info.row]);
                    _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
                });
                this.contextMenu.menu.add(removeRow);
            }
            var copyMenu = new Button_2.Button();
            $(copyMenu.dom).css("font-family", "Roboto");
            $(copyMenu.dom).css("font-size", "12px");
            copyMenu.text = "copy";
            copyMenu.width = "100%";
            $(copyMenu.dom).removeClass("jinlinecomponent");
            let func = function (evt) {
                var info = _this.getInfoFromEvent(evt);
                //@ts-ignore
                var edi = tinymce.editors[info.cell._id];
                navigator.clipboard.writeText(edi.selection.getContent());
                _this.contextMenu.close();
            };
            copyMenu.onclick(func);
            this.contextMenu.menu.add(copyMenu);
            var pasteMenu = new Button_2.Button();
            $(pasteMenu.dom).css("font-family", "Roboto");
            $(pasteMenu.dom).css("font-size", "12px");
            pasteMenu.text = "paste";
            pasteMenu.width = "100%";
            $(pasteMenu.dom).removeClass("jinlinecomponent");
            let func2 = function (evt) {
                var info = _this.getInfoFromEvent(evt);
                //@ts-ignore
                var edi = tinymce.editors[info.cell._id];
                navigator.clipboard.readText().then((data) => {
                    edi.selection.setContent(data);
                });
            };
            pasteMenu.onclick(func2);
            this.contextMenu.menu.add(pasteMenu);
        }
        add(component) {
            super.add(component);
            this.updateLayout(true);
        }
        updateLayout(doitlater = false) {
            if (doitlater) {
                this.updater.runlater();
                return;
            }
            this.doTableLayout();
        }
        correctHideAfterSpan() {
            //rowspan
            var span;
            var hiddenCells = {};
            for (var r = 0; r < this._components.length; r++) {
                var row = this._components[r];
                for (var c = 0; c < row._components.length; c++) {
                    var cell = row._components[c];
                    if (cell["colSpan"]) {
                        span = Number.parseInt(cell["colSpan"]);
                        for (var x = c + 1; x < c + span; x++) {
                            hiddenCells[r + ":" + x] = true;
                        }
                    }
                    if (cell["rowSpan"]) {
                        span = Number.parseInt(cell["rowSpan"]);
                        for (var x = r + 1; x < r + span; x++) {
                            hiddenCells[x + ":" + c] = true;
                        }
                    }
                    if (hiddenCells[r + ":" + c] === true) {
                        $(cell.domWrapper).addClass("invisibleAfterSpan");
                    }
                    else {
                        $(cell.domWrapper).removeClass("invisibleAfterSpan");
                    }
                }
            }
        }
        doTableLayout() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
            this.correctHideAfterSpan();
            var tab = this.toJSON();
            if (tab.table === undefined)
                tab.table = tab.datatable;
            if (tab.table.widths === undefined)
                tab.table.widths = [];
            while (this._components[0]._components.length > tab.table.widths.length) {
                tab.table.widths.push("auto"); //designer dummy
            }
            if (tab.table.heights === undefined)
                tab.table.heights = [];
            while (this._components.length - 1 > tab.table.widths.length) {
                tab.table.widths.push("auto"); //designer dummy
            }
            for (var r = 0; r < this._components.length; r++) {
                var row = this._components[r];
                for (var c = 0; c < row._components.length; c++) {
                    var cssid = ["RColumn"];
                    var css = {};
                    var cell = row._components[c];
                    if (this.heights) {
                        var val;
                        if (Number.isInteger(this.heights)) {
                            val = this.heights;
                        }
                        else if (typeof (this.heights) === "function") {
                            //@ts-ignore
                            val = this.heights(r);
                        }
                        else
                            val = this.heights[r];
                        $(row._components[c].dom).css("height", Number.isInteger(val) ? val + "px" : val);
                    }
                    var v = null;
                    if ((_a = this.layout) === null || _a === void 0 ? void 0 : _a.fillColor) {
                        v = (_b = this.layout) === null || _b === void 0 ? void 0 : _b.fillColor(r, tab, c);
                    }
                    if (v === null)
                        v = "initial";
                    css.background_color = v;
                    cssid.push(v.replace("#", ""));
                    v = 1;
                    if ((_c = this.layout) === null || _c === void 0 ? void 0 : _c.hLineWidth) {
                        v = (_d = this.layout) === null || _d === void 0 ? void 0 : _d.hLineWidth(r, tab, c);
                    }
                    css.border_top_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_e = this.layout) === null || _e === void 0 ? void 0 : _e.hLineWidth) {
                        v = (_f = this.layout) === null || _f === void 0 ? void 0 : _f.hLineWidth(r + 1, tab, c);
                    }
                    css.border_bottom_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_g = this.layout) === null || _g === void 0 ? void 0 : _g.vLineWidth) {
                        v = (_h = this.layout) === null || _h === void 0 ? void 0 : _h.vLineWidth(c, tab, r);
                    }
                    css.border_left_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_j = this.layout) === null || _j === void 0 ? void 0 : _j.vLineWidth) {
                        v = (_k = this.layout) === null || _k === void 0 ? void 0 : _k.vLineWidth(c + 1, tab, r);
                    }
                    css.border_right_width = v + "px";
                    cssid.push(v);
                    v = "black";
                    css.border_top_style = (this.layout === "noBorders" || ((_l = this.layout) === null || _l === void 0 ? void 0 : _l.defaultBorder) === false) ? "none" : "solid";
                    css.border_bottom_style = (this.layout === "noBorders" || ((_m = this.layout) === null || _m === void 0 ? void 0 : _m.defaultBorder) === false) ? "none" : "solid";
                    css.border_left_style = (this.layout === "noBorders" || ((_o = this.layout) === null || _o === void 0 ? void 0 : _o.defaultBorder) === false) ? "none" : "solid";
                    css.border_right_style = (this.layout === "noBorders" || ((_p = this.layout) === null || _p === void 0 ? void 0 : _p.defaultBorder) === false) ? "none" : "solid";
                    cssid.push(css.border_top_style);
                    cssid.push(css.border_bottom_style);
                    cssid.push(css.border_left_style);
                    cssid.push(css.border_right_style);
                    if ((_q = this.layout) === null || _q === void 0 ? void 0 : _q.hLineColor) {
                        v = (_r = this.layout) === null || _r === void 0 ? void 0 : _r.hLineColor(r, tab, c);
                    }
                    css.border_top_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_s = this.layout) === null || _s === void 0 ? void 0 : _s.hLineColor) {
                        v = (_t = this.layout) === null || _t === void 0 ? void 0 : _t.hLineColor(r + 1, tab, c);
                    }
                    css.border_bottom_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_u = this.layout) === null || _u === void 0 ? void 0 : _u.vLineColor) {
                        v = (_v = this.layout) === null || _v === void 0 ? void 0 : _v.vLineColor(c, tab, r);
                    }
                    css.border_left_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_w = this.layout) === null || _w === void 0 ? void 0 : _w.vLineColor) {
                        v = (_x = this.layout) === null || _x === void 0 ? void 0 : _x.vLineColor(c + 1, tab, r);
                    }
                    css.border_right_color = v;
                    cssid.push(v.replace("#", ""));
                    v = 1;
                    if ((_y = this.layout) === null || _y === void 0 ? void 0 : _y.paddingLeft) {
                        v = (_z = this.layout) === null || _z === void 0 ? void 0 : _z.paddingLeft(c + 1, tab, r);
                    }
                    css.padding_left = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_0 = this.layout) === null || _0 === void 0 ? void 0 : _0.paddingRight) {
                        v = (_1 = this.layout) === null || _1 === void 0 ? void 0 : _1.paddingRight(c + 1, tab, r);
                    }
                    css.padding_right = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_2 = this.layout) === null || _2 === void 0 ? void 0 : _2.paddingTop) {
                        v = (_3 = this.layout) === null || _3 === void 0 ? void 0 : _3.paddingTop(r + 1, tab, c);
                    }
                    css.padding_top = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_4 = this.layout) === null || _4 === void 0 ? void 0 : _4.paddingBottom) {
                        v = (_5 = this.layout) === null || _5 === void 0 ? void 0 : _5.paddingBottom(r + 1, tab, c);
                    }
                    css.padding_bottom = v + "px";
                    cssid.push(v);
                    var scssid = cssid.join("-");
                    var found = false;
                    cell.domWrapper.classList.forEach((cl) => {
                        if (cl.startsWith("RColumn")) {
                            if (cl === scssid)
                                found = true;
                            else
                                cell.domWrapper.classList.remove(cl);
                        }
                    });
                    if (!found) {
                        cell.domWrapper.classList.add(scssid);
                    }
                    if (document.getElementById(scssid) === null) {
                        var sc = {};
                        sc["." + scssid] = css;
                        Jassi_6.default.includeCSS(scssid, sc);
                    }
                }
            }
        }
        _setDesignMode(enable) {
            this._designMode = enable;
            //do nothing - no add button
        }
        /*	get design():any{
                return this.toJSON();
            };
            set design(value:any){
                ReportDesign.fromJSON(value,this);
            }*/
        fillTableRow(row, count) {
            if (!row._designMode || count - row._components.length < 1)
                return;
            for (var x = row._components.length; x < count; x++) {
                var rr = new RText_1.RText();
                row.addBefore(rr, row._components[row._components.length - 1]); //after addbutton
            }
        }
        addEmptyCellsIfNeeded(row) {
            if (this.insertEmptyCells === false)
                return;
            var count = row._components.length;
            var _this = this;
            this._components.forEach((tr) => {
                _this.fillTableRow(tr, count);
            });
        }
        /**
       * sets the height of a table cell
       * @param component - the table cell
       * @param height - the new height
       **/
        setChildHeight(component, height) {
            if (Number.isInteger(this.heights)) {
                this.heights = height;
                var test = Number(height);
                for (var x = 0; x < tr._components.length; x++) {
                    $(tr._components[x].dom).css("height", (test === NaN) ? height : (test + "px"));
                }
                return;
            }
            if (typeof (this.heights) === "function") {
                this.heights = [];
            }
            var found = -1;
            var tr = component._parent;
            var max = tr._components.length - 1;
            var test = Number(height);
            for (var x = 0; x < tr._components.length; x++) {
                $(tr._components[x].dom).css("height", (test === NaN) ? height : (test + "px"));
            }
            for (var t = this.heights.length; t < max; t++) {
                this.heights.push("auto");
            }
            this.heights[this._components.indexOf(tr)] = (test === NaN) ? height : test;
        }
        /**
        * gets the width of a table cell
        * @param component - the table cell
        **/
        getChildHeight(component) {
            var pos = this._components.indexOf(component._parent);
            if (Number.isInteger(this.heights)) {
                return this.heights;
            }
            else if (typeof (this.heights) === "function") {
                //@ts-ignore
                return this.heights(pos);
            }
            else { //Array
                if (pos === -1)
                    return undefined;
                return this.heights[pos];
            }
            //this._parent.setChildWidth(component,value);
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
                this.widths[found] = Number(width);
                if (this.widths[found] === NaN)
                    this.widths[found] = width;
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
        set layoutName(value) {
            var _a;
            var old = this.layoutName;
            if (value === "custom" && old === undefined && this.layout !== undefined)
                return; //if user has changed the layout then do not modify
            this.layout = (_a = RTableLayouts_1.tableLayouts[value]) === null || _a === void 0 ? void 0 : _a.layout;
            this.updateLayout(true);
        }
        get layoutName() {
            var ret = this.findTableLayout(this.layout);
            if (ret === undefined)
                ret = this.layout === undefined ? "" : "custom";
            return ret;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
            }
            super.extensionCalled(action);
        }
        findTableLayout(func) {
            var sfind = Tools_1.Tools.objectToJson(func, undefined, false).replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
            for (var key in RTableLayouts_1.tableLayouts) {
                var test = Tools_1.Tools.objectToJson(RTableLayouts_1.tableLayouts[key].layout, undefined, false).replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
                if (sfind === test)
                    return key;
            }
            return undefined;
        }
        fromJSON(obj, callingFromTable = undefined) {
            var _a;
            var ob = obj.table;
            var ret = this;
            if (ob)
                ret.removeAll();
            if (callingFromTable)
                ob = callingFromTable;
            if (ob === null || ob === void 0 ? void 0 : ob.body) {
                for (var x = 0; x < ob.body.length; x++) {
                    let obb = new RTablerow_2.RTablerow().fromJSON(ob.body[x]);
                    obb.parent = this;
                    ret.add(obb);
                    /*   let all = [];
                       obb._components.forEach((obp) => all.push(obp));
                       all.forEach((obp) => { obb.add(obp) });
                       obb.destroy();*/
                }
                delete ob.body;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.headerRows) {
                ret.headerRows = ob.headerRows;
                delete ob.headerRows;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.widths) {
                ret.widths = ob.widths;
                delete ob.widths;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.heights) {
                ret.heights = ob.heights;
                delete ob.heights;
            }
            if (obj.layout) {
                if (typeof (obj.layout) === "string") {
                    if (((_a = RTableLayouts_1.tableLayouts[obj.layout]) === null || _a === void 0 ? void 0 : _a.isSystem) === true) {
                        ret.layout = RTableLayouts_1.tableLayouts[obj.layout].layout;
                    }
                }
                else
                    ret.layout = obj.layout;
                delete obj.layout;
            }
            var tr = this._components[0];
            for (var x = 0; x < tr._components.length; x++) {
                $(tr._components[x].domWrapper).attr("width", this.widths[x]);
            }
            if (this.heights) {
                for (var r = 0; r < this._components.length; r++) {
                    var row = this._components[r];
                    for (var c = 0; c < row._components.length; c++) {
                        var val;
                        if (Number.isInteger(this.heights)) {
                            val = this.heights;
                        }
                        else if (typeof (this.heights) === "function") {
                            //@ts-ignore
                            val = this.heights(r);
                        }
                        else
                            val = this.heights[r];
                        $(row._components[c].dom).css("height", Number.isInteger(val) ? val + "px" : val);
                    }
                }
            }
            super.fromJSON(ob);
            this.updateLayout(false);
            return ret;
        }
        toJSON(datatable = undefined) {
            var _a;
            var r = {};
            var ret = super.toJSON();
            ret.table = r;
            if (this.layout) {
                var test = this.findTableLayout(this.layout);
                if ((_a = RTableLayouts_1.tableLayouts[test]) === null || _a === void 0 ? void 0 : _a.isSystem)
                    ret.layout = test;
                else
                    ret.layout = this.layout;
            }
            if (this.headerRows) {
                r.headerRows = this.headerRows;
            }
            if (this.widths && this.widths.length > 0) {
                r.widths = this.widths;
                var len = this._components[0]._components.length;
                //@ts-ignore
                if (this._components[0]._components[len - 1].designDummyFor !== undefined)
                    len--;
                for (var t = r.widths.length; t < len; t++) {
                    r.widths.push("auto");
                }
                //remove width
                while (r.widths.length > len) {
                    r.widths.pop();
                }
            }
            //TODO height=50 -> gilt für alle und height=function() not supported
            if (Number.isInteger(this.heights) || typeof (this.heights) === "function") {
                r.heights = this.heights;
            }
            else if (this.heights && this.heights.length > 0) {
                r.heights = this.heights;
                var len = this._components.length;
                for (var t = r.heights.length; t < len; t++) {
                    r.heights.push("auto");
                }
                //remove heights
                while (r.heights.length > len) {
                    r.heights.pop();
                }
            }
            if (datatable === true) {
            }
            else {
                r.body = [];
                for (var x = 0; x < this._components.length; x++) {
                    r.body.push(this._components[x].toJSON());
                }
            }
            return ret;
        }
    };
    __decorate([
        (0, Property_3.$Property)(),
        __metadata("design:type", Number)
    ], RTable.prototype, "headerRows", void 0);
    __decorate([
        (0, Property_3.$Property)({ chooseFrom: allLayouts, chooseFromStrict: true }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RTable.prototype, "layoutName", null);
    RTable = __decorate([
        (0, RComponent_4.$ReportComponent)({ fullPath: "report/Table", icon: "mdi mdi-table-large", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] }),
        (0, Jassi_6.$Class)("jassijs_report.RTable"),
        __metadata("design:paramtypes", [Object])
    ], RTable);
    exports.RTable = RTable;
    async function test() {
    }
    exports.test = test;
});
define("jassijs_report/RGroupTablerow", ["require", "exports", "jassijs_report/RTablerow", "jassijs_report/RComponent", "jassijs/remote/Jassi", "jassijs/ui/Property"], function (require, exports, RTablerow_3, RComponent_5, Jassi_7, Property_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RGroupTablerow = void 0;
    let RGroupTablerow = 
    //@$Property({name:"horizontal",hide:true})
    class RGroupTablerow extends RTablerow_3.RTablerow {
        get expression() {
            var _a, _b, _c;
            var pos = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.groupFooterPanel.indexOf(this);
            if (pos === -1)
                pos = (_b = this.parent) === null || _b === void 0 ? void 0 : _b.groupHeaderPanel.indexOf(this);
            if (pos === -1)
                return undefined;
            return (_c = this.parent) === null || _c === void 0 ? void 0 : _c.groupExpression[pos];
        }
        set expression(value) {
            var _a, _b;
            var pos = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.groupFooterPanel.indexOf(this);
            if (pos === -1)
                pos = (_b = this.parent) === null || _b === void 0 ? void 0 : _b.groupHeaderPanel.indexOf(this);
            if (pos === -1)
                return;
            this.parent.groupExpression[pos] = value;
        }
        get _editorselectthis() {
            return this;
        }
    };
    __decorate([
        (0, Property_4.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RGroupTablerow.prototype, "expression", null);
    RGroupTablerow = __decorate([
        (0, RComponent_5.$ReportComponent)({ editableChildComponents: ["this"] }),
        (0, Jassi_7.$Class)("jassijs_report.RTablerow")
        //@$Property({name:"horizontal",hide:true})
    ], RGroupTablerow);
    exports.RGroupTablerow = RGroupTablerow;
});
define("jassijs_report/RImage", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs_report/RComponent"], function (require, exports, Jassi_8, Property_5, RComponent_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RImage = void 0;
    //mdi-format-list-numbered
    let RImage = 
    //@$Property({name:"horizontal",hide:true})
    class RImage extends RComponent_6.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "image";
            this._image = "";
            this.init($('<img class="RImage"></img>')[0]);
            $(this.domWrapper).removeClass("jcontainer");
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            //do nothing
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            //do nothing
        }
        set image(value) {
            this._image = value;
            if (value === undefined)
                $(this.dom).attr("src", "");
            else {
                //later we have a parent
                var report = RComponent_6.RComponent.findReport(this);
                var _this = this;
                if (report === undefined) {
                    if (_this["nextTry"] === undefined) { //deny recurse
                        setTimeout(() => {
                            _this["nextTry"] = true;
                            _this.image = value;
                        }, 200);
                    }
                    else {
                        delete _this["nextTry"];
                    }
                }
                else {
                    var im = report.images;
                    if (im !== undefined && im[value] !== undefined) {
                        $(this.dom).attr("src", im[value]);
                    }
                    else {
                        $(this.dom).attr("src", value);
                    }
                }
            }
        }
        get image() {
            return this._image;
        }
        set fit(value) {
            this._fit = value;
            if (value === undefined) {
                $(this.__dom).css("object-fit", "");
                this.width = this.width;
                this.height = this.height;
            }
            else {
                $(this.__dom).css("object-fit", "contain");
                $(this.__dom).css("width", value[0]);
                $(this.__dom).css("height", value[1]);
            }
        }
        get fit() {
            return this._fit;
        }
        set opacity(value) {
            this._opacity = value;
            if (value === undefined) {
                $(this.__dom).css("opacity", "");
            }
            else {
                $(this.__dom).css("opacity", value);
            }
        }
        get opacity() {
            return this._opacity;
        }
        toJSON() {
            var ret = super.toJSON();
            if (this.fit) {
                ret.fit = this.fit;
            }
            if (this.opacity) {
                ret.opacity = this.opacity;
            }
            //if (this.image)
            ret.image = this.image;
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            if (ob.fit) {
                ret.fit = ob.fit;
                delete ob.fit;
            }
            if (ob.opacity) {
                ret.opacity = ob.opacity;
                delete ob.opacity;
            }
            //if (ob.image)
            ret.image = ob.image;
            delete ob.image;
            super.fromJSON(ob);
            return ret;
        }
    };
    __decorate([
        (0, Property_5.$Property)({
            type: "rimage",
            chooseFrom: (data) => {
                debugger;
                return [];
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RImage.prototype, "image", null);
    __decorate([
        (0, Property_5.$Property)({ type: "number[]", decription: "fit in rectangle width, height e.g. 10,20" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RImage.prototype, "fit", null);
    __decorate([
        (0, Property_5.$Property)({ type: "number" }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RImage.prototype, "opacity", null);
    RImage = __decorate([
        (0, RComponent_6.$ReportComponent)({ fullPath: "report/Image", icon: "mdi mdi-image-frame" }),
        (0, Jassi_8.$Class)("jassijs_report.RImage")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RImage);
    exports.RImage = RImage;
});
define("jassijs_report/RImageEditor", ["require", "exports", "jassijs/ui/Databinder", "jassijs/ui/Upload", "jassijs/ui/Textbox", "jassijs/ui/Image", "jassijs/ui/Button", "jassijs/ui/Repeater", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/PropertyEditors/Editor", "jassijs_report/RComponent"], function (require, exports, Databinder_1, Upload_1, Textbox_1, Image_1, Button_3, Repeater_1, Jassi_9, Panel_3, Editor_1, RComponent_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RImageChooser = exports.RImageEditor = void 0;
    let RImageEditor = class RImageEditor extends Editor_1.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_3.Panel( /*{useSpan:true}*/);
            this._button = new Button_3.Button();
            this._textbox = new Textbox_1.Textbox();
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 24;
            this._button.icon = "mdi mdi-glasses";
            this.component.add(this._textbox);
            this.component.add(this._button);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange(param);
            });
            this._button.onclick(() => {
                _this.showDialog();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value === null || value === void 0 ? void 0 : value.startsWith('"'))
                value = value.substring(1);
            if (value === null || value === void 0 ? void 0 : value.endsWith('"')) {
                value = value.substring(0, value.length - 1);
            }
            this._textbox.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            if (this.property) {
                this.propertyEditor.setPropertyInCode(this.property.name, '"' + val + '"');
                this.propertyEditor.setPropertyInDesign(this.property.name, val);
            }
            super.callEvent("edit", param);
        }
        async showDialog(onlytest = undefined) {
            var _this = this;
            if (!this.dialog) {
                this.dialog = new RImageChooser();
                var image = this.ob;
                var report = RComponent_7.RComponent.findReport(image);
                if (report === null || report === void 0 ? void 0 : report.images)
                    this.dialog.items = report.images;
                $(this.dialog.__dom).dialog({ height: "400", width: "400",
                    close: () => {
                        if (report)
                            report.images = _this.dialog.items;
                        _this._onchange();
                    } });
                this.dialog.onpictureselected((val) => {
                    _this._textbox.value = val;
                    if (report)
                        report.images = _this.dialog.items;
                    _this._onchange();
                    $(this.dialog.__dom).dialog("close");
                });
            }
            else {
                $(this.dialog.__dom).dialog("open");
            }
        }
    };
    RImageEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["rimage"]),
        (0, Jassi_9.$Class)("jassi_report/RImagePropertyEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], RImageEditor);
    exports.RImageEditor = RImageEditor;
    class RImageChooser extends Panel_3.Panel {
        constructor() {
            super();
            this._items = [];
            this.me = {};
            this.layout(this.me);
        }
        set items(val) {
            this._items.splice(0, this._items.length);
            for (var key in val) {
                this._items.push({ name: key, data: val[key] });
            }
            this.me.repeater1.value = this._items;
        }
        get items() {
            var ret = {};
            for (var x = 0; x < this._items.length; x++) {
                ret[this._items[x].name] = this._items[x].data;
            }
            return ret;
        }
        onpictureselected(func) {
            this.addEvent("pictureselected", func);
        }
        layout(me) {
            var _this = this;
            me.repeater1 = new Repeater_1.Repeater();
            me.databinder1 = new Databinder_1.Databinder();
            me.databinder1.value = this;
            me.repeater1.value = this._items;
            me.upload1 = new Upload_1.Upload();
            me.upload1.onuploaded((data) => {
                for (var key in data) {
                    _this._items.push({ name: key.split(".")[0], data: data[key] });
                }
                _this.items = _this.items;
            });
            me.upload1.readAs = "DataUrl";
            this.add(me.upload1);
            this.add(me.repeater1);
            me.repeater1.createRepeatingComponent(function (me) {
                me.panel1 = new Panel_3.Panel();
                me.image1 = new Image_1.Image();
                me.itile = new Textbox_1.Textbox();
                me.remove = new Button_3.Button();
                me.repeater1.design.add(me.panel1);
                me.panel1.add(me.itile);
                me.panel1.add(me.remove);
                me.panel1.add(me.image1);
                me.image1.height = "75";
                me.remove.text = "";
                me.remove.icon = "mdi mdi-delete-forever-outline";
                me.itile.bind(me.repeater1.design.databinder, "name");
                me.image1.bind(me.repeater1.design.databinder, "data");
                me.remove.onclick(function (event) {
                    var ob = me.itile._databinder.value;
                    let pos = _this._items.indexOf(ob);
                    _this._items.splice(pos, 1);
                    _this.items = _this.items;
                });
                me.image1.onclick(function (event) {
                    var ob = me.itile._databinder.value;
                    _this.value = ob.name;
                    _this.callEvent("pictureselected", ob.name);
                });
            });
        }
    }
    exports.RImageChooser = RImageChooser;
    async function test() {
        var ret = new RImageChooser();
        ret.items = {
            building: 'data:image/jpeg;base64,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AAGyAAAAEAAAAAEAAAAAABJwcmludE91dHB1dE9wdGlvbnMAAAASAAAAAENwdG5ib29sAAAAAABDbGJyYm9vbAAAAAAAUmdzTWJvb2wAAAAAAENybkNib29sAAAAAABDbnRDYm9vbAAAAAAATGJsc2Jvb2wAAAAAAE5ndHZib29sAAAAAABFbWxEYm9vbAAAAAAASW50cmJvb2wAAAAAAEJja2dPYmpjAAAAAQAAAAAAAFJHQkMAAAADAAAAAFJkICBkb3ViQG/gAAAAAAAAAAAAR3JuIGRvdWJAb+AAAAAAAAAAAABCbCAgZG91YkBv4AAAAAAAAAAAAEJyZFRVbnRGI1JsdAAAAAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAB4OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgABOEJJTQQCAAAAAAAEAAAAADhCSU0EMAAAAAAAAgEBOEJJTQQtAAAAAAAGAAEAAAACOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0sAAAAGAAAA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aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMDMtMTlUMDM6MDI6MjYrMDE6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxODAxMTc0MDcyMDY4MTE4NzFGODEzMUZCNkU2ODk4IiBzdEV2dDp3aGVuPSIyMDE0LTAzLTE5VDAzOjAyOjI2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgc3RFdnQ6d2hlbj0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0IChjKSAxOTk4IEhld2xldHQtUGFja2FyZCBDb21wYW55AABkZXNjAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAA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',
            building2: 'data:image/jpeg;base64,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AAGyAAAAEAAAAAEAAAAAABJwcmludE91dHB1dE9wdGlvbnMAAAASAAAAAENwdG5ib29sAAAAAABDbGJyYm9vbAAAAAAAUmdzTWJvb2wAAAAAAENybkNib29sAAAAAABDbnRDYm9vbAAAAAAATGJsc2Jvb2wAAAAAAE5ndHZib29sAAAAAABFbWxEYm9vbAAAAAAASW50cmJvb2wAAAAAAEJja2dPYmpjAAAAAQAAAAAAAFJHQkMAAAADAAAAAFJkICBkb3ViQG/gAAAAAAAAAAAAR3JuIGRvdWJAb+AAAAAAAAAAAABCbCAgZG91YkBv4AAAAAAAAAAAAEJyZFRVbnRGI1JsdAAAAAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAB4OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgABOEJJTQQCAAAAAAAEAAAAADhCSU0EMAAAAAAAAgEBOEJJTQQtAAAAAAAGAAEAAAACOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0sAAAAGAAAA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aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMDMtMTlUMDM6MDI6MjYrMDE6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxODAxMTc0MDcyMDY4MTE4NzFGODEzMUZCNkU2ODk4IiBzdEV2dDp3aGVuPSIyMDE0LTAzLTE5VDAzOjAyOjI2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgc3RFdnQ6d2hlbj0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0IChjKSAxOTk4IEhld2xldHQtUGFja2FyZCBDb21wYW55AABkZXNjAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAA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'
        };
        return ret;
    }
    exports.test = test;
});
define("jassijs_report/ROList", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Jassi_10, Component_3, Property_6, ReportDesign_2, RComponent_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ROList = void 0;
    //Limitations not implemented: separator,markerColor, counter is counting also the next elements
    let ROList = 
    //@$Property({name:"horizontal",hide:true})
    class ROList extends RComponent_8.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "ol";
            this.init($("<ol></ol>")[0]);
        }
        set type(value) {
            this._type = value;
            if (value === undefined)
                $(this.dom).css("list-style-type", "");
            else
                $(this.dom).css("list-style-type", value);
        }
        get type() {
            return this._type;
        }
        set reversed(value) {
            this._reversed = value;
            if (this._reversed)
                $(this.__dom).attr("reversed", "");
            else
                $(this.__dom).removeAttr("reversed");
        }
        get reversed() {
            return this._reversed;
        }
        set start(value) {
            this._start = value;
            $(this.__dom).attr("start", value);
        }
        get start() {
            return this._start;
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_3.Component.replaceWrapper(component, document.createElement("li"));
            if (component._counter)
                component.counter = component._counter;
            if (component.listType !== undefined)
                component.listType = component._listType;
            super.addBefore(component, before);
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_3.Component.replaceWrapper(component, document.createElement("li"));
            if (component.listType !== undefined)
                component.listType = component._listType;
            if (component._counter)
                component.counter = component._counter;
            super.add(component);
        }
        toJSON() {
            var ret = super.toJSON();
            ret.ol = [];
            if (this.reversed)
                ret.reversed = true;
            if (this.start)
                ret.start = this.start;
            if (this.type)
                ret.type = this.type;
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.ol.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.ol;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_2.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.ol;
            if (ob.reversed)
                ret.reversed = ob.reversed;
            delete ob.reversed;
            if (ob.start)
                ret.start = ob.start;
            delete ob.start;
            if (ob.type)
                ret.type = ob.type;
            delete ob.type;
            super.fromJSON(ob);
            return ret;
        }
    };
    __decorate([
        (0, Property_6.$Property)({ chooseFrom: ["lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "none"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ROList.prototype, "type", null);
    __decorate([
        (0, Property_6.$Property)({ default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], ROList.prototype, "reversed", null);
    __decorate([
        (0, Property_6.$Property)({ default: 1 }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], ROList.prototype, "start", null);
    ROList = __decorate([
        (0, RComponent_8.$ReportComponent)({ fullPath: "report/Ordered List", icon: "mdi mdi-format-list-numbered", editableChildComponents: ["this"] }),
        (0, Jassi_10.$Class)("jassijs_report.ROList")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], ROList);
    exports.ROList = ROList;
});
define("jassijs_report/RStack", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Jassi_11, ReportDesign_3, RComponent_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RStack = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RStack = 
    //@$Property({name:"horizontal",hide:true})
    class RStack extends RComponent_9.RComponent {
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
            $(this.dom).addClass("designerNoResizable");
        }
        /**
          * adds a component to the container before an other component
          * @param {jassijs.ui.Component} component - the component to add
          * @param {jassijs.ui.Component} before - the component before then component to add
          */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            super.addBefore(component, before);
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            super.add(component);
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
            var test = 0;
            for (var key in ret) {
                test++;
            }
            if (test === 1)
                ret = ret.stack; //short version
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob;
            if (ob.stack)
                arr = ob.stack;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_3.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.stack;
            if (!Array.isArray(ob))
                super.fromJSON(ob);
            return ret;
        }
    };
    RStack = __decorate([
        (0, RComponent_9.$ReportComponent)({ fullPath: "report/Stack", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        (0, Jassi_11.$Class)("jassijs_report.RStack")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RStack);
    exports.RStack = RStack;
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
define("jassijs_report/RStyle", ["require", "exports", "jassijs_report/RComponent", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs/remote/Classes"], function (require, exports, RComponent_10, Jassi_12, Property_7, Classes_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RStyle = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RStyle = 
    //@$Property({name:"horizontal",hide:true})
    class RStyle extends RComponent_10.RComponent {
        constructor(properties = undefined) {
            super(properties);
            this.$isInivisibleComponent = true; //invisible component in designer
            this.reporttype = "style";
            var _this = this;
            this.onstylechanged((param1, param2) => {
                _this.update();
            });
        }
        set name(value) {
            var old = this._name;
            this._name = value;
            if (this.activeComponentDesigner) {
                if (old) { //remove old
                    var all = this.activeComponentDesigner.variables.value;
                    for (let x = 0; x < all.length; x++) {
                        if (all[x].name === old) {
                            all.splice(x, 1);
                            this.activeComponentDesigner.variables.value = all;
                            break;
                        }
                    }
                    this.activeComponentDesigner.variables.addVariable(value, this, true);
                    this.activeComponentDesigner.resize();
                }
            }
        }
        addToParent(suggestedparent) {
            if (suggestedparent === undefined)
                throw new Classes_2.JassiError("suggestedparent is undefined");
            if (suggestedparent.reporttype === "report") {
                suggestedparent.styleContainer.add(this);
                return;
            }
            this.addToParent(suggestedparent._parent);
        }
        get name() {
            return this._name;
        }
        toJSON() {
            var ret = super.toJSON();
            return ret;
        }
        update() {
            var style = document.getElementById(this.styleid);
            if (!document.getElementById(this.styleid)) {
                style = $('<style id=' + this.styleid + '></style>')[0];
                document.head.appendChild(style);
            }
            var prop = {};
            var sstyle = "\t." + this.styleid + "{\n";
            sstyle += this.dom.style.cssText;
            sstyle = sstyle + "\t}\n";
            style.innerHTML = sstyle;
        }
        fromJSON(ob) {
            var ret = this;
            super.fromJSON(ob);
            //delete ob.stack;
            return ret;
        }
        //this.dom.style.cssText
        get styleid() {
            return "jassistyle" + this._id;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this.activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
    };
    __decorate([
        (0, Property_7.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RStyle.prototype, "name", null);
    RStyle = __decorate([
        (0, RComponent_10.$ReportComponent)({ fullPath: "report/Style", icon: "mdi mdi-virus-outline", editableChildComponents: ["this"] }),
        (0, Jassi_12.$Class)("jassijs_report.RStyle")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RStyle);
    exports.RStyle = RStyle;
    function test() {
        var n = new RStyle();
        var hh = Object.getOwnPropertyDescriptor(n, "name");
        debugger;
    }
    exports.test = test;
});
define("jassijs_report/RTableLayouts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tableLayouts = void 0;
    var tableLayouts = {
        zebra: {
            isSystem: false,
            layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        },
        noBorders: {
            isSystem: true,
            layout: {
                hLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        headerLineOnly: {
            isSystem: false,
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 1 ? 2 : 0); //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        lightHorizontalLines: {
            isSystem: true,
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 1)
                        return 2;
                    if (i === 0 || i === node.table.body.length)
                        return 0;
                    return 1; //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        frameWithLines: {
            isSystem: false,
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                }
            }
        },
        frame: {
            isSystem: false,
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 0;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 0;
                }
            }
        },
        custom: {
            isSystem: false,
            layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return null;
                },
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 4 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'red';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'blue' : 'green';
                },
                paddingLeft: function (i, node) { return 1; },
                paddingRight: function (i, node) { return 1; },
                paddingTop: function (i, node) { return 1; },
                paddingBottom: function (i, node) { return 1; }
            }
        }
    };
    exports.tableLayouts = tableLayouts;
});
define("jassijs_report/RTablerow", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs_report/ReportDesign", "jassijs_report/RComponent", "jassijs_report/RText"], function (require, exports, Jassi_13, Component_4, ReportDesign_4, RComponent_11, RText_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTablerow = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RTablerow = 
    //@$Property({name:"horizontal",hide:true})
    class RTablerow extends RComponent_11.RComponent {
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
            $(this.dom).addClass("designerNoResizable");
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
        setChildHeight(component, value) {
            var _a;
            (_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight(component, value);
        }
        getChildHeight(component) {
            var _a;
            return (_a = this._parent) === null || _a === void 0 ? void 0 : _a.getChildHeight(component);
        }
        wrapComponent(component) {
            var _a;
            var _this = this;
            if (((_a = component.domWrapper) === null || _a === void 0 ? void 0 : _a.tagName) === "TD")
                return; //allready wrapped
            Component_4.Component.replaceWrapper(component, document.createElement("td"));
            var border = component["border"];
            if (border !== undefined) {
                $(component.domWrapper).css("border-left-style", border[0] ? "solid" : "none");
                $(component.domWrapper).css("border-top-style", border[1] ? "solid" : "none");
                $(component.domWrapper).css("border-right-style", border[2] ? "solid" : "none");
                $(component.domWrapper).css("border-bottom-style", border[3] ? "solid" : "none");
            }
            if (component.colSpan)
                $(component.domWrapper).attr("colspan", component.colSpan);
            if (component.rowSpan)
                $(component.domWrapper).attr("rowspan", component.rowSpan);
            //$(component.dom).css("background-color","inherit");
            $(component.domWrapper).css("word-break", "break-all");
            $(component.domWrapper).css("display", "");
            if (component.reporttype === "text") {
                var rt = component;
                rt.customToolbarButtons["Table"] = {
                    title: "<span class='mdi mdi-grid'><span>",
                    action: () => {
                        var test = rt;
                        rt.parent.parent.contextMenu.target = component.dom.children[0];
                        rt.parent.parent.contextMenu.show();
                    }
                };
            }
            $(component.dom).removeClass("designerNoResizable");
            $(component.dom).addClass("designerNoResizableY");
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            var _a, _b;
            if (component.addToParent)
                return component.addToParent(this);
            if (this.forEachDummy)
                return;
            this.wrapComponent(component);
            component.parent = this;
            super.add(component);
            // $(component.domWrapper).css("display", "table-cell");
            this.callEvent("componentAdded", component, this);
            if (this._parent)
                this._parent.addEmptyCellsIfNeeded(this);
            if (component.designDummyFor) {
                $(component.domWrapper).attr("colspan", "100");
                if ($(this.dom).width() < 140) {
                    component.width = 140 - $(this.dom).width();
                }
            }
            if ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.updateLayout)
                (_b = this.parent) === null || _b === void 0 ? void 0 : _b.updateLayout(true);
            /*  var test=component.height;
              if(test)
                  component.height=test;*/
        }
        /**
      * adds a component to the container before an other component
      * @param {jassijs.ui.Component} component - the component to add
      * @param {jassijs.ui.Component} before - the component before then component to add
      */
        addBefore(component, before) {
            var _a, _b;
            if (component.addToParent)
                return component.addToParent(this);
            if (this.forEachDummy)
                return;
            this.wrapComponent(component);
            component.parent = this;
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter = true;
            }
            super.addBefore(component, before);
            // $(component.domWrapper).css("display", "table-cell");
            this.callEvent("componentAdded", component, this);
            //if (this._parent)
            //  this._parent.addEmptyCellsIfNeeded(this);
            if ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.updateLayout)
                (_b = this.parent) === null || _b === void 0 ? void 0 : _b.updateLayout(true);
            /*var test=component.height;
            if(test)
                component.height=test;*/
        }
        fromJSON(columns) {
            var ret = this;
            if (columns["foreach"]) {
                var dummy = new RText_2.RText();
                dummy.value = "foreach";
                dummy.colSpan = 200;
                this.add(dummy);
                //this.domWrapper.appendChild($('<td colspan=500>foreach</td>')[0]);
                ret.forEachDummy = columns;
                return ret;
            }
            for (let x = 0; x < columns.length; x++) {
                ret.add(ReportDesign_4.ReportDesign.fromJSON(columns[x]));
            }
            return ret;
        }
        toJSON() {
            var columns = [];
            if (this.forEachDummy)
                return this.forEachDummy;
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                columns.push(this._components[x].toJSON());
            }
            //Object.assign(ret, this["otherProperties"]);
            return columns;
        }
    };
    RTablerow = __decorate([
        (0, RComponent_11.$ReportComponent)({ editableChildComponents: ["this"] }),
        (0, Jassi_13.$Class)("jassijs_report.RTablerow")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RTablerow);
    exports.RTablerow = RTablerow;
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
define("jassijs_report/RText", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RComponent", "jassijs/ui/HTMLPanel", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs/ui/CSSProperties"], function (require, exports, Jassi_14, RComponent_12, HTMLPanel_1, Property_8, ReportDesign_5, CSSProperties_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RText = void 0;
    class InlineStyling {
    }
    let RText = class RText extends RComponent_12.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "text";
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.customToolbarButtons = {};
            super.init($('<div class="RText mce-content-body jdisableaddcomponents" tabindex="0" ><div  class="HTMLPanelContent"></div></div>')[0]); //tabindex for key-event
            $(this.domWrapper).removeClass("jcontainer");
            $(this.__dom).css("text-overflow", "ellipsis");
            $(this.__dom).css("overflow", "hidden");
            $(this.dom).addClass("designerNoResizable");
            (0, CSSProperties_1.loadFontIfNedded)("Roboto");
            //  super.init($('<div class="RText"></div>')[0]);
            var el = this.dom.children[0];
            this._designMode = false;
            $(this.dom).css("display", "block");
            // this.css({ font_family: "inherit", font_size: "inherit" })
            //   $(this.dom.children[0]).css("display","inline-block");
            this.extensionCalled = HTMLPanel_1.HTMLPanel.prototype.extensionCalled.bind(this);
            this._setDesignMode = HTMLPanel_1.HTMLPanel.prototype._setDesignMode.bind(this);
            this.initIfNeeded = HTMLPanel_1.HTMLPanel.prototype.initIfNeeded.bind(this);
            //@ts-ignore
            this._initTinymce = HTMLPanel_1.HTMLPanel.prototype._initTinymce.bind(this);
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
        fromJSON(ob) {
            var ret = this;
            if (ob.editTogether) {
                delete ob.editTogether;
                ret.convertToHTML(ob.text);
            }
            else
                ret.value = ob.text.replaceAll("\n", "<br/>");
            delete ob.text;
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
                    if (style.font)
                        rt.font = style.font;
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
            var ret = super.toJSON();
            this.convertFromHTML(ret);
            var test = 0;
            for (var key in ret) {
                test++;
            }
            if (test === 1)
                ret = ret.text; //short version
            return ret;
        }
    };
    __decorate([
        (0, Property_8.$Property)({
            chooseFrom: function (component) {
                return ReportDesign_5.ReportDesign.getVariables(component);
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "value", null);
    RText = __decorate([
        (0, RComponent_12.$ReportComponent)({ fullPath: "report/Text", icon: "mdi mdi-format-color-text" }),
        (0, Jassi_14.$Class)("jassijs_report.RText")
        //@$Property({hideBaseClassProperties:true})
        ,
        (0, Property_8.$Property)({ name: "value", type: "string", description: "text" }),
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
define("jassijs_report/RTextGroup", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/ReportDesign", "jassijs_report/RComponent", "jassijs/remote/Classes"], function (require, exports, Jassi_15, ReportDesign_6, RComponent_13, Classes_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTextGroup = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RTextGroup = 
    //@$Property({name:"horizontal",hide:true})
    class RTextGroup extends RComponent_13.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = { useSpan: true }) {
            super(properties);
            this.reporttype = "textgroup";
            // $(this.dom).css("flex-direction", "column");
            //$(this.dom).addClass("designerNoResizable");
        }
        /**
          * adds a component to the container before an other component
          * @param {jassijs.ui.Component} component - the component to add
          * @param {jassijs.ui.Component} before - the component before then component to add
          */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            if (component.reporttype !== "text" && component.reporttype !== "textgroup" && !component.designDummyFor)
                throw new Classes_3.JassiError("only text oder textgroup could be added to TextGroup");
            super.addBefore(component, before);
            //  $(component.dom).css("display", "inline");
            $(component.domWrapper).css("display", "inline-block");
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            if (component.reporttype !== "text" && component.reporttype !== "textgroup" && !component.designDummyFor)
                throw new Classes_3.JassiError("only text oder textgroup could be added to TextGroup");
            super.add(component);
            //  $(component.dom).css("display", "inline-block");
            $(component.domWrapper).css("display", "inline-block");
        }
        toJSON() {
            var ret = super.toJSON();
            ret.text = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.text.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.text;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_6.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.text;
            return ret;
        }
    };
    RTextGroup = __decorate([
        (0, RComponent_13.$ReportComponent)({ fullPath: "report/TextGroup", icon: "mdi mdi-text-box-multiple-outline", editableChildComponents: ["this"] }),
        (0, Jassi_15.$Class)("jassijs_report.RTextGroup")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RTextGroup);
    exports.RTextGroup = RTextGroup;
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
define("jassijs_report/RUList", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Jassi_16, Component_5, Property_9, ReportDesign_7, RComponent_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUList = void 0;
    //mdi-format-list-numbered
    let RUList = 
    //@$Property({name:"horizontal",hide:true})
    class RUList extends RComponent_14.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "ul";
            this.init($("<ul></ul>")[0]);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_5.Component.replaceWrapper(component, document.createElement("li"));
            if (component._listType !== undefined)
                component.listType = component._listType;
            super.addBefore(component, before);
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_5.Component.replaceWrapper(component, document.createElement("li"));
            if (component.listType !== undefined)
                component.listType = component._listType;
            super.add(component);
        }
        set type(value) {
            this._type = value;
            if (value === undefined)
                $(this.dom).css("list-style-type", "");
            else
                $(this.dom).css("list-style-type", value);
        }
        get type() {
            return this._type;
        }
        toJSON() {
            var ret = super.toJSON();
            ret.ul = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.ul.push(this._components[x].toJSON());
            }
            if (this.type)
                ret.type = this.type;
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.ul;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_7.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.ul;
            if (ob.type)
                ret.type = ob.type;
            delete ob.type;
            super.fromJSON(ob);
            return ret;
        }
    };
    __decorate([
        (0, Property_9.$Property)({ chooseFrom: ["square", "circle", "none"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RUList.prototype, "type", null);
    RUList = __decorate([
        (0, RComponent_14.$ReportComponent)({ fullPath: "report/Unordered List", icon: "mdi mdi-format-list-bulleted", editableChildComponents: ["this"] }),
        (0, Jassi_16.$Class)("jassijs_report.RUList")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RUList);
    exports.RUList = RUList;
});
define("jassijs_report/RUnknown", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RComponent"], function (require, exports, Jassi_17, RComponent_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUnknown = void 0;
    //@$ReportComponent({fullPath:"report/Text",icon:"res/textbox.ico",initialize:{value:"text"}})
    let RUnknown = class RUnknown extends RComponent_15.RComponent {
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
        (0, Jassi_17.$Class)("jassijs_report.RUnknown"),
        __metadata("design:paramtypes", [Object])
    ], RUnknown);
    exports.RUnknown = RUnknown;
});
define("jassijs_report/ReportDesign", ["require", "exports", "jassijs/ui/BoxPanel", "jassijs/remote/Jassi", "jassijs_report/RStack", "jassijs_report/RText", "jassijs_report/RColumns", "jassijs_report/RUnknown", "jassijs/ui/Panel", "jassijs_report/RComponent", "jassijs_report/RDatatable", "jassijs/ui/Property", "jassijs_report/RStyle", "jassijs_report/RTextGroup", "jassijs_report/RTable", "jassijs_report/RUList", "jassijs_report/ROList", "jassijs_report/RImage"], function (require, exports, BoxPanel_2, Jassi_18, RStack_1, RText_3, RColumns_1, RUnknown_1, Panel_4, RComponent_16, RDatatable_1, Property_10, RStyle_1, RTextGroup_1, RTable_2, RUList_1, ROList_1, RImage_1) {
    "use strict";
    var ReportDesign_8;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportDesign = void 0;
    let InfoProperties = class InfoProperties {
    };
    __decorate([
        (0, Property_10.$Property)({ description: "the title of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "title", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "the name of the author" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "author", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "the subject of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "subject", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "keywords associated with the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "keywords", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "the creator of the document (default is ‘pdfmake’)" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "creator", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "the producer of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "producer", void 0);
    InfoProperties = __decorate([
        (0, Jassi_18.$Class)("jassijs_report.InfoProperties")
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
        (0, Property_10.$Property)({ chooseFrom: ["lowResolution", "highResolution"], description: 'whether printing is allowed. Specify "lowResolution" to allow degraded printing, or "highResolution" to allow printing with high resolution' }),
        __metadata("design:type", String)
    ], PermissionProperties.prototype, "printing", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "whether modifying the file is allowed. Specify true to allow modifying document content" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "modifying", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "whether copying text or graphics is allowed. Specify true to allow copying" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "copying", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "whether annotating, form filling is allowed. Specify true to allow annotating and form filling" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "annotating", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "whether form filling and signing is allowed. Specify true to allow filling in form fields and signing" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "fillingForms", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "whether copying text for accessibility is allowed. Specify true to allow copying for accessibility" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "contentAccessibility", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "whether assembling document is allowed. Specify true to allow document assembly" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "documentAssembly", void 0);
    PermissionProperties = __decorate([
        (0, Jassi_18.$Class)("jassijs_report.PermissionProperties")
    ], PermissionProperties);
    let StyleContainer = class StyleContainer extends Panel_4.Panel {
        constructor(props) {
            super(props);
            $(this.dom).removeClass("Panel").removeClass("jinlinecomponent");
            $(this.domWrapper).removeClass("jcomponent").removeClass("jcontainer");
            $(this.dom).hide();
        }
    };
    StyleContainer = __decorate([
        (0, Jassi_18.$Class)("jassijs_report.StyleContainer"),
        (0, Property_10.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], StyleContainer);
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let ReportDesign = ReportDesign_8 = class ReportDesign extends BoxPanel_2.BoxPanel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.styleContainer = new StyleContainer(undefined);
            this.defaultStyle = new RStyle_1.RStyle();
            this.reporttype = "report";
            this.backgroundPanel = new RStack_1.RStack();
            this.headerPanel = new RStack_1.RStack();
            this.contentPanel = new RStack_1.RStack();
            this.footerPanel = new RStack_1.RStack();
            this._pageSize = undefined;
            /**
           * adds a component to the container
           * @param {jassijs.ui.Component} component - the component to add
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
            this.add(this.styleContainer);
            //this.pageSize = "A4";
            //this.pageMargins = [40, 40, 40, 40];
        }
        update(design) {
            this.design = design;
            ReportDesign_8.fromJSON(this.design, this);
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
            return ReportDesign_8.collectForEach(component._parent, allforeach);
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
                    ReportDesign_8.addVariablenames(path + (path === "" ? "" : ".") + key, val, names);
                }
                else {
                    names.push("${" + path + (path === "" ? "" : ".") + key + "}");
                }
            }
        }
        //get all possible variabelnames
        static getVariables(component) {
            var allforeach = [];
            var report = ReportDesign_8.collectForEach(component, allforeach);
            var data = {};
            Object.assign(data, report.otherProperties.data);
            for (var x = 0; x < allforeach.length; x++) {
                var fe = allforeach[x].split(" in ");
                if (fe.length !== 2)
                    continue;
                var test = ReportDesign_8.getVariable(fe[1], data);
                if (test && test.length > 0)
                    data[fe[0]] = test[0];
            }
            Object.assign(data, report.otherProperties.data);
            var ret = [];
            ReportDesign_8.addVariablenames("", data, ret);
            return ret;
        }
        static fromJSON(ob, target = undefined) {
            var ret = undefined;
            if (ob.content !== undefined) {
                ret = target;
                if (ret === undefined)
                    ret = new ReportDesign_8();
                ret.create(ob);
            }
            else if (typeof ob === 'string' || ob instanceof String) {
                ret = new RText_3.RText();
                ret.value = ob;
            }
            else if (ob.text !== undefined && (ob.editTogether || !Array.isArray(ob.text))) {
                ret = new RText_3.RText().fromJSON(ob);
            }
            else if (ob.text !== undefined && Array.isArray(ob.text)) {
                ret = new RTextGroup_1.RTextGroup().fromJSON(ob);
            }
            else if (ob.stack !== undefined || Array.isArray(ob)) {
                ret = new RStack_1.RStack().fromJSON(ob);
            }
            else if (ob.columns !== undefined) {
                ret = new RColumns_1.RColumns().fromJSON(ob);
            }
            else if (ob.datatable !== undefined) {
                ret = new RDatatable_1.RDatatable().fromJSON(ob);
            }
            else if (ob.table !== undefined) {
                ret = new RTable_2.RTable().fromJSON(ob);
            }
            else if (ob.ul !== undefined) {
                ret = new RUList_1.RUList().fromJSON(ob);
            }
            else if (ob.ol !== undefined) {
                ret = new ROList_1.ROList().fromJSON(ob);
            }
            else if (ob.image !== undefined) {
                ret = new RImage_1.RImage().fromJSON(ob);
            }
            else {
                ret = new RUnknown_1.RUnknown().fromJSON(ob);
            }
            return ret;
        }
        create(ob) {
            var _this = this;
            // this.removeAll();
            this.defaultStyle = new RStyle_1.RStyle();
            this._pageSize = undefined;
            this._pageOrientation = undefined;
            this._pageMargins = undefined;
            this.compress = undefined;
            this.userPassword = undefined;
            this.ownerPassword = undefined;
            this.info = undefined;
            this.permissions = undefined;
            this.backgroundPanel.removeAll();
            this.headerPanel.removeAll();
            this.contentPanel.removeAll();
            this.footerPanel.removeAll();
            if (ob.defaultStyle) {
                this.defaultStyle = new RStyle_1.RStyle().fromJSON(ob.defaultStyle);
                this.defaultStyle.name = "defaultStyle";
                $(this.dom).addClass(this.defaultStyle.styleid);
                delete ob.defaultStyle;
            }
            if (ob.styles) {
                for (var st in ob.styles) {
                    var rs = new RStyle_1.RStyle().fromJSON(ob.styles[st]);
                    rs.name = st;
                    this.styleContainer.add(rs);
                    rs.update();
                }
                delete ob.styles;
            }
            if (ob.background) {
                let obb = ReportDesign_8.fromJSON(ob.background);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.backgroundPanel.add(obp); });
                delete ob.background;
                obb.destroy();
            }
            if (ob.header) {
                let obb = ReportDesign_8.fromJSON(ob.header);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.headerPanel.add(obp); });
                delete ob.header;
                obb.destroy();
            }
            let obb = ReportDesign_8.fromJSON(ob.content);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { _this.contentPanel.add(obp); });
            delete ob.content;
            obb.destroy();
            if (ob.footer) {
                let obb = ReportDesign_8.fromJSON(ob.footer);
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
            if (ob.images) {
                this.images = ob.images;
                delete ob.images;
            }
            //delete ob.data;//should not be to json
            this.otherProperties = ob;
            ReportDesign_8.linkStyles(this);
        }
        static linkStyles(parent) {
            for (var x = 0; x < parent._components.length; x++) {
                var comp = parent._components[x];
                if (comp["style"]) {
                    comp["style"] = comp["style"];
                }
                if (comp["_components"]) {
                    ReportDesign_8.linkStyles(comp);
                }
            }
        }
        toJSON() {
            var r = {};
            if (JSON.stringify(this.defaultStyle) !== "{}") {
                r.defaultStyle = this.defaultStyle.toJSON();
            }
            if (this.styleContainer._components.length > 0) {
                r.styles = {};
                for (var x = 0; x < this.styleContainer._components.length; x++) {
                    r.styles[this.styleContainer._components[x]["name"]] = this.styleContainer._components[x].toJSON();
                }
            }
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
            if (this.images) {
                r.images = this.images;
            }
            Object.assign(r, this["otherProperties"]);
            //delete r.data;
            return r;
        }
    };
    __decorate([
        (0, Property_10.$Property)(),
        __metadata("design:type", Boolean)
    ], ReportDesign.prototype, "compress", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "To enable encryption set user password in userPassword (string value). The PDF file will be encrypted when a user password is provided, and users will be prompted to enter the password to decrypt the file when opening it." }),
        __metadata("design:type", String)
    ], ReportDesign.prototype, "userPassword", void 0);
    __decorate([
        (0, Property_10.$Property)({ description: "To set access privileges for the PDF file, you need to provide an owner password in ownerPassword (string value) and object permissions with permissions. By default, all operations are disallowed. You need to explicitly allow certain operations." }),
        __metadata("design:type", String)
    ], ReportDesign.prototype, "ownerPassword", void 0);
    __decorate([
        (0, Property_10.$Property)({ type: "json", componentType: "jassijs_report.InfoProperties" }),
        __metadata("design:type", InfoProperties)
    ], ReportDesign.prototype, "info", void 0);
    __decorate([
        (0, Property_10.$Property)({ type: "json", componentType: "jassijs_report.PermissionProperties" }),
        __metadata("design:type", PermissionProperties)
    ], ReportDesign.prototype, "permissions", void 0);
    __decorate([
        (0, Property_10.$Property)({ type: "number[]", default: [40, 40, 40, 40], description: "margin of the page: left, top, right, bottom" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], ReportDesign.prototype, "pageMargins", null);
    __decorate([
        (0, Property_10.$Property)({ description: "the size of the page", default: "A4", chooseFrom: ['4A0', '2A0', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'RA0', 'RA1', 'RA2', 'RA3', 'RA4', 'SRA0', 'SRA1', 'SRA2', 'SRA3', 'SRA4', 'EXECUTIVE', 'FOLIO', 'LEGAL', 'LETTER', 'TABLOID'] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ReportDesign.prototype, "pageSize", null);
    __decorate([
        (0, Property_10.$Property)({ chooseFrom: ['landscape', 'portrait'], default: "portrait", description: "the orientation of the page landscape or portrait" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ReportDesign.prototype, "pageOrientation", null);
    ReportDesign = ReportDesign_8 = __decorate([
        (0, RComponent_16.$ReportComponent)({ fullPath: undefined, icon: undefined, editableChildComponents: ["this", "this.backgroundPanel", "this.headerPanel", "this.contentPanel", "this.footerPanel"] }),
        (0, Jassi_18.$Class)("jassijs_report.ReportDesign"),
        (0, Property_10.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], ReportDesign);
    exports.ReportDesign = ReportDesign;
    //jassijs.myRequire(modul.css["jassijs_report.css"]);
    async function test() {
    }
    exports.test = test;
});
define("jassijs_report/SimpleReportEditor", ["require", "exports", "jassijs/remote/Jassi", "jassijs/util/Runlater", "jassijs_report/designer/SimpleReportDesigner", "jassijs_editor/AcePanelSimple", "jassijs_report/ReportDesign", "jassijs/ui/Panel", "jassijs/base/Windows", "jassijs/ui/DockingContainer", "jassijs/ui/VariablePanel", "jassijs/ui/Property"], function (require, exports, Jassi_19, Runlater_2, SimpleReportDesigner_1, AcePanelSimple_1, ReportDesign_9, Panel_5, Windows_1, DockingContainer_1, VariablePanel_1, Property_11) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SimpleReportEditor = void 0;
    class SimpleCodeEditor extends Panel_5.Panel {
        constructor(codePanel) {
            super();
            this.maximize();
            this._main = new DockingContainer_1.DockingContainer();
            this._codeView = new Panel_5.Panel();
            this._codeToolbar = new Panel_5.Panel();
            //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this._codePanel = codePanel;
            this._file = "";
            this.variables = new VariablePanel_1.VariablePanel();
            this._design = new Panel_5.Panel();
            this._init();
            this.editMode = true;
        }
        _initCodePanel() {
            this._codePanel.width = "100%";
            this._codePanel.mode = "typescript";
            this._codePanel.height = "calc(100% - 31px)";
        }
        _init() {
            var _this = this;
            this._initCodePanel();
            this._codeView["horizontal"] = true;
            this._codeView.add(this._codePanel);
            this._main.width = "calc(100% - 1px)";
            this._main.height = "99%";
            this._main.onresize = function () {
                setTimeout(function () {
                    _this._codePanel.resize();
                }, 1000);
            };
            super.add(this._main);
            this._installView();
            //this.variables.createTable();
        }
        _installView() {
            this._main.add(this._codeView, "Code..", "code");
            this._main.add(this.variables, "Variables", "variables");
            this._main.add(this._design, "Design", "design");
            //this._main.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":100,"content":[{"type":"stack","width":33.333333333333336,"height":80.34682080924856,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":19.653179190751445,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":50,"content":[{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":50,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}'
        }
        async _save(code) {
        }
        /**
        * save the code to server
        */
        save() {
            var code = this._codePanel.value;
            var _this = this;
            this._save(code);
        }
        /**
         * goto to the declariation on cursor
         */
        async gotoDeclaration() {
        }
        /**
         * search text in classes at the given text
         * @param {string} text - the text to search
         * @returns {jassijs_editor.CodeEditor} - the editor instance
         */
        static async search(text) {
            return undefined;
        }
        /**
         * extract lines from code
         * @param {string} code - the code
         * @returns {[string]} - all lines
         */
        _codeToLines(code) {
            var lines = code.split("\n");
            for (var x = 0; x < lines.length; x++) {
                while (lines[x].startsWith("/") || lines[x].startsWith(" ")
                    || lines[x].startsWith("*") || lines[x].startsWith("\t")) {
                    lines[x] = lines[x].substring(1);
                }
            }
            return lines;
        }
        /**
         * add variables to variabelpanel
         * @param Object<string,object> variables ["name"]=value
         */
        addVariables(variables) {
            this.variables.addAll(variables);
        }
        /**
         * execute the current code
         * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
         *                              if false at the end of the layout() function or at the end of the code
         */
        async evalCode(toCursor = undefined) {
        }
        /**
         * switch view
         * @member {string} view - "design" or "code"
         */
        set viewmode(view) {
            this._main.show(view);
        }
        /**
        * get all known instances for type
        * @param {type} type - the type we are interested
        * @returns {[string]}
        */
        getVariablesForType(type) {
            return this.variables.getVariablesForType(type);
        }
        /**
         * gets the name of the variabel that holds the object
         * @param {object} ob - the
         */
        getVariableFromObject(ob) {
            return this.variables.getVariableFromObject(ob);
        }
        /**
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        getObjectFromVariable(varname) {
            return this.variables.getObjectFromVariable(varname);
        }
        /**
          * renames a variable in design
          * @param {string} oldName
          * @param {string} newName
          */
        renameVariable(oldName, newName) {
            this.variables.renameVariable(oldName, newName);
            if (this._design !== undefined && this._design["_componentExplorer"] !== undefined)
                this._design["_componentExplorer"].update();
        }
        /**
         * @member {string} - the code
         */
        set value(value) {
            this._codePanel.file = this._file;
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
        /**
         * @member {string} - title of the component
         */
        get title() {
            var s = this.file.split("/");
            return s[s.length - 1];
        }
        /**
        * @member {string} - the url to edit
        */
        set file(value) {
            this._file = value;
            this.openFile(value);
        }
        get file() {
            return this._file;
        }
        /**
        * goes to the line number
        * @param {object} value - the line number
        */
        set line(value) {
            this._line = Number(value);
            this.cursorPosition = { row: this._line, column: 1 };
            var _this = this;
            setTimeout(function () {
                _this.cursorPosition = { row: _this._line, column: 1 };
            }, 300);
            /*setTimeout(function() {
                _this.cursorPosition = { row: value, column: 0 };
            }, 1000);//start takes one second....*/
        }
        get line() {
            return this.cursorPosition.row;
        }
        /**
         * open the file
         */
        async openFile(_file) {
        }
        destroy() {
            this._codeView.destroy();
            this._codeToolbar.destroy();
            this._codePanel.destroy();
            this.variables.destroy();
            this._design.destroy();
            //this._main.destroy();
            super.destroy();
        }
        /**
        * undo action
        */
        undo() {
            this._codePanel.undo();
        }
    }
    __decorate([
        (0, Property_11.$Property)({ isUrlTag: true, id: true }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], SimpleCodeEditor.prototype, "file", null);
    __decorate([
        (0, Property_11.$Property)({ isUrlTag: true }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], SimpleCodeEditor.prototype, "line", null);
    let SimpleReportEditor = class SimpleReportEditor extends Panel_5.Panel {
        constructor(properties) {
            super(properties);
            var _this = this;
            this.acePanel = new AcePanelSimple_1.AcePanelSimple();
            this.codeEditor = new SimpleCodeEditor(this.acePanel);
            this.add(this.codeEditor);
            this.codeEditor.width = "100%";
            this.codeEditor.height = "100%";
            this.reportPanel = new ReportDesign_9.ReportDesign();
            this.reportDesigner = new SimpleReportDesigner_1.SimpleReportDesigner();
            var compileTask = undefined;
            this.codeEditor.variables.addVariable("this", this.reportPanel);
            this.codeEditor.evalCode = async function () {
                if (compileTask === undefined) {
                    compileTask = new Runlater_2.Runlater(() => {
                        _this.codeEditor.variables.clear();
                        var code = _this.acePanel.value;
                        var func = new Function("", "return " + code.substring(code.indexOf("=") + 1));
                        var ob = func();
                        _this.reportDesign = ob;
                    }, 800);
                }
                else
                    compileTask.runlater();
            };
            this.acePanel.onchange((obj, editor) => {
                if (!_this.reportDesigner.propertyIsChanging)
                    _this.codeEditor.evalCode();
            });
            //designer["codeEditor"]._main.add(designer, "Design", "design");
            this.reportPanel.design = { content: [] };
            this.codeEditor._design = this.reportDesigner;
            this.codeEditor._main.add(this.codeEditor._design, "Design", "design");
            this.reportDesigner.codeEditor = this.codeEditor;
            this.reportDesigner.designedComponent = this.reportPanel;
        }
        get reportDesign() {
            var _a;
            return (_a = this.reportPanel) === null || _a === void 0 ? void 0 : _a.design;
        }
        set reportDesign(design) {
            this.reportPanel = new ReportDesign_9.ReportDesign();
            this.reportPanel.design = design;
            this.reportDesigner.designedComponent = this.reportPanel;
        }
    };
    SimpleReportEditor = __decorate([
        (0, Jassi_19.$Class)("jassi_report.SimpleReportEditor"),
        __metadata("design:paramtypes", [typeof (_a = typeof Panel_5.PanelCreateProperties !== "undefined" && Panel_5.PanelCreateProperties) === "function" ? _a : Object])
    ], SimpleReportEditor);
    exports.SimpleReportEditor = SimpleReportEditor;
    function test() {
        var reportdesign = {
            content: [
                {
                    text: "Hallo Herr {{nachname}}"
                },
                {
                    text: "ok"
                },
                {
                    columns: [
                        {
                            text: "text"
                        },
                        {
                            text: "text"
                        }
                    ]
                }
            ],
            data: {
                nachname: "Meier"
            }
        };
        var editor = new SimpleReportEditor();
        editor.reportDesign = reportdesign;
        editor.width = "100%";
        editor.height = "100%";
        editor.value = "aHallo Herr {{nachname}}";
        Windows_1.default.add(editor, "Testtt");
        //return editor;
    }
    exports.test = test;
});
define("jassijs_report/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "css": { "jassijs_report.css": "jassijs_report.css" },
        "require": {
            paths: {
                'pdfjs-dist/build/pdf': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min',
                'pdfjs-dist/build/pdf.worker': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min',
                'vfs_fonts': '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.2/vfs_fonts',
                'pdfMake': '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.2/pdfmake' //'../../lib/pdfmake'
            },
            shim: {
                'pdfjs-dist/build/pdf': ['pdfjs-dist/build/pdf.worker'],
                "vfs_fonts": ["pdfMake"]
                //"pdfMake":["vfs_fonts"]
            },
        }
    };
});
//this file is autogenerated don't modify
define("jassijs_report/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs_report/designer/Report.ts": {
                "date": 1622998616949,
                "jassijs_report.Report": {}
            },
            "jassijs_report/designer/ReportDesigner.ts": {
                "date": 1633821741681,
                "jassijs_report.designer.ReportDesigner": {}
            },
            "jassijs_report/modul.ts": {
                "date": 1633111115088
            },
            "jassijs_report/PDFReport.ts": {
                "date": 1632679267836,
                "jassijs_report.PDFReport": {}
            },
            "jassijs_report/PDFViewer.ts": {
                "date": 1623863773400,
                "jassijs_report.PDFViewer": {}
            },
            "jassijs_report/RColumns.ts": {
                "date": 1633816765820,
                "jassijs_report.RColumns": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Columns",
                            "icon": "mdi mdi-view-parallel-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RDatatable.ts": {
                "date": 1633810670682,
                "jassijs_report.RDatatable": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Datatable",
                            "icon": "mdi mdi-table-cog",
                            "editableChildComponents": [
                                "this",
                                "this.headerPanel",
                                "this.bodyPanel",
                                "this.footerPanel"
                            ]
                        }
                    ],
                    "@members": {
                        "dataforeach": {
                            "$Property": []
                        },
                        "groupCount": {
                            "$Property": []
                        }
                    }
                }
            },
            "jassijs_report/ReportDesign.ts": {
                "date": 1633777019318,
                "jassijs_report.InfoProperties": {
                    "@members": {
                        "title": {
                            "$Property": [
                                {
                                    "description": "the title of the document"
                                }
                            ]
                        },
                        "author": {
                            "$Property": [
                                {
                                    "description": "the name of the author"
                                }
                            ]
                        },
                        "subject": {
                            "$Property": [
                                {
                                    "description": "the subject of the document"
                                }
                            ]
                        },
                        "keywords": {
                            "$Property": [
                                {
                                    "description": "keywords associated with the document"
                                }
                            ]
                        },
                        "creator": {
                            "$Property": [
                                {
                                    "description": "the creator of the document (default is ‘pdfmake’)"
                                }
                            ]
                        },
                        "producer": {
                            "$Property": [
                                {
                                    "description": "the producer of the document"
                                }
                            ]
                        }
                    }
                },
                "jassijs_report.PermissionProperties": {
                    "@members": {
                        "printing": {
                            "$Property": [
                                {
                                    "chooseFrom": [
                                        "lowResolution",
                                        "highResolution"
                                    ],
                                    "description": "whether printing is allowed. Specify \"lowResolution\" to allow degraded printing, or \"highResolution\" to allow printing with high resolution"
                                }
                            ]
                        },
                        "modifying": {
                            "$Property": [
                                {
                                    "description": "whether modifying the file is allowed. Specify true to allow modifying document content"
                                }
                            ]
                        },
                        "copying": {
                            "$Property": [
                                {
                                    "description": "whether copying text or graphics is allowed. Specify true to allow copying"
                                }
                            ]
                        },
                        "annotating": {
                            "$Property": [
                                {
                                    "description": "whether annotating, form filling is allowed. Specify true to allow annotating and form filling"
                                }
                            ]
                        },
                        "fillingForms": {
                            "$Property": [
                                {
                                    "description": "whether form filling and signing is allowed. Specify true to allow filling in form fields and signing"
                                }
                            ]
                        },
                        "contentAccessibility": {
                            "$Property": [
                                {
                                    "description": "whether copying text for accessibility is allowed. Specify true to allow copying for accessibility"
                                }
                            ]
                        },
                        "documentAssembly": {
                            "$Property": [
                                {
                                    "description": "whether assembling document is allowed. Specify true to allow document assembly"
                                }
                            ]
                        }
                    }
                },
                "jassijs_report.StyleContainer": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                },
                "jassijs_report.ReportDesign": {
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
                    ],
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ],
                    "@members": {
                        "compress": {
                            "$Property": []
                        },
                        "userPassword": {
                            "$Property": [
                                {
                                    "description": "To enable encryption set user password in userPassword (string value). The PDF file will be encrypted when a user password is provided, and users will be prompted to enter the password to decrypt the file when opening it."
                                }
                            ]
                        },
                        "ownerPassword": {
                            "$Property": [
                                {
                                    "description": "To set access privileges for the PDF file, you need to provide an owner password in ownerPassword (string value) and object permissions with permissions. By default, all operations are disallowed. You need to explicitly allow certain operations."
                                }
                            ]
                        },
                        "info": {
                            "$Property": [
                                {
                                    "type": "json",
                                    "componentType": "jassijs_report.InfoProperties"
                                }
                            ]
                        },
                        "permissions": {
                            "$Property": [
                                {
                                    "type": "json",
                                    "componentType": "jassijs_report.PermissionProperties"
                                }
                            ]
                        },
                        "pageMargins": {
                            "$Property": [
                                {
                                    "type": "number[]",
                                    "default": [
                                        40,
                                        40,
                                        40,
                                        40
                                    ],
                                    "description": "margin of the page: left, top, right, bottom"
                                }
                            ]
                        },
                        "pageSize": {
                            "$Property": [
                                {
                                    "description": "the size of the page",
                                    "default": "A4",
                                    "chooseFrom": [
                                        "4A0",
                                        "2A0",
                                        "A0",
                                        "A1",
                                        "A2",
                                        "A3",
                                        "A4",
                                        "A5",
                                        "A6",
                                        "A7",
                                        "A8",
                                        "A9",
                                        "A10",
                                        "B0",
                                        "B1",
                                        "B2",
                                        "B3",
                                        "B4",
                                        "B5",
                                        "B6",
                                        "B7",
                                        "B8",
                                        "B9",
                                        "B10",
                                        "C0",
                                        "C1",
                                        "C2",
                                        "C3",
                                        "C4",
                                        "C5",
                                        "C6",
                                        "C7",
                                        "C8",
                                        "C9",
                                        "C10",
                                        "RA0",
                                        "RA1",
                                        "RA2",
                                        "RA3",
                                        "RA4",
                                        "SRA0",
                                        "SRA1",
                                        "SRA2",
                                        "SRA3",
                                        "SRA4",
                                        "EXECUTIVE",
                                        "FOLIO",
                                        "LEGAL",
                                        "LETTER",
                                        "TABLOID"
                                    ]
                                }
                            ]
                        },
                        "pageOrientation": {
                            "$Property": [
                                {
                                    "chooseFrom": [
                                        "landscape",
                                        "portrait"
                                    ],
                                    "default": "portrait",
                                    "description": "the orientation of the page landscape or portrait"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/RStack.ts": {
                "date": 1632518449870,
                "jassijs_report.RStack": {
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
            "jassijs_report/RTablerow.ts": {
                "date": 1633813573497,
                "jassijs_report.RTablerow": {
                    "$ReportComponent": [
                        {
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RText.ts": {
                "date": 1633458862481,
                "jassijs_report.RText": {
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
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "chooseFrom": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/RUnknown.ts": {
                "date": 1632503057676,
                "jassijs_report.RUnknown": {}
            },
            "jassijs_report/designer/SimpleReportDesigner.ts": {
                "date": 1633821665209,
                "jassijs_report.designer.SimpleReportDesigner": {}
            },
            "jassijs_report/SimpleReportEditor.ts": {
                "date": 1632521317213,
                "jassi_report.SimpleReportEditor": {}
            },
            "jassijs_report/remote/pdfmakejassi.ts": {
                "date": 1633811608171
            },
            "jassijs_report/RGroupTablerow.ts": {
                "date": 1633548166674,
                "jassijs_report.RTablerow": {
                    "$ReportComponent": [
                        {
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {
                        "expression": {
                            "$Property": []
                        }
                    }
                }
            },
            "jassijs_report/RComponent.ts": {
                "date": 1633816494280,
                "jassijs_report.ReportComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ],
                    "@members": {
                        "foreach": {
                            "$Property": []
                        },
                        "counter": {
                            "$Property": [
                                {
                                    "default": "undefined",
                                    "isVisible": "function"
                                }
                            ]
                        },
                        "listType": {
                            "$Property": [
                                {
                                    "name": "listType",
                                    "default": "undefined",
                                    "isVisible": "function",
                                    "chooseFrom": "function"
                                }
                            ]
                        },
                        "fillColor": {
                            "$Property": [
                                {
                                    "type": "color",
                                    "isVisible": "function"
                                }
                            ]
                        },
                        "colSpan": {
                            "$Property": [
                                {
                                    "type": "string",
                                    "isVisible": "function"
                                }
                            ]
                        },
                        "rowSpan": {
                            "$Property": [
                                {
                                    "type": "string",
                                    "isVisible": "function"
                                }
                            ]
                        },
                        "border": {
                            "$Property": [
                                {
                                    "type": "boolean[]",
                                    "default": [
                                        false,
                                        false,
                                        false,
                                        false
                                    ],
                                    "isVisible": "function",
                                    "description": "border of the tablecell: left, top, right, bottom"
                                }
                            ]
                        },
                        "width": {
                            "$Property": [
                                {
                                    "type": "string",
                                    "isVisible": "function"
                                }
                            ]
                        },
                        "height": {
                            "$Property": [
                                {
                                    "type": "string",
                                    "isVisible": "function"
                                }
                            ]
                        },
                        "bold": {
                            "$Property": []
                        },
                        "italics": {
                            "$Property": []
                        },
                        "font": {
                            "$Property": [
                                {
                                    "chooseFrom": [
                                        "Alegreya",
                                        "AlegreyaSans",
                                        "AlegreyaSansSC",
                                        "AlegreyaSC",
                                        "AlmendraSC",
                                        "Amaranth",
                                        "Andada",
                                        "AndadaSC",
                                        "AnonymousPro",
                                        "ArchivoNarrow",
                                        "Arvo",
                                        "Asap",
                                        "AveriaLibre",
                                        "AveriaSansLibre",
                                        "AveriaSerifLibre",
                                        "Cambay",
                                        "Caudex",
                                        "CrimsonText",
                                        "Cuprum",
                                        "Economica",
                                        "Exo2",
                                        "Exo",
                                        "ExpletusSans",
                                        "FiraSans",
                                        "JosefinSans",
                                        "JosefinSlab",
                                        "Karla",
                                        "Lato",
                                        "LobsterTwo",
                                        "Lora",
                                        "Marvel",
                                        "Merriweather",
                                        "MerriweatherSans",
                                        "Nobile",
                                        "NoticiaText",
                                        "Overlock",
                                        "Philosopher",
                                        "PlayfairDisplay",
                                        "PlayfairDisplaySC",
                                        "PT_Serif-Web",
                                        "Puritan",
                                        "Quantico",
                                        "QuattrocentoSans",
                                        "Quicksand",
                                        "Rambla",
                                        "Rosario",
                                        "Sansation",
                                        "Sarabun",
                                        "Scada",
                                        "Share",
                                        "Sitara",
                                        "SourceSansPro",
                                        "TitilliumWeb",
                                        "Volkhov",
                                        "Vollkorn"
                                    ]
                                }
                            ]
                        },
                        "fontSize": {
                            "$Property": []
                        },
                        "background": {
                            "$Property": [
                                {
                                    "type": "color"
                                }
                            ]
                        },
                        "color": {
                            "$Property": [
                                {
                                    "type": "color"
                                }
                            ]
                        },
                        "alignment": {
                            "$Property": [
                                {
                                    "chooseFrom": [
                                        "left",
                                        "center",
                                        "right"
                                    ]
                                }
                            ]
                        },
                        "decoration": {
                            "$Property": [
                                {
                                    "chooseFrom": [
                                        "underline",
                                        "lineThrough",
                                        "overline"
                                    ]
                                }
                            ]
                        },
                        "decorationColor": {
                            "$Property": [
                                {
                                    "type": "color"
                                }
                            ]
                        },
                        "decorationStyle": {
                            "$Property": [
                                {
                                    "chooseFrom": [
                                        "dashed",
                                        "dotted",
                                        "double",
                                        "wavy"
                                    ]
                                }
                            ]
                        },
                        "style": {
                            "$Property": []
                        },
                        "lineHeight": {
                            "$Property": [
                                {
                                    "default": 1
                                }
                            ]
                        },
                        "margin": {
                            "$Property": [
                                {
                                    "type": "number[]",
                                    "description": "margin left, top, right, bottom"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/RStyle.ts": {
                "date": 1632523398308,
                "jassijs_report.RStyle": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Style",
                            "icon": "mdi mdi-virus-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {
                        "name": {
                            "$Property": []
                        }
                    }
                }
            },
            "jassijs_report/RTextGroup.ts": {
                "date": 1633548070484,
                "jassijs_report.RTextGroup": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/TextGroup",
                            "icon": "mdi mdi-text-box-multiple-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RTable.ts": {
                "date": 1633813845210,
                "jassijs_report.RTable": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Table",
                            "icon": "mdi mdi-table-large",
                            "editableChildComponents": [
                                "this",
                                "this.headerPanel",
                                "this.bodyPanel",
                                "this.footerPanel"
                            ]
                        }
                    ],
                    "@members": {
                        "headerRows": {
                            "$Property": []
                        },
                        "layoutName": {
                            "$Property": [
                                {
                                    "chooseFrom": "allLayouts",
                                    "chooseFromStrict": true
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/RTableLayouts.ts": {
                "date": 1633113318723
            },
            "jassijs_report/RUList.ts": {
                "date": 1633550937624,
                "jassijs_report.RUList": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Unordered List",
                            "icon": "mdi mdi-format-list-bulleted",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {
                        "type": {
                            "$Property": [
                                {
                                    "chooseFrom": [
                                        "square",
                                        "circle",
                                        "none"
                                    ]
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/ROList.ts": {
                "date": 1633816412533,
                "jassijs_report.ROList": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Ordered List",
                            "icon": "mdi mdi-format-list-numbered",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {
                        "type": {
                            "$Property": [
                                {
                                    "chooseFrom": [
                                        "lower-alpha",
                                        "upper-alpha",
                                        "lower-roman",
                                        "upper-roman",
                                        "none"
                                    ]
                                }
                            ]
                        },
                        "reversed": {
                            "$Property": [
                                {
                                    "default": false
                                }
                            ]
                        },
                        "start": {
                            "$Property": [
                                {
                                    "default": 1
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/RImage.ts": {
                "date": 1633792427803,
                "jassijs_report.RImage": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Image",
                            "icon": "mdi mdi-image-frame"
                        }
                    ],
                    "@members": {
                        "image": {
                            "$Property": [
                                {
                                    "type": "rimage",
                                    "chooseFrom": "function"
                                }
                            ]
                        },
                        "fit": {
                            "$Property": [
                                {
                                    "type": "number[]",
                                    "decription": "fit in rectangle width, height e.g. 10,20"
                                }
                            ]
                        },
                        "opacity": {
                            "$Property": [
                                {
                                    "type": "number"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/RImageEditor.ts": {
                "date": 1633780176533,
                "jassi_report/RImagePropertyEditor": {
                    "$PropertyEditor": [
                        [
                            "rimage"
                        ]
                    ]
                }
            },
            "jassijs_report/ReportTemplate.ts": {
                "date": 1633815615937
            }
        }
    };
});
define("jassijs_report/designer/Report", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/BoxPanel"], function (require, exports, Jassi_20, BoxPanel_3) {
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
        (0, Jassi_20.$Class)("jassijs_report.Report")
        //@$UIComponent({editableChildComponents:["this"]})
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], Report);
    exports.Report = Report;
});
//jassijs.register("reportcomponent", "jassijs_report.Report", "report/Report", "res/report.ico");
// return CodeEditor.constructor;
define("jassijs_report/designer/ReportDesigner", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs_editor/ComponentDesigner", "jassijs/remote/Classes", "jassijs_report/PDFReport", "jassijs_report/PDFViewer", "jassijs_report/ReportDesign", "jassijs/util/Tools"], function (require, exports, Jassi_21, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, CodeEditorInvisibleComponents_1, ComponentDesigner_1, Classes_4, PDFReport_1, PDFViewer_2, ReportDesign_10, Tools_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.test2 = exports.ReportDesigner = void 0;
    let ReportDesigner = class ReportDesigner extends ComponentDesigner_1.ComponentDesigner {
        constructor() {
            super();
            this.propertyIsChanging = false;
            this.pdfviewer = new PDFViewer_2.PDFViewer();
            this.lastView = undefined;
            this._codeChanger = undefined;
            this.mainLayout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
            this.editButton.tooltip = "pdf preview";
            this.editButton.icon = "mdi mdi-18px mdi-file-pdf-outline";
        }
        set codeEditor(value) {
            var _this = this;
            this._codeEditor = value;
            this.variables = this._codeEditor.variables;
            this._propertyEditor = new PropertyEditor_1.PropertyEditor(undefined, undefined);
            this._codeChanger = new PropertyEditor_1.PropertyEditor(this._codeEditor, undefined);
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
        connectParser(parser) {
            this._propertyEditor.parser = parser;
            var Parser = Classes_4.classes.getClass("jassijs_editor.base.Parser");
            this._codeChanger.parser = new Parser();
        }
        editDialog(enable) {
            if (enable === false) {
                super.editDialog(enable);
                var rep = new PDFReport_1.PDFReport();
                //rep.content=this.designedComponent["design];
                var data;
                try {
                    data = this._codeChanger.value.toJSON();
                    rep.value = data; //Tools.copyObject(data);// designedComponent["design"];
                    rep.fill();
                    rep.getBase64().then((data) => {
                        this.pdfviewer.report = rep;
                        //make a copy because the data would be modified 
                        this.pdfviewer.value = data;
                    });
                }
                catch (err) {
                    console.error(err);
                    //viewer.value = await rep.getBase64();
                }
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
            this.propertyIsChanging = true;
            if (this._codeChanger.parser.sourceFile === undefined)
                this._codeChanger.updateParser();
            //@ts-ignore
            let job = this.designedComponent.toJSON();
            delete job.parameter;
            delete job.data;
            let ob = Tools_2.Tools.objectToJson(job, undefined, false, 80);
            if (this._codeChanger.parser.variables["reportdesign"]) {
                var s = this._codeChanger.parser.code.substring(0, this._codeChanger.parser.variables["reportdesign"].pos) +
                    " reportdesign = " + ob + this._codeChanger.parser.code.substring(this._codeChanger.parser.variables["reportdesign"].end);
                this.codeEditor.value = s;
                this._codeChanger.updateParser();
                this._codeChanger.callEvent("codeChanged", {});
                //this.callEvent("codeChanged", {});
            }
            else
                this._codeChanger.setPropertyInCode("reportdesign", ob);
            this.propertyIsChanging = false;
        }
        createComponent(type, component, top, left, newParent, beforeComponent) {
            //this.variables.updateCache();
            //this._componentExplorer.update();
            var ret = super.createComponent(type, component, top, left, newParent, beforeComponent);
            //this.addVariables(ret,true);
            this._componentExplorer.update();
            this.propertyChanged();
            this._updateInvisibleComponents();
            return ret;
        }
        //createVariable(type, scope, varvalue) {
        createVariable(type, scope, component) {
            var name = component["reporttype"];
            if (this.nextComponentvariable[name] === undefined) {
                this.nextComponentvariable[name] = 0;
            }
            this.nextComponentvariable[name]++;
            var sname = component["name"];
            if (sname === undefined) {
                sname = name + this.nextComponentvariable[name];
                if (Object.getOwnPropertyDescriptor(component["__proto__"], "name")) { //write back the name
                    component["name"] = sname;
                }
            }
            this._codeEditor.variables.addVariable(sname, component, false);
            this.allComponents[name + this.nextComponentvariable[name]] = component;
            if (component["_components"]) {
                for (let x = 0; x < component["_components"].length; x++) {
                    this.createVariable(undefined, undefined, component["_components"][x]);
                }
            }
            return sname;
        }
        /**
          * @member {jassijs.ui.Component} - the designed component
          */
        set designedComponent(component) {
            //create _children
            ReportDesign_10.ReportDesign.fromJSON(component["design"], component);
            //populate Variables
            this.allComponents = {};
            this.nextComponentvariable = {};
            this.allComponents["this"] = component;
            this._codeEditor.variables.addVariable("this", component);
            this.createVariable(undefined, undefined, component);
            this._propertyEditor.value = component;
            this._codeChanger.parser = this._propertyEditor.parser;
            super.designedComponent = component;
            //@ts.ignore
            this._codeChanger.value = component;
        }
        /**
           * undo action
           */
        undo() {
            this._codeEditor.undo();
            this._codeEditor.evalCode();
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
        (0, Jassi_21.$Class)("jassijs_report.designer.ReportDesigner"),
        __metadata("design:paramtypes", [])
    ], ReportDesigner);
    exports.ReportDesigner = ReportDesigner;
    async function test2() {
        var rep = new PDFReport_1.PDFReport();
        var def = {
            content: {
                stack: [{
                        columns: [
                            {
                                stack: [
                                    { text: '${invoice.customer.firstname} ${invoice.customer.lastname}' },
                                    { text: '${invoice.customer.street}' },
                                    { text: '${invoice.customer.place}' }
                                ]
                            },
                            {
                                stack: [
                                    { text: 'Invoice', fontSize: 18 },
                                    { text: " " },
                                    { text: "Date: ${invoice.date}" },
                                    { text: "Number: ${invoice.number}", bold: true },
                                    { text: " " },
                                    { text: " " },
                                ]
                            }
                        ]
                    }
                ]
            },
            data: {
                invoice: {
                    number: 1000,
                    date: "20.07.2018",
                    customer: {
                        firstname: "Henry",
                        lastname: "Klaus",
                        street: "Hauptstr. 157",
                        place: "chemnitz"
                    }
                }
            }
        };
        //	def.content=replaceTemplates(def.content,def.data);
        rep.value = def;
        var viewer = new PDFViewer_2.PDFViewer();
        viewer.value = await rep.getBase64();
        viewer.height = "200";
        return viewer;
    }
    exports.test2 = test2;
    ;
    async function test() {
        var CodeEditor = (await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/CodeEditor"], resolve_1, reject_1); })).CodeEditor;
        var editor = new CodeEditor();
        //var url = "jassijs_editor/AcePanel.ts";
        editor.height = 300;
        editor.width = "100%";
        //await editor.openFile(url);
        editor.value = `import { ReportDesign } from "jassijs_report/ReportDesign";

import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";

export class SampleReport extends ReportDesign {
    me = {};
    constructor() {
        super();
        this.layout(this.me);
    }
    async setdata() {
    }
    layout(me) {
        this.design = { "content": { "stack": [{ "text": "Hallo" }, { "text": "ok" }, { "columns": [{ "text": "text" }, { "text": "text" }] }] } };
    }
}
export async function test() {
    var dlg = new SampleReport();
    return dlg;
}

`;
        editor.evalCode();
        return editor;
    }
    exports.test = test;
    ;
});
define("jassijs_report/designer/SimpleReportDesigner", ["require", "exports", "jassijs/remote/Jassi", "jassijs_report/designer/ReportDesigner", "jassijs/util/Tools"], function (require, exports, Jassi_22, ReportDesigner_1, Tools_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SimpleReportDesigner = void 0;
    let SimpleReportDesigner = class SimpleReportDesigner extends ReportDesigner_1.ReportDesigner {
        constructor() {
            super();
            this.codePrefix = "var ttt=";
            this.mainLayout = JSON.stringify({
                "settings": { "hasHeaders": true, "constrainDragToContainer": true, "reorderEnabled": true, "selectionEnabled": false, "popoutWholeStack": false, "blockedPopoutsThrowError": true, "closePopoutsOnUnload": true, "showPopoutIcon": false, "showMaximiseIcon": true, "showCloseIcon": true, "responsiveMode": "onload" }, "dimensions": { "borderWidth": 5, "minItemHeight": 10, "minItemWidth": 10, "headerHeight": 20, "dragProxyWidth": 300, "dragProxyHeight": 200 }, "labels": { "close": "close", "maximise": "maximise", "minimise": "minimise", "popout": "open in new window", "popin": "pop in", "tabDropdown": "additional tabs" }, "content": [{
                        "type": "column", "isClosable": true, "reorderEnabled": true, "title": "", "content": [{
                                "type": "row", "isClosable": true, "reorderEnabled": true, "title": "", "height": 81.04294066258988,
                                "content": [{
                                        "type": "stack", "width": 80.57491289198606, "height": 71.23503465658476, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0,
                                        "content": [
                                            { "title": "Code..", "type": "component", "componentName": "code", "componentState": { "title": "Code..", "name": "code" }, "isClosable": true, "reorderEnabled": true },
                                            { "title": "Design", "type": "component", "componentName": "design", "componentState": { "title": "Design", "name": "design" }, "isClosable": true, "reorderEnabled": true }
                                        ]
                                    },
                                    {
                                        "type": "column", "isClosable": true, "reorderEnabled": true, "title": "", "width": 19.42508710801394,
                                        "content": [
                                            {
                                                "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 19.844357976653697,
                                                "content": [{ "title": "Palette", "type": "component", "componentName": "componentPalette", "componentState": { "title": "Palette", "name": "componentPalette" }, "isClosable": true, "reorderEnabled": true }]
                                            },
                                            {
                                                "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 80.1556420233463,
                                                "content": [{ "title": "Properties", "type": "component", "componentName": "properties", "componentState": { "title": "Properties", "name": "properties" }, "isClosable": true, "reorderEnabled": true }]
                                            },
                                            {
                                                "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 19.844357976653697,
                                                "content": [{ "title": "Components", "type": "component", "componentName": "components", "componentState": { "title": "Components", "name": "components" }, "isClosable": true, "reorderEnabled": true }]
                                            }
                                        ]
                                    }]
                            }
                        ]
                    }], "isClosable": true, "reorderEnabled": true, "title": "", "openPopouts": [], "maximisedItemId": null
            });
            this._designToolbar.remove(this.saveButton);
            this._designToolbar.remove(this.runButton);
            this.editButton.tooltip = "pdf preview";
            this.editButton.icon = "mdi mdi-18px mdi-file-pdf-outline";
            //        this._designToolbar.remove(this.);
            //'{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":1,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true},{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":19.42508710801394,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';        //'{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":1,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":9.78603688012232,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":61.55066380085299,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":28.663299319024677,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        propertyChanged() {
            this.propertyIsChanging = true;
            let job = this.designedComponent.toJSON();
            delete job.parameter;
            delete job.data;
            let ob = Tools_3.Tools.objectToJson(job, undefined, false, 80);
            this._codeEditor._codePanel.value = this.codePrefix + ob + ";";
            this.propertyIsChanging = false;
            /*  let job=this.designedComponent.toJSON();
              delete job.parameter;
              delete job.data;
              let ob=Tools.objectToJson(job,undefined,false);
              if(this._codeChanger.parser.variables["reportdesign"]){
                  var s=this._codeChanger.parser.code.substring(0,this._codeChanger.parser.variables["reportdesign"].pos)+
                      " reportdesign = "+ob+this._codeChanger.parser.code.substring(this._codeChanger.parser.variables["reportdesign"].end);
                      this.codeEditor.value = s;
                  this._codeChanger.updateParser();
                  this._codeChanger.callEvent("codeChanged", {});
              //this.callEvent("codeChanged", {});
              }else
                  this._codeChanger.setPropertyInCode("reportdesign",ob);*/
        }
    };
    SimpleReportDesigner = __decorate([
        (0, Jassi_22.$Class)("jassijs_report.designer.SimpleReportDesigner"),
        __metadata("design:paramtypes", [])
    ], SimpleReportDesigner);
    exports.SimpleReportDesigner = SimpleReportDesigner;
    function test() {
        var reportdesign = {
            content: [
                {
                    text: "Hallo Herr {{nachname}}"
                },
                {
                    text: "ok"
                },
                {
                    columns: [
                        {
                            text: "text"
                        },
                        {
                            text: "text"
                        }
                    ]
                }
            ],
            data: {
                nachname: "Meier"
            }
        };
    }
    exports.test = test;
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
define("jassijs_report/ext/pdfjs", ["pdfjs-dist/build/pdf", "pdfjs-dist/build/pdf.worker"], function (pdfjs, worker, pdfjsWorker) {
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
define("jassijs_report/ext/pdfmake", ['pdfMake', "vfs_fonts"], function (ttt, vfs) {
    var fonts = require("vfs_fonts");
    return {
        default: pdfMake
    };
});
define("jassijs_report/remote/pdfmakejassi", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.createReportDefinition = exports.doGroup = void 0;
    function clone(obj) {
        if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;
        if (obj instanceof Date || typeof obj === "object")
            var temp = new obj.constructor(); //or new Date(obj);
        else
            var temp = obj.constructor();
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }
        return temp;
    }
    //@ts-ignore
    String.prototype.replaceTemplate = function (params, returnValues) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        for (let x = 0; x < vals.length; x++) {
            if (typeof vals[x] === "function") {
                vals[x] = vals[x].bind(params);
            }
        }
        let stag = "";
        if (returnValues) {
            names.push("tag");
            stag = "tag";
            vals.push(function tag(strings, values) {
                return values;
            });
        }
        var func = funccache[names.join(",") + this];
        if (func === undefined) { //create functions is slow so cache
            func = new Function(...names, `return ${stag}\`${this}\`;`);
            funccache[names.join(",") + this] = func;
        }
        return func(...vals);
    };
    /*function replace(str, data, member) {
        var ob = getVar(data, member);
        return str.split("{{" + member + "}}").join(ob);
    }*/
    function getVar(data, member) {
        var ergebnis = member.toString().match(/\$\{(\w||\.)*\}/g);
        if (!ergebnis)
            member = "${" + member + "}";
        var ob = member.replaceTemplate(data, true);
        /*	var names = member.split(".");
            var ob = data[names[0]];
            for (let x = 1; x < names.length; x++) {
        
                if (ob === undefined)
                    return undefined;
                ob = ob[names[x]];
            }*/
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
    function groupSort(group, name, groupfields, groupid = 0) {
        var ret = { entries: [], name: name };
        if (groupid > 0)
            ret["groupfield"] = groupfields[groupid - 1];
        if (Array.isArray(group)) {
            group.forEach((neu) => ret.entries.push(neu));
        }
        else {
            for (var key in group) {
                var neu = group[key];
                ret.entries.push(groupSort(neu, key, groupfields, groupid + 1));
            }
            ret.entries = ret.entries.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }
        return ret;
    }
    function doGroup(entries, groupfields) {
        var ret = {};
        for (var e = 0; e < entries.length; e++) {
            var entry = entries[e];
            let parent = ret;
            for (var x = 0; x < groupfields.length; x++) {
                var groupname = entry[groupfields[x]];
                if (x < groupfields.length - 1) { //undergroups does exists
                    if (!parent[groupname])
                        parent[groupname] = {};
                }
                else { //last group contaons the data
                    if (!parent[groupname])
                        parent[groupname] = [];
                    parent[groupname].push(entry);
                }
                parent = parent[groupname];
            }
        }
        //sort
        var sorted = groupSort(ret, "main", groupfields);
        return sorted;
    }
    exports.doGroup = doGroup;
    function replaceDatatable(def, data) {
        var header = def.datatable.header;
        var footer = def.datatable.footer;
        var dataexpr = def.datatable.dataforeach;
        var groups = def.datatable.groups;
        var body = def.datatable.body;
        var groupexpr = [];
        def.table = clone(def.datatable);
        def.table.body = [];
        delete def.table.header;
        delete def.table.footer;
        delete def.table.dataforeach;
        delete def.table.groups;
        if (header)
            def.table.body.push(header);
        if (groups === undefined || groups.length === 0) {
            def.table.body.push({
                foreach: dataexpr,
                do: body
            });
        }
        else {
            var parent = {};
            var toadd = {
                foreach: "group1 in datatablegroups.entries",
                do: parent
            };
            def.table.body.push(toadd);
            for (var x = 0; x < groups.length; x++) {
                groupexpr.push(groups[x].expression);
                if (x < groups.length - 1) {
                    parent.foreach = "group" + (x + 2).toString() + " in group" + (x + 1).toString() + ".entries";
                }
                else {
                    parent.foreach = dataexpr.split(" ")[0] + " in group" + (x + 1).toString() + ".entries";
                }
                if (groups[x].header && groups[x].header.length > 0) {
                    parent.dofirst = groups[x].header;
                }
                if (groups[x].footer && groups[x].footer.length > 0) {
                    parent.dolast = groups[x].footer;
                }
                if (x < groups.length - 1) {
                    parent.do = {};
                    parent = parent.do;
                }
                else {
                    parent.do = body;
                }
            }
            var arr = getArrayFromForEach(def.datatable.dataforeach, data);
            data.datatablegroups = doGroup(arr, groupexpr);
        }
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
    function getArrayFromForEach(foreach, data) {
        var sarr = foreach.split(" in ")[1];
        var arr;
        if (sarr === undefined) {
            arr = data === null || data === void 0 ? void 0 : data.items; //we get the main array
        }
        else {
            arr = getVar(data, sarr);
        }
        return arr;
    }
    function replaceTemplates(def, data, param = undefined) {
        if (def === undefined)
            return;
        if (def.datatable !== undefined) {
            replaceDatatable(def, data);
        }
        if (def.foreach !== undefined) {
            //resolve foreach
            //	{ foreach: "line in invoice.lines", do: ['{{line.text}}', '{{line.price}}', 'OK?']	
            if ((param === null || param === void 0 ? void 0 : param.parentArray) === undefined) {
                throw "foreach is not surounded by an Array";
            }
            var variable = def.foreach.split(" in ")[0];
            var arr = getArrayFromForEach(def.foreach, data);
            if ((param === null || param === void 0 ? void 0 : param.parentArrayPos) === undefined) {
                param.parentArrayPos = param === null || param === void 0 ? void 0 : param.parentArray.indexOf(def);
                param === null || param === void 0 ? void 0 : param.parentArray.splice(param.parentArrayPos, 1);
            }
            for (let x = 0; x < arr.length; x++) {
                data[variable] = arr[x];
                delete def.foreach;
                var copy;
                if (def.dofirst && x === 0) { //render only forfirst
                    copy = clone(def.dofirst);
                    copy = replaceTemplates(copy, data, param);
                    if (copy !== undefined)
                        param.parentArray.splice(param.parentArrayPos++, 0, copy);
                }
                if (def.do)
                    copy = clone(def.do);
                else
                    copy = clone(def);
                copy = replaceTemplates(copy, data, param);
                if (copy !== undefined)
                    param.parentArray.splice(param.parentArrayPos++, 0, copy);
                if (def.dolast && x === arr.length - 1) { //render only forlast
                    copy = clone(def.dolast);
                    copy = replaceTemplates(copy, data, param);
                    if (copy !== undefined)
                        param.parentArray.splice(param.parentArrayPos++, 0, copy);
                }
            }
            delete data[variable];
            return undefined;
        }
        else if (Array.isArray(def)) {
            for (var a = 0; a < def.length; a++) {
                if (def[a].foreach !== undefined) {
                    replaceTemplates(def[a], data, { parentArray: def });
                    a--;
                }
                else
                    def[a] = replaceTemplates(def[a], data, { parentArray: def });
            }
            return def;
        }
        else if (typeof def === "string") {
            var ergebnis = def.toString().match(/\$\{(\w||\.)*\}/g);
            if (ergebnis !== null) {
                def = def.replaceTemplate(data);
                //	for (var e = 0; e < ergebnis.length; e++) {
                //		def = replace(def, data, ergebnis[e].substring(2, ergebnis[e].length - 2));
                //	}
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
    function createReportDefinition(definition, data, parameter) {
        definition = clone(definition); //this would be modified
        if (data !== undefined)
            data = clone(data); //this would be modified
        if (data === undefined && definition.data !== undefined) {
            data = definition.data;
        }
        //parameter could be in data
        if (data !== undefined && data.parameter !== undefined && parameter !== undefined) {
            throw new Error("parameter would override data.parameter");
        }
        if (Array.isArray(data)) {
            data = { items: data }; //so we can do data.parameter
        }
        if (parameter !== undefined) {
            data.parameter = parameter;
        }
        //parameter could be in definition
        if (data !== undefined && data.parameter !== undefined && definition.parameter !== undefined) {
            throw new Error("definition.parameter would override data.parameter");
        }
        if (definition.parameter !== undefined) {
            data.parameter = definition.parameter;
        }
        definition.content = replaceTemplates(definition.content, data);
        if (definition.background)
            definition.background = replaceTemplates(definition.background, data);
        if (definition.header)
            definition.header = replaceTemplates(definition.header, data);
        if (definition.footer)
            definition.footer = replaceTemplates(definition.footer, data);
        //definition.content = replaceTemplates(definition.content, data);
        replacePageInformation(definition);
        delete definition.data;
        return definition;
        // delete definition.parameter;
    }
    exports.createReportDefinition = createReportDefinition;
    var funccache = {};
    function test() {
        var h = {
            k: 5,
            ho() {
                return this.k + 1;
            }
        };
        //@ts-ignore
        var s = "${ho()}".replaceTemplate(h, true);
        h.k = 60;
        s = "${ho()}".replaceTemplate(h, true);
        console.log(s + 2);
    }
    exports.test = test;
});
define("demoreports/01-Simpledata", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "Hallo ${name}",
            "${address.street}",
            "${parameter.date}"
        ]
    };
    function test() {
        return {
            reportdesign,
            data: {
                name: "Klaus",
                address: {
                    street: "Mainstreet 8"
                }
            },
            parameter: { date: "2021-10-10" } //parameter
        };
    }
    exports.test = test;
});
define("demoreports/02-Foreach", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            //for each could be in each element e.g. text
            {
                foreach: "line",
                text: "${line.name}"
            },
            "or in table",
            {
                table: {
                    body: [
                        {
                            foreach: "line",
                            do: ["${line.name}"]
                        }
                    ]
                }
            }
        ]
    };
    function test() {
        return {
            reportdesign,
            data: [
                { name: "line1" },
                { name: "line2" },
                { name: "line3" }
            ]
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/03-Foreach", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
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
                        "Date: ${invoice.date}",
                        "Number: ${invoice.number}"
                    ],
                    {}
                ]
            },
            {
                table: {
                    body: [
                        ["Item", "Price"],
                        {
                            foreach: "line in invoice.lines",
                            do: ["${line.text}", "${line.price}"]
                        }
                    ]
                }
            },
            {},
            {},
            "\n",
            {
                foreach: "sum in invoice.summary",
                do: {
                    columns: [
                        {
                            text: "${sum.text}"
                        },
                        {
                            text: "${sum.value}"
                        }
                    ]
                }
            }
        ]
    };
    function test() {
        return {
            reportdesign,
            data: {
                invoice: {
                    number: 1000,
                    date: "2018-07-02",
                    customer: {
                        firstname: "Henry",
                        lastname: "Klaus",
                        street: "Hauptstr. 157",
                        place: "Chemnitz"
                    },
                    lines: [
                        {
                            pos: 1,
                            text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg",
                            price: 10,
                            amount: 50
                        },
                        {
                            pos: 2,
                            text: "this is the next position",
                            price: 20.5
                        },
                        {
                            pos: 3,
                            text: "this is an other position",
                            price: 19.5
                        },
                        {
                            pos: 4,
                            text: "this is the last position",
                            price: 50
                        }
                    ],
                    summary: [
                        {
                            text: "Net",
                            value: 100
                        },
                        {
                            text: "Tax",
                            value: 19
                        },
                        {
                            text: "Gross",
                            value: 119
                        }
                    ]
                }
            }, //data
            //parameter: { }      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/04-Foreach", ["require", "exports", "jassijs_report/remote/pdfmakejassi"], function (require, exports, pdfmakejassi_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "A complex nested foreach. This could be better done with a datatable",
            {
                table: {
                    body: [
                        {
                            foreach: "group1 in entries",
                            do: {
                                foreach: "group2 in group1.entries",
                                dofirst: [{ bold: true, text: "${group1.name}", colSpan: 2 }, "dd"],
                                do: {
                                    foreach: "ar in group2.entries",
                                    dofirst: [{ text: "${group2.name}", colSpan: 2 }, "dd"],
                                    do: [
                                        "${ar.id}",
                                        "${ar.customer} from ${ar.city}"
                                    ],
                                    dolast: ["", ""],
                                },
                                dolast: ["End", "${group1.name}"],
                            }
                        }
                    ]
                }
            },
        ]
    };
    function test() {
        var sampleData = [
            { id: 1, customer: "Fred", city: "Frankfurt" },
            { id: 8, customer: "Alma", city: "Dresden" },
            { id: 3, customer: "Heinz", city: "Frankfurt" },
            { id: 2, customer: "Fred", city: "Frankfurt" },
            { id: 6, customer: "Max", city: "Dresden" },
            { id: 4, customer: "Heinz", city: "Frankfurt" },
            { id: 5, customer: "Max", city: "Dresden" },
            { id: 7, customer: "Alma", city: "Dresden" },
            { id: 9, customer: "Otto", city: "Berlin" }
        ];
        var groupedData = (0, pdfmakejassi_2.doGroup)(sampleData, ["city", "customer"]);
        return {
            reportdesign,
            data: groupedData, //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/05-Datatable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "A Simple datatable",
            {
                datatable: {
                    header: ["id", "customer", "city"],
                    footer: ["", "", ""],
                    dataforeach: "cust",
                    body: ["${cust.id}", "${cust.customer}", "${cust.city}"]
                }
            }
        ]
    };
    function test() {
        var sampleData = [
            { id: 1, customer: "Fred", city: "Frankfurt" },
            { id: 8, customer: "Alma", city: "Dresden" },
            { id: 3, customer: "Heinz", city: "Frankfurt" },
            { id: 2, customer: "Fred", city: "Frankfurt" },
            { id: 6, customer: "Max", city: "Dresden" },
            { id: 4, customer: "Heinz", city: "Frankfurt" },
            { id: 5, customer: "Max", city: "Dresden" },
            { id: 7, customer: "Alma", city: "Dresden" },
            { id: 9, customer: "Otto", city: "Berlin" }
        ];
        return {
            reportdesign,
            data: sampleData, //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/06-Datatable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "A datatable with 2 groups",
            {
                datatable: {
                    groups: [
                        {
                            header: ["${group1.name}", "", ""],
                            expression: "city",
                            footer: ["", "", ""]
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
    function test() {
        var sampleData = [
            { id: 1, customer: "Fred", city: "Frankfurt" },
            { id: 8, customer: "Alma", city: "Dresden" },
            { id: 3, customer: "Heinz", city: "Frankfurt" },
            { id: 2, customer: "Fred", city: "Frankfurt" },
            { id: 6, customer: "Max", city: "Dresden" },
            { id: 4, customer: "Heinz", city: "Frankfurt" },
            { id: 5, customer: "Max", city: "Dresden" },
            { id: 7, customer: "Alma", city: "Dresden" },
            { id: 9, customer: "Otto", city: "Berlin" }
        ];
        return {
            reportdesign,
            data: sampleData, //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/Empty", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: []
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Basics", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            'First paragraph',
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
        ]
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Columns", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            'By default paragraphs are stacked one on top of (or actually - below) another. ',
            'It\'s possible however to split any paragraph (or even the whole document) into columns.\n\n',
            'Here we go with 2 star-sized columns, with justified text and gap set to 20:\n\n',
            {
                alignment: 'justify',
                columns: [
                    {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    },
                    {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    }
                ]
            },
            '\nStar-sized columns have always equal widths, so if we define 3 of those, it\'ll look like this (make sure to scroll to the next page, as we have a couple of more examples):\n\n',
            {
                columns: [
                    {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    },
                    {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    },
                    {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    }
                ]
            },
            '\nYou can also specify accurate widths for some (or all columns). Let\'s make the first column and the last one narrow and let the layout engine divide remaining space equally between other star-columns:\n\n',
            {
                columns: [
                    {
                        width: 90,
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    },
                    {
                        width: '*',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    },
                    {
                        width: '*',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    },
                    {
                        width: 90,
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                    }
                ]
            },
            '\nWe also support auto columns. They set their widths based on the content:\n\n',
            {
                columns: [
                    {
                        width: 'auto',
                        text: 'auto column'
                    },
                    {
                        width: '*',
                        text: 'This is a star-sized column. It should get the remaining space divided by the number of all star-sized columns.'
                    },
                    {
                        width: 50,
                        text: 'this one has specific width set to 50'
                    },
                    {
                        width: 'auto',
                        text: 'another auto column'
                    },
                    {
                        width: '*',
                        text: 'This is a star-sized column. It should get the remaining space divided by the number of all star-sized columns.'
                    },
                ]
            },
            '\nIf all auto columns fit within available width, the table does not occupy whole space:\n\n',
            {
                columns: [
                    {
                        width: 'auto',
                        text: 'val1'
                    },
                    {
                        width: 'auto',
                        text: 'val2'
                    },
                    {
                        width: 'auto',
                        text: 'value3'
                    },
                    {
                        width: 'auto',
                        text: 'value 4'
                    },
                ]
            },
            '\nAnother cool feature of pdfmake is the ability to have nested elements. Each column is actually quite similar to the whole document, so we can have inner paragraphs and further divisions, like in the following example:\n\n',
            {
                columns: [
                    {
                        width: 100,
                        fontSize: 9,
                        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Conveniunt quieti extremum severitatem disseretur virtute locum virtus declarant. Greges telos detrimenti persius possint eripuit appellat democrito suscipere existimant. Facere usus levitatibus confirmavit, provincia rutilius libris accommodare valetudinis ignota fugienda arbitramur falsarum commodius. Voluptas summis arbitrarer cognitio temperantiamque, fuit posidonium pro assueverit animos inferiorem, affecti honestum ferreum cum tot nemo ius partes dissensio opinor, tuum intellegunt numeris ignorant, odia diligenter licet, sublatum repellere, maior ficta severa quantum mortem. Aut evertitur impediri vivamus.'
                    },
                    [
                        'As you can see in the document definition - this column is not defined with an object, but an array, which means it\'s treated as an array of paragraphs rendered one below another.',
                        'Just like on the top-level of the document. Let\'s try to divide the remaing space into 3 star-sized columns:\n\n',
                        {
                            columns: [
                                { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                                { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                                { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                            ]
                        }
                    ]
                ]
            },
            '\n\nOh, don\'t forget, we can use everything from styling examples (named styles, custom overrides) here as well.\n\n',
            'For instance - our next paragraph will use the \'bigger\' style (with fontSize set to 15 and italics - true). We\'ll split it into three columns and make sure they inherit the style:\n\n',
            {
                style: 'bigger',
                columns: [
                    'First column (BTW - it\'s defined as a single string value. pdfmake will turn it into appropriate structure automatically and make sure it inherits the styles',
                    {
                        fontSize: 20,
                        text: 'In this column, we\'ve overriden fontSize to 20. It means the content should have italics=true (inherited from the style) and be a little bit bigger',
                    },
                    {
                        style: 'header',
                        text: 'Last column does not override any styling properties, but applies a new style (header) to itself. Eventually - texts here have italics=true (from bigger) and derive fontSize from the style. OK, but which one? Both styles define it. As we already know from our styling examples, multiple styles can be applied to the element and their order is important. Because \'header\' style has been set after \'bigger\' its fontSize takes precedence over the fontSize from \'bigger\'. This is how it works. You will find more examples in the unit tests.'
                    }
                ]
            },
            '\n\nWow, you\'ve read the whole document! Congratulations :D'
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            bigger: {
                fontSize: 15,
                italics: true
            }
        },
        defaultStyle: {
            columnGap: 20
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Images", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            'pdfmake (since it\'s based on pdfkit) supports JPEG and PNG format',
            'If no width/height/fit is provided, image original size will be used',
            {
                image: 'sampleImage',
            },
            'If you specify width, image will scale proportionally',
            {
                image: 'sampleImage',
                width: 150
            },
            'If you specify both width and height - image will be stretched',
            {
                image: 'sampleImage',
                width: 150,
                height: 150,
            },
            'You can also fit the image inside a rectangle',
            {
                image: 'sampleImage',
                fit: [100, 100],
                pageBreak: 'after'
            },
            // Warning! Make sure to copy this definition and paste it to an
            // external text editor, as the online AceEditor has some troubles
            // with long dataUrl lines and the following image values look like
            // they're empty.
            'Images can be also provided in dataURL format...',
            {
                image: 'data:image/jpeg;base64,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AAGyAAAAEAAAAAEAAAAAABJwcmludE91dHB1dE9wdGlvbnMAAAASAAAAAENwdG5ib29sAAAAAABDbGJyYm9vbAAAAAAAUmdzTWJvb2wAAAAAAENybkNib29sAAAAAABDbnRDYm9vbAAAAAAATGJsc2Jvb2wAAAAAAE5ndHZib29sAAAAAABFbWxEYm9vbAAAAAAASW50cmJvb2wAAAAAAEJja2dPYmpjAAAAAQAAAAAAAFJHQkMAAAADAAAAAFJkICBkb3ViQG/gAAAAAAAAAAAAR3JuIGRvdWJAb+AAAAAAAAAAAABCbCAgZG91YkBv4AAAAAAAAAAAAEJyZFRVbnRGI1JsdAAAAAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAB4OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgABOEJJTQQCAAAAAAAEAAAAADhCSU0EMAAAAAAAAgEBOEJJTQQtAAAAAAAGAAEAAAACOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0sAAAAGAAAAAAAAAAAAAAE2AAACtwAAAAsAQgBlAHoAIABuAGEAegB3AHkALQAxAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAK3AAABNgAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAABNgAAAABSZ2h0bG9uZwAAArcAAAAGc2xpY2VzVmxMcwAAAAFPYmpjAAAAAQAAAAAABXNsaWNlAAAAEgAAAAdzbGljZUlEbG9uZwAAAAAAAAAHZ3JvdXBJRGxvbmcAAAAAAAAABm9yaWdpbmVudW0AAAAMRVNsaWNlT3JpZ2luAAAADWF1dG9HZW5lcmF0ZWQAAAAAVHlwZWVudW0AAAAKRVNsaWNlVHlwZQAAAABJbWcgAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAATYAAAAAUmdodGxvbmcAAAK3AAAAA3VybFRFWFQAAAABAAAAAAAAbnVsbFRFWFQAAAABAAAAAAAATXNnZVRFWFQAAAABAAAAAAAGYWx0VGFnVEVYVAAAAAEAAAAAAA5jZWxsVGV4dElzSFRNTGJvb2wBAAAACGNlbGxUZXh0VEVYVAAAAAEAAAAAAAlob3J6QWxpZ25lbnVtAAAAD0VTbGljZUhvcnpBbGlnbgAAAAdkZWZhdWx0AAAACXZlcnRBbGlnbmVudW0AAAAPRVNsaWNlVmVydEFsaWduAAAAB2RlZmF1bHQAAAALYmdDb2xvclR5cGVlbnVtAAAAEUVTbGljZUJHQ29sb3JUeXBlAAAAAE5vbmUAAAAJdG9wT3V0c2V0bG9uZwAAAAAAAAAKbGVmdE91dHNldGxvbmcAAAAAAAAADGJvdHRvbU91dHNldGxvbmcAAAAAAAAAC3JpZ2h0T3V0c2V0bG9uZwAAAAAAOEJJTQQoAAAAAAAMAAAAAj/wAAAAAAAAOEJJTQQUAAAAAAAEAAAAAjhCSU0EDAAAAAAPmwAAAAEAAACgAAAARwAAAeAAAIUgAAAPfwAYAAH/2P/tAAxBZG9iZV9DTQAB/+4ADkFkb2JlAGSAAAAAAf/bAIQADAgICAkIDAkJDBELCgsRFQ8MDA8VGBMTFRMTGBEMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAENCwsNDg0QDg4QFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgARwCgAwEiAAIRAQMRAf/dAAQACv/EAT8AAAEFAQEBAQEBAAAAAAAAAAMAAQIEBQYHCAkKCwEAAQUBAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAABBAEDAgQCBQcGCAUDDDMBAAIRAwQhEjEFQVFhEyJxgTIGFJGhsUIjJBVSwWIzNHKC0UMHJZJT8OHxY3M1FqKygyZEk1RkRcKjdDYX0lXiZfKzhMPTdePzRieUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9jdHV2d3h5ent8fX5/cRAAICAQIEBAMEBQYHBwYFNQEAAhEDITESBEFRYXEiEwUygZEUobFCI8FS0fAzJGLhcoKSQ1MVY3M08SUGFqKygwcmNcLSRJNUoxdkRVU2dGXi8rOEw9N14/NGlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vYnN0dXZ3eHl6e3x//aAAwDAQACEQMRAD8A72Alt81KEoVq2mx9w81El3fVEhMQlakYfYDoTHgok+SKWptqNhGqKSmI8tfFELE21OtSMg/7VIbxwE8FPt08/FK0JWuyWtDmN3MHPDoUftVodIgjvA4UJcBEkDwUSJTREdQFxkehKf7W89h8z/eoWZb3iIj4IW3t2SaGgjdq3uByiIRHRXHI9WbLawJfJPhrCkb2uPteWjuFCWfmjaPE6qLjXEtkkdzx+VHhF9VcWm4XD3aue7T80f3oZufu7JHceSnbS94kRHmnUBuiydmDrXn/AHIZJPKKWQeZ+CaE4ELTfV//0PRfQf4H8FE1PHZW4kaJtfBP9wsRxBp7XDsmI8Qr0E8hMa5KPueCPa7NLRIDcYHKtsNdu70y2zY4tftMw4fSY/b+f/JTlgPZH3PBHteLShNsk8K26hs6aJCkTPJR9wI9stZgZBDmbj2P8FEtjloVza0DUfxTbK5mJnuEuPzTwaNEj5JoV51NU6Dt4n+9QNQHAlOGQLTiLU2pi1WvTE+HxS2J3Gt9stPb5JbVbLXNHbXyUCw+A+SImgwa235pw09p+9GNZ8Ewpd4I8QVwnsxFeoJg+Sc44MlsHyCIK3gcD704bHKHF4rhHuH/0fSg6snQGSsq361/VqqR+0qXuEjbW/fqNPzfb/0lcx8mq/Gry2hxotqbdxrse31Id+77V5tX0r68QA7PwyNAIro0+/C/cRMq7fVaB/IPWdR+uXT7sO/Hw7i222tzWXm6ussJ0FjCx1tntXLu6jnW+3J6p67AZa05cQY27v5v971P/Pf/AAiJg9L+s++w9RzKXVek40jHZjB/raeh6jrcH+Y+l6v+EVrqGD1d2Nt6ddVj5ReNr7a6Lay3ad9Tmuxz6fv9/re//R/4RDi8Y/y/wVGN9Jfy/wAJpHKfBa3MhpcXhoywPeRt9R+2r32fy0RnVOvbg5nWdr2ua5pdd6rYBbLbKdrG2MfttZ9L8/8A4JX68DODKRa5jrAKheWigBzg39Z9P9W9vqWfzax/rC9vT62HPNv6xjXV4H2dzWFuY0teb8j7N9j/AFX0X4/6Oz1/f6n6BOBJIFx17f8AoqKA1qWnf/0Z6fB+srse6+22+u5uQd7q7LIax/tbuodtd6dXps91H0P8N9P1vVtu+umEx+x7sdr9NPVeZkhrYc2hzXbnOavKB1HLDSXZFxaBJix8x/nLWzurfWfoNGHTkW4zHXsLqm001lvohrPS3ubtq9X3e9no+p/pbbf8EZYzEgXfF9P++UJggmqr6voA+u/TSN3q45BiD6r+52N/wH7/ALUh9d+lkF3rY8aSfVf3mP8AAfyHLm+jdV6nm0iz1W5zHMqc++uo1trtfpkdPcK27bbsRmy6y3/hVdZmdYNdbvsdm9zq2vZ+klge7ZdZPp+5uOz9K799NII/9Gj/AN6mx/KMnXb9delujbbjuniLXHs53+g/drein604Y59GRyBdr+NSw7bvrE8CrEwvUusLWiy2fTrDvU9bIt9ZrK3txWVss9Ox/wCk9T/rN2Hn0dRs6rdWy69lYDDY6ptj2VONTLG1OGEHMc6z6f6Fn+ESjZNXX1iUTkALq/8ABk9B1Tr3Ucm5rsTOqxKg0tFbLYlx/OcYfu93/QVQdU6yC4jqfud39ccD6HNP7v7qyOju6jZkjHa61ufXYHXV32AsGO3b9tx3syHWV/atp/RP9Pez/TVrbfV1eXFoqDQHgAmgmd4Nf+D936DcxO20uP8Ahf8AoqzfWpf4P/oyH9p9ZY5xq6kGF53PJuBkwxgcf0P+ir2f6+/V6b9Y7qMYV5t9WVb6hcbTaJLDH6L6DPoqgKepCq4WOqFr33jGcDQWgOH+T2WRX9Kt/wDO7v8AwZI09TN1cekKw8m1u7Hl1ZqLWtY41/S+17LP+L/7bSv+tD+X+CkCukvr/wCjO8PrT008yweO+k/gLkQfWDAcAWkkHUEGr/0uudrq6gCw2hhaCz1AHUA8EW/mNc39JscuG6ljdKr6pl0dRpfb1CsPuyrKrqmsdZ6ZyrfSZVjNZtd/wbUL7GJ8tUjxEh5vsVXUqrww1gkWEhp9vbd+49/7iKbT4LiPqj1Cmiqvp9I9PBwrL2h9jtzxD36eytjHMfba9zfp2Lov2308ucwWOLmgE+xw0cXBvueGt/MclCeh4q0P4JlE2K7P/9Kj0/q32XK9Vlh3NbDt99bqwcgDGrvstrbvcyn7R9pe/Y+v9H/LrWtb1Sh/S7serrXT6eouDhVksyQ6th37mO3XusyP5j9G72fTXIegHOud9oc77TaW2MezcXVVMPou0r2b7b/T/R0t2V/olnuwrG1F9eO51hY8S1pP0vZO5rfd7XKGOSMom5R4hrWnqW+4B4/V7y3qLXXWPq+sGCyp1uW+thyGe2q6ltXS6v8A2n5m7Js/6HrJU9QDbKnW/WDBsrZZgutaMivVlFbmdXb+b/ynf+kr/wDBPQXAVdGzNzbqsW97WODyW0OcIHu+m0Oa1Fx+nZ/oP/yY97vTeS402Eu9R1bHSR9L7N9Or9xScIuuIbb3FPH4F7P7XmtxBUfrP0/7T9l9P1TeyDkfaftP2vVu7Z+y/wBR+j9P/B7P0yz/APGD1LAyh04YV9GUA/JJ9KxtvpgjH2/zL3bX/wBdcvj49rn1EYXrVPtb6dz6nO3tY30XtDhsa6v/AAmxBdhZzWMudjXV47AGsf6bgx3dw3xt+mUoVxRJIH1iiU7BFJmvkEbS8QZaOSAJctH61WZP2TpYyuo4/U7Wi6Lsaxrwxm3G9PHsFTWenZXH5yptwshmJblPLanUEg0WkNs9oGpre5ln52xu1n01pn6o9Ptx9teVY1zR6pL/AExBe2txbbuNfp+xn+FdWpMmbHYlxgiF3SMcDRFfNVN36nZmTX0h4w7cakm7JNrcq2sONv2egdPfU23Z+h+1/wA//wAGuit6j1HcfQyunhv6fbuuqn+Yr/Z35/8A5Zev9p/7rbFx9P1O6W8v35j5qEua52NW8fS27qrL3erurrfb+ifZ/wAUi2/Unp3oONd2Tu2E1ucyoNJ9xY5zt30FEZwl6hIES1BZACNK2evq6pksy2u+2YDKd9vvN9Q2s9Kv7K93vO7ZmfanXf8ABekuT6u57+oPc++vJcW1zfQ/fW47GjdXawMa/wBvs+ih4n1Rpxcmu224FglpGwOc6RbTFdMW+s97vT/Re+z3+n/OK+3onTG1+3KvFVQiRjvc1rZJgvZVtb7js96MJQB3H2LJgy0r8Wf1Xy+nYmbuy9lLyLC3MttFbGNNZHpPbZ+jc6135633dW6ccjc3q+EKjbU8V/aWT6bWuF9ezX+ds2u+l/1ytc/T03puH1Gm8ZtpyKgTXjPxnWNeSHMk45pf630/3Pp/8IsfO+q72dUya8P7RdiUFzKb2gvc4gN/PpZs936Tds2em/6aJnEk0dxWyACBVbG/m/S/d9L2Y6rgta1tnWcIvaKg8/amn3Ns3ZDvo/4Sj9F/58/0iDd1St1T21df6cyw12NrebQQLHXi7HsIH5leBuxH/wDC+9Yh6L03H6djuOPdZkPL25NhZcXNY20b6XtpHp+o7Cdtf7ff+n9P9IhZOL0mu/HZi9Ftyqbv523bltNQmPU2ub+nZsdv/RppyRJ18/liE1Wnh1kXo39ZwzZYW9a6eK3PyDW31iCGPDP2ewn3e/Gc237Q7/thclmV9bf1DPcy63MrsstdTk0lxZY2ym70jTZ7d9bbPRY3/hUmtrIE/Va0PL9pbuySQ3/SfRV+3o3Qfte/9mWuxTW8OnHzA5129ux8mPZ6Pqe399IziP8Aein7PtWwLL+n4ebk5lDjtfdd6b9vuDg12/8ASC1jv0jnWfpK7P5pBd9csICGYTGw3c5/6MFzXD0/8HjM9P32Nd+jT5NXTsJzDi4LhjPpuq+y2V3M9W95r9NnqWbb2+rTu/wn83Vaq1A6absU5HRm0Yz6y7IcPWeJ9/oVDdYd9O9tFjbK0PciNTrr3UT4gfV//9PmW/t39IWnIkgDUOjT6Mta3b9H6Hp/mKQt62Pa0XiyJcS2TEd/YuOSWWfa68H/ADWpr4vXOv6nJ3Nft13S2DJ01/R/up6HdTLnuLrGFxEhrSdB9HQs9ti5BJA+1Rrh/wCajV7Wy3qjg8WusA4durAP/Uf9/U6j1N1h9N1gP8kEGf7DGtXDpKM+3WnD/wA1Wvi9uLeqktA9YSIb7TMePta72IRyc8TDXEAkOPpwOPd6ns/6pcaknD2utf8ANVq9mLs5rpYPdGoYwF0H6O72f+YJ25Fxa1zht0IDX1s8vBn/AJguLSS9Hhf0Vq9vXdmOZtr+iXH6DANe8OFe3ck+65utrWOa2NwewbPLdptXEJJp4b6f2q1e+ozsSWi3HZJ4hrNTptiG7m/yFaZZiP3QysAfSEAH+1t/O2rzdJRzr9FcL8H0kPxw+am0usH0gI3En96NqcOa5m7Y1gIGgPtAHaGl7e681STFavpbnDeG2Bm+PpEdvm7cokWOESxoEemWeH5n0fp/nfSXmySIU+iPFW4k3VCxztG+lI4/6LvTURXjBzw2xhsO3d5Cf0cbQ1/9VeepJ2qPsf/ZADhCSU0EIQAAAAAAWQAAAAEBAAAADwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAAABUAQQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAIABDAFMANQAuADEAAAABADhCSU0EBgAAAAAABwAEAAAAAQEA/+EN3Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMDMtMTlUMDM6MDI6MjYrMDE6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxODAxMTc0MDcyMDY4MTE4NzFGODEzMUZCNkU2ODk4IiBzdEV2dDp3aGVuPSIyMDE0LTAzLTE5VDAzOjAyOjI2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgc3RFdnQ6d2hlbj0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0IChjKSAxOTk4IEhld2xldHQtUGFja2FyZCBDb21wYW55AABkZXNjAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAA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',
                width: 200
            },
            'or be declared in an "images" dictionary and referenced by name',
            {
                image: 'building',
                width: 200
            },
            'and opacity is supported:',
            {
                image: 'sampleImage',
                width: 150,
                opacity: 0.5
            },
        ],
        images: {
            building: 'data:image/jpeg;base64,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AAGyAAAAEAAAAAEAAAAAABJwcmludE91dHB1dE9wdGlvbnMAAAASAAAAAENwdG5ib29sAAAAAABDbGJyYm9vbAAAAAAAUmdzTWJvb2wAAAAAAENybkNib29sAAAAAABDbnRDYm9vbAAAAAAATGJsc2Jvb2wAAAAAAE5ndHZib29sAAAAAABFbWxEYm9vbAAAAAAASW50cmJvb2wAAAAAAEJja2dPYmpjAAAAAQAAAAAAAFJHQkMAAAADAAAAAFJkICBkb3ViQG/gAAAAAAAAAAAAR3JuIGRvdWJAb+AAAAAAAAAAAABCbCAgZG91YkBv4AAAAAAAAAAAAEJyZFRVbnRGI1JsdAAAAAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAB4OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgABOEJJTQQCAAAAAAAEAAAAADhCSU0EMAAAAAAAAgEBOEJJTQQtAAAAAAAGAAEAAAACOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0sAAAAGAAAA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aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMDMtMTlUMDM6MDI6MjYrMDE6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxODAxMTc0MDcyMDY4MTE4NzFGODEzMUZCNkU2ODk4IiBzdEV2dDp3aGVuPSIyMDE0LTAzLTE5VDAzOjAyOjI2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgc3RFdnQ6d2hlbj0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0IChjKSAxOTk4IEhld2xldHQtUGFja2FyZCBDb21wYW55AABkZXNjAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAA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',
            sampleImage: 'data:image/jpeg;base64,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AAGyAAAAEAAAAAEAAAAAABJwcmludE91dHB1dE9wdGlvbnMAAAASAAAAAENwdG5ib29sAAAAAABDbGJyYm9vbAAAAAAAUmdzTWJvb2wAAAAAAENybkNib29sAAAAAABDbnRDYm9vbAAAAAAATGJsc2Jvb2wAAAAAAE5ndHZib29sAAAAAABFbWxEYm9vbAAAAAAASW50cmJvb2wAAAAAAEJja2dPYmpjAAAAAQAAAAAAAFJHQkMAAAADAAAAAFJkICBkb3ViQG/gAAAAAAAAAAAAR3JuIGRvdWJAb+AAAAAAAAAAAABCbCAgZG91YkBv4AAAAAAAAAAAAEJyZFRVbnRGI1JsdAAAAAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAB4OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgABOEJJTQQCAAAAAAAEAAAAADhCSU0EMAAAAAAAAgEBOEJJTQQtAAAAAAAGAAEAAAACOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0sAAAAGAAAA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aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMDMtMTlUMDM6MDI6MjYrMDE6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTg3MUY4MTMxRkI2RTY4OTgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxODAxMTc0MDcyMDY4MTE4NzFGODEzMUZCNkU2ODk4IiBzdEV2dDp3aGVuPSIyMDE0LTAzLTE5VDAzOjAyOjI2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjgwMTE3NDA3MjA2ODExODcxRjgxMzFGQjZFNjg5OCIgc3RFdnQ6d2hlbj0iMjAxNC0wMy0xOVQwMzowMjoyNiswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0IChjKSAxOTk4IEhld2xldHQtUGFja2FyZCBDb21wYW55AABkZXNjAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAA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'
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Lists", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            { text: 'Unordered list', style: 'header' },
            {
                ul: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nUnordered list with longer lines', style: 'header' },
            {
                ul: [
                    'item 1',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list', style: 'header' },
            {
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list with longer lines', style: 'header' },
            {
                ol: [
                    'item 1',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list should be descending', style: 'header' },
            {
                reversed: true,
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list with start value', style: 'header' },
            {
                start: 50,
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list with own values', style: 'header' },
            {
                ol: [
                    { text: 'item 1', counter: 10 },
                    { text: 'item 2', counter: 20 },
                    { text: 'item 3', counter: 30 },
                    { text: 'item 4 without own value' }
                ]
            },
            { text: '\n\nNested lists (ordered)', style: 'header' },
            {
                ol: [
                    'item 1',
                    [
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        {
                            ol: [
                                'subitem 1',
                                'subitem 2',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                { text: [
                                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                        'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    ] },
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                'subitem 4',
                                'subitem 5',
                            ]
                        }
                    ],
                    'item 3\nsecond line of item3'
                ]
            },
            { text: '\n\nNested lists (unordered)', style: 'header' },
            {
                ol: [
                    'item 1',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    {
                        ul: [
                            'subitem 1',
                            'subitem 2',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            { text: [
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                ] },
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 4',
                            'subitem 5',
                        ]
                    },
                    'item 3\nsecond line of item3',
                ]
            },
            { text: '\n\nUnordered lists inside columns', style: 'header' },
            {
                columns: [
                    {
                        ul: [
                            'item 1',
                            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        ]
                    },
                    {
                        ul: [
                            'item 1',
                            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        ]
                    }
                ]
            },
            { text: '\n\nOrdered lists inside columns', style: 'header' },
            {
                columns: [
                    {
                        ol: [
                            'item 1',
                            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        ]
                    },
                    {
                        ol: [
                            'item 1',
                            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                        ]
                    }
                ]
            },
            { text: '\n\nNested lists width columns', style: 'header' },
            {
                ul: [
                    'item 1',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                    {
                        ol: [
                            [
                                {
                                    columns: [
                                        'column 1',
                                        {
                                            stack: [
                                                'column 2',
                                                {
                                                    ul: [
                                                        'item 1',
                                                        'item 2',
                                                        {
                                                            ul: [
                                                                'item',
                                                                'item',
                                                                'item',
                                                            ]
                                                        },
                                                        'item 4',
                                                    ]
                                                }
                                            ]
                                        },
                                        'column 3',
                                        'column 4',
                                    ]
                                },
                                'subitem 1 in a vertical container',
                                'subitem 2 in a vertical container',
                            ],
                            'subitem 2',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            { text: [
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                    'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                                ] },
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 3 - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit',
                            'subitem 4',
                            'subitem 5',
                        ]
                    },
                    'item 3\nsecond line of item3',
                ]
            },
            { text: '\n\nUnordered list with square marker type', style: 'header' },
            {
                type: 'square',
                ul: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nUnordered list with circle marker type', style: 'header' },
            {
                type: 'circle',
                ul: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nColored unordered list', style: 'header' },
            {
                color: 'blue',
                ul: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nColored unordered list with own marker color', style: 'header' },
            {
                color: 'blue',
                markerColor: 'red',
                ul: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nColored ordered list', style: 'header' },
            {
                color: 'blue',
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nColored ordered list with own marker color', style: 'header' },
            {
                color: 'blue',
                markerColor: 'red',
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list - type: lower-alpha', style: 'header' },
            {
                type: 'lower-alpha',
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list - type: upper-alpha', style: 'header' },
            {
                type: 'upper-alpha',
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list - type: upper-roman', style: 'header' },
            {
                type: 'upper-roman',
                ol: [
                    'item 1',
                    'item 2',
                    'item 3',
                    'item 4',
                    'item 5'
                ]
            },
            { text: '\n\nOrdered list - type: lower-roman', style: 'header' },
            {
                type: 'lower-roman',
                ol: [
                    'item 1',
                    'item 2',
                    'item 3',
                    'item 4',
                    'item 5'
                ]
            },
            { text: '\n\nOrdered list - type: none', style: 'header' },
            {
                type: 'none',
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nUnordered list - type: none', style: 'header' },
            {
                type: 'none',
                ul: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list with own separator', style: 'header' },
            {
                separator: ')',
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list with own complex separator', style: 'header' },
            {
                separator: ['(', ')'],
                ol: [
                    'item 1',
                    'item 2',
                    'item 3'
                ]
            },
            { text: '\n\nOrdered list with own items type', style: 'header' },
            {
                ol: [
                    'item 1',
                    { text: 'item 2', listType: 'none' },
                    { text: 'item 3', listType: 'upper-roman' }
                ]
            },
            { text: '\n\nUnordered list with own items type', style: 'header' },
            {
                ul: [
                    'item 1',
                    { text: 'item 2', listType: 'none' },
                    { text: 'item 3', listType: 'circle' }
                ]
            },
        ],
        styles: {
            header: {
                bold: true,
                fontSize: 15
            }
        },
        defaultStyle: {
            fontSize: 12
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Margin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                stack: [
                    'This header has both top and bottom margins defined',
                    { text: 'This is a subheader', style: 'subheader' },
                ],
                style: 'header'
            },
            {
                text: [
                    'Margins have slightly different behavior than other layout properties. They are not inherited, unlike anything else. They\'re applied only to those nodes which explicitly ',
                    'set margin or style property.\n',
                ]
            },
            {
                text: 'This paragraph (consisting of a single line) directly sets top and bottom margin to 20',
                margin: [0, 20],
            },
            {
                stack: [
                    { text: [
                            'This line begins a stack of paragraphs. The whole stack uses a ',
                            { text: 'superMargin', italics: true },
                            ' style (with margin and fontSize properties).',
                        ]
                    },
                    { text: ['When you look at the', { text: ' document definition', italics: true }, ', you will notice that fontSize is inherited by all paragraphs inside the stack.'] },
                    'Margin however is only applied once (to the whole stack).'
                ],
                style: 'superMargin'
            },
            {
                stack: [
                    'I\'m not sure yet if this is the desired behavior. I find it a better approach however. One thing to be considered in the future is an explicit layout property called inheritMargin which could opt-in the inheritance.\n\n',
                    {
                        fontSize: 15,
                        text: [
                            'Currently margins for ',
                            /* the following margin definition doesn't change anything */
                            { text: 'inlines', margin: 20 },
                            ' are ignored\n\n'
                        ],
                    },
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                ],
                margin: [0, 20, 0, 0],
                alignment: 'justify'
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'right',
                margin: [0, 190, 0, 80]
            },
            subheader: {
                fontSize: 14
            },
            superMargin: {
                margin: [20, 0, 40, 0],
                fontSize: 15
            }
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Styles1", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                text: 'This is a header, using header style',
                style: 'header'
            },
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n',
            {
                text: 'Subheader 1 - using subheader style',
                style: 'subheader'
            },
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
            {
                text: 'Subheader 2 - using subheader style',
                style: 'subheader'
            },
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
            {
                text: 'It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties',
                style: ['quote', 'small']
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            }
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Styles2", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                text: 'This is a header (whole paragraph uses the same header style)\n\n',
                style: 'header'
            },
            {
                text: [
                    'It is however possible to provide an array of texts ',
                    'to the paragraph (instead of a single string) and have ',
                    { text: 'a better ', fontSize: 15, bold: true },
                    'control over it. \nEach inline can be ',
                    { text: 'styled ', fontSize: 20 },
                    { text: 'independently ', italics: true, fontSize: 40 },
                    'then.\n\n'
                ]
            },
            { text: 'Mixing named styles and style-overrides', style: 'header' },
            {
                style: 'bigger',
                italics: false,
                text: [
                    'We can also mix named-styles and style-overrides at both paragraph and inline level. ',
                    'For example, this paragraph uses the "bigger" style, which changes fontSize to 15 and sets italics to true. ',
                    'Texts are not italics though. It\'s because we\'ve overriden italics back to false at ',
                    'the paragraph level. \n\n',
                    'We can also change the style of a single inline. Let\'s use a named style called header: ',
                    { text: 'like here.\n', style: 'header' },
                    'It got bigger and bold.\n\n',
                    'OK, now we\'re going to mix named styles and style-overrides at the inline level. ',
                    'We\'ll use header style (it makes texts bigger and bold), but we\'ll override ',
                    'bold back to false: ',
                    { text: 'wow! it works!', style: 'header', bold: false },
                    '\n\nMake sure to take a look into the sources to understand what\'s going on here.'
                ]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            bigger: {
                fontSize: 15,
                italics: true
            }
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Styles3", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                text: 'This paragraph uses header style and extends the alignment property',
                style: 'header',
                alignment: 'center'
            },
            {
                text: [
                    'This paragraph uses header style and overrides bold value setting it back to false.\n',
                    'Header style in this example sets alignment to justify, so this paragraph should be rendered \n',
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                ],
                style: 'header',
                bold: false
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'justify'
            }
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
define("demoreports/pdfmake-playground/Tables", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            { text: 'Tables', style: 'header' },
            'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
            { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
            'The following table has nothing more than a body array',
            {
                style: 'tableExample',
                table: {
                    body: [
                        ['Column 1', 'Column 2', 'Column 3'],
                        ['One value goes here', 'Another one here', 'OK?']
                    ]
                }
            },
            { text: 'A simple table with nested elements', style: 'subheader' },
            'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
            {
                style: 'tableExample',
                table: {
                    body: [
                        ['Column 1', 'Column 2', 'Column 3'],
                        [
                            {
                                stack: [
                                    'Let\'s try an unordered list',
                                    {
                                        ul: [
                                            'item 1',
                                            'item 2'
                                        ]
                                    }
                                ]
                            },
                            [
                                'or a nested table',
                                {
                                    table: {
                                        body: [
                                            ['Col1', 'Col2', 'Col3'],
                                            ['1', '2', '3'],
                                            ['1', '2', '3']
                                        ]
                                    },
                                }
                            ],
                            { text: [
                                    'Inlines can be ',
                                    { text: 'styled\n', italics: true },
                                    { text: 'easily as everywhere else', fontSize: 10 }
                                ]
                            }
                        ]
                    ]
                }
            },
            { text: 'Defining column widths', style: 'subheader' },
            'Tables support the same width definitions as standard columns:',
            {
                bold: true,
                ul: [
                    'auto',
                    'star',
                    'fixed value'
                ]
            },
            {
                style: 'tableExample',
                table: {
                    widths: [100, '*', 200, '*'],
                    body: [
                        ['width=100', 'star-sized', 'width=200', 'star-sized'],
                        ['fixed-width cells have exactly the specified width', { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }]
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        ['This is a star-sized column. The next column over, an auto-sized column, will wrap to accomodate all the text in this cell.', 'I am auto sized.'],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        ['This is a star-sized column. The next column over, an auto-sized column, will not wrap to accomodate all the text in this cell, because it has been given the noWrap style.', { text: 'I am auto sized.', noWrap: true }],
                    ]
                }
            },
            { text: 'Defining row heights', style: 'subheader' },
            {
                style: 'tableExample',
                table: {
                    heights: [20, 50, 70],
                    body: [
                        ['row 1 with height 20', 'column B'],
                        ['row 2 with height 50', 'column B'],
                        ['row 3 with height 70', 'column B']
                    ]
                }
            },
            'With same height:',
            {
                style: 'tableExample',
                table: {
                    heights: 40,
                    body: [
                        ['row 1', 'column B'],
                        ['row 2', 'column B'],
                        ['row 3', 'column B']
                    ]
                }
            },
            'With height from function:',
            {
                style: 'tableExample',
                table: {
                    heights: function (row) {
                        return (row + 1) * 25;
                    },
                    body: [
                        ['row 1', 'column B'],
                        ['row 2', 'column B'],
                        ['row 3', 'column B']
                    ]
                }
            },
            { text: 'Column/row spans', pageBreak: 'before', style: 'subheader' },
            'Each cell-element can set a rowSpan or colSpan',
            {
                style: 'tableExample',
                color: '#444',
                table: {
                    widths: [200, 'auto', 'auto'],
                    headerRows: 2,
                    // keepWithHeaderRows: 1,
                    body: [
                        [{ text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
                        [{ text: 'Header 1', style: 'tableHeader', alignment: 'center' }, { text: 'Header 2', style: 'tableHeader', alignment: 'center' }, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        [{ rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }, 'Sample value 2', 'Sample value 3'],
                        ['', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, ''],
                        ['Sample value 1', '', ''],
                    ]
                }
            },
            { text: 'Headers', pageBreak: 'before', style: 'subheader' },
            'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',
            { text: ['It is also possible to set keepWithHeaderRows to make sure there will be no page-break between the header and these rows. Take a look at the document-definition and play with it. If you set it to one, the following table will automatically start on the next page, since there\'s not enough space for the first row to be rendered here'], color: 'gray', italics: true },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    // dontBreakRows: true,
                    // keepWithHeaderRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        [
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                        ]
                    ]
                }
            },
            { text: 'Styling tables', style: 'subheader' },
            'You can provide a custom styler for the table. Currently it supports:',
            {
                ul: [
                    'line widths',
                    'line colors',
                    'cell paddings',
                ]
            },
            'with more options coming soon...\n\npdfmake currently has a few predefined styles (see them on the next page)',
            { text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: 'noBorders'
            },
            { text: 'headerLineOnly:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: 'headerLineOnly'
            },
            { text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: 'lightHorizontalLines'
            },
            { text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                    },
                    vLineColor: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                    },
                    // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    // paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; },
                    // fillColor: function (rowIndex, node, columnIndex) { return null; }
                }
            },
            { text: 'zebra style', margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    body: [
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                    }
                }
            },
            { text: 'and can be used dash border', margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'black';
                    },
                    hLineStyle: function (i, node) {
                        if (i === 0 || i === node.table.body.length) {
                            return null;
                        }
                        return { dash: { length: 10, space: 4 } };
                    },
                    vLineStyle: function (i, node) {
                        if (i === 0 || i === node.table.widths.length) {
                            return null;
                        }
                        return { dash: { length: 4 } };
                    },
                    // paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; },
                    // fillColor: function (i, node) { return null; }
                }
            },
            { text: 'Optional border', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
            'Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.',
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            {
                                border: [false, true, false, false],
                                fillColor: '#eeeeee',
                                text: 'border:\n[false, true, false, false]'
                            },
                            {
                                border: [false, false, false, false],
                                fillColor: '#dddddd',
                                text: 'border:\n[false, false, false, false]'
                            },
                            {
                                border: [true, true, true, true],
                                fillColor: '#eeeeee',
                                text: 'border:\n[true, true, true, true]'
                            }
                        ],
                        [
                            {
                                rowSpan: 3,
                                border: [true, true, true, true],
                                fillColor: '#eeeeff',
                                text: 'rowSpan: 3\n\nborder:\n[true, true, true, true]'
                            },
                            {
                                border: undefined,
                                fillColor: '#eeeeee',
                                text: 'border:\nundefined'
                            },
                            {
                                border: [true, false, false, false],
                                fillColor: '#dddddd',
                                text: 'border:\n[true, false, false, false]'
                            }
                        ],
                        [
                            '',
                            {
                                colSpan: 2,
                                border: [true, true, true, true],
                                fillColor: '#eeffee',
                                text: 'colSpan: 2\n\nborder:\n[true, true, true, true]'
                            },
                            ''
                        ],
                        [
                            '',
                            {
                                border: undefined,
                                fillColor: '#eeeeee',
                                text: 'border:\nundefined'
                            },
                            {
                                border: [false, false, true, true],
                                fillColor: '#dddddd',
                                text: 'border:\n[false, false, true, true]'
                            }
                        ]
                    ]
                },
                layout: {
                    defaultBorder: false,
                }
            },
            'For every cell without a border property, whether it has all borders or not is determined by layout.defaultBorder, which is false in the table above and true (by default) in the table below.',
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            {
                                border: [false, false, false, false],
                                fillColor: '#eeeeee',
                                text: 'border:\n[false, false, false, false]'
                            },
                            {
                                fillColor: '#dddddd',
                                text: 'border:\nundefined'
                            },
                            {
                                fillColor: '#eeeeee',
                                text: 'border:\nundefined'
                            },
                        ],
                        [
                            {
                                fillColor: '#dddddd',
                                text: 'border:\nundefined'
                            },
                            {
                                fillColor: '#eeeeee',
                                text: 'border:\nundefined'
                            },
                            {
                                border: [true, true, false, false],
                                fillColor: '#dddddd',
                                text: 'border:\n[true, true, false, false]'
                            },
                        ]
                    ]
                }
            },
            'And some other examples with rowSpan/colSpan...',
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            '',
                            'column 1',
                            'column 2',
                            'column 3'
                        ],
                        [
                            'row 1',
                            {
                                rowSpan: 3,
                                colSpan: 3,
                                border: [true, true, true, true],
                                fillColor: '#cccccc',
                                text: 'rowSpan: 3\ncolSpan: 3\n\nborder:\n[true, true, true, true]'
                            },
                            '',
                            ''
                        ],
                        [
                            'row 2',
                            '',
                            '',
                            ''
                        ],
                        [
                            'row 3',
                            '',
                            '',
                            ''
                        ]
                    ]
                },
                layout: {
                    defaultBorder: false,
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            {
                                colSpan: 3,
                                text: 'colSpan: 3\n\nborder:\n[false, false, false, false]',
                                fillColor: '#eeeeee',
                                border: [false, false, false, false]
                            },
                            '',
                            ''
                        ],
                        [
                            'border:\nundefined',
                            'border:\nundefined',
                            'border:\nundefined'
                        ]
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            { rowSpan: 3, text: 'rowSpan: 3\n\nborder:\n[false, false, false, false]', fillColor: '#eeeeee', border: [false, false, false, false] },
                            'border:\nundefined',
                            'border:\nundefined'
                        ],
                        [
                            '',
                            'border:\nundefined',
                            'border:\nundefined'
                        ],
                        [
                            '',
                            'border:\nundefined',
                            'border:\nundefined'
                        ]
                    ]
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
        defaultStyle: {
        // alignment: 'justify'
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=jassijs_report.js.map
//# sourceMappingURL=jassijs_report.js.map