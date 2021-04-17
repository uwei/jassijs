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
define(["require", "exports", "jassi/ui/Button", "jassi_report/ext/pdfjs", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/BoxPanel"], function (require, exports, Button_1, pdfjs_1, Component_1, Jassi_1, Panel_1, BoxPanel_1) {
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
        Jassi_1.$Class("jassi_report.PDFViewer"),
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
//# sourceMappingURL=PDFViewer.js.map
//# sourceMappingURL=PDFViewer.js.map