var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs_editor/FileExplorer", "jassijs/base/Windows", "jassijs/ui/Panel", "jassijs/base/Router", "jassijs/remote/Settings", "jassijs/base/CurrentSettings"], function (require, exports, FileExplorer_1, Windows_1, Panel_1, Router_1, Settings_1, CurrentSettings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    Windows_1 = __importDefault(Windows_1);
    //var h=new RemoteObject().test();
    async function start() {
        //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
        //  var body = new Panel({ id: "body" });
        //body.max();
        var site = new Panel_1.Panel();
        Windows_1.default._desktop.add(site);
        site.dom.innerHTML = '<h1>\n<a id="user-content-jassijs-reporteditor" class="anchor" href="#jassijs-reporteditor" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Jassijs-Reporteditor</h1>\n<p>Jassijs Reporteditor is a visual tool for designing <a href="http://pdfmake.org/" rel="nofollow">pdfmake</a> reports. The reports can be rendered with pdfmake to pdf either directly in the browser or server-side with nodes.\nThe report designer can be executed directly via <a href="https://uwei.github.io/jassijs-reporteditor/web" rel="nofollow">https://uwei.github.io/jassijs-reporteditor/web</a>. The report designer can also be integrated into your own websites. An example of this is <a href="https://uwei.github.io/jassijs-reporteditor/simple" rel="nofollow">here</a>.</p>\n<h2>\n<a id="user-content-runtime" class="anchor" href="#runtime" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Runtime</h2>\n<p>The Jassijs report designer extends the syntax of pdfmake by filling data e.g. with the help of data tables. In order for the report to be filled at runtime, a conversion of the report design is necessary. Here is an <a href="https://uwei.github.io/jassijs-reporteditor/simple/usereport.html" rel="nofollow">example</a> or [with amd] (<a href="https://uwei.github.io/jassijs-reporteditor/simple/usereport-amd.html" rel="nofollow">https://uwei.github.io/jassijs-reporteditor/simple/usereport-amd.html</a>):</p>\n<div class="highlight highlight-text-html-basic"><pre><span class="pl-kos">&lt;</span><span class="pl-ent">head</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.2/pdfmake.min.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.2/vfs_fonts.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">http://localhost/jassijs/dist/pdfmakejassi.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;/</span><span class="pl-ent">head</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;</span><span class="pl-ent">body</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">docDefinition</span><span class="pl-c1">=</span><span class="pl-kos">{</span>\n\t\t\t<span class="pl-c1">content</span>: <span class="pl-kos">[</span>\n\t\t\t\t<span class="pl-s">\'Hallo ${name}\'</span><span class="pl-kos">,</span>\n\t\t\t\t<span class="pl-s">\'${parameter.date}\'</span>\n\t\t\t<span class="pl-kos">]</span>\n\t\t<span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-c">//fill data  </span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">data</span><span class="pl-c1">=</span><span class="pl-kos">{</span><span class="pl-c1">name</span>:<span class="pl-s">\'Max\'</span><span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">parameter</span><span class="pl-c1">=</span><span class="pl-kos">{</span><span class="pl-c1">date</span>:<span class="pl-s">\'2021-10-15\'</span><span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-s1">docDefinition</span><span class="pl-c1">=</span><span class="pl-s1">pdfmakejassi</span><span class="pl-kos">.</span><span class="pl-en">createReportDefinition</span><span class="pl-kos">(</span><span class="pl-s1">docDefinition</span><span class="pl-kos">,</span><span class="pl-s1">data</span><span class="pl-kos">,</span><span class="pl-s1">parameter</span><span class="pl-kos">)</span><span class="pl-kos">;</span>\n\n\t\t<span class="pl-s1">pdfMake</span><span class="pl-kos">.</span><span class="pl-en">createPdf</span><span class="pl-kos">(</span><span class="pl-s1">docDefinition</span><span class="pl-kos">)</span><span class="pl-kos">.</span><span class="pl-en">download</span><span class="pl-kos">(</span><span class="pl-kos">)</span><span class="pl-kos">;</span>\n\t<span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;/</span><span class="pl-ent">body</span><span class="pl-kos">&gt;</span></pre></div>\n<h2>\n<a id="user-content-quick-start" class="anchor" href="#quick-start" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Quick Start:</h2>\n<p>The Jassijs Reportitor can be started directly in the <a href="https://uwei.github.io/jassijs-reporteditor/web" rel="nofollow">browser</a>. Please note that the reports stored there are not permanently stored and are lost when the browser cache is cleared.</p>\n<p>The existing reports are displayed on the right side. Double-click to open the report in Code view as javascript.\n<a href="https://camo.githubusercontent.com/9172b27b26433c0e87d06fd0419e757842ac89adb89e2bfb17be8de729d6431a/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72312e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/9172b27b26433c0e87d06fd0419e757842ac89adb89e2bfb17be8de729d6431a/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72312e6a7067" alt="jassijs-reporteditor1" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor1.jpg" style="max-width:100%;"></a></p>\n<p>With Run <a href="https://camo.githubusercontent.com/485308edc97cc3a97888998e8bc2691ad5f251b58d6f15f7ba70867f8cb4185e/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72322e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/485308edc97cc3a97888998e8bc2691ad5f251b58d6f15f7ba70867f8cb4185e/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72322e6a7067" alt="jassijs-reporteditor2" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor2.jpg" style="max-width:100%;"></a> the report opens in the <strong>Design</strong> view.\n<a href="https://camo.githubusercontent.com/d014a6a69fa8a13596a3cf885687c93352c6f26c2e292889eb246b719aeb3c23/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72332e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/d014a6a69fa8a13596a3cf885687c93352c6f26c2e292889eb246b719aeb3c23/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72332e6a7067" alt="jassijs-reporteditor3" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor3.jpg" style="max-width:100%;"></a>\nThere, new report elements can be added from the <strong>Palette</strong> via drag and drop. The <strong>Properties</strong> of the selected report item can be changed in the property editor.</p>\n<p>With <a href="https://camo.githubusercontent.com/8a5bab1108211501516632442bbc08c3d50fc0eb4bf2643eaa39855eb1bb5478/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72342e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/8a5bab1108211501516632442bbc08c3d50fc0eb4bf2643eaa39855eb1bb5478/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72342e6a7067" alt="jassijs-reporteditor4" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor4.jpg" style="max-width:100%;"></a> the created pdf can be viewed.\n<a href="https://camo.githubusercontent.com/58e07784a867b283f4fb6f2770ef2d03b6367ac5fea0943030b0fdd50d7db066/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72352e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/58e07784a867b283f4fb6f2770ef2d03b6367ac5fea0943030b0fdd50d7db066/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72352e6a7067" alt="jassijs-reporteditor5" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor5.jpg" style="max-width:100%;"></a></p>\n<p>In the <strong>Code</strong> view, the report is displayed as Javascript code. With Run <a href="https://camo.githubusercontent.com/485308edc97cc3a97888998e8bc2691ad5f251b58d6f15f7ba70867f8cb4185e/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72322e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/485308edc97cc3a97888998e8bc2691ad5f251b58d6f15f7ba70867f8cb4185e/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72322e6a7067" alt="jassijs-reporteditor2" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor2.jpg" style="max-width:100%;"></a> , changes in the code can be loaded back into the <strong>Design</strong> view.\nThere are many examples in the left side panel under Files that explain the report elements. Under pdfmake-Playground you will find examples of pdfmake. A detailed description of the syntax of pdfmake is described at <a href="http://pdfmake.org/" rel="nofollow">http://pdfmake.org/</a>.\nYou can create your own folders and reports (right-click context menu) under <strong>Files</strong>. But remember that the reports are only stored in the browser and are lost when the browser cache is cleared. You can also <strong>Download</strong> the <strong>modified</strong> reports (right-click on a folder in <strong>Files</strong>).</p>\n<h2>\n<a id="user-content-limitations" class="anchor" href="#limitations" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Limitations</h2>\n<p>Not all properties of the report elements that are possible with pdfmake can be set with the visual disigner, but these properties are not lost when editing the report.</p>\n<h2>\n<a id="user-content-syntax-extensions" class="anchor" href="#syntax-extensions" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Syntax extensions</h2>\n<p>The following extensions of the pdfmake syntax can be used with the help of link.</p>\n<h3>\n<a id="user-content-templating" class="anchor" href="#templating" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>templating:</h3>\n<p>With the help of javascript template strings, data can be filled into the report. The following example shows this.</p>\n<div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> <span class="pl-s1">reportdesign</span> <span class="pl-c1">=</span> <span class="pl-kos">{</span>\n\t<span class="pl-c1">content</span>: <span class="pl-kos">[</span>\n        <span class="pl-s">\'Hallo ${name}\'</span><span class="pl-kos">,</span>\n        <span class="pl-s">\'${address.street}\'</span><span class="pl-kos">,</span>\n        <span class="pl-s">\'${parameter.date}\'</span>\n    <span class="pl-kos">]</span>\n<span class="pl-kos">}</span><span class="pl-kos">;</span>\n\n<span class="pl-k">export</span> <span class="pl-k">function</span> <span class="pl-en">test</span><span class="pl-kos">(</span><span class="pl-kos">)</span> <span class="pl-kos">{</span>\n    <span class="pl-k">return</span> <span class="pl-kos">{</span> \n        reportdesign<span class="pl-kos">,</span>\n        <span class="pl-c1">data</span>:<span class="pl-kos">{</span>\n            <span class="pl-c1">name</span>:<span class="pl-s">\'Klaus\'</span><span class="pl-kos">,</span>\n            <span class="pl-c1">address</span>:<span class="pl-kos">{</span>\n                <span class="pl-c1">street</span>:<span class="pl-s">\'Mainstreet 8\'</span>\n            <span class="pl-kos">}</span>\n        <span class="pl-kos">}</span><span class="pl-kos">,</span>        \n        <span class="pl-c1">parameter</span>:<span class="pl-kos">{</span><span class="pl-c1">date</span>:<span class="pl-s">\'2021-10-10\'</span><span class="pl-kos">}</span>      <span class="pl-c">//parameter</span>\n    <span class="pl-kos">}</span><span class="pl-kos">;</span>\n<span class="pl-kos">}</span></pre></div>\n<p>The <strong>data</strong> of the report are specified in the data field or as a 2nd parameter when filling the report with <strong>pdfmakejassi.createReportDefinition</strong>.\nThis data could be filled line javascript Template-Strings like <strong>${name}</strong>.\nSimilar to data, parameters can also be filled in the report.</p>\n<h3>\n<a id="user-content-edittogether" class="anchor" href="#edittogether" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>edittogether</h3>\n<p>For texts with different formatting, individual text elements must be linked in pdfmake. Text elements that are to be edited together in a text box in the Designer are marked with edittogether. The text can be edited comfortably (thanks TinyMCE).\n<a href="https://camo.githubusercontent.com/a1741345d6b9db8cc6fa359d9ccebcb4940ba745ae8d42ec5c288553e1522dd0/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72362e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/a1741345d6b9db8cc6fa359d9ccebcb4940ba745ae8d42ec5c288553e1522dd0/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72362e6a7067" alt="jassijs-reporteditor6" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor6.jpg" style="max-width:100%;"></a></p>\n<h3>\n<a id="user-content-foreach" class="anchor" href="#foreach" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>foreach</h3>\n<p>If the report data contain arrays, then this data can be filled into the report with foreach.\nHere is a simple <a href="https://uwei.github.io/jassijs-reporteditor/web/#do=jassijs_editor.CodeEditor&amp;file=demoreports/10-Foreach.ts" rel="nofollow">example</a>.</p>\n<div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> <span class="pl-s1">reportdesign</span> <span class="pl-c1">=</span> <span class="pl-kos">{</span>\n    <span class="pl-c1">content</span>: <span class="pl-kos">[</span>\n        <span class="pl-kos">{</span>\n            <span class="pl-c1">foreach</span>: <span class="pl-s">\'line\'</span><span class="pl-kos">,</span>\n            <span class="pl-c1">text</span>: <span class="pl-s">\'${line.name}\'</span>\n        <span class="pl-kos">}</span><span class="pl-kos"></span>\n<span class="pl-kos">}</span><span class="pl-kos">;</span>\n\n<span class="pl-k">export</span> <span class="pl-k">function</span> <span class="pl-en">test</span><span class="pl-kos">(</span><span class="pl-kos">)</span> <span class="pl-kos">{</span>\n    <span class="pl-k">return</span> <span class="pl-kos">{</span>\n        reportdesign<span class="pl-kos">,</span>\n        <span class="pl-c1">data</span>: <span class="pl-kos">[</span>\n            <span class="pl-kos">{</span> <span class="pl-c1">name</span>: <span class="pl-s">\'line1\'</span> <span class="pl-kos">}</span><span class="pl-kos">,</span>\n            <span class="pl-kos">{</span> <span class="pl-c1">name</span>: <span class="pl-s">\'line2\'</span> <span class="pl-kos">}</span><span class="pl-kos">,</span>\n            <span class="pl-kos">{</span> <span class="pl-c1">name</span>: <span class="pl-s">\'line3\'</span> <span class="pl-kos">}</span>\n        <span class="pl-kos">]</span>\n    <span class="pl-kos">}</span><span class="pl-kos">;</span>\n<span class="pl-kos">}</span></pre></div>\n<p>The element that is marked with foreach is repeated for each array element.\nThe array element can be accessed with ${line.name}.\nforeach $line is the short form for foreach $line in data.\nIf not the element itself but another report element is to be repeated,\ncan be used.</p>\n<h3>\n<a id="user-content-datatable" class="anchor" href="#datatable" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>datatable</h3>\n<p>Syntax {\n}\nBeispiel</p>\n<h3>\n<a id="user-content-format" class="anchor" href="#format" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>format</h3>\n<h2>\n<a id="user-content-aggregate-functions" class="anchor" href="#aggregate-functions" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>aggregate Functions</h2>\n';
        site.style = {
            backgroundColor: "white",
            overflow: "scroll"
        };
        site.height = "100%";
        site.width = "100%";
        Windows_1.default.addLeft(new FileExplorer_1.FileExplorer(), "Files");
        Router_1.router.navigate(window.location.hash);
        //Ace should be default because long image blob breaks line   
        if (CurrentSettings_1.currentsettings.gets(Settings_1.Settings.keys.Development_DefaultEditor) === undefined) {
            Settings_1.Settings.save(Settings_1.Settings.keys.Development_DefaultEditor, "ace", "browser");
        }
    }
    start().then();
    async function convertMD() {
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
    }
    function test() {
        convertMD();
    }
    exports.test = test;
});
//# sourceMappingURL=StartReporteditor.js.map