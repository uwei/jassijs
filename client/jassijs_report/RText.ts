import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $ReportComponent, ReportComponent } from "jassijs_report/ReportComponent";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";


class InlineStyling {
    bold: boolean;
    italics: boolean;
    color: string;
    background: string;
    underline: boolean;
    fontsize: number;
    font: string;
}

@$ReportComponent({ fullPath: "report/Text", icon: "mdi mdi-format-color-text" })
@$Class("jassijs_report.RText")
//@$Property({hideBaseClassProperties:true})
@$Property({ name: "value", type: "string", description: "text" })

export class RText extends ReportComponent {
    private _tcm;
    private toolbar = ['undo redo | bold italic underline', 'forecolor backcolor | fontsizeselect  '];

    reporttype: string = "text";
    private _bold: boolean;
    private _decoration: string;
    private _decorationStyle: string;
    private _decorationColor: string;
    private _color: string;
    private _fontSize: number;
    private _lineHeight: number;
    private _italics: boolean;
    private _alignment: string;
    private _background: string;
    private _font: string;

    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        super.init($('<div class="RText jdisableaddcomponents" ><div  class="HTMLPanelContent"></div></div>')[0]);
        $(this.domWrapper).removeClass("jcontainer");
        $(this.__dom).css("text-overflow", "ellipsis");
        $(this.__dom).css("overflow", "hidden");
        //$(this.__dom).addClass("designerNoResizable");
    
        //  super.init($('<div class="RText"></div>')[0]);
        var el = this.dom.children[0];
        this._designMode = false;
        $(this.dom).css("display", "block");
        this.css({ font_family: "Roboto", font_size: "12px" })
        //   $(this.dom.children[0]).css("display","inline-block");
        this.extensionCalled = HTMLPanel.prototype.extensionCalled.bind(this);
        this._setDesignMode = HTMLPanel.prototype._setDesignMode.bind(this);
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

    @$Property()
    get bold(): boolean {
        return this._bold;
    }
    set bold(value: boolean) {
        this._bold = value;
        $(this.dom).css("font-weight", value ? "bold" : "normal");
    }
    @$Property()
    get italics(): boolean {
        return this._italics;
    }
    set italics(value: boolean) {
        this._italics = value;
        $(this.dom).css("font-style", value ? "italic" : "normal");
    }
    @$Property({chooseFrom:["Alegreya",    "AlegreyaSans",    "AlegreyaSansSC",    "AlegreyaSC",    "AlmendraSC",    "Amaranth",    "Andada",    "AndadaSC",    "AnonymousPro",    "ArchivoNarrow",    "Arvo",    "Asap",    "AveriaLibre",    "AveriaSansLibre",    "AveriaSerifLibre",    "Cambay",    "Caudex",    "CrimsonText",    "Cuprum",    "Economica",    "Exo2",    "Exo",    "ExpletusSans",    "FiraSans",    "JosefinSans",    "JosefinSlab",    "Karla",    "Lato",    "LobsterTwo",    "Lora",    "Marvel",    "Merriweather",    "MerriweatherSans",    "Nobile",    "NoticiaText",    "Overlock",    "Philosopher",    "PlayfairDisplay",    "PlayfairDisplaySC",    "PT_Serif-Web",    "Puritan",    "Quantico",    "QuattrocentoSans",    "Quicksand",    "Rambla",    "Rosario",    "Sansation",    "Sarabun",    "Scada",    "Share",    "Sitara",    "SourceSansPro",    "TitilliumWeb",    "Volkhov",    "Vollkorn"]})
    get font(): string {
        return this._font;
    }
    set font(value: string) {
        this._font=value;
        //copy from CSSProperties
        var api = 'https://fonts.googleapis.com/css?family=';
        var sfont = value.replaceAll(" ", "+")
        if (!document.getElementById("-->" + api + sfont)) {//"-->https://fonts.googleapis.com/css?family=Aclonica">
            jassijs.myRequire(api + sfont);
        }

        if (value === undefined)
            $(this.dom).css("font_family", "");
        else
            $(this.dom).css("font_family", value);
    }
    @$Property()
    get fontSize(): number {
        return this._fontSize;
    }
    set fontSize(value: number) {
        this._fontSize=value;
        if (value === undefined)
            $(this.dom).css("font-size", "");
        else
            $(this.dom).css("font-size", value + "px");
    }
    @$Property({ type: "color" })
    get background(): string {
        return this._background;
    }
    set background(value: string) {
        this._background = value;
        $(this.dom).css("background-color", value);
    }
    @$Property({ type: "color" })
    get color(): string {
        return this._color;
    }
    set color(value: string) {
        this._color = value;
        $(this.dom).css("color", value);
    }
    @$Property({ chooseFrom: ["left", "center", "right"] })
    get alignment(): string {
        return this._alignment;
    }
    set alignment(value: string) {
        this._alignment = value;
        $(this.dom).css("text-align", value);
    }
    @$Property({ chooseFrom: ["underline", "lineThrough", "overline"] })
    get decoration(): string {
        return this._decoration;
    }
    set decoration(value: string) {
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


    @$Property({ type: "color" })
    get decorationColor(): string {
        return this._decorationColor;
    }
    set decorationColor(value: string) {
        this._decorationColor = value;
        $(this.dom).css("textDecorationColor", value);
    }
    @$Property({ chooseFrom: ["dashed", "dotted", "double", "wavy"] })
    get decorationStyle(): string {
        return this._decorationStyle;
    }
    set decorationStyle(value: string) {
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
    @$Property({ default: 1 })
    get lineHeight(): number {
        return this._lineHeight;
    }
    set lineHeight(value: number) {
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
    fromJSON(ob: any): RText {
        var ret = this;
        if (ob.editTogether) {
            delete ob.editTogether;
            ret.convertToHTML(ob.text);
        } else
            ret.value = <string>ob.text;
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
                style.fontsize = Number(child["style"]["font-size"].replace("pt", ""));
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
            ret.editTogether = true;
            ret.text = list;
        }
        return ret;
    }
    toJSON() {

        var ret = super.toJSON();
        this.convertFromHTML(ret);
        if (this.width !== undefined && !this._parent?.setChildWidth)
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

        var test=0;
        for(var key in ret){
            test++;
        }
        if(test===1)
            ret=ret.text;//short version

        return ret;
    }
}
export function test() {
    var t = new RText();
    t.value = "a<em>b<strong>cd</strong>e</em><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>fg<span style='background-color: rgb(186, 55, 42);' data-mce-style='background-color: #ba372a;'>h</span></span><span style='background-color: rgb(186, 55, 42);' data-mce-style='background-color: #ba372a;'>ij<span style='font-size: 14pt;' data-mce-style='font-size: 14pt;'>k</span></span><span style='font-size: 14pt;' data-mce-style='font-size: 14pt;'>l<span style='text-decoration: underline;' data-mce-style='text-decoration: underline;'>m</span></span><span style='text-decoration: underline;' data-mce-style='text-decoration: underline;'>no</span>";

    var obb: RText = t.toJSON();
    //var test = RText.fromJSON(obb);


}
