import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { loadFontIfNedded } from "jassijs/ui/CSSProperties";
import { Tools } from "jassijs/util/Tools";



class InlineStyling {
    bold: boolean;
    italics: boolean;
    color: string;
    background: string;
    underline: boolean;
    fontsize: number;
    font: string;
}


//calc the default Formats
let allFormats = (() => {
    var ret = [];
    const format = new Intl.NumberFormat();

    var decimal = format.format(1.1).substring(1, 2);
    var group = format.format(1234).substring(1, 2);
    /*	const parts = format.formatToParts(1234.6);
            var decimal = ".";
        var group=",";
        parts.forEach(p => {
            if (p.type === "decimal")
                decimal = p.value;
            if (p.type === "group")
                group = p.value;
        });*/
    ret.push("#" + group + "##0" + decimal + "00");
    ret.push("#" + group + "##0" + decimal + "00 €");
    ret.push("#" + group + "##0" + decimal + "00 $");
    ret.push("$#,###.00");
    ret.push("0");
    ret.push("0" + decimal + "00");
    ret.push("MM/DD/YYYY");
    ret.push("DD.MM.YYYY");
    ret.push("DD/MM/YYYY hh:mm:ss");
    ret.push("DD.MM.YYYY hh:mm:ss");
    ret.push("hh:mm:ss");
    ret.push("h:mm:ss A");
    return ret;
})();


@$ReportComponent({ fullPath: "report/Text", icon: "mdi mdi-format-color-text" })
@$Class("jassijs_report.RText")
//@$Property({hideBaseClassProperties:true})
@$Property({ name: "value", type: "string", description: "text" })

export class RText extends RComponent {
    reporttype: string = "text";
    initIfNeeded;
    toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
    customToolbarButtons: {
        [name: string]: {
            title: string,
            action: any;
        }
    } = {};
    _format: string;
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        super.init($('<div class="RText mce-content-body jdisableaddcomponents" tabindex="0" ><div  class="HTMLPanelContent"></div></div>')[0]);//tabindex for key-event
        $(this.domWrapper).removeClass("jcontainer");
        $(this.__dom).css("text-overflow", "ellipsis");
        $(this.__dom).css("overflow", "hidden");
        $(this.dom).addClass("designerNoResizable");

        loadFontIfNedded("Roboto");
        //  super.init($('<div class="RText"></div>')[0]);
        var el = this.dom.children[0];
        this._designMode = false;
        $(this.dom).css("display", "block");
        // this.css({ font_family: "inherit", font_size: "inherit" })
        //   $(this.dom.children[0]).css("display","inline-block");
        this.extensionCalled = HTMLPanel.prototype.extensionCalled.bind(this);
        this._setDesignMode = HTMLPanel.prototype._setDesignMode.bind(this);
        this.initIfNeeded = HTMLPanel.prototype.initIfNeeded.bind(this);
        //@ts-ignore
        this._initTinymce = HTMLPanel.prototype._initTinymce.bind(this);
    }

    @$Property({
        chooseFrom: function (component) {
            return ReportDesign.getVariables(component);
        }
    })
    get value(): string {
        var el = this.dom.children[0];
        if (el === undefined)
            return "";
        var ret = $(el).html();
        return ret;
    }
    set value(code: string) {
        var el: any = this.dom.children[0];
        if (el === undefined) {
            el = document.createTextNode(code);
            this.dom.appendChild(el);
        } else
            $(el).html(code);
    }
    @$Property({ type: "string", chooseFrom: allFormats })
    set format(value: string) {
        this._format = value;
    }
    get format(): string {
        return this._format;
    }


    fromJSON(ob: any): RText {
        var ret = this;
        if (ob.editTogether) {
            delete ob.editTogether;
            ret.convertToHTML(ob.text);
        } else
            ret.value = <string>ob.text.replaceAll("\n", "<br/>");
        delete ob.text;
        if (ob.format) {
            this.format = ob.format;
            delete ob.format;
        }
        super.fromJSON(ob);
        // ret.otherProperties = ob;
        return this;
    }
    private convertFromHTMLNode(node: ChildNode, list: any[], style: InlineStyling): any {
        for (var x = 0; x < node.childNodes.length; x++) {
            var child = node.childNodes[x];
            if (child.nodeName === "#text") {
                var rt: any = {};
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
            } else if (child.nodeName === "STRONG") {
                style.bold = true;
                this.convertFromHTMLNode(child, list, style);
                delete style.bold;
            } else if (child.nodeName === "EM") {
                style.italics = true;
                this.convertFromHTMLNode(child, list, style);
                delete style.italics;
            }
            if (child.nodeName === "SPAN" && child["style"].color !== "") {
                style.color = this.fullColorHex(child["style"].color);
                this.convertFromHTMLNode(child, list, style);
                delete style.color;
            } else if (child.nodeName === "SPAN" && child["style"]["background-color"] !== "") {
                style.background = this.fullColorHex(child["style"]["background-color"]);
                this.convertFromHTMLNode(child, list, style);
                delete style.background;
            } else if (child.nodeName === "SPAN" && child["style"]["font-size"] !== "") {
                style.fontsize = Number(child["style"]["font-size"].replace("px", ""));
                this.convertFromHTMLNode(child, list, style);
                delete style.fontsize;
            } else if (child.nodeName === "SPAN" && child["style"]["text-decoration"] !== "") {
                style.underline = (child["style"]["text-decoration"] === "underline");
                this.convertFromHTMLNode(child, list, style);
                delete style.underline;
            }

        }
    }
    private rgbToHex(rgb) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };
    //rgb(1,2,3)
    private fullColorHex(text: string) {
        var c = text.split("(")[1].split(")")[0].split(",");
        var red = this.rgbToHex(c[0]);
        var green = this.rgbToHex(c[1]);
        var blue = this.rgbToHex(c[2]);
        return "#" + red + green + blue;
    };
    private convertToHTML(obs: any[]) {
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
                    html += "<span style='color:" + ob.color + "'>"; tagcount++
                }
                if (ob.background) {
                    html += "<span style='background-color:" + ob.background + "'>"; tagcount++
                }
                if (ob.decoration) {
                    html += "<span style='text-decoration:" + ob.decoration + "'>"; tagcount++
                }
                if (ob.fontSize) {
                    html += "<span style='font-size:" + ob.fontSize + "pt'>"; tagcount++
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
    private convertFromHTML(ret: any): any {
        var sval = decodeURI(this.value);
        sval = sval.replaceAll("<br>", "\n")
        ret.text = sval//.replaceAll("<br>","\\n");
        var node = $("<span>" + ret.text + "</span>");
        if (node[0].innerText !== node[0].innerHTML) {//htmltext
            var style = new InlineStyling();
            var list: any[] = [];
            this.convertFromHTMLNode(node[0], list, style);
            if (list.length > 1) {
                ret.editTogether = true;
                ret.text = list;
            } else { //only one text found so we transfer the html 
                ret = list[0];
                ret.text = node[0].innerText;

                this.fromJSON(Tools.copyObject(ret));
            }
        }
        return ret;
    }
    toJSON() {

        var ret = super.toJSON();
        ret = this.convertFromHTML(ret);
        if (this.format) {
            ret.format = this.format;
        }

        var test = 0;
        for (var key in ret) {
            test++;
        }

        if (test === 1)
            ret = ret.text;//short version

        return ret;
    }
}
export function test() {
    var t = new RText();
    t.value = "a<em>b<strong>cd</strong>e</em><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>fg<span style='background-color: rgb(186, 55, 42);' data-mce-style='background-color: #ba372a;'>h</span></span><span style='background-color: rgb(186, 55, 42);' data-mce-style='background-color: #ba372a;'>ij<span style='font-size: 14pt;' data-mce-style='font-size: 14pt;'>k</span></span><span style='font-size: 14pt;' data-mce-style='font-size: 14pt;'>l<span style='text-decoration: underline;' data-mce-style='text-decoration: underline;'>m</span></span><span style='text-decoration: underline;' data-mce-style='text-decoration: underline;'>no</span>";

    var obb: RText = t.toJSON();
    //var test = RText.fromJSON(obb);


}
