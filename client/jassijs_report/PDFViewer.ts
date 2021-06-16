import { Button } from "jassijs/ui/Button";
//@ts-ignore
import PDFJS from "jassijs_report/ext/pdfjs";
import { Component } from "jassijs/ui/Component";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { PDFReport } from "jassijs_report/PDFReport";
class Canavas extends Component {
    constructor() {
        super();
        super.init($('<canvas type="pdfviewer"></canvas>')[0]);
    }
}
type Me = {
    canavasPanel?: Canavas;
    toolbar?: BoxPanel;
    plus?: Button;
    minus?: Button;
    download?: Button;
};
@$Class("jassijs_report.PDFViewer")
export class PDFViewer extends Panel {
    _page: number;
    pdfjsLib: PDFJS;
    pdfDoc;
    pageNum: number;
    pageRendering: boolean;
    pageNumPending;
    scale: number;
    canvas: HTMLCanvasElement;
    ctx;
    _data;
    me: Me;
    report:PDFReport;
    constructor() {
        super();
        this._page = 1;
        //super.init(undefined);//$('<canvas type="pdfviewer"></canvas>')[0]);
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
        this.css({
            overflow:"auto"
        });
        me.toolbar = new BoxPanel();
        me.canavasPanel = new Canavas();
        me.plus = new Button();
        me.minus = new Button();
        var _this = this;
        me.download = new Button();
        //me.canavasPanel.height="90%";
        //	me.canavasPanel.width="90%";
        //	var cn=$('<canvas type="pdfviewer"></canvas>')[0]
        this.canvas = <HTMLCanvasElement>me.canavasPanel.dom;
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
            var viewport = page.getViewport({scale:_this.scale});
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
