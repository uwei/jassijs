var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RComponent", "jassijs/ui/HTMLPanel", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs/ui/CSSProperties"], function (require, exports, Jassi_1, RComponent_1, HTMLPanel_1, Property_1, ReportDesign_1, CSSProperties_1) {
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
                //  if(list.length>1){
                ret.editTogether = true;
                ret.text = list;
                //}else{
                //  ret=list[0];
                // }
            }
            return ret;
        }
        toJSON() {
            var ret = super.toJSON();
            this.convertFromHTML(ret);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX3JlcG9ydC9SVGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBU0EsTUFBTSxhQUFhO0tBUWxCO0lBR0QsMEJBQTBCO0lBQzFCLElBQUksVUFBVSxHQUFDLENBQUMsR0FBRSxFQUFFO1FBQ2hCLElBQUksR0FBRyxHQUFDLEVBQUUsQ0FBQztRQUNYLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXZDLElBQUksT0FBTyxHQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLEtBQUssR0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQ7Ozs7Ozs7O2lCQVFNO1FBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxHQUFDLEtBQUssR0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxHQUFDLEtBQUssR0FBQyxPQUFPLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsS0FBSyxHQUFDLEtBQUssR0FBQyxPQUFPLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUMsT0FBTyxHQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFD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QU9EO0lBVUQ7UUFEQyxvQkFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUMsVUFBVSxFQUFDLENBQUM7Ozt1Q0FHbkQ7SUEvRFEsS0FBSztRQUxqQiw2QkFBZ0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLDJCQUEyQixFQUFFLENBQUM7UUFDaEYsY0FBTSxDQUFDLHNCQUFzQixDQUFDO1FBQy9CLDRDQUE0Qzs7UUFDM0Msb0JBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUM7O09BRXJELEtBQUssQ0FxT2pCO0lBck9ZLHNCQUFLO0lBc09sQixTQUFnQixJQUFJO1FBQ2hCLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLEtBQUssR0FBRyxpcEJBQWlwQixDQUFDO1FBRTVwQixJQUFJLEdBQUcsR0FBVSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUIsaUNBQWlDO0lBR3JDLENBQUM7SUFSRCxvQkFRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5pbXBvcnQgeyAkUmVwb3J0Q29tcG9uZW50LCBSQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JDb21wb25lbnRcIjtcclxuaW1wb3J0IHsgSFRNTFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvSFRNTFBhbmVsXCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcbmltcG9ydCB7IFJlcG9ydERlc2lnbiB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SZXBvcnREZXNpZ25cIjtcclxuaW1wb3J0IHsgbG9hZEZvbnRJZk5lZGRlZCB9IGZyb20gXCJqYXNzaWpzL3VpL0NTU1Byb3BlcnRpZXNcIjtcclxuXHJcblxyXG5cclxuY2xhc3MgSW5saW5lU3R5bGluZyB7XHJcbiAgICBib2xkOiBib29sZWFuO1xyXG4gICAgaXRhbGljczogYm9vbGVhbjtcclxuICAgIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kOiBzdHJpbmc7XHJcbiAgICB1bmRlcmxpbmU6IGJvb2xlYW47XHJcbiAgICBmb250c2l6ZTogbnVtYmVyO1xyXG4gICAgZm9udDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLy9jYWxjIHRoZSBkZWZhdWx0IEZvcm1hdHNcclxubGV0IGFsbEZvcm1hdHM9KCgpPT57XHJcbiAgICB2YXIgcmV0PVtdO1xyXG4gICAgY29uc3QgZm9ybWF0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCk7XHJcbiAgICBcclxuICAgIHZhciBkZWNpbWFsPWZvcm1hdC5mb3JtYXQoMS4xKS5zdWJzdHJpbmcoMSwyKTtcclxuICAgIHZhciBncm91cD1mb3JtYXQuZm9ybWF0KDEyMzQpLnN1YnN0cmluZygxLDIpO1xyXG5cdC8qXHRjb25zdCBwYXJ0cyA9IGZvcm1hdC5mb3JtYXRUb1BhcnRzKDEyMzQuNik7XHJcbiAgXHRcdHZhciBkZWNpbWFsID0gXCIuXCI7XHJcbiAgICAgICAgdmFyIGdyb3VwPVwiLFwiO1xyXG5cdFx0cGFydHMuZm9yRWFjaChwID0+IHtcclxuXHRcdFx0aWYgKHAudHlwZSA9PT0gXCJkZWNpbWFsXCIpXHJcblx0XHRcdFx0ZGVjaW1hbCA9IHAudmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChwLnR5cGUgPT09IFwiZ3JvdXBcIilcclxuXHRcdFx0XHRncm91cCA9IHAudmFsdWU7XHJcblx0XHR9KTsqL1xyXG4gICAgcmV0LnB1c2goXCIjXCIrZ3JvdXArXCIjIzBcIitkZWNpbWFsK1wiMDBcIik7XHJcbiAgICByZXQucHVzaChcIiNcIitncm91cCtcIiMjMFwiK2RlY2ltYWwrXCIwMCDigqxcIik7XHJcbiAgICByZXQucHVzaChcIiNcIitncm91cCtcIiMjMFwiK2RlY2ltYWwrXCIwMCAkXCIpO1xyXG4gICAgcmV0LnB1c2goXCIkIywjIyMuMDBcIik7XHJcbiAgICByZXQucHVzaChcIjBcIik7XHJcbiAgICByZXQucHVzaChcIjBcIitkZWNpbWFsK1wiMDBcIik7XHJcbiAgICByZXQucHVzaChcIk1NL0REL1lZWVlcIik7XHJcbiAgICByZXQucHVzaChcIkRELk1NLllZWVlcIik7XHJcbiAgICByZXQucHVzaChcIkREL01NL1lZWVkgaGg6bW06c3NcIik7XHJcbiAgICByZXQucHVzaChcIkRELk1NLllZWVkgaGg6bW06c3NcIik7XHJcbiAgICByZXQucHVzaChcImhoOm1tOnNzXCIpO1xyXG4gICAgcmV0LnB1c2goXCJoOm1tOnNzIEFcIik7XHJcbiAgICByZXR1cm4gcmV0O1xyXG59KSgpO1xyXG5cclxuXHJcbkAkUmVwb3J0Q29tcG9uZW50KHsgZnVsbFBhdGg6IFwicmVwb3J0L1RleHRcIiwgaWNvbjogXCJtZGkgbWRpLWZvcm1hdC1jb2xvci10ZXh0XCIgfSlcclxuQCRDbGFzcyhcImphc3NpanNfcmVwb3J0LlJUZXh0XCIpXHJcbi8vQCRQcm9wZXJ0eSh7aGlkZUJhc2VDbGFzc1Byb3BlcnRpZXM6dHJ1ZX0pXHJcbkAkUHJvcGVydHkoeyBuYW1lOiBcInZhbHVlXCIsIHR5cGU6IFwic3RyaW5nXCIsIGRlc2NyaXB0aW9uOiBcInRleHRcIiB9KVxyXG5cclxuZXhwb3J0IGNsYXNzIFJUZXh0IGV4dGVuZHMgUkNvbXBvbmVudCB7XHJcbiAgICByZXBvcnR0eXBlOiBzdHJpbmcgPSBcInRleHRcIjtcclxuICAgIGluaXRJZk5lZWRlZDtcclxuICAgIHRvb2xiYXIgPSBbJ2JvbGQgaXRhbGljIHVuZGVybGluZSBmb3JlY29sb3IgYmFja2NvbG9yIGZvbnRzaXplc2VsZWN0J107XHJcbiAgICBjdXN0b21Ub29sYmFyQnV0dG9uczoge1xyXG4gICAgICAgIFtuYW1lOiBzdHJpbmddOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGFjdGlvbjogYW55O1xyXG4gICAgICAgIH1cclxuICAgIH0gPSB7fTtcclxuICAgIF9mb3JtYXQ6c3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcGVydGllcyAtIHByb3BlcnRpZXMgdG8gaW5pdFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW3Byb3BlcnRpZXMuaWRdIC0gIGNvbm5lY3QgdG8gZXhpc3RpbmcgaWQgKG5vdCByZXFpcmVkKVxyXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wZXJ0aWVzLnVzZVNwYW5dIC0gIHVzZSBzcGFuIG5vdCBkaXZcclxuICAgICogXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcyA9IHVuZGVmaW5lZCkgey8vaWQgY29ubmVjdCB0byBleGlzdGluZyhub3QgcmVxaXJlZClcclxuICAgICAgICBzdXBlcihwcm9wZXJ0aWVzKTtcclxuICAgICAgICBzdXBlci5pbml0KCQoJzxkaXYgY2xhc3M9XCJSVGV4dCBtY2UtY29udGVudC1ib2R5IGpkaXNhYmxlYWRkY29tcG9uZW50c1wiIHRhYmluZGV4PVwiMFwiID48ZGl2ICBjbGFzcz1cIkhUTUxQYW5lbENvbnRlbnRcIj48L2Rpdj48L2Rpdj4nKVswXSk7Ly90YWJpbmRleCBmb3Iga2V5LWV2ZW50XHJcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLnJlbW92ZUNsYXNzKFwiamNvbnRhaW5lclwiKTtcclxuICAgICAgICAkKHRoaXMuX19kb20pLmNzcyhcInRleHQtb3ZlcmZsb3dcIiwgXCJlbGxpcHNpc1wiKTtcclxuICAgICAgICAkKHRoaXMuX19kb20pLmNzcyhcIm92ZXJmbG93XCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQodGhpcy5kb20pLmFkZENsYXNzKFwiZGVzaWduZXJOb1Jlc2l6YWJsZVwiKTtcclxuXHJcbiAgICAgICAgbG9hZEZvbnRJZk5lZGRlZChcIlJvYm90b1wiKTtcclxuICAgICAgICAvLyAgc3VwZXIuaW5pdCgkKCc8ZGl2IGNsYXNzPVwiUlRleHRcIj48L2Rpdj4nKVswXSk7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5kb20uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdGhpcy5fZGVzaWduTW9kZSA9IGZhbHNlO1xyXG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcclxuICAgICAgICAvLyB0aGlzLmNzcyh7IGZvbnRfZmFtaWx5OiBcImluaGVyaXRcIiwgZm9udF9zaXplOiBcImluaGVyaXRcIiB9KVxyXG4gICAgICAgIC8vICAgJCh0aGlzLmRvbS5jaGlsZHJlblswXSkuY3NzKFwiZGlzcGxheVwiLFwiaW5saW5lLWJsb2NrXCIpO1xyXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ2FsbGVkID0gSFRNTFBhbmVsLnByb3RvdHlwZS5leHRlbnNpb25DYWxsZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9zZXREZXNpZ25Nb2RlID0gSFRNTFBhbmVsLnByb3RvdHlwZS5fc2V0RGVzaWduTW9kZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaW5pdElmTmVlZGVkID0gSFRNTFBhbmVsLnByb3RvdHlwZS5pbml0SWZOZWVkZWQuYmluZCh0aGlzKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLl9pbml0VGlueW1jZT0gSFRNTFBhbmVsLnByb3RvdHlwZS5faW5pdFRpbnltY2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBAJFByb3BlcnR5KHtcclxuICAgICAgICBjaG9vc2VGcm9tOiBmdW5jdGlvbiAoY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXBvcnREZXNpZ24uZ2V0VmFyaWFibGVzKGNvbXBvbmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBlbCA9IHRoaXMuZG9tLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIGlmIChlbCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YXIgcmV0ID0gJChlbCkuaHRtbCgpO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBzZXQgdmFsdWUoY29kZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGVsOiBhbnkgPSB0aGlzLmRvbS5jaGlsZHJlblswXTtcclxuICAgICAgICBpZiAoZWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvZGUpO1xyXG4gICAgICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICQoZWwpLmh0bWwoY29kZSk7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiAsY2hvb3NlRnJvbTphbGxGb3JtYXRzfSlcclxuICAgIHNldCBmb3JtYXQodmFsdWU6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLl9mb3JtYXQ9dmFsdWU7XHJcbiAgICB9XHJcbiAgICBnZXQgZm9ybWF0KCk6c3RyaW5ne1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZyb21KU09OKG9iOiBhbnkpOiBSVGV4dCB7XHJcbiAgICAgICAgdmFyIHJldCA9IHRoaXM7XHJcbiAgICAgICAgaWYgKG9iLmVkaXRUb2dldGhlcikge1xyXG4gICAgICAgICAgICBkZWxldGUgb2IuZWRpdFRvZ2V0aGVyO1xyXG4gICAgICAgICAgICByZXQuY29udmVydFRvSFRNTChvYi50ZXh0KTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgcmV0LnZhbHVlID0gPHN0cmluZz5vYi50ZXh0LnJlcGxhY2VBbGwoXCJcXG5cIiwgXCI8YnIvPlwiKTtcclxuICAgICAgICBkZWxldGUgb2IudGV4dDtcclxuICAgICAgICBpZihvYi5mb3JtYXQpe1xyXG4gICAgICAgICAgICB0aGlzLmZvcm1hdD1vYi5mb3JtYXQ7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5mb3JtYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cGVyLmZyb21KU09OKG9iKTtcclxuICAgICAgICAvLyByZXQub3RoZXJQcm9wZXJ0aWVzID0gb2I7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbnZlcnRGcm9tSFRNTE5vZGUobm9kZTogQ2hpbGROb2RlLCBsaXN0OiBhbnlbXSwgc3R5bGU6IElubGluZVN0eWxpbmcpOiBhbnkge1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGROb2Rlc1t4XTtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIiN0ZXh0XCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBydDogYW55ID0ge307XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuYm9sZClcclxuICAgICAgICAgICAgICAgICAgICBydC5ib2xkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0LmJhY2tncm91bmQgPSBzdHlsZS5iYWNrZ3JvdW5kO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLmNvbG9yKVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0LmNvbG9yID0gc3R5bGUuY29sb3I7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuZm9udHNpemUpXHJcbiAgICAgICAgICAgICAgICAgICAgcnQuZm9udFNpemUgPSBzdHlsZS5mb250c2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5mb250KVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0LmZvbnQgPSBzdHlsZS5mb250O1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLnVuZGVybGluZSlcclxuICAgICAgICAgICAgICAgICAgICBydC5kZWNvcmF0aW9uID0gXCJ1bmRlcmxpbmVcIjtcclxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5pdGFsaWNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJ0Lml0YWxpY3MgPSBzdHlsZS5pdGFsaWNzO1xyXG4gICAgICAgICAgICAgICAgcnQudGV4dCA9IGNoaWxkW1wiZGF0YVwiXTtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChydCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiU1RST05HXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlLmJvbGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKGNoaWxkLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3R5bGUuYm9sZDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gXCJFTVwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS5pdGFsaWNzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLml0YWxpY3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVOYW1lID09PSBcIlNQQU5cIiAmJiBjaGlsZFtcInN0eWxlXCJdLmNvbG9yICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS5jb2xvciA9IHRoaXMuZnVsbENvbG9ySGV4KGNoaWxkW1wic3R5bGVcIl0uY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKGNoaWxkLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3R5bGUuY29sb3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiU1BBTlwiICYmIGNoaWxkW1wic3R5bGVcIl1bXCJiYWNrZ3JvdW5kLWNvbG9yXCJdICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5mdWxsQ29sb3JIZXgoY2hpbGRbXCJzdHlsZVwiXVtcImJhY2tncm91bmQtY29sb3JcIl0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKGNoaWxkLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3R5bGUuYmFja2dyb3VuZDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlTmFtZSA9PT0gXCJTUEFOXCIgJiYgY2hpbGRbXCJzdHlsZVwiXVtcImZvbnQtc2l6ZVwiXSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgc3R5bGUuZm9udHNpemUgPSBOdW1iZXIoY2hpbGRbXCJzdHlsZVwiXVtcImZvbnQtc2l6ZVwiXS5yZXBsYWNlKFwicHRcIiwgXCJcIikpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUxOb2RlKGNoaWxkLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3R5bGUuZm9udHNpemU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT09IFwiU1BBTlwiICYmIGNoaWxkW1wic3R5bGVcIl1bXCJ0ZXh0LWRlY29yYXRpb25cIl0gIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlLnVuZGVybGluZSA9IChjaGlsZFtcInN0eWxlXCJdW1widGV4dC1kZWNvcmF0aW9uXCJdID09PSBcInVuZGVybGluZVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShjaGlsZCwgbGlzdCwgc3R5bGUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0eWxlLnVuZGVybGluZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJnYlRvSGV4KHJnYikge1xyXG4gICAgICAgIHZhciBoZXggPSBOdW1iZXIocmdiKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgaWYgKGhleC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIGhleCA9IFwiMFwiICsgaGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGV4O1xyXG4gICAgfTtcclxuICAgIC8vcmdiKDEsMiwzKVxyXG4gICAgcHJpdmF0ZSBmdWxsQ29sb3JIZXgodGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGMgPSB0ZXh0LnNwbGl0KFwiKFwiKVsxXS5zcGxpdChcIilcIilbMF0uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgIHZhciByZWQgPSB0aGlzLnJnYlRvSGV4KGNbMF0pO1xyXG4gICAgICAgIHZhciBncmVlbiA9IHRoaXMucmdiVG9IZXgoY1sxXSk7XHJcbiAgICAgICAgdmFyIGJsdWUgPSB0aGlzLnJnYlRvSGV4KGNbMl0pO1xyXG4gICAgICAgIHJldHVybiBcIiNcIiArIHJlZCArIGdyZWVuICsgYmx1ZTtcclxuICAgIH07XHJcbiAgICBwcml2YXRlIGNvbnZlcnRUb0hUTUwob2JzOiBhbnlbXSkge1xyXG4gICAgICAgIHZhciBodG1sID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG9icy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgb2IgPSBvYnNbeF07XHJcbiAgICAgICAgICAgIHZhciBhbnogPSAwO1xyXG4gICAgICAgICAgICB2YXIgdGFnY291bnQgPSAwO1xyXG4gICAgICAgICAgICBpZiAob2IuYm9sZCkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBcIjxzdHJvbmc+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iLml0YWxpY3MpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8ZW0+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iLmJhY2tncm91bmQgfHwgb2IuY29sb3IgfHwgb2IuZGVjb3JhdGlvbiA9PT0gXCJ1bmRlcmxpbmVcIiB8fCBvYi5mb250U2l6ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvYi5jb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8c3BhbiBzdHlsZT0nY29sb3I6XCIgKyBvYi5jb2xvciArIFwiJz5cIjsgdGFnY291bnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iLmJhY2tncm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHNwYW4gc3R5bGU9J2JhY2tncm91bmQtY29sb3I6XCIgKyBvYi5iYWNrZ3JvdW5kICsgXCInPlwiOyB0YWdjb3VudCsrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob2IuZGVjb3JhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8c3BhbiBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOlwiICsgb2IuZGVjb3JhdGlvbiArIFwiJz5cIjsgdGFnY291bnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iLmZvbnRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxzcGFuIHN0eWxlPSdmb250LXNpemU6XCIgKyBvYi5mb250U2l6ZSArIFwicHQnPlwiOyB0YWdjb3VudCsrXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBodG1sICs9IG9iLnRleHQucmVwbGFjZUFsbChcIlxcblwiLCBcIjxici8+XCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRhZ2NvdW50OyB0KyspIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iLml0YWxpY3MpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8L2VtPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYi5ib2xkKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPC9zdHJvbmc+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSBodG1sO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0RnJvbUhUTUwocmV0OiBhbnkpOiBhbnkge1xyXG4gICAgICAgIHZhciBzdmFsID0gZGVjb2RlVVJJKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIHN2YWwgPSBzdmFsLnJlcGxhY2VBbGwoXCI8YnI+XCIsIFwiXFxuXCIpXHJcbiAgICAgICAgcmV0LnRleHQgPSBzdmFsLy8ucmVwbGFjZUFsbChcIjxicj5cIixcIlxcXFxuXCIpO1xyXG4gICAgICAgIHZhciBub2RlID0gJChcIjxzcGFuPlwiICsgcmV0LnRleHQgKyBcIjwvc3Bhbj5cIik7XHJcbiAgICAgICAgaWYgKG5vZGVbMF0uaW5uZXJUZXh0ICE9PSBub2RlWzBdLmlubmVySFRNTCkgey8vaHRtbHRleHRcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gbmV3IElubGluZVN0eWxpbmcoKTtcclxuICAgICAgICAgICAgdmFyIGxpc3Q6IGFueVtdID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydEZyb21IVE1MTm9kZShub2RlWzBdLCBsaXN0LCBzdHlsZSk7XHJcbiAgICAgICAgICAvLyAgaWYobGlzdC5sZW5ndGg+MSl7XHJcbiAgICAgICAgICAgICAgICByZXQuZWRpdFRvZ2V0aGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldC50ZXh0ID0gbGlzdDtcclxuICAgICAgICAgICAgLy99ZWxzZXtcclxuICAgICAgICAgICAgICAvLyAgcmV0PWxpc3RbMF07XHJcbiAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgdG9KU09OKCkge1xyXG5cclxuICAgICAgICB2YXIgcmV0ID0gc3VwZXIudG9KU09OKCk7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0RnJvbUhUTUwocmV0KTtcclxuICAgICAgICBpZih0aGlzLmZvcm1hdCl7XHJcbiAgICAgICAgICAgIHJldC5mb3JtYXQ9dGhpcy5mb3JtYXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGVzdCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHJldCkge1xyXG4gICAgICAgICAgICB0ZXN0Kys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGVzdCA9PT0gMSlcclxuICAgICAgICAgICAgcmV0ID0gcmV0LnRleHQ7Ly9zaG9ydCB2ZXJzaW9uXHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgdCA9IG5ldyBSVGV4dCgpO1xyXG4gICAgdC52YWx1ZSA9IFwiYTxlbT5iPHN0cm9uZz5jZDwvc3Ryb25nPmU8L2VtPjxzcGFuIHN0eWxlPSdjb2xvcjogcmdiKDI0MSwgMTk2LCAxNSk7JyBkYXRhLW1jZS1zdHlsZT0nY29sb3I6ICNmMWM0MGY7Jz5mZzxzcGFuIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTg2LCA1NSwgNDIpOycgZGF0YS1tY2Utc3R5bGU9J2JhY2tncm91bmQtY29sb3I6ICNiYTM3MmE7Jz5oPC9zcGFuPjwvc3Bhbj48c3BhbiBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjogcmdiKDE4NiwgNTUsIDQyKTsnIGRhdGEtbWNlLXN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOiAjYmEzNzJhOyc+aWo8c3BhbiBzdHlsZT0nZm9udC1zaXplOiAxNHB0OycgZGF0YS1tY2Utc3R5bGU9J2ZvbnQtc2l6ZTogMTRwdDsnPms8L3NwYW4+PC9zcGFuPjxzcGFuIHN0eWxlPSdmb250LXNpemU6IDE0cHQ7JyBkYXRhLW1jZS1zdHlsZT0nZm9udC1zaXplOiAxNHB0Oyc+bDxzcGFuIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsnIGRhdGEtbWNlLXN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsnPm08L3NwYW4+PC9zcGFuPjxzcGFuIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsnIGRhdGEtbWNlLXN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsnPm5vPC9zcGFuPlwiO1xyXG5cclxuICAgIHZhciBvYmI6IFJUZXh0ID0gdC50b0pTT04oKTtcclxuICAgIC8vdmFyIHRlc3QgPSBSVGV4dC5mcm9tSlNPTihvYmIpO1xyXG5cclxuXHJcbn1cclxuIl19