var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs_report/RComponent", "jassijs/ui/HTMLPanel", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs/ui/CSSProperties", "jassijs/util/Tools", "jassijs/ui/Component"], function (require, exports, Registry_1, RComponent_1, HTMLPanel_1, Property_1, ReportDesign_1, CSSProperties_1, Tools_1, Component_1) {
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
            super.init('<div class="RText mce-content-body jdisableaddcomponents" tabindex="0" ><div  class="HTMLPanelContent"></div></div>'); //tabindex for key-event
            this.domWrapper.classList.remove("jcontainer");
            this.__dom.style["text-overflow"] = "ellipsis";
            this.__dom.style["overflow"] = "hidden";
            this.dom.classList.add("designerNoResizable");
            delete this._components;
            (0, CSSProperties_1.loadFontIfNedded)("Roboto");
            var el = this.dom.children[0];
            this._designMode = false;
            this.dom.style["display"] = "block";
            this.extensionCalled = HTMLPanel_1.HTMLPanel.prototype.extensionCalled.bind(this);
            this._setDesignMode = HTMLPanel_1.HTMLPanel.prototype._setDesignMode.bind(this);
            this.initIfNeeded = HTMLPanel_1.HTMLPanel.prototype.initIfNeeded.bind(this);
            this.focusLost = HTMLPanel_1.HTMLPanel.prototype.focusLost.bind(this);
            //@ts-ignore
            this._initTinymce = HTMLPanel_1.HTMLPanel.prototype._initTinymce.bind(this);
        }
        get value() {
            var el = this.dom.children[0];
            if (el === undefined)
                return "";
            var ret = el.innerHTML;
            return ret;
        }
        set value(code) {
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(code);
                this.dom.appendChild(el);
            }
            else
                el.innerHTML = code;
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
            var node = Component_1.Component.createHTMLElement("<span>" + ret.text + "</span>");
            if (node.innerText !== node.innerHTML) { //htmltext
                var style = new InlineStyling();
                var list = [];
                this.convertFromHTMLNode(node, list, style);
                if (list.length > 1) {
                    ret.editTogether = true;
                    ret.text = list;
                }
                else { //only one text found so we transfer the html 
                    ret = list[0];
                    ret.text = node.innerText;
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
        (0, Property_1.$Property)({
            chooseFrom: function (component) {
                return ReportDesign_1.ReportDesign.getVariables(component);
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "value", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string", chooseFrom: allFormats }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "format", null);
    RText = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Text", icon: "mdi mdi-format-color-text" }),
        (0, Registry_1.$Class)("jassijs_report.RText")
        //@$Property({hideBaseClassProperties:true})
        ,
        (0, Property_1.$Property)({ name: "value", type: "string", description: "text" }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX3JlcG9ydC9SVGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBV0EsTUFBTSxhQUFhO0tBUWxCO0lBR0QsMEJBQTBCO0lBQzFCLElBQUksVUFBVSxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ25CLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXZDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEQ7Ozs7Ozs7O2lCQVFTO1FBQ1QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDL0MsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFD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LElBQUEsb0JBQVMsRUFBQztZQUNQLFVBQVUsRUFBRSxVQUFVLFNBQVM7Z0JBQzNCLE9BQU8sMkJBQVksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEQsQ0FBQztTQUNKLENBQUM7OztzQ0FPRDtJQVVEO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLENBQUM7Ozt1Q0FHckQ7SUE5RFEsS0FBSztRQUxqQixJQUFBLDZCQUFnQixFQUFDLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQztRQUNoRixJQUFBLGlCQUFNLEVBQUMsc0JBQXNCLENBQUM7UUFDL0IsNENBQTRDOztRQUMzQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDOztPQUVyRCxLQUFLLENBdU9qQjtJQXZPWSxzQkFBSztJQXdPbEIsU0FBZ0IsSUFBSTtRQUNoQixJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxLQUFLLEdBQUcsaXBCQUFpcEIsQ0FBQztRQUU1cEIsSUFBSSxHQUFHLEdBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzVCLGlDQUFpQztJQUdyQyxDQUFDO0lBUkQsb0JBUUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgJFJlcG9ydENvbXBvbmVudCwgUkNvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IEhUTUxQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL0hUTUxQYW5lbFwiO1xyXG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xyXG5pbXBvcnQgeyBSZXBvcnREZXNpZ24gfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUmVwb3J0RGVzaWduXCI7XHJcbmltcG9ydCB7IGxvYWRGb250SWZOZWRkZWQgfSBmcm9tIFwiamFzc2lqcy91aS9DU1NQcm9wZXJ0aWVzXCI7XHJcbmltcG9ydCB7IFRvb2xzIH0gZnJvbSBcImphc3NpanMvdXRpbC9Ub29sc1wiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuXHJcblxyXG5cclxuY2xhc3MgSW5saW5lU3R5bGluZyB7XHJcbiAgICBib2xkOiBib29sZWFuO1xyXG4gICAgaXRhbGljczogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kOiBzdHJpbmc7XHJcbiAgICB1bmRlcmxpbmU6IGJvb2xlYW47XHJcbiAgICBmb250c2l6ZTogbnVtYmVyO1xyXG4gICAgZm9udDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLy9jYWxjIHRoZSBkZWZhdWx0IEZvcm1hdHNcclxubGV0IGFsbEZvcm1hdHMgPSAoKCkgPT4ge1xyXG4gICAgdmFyIHJldCA9IFtdO1xyXG4gICAgY29uc3QgZm9ybWF0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCk7XHJcblxyXG4gICAgdmFyIGRlY2ltYWwgPSBmb3JtYXQuZm9ybWF0KDEuMSkuc3Vic3RyaW5nKDEsIDIpO1xyXG4gICAgdmFyIGdyb3VwID0gZm9ybWF0LmZvcm1hdCgxMjM0KS5zdWJzdHJpbmcoMSwgMik7XHJcbiAgICAvKlx0Y29uc3QgcGFydHMgPSBmb3JtYXQuZm9ybWF0VG9QYXJ0cygxMjM0LjYpO1xyXG4gICAgICAgICAgICB2YXIgZGVjaW1hbCA9IFwiLlwiO1xyXG4gICAgICAgIHZhciBncm91cD1cIixcIjtcclxuICAgICAgICBwYXJ0cy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgICAgICAgICBpZiAocC50eXBlID09PSBcImRlY2ltYWxcIilcclxuICAgICAgICAgICAgICAgIGRlY2ltYWwgPSBwLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAocC50eXBlID09PSBcImdyb3VwXCIpXHJcbiAgICAgICAgICAgICAgICBncm91cCA9IHAudmFsdWU7XHJcbiAgICAgICAgfSk7Ki9cclxuICAgIHJldC5wdXNoKFwiI1wiICsgZ3JvdXAgKyBcIiMjMFwiICsgZGVjaW1hbCArIFwiMDBcIik7XHJcbiAgICByZXQucHVzaChcIiNcIiArIGdyb3VwICsgXCIjIzBcIiArIGRlY2ltYWwgKyBcIjAwIOKCrFwiKTtcclxuICAgIHJldC5wdXNoKFwiI1wiICsgZ3JvdXAgKyBcIiMjMFwiICsgZGVjaW1hbCArIFwiMDAgJFwiKTtcclxuICAgIHJldC5wdXNoKFwiJCMsIyMjLjAwXCIpO1xyXG4gICAgcmV0LnB1c2goXCIwXCIpO1xyXG4gICAgcmV0LnB1c2goXCIwXCIgKyBkZWNpbWFsICsgXCIwMFwiKTtcclxuICAgIHJldC5wdXNoKFwiTU0vREQvWVlZWVwiKTtcclxuICAgIHJldC5wdXNoKFwiREQuTU0uWVlZWVwiKTtcclxuICAgIHJldC5wdXNoKFwiREQvTU0vWVlZWSBoaDptbTpzc1wiKTtcclxuICAgIHJldC5wdXNoKFwiREQuTU0uWVlZWSBoaDptbTpzc1wiKTtcclxuICAgIHJldC5wdXNoKFwiaGg6bW06c3NcIik7XHJcbiAgICByZXQucHVzaChcImg6bW06c3MgQVwiKTtcclxuICAgIHJldHVybiByZXQ7XHJcbn0pKCk7XHJcblxyXG5cclxuQCRSZXBvcnRDb21wb25lbnQoeyBmdWxsUGF0aDogXCJyZXBvcnQvVGV4dFwiLCBpY29uOiBcIm1kaSBtZGktZm9ybWF0LWNvbG9yLXRleHRcIiB9KVxyXG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQuUlRleHRcIilcclxuLy9AJFByb3BlcnR5KHtoaWRlQmFzZUNsYXNzUHJvcGVydGllczp0cnVlfSlcclxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwidmFsdWVcIiwgdHlwZTogXCJzdHJpbmdcIiwgZGVzY3JpcHRpb246IFwidGV4dFwiIH0pXHJcblxyXG5leHBvcnQgY2xhc3MgUlRleHQgZXh0ZW5kcyBSQ29tcG9uZW50IHtcclxuICAgIHJlcG9ydHR5cGU6IHN0cmluZyA9IFwidGV4dFwiO1xyXG4gICAgaW5pdElmTmVlZGVkO1xyXG4gICAgZm9jdXNMb3N0O1xyXG4gICAgdG9vbGJhciA9IFsnYm9sZCBpdGFsaWMgdW5kZXJsaW5lIGZvcmVjb2xvciBiYWNrY29sb3IgZm9udHNpemVzZWxlY3QnXTtcclxuICAgIGN1c3RvbVRvb2xiYXJCdXR0b25zOiB7XHJcbiAgICAgICAgW25hbWU6IHN0cmluZ106IHtcclxuICAgICAgICAgICAgdGl0bGU6IHN0cmluZyxcclxuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XHJcbiAgICAgICAgfVxyXG4gICAgfSA9IHt9O1xyXG4gICAgX2Zvcm1hdDogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcGVydGllcyAtIHByb3BlcnRpZXMgdG8gaW5pdFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW3Byb3BlcnRpZXMuaWRdIC0gIGNvbm5lY3QgdG8gZXhpc3RpbmcgaWQgKG5vdCByZXFpcmVkKVxyXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wZXJ0aWVzLnVzZVNwYW5dIC0gIHVzZSBzcGFuIG5vdCBkaXZcclxuICAgICogXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcyA9IHVuZGVmaW5lZCkgey8vaWQgY29ubmVjdCB0byBleGlzdGluZyhub3QgcmVxaXJlZClcclxuICAgICAgICBzdXBlcihwcm9wZXJ0aWVzKTtcclxuICAgICAgICBzdXBlci5pbml0KCc8ZGl2IGNsYXNzPVwiUlRleHQgbWNlLWNvbnRlbnQtYm9keSBqZGlzYWJsZWFkZGNvbXBvbmVudHNcIiB0YWJpbmRleD1cIjBcIiA+PGRpdiAgY2xhc3M9XCJIVE1MUGFuZWxDb250ZW50XCI+PC9kaXY+PC9kaXY+Jyk7Ly90YWJpbmRleCBmb3Iga2V5LWV2ZW50XHJcbiAgICAgICAgdGhpcy5kb21XcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJqY29udGFpbmVyXCIpO1xyXG4gICAgICAgIHRoaXMuX19kb20uc3R5bGVbXCJ0ZXh0LW92ZXJmbG93XCJdPSBcImVsbGlwc2lzXCI7XHJcbiAgICAgICAgdGhpcy5fX2RvbS5zdHlsZVtcIm92ZXJmbG93XCJdPSBcImhpZGRlblwiO1xyXG4gICAgICAgIHRoaXMuZG9tLmNsYXNzTGlzdC5hZGQoXCJkZXNpZ25lck5vUmVzaXphYmxlXCIpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzO1xyXG4gICAgICAgIGxvYWRGb250SWZOZWRkZWQoXCJSb2JvdG9cIik7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5kb20uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdGhpcy5fZGVzaWduTW9kZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlW1wiZGlzcGxheVwiXT0gXCJibG9ja1wiO1xyXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ2FsbGVkID0gSFRNTFBhbmVsLnByb3RvdHlwZS5leHRlbnNpb25DYWxsZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9zZXREZXNpZ25Nb2RlID0gSFRNTFBhbmVsLnByb3RvdHlwZS5fc2V0RGVzaWduTW9kZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaW5pdElmTmVlZGVkID0gSFRNTFBhbmVsLnByb3RvdHlwZS5pbml0SWZOZWVkZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmZvY3VzTG9zdCA9IEhUTUxQYW5lbC5wcm90b3R5cGUuZm9jdXNMb3N0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5faW5pdFRpbnltY2UgPSBIVE1MUGFuZWwucHJvdG90eXBlLl9pbml0VGlueW1jZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIEAkUHJvcGVydHkoe1xyXG4gICAgICAgIGNob29zZUZyb206IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlcG9ydERlc2lnbi5nZXRWYXJpYWJsZXMoY29tcG9uZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5kb20uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgaWYgKGVsID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhciByZXQgPSBlbC5pbm5lckhUTUw7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIHNldCB2YWx1ZShjb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWw6IGFueSA9IHRoaXMuZG9tLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIGlmIChlbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY29kZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgZWwuaW5uZXJIVE1MPWNvZGU7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiwgY2hvb3NlRnJvbTogYWxsRm9ybWF0cyB9KVxyXG4gICAgc2V0IGZvcm1hdCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fZm9ybWF0ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBnZXQgZm9ybWF0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdDtcclxuICAgIH1cclxuXHJcbiAgIFxyXG4gICAgZnJvbUpTT04ob2I6IGFueSk6IFJUZXh0IHtcclxuICAgICAgICB2YXIgcmV0ID0gdGhpcztcclxuICAgICAgICBpZiAob2IuZWRpdFRvZ2V0aGVyKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5lZGl0VG9nZXRoZXI7XHJcbiAgICAgICAgICAgIHJldC5jb252ZXJ0VG9IVE1MKG9iLnRleHQpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICByZXQudmFsdWUgPSA8c3RyaW5nPm9iLnRleHQucmVwbGFjZUFsbChcIlxcblwiLCBcIjxici8+XCIpO1xyXG4gICAgICAgIGRlbGV0ZSBvYi50ZXh0O1xyXG4gICAgICAgIGlmIChvYi5mb3JtYXQpIHtcclxuICAgICAgICAgICAgdGhpcy5mb3JtYXQgPSBvYi5mb3JtYXQ7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5mb3JtYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cGVyLmZyb21KU09OKG9iKTtcclxuICAgICAgICAvLyByZXQub3RoZXJQcm9wZXJ0aWVzID0gb2I7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbnZlcnRGcm9tSFRNTE5vZGUobm9kZTogQ2hpbGROb2RlLCBsaXN0OiBhbnlbXSwgc3R5bGU6IElubGluZVN0eWxpbmcpOiBhbnkge1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGROb2Rlc1t4XTtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIiN0ZXh0XCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBydDogYW55ID0ge307XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuYm9sZClcclxuICAgICAgICAgICAgICAgICAgICBydC5ib2xkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0LmJhY2tncm91bmQgPSBzdHlsZS5iYWNrZ3JvdW5kO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLmNvbG9yKVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0LmNvbG9yID0gc3R5bGUuY29sb3I7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuZm9udHNpemUpXHJcbiAgICAgICAgICAgICAgICAgICAgcnQuZm9udFNpemUgPSBzdHlsZS5mb250c2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5mb250KVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0LmZvbnQgPSBzdHlsZS5mb250O1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLnVuZGVybGluZSlcclxuICAgICAgICAgICAgICAgICAgICBydC5kZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5pdGFsaWNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0Lml0YWxpY3MgPSBzdHlsZS5pdGFsaWNzO1xyXG4gICAgICAgICAgICAgICAgcnQudGV4dCA9IGNoaWxkW1wiZGF0YVwiXTtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChydCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiU1RST05HXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlLmJvbGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKGNoaWxkLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3R5bGUuYm9sZDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gXCJFTVwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS5pdGFsaWNzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLml0YWxpY3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIlNQQU5cIiAmJiBjaGlsZFtcInN0eWxlXCJdLmNvbG9yICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS5jb2xvciA9IHRoaXMuZnVsbENvbG9ySGV4KGNoaWxkW1wic3R5bGVcIl0uY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKGNoaWxkLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3R5bGUuY29sb3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiU1BBTlwiICYmIGNoaWxkW1wic3R5bGVcIl1bXCJiYWNrZ3JvdW5kLWNvbG9yXCJdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5mdWxsQ29sb3JIZXgoY2hpbGRbXCJzdHlsZVwiXVtcImJhY2tncm91bmQtY29sb3JcIl0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKGNoaWxkLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3R5bGUuYmFja2dyb3VuZDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gXCJTUEFOXCIgJiYgY2hpbGRbXCJzdHlsZVwiXVtcImZvbnQtc2l6ZVwiXSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUuZm9udHNpemUgPSBOdW1iZXIoY2hpbGRbXCJzdHlsZVwiXVtcImZvbnQtc2l6ZVwiXS5yZXBsYWNlKFwicHhcIiwgXCJcIikpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKGNoaWxkLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3R5bGUuZm9udHNpemU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiU1BBTlwiICYmIGNoaWxkW1wic3R5bGVcIl1bXCJ0ZXh0LWRlY29yYXRpb25cIl0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlLnVuZGVybGluZSA9IChjaGlsZFtcInN0eWxlXCJdW1widGV4dC1kZWNvcmF0aW9uXCJdID09PSBcInVuZGVybGluZVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLnVuZGVybGluZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJnYlRvSGV4KHJnYikge1xyXG4gICAgICAgIHZhciBoZXggPSBOdW1iZXIocmdiKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgaWYgKGhleC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIGhleCA9IFwiMFwiICsgaGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGV4O1xyXG4gICAgfTtcclxuICAgIC8vcmdiKDEsMiwzKVxyXG4gICAgcHJpdmF0ZSBmdWxsQ29sb3JIZXgodGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGMgPSB0ZXh0LnNwbGl0KFwiKFwiKVsxXS5zcGxpdChcIilcIilbMF0uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgIHZhciByZWQgPSB0aGlzLnJnYlRvSGV4KGNbMF0pO1xyXG4gICAgICAgIHZhciBncmVlbiA9IHRoaXMucmdiVG9IZXgoY1sxXSk7XHJcbiAgICAgICAgdmFyIGJsdWUgPSB0aGlzLnJnYlRvSGV4KGNbMl0pO1xyXG4gICAgICAgIHJldHVybiBcIiNcIiArIHJlZCArIGdyZWVuICsgYmx1ZTtcclxuICAgIH07XHJcbiAgICBwcml2YXRlIGNvbnZlcnRUb0hUTUwob2JzOiBhbnlbXSkge1xyXG4gICAgICAgIHZhciBodG1sID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG9icy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgb2IgPSBvYnNbeF07XHJcbiAgICAgICAgICAgIHZhciBhbnogPSAwO1xyXG4gICAgICAgICAgICB2YXIgdGFnY291bnQgPSAwO1xyXG4gICAgICAgICAgICBpZiAob2IuYm9sZCkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBcIjxzdHJvbmc+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iLml0YWxpY3MpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8ZW0+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iLmJhY2tncm91bmQgfHwgb2IuY29sb3IgfHwgb2IuZGVjb3JhdGlvbiA9PT0gXCJ1bmRlcmxpbmVcIiB8fCBvYi5mb250U2l6ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvYi5jb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8c3BhbiBzdHlsZT0nY29sb3I6XCIgKyBvYi5jb2xvciArIFwiJz5cIjsgdGFnY291bnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iLmJhY2tncm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHNwYW4gc3R5bGU9J2JhY2tncm91bmQtY29sb3I6XCIgKyBvYi5iYWNrZ3JvdW5kICsgXCInPlwiOyB0YWdjb3VudCsrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob2IuZGVjb3JhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8c3BhbiBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOlwiICsgb2IuZGVjb3JhdGlvbiArIFwiJz5cIjsgdGFnY291bnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iLmZvbnRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxzcGFuIHN0eWxlPSdmb250LXNpemU6XCIgKyBvYi5mb250U2l6ZSArIFwicHQnPlwiOyB0YWdjb3VudCsrXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBodG1sICs9IG9iLnRleHQucmVwbGFjZUFsbChcIlxcblwiLCBcIjxici8+XCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRhZ2NvdW50OyB0KyspIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iLml0YWxpY3MpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8L2VtPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYi5ib2xkKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPC9zdHJvbmc+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSBodG1sO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0RnJvbUhUTUwocmV0OiBhbnkpOiBhbnkge1xyXG4gICAgICAgIHZhciBzdmFsID0gZGVjb2RlVVJJKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIHN2YWwgPSBzdmFsLnJlcGxhY2VBbGwoXCI8YnI+XCIsIFwiXFxuXCIpXHJcbiAgICAgICAgcmV0LnRleHQgPSBzdmFsLy8ucmVwbGFjZUFsbChcIjxicj5cIixcIlxcXFxuXCIpO1xyXG4gICAgICAgIHZhciBub2RlID0gQ29tcG9uZW50LmNyZWF0ZUhUTUxFbGVtZW50KFwiPHNwYW4+XCIgKyByZXQudGV4dCArIFwiPC9zcGFuPlwiKTtcclxuICAgICAgICBpZiAobm9kZS5pbm5lclRleHQgIT09IG5vZGUuaW5uZXJIVE1MKSB7Ly9odG1sdGV4dFxyXG4gICAgICAgICAgICB2YXIgc3R5bGUgPSBuZXcgSW5saW5lU3R5bGluZygpO1xyXG4gICAgICAgICAgICB2YXIgbGlzdDogYW55W10gPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKG5vZGUsIGxpc3QsIHN0eWxlKTtcclxuICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0LmVkaXRUb2dldGhlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXQudGV4dCA9IGxpc3Q7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vb25seSBvbmUgdGV4dCBmb3VuZCBzbyB3ZSB0cmFuc2ZlciB0aGUgaHRtbCBcclxuICAgICAgICAgICAgICAgIHJldCA9IGxpc3RbMF07XHJcbiAgICAgICAgICAgICAgICByZXQudGV4dCA9IG5vZGUuaW5uZXJUZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZnJvbUpTT04oVG9vbHMuY29weU9iamVjdChyZXQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgdG9KU09OKCkge1xyXG5cclxuICAgICAgICB2YXIgcmV0ID0gc3VwZXIudG9KU09OKCk7XHJcbiAgICAgICAgcmV0ID0gdGhpcy5jb252ZXJ0RnJvbUhUTUwocmV0KTtcclxuICAgICAgICBpZiAodGhpcy5mb3JtYXQpIHtcclxuICAgICAgICAgICAgcmV0LmZvcm1hdCA9IHRoaXMuZm9ybWF0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRlc3QgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiByZXQpIHtcclxuICAgICAgICAgICAgdGVzdCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRlc3QgPT09IDEpXHJcbiAgICAgICAgICAgIHJldCA9IHJldC50ZXh0Oy8vc2hvcnQgdmVyc2lvblxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgdmFyIHQgPSBuZXcgUlRleHQoKTtcclxuICAgIHQudmFsdWUgPSBcImE8ZW0+YjxzdHJvbmc+Y2Q8L3N0cm9uZz5lPC9lbT48c3BhbiBzdHlsZT0nY29sb3I6IHJnYigyNDEsIDE5NiwgMTUpOycgZGF0YS1tY2Utc3R5bGU9J2NvbG9yOiAjZjFjNDBmOyc+Zmc8c3BhbiBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjogcmdiKDE4NiwgNTUsIDQyKTsnIGRhdGEtbWNlLXN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOiAjYmEzNzJhOyc+aDwvc3Bhbj48L3NwYW4+PHNwYW4gc3R5bGU9J2JhY2tncm91bmQtY29sb3I6IHJnYigxODYsIDU1LCA0Mik7JyBkYXRhLW1jZS1zdHlsZT0nYmFja2dyb3VuZC1jb2xvcjogI2JhMzcyYTsnPmlqPHNwYW4gc3R5bGU9J2ZvbnQtc2l6ZTogMTRwdDsnIGRhdGEtbWNlLXN0eWxlPSdmb250LXNpemU6IDE0cHQ7Jz5rPC9zcGFuPjwvc3Bhbj48c3BhbiBzdHlsZT0nZm9udC1zaXplOiAxNHB0OycgZGF0YS1tY2Utc3R5bGU9J2ZvbnQtc2l6ZTogMTRwdDsnPmw8c3BhbiBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7JyBkYXRhLW1jZS1zdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7Jz5tPC9zcGFuPjwvc3Bhbj48c3BhbiBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7JyBkYXRhLW1jZS1zdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7Jz5ubzwvc3Bhbj5cIjtcclxuXHJcbiAgICB2YXIgb2JiOiBSVGV4dCA9IHQudG9KU09OKCk7XHJcbiAgICAvL3ZhciB0ZXN0ID0gUlRleHQuZnJvbUpTT04ob2JiKTtcclxuXHJcblxyXG59XHJcbiJdfQ==