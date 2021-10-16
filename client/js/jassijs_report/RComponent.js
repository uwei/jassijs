var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Property"], function (require, exports, Component_1, Registry_1, Jassi_1, Panel_1, Property_1) {
    "use strict";
    var RComponent_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RComponent = exports.$ReportComponent = exports.ReportComponentProperties = void 0;
    //Limitations Styles1 -> not implemented	style as array e.g. style: ['quote', 'small']  
    class ReportComponentProperties extends Component_1.UIComponentProperties {
    }
    exports.ReportComponentProperties = ReportComponentProperties;
    function $ReportComponent(properties) {
        return function (pclass) {
            Registry_1.default.register("$ReportComponent", pclass, properties);
        };
    }
    exports.$ReportComponent = $ReportComponent;
    let RComponent = RComponent_1 = class RComponent extends Panel_1.Panel {
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "nothing";
        }
        onstylechanged(func) {
            this.addEvent("stylechanged", func);
        }
        set counter(value) {
            this._counter = value;
            if (value === undefined)
                $(this.domWrapper).removeAttr("value");
            else
                $(this.domWrapper).attr("value", value);
        }
        get counter() {
            return this._counter;
        }
        set listType(value) {
            this._listType = value;
            if (value === undefined)
                $(this.domWrapper).css("list-style-type", "");
            else
                $(this.domWrapper).css("list-style-type", value);
        }
        get listType() {
            return this._listType;
        }
        get fillColor() {
            return this._fillColor;
        }
        set fillColor(value) {
            this._fillColor = value;
            $(this.dom).css("background-color", value);
        }
        get colSpan() {
            return this._colSpan;
        }
        set colSpan(value) {
            var _a, _b, _c, _d;
            $(this.domWrapper).attr("colspan", value === undefined ? "" : value);
            this._colSpan = value;
            if ((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._parent) === null || _b === void 0 ? void 0 : _b.updateLayout)
                (_d = (_c = this._parent) === null || _c === void 0 ? void 0 : _c._parent) === null || _d === void 0 ? void 0 : _d.updateLayout(true);
        }
        get rowSpan() {
            return this._rowSpan;
        }
        set rowSpan(value) {
            var _a, _b, _c, _d;
            $(this.domWrapper).attr("rowspan", value === undefined ? "" : value);
            this._rowSpan = value;
            if ((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._parent) === null || _b === void 0 ? void 0 : _b.updateLayout)
                (_d = (_c = this._parent) === null || _c === void 0 ? void 0 : _c._parent) === null || _d === void 0 ? void 0 : _d.updateLayout(true);
        }
        get border() {
            return this._border;
        }
        set border(value) {
            this._border = value;
            if (value === undefined)
                value = [false, false, false, false];
            $(this.domWrapper).css("border-left-style", value[0] ? "solid" : "none");
            $(this.domWrapper).css("border-top-style", value[1] ? "solid" : "none");
            $(this.domWrapper).css("border-right-style", value[2] ? "solid" : "none");
            $(this.domWrapper).css("border-bottom-style", value[3] ? "solid" : "none");
        }
        get width() {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                return this._parent.getChildWidth(this);
            else
                return this._width;
        }
        set width(value) {
            var _a;
            if (value && Number.parseInt(value).toString() === value) {
                value = Number.parseInt(value);
            }
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                this._parent.setChildWidth(this, value);
            else {
                this._width = value;
                super.width = value;
            }
        }
        get height() {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) !== undefined)
                return this._parent.getChildHeight(this);
            else
                return this._height;
        }
        set height(value) {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) !== undefined)
                this._parent.setChildHeight(this, value);
            else {
                this._height = value;
                console.log(value);
                super.height = value;
            }
        }
        get bold() {
            return this._bold;
        }
        set bold(value) {
            this._bold = value;
            $(this.dom).css("font-weight", value ? "bold" : "normal");
            this.callEvent("stylechanged", "font-weight", value);
        }
        get italics() {
            return this._italics;
        }
        set italics(value) {
            this._italics = value;
            $(this.dom).css("font-style", value ? "italic" : "normal");
            this.callEvent("stylechanged", "font-style", value);
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
            this.callEvent("stylechanged", "font", value);
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
            this.callEvent("stylechanged", "fontSize", value);
        }
        get background() {
            return this._background;
        }
        set background(value) {
            this._background = value;
            $(this.dom).css("background-color", value);
            this.callEvent("stylechanged", "background", value);
        }
        get color() {
            return this._color;
        }
        set color(value) {
            this._color = value;
            $(this.dom).css("color", value);
            this.callEvent("stylechanged", "color", value);
        }
        get alignment() {
            return this._alignment;
        }
        set alignment(value) {
            this._alignment = value;
            $(this.dom).css("text-align", value);
            this.callEvent("stylechanged", "alignment", value);
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
            this.callEvent("stylechanged", "decoration", value);
        }
        get decorationColor() {
            return this._decorationColor;
        }
        set decorationColor(value) {
            this._decorationColor = value;
            $(this.dom).css("textDecorationColor", value);
            this.callEvent("stylechanged", "textDecorationColor", value);
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
            this.callEvent("stylechanged", "decorationStyle", value);
        }
        static findReport(parent) {
            if (parent === undefined)
                return undefined;
            if ((parent === null || parent === void 0 ? void 0 : parent.reporttype) === "report")
                return parent;
            else
                return RComponent_1.findReport(parent._parent);
        }
        get style() {
            return this._style;
        }
        set style(value) {
            var old = this._style;
            this._style = value;
            var report = RComponent_1.findReport(this);
            if (report) {
                report.styleContainer._components.forEach((comp) => {
                    if (comp.name === old) {
                        $(this.dom).removeClass(comp.styleid);
                    }
                });
                report.styleContainer._components.forEach((comp) => {
                    if (comp.name === value) {
                        $(this.dom).addClass(comp.styleid);
                    }
                });
            }
            //  super.width = value;
        }
        get lineHeight() {
            return this._lineHeight;
        }
        set lineHeight(value) {
            this._lineHeight = value;
            $(this.dom).css("line-height", value);
            this.callEvent("stylechanged", "lineHeight", value);
            //  super.width = value;
        }
        get margin() {
            return this._margin;
        }
        set margin(value) {
            if (value === undefined) {
                this._margin = value;
                $(this.dom).css("margin", "");
            }
            else {
                if (Number.isInteger(value)) {
                    //@ts-ignore
                    value = [value, value, value, value];
                }
                if (value.length === 2) {
                    value = [value[0], value[1], value[0], value[1]];
                }
                this._margin = value;
                $(this.dom).css("margin", value[1] + "px " + value[2] + "px " + value[3] + "px " + value[0] + "px ");
            }
        }
        fromJSON(ob) {
            var ret = this;
            if (ob.foreach) {
                ret.foreach = ob.foreach;
                delete ob.foreach;
            }
            if (ob.colSpan) {
                ret.colSpan = ob.colSpan;
                delete ob.colSpan;
            }
            if (ob.rowSpan) {
                ret.rowSpan = ob.rowSpan;
                delete ob.rowSpan;
            }
            if (ob.height) {
                ret.height = ob.height;
                delete ob.height;
            }
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
            if (ob.style) {
                ret.style = ob.style;
                delete ob.style;
            }
            if (ob.fillColor) {
                ret.fillColor = ob.fillColor;
                delete ob.fillColor;
            }
            if (ob.border) {
                ret.border = ob.border;
                delete ob.border;
            }
            if (ob.counter) {
                ret.counter = ob.counter;
                delete ob.counter;
            }
            if (ob.listType) {
                ret.listType = ob.listType;
                delete ob.listType;
            }
            if (ob.margin) {
                ret.margin = ob.margin;
                delete ob.margin;
            }
            if (ob.width) {
                ret.width = ob.width;
                delete ob.width;
            }
            ret.otherProperties = ob;
            return ret;
        }
        toJSON() {
            var _a, _b;
            var ret = {};
            if (this.colSpan !== undefined)
                ret.colSpan = this.colSpan;
            if (this.rowSpan !== undefined)
                ret.rowSpan = this.rowSpan;
            if (this.foreach !== undefined)
                ret.foreach = this.foreach;
            if (this.width !== undefined && !((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth))
                ret.width = this.width;
            if (this.height !== undefined && !((_b = this._parent) === null || _b === void 0 ? void 0 : _b.setChildHeight))
                ret.height = this.height;
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
            if (this.style !== undefined)
                ret.style = this.style;
            if (this.fillColor !== undefined)
                ret.fillColor = this.fillColor;
            if (this.border !== undefined)
                ret.border = this.border;
            if (this.counter)
                ret.counter = this.counter;
            if (this.listType)
                ret.listType = this.listType;
            if (this.margin)
                ret.margin = this.margin;
            if (this.width && (this === null || this === void 0 ? void 0 : this._parent.reporttype) === "column")
                ret.width = this.width;
            Object.assign(ret, this["otherProperties"]);
            return ret;
        }
    };
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String)
    ], RComponent.prototype, "foreach", void 0);
    __decorate([
        Property_1.$Property({
            default: undefined,
            isVisible: (component) => {
                var _a;
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "ol";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "counter", null);
    __decorate([
        Property_1.$Property({
            name: "listType",
            default: undefined,
            isVisible: (component) => {
                var _a, _b;
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "ul" || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "ol";
            },
            chooseFrom: function (it) {
                if (it._parent.reporttype === "ol")
                    return ["lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "none"];
                else
                    return ["square", "circle", "none"];
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "listType", null);
    __decorate([
        Property_1.$Property({
            type: "color", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "fillColor", null);
    __decorate([
        Property_1.$Property({
            type: "string", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "colSpan", null);
    __decorate([
        Property_1.$Property({
            type: "string", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "rowSpan", null);
    __decorate([
        Property_1.$Property({
            type: "boolean[]",
            default: [false, false, false, false],
            isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns";
            },
            description: "border of the tablecell: left, top, right, bottom"
        }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RComponent.prototype, "border", null);
    __decorate([
        Property_1.$Property({
            type: "string", isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns" || component.reporttype === "image";
            }
        }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RComponent.prototype, "width", null);
    __decorate([
        Property_1.$Property({
            type: "string", isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns" || component.reporttype === "image";
            }
        }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RComponent.prototype, "height", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RComponent.prototype, "bold", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RComponent.prototype, "italics", null);
    __decorate([
        Property_1.$Property({ chooseFrom: ["Alegreya", "AlegreyaSans", "AlegreyaSansSC", "AlegreyaSC", "AlmendraSC", "Amaranth", "Andada", "AndadaSC", "AnonymousPro", "ArchivoNarrow", "Arvo", "Asap", "AveriaLibre", "AveriaSansLibre", "AveriaSerifLibre", "Cambay", "Caudex", "CrimsonText", "Cuprum", "Economica", "Exo2", "Exo", "ExpletusSans", "FiraSans", "JosefinSans", "JosefinSlab", "Karla", "Lato", "LobsterTwo", "Lora", "Marvel", "Merriweather", "MerriweatherSans", "Nobile", "NoticiaText", "Overlock", "Philosopher", "PlayfairDisplay", "PlayfairDisplaySC", "PT_Serif-Web", "Puritan", "Quantico", "QuattrocentoSans", "Quicksand", "Rambla", "Rosario", "Sansation", "Sarabun", "Scada", "Share", "Sitara", "SourceSansPro", "TitilliumWeb", "Volkhov", "Vollkorn"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "font", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "fontSize", null);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "background", null);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "color", null);
    __decorate([
        Property_1.$Property({ chooseFrom: ["left", "center", "right"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "alignment", null);
    __decorate([
        Property_1.$Property({ chooseFrom: ["underline", "lineThrough", "overline"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decoration", null);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decorationColor", null);
    __decorate([
        Property_1.$Property({ chooseFrom: ["dashed", "dotted", "double", "wavy"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decorationStyle", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "style", null);
    __decorate([
        Property_1.$Property({ default: 1 }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "lineHeight", null);
    __decorate([
        Property_1.$Property({ type: "number[]", description: "margin left, top, right, bottom" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RComponent.prototype, "margin", null);
    RComponent = RComponent_1 = __decorate([
        Jassi_1.$Class("jassijs_report.ReportComponent"),
        Property_1.$Property({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], RComponent);
    exports.RComponent = RComponent;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2phc3NpanNfcmVwb3J0L1JDb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFPQSx3RkFBd0Y7SUFFeEYsTUFBYSx5QkFBMEIsU0FBUSxpQ0FBcUI7S0FFbkU7SUFGRCw4REFFQztJQUNELFNBQWdCLGdCQUFnQixDQUFDLFVBQXFDO1FBQ2xFLE9BQU8sVUFBVSxNQUFNO1lBQ25CLGtCQUFRLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBSkQsNENBSUM7SUFNRCxJQUFhLFVBQVUsa0JBQXZCLE1BQWEsVUFBVyxTQUFRLGFBQUs7UUEwQmpDLFlBQVksVUFBVSxHQUFHLFNBQVM7WUFDOUIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBSHRCLGVBQVUsR0FBVyxTQUFTLENBQUM7UUFLL0IsQ0FBQztRQUNELGNBQWMsQ0FBQyxJQUFJO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQU9ELElBQUksT0FBTyxDQUFDLEtBQWE7WUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxLQUFLLEtBQUssU0FBUztnQkFDbkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7O2dCQUV2QyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELElBQUksT0FBTztZQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN6QixDQUFDO1FBaUJELElBQUksUUFBUSxDQUFDLEtBQWE7WUFDdEIs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ZXNDb250ZW50IjpbImltcG9ydCB7IFVJQ29tcG9uZW50UHJvcGVydGllcyB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xuaW1wb3J0IHsgUlN0eWxlIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JTdHlsZVwiO1xuLy9MaW1pdGF0aW9ucyBTdHlsZXMxIC0+IG5vdCBpbXBsZW1lbnRlZFx0c3R5bGUgYXMgYXJyYXkgZS5nLiBzdHlsZTogWydxdW90ZScsICdzbWFsbCddICBcblxuZXhwb3J0IGNsYXNzIFJlcG9ydENvbXBvbmVudFByb3BlcnRpZXMgZXh0ZW5kcyBVSUNvbXBvbmVudFByb3BlcnRpZXMge1xuXG59XG5leHBvcnQgZnVuY3Rpb24gJFJlcG9ydENvbXBvbmVudChwcm9wZXJ0aWVzOiBSZXBvcnRDb21wb25lbnRQcm9wZXJ0aWVzKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbiAocGNsYXNzKSB7XG4gICAgICAgIHJlZ2lzdHJ5LnJlZ2lzdGVyKFwiJFJlcG9ydENvbXBvbmVudFwiLCBwY2xhc3MsIHByb3BlcnRpZXMpO1xuICAgIH1cbn1cblxuXG5cbkAkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SZXBvcnRDb21wb25lbnRcIilcbkAkUHJvcGVydHkoeyBoaWRlQmFzZUNsYXNzUHJvcGVydGllczogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIFJDb21wb25lbnQgZXh0ZW5kcyBQYW5lbCB7XG4gICAgcHJpdmF0ZSBfY29sU3BhbjogbnVtYmVyO1xuICAgIHByaXZhdGUgX3Jvd1NwYW46IG51bWJlcjtcbiAgICBAJFByb3BlcnR5KClcbiAgICBmb3JlYWNoOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfd2lkdGg6IGFueTtcbiAgICBwcml2YXRlIF9oZWlnaHQ6IGFueTtcbiAgICBwcml2YXRlIF9ib2xkOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2RlY29yYXRpb246IHN0cmluZztcbiAgICBwcml2YXRlIF9kZWNvcmF0aW9uU3R5bGU6IHN0cmluZztcbiAgICBwcml2YXRlIF9kZWNvcmF0aW9uQ29sb3I6IHN0cmluZztcbiAgICBwcml2YXRlIF9jb2xvcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ZvbnRTaXplOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfbGluZUhlaWdodDogbnVtYmVyO1xuICAgIHByaXZhdGUgX2l0YWxpY3M6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfYWxpZ25tZW50OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfYmFja2dyb3VuZDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ZvbnQ6IHN0cmluZztcbiAgICBwcml2YXRlIF9zdHlsZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ZpbGxDb2xvcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2JvcmRlcjogYm9vbGVhbltdO1xuICAgIHByaXZhdGUgX2NvdW50ZXI6IG51bWJlcjtcbiAgICBwcml2YXRlIF9saXN0VHlwZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX21hcmdpbjogbnVtYmVyW107XG4gICAgcmVwb3J0dHlwZTogc3RyaW5nID0gXCJub3RoaW5nXCI7XG4gICAgb3RoZXJQcm9wZXJ0aWVzOiBhbnk7XG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcyA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcihwcm9wZXJ0aWVzKTtcblxuICAgIH1cbiAgICBvbnN0eWxlY2hhbmdlZChmdW5jKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgZnVuYyk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoe1xuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgIGlzVmlzaWJsZTogKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5fcGFyZW50Py5yZXBvcnR0eXBlID09PSBcIm9sXCI7XG4gICAgICAgIH1cbiAgICB9KVxuICAgIHNldCBjb3VudGVyKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fY291bnRlciA9IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICQodGhpcy5kb21XcmFwcGVyKS5yZW1vdmVBdHRyKFwidmFsdWVcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICQodGhpcy5kb21XcmFwcGVyKS5hdHRyKFwidmFsdWVcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBnZXQgY291bnRlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlcjtcbiAgICB9XG5cblxuXG4gICAgQCRQcm9wZXJ0eSh7XG4gICAgICAgIG5hbWU6IFwibGlzdFR5cGVcIixcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBpc1Zpc2libGU6IChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuX3BhcmVudD8ucmVwb3J0dHlwZSA9PT0gXCJ1bFwiIHx8IGNvbXBvbmVudC5fcGFyZW50Py5yZXBvcnR0eXBlID09PSBcIm9sXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGNob29zZUZyb206IGZ1bmN0aW9uIChpdCkge1xuICAgICAgICAgICAgaWYgKGl0Ll9wYXJlbnQucmVwb3J0dHlwZSA9PT0gXCJvbFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBbXCJsb3dlci1hbHBoYVwiLCBcInVwcGVyLWFscGhhXCIsIFwibG93ZXItcm9tYW5cIiwgXCJ1cHBlci1yb21hblwiLCBcIm5vbmVcIl07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcInNxdWFyZVwiLCBcImNpcmNsZVwiLCBcIm5vbmVcIl07XG4gICAgICAgIH1cbiAgICB9KVxuICAgIHNldCBsaXN0VHlwZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xpc3RUeXBlID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImxpc3Qtc3R5bGUtdHlwZVwiLCBcIlwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImxpc3Qtc3R5bGUtdHlwZVwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIGdldCBsaXN0VHlwZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdFR5cGU7XG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFwiY29sb3JcIiwgaXNWaXNpYmxlOiAoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAvL29ubHkgaW4gdGFibGUgYW5kIGNvbHVtbiB3aWR0aCBpcyBwb3NpYmxlXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50Ll9wYXJlbnQ/LnJlcG9ydHR5cGUgPT09IFwidGFibGVyb3dcIjtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgZ2V0IGZpbGxDb2xvcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsbENvbG9yO1xuICAgIH1cblxuICAgIHNldCBmaWxsQ29sb3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9maWxsQ29sb3IgPSB2YWx1ZTtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCB2YWx1ZSk7XG5cbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsIGlzVmlzaWJsZTogKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgLy9vbmx5IGluIHRhYmxlIGFuZCBjb2x1bW4gd2lkdGggaXMgcG9zaWJsZVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5fcGFyZW50Py5yZXBvcnR0eXBlID09PSBcInRhYmxlcm93XCI7XG4gICAgICAgIH1cbiAgICB9KVxuICAgIGdldCBjb2xTcGFuKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xTcGFuO1xuICAgIH1cblxuICAgIHNldCBjb2xTcGFuKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmF0dHIoXCJjb2xzcGFuXCIsIHZhbHVlID09PSB1bmRlZmluZWQgPyBcIlwiIDogdmFsdWUpO1xuICAgICAgICB0aGlzLl9jb2xTcGFuID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQ/Ll9wYXJlbnQ/LnVwZGF0ZUxheW91dClcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudD8uX3BhcmVudD8udXBkYXRlTGF5b3V0KHRydWUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIiwgaXNWaXNpYmxlOiAoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAvL29ubHkgaW4gdGFibGUgYW5kIGNvbHVtbiB3aWR0aCBpcyBwb3NpYmxlXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50Ll9wYXJlbnQ/LnJlcG9ydHR5cGUgPT09IFwidGFibGVyb3dcIjtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgZ2V0IHJvd1NwYW4oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvd1NwYW47XG4gICAgfVxuXG4gICAgc2V0IHJvd1NwYW4odmFsdWU6IG51bWJlcikge1xuICAgICAgICAkKHRoaXMuZG9tV3JhcHBlcikuYXR0cihcInJvd3NwYW5cIiwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3Jvd1NwYW4gPSB2YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudD8uX3BhcmVudD8udXBkYXRlTGF5b3V0KVxuICAgICAgICAgICAgdGhpcy5fcGFyZW50Py5fcGFyZW50Py51cGRhdGVMYXlvdXQodHJ1ZSk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBcImJvb2xlYW5bXVwiLFxuICAgICAgICBkZWZhdWx0OiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLFxuICAgICAgICBpc1Zpc2libGU6IChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIC8vb25seSBpbiB0YWJsZSBhbmQgY29sdW1uIHdpZHRoIGlzIHBvc2libGVcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuX3BhcmVudD8uc2V0Q2hpbGRXaWR0aCB8fCBjb21wb25lbnQuX3BhcmVudD8ucmVwb3J0dHlwZSA9PT0gXCJjb2x1bW5zXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcImJvcmRlciBvZiB0aGUgdGFibGVjZWxsOiBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b21cIlxuICAgIH0pXG4gICAgZ2V0IGJvcmRlcigpOiBib29sZWFuW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm9yZGVyO1xuICAgIH1cbiAgICBzZXQgYm9yZGVyKHZhbHVlOiBib29sZWFuW10pIHtcbiAgICAgICAgdGhpcy5fYm9yZGVyID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdmFsdWUgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdO1xuXG5cbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImJvcmRlci1sZWZ0LXN0eWxlXCIsIHZhbHVlWzBdID8gXCJzb2xpZFwiIDogXCJub25lXCIpO1xuICAgICAgICAkKHRoaXMuZG9tV3JhcHBlcikuY3NzKFwiYm9yZGVyLXRvcC1zdHlsZVwiLCB2YWx1ZVsxXSA/IFwic29saWRcIiA6IFwibm9uZVwiKTtcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImJvcmRlci1yaWdodC1zdHlsZVwiLCB2YWx1ZVsyXSA/IFwic29saWRcIiA6IFwibm9uZVwiKTtcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImJvcmRlci1ib3R0b20tc3R5bGVcIiwgdmFsdWVbM10gPyBcInNvbGlkXCIgOiBcIm5vbmVcIik7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLCBpc1Zpc2libGU6IChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIC8vb25seSBpbiB0YWJsZSBhbmQgY29sdW1uIHdpZHRoIGlzIHBvc2libGVcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuX3BhcmVudD8uc2V0Q2hpbGRXaWR0aCB8fCBjb21wb25lbnQuX3BhcmVudD8ucmVwb3J0dHlwZSA9PT0gXCJjb2x1bW5zXCIgfHwgY29tcG9uZW50LnJlcG9ydHR5cGUgPT09IFwiaW1hZ2VcIjtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBnZXQgd2lkdGgoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudD8uc2V0Q2hpbGRXaWR0aCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5nZXRDaGlsZFdpZHRoKHRoaXMpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgfVxuICAgIHNldCB3aWR0aCh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh2YWx1ZSAmJiBOdW1iZXIucGFyc2VJbnQodmFsdWUpLnRvU3RyaW5nKCkgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IE51bWJlci5wYXJzZUludCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudD8uc2V0Q2hpbGRXaWR0aCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnNldENoaWxkV2lkdGgodGhpcywgdmFsdWUpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gICAgICAgICAgICBzdXBlci53aWR0aCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIEAkUHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLCBpc1Zpc2libGU6IChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIC8vb25seSBpbiB0YWJsZSBhbmQgY29sdW1uIHdpZHRoIGlzIHBvc2libGVcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuX3BhcmVudD8uc2V0Q2hpbGRIZWlnaHQgfHwgY29tcG9uZW50Ll9wYXJlbnQ/LnJlcG9ydHR5cGUgPT09IFwiY29sdW1uc1wiIHx8IGNvbXBvbmVudC5yZXBvcnR0eXBlID09PSBcImltYWdlXCI7XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgZ2V0IGhlaWdodCgpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50Py5zZXRDaGlsZEhlaWdodCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5nZXRDaGlsZEhlaWdodCh0aGlzKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICB9XG4gICAgc2V0IGhlaWdodCh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQ/LnNldENoaWxkSGVpZ2h0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuc2V0Q2hpbGRIZWlnaHQodGhpcywgdmFsdWUpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2codmFsdWUpO1xuICAgICAgICAgICAgc3VwZXIuaGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBAJFByb3BlcnR5KClcbiAgICBnZXQgYm9sZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvbGQ7XG4gICAgfVxuICAgIHNldCBib2xkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2JvbGQgPSB2YWx1ZTtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZm9udC13ZWlnaHRcIiwgdmFsdWUgPyBcImJvbGRcIiA6IFwibm9ybWFsXCIpO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInN0eWxlY2hhbmdlZFwiLCBcImZvbnQtd2VpZ2h0XCIsIHZhbHVlKTtcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgZ2V0IGl0YWxpY3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGFsaWNzO1xuICAgIH1cbiAgICBzZXQgaXRhbGljcyh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9pdGFsaWNzID0gdmFsdWU7XG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImZvbnQtc3R5bGVcIiwgdmFsdWUgPyBcIml0YWxpY1wiIDogXCJub3JtYWxcIik7XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwic3R5bGVjaGFuZ2VkXCIsIFwiZm9udC1zdHlsZVwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyBjaG9vc2VGcm9tOiBbXCJBbGVncmV5YVwiLCBcIkFsZWdyZXlhU2Fuc1wiLCBcIkFsZWdyZXlhU2Fuc1NDXCIsIFwiQWxlZ3JleWFTQ1wiLCBcIkFsbWVuZHJhU0NcIiwgXCJBbWFyYW50aFwiLCBcIkFuZGFkYVwiLCBcIkFuZGFkYVNDXCIsIFwiQW5vbnltb3VzUHJvXCIsIFwiQXJjaGl2b05hcnJvd1wiLCBcIkFydm9cIiwgXCJBc2FwXCIsIFwiQXZlcmlhTGlicmVcIiwgXCJBdmVyaWFTYW5zTGlicmVcIiwgXCJBdmVyaWFTZXJpZkxpYnJlXCIsIFwiQ2FtYmF5XCIsIFwiQ2F1ZGV4XCIsIFwiQ3JpbXNvblRleHRcIiwgXCJDdXBydW1cIiwgXCJFY29ub21pY2FcIiwgXCJFeG8yXCIsIFwiRXhvXCIsIFwiRXhwbGV0dXNTYW5zXCIsIFwiRmlyYVNhbnNcIiwgXCJKb3NlZmluU2Fuc1wiLCBcIkpvc2VmaW5TbGFiXCIsIFwiS2FybGFcIiwgXCJMYXRvXCIsIFwiTG9ic3RlclR3b1wiLCBcIkxvcmFcIiwgXCJNYXJ2ZWxcIiwgXCJNZXJyaXdlYXRoZXJcIiwgXCJNZXJyaXdlYXRoZXJTYW5zXCIsIFwiTm9iaWxlXCIsIFwiTm90aWNpYVRleHRcIiwgXCJPdmVybG9ja1wiLCBcIlBoaWxvc29waGVyXCIsIFwiUGxheWZhaXJEaXNwbGF5XCIsIFwiUGxheWZhaXJEaXNwbGF5U0NcIiwgXCJQVF9TZXJpZi1XZWJcIiwgXCJQdXJpdGFuXCIsIFwiUXVhbnRpY29cIiwgXCJRdWF0dHJvY2VudG9TYW5zXCIsIFwiUXVpY2tzYW5kXCIsIFwiUmFtYmxhXCIsIFwiUm9zYXJpb1wiLCBcIlNhbnNhdGlvblwiLCBcIlNhcmFidW5cIiwgXCJTY2FkYVwiLCBcIlNoYXJlXCIsIFwiU2l0YXJhXCIsIFwiU291cmNlU2Fuc1Byb1wiLCBcIlRpdGlsbGl1bVdlYlwiLCBcIlZvbGtob3ZcIiwgXCJWb2xsa29yblwiXSB9KVxuICAgIGdldCBmb250KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb250O1xuICAgIH1cbiAgICBzZXQgZm9udCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcbiAgICAgICAgLy9jb3B5IGZyb20gQ1NTUHJvcGVydGllc1xuICAgICAgICB2YXIgYXBpID0gJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT0nO1xuICAgICAgICB2YXIgc2ZvbnQgPSB2YWx1ZS5yZXBsYWNlQWxsKFwiIFwiLCBcIitcIilcbiAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIi0tPlwiICsgYXBpICsgc2ZvbnQpKSB7Ly9cIi0tPmh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1BY2xvbmljYVwiPlxuICAgICAgICAgICAgamFzc2lqcy5teVJlcXVpcmUoYXBpICsgc2ZvbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJmb250X2ZhbWlseVwiLCBcIlwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZm9udF9mYW1pbHlcIiwgdmFsdWUpO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInN0eWxlY2hhbmdlZFwiLCBcImZvbnRcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KClcbiAgICBnZXQgZm9udFNpemUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgIH1cbiAgICBzZXQgZm9udFNpemUodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9mb250U2l6ZSA9IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICQodGhpcy5kb20pLmNzcyhcImZvbnQtc2l6ZVwiLCBcIlwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZm9udC1zaXplXCIsIHZhbHVlICsgXCJweFwiKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJmb250U2l6ZVwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImNvbG9yXCIgfSlcbiAgICBnZXQgYmFja2dyb3VuZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZDtcbiAgICB9XG4gICAgc2V0IGJhY2tncm91bmQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kID0gdmFsdWU7XG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgdmFsdWUpO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInN0eWxlY2hhbmdlZFwiLCBcImJhY2tncm91bmRcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJjb2xvclwiIH0pXG4gICAgZ2V0IGNvbG9yKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICB9XG4gICAgc2V0IGNvbG9yKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiY29sb3JcIiwgdmFsdWUpO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInN0eWxlY2hhbmdlZFwiLCBcImNvbG9yXCIsIHZhbHVlKTtcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7IGNob29zZUZyb206IFtcImxlZnRcIiwgXCJjZW50ZXJcIiwgXCJyaWdodFwiXSB9KVxuICAgIGdldCBhbGlnbm1lbnQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsaWdubWVudDtcbiAgICB9XG4gICAgc2V0IGFsaWdubWVudCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2FsaWdubWVudCA9IHZhbHVlO1xuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJ0ZXh0LWFsaWduXCIsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJhbGlnbm1lbnRcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1widW5kZXJsaW5lXCIsIFwibGluZVRocm91Z2hcIiwgXCJvdmVybGluZVwiXSB9KVxuICAgIGdldCBkZWNvcmF0aW9uKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWNvcmF0aW9uO1xuICAgIH1cbiAgICBzZXQgZGVjb3JhdGlvbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2RlY29yYXRpb24gPSB2YWx1ZTtcbiAgICAgICAgdmFyIHZhbCA9IFwibm9uZVwiO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwidW5kZXJsaW5lXCIpXG4gICAgICAgICAgICB2YWwgPSBcInVuZGVybGluZVwiO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwibGluZVRocm91Z2hcIilcbiAgICAgICAgICAgIHZhbCA9IFwibGluZS10aHJvdWdoXCI7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJvdmVybGluZVwiKVxuICAgICAgICAgICAgdmFsID0gXCJvdmVybGluZVwiO1xuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJ0ZXh0LWRlY29yYXRpb25cIiwgdmFsKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJkZWNvcmF0aW9uXCIsIHZhbHVlKTtcbiAgICB9XG5cblxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImNvbG9yXCIgfSlcbiAgICBnZXQgZGVjb3JhdGlvbkNvbG9yKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWNvcmF0aW9uQ29sb3I7XG4gICAgfVxuICAgIHNldCBkZWNvcmF0aW9uQ29sb3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9kZWNvcmF0aW9uQ29sb3IgPSB2YWx1ZTtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwidGV4dERlY29yYXRpb25Db2xvclwiLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwic3R5bGVjaGFuZ2VkXCIsIFwidGV4dERlY29yYXRpb25Db2xvclwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyBjaG9vc2VGcm9tOiBbXCJkYXNoZWRcIiwgXCJkb3R0ZWRcIiwgXCJkb3VibGVcIiwgXCJ3YXZ5XCJdIH0pXG4gICAgZ2V0IGRlY29yYXRpb25TdHlsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVjb3JhdGlvblN0eWxlO1xuICAgIH1cbiAgICBzZXQgZGVjb3JhdGlvblN0eWxlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZGVjb3JhdGlvblN0eWxlID0gdmFsdWU7XG4gICAgICAgIHZhciB2YWwgPSBcInNvbGlkXCI7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJkYXNoZWRcIilcbiAgICAgICAgICAgIHZhbCA9IFwiZGFzaGVkXCI7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJkb3R0ZWRcIilcbiAgICAgICAgICAgIHZhbCA9IFwiZG90dGVkXCI7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJkb3VibGVcIilcbiAgICAgICAgICAgIHZhbCA9IFwiZG91YmxlXCI7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJ3YXZ5XCIpXG4gICAgICAgICAgICB2YWwgPSBcIndhdnlcIjtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwidGV4dERlY29yYXRpb25TdHlsZVwiLCB2YWwpO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInN0eWxlY2hhbmdlZFwiLCBcImRlY29yYXRpb25TdHlsZVwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIHN0YXRpYyBmaW5kUmVwb3J0KHBhcmVudCk6IFJlcG9ydERlc2lnbiB7XG4gICAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChwYXJlbnQ/LnJlcG9ydHR5cGUgPT09IFwicmVwb3J0XCIpXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gUkNvbXBvbmVudC5maW5kUmVwb3J0KHBhcmVudC5fcGFyZW50KTtcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgZ2V0IHN0eWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHlsZTtcbiAgICB9XG5cbiAgICBzZXQgc3R5bGUodmFsdWU6IHN0cmluZykge1xuICAgICAgICB2YXIgb2xkID0gdGhpcy5fc3R5bGU7XG4gICAgICAgIHRoaXMuX3N0eWxlID0gdmFsdWU7XG4gICAgICAgIHZhciByZXBvcnQgPSBSQ29tcG9uZW50LmZpbmRSZXBvcnQodGhpcyk7XG4gICAgICAgIGlmIChyZXBvcnQpIHtcbiAgICAgICAgICAgIHJlcG9ydC5zdHlsZUNvbnRhaW5lci5fY29tcG9uZW50cy5mb3JFYWNoKChjb21wOiBSU3R5bGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5uYW1lID09PSBvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmRvbSkucmVtb3ZlQ2xhc3MoY29tcC5zdHlsZWlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlcG9ydC5zdHlsZUNvbnRhaW5lci5fY29tcG9uZW50cy5mb3JFYWNoKChjb21wOiBSU3R5bGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5uYW1lID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMuZG9tKS5hZGRDbGFzcyhjb21wLnN0eWxlaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyAgc3VwZXIud2lkdGggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogMSB9KVxuICAgIGdldCBsaW5lSGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saW5lSGVpZ2h0O1xuICAgIH1cbiAgICBzZXQgbGluZUhlaWdodCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2xpbmVIZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwibGluZS1oZWlnaHRcIiwgdmFsdWUpO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInN0eWxlY2hhbmdlZFwiLCBcImxpbmVIZWlnaHRcIiwgdmFsdWUpO1xuICAgICAgICAvLyAgc3VwZXIud2lkdGggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJudW1iZXJbXVwiLCBkZXNjcmlwdGlvbjogXCJtYXJnaW4gbGVmdCwgdG9wLCByaWdodCwgYm90dG9tXCIgfSlcbiAgICBnZXQgbWFyZ2luKCk6IG51bWJlcltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcmdpbjtcbiAgICB9XG4gICAgc2V0IG1hcmdpbih2YWx1ZTogbnVtYmVyW10pIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcmdpbiA9IHZhbHVlO1xuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwibWFyZ2luXCIsIFwiXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBbdmFsdWUsIHZhbHVlLCB2YWx1ZSwgdmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gW3ZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMF0sIHZhbHVlWzFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX21hcmdpbiA9IHZhbHVlO1xuXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJtYXJnaW5cIiwgdmFsdWVbMV0gKyBcInB4IFwiICsgdmFsdWVbMl0gKyBcInB4IFwiICsgdmFsdWVbM10gKyBcInB4IFwiICsgdmFsdWVbMF0gKyBcInB4IFwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZyb21KU09OKG9iOiBhbnkpOiBSQ29tcG9uZW50IHtcbiAgICAgICAgdmFyIHJldCA9IHRoaXM7XG5cbiAgICAgICAgaWYgKG9iLmZvcmVhY2gpIHtcbiAgICAgICAgICAgIHJldC5mb3JlYWNoID0gb2IuZm9yZWFjaDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5mb3JlYWNoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5jb2xTcGFuKSB7XG4gICAgICAgICAgICByZXQuY29sU3BhbiA9IG9iLmNvbFNwYW47XG4gICAgICAgICAgICBkZWxldGUgb2IuY29sU3BhbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2Iucm93U3Bhbikge1xuICAgICAgICAgICAgcmV0LnJvd1NwYW4gPSBvYi5yb3dTcGFuO1xuICAgICAgICAgICAgZGVsZXRlIG9iLnJvd1NwYW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmhlaWdodCkge1xuICAgICAgICAgICAgcmV0LmhlaWdodCA9IG9iLmhlaWdodDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLndpZHRoKSB7XG4gICAgICAgICAgICByZXQud2lkdGggPSBvYi53aWR0aDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuYm9sZCkge1xuICAgICAgICAgICAgcmV0LmJvbGQgPSBvYi5ib2xkO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmJvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLml0YWxpY3MpIHtcbiAgICAgICAgICAgIHJldC5pdGFsaWNzID0gb2IuaXRhbGljcztcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5pdGFsaWNzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5jb2xvcikge1xuICAgICAgICAgICAgcmV0LmNvbG9yID0gb2IuY29sb3I7XG4gICAgICAgICAgICBkZWxldGUgb2IuY29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmRlY29yYXRpb24pIHtcbiAgICAgICAgICAgIHJldC5kZWNvcmF0aW9uID0gb2IuZGVjb3JhdGlvbjtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5kZWNvcmF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5kZWNvcmF0aW9uU3R5bGUpIHtcbiAgICAgICAgICAgIHJldC5kZWNvcmF0aW9uU3R5bGUgPSBvYi5kZWNvcmF0aW9uU3R5bGU7XG4gICAgICAgICAgICBkZWxldGUgb2IuZGVjb3JhdGlvblN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5kZWNvcmF0aW9uQ29sb3IpIHtcbiAgICAgICAgICAgIHJldC5kZWNvcmF0aW9uQ29sb3IgPSBvYi5kZWNvcmF0aW9uQ29sb3I7XG4gICAgICAgICAgICBkZWxldGUgb2IuZGVjb3JhdGlvbkNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5mb250U2l6ZSkge1xuICAgICAgICAgICAgcmV0LmZvbnRTaXplID0gb2IuZm9udFNpemU7XG4gICAgICAgICAgICBkZWxldGUgb2IuZm9udFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmZvbnQpIHtcbiAgICAgICAgICAgIHJldC5mb250ID0gb2IuZm9udDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5mb250O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5saW5lSGVpZ2h0KSB7XG4gICAgICAgICAgICByZXQubGluZUhlaWdodCA9IG9iLmxpbmVIZWlnaHQ7XG4gICAgICAgICAgICBkZWxldGUgb2IubGluZUhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuYWxpZ25tZW50KSB7XG4gICAgICAgICAgICByZXQuYWxpZ25tZW50ID0gb2IuYWxpZ25tZW50O1xuICAgICAgICAgICAgZGVsZXRlIG9iLmFsaWdubWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuYmFja2dyb3VuZCkge1xuICAgICAgICAgICAgcmV0LmJhY2tncm91bmQgPSBvYi5iYWNrZ3JvdW5kO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmJhY2tncm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLnN0eWxlKSB7XG4gICAgICAgICAgICByZXQuc3R5bGUgPSBvYi5zdHlsZTtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5zdHlsZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuZmlsbENvbG9yKSB7XG4gICAgICAgICAgICByZXQuZmlsbENvbG9yID0gb2IuZmlsbENvbG9yO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmZpbGxDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuYm9yZGVyKSB7XG4gICAgICAgICAgICByZXQuYm9yZGVyID0gb2IuYm9yZGVyO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmJvcmRlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuY291bnRlcikge1xuICAgICAgICAgICAgcmV0LmNvdW50ZXIgPSBvYi5jb3VudGVyO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmNvdW50ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmxpc3RUeXBlKSB7XG4gICAgICAgICAgICByZXQubGlzdFR5cGUgPSBvYi5saXN0VHlwZTtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5saXN0VHlwZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IubWFyZ2luKSB7XG4gICAgICAgICAgICByZXQubWFyZ2luID0gb2IubWFyZ2luO1xuICAgICAgICAgICAgZGVsZXRlIG9iLm1hcmdpbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2Iud2lkdGgpIHtcbiAgICAgICAgICAgIHJldC53aWR0aCA9IG9iLndpZHRoO1xuICAgICAgICAgICAgZGVsZXRlIG9iLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHJldC5vdGhlclByb3BlcnRpZXMgPSBvYjtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgdG9KU09OKCkge1xuICAgICAgICB2YXIgcmV0OiBhbnkgPSB7fVxuICAgICAgICBpZiAodGhpcy5jb2xTcGFuICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuY29sU3BhbiA9IHRoaXMuY29sU3BhbjtcbiAgICAgICAgaWYgKHRoaXMucm93U3BhbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0LnJvd1NwYW4gPSB0aGlzLnJvd1NwYW47XG4gICAgICAgIGlmICh0aGlzLmZvcmVhY2ggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5mb3JlYWNoID0gdGhpcy5mb3JlYWNoO1xuICAgICAgICBpZiAodGhpcy53aWR0aCAhPT0gdW5kZWZpbmVkICYmICF0aGlzLl9wYXJlbnQ/LnNldENoaWxkV2lkdGgpXG4gICAgICAgICAgICByZXQud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICBpZiAodGhpcy5oZWlnaHQgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5fcGFyZW50Py5zZXRDaGlsZEhlaWdodClcbiAgICAgICAgICAgIHJldC5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICBpZiAodGhpcy5ib2xkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuYm9sZCA9IHRoaXMuYm9sZDtcbiAgICAgICAgaWYgKHRoaXMuaXRhbGljcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0Lml0YWxpY3MgPSB0aGlzLml0YWxpY3M7XG4gICAgICAgIGlmICh0aGlzLmNvbG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuY29sb3IgPSB0aGlzLmNvbG9yO1xuICAgICAgICBpZiAodGhpcy5kZWNvcmF0aW9uICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvbiA9IHRoaXMuZGVjb3JhdGlvbjtcbiAgICAgICAgaWYgKHRoaXMuZGVjb3JhdGlvblN0eWxlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvblN0eWxlID0gdGhpcy5kZWNvcmF0aW9uU3R5bGU7XG4gICAgICAgIGlmICh0aGlzLmRlY29yYXRpb25Db2xvciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0LmRlY29yYXRpb25Db2xvciA9IHRoaXMuZGVjb3JhdGlvbkNvbG9yO1xuICAgICAgICBpZiAodGhpcy5mb250ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuZm9udCA9IHRoaXMuZm9udDtcbiAgICAgICAgaWYgKHRoaXMuZm9udFNpemUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XG4gICAgICAgIGlmICh0aGlzLmxpbmVIZWlnaHQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5saW5lSGVpZ2h0ID0gdGhpcy5saW5lSGVpZ2h0O1xuICAgICAgICBpZiAodGhpcy5hbGlnbm1lbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5hbGlnbm1lbnQgPSB0aGlzLmFsaWdubWVudDtcbiAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0LmJhY2tncm91bmQgPSB0aGlzLmJhY2tncm91bmQ7XG4gICAgICAgIGlmICh0aGlzLnN0eWxlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuc3R5bGUgPSB0aGlzLnN0eWxlO1xuICAgICAgICBpZiAodGhpcy5maWxsQ29sb3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5maWxsQ29sb3IgPSB0aGlzLmZpbGxDb2xvcjtcbiAgICAgICAgaWYgKHRoaXMuYm9yZGVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuYm9yZGVyID0gdGhpcy5ib3JkZXI7XG4gICAgICAgIGlmICh0aGlzLmNvdW50ZXIpXG4gICAgICAgICAgICByZXQuY291bnRlciA9IHRoaXMuY291bnRlcjtcbiAgICAgICAgaWYgKHRoaXMubGlzdFR5cGUpXG4gICAgICAgICAgICByZXQubGlzdFR5cGUgPSB0aGlzLmxpc3RUeXBlO1xuICAgICAgICBpZiAodGhpcy5tYXJnaW4pXG4gICAgICAgICAgICByZXQubWFyZ2luID0gdGhpcy5tYXJnaW47XG4gICAgICAgIGlmICh0aGlzLndpZHRoJiZ0aGlzPy5fcGFyZW50LnJlcG9ydHR5cGU9PT1cImNvbHVtblwiKVxuICAgICAgICAgICAgcmV0LndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHRoaXNbXCJvdGhlclByb3BlcnRpZXNcIl0pO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxufSJdfQ==