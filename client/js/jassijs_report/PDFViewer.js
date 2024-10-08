var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/ui/Button", "jassijs_report/ext/pdfjs", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/BoxPanel"], function (require, exports, Button_1, pdfjs_1, Component_1, Registry_1, Panel_1, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.PDFViewer = void 0;
    pdfjs_1 = __importDefault(pdfjs_1);
    class Canavas extends Component_1.Component {
        constructor() {
            super();
        }
        render() {
            return React.createElement("canvas", { type: "pdfviewer" });
        }
    }
    let PDFViewer = class PDFViewer extends Panel_1.Panel {
        constructor() {
            super();
            this.pdfjsLib = pdfjs_1.default;
            this.pdfDoc = null;
            this.pageNum = 1;
            this.pageRendering = false;
            this.pageNumPending = null;
            this.scale = 1;
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            this.style = {
                overflow: "auto"
            };
            me.toolbar = new BoxPanel_1.BoxPanel();
            me.toolbar.dom.style.position = "fixed";
            me.mainpanel = new Panel_1.Panel();
            me.plus = new Button_1.Button();
            me.minus = new Button_1.Button();
            var _this = this;
            me.download = new Button_1.Button();
            this.add(me.toolbar);
            var placeholder = new Panel_1.Panel();
            placeholder.height = 20;
            this.add(placeholder);
            this.add(me.mainpanel);
            me.toolbar.add(me.plus);
            me.toolbar.horizontal = true;
            me.toolbar.add(me.download);
            me.toolbar.add(me.minus);
            me.plus.text = "+";
            me.plus.onclick(function (event) {
                _this.scale = _this.scale * 1.25;
                _this.updatePages();
                //_this.renderPage(_this._page);
            });
            me.plus.width = 20;
            me.plus.height = 20;
            me.minus.text = "-";
            me.minus.onclick(function (event) {
                _this.scale = _this.scale / 1.25;
                _this.updatePages();
            });
            me.download.icon = "mdi mdi-folder-open-outline";
            // me.download.text = "download";
            me.download.onclick(function (event) {
                _this.report.open();
            });
            // me.download.width = 75;
        }
        renderPages(num) {
            // The workerSrc property shall be specified.
            this.pageRendering = true;
            // Using promise to fetch the page
            var _this = this;
            this.pdfDoc.getPage(num).then(function (page) {
                var quality = 5;
                var viewport = page.getViewport({ scale: _this.scale * quality });
                var can = _this.canavasPanels[page._pageIndex].dom;
                can.height = viewport.height;
                can.width = viewport.width;
                can.style.width = Math.round(viewport.width / quality) + ".px";
                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: can.getContext('2d'),
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                // Wait for rendering to finish
                /*  renderTask.promise.then(function () {
                      _this.pageRendering = false;
                      if (_this.pageNumPending !== null) {
                          // New page rendering is pending
                          _this.renderPage(_this.pageNumPending);
                          _this.pageNumPending = null;
                      }
                  });*/
            });
        }
        updatePages() {
            for (var x = 0; x < this.me.mainpanel._components.length; x++) {
                this.renderPages(x + 1);
            }
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
                //_this.queueRenderPage(_this._page);
                _this.me.mainpanel.removeAll();
                _this.canavasPanels = []; //:Canavas[];
                for (var x = 0; x < pdf.numPages; x++) {
                    var cp = new Canavas();
                    _this.me.mainpanel.add(cp);
                    _this.canavasPanels.push(cp);
                    // _this.renderPages(x + 1);
                }
                _this.updatePages();
            }, function (e) {
                var g = e;
            });
        }
        get value() {
            return this._data;
        }
    };
    PDFViewer = __decorate([
        (0, Registry_1.$Class)("jassijs_report.PDFViewer"),
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
//# sourceMappingURL=PDFViewer.js.map