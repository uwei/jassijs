var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/MenuItem", "jassijs/ui/Checkbox", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/HTMLPanel", "jassijs/base/Windows"], function (require, exports, MenuItem_1, Checkbox_1, Textbox_1, Button_1, BoxPanel_1, Jassi_1, Panel_1, HTMLPanel_1, Windows_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog = void 0;
    let Dialog = class Dialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.panel1 = new Panel_1.Panel();
            me.button3 = new Button_1.Button();
            me.button5 = new Button_1.Button();
            me.checkbox2 = new Checkbox_1.Checkbox();
            me.menuitem2 = new MenuItem_1.MenuItem();
            Jassi_1.default.includeCSS("kkkk", {
                ".ui-state-highlight": {
                    border: "3px solid yellow"
                }
            });
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.button2 = new Button_1.Button();
            me.button4 = new Button_1.Button();
            me.button7 = new Button_1.Button();
            me.textbox3 = new Textbox_1.Textbox();
            me.textbox4 = new Textbox_1.Textbox();
            me.checkbox1 = new Checkbox_1.Checkbox();
            me.boxpanel1.add(me.button7);
            me.boxpanel1.add(me.checkbox2);
            me.boxpanel1.add(me.panel1);
            me.boxpanel1.add(me.button3);
            this.add(me.boxpanel1);
            this.add(me.htmlpanel1);
            this.add(me.htmlpanel2);
            me.htmlpanel1.value = "";
            me.htmlpanel1.newlineafter = false;
            me.htmlpanel1.height = 15;
            me.htmlpanel2.value = "dd";
            me.button7.text = "dfdf";
            me.button7.width = "150";
            me.button3.text = "button";
            me.menuitem2.text = "menu";
        }
    };
    Dialog = __decorate([
        (0, Jassi_1.$Class)("$/Dialog"),
        __metadata("design:paramtypes", [])
    ], Dialog);
    exports.Dialog = Dialog;
    async function test() {
        var md = await $.ajax({
            type: "get",
            url: "https://uwei.github.io/jassijs-reporteditor/README.md"
        });
        md = md.replaceAll('"', "'");
        md = md.substring(0, 999999).replaceAll("\n", "\\n").replaceAll("\t", "\\t");
        //console.log(md);
        var html = await $.ajax({
            url: "https://api.github.com/markdown",
            type: 'post',
            headers: {
                "Accept": "application/vnd.github.v3+json"
            },
            data: '{"text":"' + md + '"}'
        });
        Windows_1.default._desktop.dom.outerHTML = '<h1>\n<a id="user-content-jassijs-reporteditor" class="anchor" href="#jassijs-reporteditor" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Jassijs-Reporteditor</h1>\n<p>Jassijs Reporteditor is a visual tool for designing <a href="http://pdfmake.org/" rel="nofollow">pdfmake</a> reports. The reports can be rendered with pdfmake to pdf either directly in the browser or server-side with nodes.\nThe report designer can be executed directly via <a href="https://uwei.github.io/jassijs-reporteditor/web" rel="nofollow">https://uwei.github.io/jassijs-reporteditor/web</a>. The report designer can also be integrated into your own websites. An example of this is <a href="https://uwei.github.io/jassijs-reporteditor/simple" rel="nofollow">here</a>.</p>\n<h2>\n<a id="user-content-runtime" class="anchor" href="#runtime" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Runtime</h2>\n<p>The Jassijs report designer extends the syntax of pdfmake by filling data e.g. with the help of data tables. In order for the report to be filled at runtime, a conversion of the report design is necessary. Here is an (example)[<a href="https://uwei.github.io/jassijs-reporteditor/simple/usereport.html" rel="nofollow">https://uwei.github.io/jassijs-reporteditor/simple/usereport.html</a>] or (with amd) [<a href="https://uwei.github.io/jassijs-reporteditor/simple/usereport-amd.html" rel="nofollow">https://uwei.github.io/jassijs-reporteditor/simple/usereport-amd.html</a>]:</p>\n<div class="highlight highlight-text-html-basic"><pre><span class="pl-kos">&lt;</span><span class="pl-ent">head</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.2/pdfmake.min.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.2/vfs_fonts.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">http://localhost/jassijs/dist/pdfmakejassi.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;/</span><span class="pl-ent">head</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;</span><span class="pl-ent">body</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">docDefinition</span><span class="pl-c1">=</span><span class="pl-kos">{</span>\n\t\t\t<span class="pl-c1">content</span>: <span class="pl-kos">[</span>\n\t\t\t\t<span class="pl-s">\'Hallo ${name}\'</span><span class="pl-kos">,</span>\n\t\t\t\t<span class="pl-s">\'${parameter.date}\'</span>\n\t\t\t<span class="pl-kos">]</span>\n\t\t<span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-c">//fill data  </span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">data</span><span class="pl-c1">=</span><span class="pl-kos">{</span><span class="pl-c1">name</span>:<span class="pl-s">\'Max\'</span><span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">parameter</span><span class="pl-c1">=</span><span class="pl-kos">{</span><span class="pl-c1">date</span>:<span class="pl-s">\'2021-10-15\'</span><span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-s1">docDefinition</span><span class="pl-c1">=</span><span class="pl-s1">pdfmakejassi</span><span class="pl-kos">.</span><span class="pl-en">createReportDefinition</span><span class="pl-kos">(</span><span class="pl-s1">docDefinition</span><span class="pl-kos">,</span><span class="pl-s1">data</span><span class="pl-kos">,</span><span class="pl-s1">parameter</span><span class="pl-kos">)</span><span class="pl-kos">;</span>\n\n\t\t<span class="pl-s1">pdfMake</span><span class="pl-kos">.</span><span class="pl-en">createPdf</span><span class="pl-kos">(</span><span class="pl-s1">docDefinition</span><span class="pl-kos">)</span><span class="pl-kos">.</span><span class="pl-en">download</span><span class="pl-kos">(</span><span class="pl-kos">)</span><span class="pl-kos">;</span>\n\t<span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;/</span><span class="pl-ent">body</span><span class="pl-kos">&gt;</span></pre></div>\n<h2>\n<a id="user-content-quick-start" class="anchor" href="#quick-start" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Quick Start:</h2>\n<p>The Jassijs Reportitor can be started directly in the <a href="https://uwei.github.io/jassijs-reporteditor/web" rel="nofollow">browser</a>. Please note that the reports stored there are not permanently stored and are lost when the browser cache is cleared.</p>\n<p>The existing reports are displayed on the right side. Double-click to open the report in Code view. With Run the report opens in the design view. There, new report elements can be added from the palette via drag and drop. The properties of the selected report item can be changed in the property editor. In Code view, the report is displayed as Javascript code.\nWith Run, changes in the code can be loaded back into the design view.\nWith button the created pdf can be viewed. There are many examples in the left side panel under Files that explain the report elements. Under pdfmake-Playground you will find examples of pdfmake. A detailed description of the syntax of pdfmake is described at <a href="http://www" rel="nofollow">www</a>.\nYou can create your own folders and reports (right-click context menu) under Files. But remember that the reports are only stored in the browser and are lost when the browser cache is cleared.</p>\n<h2>\n<a id="user-content-limitations" class="anchor" href="#limitations" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Limitations</h2>\n<p>Not all properties of the report elements that are possible with pdfmake can be set with the visual disigner, but these properties are not lost when editing the report.</p>\n<h2>\n<a id="user-content-syntax-extensions" class="anchor" href="#syntax-extensions" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Syntax extensions</h2>\n<p>The following extensions of the pdfmake syntax can be used with the help of link.</p>\n<h3>\n<a id="user-content-templating" class="anchor" href="#templating" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>templating:</h3>\n<p>With the help of javascript template strings, data can be filled into the report. The following example shows this. The data of the report are specified in the data field or as a 2nd parameter when filling the report.\nSimilar to data, parameters can also be filled in the report.</p>\n<h3>\n<a id="user-content-edittogether" class="anchor" href="#edittogether" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>edittogether</h3>\n<p>For texts with different formatting, individual text elements must be linked in pdfmake. Text elements that are to be edited together in a text box in the Designer are marked with edittogether. The text can be edited comfortably (thanks TinyMCE).Screenshoot Leiste</p>\n<h3>\n<a id="user-content-foreach" class="anchor" href="#foreach" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>foreach</h3>\n<p>If the report data contain arrays, then this data can be filled into the report with foreach.\nHere is a simple example link:\nThe element that is marked with foreach is repeated for each array element.\nThe array element can be accessed with $ {name}.\nforeach $ name is the short form for foreach $ name in data.\nIf not the element itself but another report element is to be repeated,\ncan be used. Example.</p>\n<h3>\n<a id="user-content-datatable" class="anchor" href="#datatable" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>datatable</h3>\n<p>Syntax {\n}\nBeispiel</p>\n<h3>\n<a id="user-content-format" class="anchor" href="#format" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>format</h3>\n<h2>\n<a id="user-content-aggregate-functions" class="anchor" href="#aggregate-functions" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>aggregate Functions</h2>\n';
        //windows.addLeft(new FileExplorer(), "Files");
        var ret = new Dialog();
        //  	var h=monaco.languages.typescript.typescriptDefaults;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog.js.map