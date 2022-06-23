import { Button } from "jassijs/ui/Button";
//@ts-ignore
import PDFJS from "jassijs_report/ext/pdfjs";
import { Component } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { PDFReport } from "jassijs_report/PDFReport";
class Canavas extends Component {
    constructor() {
        super();
        super.init('<canvas type="pdfviewer"></canvas>');
    }
}
type Me = {
    toolbar?: BoxPanel;
    plus?: Button;
    minus?: Button;
    download?: Button;
    mainpanel?: Panel;
};
@$Class("jassijs_report.PDFViewer")
export class PDFViewer extends Panel {
    pdfjsLib: PDFJS;
    pdfDoc;
    pageNum: number;
    pageRendering: boolean;
    pageNumPending;
    scale: number;
    allcanvas: HTMLCanvasElement[];
    canavasPanels: Canavas[];
    // ctx;
    _data;
    me: Me;
    report: PDFReport;
    constructor() {
        super();
        this.pdfjsLib = PDFJS;
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.scale = 0.8;
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        this.css={
            overflow: "auto"
        };
        me.toolbar = new BoxPanel();
        me.toolbar.dom.style.position="fixed";
        me.mainpanel = new Panel();
        me.plus = new Button();
        me.minus = new Button();
        var _this = this;
        me.download = new Button();
        this.add(me.toolbar);
        var placeholder=new Panel();
        placeholder.height=20;
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
        me.plus.width = 25;
        me.minus.text = "-";
        me.minus.onclick(function (event) {
            _this.value=_this.value;
            return;
            _this.scale = _this.scale / 1.25;
            _this.updatePages();
        });
        me.download.icon="mdi mdi-folder-open-outline";
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
            var viewport = page.getViewport({ scale: _this.scale });
            var can = <HTMLCanvasElement>_this.canavasPanels[page._pageIndex].dom;
            can.height = viewport.height;
            can.width = viewport.width;
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
    private updatePages() {
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
}
export async function test() {
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
