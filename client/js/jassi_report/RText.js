var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi_report/ReportComponent", "jassi/ui/HTMLPanel", "jassi/ui/Property", "jassi_report/ReportDesign"], function (require, exports, Jassi_1, ReportComponent_1, HTMLPanel_1, Property_1, ReportDesign_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RText = void 0;
    class InlineStyling {
    }
    let RText = class RText extends ReportComponent_1.ReportComponent {
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
        get font() {
            return this._font;
        }
        set font(value) {
            this._font = value;
            //copy from CSSProperties
            var api = 'https://fonts.googleapis.com/css?family=';
            var sfont = value.replaceAll(" ", "+");
            if (!document.getElementById("-->" + api + sfont)) { //"-->https://fonts.googleapis.com/css?family=Aclonica">
                Jassi_1.default.myRequire(api + sfont);
            }
            if (value === undefined)
                $(this.dom).css("font_family", "");
            else
                $(this.dom).css("font_family", value);
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
            return ret;
        }
    };
    __decorate([
        Property_1.$Property({
            chooseFrom: function (component) {
                return ReportDesign_1.ReportDesign.getVariables(component);
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "value", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RText.prototype, "bold", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RText.prototype, "italics", null);
    __decorate([
        Property_1.$Property({ chooseFrom: ["Alegreya", "AlegreyaSans", "AlegreyaSansSC", "AlegreyaSC", "AlmendraSC", "Amaranth", "Andada", "AndadaSC", "AnonymousPro", "ArchivoNarrow", "Arvo", "Asap", "AveriaLibre", "AveriaSansLibre", "AveriaSerifLibre", "Cambay", "Caudex", "CrimsonText", "Cuprum", "Economica", "Exo2", "Exo", "ExpletusSans", "FiraSans", "JosefinSans", "JosefinSlab", "Karla", "Lato", "LobsterTwo", "Lora", "Marvel", "Merriweather", "MerriweatherSans", "Nobile", "NoticiaText", "Overlock", "Philosopher", "PlayfairDisplay", "PlayfairDisplaySC", "PT_Serif-Web", "Puritan", "Quantico", "QuattrocentoSans", "Quicksand", "Rambla", "Rosario", "Sansation", "Sarabun", "Scada", "Share", "Sitara", "SourceSansPro", "TitilliumWeb", "Volkhov", "Vollkorn"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "font", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RText.prototype, "fontSize", null);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "background", null);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "color", null);
    __decorate([
        Property_1.$Property({ chooseFrom: ["left", "center", "right"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "alignment", null);
    __decorate([
        Property_1.$Property({ chooseFrom: ["underline", "lineThrough", "overline"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "decoration", null);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "decorationColor", null);
    __decorate([
        Property_1.$Property({ chooseFrom: ["dashed", "dotted", "double", "wavy"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "decorationStyle", null);
    __decorate([
        Property_1.$Property({ default: 1 }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RText.prototype, "lineHeight", null);
    RText = __decorate([
        ReportComponent_1.$ReportComponent({ fullPath: "report/Text", icon: "mdi mdi-format-color-text" }),
        Jassi_1.$Class("jassi_report.RText")
        //@$Property({hideBaseClassProperties:true})
        ,
        Property_1.$Property({ name: "value", type: "string", description: "text" }),
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
//# sourceMappingURL=RText.js.map