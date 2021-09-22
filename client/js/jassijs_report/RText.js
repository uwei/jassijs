var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/ReportComponent", "jassijs/ui/HTMLPanel", "jassijs/ui/Property", "jassijs_report/ReportDesign"], function (require, exports, Jassi_1, ReportComponent_1, HTMLPanel_1, Property_1, ReportDesign_1) {
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
            $(this.domWrapper).removeClass("jcontainer");
            $(this.__dom).css("text-overflow", "ellipsis");
            $(this.__dom).css("overflow", "hidden");
            $(this.dom).addClass("designerNoResizable");
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
        Jassi_1.$Class("jassijs_report.RText")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX3JlcG9ydC9SVGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBUUEsTUFBTSxhQUFhO0tBUWxCO0lBT0QsSUFBYSxLQUFLLEdBQWxCLE1BQWEsS0FBTSxTQUFRLGlDQUFlO1FBaUJ0Qzs7Ozs7O1VBTUU7UUFDRixZQUFZLFVBQVUsR0FBRyxTQUFTO1lBQzlCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQXZCZCxZQUFPLEdBQUcsQ0FBQyxtQ0FBbUMsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO1lBRWxHLGVBQVUsR0FBVyxNQUFNLENBQUM7WUFzQnhCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHVGQUF1RixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFHNUMsa0RBQWtEO1lBQ2xELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNwQyxJ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RUFBRSxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQztRQUNoRixjQUFNLENBQUMsc0JBQXNCLENBQUM7UUFDL0IsNENBQTRDOztRQUMzQyxvQkFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQzs7T0FFckQsS0FBSyxDQXFhakI7SUFyYVksc0JBQUs7SUFzYWxCLFNBQWdCLElBQUk7UUFDaEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsS0FBSyxHQUFHLGlwQkFBaXBCLENBQUM7UUFFNXBCLElBQUksR0FBRyxHQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QixpQ0FBaUM7SUFHckMsQ0FBQztJQVJELG9CQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7ICRSZXBvcnRDb21wb25lbnQsIFJlcG9ydENvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SZXBvcnRDb21wb25lbnRcIjtcclxuaW1wb3J0IHsgSFRNTFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvSFRNTFBhbmVsXCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcbmltcG9ydCB7IFJlcG9ydERlc2lnbiB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SZXBvcnREZXNpZ25cIjtcclxuXHJcblxyXG5cclxuY2xhc3MgSW5saW5lU3R5bGluZyB7XHJcbiAgICBib2xkOiBib29sZWFuO1xyXG4gICAgaXRhbGljczogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kOiBzdHJpbmc7XHJcbiAgICB1bmRlcmxpbmU6IGJvb2xlYW47XHJcbiAgICBmb250c2l6ZTogbnVtYmVyO1xyXG4gICAgZm9udDogc3RyaW5nO1xyXG59XHJcblxyXG5AJFJlcG9ydENvbXBvbmVudCh7IGZ1bGxQYXRoOiBcInJlcG9ydC9UZXh0XCIsIGljb246IFwibWRpIG1kaS1mb3JtYXQtY29sb3ItdGV4dFwiIH0pXHJcbkAkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SVGV4dFwiKVxyXG4vL0AkUHJvcGVydHkoe2hpZGVCYXNlQ2xhc3NQcm9wZXJ0aWVzOnRydWV9KVxyXG5AJFByb3BlcnR5KHsgbmFtZTogXCJ2YWx1ZVwiLCB0eXBlOiBcInN0cmluZ1wiLCBkZXNjcmlwdGlvbjogXCJ0ZXh0XCIgfSlcclxuXHJcbmV4cG9ydCBjbGFzcyBSVGV4dCBleHRlbmRzIFJlcG9ydENvbXBvbmVudCB7XHJcbiAgICBwcml2YXRlIF90Y207XHJcbiAgICBwcml2YXRlIHRvb2xiYXIgPSBbJ3VuZG8gcmVkbyB8IGJvbGQgaXRhbGljIHVuZGVybGluZScsICdmb3JlY29sb3IgYmFja2NvbG9yIHwgZm9udHNpemVzZWxlY3QgICddO1xyXG5cclxuICAgIHJlcG9ydHR5cGU6IHN0cmluZyA9IFwidGV4dFwiO1xyXG4gICAgcHJpdmF0ZSBfYm9sZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2RlY29yYXRpb246IHN0cmluZztcclxuICAgIHByaXZhdGUgX2RlY29yYXRpb25TdHlsZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZGVjb3JhdGlvbkNvbG9yOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9jb2xvcjogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZm9udFNpemU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2xpbmVIZWlnaHQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2l0YWxpY3M6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9hbGlnbm1lbnQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2JhY2tncm91bmQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2ZvbnQ6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wZXJ0aWVzIC0gcHJvcGVydGllcyB0byBpbml0XHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcHJvcGVydGllcy5pZF0gLSAgY29ubmVjdCB0byBleGlzdGluZyBpZCAobm90IHJlcWlyZWQpXHJcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BlcnRpZXMudXNlU3Bhbl0gLSAgdXNlIHNwYW4gbm90IGRpdlxyXG4gICAgKiBcclxuICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzID0gdW5kZWZpbmVkKSB7Ly9pZCBjb25uZWN0IHRvIGV4aXN0aW5nKG5vdCByZXFpcmVkKVxyXG4gICAgICAgIHN1cGVyKHByb3BlcnRpZXMpO1xyXG4gICAgICAgIHN1cGVyLmluaXQoJCgnPGRpdiBjbGFzcz1cIlJUZXh0IGpkaXNhYmxlYWRkY29tcG9uZW50c1wiID48ZGl2ICBjbGFzcz1cIkhUTUxQYW5lbENvbnRlbnRcIj48L2Rpdj48L2Rpdj4nKVswXSk7XHJcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLnJlbW92ZUNsYXNzKFwiamNvbnRhaW5lclwiKTtcclxuICAgICAgICAkKHRoaXMuX19kb20pLmNzcyhcInRleHQtb3ZlcmZsb3dcIiwgXCJlbGxpcHNpc1wiKTtcclxuICAgICAgICAkKHRoaXMuX19kb20pLmNzcyhcIm92ZXJmbG93XCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQodGhpcy5kb20pLmFkZENsYXNzKFwiZGVzaWduZXJOb1Jlc2l6YWJsZVwiKTtcclxuICAgICAgIFxyXG4gICAgXHJcbiAgICAgICAgLy8gIHN1cGVyLmluaXQoJCgnPGRpdiBjbGFzcz1cIlJUZXh0XCI+PC9kaXY+JylbMF0pO1xyXG4gICAgICAgIHZhciBlbCA9IHRoaXMuZG9tLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnbk1vZGUgPSBmYWxzZTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgdGhpcy5jc3MoeyBmb250X2ZhbWlseTogXCJSb2JvdG9cIiwgZm9udF9zaXplOiBcIjEycHhcIiB9KVxyXG4gICAgICAgIC8vICAgJCh0aGlzLmRvbS5jaGlsZHJlblswXSkuY3NzKFwiZGlzcGxheVwiLFwiaW5saW5lLWJsb2NrXCIpO1xyXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ2FsbGVkID0gSFRNTFBhbmVsLnByb3RvdHlwZS5leHRlbnNpb25DYWxsZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9zZXREZXNpZ25Nb2RlID0gSFRNTFBhbmVsLnByb3RvdHlwZS5fc2V0RGVzaWduTW9kZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIEAkUHJvcGVydHkoe1xyXG4gICAgICAgIGNob29zZUZyb206IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlcG9ydERlc2lnbi5nZXRWYXJpYWJsZXMoY29tcG9uZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5kb20uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgaWYgKGVsID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhciByZXQgPSAkKGVsKS5odG1sKCk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIHNldCB2YWx1ZShjb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWw6IGFueSA9IHRoaXMuZG9tLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIGlmIChlbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY29kZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgJChlbCkuaHRtbChjb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBAJFByb3BlcnR5KClcclxuICAgIGdldCBib2xkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xyXG4gICAgfVxyXG4gICAgc2V0IGJvbGQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9ib2xkID0gdmFsdWU7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZm9udC13ZWlnaHRcIiwgdmFsdWUgPyBcImJvbGRcIiA6IFwibm9ybWFsXCIpO1xyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSgpXHJcbiAgICBnZXQgaXRhbGljcygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXRhbGljcztcclxuICAgIH1cclxuICAgIHNldCBpdGFsaWNzKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXRhbGljcyA9IHZhbHVlO1xyXG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImZvbnQtc3R5bGVcIiwgdmFsdWUgPyBcIml0YWxpY1wiIDogXCJub3JtYWxcIik7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHtjaG9vc2VGcm9tOltcIkFsZWdyZXlhXCIsICAgIFwiQWxlZ3JleWFTYW5zXCIsICAgIFwiQWxlZ3JleWFTYW5zU0NcIiwgICAgXCJBbGVncmV5YVNDXCIsICAgIFwiQWxtZW5kcmFTQ1wiLCAgICBcIkFtYXJhbnRoXCIsICAgIFwiQW5kYWRhXCIsICAgIFwiQW5kYWRhU0NcIiwgICAgXCJBbm9ueW1vdXNQcm9cIiwgICAgXCJBcmNoaXZvTmFycm93XCIsICAgIFwiQXJ2b1wiLCAgICBcIkFzYXBcIiwgICAgXCJBdmVyaWFMaWJyZVwiLCAgICBcIkF2ZXJpYVNhbnNMaWJyZVwiLCAgICBcIkF2ZXJpYVNlcmlmTGlicmVcIiwgICAgXCJDYW1iYXlcIiwgICAgXCJDYXVkZXhcIiwgICAgXCJDcmltc29uVGV4dFwiLCAgICBcIkN1cHJ1bVwiLCAgICBcIkVjb25vbWljYVwiLCAgICBcIkV4bzJcIiwgICAgXCJFeG9cIiwgICAgXCJFeHBsZXR1c1NhbnNcIiwgICAgXCJGaXJhU2Fuc1wiLCAgICBcIkpvc2VmaW5TYW5zXCIsICAgIFwiSm9zZWZpblNsYWJcIiwgICAgXCJLYXJsYVwiLCAgICBcIkxhdG9cIiwgICAgXCJMb2JzdGVyVHdvXCIsICAgIFwiTG9yYVwiLCAgICBcIk1hcnZlbFwiLCAgICBcIk1lcnJpd2VhdGhlclwiLCAgICBcIk1lcnJpd2VhdGhlclNhbnNcIiwgICAgXCJOb2JpbGVcIiwgICAgXCJOb3RpY2lhVGV4dFwiLCAgICBcIk92ZXJsb2NrXCIsICAgIFwiUGhpbG9zb3BoZXJcIiwgICAgXCJQbGF5ZmFpckRpc3BsYXlcIiwgICAgXCJQbGF5ZmFpckRpc3BsYXlTQ1wiLCAgICBcIlBUX1NlcmlmLVdlYlwiLCAgICBcIlB1cml0YW5cIiwgICAgXCJRdWFudGljb1wiLCAgICBcIlF1YXR0cm9jZW50b1NhbnNcIiwgICAgXCJRdWlja3NhbmRcIiwgICAgXCJSYW1ibGFcIiwgICAgXCJSb3NhcmlvXCIsICAgIFwiU2Fuc2F0aW9uXCIsICAgIFwiU2FyYWJ1blwiLCAgICBcIlNjYWRhXCIsICAgIFwiU2hhcmVcIiwgICAgXCJTaXRhcmFcIiwgICAgXCJTb3VyY2VTYW5zUHJvXCIsICAgIFwiVGl0aWxsaXVtV2ViXCIsICAgIFwiVm9sa2hvdlwiLCAgICBcIlZvbGxrb3JuXCJdfSlcclxuICAgIGdldCBmb250KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnQ7XHJcbiAgICB9XHJcbiAgICBzZXQgZm9udCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fZm9udD12YWx1ZTtcclxuICAgICAgICAvL2NvcHkgZnJvbSBDU1NQcm9wZXJ0aWVzXHJcbiAgICAgICAgdmFyIGFwaSA9ICdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9JztcclxuICAgICAgICB2YXIgc2ZvbnQgPSB2YWx1ZS5yZXBsYWNlQWxsKFwiIFwiLCBcIitcIilcclxuICAgICAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiLS0+XCIgKyBhcGkgKyBzZm9udCkpIHsvL1wiLS0+aHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PUFjbG9uaWNhXCI+XHJcbiAgICAgICAgICAgIGphc3NpanMubXlSZXF1aXJlKGFwaSArIHNmb250KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJmb250X2ZhbWlseVwiLCBcIlwiKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICQodGhpcy5kb20pLmNzcyhcImZvbnRfZmFtaWx5XCIsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIEAkUHJvcGVydHkoKVxyXG4gICAgZ2V0IGZvbnRTaXplKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xyXG4gICAgfVxyXG4gICAgc2V0IGZvbnRTaXplKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mb250U2l6ZT12YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZm9udC1zaXplXCIsIFwiXCIpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZm9udC1zaXplXCIsIHZhbHVlICsgXCJweFwiKTtcclxuICAgIH1cclxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImNvbG9yXCIgfSlcclxuICAgIGdldCBiYWNrZ3JvdW5kKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XHJcbiAgICB9XHJcbiAgICBzZXQgYmFja2dyb3VuZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fYmFja2dyb3VuZCA9IHZhbHVlO1xyXG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwiY29sb3JcIiB9KVxyXG4gICAgZ2V0IGNvbG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xyXG4gICAgfVxyXG4gICAgc2V0IGNvbG9yKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImNvbG9yXCIsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIEAkUHJvcGVydHkoeyBjaG9vc2VGcm9tOiBbXCJsZWZ0XCIsIFwiY2VudGVyXCIsIFwicmlnaHRcIl0gfSlcclxuICAgIGdldCBhbGlnbm1lbnQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWxpZ25tZW50O1xyXG4gICAgfVxyXG4gICAgc2V0IGFsaWdubWVudCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fYWxpZ25tZW50ID0gdmFsdWU7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwidGV4dC1hbGlnblwiLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1widW5kZXJsaW5lXCIsIFwibGluZVRocm91Z2hcIiwgXCJvdmVybGluZVwiXSB9KVxyXG4gICAgZ2V0IGRlY29yYXRpb24oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGVjb3JhdGlvbjtcclxuICAgIH1cclxuICAgIHNldCBkZWNvcmF0aW9uKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9kZWNvcmF0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgdmFyIHZhbCA9IFwibm9uZVwiO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJ1bmRlcmxpbmVcIilcclxuICAgICAgICAgICAgdmFsID0gXCJ1bmRlcmxpbmVcIjtcclxuICAgICAgICBpZiAodmFsdWUgPT09IFwibGluZVRocm91Z2hcIilcclxuICAgICAgICAgICAgdmFsID0gXCJsaW5lLXRocm91Z2hcIjtcclxuICAgICAgICBpZiAodmFsdWUgPT09IFwib3ZlcmxpbmVcIilcclxuICAgICAgICAgICAgdmFsID0gXCJvdmVybGluZVwiO1xyXG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcInRleHQtZGVjb3JhdGlvblwiLCB2YWwpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJjb2xvclwiIH0pXHJcbiAgICBnZXQgZGVjb3JhdGlvbkNvbG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlY29yYXRpb25Db2xvcjtcclxuICAgIH1cclxuICAgIHNldCBkZWNvcmF0aW9uQ29sb3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2RlY29yYXRpb25Db2xvciA9IHZhbHVlO1xyXG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcInRleHREZWNvcmF0aW9uQ29sb3JcIiwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSh7IGNob29zZUZyb206IFtcImRhc2hlZFwiLCBcImRvdHRlZFwiLCBcImRvdWJsZVwiLCBcIndhdnlcIl0gfSlcclxuICAgIGdldCBkZWNvcmF0aW9uU3R5bGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGVjb3JhdGlvblN0eWxlO1xyXG4gICAgfVxyXG4gICAgc2V0IGRlY29yYXRpb25TdHlsZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fZGVjb3JhdGlvblN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgdmFyIHZhbCA9IFwic29saWRcIjtcclxuICAgICAgICBpZiAodmFsdWUgPT09IFwiZGFzaGVkXCIpXHJcbiAgICAgICAgICAgIHZhbCA9IFwiZGFzaGVkXCI7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBcImRvdHRlZFwiKVxyXG4gICAgICAgICAgICB2YWwgPSBcImRvdHRlZFwiO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJkb3VibGVcIilcclxuICAgICAgICAgICAgdmFsID0gXCJkb3VibGVcIjtcclxuICAgICAgICBpZiAodmFsdWUgPT09IFwid2F2eVwiKVxyXG4gICAgICAgICAgICB2YWwgPSBcIndhdnlcIjtcclxuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJ0ZXh0RGVjb3JhdGlvblN0eWxlXCIsIHZhbCk7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogMSB9KVxyXG4gICAgZ2V0IGxpbmVIZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGluZUhlaWdodDtcclxuICAgIH1cclxuICAgIHNldCBsaW5lSGVpZ2h0KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9saW5lSGVpZ2h0ID0gdmFsdWU7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwibGluZS1oZWlnaHRcIiwgdmFsdWUpO1xyXG4gICAgICAgIC8vICBzdXBlci53aWR0aCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qQCRQcm9wZXJ0eSgpXHJcbiAgICBnZXQgdGV4dCgpOnN0cmluZ3tcclxuICAgICAgICAvL2NoZWNrIGZvciBodG1sY29kZVxyXG4gICAgXHRcclxuICAgICAgICByZXR1cm4gc3VwZXIudmFsdWU7XHJcbiAgICB9XHJcbiAgICBzZXQgdGV4dCh2YWw6c3RyaW5nKXtcclxuICAgICAgICBpZih2YWwhPT11bmRlZmluZWQmJnZhbCE9PVwiXCIpe1xyXG4gICAgICAgICAgICB2YXIgaD1cIjxzcGFuPmhhbGxvPGI+ZHU8L2I+PC9zcGFuPlwiO1xyXG4gICAgICAgICAgICB2YXIgbm9kZT0kKFwiPHNwYW4+XCIrdmFsK1wiPC9zcGFuPlwiKTtcclxuICAgICAgICAgICAgaWYobm9kZVswXS5pbm5lclRleHQhPT1ub2RlWzBdLmlubmVySFRNTCl7XHJcbiAgICAgICAgICAgIFx0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIudmFsdWU9dmFsO1xyXG4gICAgfSovXHJcbiAgICBmcm9tSlNPTihvYjogYW55KTogUlRleHQge1xyXG4gICAgICAgIHZhciByZXQgPSB0aGlzO1xyXG4gICAgICAgIGlmIChvYi5lZGl0VG9nZXRoZXIpIHtcclxuICAgICAgICAgICAgZGVsZXRlIG9iLmVkaXRUb2dldGhlcjtcclxuICAgICAgICAgICAgcmV0LmNvbnZlcnRUb0hUTUwob2IudGV4dCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHJldC52YWx1ZSA9IDxzdHJpbmc+b2IudGV4dDtcclxuICAgICAgICBkZWxldGUgb2IudGV4dDtcclxuICAgICAgICBpZiAob2Iud2lkdGgpIHtcclxuICAgICAgICAgICAgcmV0LndpZHRoID0gb2Iud2lkdGg7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBvYi53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iLmJvbGQpIHtcclxuICAgICAgICAgICAgcmV0LmJvbGQgPSBvYi5ib2xkO1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuYm9sZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iLml0YWxpY3MpIHtcclxuICAgICAgICAgICAgcmV0Lml0YWxpY3MgPSBvYi5pdGFsaWNzO1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuaXRhbGljcztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iLmNvbG9yKSB7XHJcbiAgICAgICAgICAgIHJldC5jb2xvciA9IG9iLmNvbG9yO1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuY29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYi5kZWNvcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldC5kZWNvcmF0aW9uID0gb2IuZGVjb3JhdGlvbjtcclxuICAgICAgICAgICAgZGVsZXRlIG9iLmRlY29yYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYi5kZWNvcmF0aW9uU3R5bGUpIHtcclxuICAgICAgICAgICAgcmV0LmRlY29yYXRpb25TdHlsZSA9IG9iLmRlY29yYXRpb25TdHlsZTtcclxuICAgICAgICAgICAgZGVsZXRlIG9iLmRlY29yYXRpb25TdHlsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iLmRlY29yYXRpb25Db2xvcikge1xyXG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvbkNvbG9yID0gb2IuZGVjb3JhdGlvbkNvbG9yO1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuZGVjb3JhdGlvbkNvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2IuZm9udFNpemUpIHtcclxuICAgICAgICAgICAgcmV0LmZvbnRTaXplID0gb2IuZm9udFNpemU7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iLmZvbnQpIHtcclxuICAgICAgICAgICAgcmV0LmZvbnQgPSBvYi5mb250O1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuZm9udDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iLmxpbmVIZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0LmxpbmVIZWlnaHQgPSBvYi5saW5lSGVpZ2h0O1xyXG4gICAgICAgICAgICBkZWxldGUgb2IubGluZUhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iLmFsaWdubWVudCkge1xyXG4gICAgICAgICAgICByZXQuYWxpZ25tZW50ID0gb2IuYWxpZ25tZW50O1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuYWxpZ25tZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2IuYmFja2dyb3VuZCkge1xyXG4gICAgICAgICAgICByZXQuYmFja2dyb3VuZCA9IG9iLmJhY2tncm91bmQ7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5iYWNrZ3JvdW5kO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5mcm9tSlNPTihvYik7XHJcbiAgICAgICAgLy8gcmV0Lm90aGVyUHJvcGVydGllcyA9IG9iO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0RnJvbUhUTUxOb2RlKG5vZGU6IENoaWxkTm9kZSwgbGlzdDogYW55W10sIHN0eWxlOiBJbmxpbmVTdHlsaW5nKTogYW55IHtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkTm9kZXNbeF07XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gXCIjdGV4dFwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnQ6IGFueSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLmJvbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgcnQuYm9sZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuYmFja2dyb3VuZClcclxuICAgICAgICAgICAgICAgICAgICBydC5iYWNrZ3JvdW5kID0gc3R5bGUuYmFja2dyb3VuZDtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5jb2xvcilcclxuICAgICAgICAgICAgICAgICAgICBydC5jb2xvciA9IHN0eWxlLmNvbG9yO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLmZvbnRzaXplKVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0LmZvbnRTaXplID0gc3R5bGUuZm9udHNpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuZm9udClcclxuICAgICAgICAgICAgICAgICAgICBydC5mb250ID0gc3R5bGUuZm9udDtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS51bmRlcmxpbmUpXHJcbiAgICAgICAgICAgICAgICAgICAgcnQuZGVjb3JhdGlvbiA9IFwidW5kZXJsaW5lXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuaXRhbGljcylcclxuICAgICAgICAgICAgICAgICAgICBydC5pdGFsaWNzID0gc3R5bGUuaXRhbGljcztcclxuICAgICAgICAgICAgICAgIHJ0LnRleHQgPSBjaGlsZFtcImRhdGFcIl07XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gocnQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIlNUUk9OR1wiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS5ib2xkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLmJvbGQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiRU1cIikge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUuaXRhbGljcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRGcm9tSFRNTE5vZGUoY2hpbGQsIGxpc3QsIHN0eWxlKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdHlsZS5pdGFsaWNzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gXCJTUEFOXCIgJiYgY2hpbGRbXCJzdHlsZVwiXS5jb2xvciAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUuY29sb3IgPSB0aGlzLmZ1bGxDb2xvckhleChjaGlsZFtcInN0eWxlXCJdLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLmNvbG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIlNQQU5cIiAmJiBjaGlsZFtcInN0eWxlXCJdW1wiYmFja2dyb3VuZC1jb2xvclwiXSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMuZnVsbENvbG9ySGV4KGNoaWxkW1wic3R5bGVcIl1bXCJiYWNrZ3JvdW5kLWNvbG9yXCJdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLmJhY2tncm91bmQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiU1BBTlwiICYmIGNoaWxkW1wic3R5bGVcIl1bXCJmb250LXNpemVcIl0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlLmZvbnRzaXplID0gTnVtYmVyKGNoaWxkW1wic3R5bGVcIl1bXCJmb250LXNpemVcIl0ucmVwbGFjZShcInB0XCIsIFwiXCIpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLmZvbnRzaXplO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIlNQQU5cIiAmJiBjaGlsZFtcInN0eWxlXCJdW1widGV4dC1kZWNvcmF0aW9uXCJdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS51bmRlcmxpbmUgPSAoY2hpbGRbXCJzdHlsZVwiXVtcInRleHQtZGVjb3JhdGlvblwiXSA9PT0gXCJ1bmRlcmxpbmVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRGcm9tSFRNTE5vZGUoY2hpbGQsIGxpc3QsIHN0eWxlKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdHlsZS51bmRlcmxpbmU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZ2JUb0hleChyZ2IpIHtcclxuICAgICAgICB2YXIgaGV4ID0gTnVtYmVyKHJnYikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGlmIChoZXgubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICBoZXggPSBcIjBcIiArIGhleDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhleDtcclxuICAgIH07XHJcbiAgICAvL3JnYigxLDIsMylcclxuICAgIHByaXZhdGUgZnVsbENvbG9ySGV4KHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBjID0gdGV4dC5zcGxpdChcIihcIilbMV0uc3BsaXQoXCIpXCIpWzBdLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICB2YXIgcmVkID0gdGhpcy5yZ2JUb0hleChjWzBdKTtcclxuICAgICAgICB2YXIgZ3JlZW4gPSB0aGlzLnJnYlRvSGV4KGNbMV0pO1xyXG4gICAgICAgIHZhciBibHVlID0gdGhpcy5yZ2JUb0hleChjWzJdKTtcclxuICAgICAgICByZXR1cm4gXCIjXCIgKyByZWQgKyBncmVlbiArIGJsdWU7XHJcbiAgICB9O1xyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9IVE1MKG9iczogYW55W10pIHtcclxuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBvYnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIG9iID0gb2JzW3hdO1xyXG4gICAgICAgICAgICB2YXIgYW56ID0gMDtcclxuICAgICAgICAgICAgdmFyIHRhZ2NvdW50ID0gMDtcclxuICAgICAgICAgICAgaWYgKG9iLmJvbGQpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8c3Ryb25nPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYi5pdGFsaWNzKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPGVtPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYi5iYWNrZ3JvdW5kIHx8IG9iLmNvbG9yIHx8IG9iLmRlY29yYXRpb24gPT09IFwidW5kZXJsaW5lXCIgfHwgb2IuZm9udFNpemUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob2IuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHNwYW4gc3R5bGU9J2NvbG9yOlwiICsgb2IuY29sb3IgKyBcIic+XCI7IHRhZ2NvdW50KytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvYi5iYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxzcGFuIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOlwiICsgb2IuYmFja2dyb3VuZCArIFwiJz5cIjsgdGFnY291bnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iLmRlY29yYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHNwYW4gc3R5bGU9J3RleHQtZGVjb3JhdGlvbjpcIiArIG9iLmRlY29yYXRpb24gKyBcIic+XCI7IHRhZ2NvdW50KytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvYi5mb250U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8c3BhbiBzdHlsZT0nZm9udC1zaXplOlwiICsgb2IuZm9udFNpemUgKyBcInB0Jz5cIjsgdGFnY291bnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaHRtbCArPSBvYi50ZXh0LnJlcGxhY2VBbGwoXCJcXG5cIiwgXCI8YnIvPlwiKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCB0YWdjb3VudDsgdCsrKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYi5pdGFsaWNzKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPC9lbT5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2IuYm9sZCkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBcIjwvc3Ryb25nPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZhbHVlID0gaHRtbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29udmVydEZyb21IVE1MKHJldDogYW55KTogYW55IHtcclxuICAgICAgICB2YXIgc3ZhbCA9IGRlY29kZVVSSSh0aGlzLnZhbHVlKTtcclxuICAgICAgICBzdmFsID0gc3ZhbC5yZXBsYWNlQWxsKFwiPGJyPlwiLCBcIlxcblwiKVxyXG4gICAgICAgIHJldC50ZXh0ID0gc3ZhbC8vLnJlcGxhY2VBbGwoXCI8YnI+XCIsXCJcXFxcblwiKTtcclxuICAgICAgICB2YXIgbm9kZSA9ICQoXCI8c3Bhbj5cIiArIHJldC50ZXh0ICsgXCI8L3NwYW4+XCIpO1xyXG4gICAgICAgIGlmIChub2RlWzBdLmlubmVyVGV4dCAhPT0gbm9kZVswXS5pbm5lckhUTUwpIHsvL2h0bWx0ZXh0XHJcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IG5ldyBJbmxpbmVTdHlsaW5nKCk7XHJcbiAgICAgICAgICAgIHZhciBsaXN0OiBhbnlbXSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRGcm9tSFRNTE5vZGUobm9kZVswXSwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICByZXQuZWRpdFRvZ2V0aGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0LnRleHQgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgdG9KU09OKCkge1xyXG5cclxuICAgICAgICB2YXIgcmV0ID0gc3VwZXIudG9KU09OKCk7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUwocmV0KTtcclxuICAgICAgICBpZiAodGhpcy53aWR0aCAhPT0gdW5kZWZpbmVkICYmICF0aGlzLl9wYXJlbnQ/LnNldENoaWxkV2lkdGgpXHJcbiAgICAgICAgICAgIHJldC53aWR0aCA9IHRoaXMud2lkdGg7XHJcbiAgICAgICAgaWYgKHRoaXMuYm9sZCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXQuYm9sZCA9IHRoaXMuYm9sZDtcclxuICAgICAgICBpZiAodGhpcy5pdGFsaWNzICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldC5pdGFsaWNzID0gdGhpcy5pdGFsaWNzO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbG9yICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldC5jb2xvciA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVjb3JhdGlvbiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvbiA9IHRoaXMuZGVjb3JhdGlvbjtcclxuICAgICAgICBpZiAodGhpcy5kZWNvcmF0aW9uU3R5bGUgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0LmRlY29yYXRpb25TdHlsZSA9IHRoaXMuZGVjb3JhdGlvblN0eWxlO1xyXG4gICAgICAgIGlmICh0aGlzLmRlY29yYXRpb25Db2xvciAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvbkNvbG9yID0gdGhpcy5kZWNvcmF0aW9uQ29sb3I7XHJcbiAgICAgICAgaWYgKHRoaXMuZm9udCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXQuZm9udCA9IHRoaXMuZm9udDtcclxuICAgICAgICBpZiAodGhpcy5mb250U2l6ZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIGlmICh0aGlzLmxpbmVIZWlnaHQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0LmxpbmVIZWlnaHQgPSB0aGlzLmxpbmVIZWlnaHQ7XHJcbiAgICAgICAgaWYgKHRoaXMuYWxpZ25tZW50ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldC5hbGlnbm1lbnQgPSB0aGlzLmFsaWdubWVudDtcclxuICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldC5iYWNrZ3JvdW5kID0gdGhpcy5iYWNrZ3JvdW5kO1xyXG5cclxuICAgICAgICB2YXIgdGVzdD0wO1xyXG4gICAgICAgIGZvcih2YXIga2V5IGluIHJldCl7XHJcbiAgICAgICAgICAgIHRlc3QrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGVzdD09PTEpXHJcbiAgICAgICAgICAgIHJldD1yZXQudGV4dDsvL3Nob3J0IHZlcnNpb25cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciB0ID0gbmV3IFJUZXh0KCk7ICAgXHJcbiAgICB0LnZhbHVlID0gXCJhPGVtPmI8c3Ryb25nPmNkPC9zdHJvbmc+ZTwvZW0+PHNwYW4gc3R5bGU9J2NvbG9yOiByZ2IoMjQxLCAxOTYsIDE1KTsnIGRhdGEtbWNlLXN0eWxlPSdjb2xvcjogI2YxYzQwZjsnPmZnPHNwYW4gc3R5bGU9J2JhY2tncm91bmQtY29sb3I6IHJnYigxODYsIDU1LCA0Mik7JyBkYXRhLW1jZS1zdHlsZT0nYmFja2dyb3VuZC1jb2xvcjogI2JhMzcyYTsnPmg8L3NwYW4+PC9zcGFuPjxzcGFuIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTg2LCA1NSwgNDIpOycgZGF0YS1tY2Utc3R5bGU9J2JhY2tncm91bmQtY29sb3I6ICNiYTM3MmE7Jz5pajxzcGFuIHN0eWxlPSdmb250LXNpemU6IDE0cHQ7JyBkYXRhLW1jZS1zdHlsZT0nZm9udC1zaXplOiAxNHB0Oyc+azwvc3Bhbj48L3NwYW4+PHNwYW4gc3R5bGU9J2ZvbnQtc2l6ZTogMTRwdDsnIGRhdGEtbWNlLXN0eWxlPSdmb250LXNpemU6IDE0cHQ7Jz5sPHNwYW4gc3R5bGU9J3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOycgZGF0YS1tY2Utc3R5bGU9J3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyc+bTwvc3Bhbj48L3NwYW4+PHNwYW4gc3R5bGU9J3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOycgZGF0YS1tY2Utc3R5bGU9J3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyc+bm88L3NwYW4+XCI7XHJcblxyXG4gICAgdmFyIG9iYjogUlRleHQgPSB0LnRvSlNPTigpO1xyXG4gICAgLy92YXIgdGVzdCA9IFJUZXh0LmZyb21KU09OKG9iYik7XHJcblxyXG5cclxufVxyXG4iXX0=