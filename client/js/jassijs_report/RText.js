var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RComponent", "jassijs/ui/HTMLPanel", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs/ui/CSSProperties", "jassijs/util/Tools"], function (require, exports, Jassi_1, RComponent_1, HTMLPanel_1, Property_1, ReportDesign_1, CSSProperties_1, Tools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RText = void 0;
    class InlineStyling {
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
    let RText = class RText extends RComponent_1.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "text";
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.customToolbarButtons = {};
            super.init($('<div class="RText mce-content-body jdisableaddcomponents" tabindex="0" ><div  class="HTMLPanelContent"></div></div>')[0]); //tabindex for key-event
            $(this.domWrapper).removeClass("jcontainer");
            $(this.__dom).css("text-overflow", "ellipsis");
            $(this.__dom).css("overflow", "hidden");
            $(this.dom).addClass("designerNoResizable");
            CSSProperties_1.loadFontIfNedded("Roboto");
            //  super.init($('<div class="RText"></div>')[0]);
            var el = this.dom.children[0];
            this._designMode = false;
            $(this.dom).css("display", "block");
            // this.css({ font_family: "inherit", font_size: "inherit" })
            //   $(this.dom.children[0]).css("display","inline-block");
            this.extensionCalled = HTMLPanel_1.HTMLPanel.prototype.extensionCalled.bind(this);
            this._setDesignMode = HTMLPanel_1.HTMLPanel.prototype._setDesignMode.bind(this);
            this.initIfNeeded = HTMLPanel_1.HTMLPanel.prototype.initIfNeeded.bind(this);
            //@ts-ignore
            this._initTinymce = HTMLPanel_1.HTMLPanel.prototype._initTinymce.bind(this);
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
        set format(value) {
            this._format = value;
        }
        get format() {
            return this._format;
        }
        fromJSON(ob) {
            var ret = this;
            if (ob.editTogether) {
                delete ob.editTogether;
                ret.convertToHTML(ob.text);
            }
            else
                ret.value = ob.text.replaceAll("\n", "<br/>");
            delete ob.text;
            if (ob.format) {
                this.format = ob.format;
                delete ob.format;
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
                    style.fontsize = Number(child["style"]["font-size"].replace("px", ""));
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
                if (list.length > 1) {
                    ret.editTogether = true;
                    ret.text = list;
                }
                else { //only one text found so we transfer the html 
                    ret = list[0];
                    ret.text = node[0].innerText;
                    this.fromJSON(Tools_1.Tools.copyObject(ret));
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
        Property_1.$Property({ type: "string", chooseFrom: allFormats }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "format", null);
    RText = __decorate([
        RComponent_1.$ReportComponent({ fullPath: "report/Text", icon: "mdi mdi-format-color-text" }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX3JlcG9ydC9SVGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBVUEsTUFBTSxhQUFhO0tBUWxCO0lBR0QsMEJBQTBCO0lBQzFCLElBQUksVUFBVSxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ25CLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXZDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEQ7Ozs7Ozs7O2lCQVFTO1FBQ1QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDL0MsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFD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VixHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBLGVBQWU7WUFFbEMsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQ0osQ0FBQTtJQTNMRztRQUxDLG9CQUFTLENBQUM7WUFDUCxVQUFVLEVBQUUsVUFBVSxTQUFTO2dCQUMzQixPQUFPLDJCQUFZLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hELENBQUM7U0FDSixDQUFDOzs7c0NBT0Q7SUFVRDtRQURDLG9CQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsQ0FBQzs7O3VDQUdyRDtJQS9EUSxLQUFLO1FBTGpCLDZCQUFnQixDQUFDLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQztRQUNoRixjQUFNLENBQUMsc0JBQXNCLENBQUM7UUFDL0IsNENBQTRDOztRQUMzQyxvQkFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQzs7T0FFckQsS0FBSyxDQXdPakI7SUF4T1ksc0JBQUs7SUF5T2xCLFNBQWdCLElBQUk7UUFDaEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsS0FBSyxHQUFHLGlwQkFBaXBCLENBQUM7UUFFNXBCLElBQUksR0FBRyxHQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QixpQ0FBaUM7SUFHckMsQ0FBQztJQVJELG9CQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7ICRSZXBvcnRDb21wb25lbnQsIFJDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUkNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBIVE1MUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9IVE1MUGFuZWxcIjtcclxuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcclxuaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xyXG5pbXBvcnQgeyBsb2FkRm9udElmTmVkZGVkIH0gZnJvbSBcImphc3NpanMvdWkvQ1NTUHJvcGVydGllc1wiO1xyXG5pbXBvcnQgeyBUb29scyB9IGZyb20gXCJqYXNzaWpzL3V0aWwvVG9vbHNcIjtcclxuXHJcblxyXG5cclxuY2xhc3MgSW5saW5lU3R5bGluZyB7XHJcbiAgICBib2xkOiBib29sZWFuO1xyXG4gICAgaXRhbGljczogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kOiBzdHJpbmc7XHJcbiAgICB1bmRlcmxpbmU6IGJvb2xlYW47XHJcbiAgICBmb250c2l6ZTogbnVtYmVyO1xyXG4gICAgZm9udDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLy9jYWxjIHRoZSBkZWZhdWx0IEZvcm1hdHNcclxubGV0IGFsbEZvcm1hdHMgPSAoKCkgPT4ge1xyXG4gICAgdmFyIHJldCA9IFtdO1xyXG4gICAgY29uc3QgZm9ybWF0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCk7XHJcblxyXG4gICAgdmFyIGRlY2ltYWwgPSBmb3JtYXQuZm9ybWF0KDEuMSkuc3Vic3RyaW5nKDEsIDIpO1xyXG4gICAgdmFyIGdyb3VwID0gZm9ybWF0LmZvcm1hdCgxMjM0KS5zdWJzdHJpbmcoMSwgMik7XHJcbiAgICAvKlx0Y29uc3QgcGFydHMgPSBmb3JtYXQuZm9ybWF0VG9QYXJ0cygxMjM0LjYpO1xyXG4gICAgICAgICAgICB2YXIgZGVjaW1hbCA9IFwiLlwiO1xyXG4gICAgICAgIHZhciBncm91cD1cIixcIjtcclxuICAgICAgICBwYXJ0cy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgICAgICAgICBpZiAocC50eXBlID09PSBcImRlY2ltYWxcIilcclxuICAgICAgICAgICAgICAgIGRlY2ltYWwgPSBwLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAocC50eXBlID09PSBcImdyb3VwXCIpXHJcbiAgICAgICAgICAgICAgICBncm91cCA9IHAudmFsdWU7XHJcbiAgICAgICAgfSk7Ki9cclxuICAgIHJldC5wdXNoKFwiI1wiICsgZ3JvdXAgKyBcIiMjMFwiICsgZGVjaW1hbCArIFwiMDBcIik7XHJcbiAgICByZXQucHVzaChcIiNcIiArIGdyb3VwICsgXCIjIzBcIiArIGRlY2ltYWwgKyBcIjAwIOKCrFwiKTtcclxuICAgIHJldC5wdXNoKFwiI1wiICsgZ3JvdXAgKyBcIiMjMFwiICsgZGVjaW1hbCArIFwiMDAgJFwiKTtcclxuICAgIHJldC5wdXNoKFwiJCMsIyMjLjAwXCIpO1xyXG4gICAgcmV0LnB1c2goXCIwXCIpO1xyXG4gICAgcmV0LnB1c2goXCIwXCIgKyBkZWNpbWFsICsgXCIwMFwiKTtcclxuICAgIHJldC5wdXNoKFwiTU0vREQvWVlZWVwiKTtcclxuICAgIHJldC5wdXNoKFwiREQuTU0uWVlZWVwiKTtcclxuICAgIHJldC5wdXNoKFwiREQvTU0vWVlZWSBoaDptbTpzc1wiKTtcclxuICAgIHJldC5wdXNoKFwiREQuTU0uWVlZWSBoaDptbTpzc1wiKTtcclxuICAgIHJldC5wdXNoKFwiaGg6bW06c3NcIik7XHJcbiAgICByZXQucHVzaChcImg6bW06c3MgQVwiKTtcclxuICAgIHJldHVybiByZXQ7XHJcbn0pKCk7XHJcblxyXG5cclxuQCRSZXBvcnRDb21wb25lbnQoeyBmdWxsUGF0aDogXCJyZXBvcnQvVGV4dFwiLCBpY29uOiBcIm1kaSBtZGktZm9ybWF0LWNvbG9yLXRleHRcIiB9KVxyXG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQuUlRleHRcIilcclxuLy9AJFByb3BlcnR5KHtoaWRlQmFzZUNsYXNzUHJvcGVydGllczp0cnVlfSlcclxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwidmFsdWVcIiwgdHlwZTogXCJzdHJpbmdcIiwgZGVzY3JpcHRpb246IFwidGV4dFwiIH0pXHJcblxyXG5leHBvcnQgY2xhc3MgUlRleHQgZXh0ZW5kcyBSQ29tcG9uZW50IHtcclxuICAgIHJlcG9ydHR5cGU6IHN0cmluZyA9IFwidGV4dFwiO1xyXG4gICAgaW5pdElmTmVlZGVkO1xyXG4gICAgdG9vbGJhciA9IFsnYm9sZCBpdGFsaWMgdW5kZXJsaW5lIGZvcmVjb2xvciBiYWNrY29sb3IgZm9udHNpemVzZWxlY3QnXTtcclxuICAgIGN1c3RvbVRvb2xiYXJCdXR0b25zOiB7XHJcbiAgICAgICAgW25hbWU6IHN0cmluZ106IHtcclxuICAgICAgICAgICAgdGl0bGU6IHN0cmluZyxcclxuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XHJcbiAgICAgICAgfVxyXG4gICAgfSA9IHt9O1xyXG4gICAgX2Zvcm1hdDogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcGVydGllcyAtIHByb3BlcnRpZXMgdG8gaW5pdFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW3Byb3BlcnRpZXMuaWRdIC0gIGNvbm5lY3QgdG8gZXhpc3RpbmcgaWQgKG5vdCByZXFpcmVkKVxyXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wZXJ0aWVzLnVzZVNwYW5dIC0gIHVzZSBzcGFuIG5vdCBkaXZcclxuICAgICogXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcyA9IHVuZGVmaW5lZCkgey8vaWQgY29ubmVjdCB0byBleGlzdGluZyhub3QgcmVxaXJlZClcclxuICAgICAgICBzdXBlcihwcm9wZXJ0aWVzKTtcclxuICAgICAgICBzdXBlci5pbml0KCQoJzxkaXYgY2xhc3M9XCJSVGV4dCBtY2UtY29udGVudC1ib2R5IGpkaXNhYmxlYWRkY29tcG9uZW50c1wiIHRhYmluZGV4PVwiMFwiID48ZGl2ICBjbGFzcz1cIkhUTUxQYW5lbENvbnRlbnRcIj48L2Rpdj48L2Rpdj4nKVswXSk7Ly90YWJpbmRleCBmb3Iga2V5LWV2ZW50XHJcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLnJlbW92ZUNsYXNzKFwiamNvbnRhaW5lclwiKTtcclxuICAgICAgICAkKHRoaXMuX19kb20pLmNzcyhcInRleHQtb3ZlcmZsb3dcIiwgXCJlbGxpcHNpc1wiKTtcclxuICAgICAgICAkKHRoaXMuX19kb20pLmNzcyhcIm92ZXJmbG93XCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQodGhpcy5kb20pLmFkZENsYXNzKFwiZGVzaWduZXJOb1Jlc2l6YWJsZVwiKTtcclxuXHJcbiAgICAgICAgbG9hZEZvbnRJZk5lZGRlZChcIlJvYm90b1wiKTtcclxuICAgICAgICAvLyAgc3VwZXIuaW5pdCgkKCc8ZGl2IGNsYXNzPVwiUlRleHRcIj48L2Rpdj4nKVswXSk7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5kb20uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdGhpcy5fZGVzaWduTW9kZSA9IGZhbHNlO1xyXG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcclxuICAgICAgICAvLyB0aGlzLmNzcyh7IGZvbnRfZmFtaWx5OiBcImluaGVyaXRcIiwgZm9udF9zaXplOiBcImluaGVyaXRcIiB9KVxyXG4gICAgICAgIC8vICAgJCh0aGlzLmRvbS5jaGlsZHJlblswXSkuY3NzKFwiZGlzcGxheVwiLFwiaW5saW5lLWJsb2NrXCIpO1xyXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ2FsbGVkID0gSFRNTFBhbmVsLnByb3RvdHlwZS5leHRlbnNpb25DYWxsZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9zZXREZXNpZ25Nb2RlID0gSFRNTFBhbmVsLnByb3RvdHlwZS5fc2V0RGVzaWduTW9kZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaW5pdElmTmVlZGVkID0gSFRNTFBhbmVsLnByb3RvdHlwZS5pbml0SWZOZWVkZWQuYmluZCh0aGlzKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLl9pbml0VGlueW1jZSA9IEhUTUxQYW5lbC5wcm90b3R5cGUuX2luaXRUaW55bWNlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgQCRQcm9wZXJ0eSh7XHJcbiAgICAgICAgY2hvb3NlRnJvbTogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVwb3J0RGVzaWduLmdldFZhcmlhYmxlcyhjb21wb25lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgZWwgPSB0aGlzLmRvbS5jaGlsZHJlblswXTtcclxuICAgICAgICBpZiAoZWwgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFyIHJldCA9ICQoZWwpLmh0bWwoKTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgc2V0IHZhbHVlKGNvZGU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBlbDogYW55ID0gdGhpcy5kb20uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgaWYgKGVsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAkKGVsKS5odG1sKGNvZGUpO1xyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIsIGNob29zZUZyb206IGFsbEZvcm1hdHMgfSlcclxuICAgIHNldCBmb3JtYXQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2Zvcm1hdCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZ2V0IGZvcm1hdCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZyb21KU09OKG9iOiBhbnkpOiBSVGV4dCB7XHJcbiAgICAgICAgdmFyIHJldCA9IHRoaXM7XHJcbiAgICAgICAgaWYgKG9iLmVkaXRUb2dldGhlcikge1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuZWRpdFRvZ2V0aGVyO1xyXG4gICAgICAgICAgICByZXQuY29udmVydFRvSFRNTChvYi50ZXh0KTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgcmV0LnZhbHVlID0gPHN0cmluZz5vYi50ZXh0LnJlcGxhY2VBbGwoXCJcXG5cIiwgXCI8YnIvPlwiKTtcclxuICAgICAgICBkZWxldGUgb2IudGV4dDtcclxuICAgICAgICBpZiAob2IuZm9ybWF0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gb2IuZm9ybWF0O1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuZm9ybWF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5mcm9tSlNPTihvYik7XHJcbiAgICAgICAgLy8gcmV0Lm90aGVyUHJvcGVydGllcyA9IG9iO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0RnJvbUhUTUxOb2RlKG5vZGU6IENoaWxkTm9kZSwgbGlzdDogYW55W10sIHN0eWxlOiBJbmxpbmVTdHlsaW5nKTogYW55IHtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkTm9kZXNbeF07XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gXCIjdGV4dFwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnQ6IGFueSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLmJvbGQpXHJcbiAgICAgICAgICAgICAgICAgICAgcnQuYm9sZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuYmFja2dyb3VuZClcclxuICAgICAgICAgICAgICAgICAgICBydC5iYWNrZ3JvdW5kID0gc3R5bGUuYmFja2dyb3VuZDtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5jb2xvcilcclxuICAgICAgICAgICAgICAgICAgICBydC5jb2xvciA9IHN0eWxlLmNvbG9yO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLmZvbnRzaXplKVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0LmZvbnRTaXplID0gc3R5bGUuZm9udHNpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuZm9udClcclxuICAgICAgICAgICAgICAgICAgICBydC5mb250ID0gc3R5bGUuZm9udDtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS51bmRlcmxpbmUpXHJcbiAgICAgICAgICAgICAgICAgICAgcnQuZGVjb3JhdGlvbiA9IFwidW5kZXJsaW5lXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuaXRhbGljcylcclxuICAgICAgICAgICAgICAgICAgICBydC5pdGFsaWNzID0gc3R5bGUuaXRhbGljcztcclxuICAgICAgICAgICAgICAgIHJ0LnRleHQgPSBjaGlsZFtcImRhdGFcIl07XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gocnQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIlNUUk9OR1wiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS5ib2xkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLmJvbGQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiRU1cIikge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUuaXRhbGljcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRGcm9tSFRNTE5vZGUoY2hpbGQsIGxpc3QsIHN0eWxlKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdHlsZS5pdGFsaWNzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gXCJTUEFOXCIgJiYgY2hpbGRbXCJzdHlsZVwiXS5jb2xvciAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUuY29sb3IgPSB0aGlzLmZ1bGxDb2xvckhleChjaGlsZFtcInN0eWxlXCJdLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLmNvbG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIlNQQU5cIiAmJiBjaGlsZFtcInN0eWxlXCJdW1wiYmFja2dyb3VuZC1jb2xvclwiXSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMuZnVsbENvbG9ySGV4KGNoaWxkW1wic3R5bGVcIl1bXCJiYWNrZ3JvdW5kLWNvbG9yXCJdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLmJhY2tncm91bmQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiU1BBTlwiICYmIGNoaWxkW1wic3R5bGVcIl1bXCJmb250LXNpemVcIl0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlLmZvbnRzaXplID0gTnVtYmVyKGNoaWxkW1wic3R5bGVcIl1bXCJmb250LXNpemVcIl0ucmVwbGFjZShcInB4XCIsIFwiXCIpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLmZvbnRzaXplO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIlNQQU5cIiAmJiBjaGlsZFtcInN0eWxlXCJdW1widGV4dC1kZWNvcmF0aW9uXCJdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS51bmRlcmxpbmUgPSAoY2hpbGRbXCJzdHlsZVwiXVtcInRleHQtZGVjb3JhdGlvblwiXSA9PT0gXCJ1bmRlcmxpbmVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnZlcnRGcm9tSFRNTE5vZGUoY2hpbGQsIGxpc3QsIHN0eWxlKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdHlsZS51bmRlcmxpbmU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZ2JUb0hleChyZ2IpIHtcclxuICAgICAgICB2YXIgaGV4ID0gTnVtYmVyKHJnYikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGlmIChoZXgubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICBoZXggPSBcIjBcIiArIGhleDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhleDtcclxuICAgIH07XHJcbiAgICAvL3JnYigxLDIsMylcclxuICAgIHByaXZhdGUgZnVsbENvbG9ySGV4KHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBjID0gdGV4dC5zcGxpdChcIihcIilbMV0uc3BsaXQoXCIpXCIpWzBdLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICB2YXIgcmVkID0gdGhpcy5yZ2JUb0hleChjWzBdKTtcclxuICAgICAgICB2YXIgZ3JlZW4gPSB0aGlzLnJnYlRvSGV4KGNbMV0pO1xyXG4gICAgICAgIHZhciBibHVlID0gdGhpcy5yZ2JUb0hleChjWzJdKTtcclxuICAgICAgICByZXR1cm4gXCIjXCIgKyByZWQgKyBncmVlbiArIGJsdWU7XHJcbiAgICB9O1xyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9IVE1MKG9iczogYW55W10pIHtcclxuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBvYnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIG9iID0gb2JzW3hdO1xyXG4gICAgICAgICAgICB2YXIgYW56ID0gMDtcclxuICAgICAgICAgICAgdmFyIHRhZ2NvdW50ID0gMDtcclxuICAgICAgICAgICAgaWYgKG9iLmJvbGQpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8c3Ryb25nPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYi5pdGFsaWNzKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPGVtPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYi5iYWNrZ3JvdW5kIHx8IG9iLmNvbG9yIHx8IG9iLmRlY29yYXRpb24gPT09IFwidW5kZXJsaW5lXCIgfHwgb2IuZm9udFNpemUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob2IuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHNwYW4gc3R5bGU9J2NvbG9yOlwiICsgb2IuY29sb3IgKyBcIic+XCI7IHRhZ2NvdW50KytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvYi5iYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxzcGFuIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOlwiICsgb2IuYmFja2dyb3VuZCArIFwiJz5cIjsgdGFnY291bnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iLmRlY29yYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHNwYW4gc3R5bGU9J3RleHQtZGVjb3JhdGlvbjpcIiArIG9iLmRlY29yYXRpb24gKyBcIic+XCI7IHRhZ2NvdW50KytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvYi5mb250U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8c3BhbiBzdHlsZT0nZm9udC1zaXplOlwiICsgb2IuZm9udFNpemUgKyBcInB0Jz5cIjsgdGFnY291bnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaHRtbCArPSBvYi50ZXh0LnJlcGxhY2VBbGwoXCJcXG5cIiwgXCI8YnIvPlwiKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCB0YWdjb3VudDsgdCsrKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYi5pdGFsaWNzKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPC9lbT5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2IuYm9sZCkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBcIjwvc3Ryb25nPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZhbHVlID0gaHRtbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29udmVydEZyb21IVE1MKHJldDogYW55KTogYW55IHtcclxuICAgICAgICB2YXIgc3ZhbCA9IGRlY29kZVVSSSh0aGlzLnZhbHVlKTtcclxuICAgICAgICBzdmFsID0gc3ZhbC5yZXBsYWNlQWxsKFwiPGJyPlwiLCBcIlxcblwiKVxyXG4gICAgICAgIHJldC50ZXh0ID0gc3ZhbC8vLnJlcGxhY2VBbGwoXCI8YnI+XCIsXCJcXFxcblwiKTtcclxuICAgICAgICB2YXIgbm9kZSA9ICQoXCI8c3Bhbj5cIiArIHJldC50ZXh0ICsgXCI8L3NwYW4+XCIpO1xyXG4gICAgICAgIGlmIChub2RlWzBdLmlubmVyVGV4dCAhPT0gbm9kZVswXS5pbm5lckhUTUwpIHsvL2h0bWx0ZXh0XHJcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IG5ldyBJbmxpbmVTdHlsaW5nKCk7XHJcbiAgICAgICAgICAgIHZhciBsaXN0OiBhbnlbXSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRGcm9tSFRNTE5vZGUobm9kZVswXSwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXQuZWRpdFRvZ2V0aGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldC50ZXh0ID0gbGlzdDtcclxuICAgICAgICAgICAgfSBlbHNlIHsgLy9vbmx5IG9uZSB0ZXh0IGZvdW5kIHNvIHdlIHRyYW5zZmVyIHRoZSBodG1sIFxyXG4gICAgICAgICAgICAgICAgcmV0ID0gbGlzdFswXTtcclxuICAgICAgICAgICAgICAgIHJldC50ZXh0ID0gbm9kZVswXS5pbm5lclRleHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mcm9tSlNPTihUb29scy5jb3B5T2JqZWN0KHJldCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICB0b0pTT04oKSB7XHJcblxyXG4gICAgICAgIHZhciByZXQgPSBzdXBlci50b0pTT04oKTtcclxuICAgICAgICByZXQgPSB0aGlzLmNvbnZlcnRGcm9tSFRNTChyZXQpO1xyXG4gICAgICAgIGlmICh0aGlzLmZvcm1hdCkge1xyXG4gICAgICAgICAgICByZXQuZm9ybWF0ID0gdGhpcy5mb3JtYXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGVzdCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHJldCkge1xyXG4gICAgICAgICAgICB0ZXN0Kys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGVzdCA9PT0gMSlcclxuICAgICAgICAgICAgcmV0ID0gcmV0LnRleHQ7Ly9zaG9ydCB2ZXJzaW9uXHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgdCA9IG5ldyBSVGV4dCgpO1xyXG4gICAgdC52YWx1ZSA9IFwiYTxlbT5iPHN0cm9uZz5jZDwvc3Ryb25nPmU8L2VtPjxzcGFuIHN0eWxlPSdjb2xvcjogcmdiKDI0MSwgMTk2LCAxNSk7JyBkYXRhLW1jZS1zdHlsZT0nY29sb3I6ICNmMWM0MGY7Jz5mZzxzcGFuIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTg2LCA1NSwgNDIpOycgZGF0YS1tY2Utc3R5bGU9J2JhY2tncm91bmQtY29sb3I6ICNiYTM3MmE7Jz5oPC9zcGFuPjwvc3Bhbj48c3BhbiBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjogcmdiKDE4NiwgNTUsIDQyKTsnIGRhdGEtbWNlLXN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOiAjYmEzNzJhOyc+aWo8c3BhbiBzdHlsZT0nZm9udC1zaXplOiAxNHB0OycgZGF0YS1tY2Utc3R5bGU9J2ZvbnQtc2l6ZTogMTRwdDsnPms8L3NwYW4+PC9zcGFuPjxzcGFuIHN0eWxlPSdmb250LXNpemU6IDE0cHQ7JyBkYXRhLW1jZS1zdHlsZT0nZm9udC1zaXplOiAxNHB0Oyc+bDxzcGFuIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsnIGRhdGEtbWNlLXN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsnPm08L3NwYW4+PC9zcGFuPjxzcGFuIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsnIGRhdGEtbWNlLXN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsnPm5vPC9zcGFuPlwiO1xyXG5cclxuICAgIHZhciBvYmI6IFJUZXh0ID0gdC50b0pTT04oKTtcclxuICAgIC8vdmFyIHRlc3QgPSBSVGV4dC5mcm9tSlNPTihvYmIpO1xyXG5cclxuXHJcbn1cclxuIl19