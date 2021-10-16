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
            console.log("setw" + value);
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                this._parent.setChildWidth(this, value);
            else {
                this._width = value;
                console.log(value);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanNfcmVwb3J0L3JlbW90ZS9SQ29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBT0Esd0ZBQXdGO0lBRXhGLE1BQWEseUJBQTBCLFNBQVEsaUNBQXFCO0tBRW5FO0lBRkQsOERBRUM7SUFDRCxTQUFnQixnQkFBZ0IsQ0FBQyxVQUFxQztRQUNsRSxPQUFPLFVBQVUsTUFBTTtZQUNuQixrQkFBUSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUpELDRDQUlDO0lBTUQsSUFBYSxVQUFVLGtCQUF2QixNQUFhLFVBQVcsU0FBUSxhQUFLO1FBMEJqQyxZQUFZLFVBQVUsR0FBRyxTQUFTO1lBQzlCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUh0QixlQUFVLEdBQVcsU0FBUyxDQUFDO1FBSy9CLENBQUM7UUFDRCxjQUFjLENBQUMsSUFBSTtZQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFPRCxJQUFJLE9BQU8sQ0FBQyxLQUFhO1lBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksS0FBSyxLQUFLLFNBQVM7Z0JBQ25CLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztnQkFFdkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFDRCxJQUFJLE9BQU87WUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQztRQWlCRCxJQUFJLFFBQVEsQ0FBQyxL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LEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7OzsrQ0FHdEQ7SUFPRDtRQURDLG9CQUFTLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUM7OztnREFHbkU7SUFnQkQ7UUFEQyxvQkFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDOzs7cURBRzVCO0lBT0Q7UUFEQyxvQkFBUyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQzs7O3FEQUdqRTtJQXdCRDtRQURDLG9CQUFTLEVBQUU7OzsyQ0FHWDtJQXdCRDtRQURDLG9CQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7OztnREFHekI7SUFTRDtRQURDLG9CQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxpQ0FBaUMsRUFBRSxDQUFDOzs7NENBRy9FO0lBeldRLFVBQVU7UUFGdEIsY0FBTSxDQUFDLGdDQUFnQyxDQUFDO1FBQ3hDLG9CQUFTLENBQUMsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7T0FDaEMsVUFBVSxDQTZnQnRCO0lBN2dCWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVJQ29tcG9uZW50UHJvcGVydGllcyB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xuaW1wb3J0IHsgUlN0eWxlIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JTdHlsZVwiO1xuLy9MaW1pdGF0aW9ucyBTdHlsZXMxIC0+IG5vdCBpbXBsZW1lbnRlZFx0c3R5bGUgYXMgYXJyYXkgZS5nLiBzdHlsZTogWydxdW90ZScsICdzbWFsbCddICBcblxuZXhwb3J0IGNsYXNzIFJlcG9ydENvbXBvbmVudFByb3BlcnRpZXMgZXh0ZW5kcyBVSUNvbXBvbmVudFByb3BlcnRpZXMge1xuXG59XG5leHBvcnQgZnVuY3Rpb24gJFJlcG9ydENvbXBvbmVudChwcm9wZXJ0aWVzOiBSZXBvcnRDb21wb25lbnRQcm9wZXJ0aWVzKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbiAocGNsYXNzKSB7XG4gICAgICAgIHJlZ2lzdHJ5LnJlZ2lzdGVyKFwiJFJlcG9ydENvbXBvbmVudFwiLCBwY2xhc3MsIHByb3BlcnRpZXMpO1xuICAgIH1cbn1cblxuXG5cbkAkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SZXBvcnRDb21wb25lbnRcIilcbkAkUHJvcGVydHkoeyBoaWRlQmFzZUNsYXNzUHJvcGVydGllczogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIFJDb21wb25lbnQgZXh0ZW5kcyBQYW5lbCB7XG4gICAgcHJpdmF0ZSBfY29sU3BhbjogbnVtYmVyO1xuICAgIHByaXZhdGUgX3Jvd1NwYW46IG51bWJlcjtcbiAgICBAJFByb3BlcnR5KClcbiAgICBmb3JlYWNoOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfd2lkdGg6IGFueTtcbiAgICBwcml2YXRlIF9oZWlnaHQ6IGFueTtcbiAgICBwcml2YXRlIF9ib2xkOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2RlY29yYXRpb246IHN0cmluZztcbiAgICBwcml2YXRlIF9kZWNvcmF0aW9uU3R5bGU6IHN0cmluZztcbiAgICBwcml2YXRlIF9kZWNvcmF0aW9uQ29sb3I6IHN0cmluZztcbiAgICBwcml2YXRlIF9jb2xvcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ZvbnRTaXplOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfbGluZUhlaWdodDogbnVtYmVyO1xuICAgIHByaXZhdGUgX2l0YWxpY3M6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfYWxpZ25tZW50OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfYmFja2dyb3VuZDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ZvbnQ6IHN0cmluZztcbiAgICBwcml2YXRlIF9zdHlsZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ZpbGxDb2xvcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2JvcmRlcjogYm9vbGVhbltdO1xuICAgIHByaXZhdGUgX2NvdW50ZXI6IG51bWJlcjtcbiAgICBwcml2YXRlIF9saXN0VHlwZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX21hcmdpbjogbnVtYmVyW107XG4gICAgcmVwb3J0dHlwZTogc3RyaW5nID0gXCJub3RoaW5nXCI7XG4gICAgb3RoZXJQcm9wZXJ0aWVzOiBhbnk7XG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcyA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcihwcm9wZXJ0aWVzKTtcblxuICAgIH1cbiAgICBvbnN0eWxlY2hhbmdlZChmdW5jKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgZnVuYyk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoe1xuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgIGlzVmlzaWJsZTogKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5fcGFyZW50Py5yZXBvcnR0eXBlID09PSBcIm9sXCI7XG4gICAgICAgIH1cbiAgICB9KVxuICAgIHNldCBjb3VudGVyKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fY291bnRlciA9IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICQodGhpcy5kb21XcmFwcGVyKS5yZW1vdmVBdHRyKFwidmFsdWVcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICQodGhpcy5kb21XcmFwcGVyKS5hdHRyKFwidmFsdWVcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBnZXQgY291bnRlcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlcjtcbiAgICB9XG5cblxuXG4gICAgQCRQcm9wZXJ0eSh7XG4gICAgICAgIG5hbWU6IFwibGlzdFR5cGVcIixcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBpc1Zpc2libGU6IChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuX3BhcmVudD8ucmVwb3J0dHlwZSA9PT0gXCJ1bFwiIHx8IGNvbXBvbmVudC5fcGFyZW50Py5yZXBvcnR0eXBlID09PSBcIm9sXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGNob29zZUZyb206IGZ1bmN0aW9uIChpdCkge1xuICAgICAgICAgICAgaWYgKGl0Ll9wYXJlbnQucmVwb3J0dHlwZSA9PT0gXCJvbFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBbXCJsb3dlci1hbHBoYVwiLCBcInVwcGVyLWFscGhhXCIsIFwibG93ZXItcm9tYW5cIiwgXCJ1cHBlci1yb21hblwiLCBcIm5vbmVcIl07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcInNxdWFyZVwiLCBcImNpcmNsZVwiLCBcIm5vbmVcIl07XG4gICAgICAgIH1cbiAgICB9KVxuICAgIHNldCBsaXN0VHlwZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xpc3RUeXBlID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImxpc3Qtc3R5bGUtdHlwZVwiLCBcIlwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImxpc3Qtc3R5bGUtdHlwZVwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIGdldCBsaXN0VHlwZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdFR5cGU7XG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFwiY29sb3JcIiwgaXNWaXNpYmxlOiAoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAvL29ubHkgaW4gdGFibGUgYW5kIGNvbHVtbiB3aWR0aCBpcyBwb3NpYmxlXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50Ll9wYXJlbnQ/LnJlcG9ydHR5cGUgPT09IFwidGFibGVyb3dcIjtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgZ2V0IGZpbGxDb2xvcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsbENvbG9yO1xuICAgIH1cblxuICAgIHNldCBmaWxsQ29sb3IodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9maWxsQ29sb3IgPSB2YWx1ZTtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCB2YWx1ZSk7XG5cbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsIGlzVmlzaWJsZTogKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgLy9vbmx5IGluIHRhYmxlIGFuZCBjb2x1bW4gd2lkdGggaXMgcG9zaWJsZVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5fcGFyZW50Py5yZXBvcnR0eXBlID09PSBcInRhYmxlcm93XCI7XG4gICAgICAgIH1cbiAgICB9KVxuICAgIGdldCBjb2xTcGFuKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xTcGFuO1xuICAgIH1cblxuICAgIHNldCBjb2xTcGFuKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmF0dHIoXCJjb2xzcGFuXCIsIHZhbHVlID09PSB1bmRlZmluZWQgPyBcIlwiIDogdmFsdWUpO1xuICAgICAgICB0aGlzLl9jb2xTcGFuID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQ/Ll9wYXJlbnQ/LnVwZGF0ZUxheW91dClcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudD8uX3BhcmVudD8udXBkYXRlTGF5b3V0KHRydWUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIiwgaXNWaXNpYmxlOiAoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAvL29ubHkgaW4gdGFibGUgYW5kIGNvbHVtbiB3aWR0aCBpcyBwb3NpYmxlXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50Ll9wYXJlbnQ/LnJlcG9ydHR5cGUgPT09IFwidGFibGVyb3dcIjtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgZ2V0IHJvd1NwYW4oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvd1NwYW47XG4gICAgfVxuXG4gICAgc2V0IHJvd1NwYW4odmFsdWU6IG51bWJlcikge1xuICAgICAgICAkKHRoaXMuZG9tV3JhcHBlcikuYXR0cihcInJvd3NwYW5cIiwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3Jvd1NwYW4gPSB2YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudD8uX3BhcmVudD8udXBkYXRlTGF5b3V0KVxuICAgICAgICAgICAgdGhpcy5fcGFyZW50Py5fcGFyZW50Py51cGRhdGVMYXlvdXQodHJ1ZSk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBcImJvb2xlYW5bXVwiLFxuICAgICAgICBkZWZhdWx0OiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLFxuICAgICAgICBpc1Zpc2libGU6IChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIC8vb25seSBpbiB0YWJsZSBhbmQgY29sdW1uIHdpZHRoIGlzIHBvc2libGVcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuX3BhcmVudD8uc2V0Q2hpbGRXaWR0aCB8fCBjb21wb25lbnQuX3BhcmVudD8ucmVwb3J0dHlwZSA9PT0gXCJjb2x1bW5zXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcImJvcmRlciBvZiB0aGUgdGFibGVjZWxsOiBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b21cIlxuICAgIH0pXG4gICAgZ2V0IGJvcmRlcigpOiBib29sZWFuW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm9yZGVyO1xuICAgIH1cbiAgICBzZXQgYm9yZGVyKHZhbHVlOiBib29sZWFuW10pIHtcbiAgICAgICAgdGhpcy5fYm9yZGVyID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdmFsdWUgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdO1xuXG5cbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImJvcmRlci1sZWZ0LXN0eWxlXCIsIHZhbHVlWzBdID8gXCJzb2xpZFwiIDogXCJub25lXCIpO1xuICAgICAgICAkKHRoaXMuZG9tV3JhcHBlcikuY3NzKFwiYm9yZGVyLXRvcC1zdHlsZVwiLCB2YWx1ZVsxXSA/IFwic29saWRcIiA6IFwibm9uZVwiKTtcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImJvcmRlci1yaWdodC1zdHlsZVwiLCB2YWx1ZVsyXSA/IFwic29saWRcIiA6IFwibm9uZVwiKTtcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcImJvcmRlci1ib3R0b20tc3R5bGVcIiwgdmFsdWVbM10gPyBcInNvbGlkXCIgOiBcIm5vbmVcIik7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLCBpc1Zpc2libGU6IChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIC8vb25seSBpbiB0YWJsZSBhbmQgY29sdW1uIHdpZHRoIGlzIHBvc2libGVcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuX3BhcmVudD8uc2V0Q2hpbGRXaWR0aCB8fCBjb21wb25lbnQuX3BhcmVudD8ucmVwb3J0dHlwZSA9PT0gXCJjb2x1bW5zXCJ8fCBjb21wb25lbnQucmVwb3J0dHlwZSA9PT0gXCJpbWFnZVwiO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIGdldCB3aWR0aCgpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50Py5zZXRDaGlsZFdpZHRoICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50LmdldENoaWxkV2lkdGgodGhpcyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICB9XG4gICAgc2V0IHdpZHRoKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzZXR3XCIrdmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50Py5zZXRDaGlsZFdpZHRoICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuc2V0Q2hpbGRXaWR0aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgICAgIHN1cGVyLndpZHRoID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsIGlzVmlzaWJsZTogKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgLy9vbmx5IGluIHRhYmxlIGFuZCBjb2x1bW4gd2lkdGggaXMgcG9zaWJsZVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5fcGFyZW50Py5zZXRDaGlsZEhlaWdodCB8fCBjb21wb25lbnQuX3BhcmVudD8ucmVwb3J0dHlwZSA9PT0gXCJjb2x1bW5zXCJ8fCBjb21wb25lbnQucmVwb3J0dHlwZSA9PT0gXCJpbWFnZVwiO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIGdldCBoZWlnaHQoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudD8uc2V0Q2hpbGRIZWlnaHQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQuZ2V0Q2hpbGRIZWlnaHQodGhpcyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgfVxuICAgIHNldCBoZWlnaHQodmFsdWU6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50Py5zZXRDaGlsZEhlaWdodCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnNldENoaWxkSGVpZ2h0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgICAgIHN1cGVyLmhlaWdodCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgZ2V0IGJvbGQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ib2xkO1xuICAgIH1cbiAgICBzZXQgYm9sZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9ib2xkID0gdmFsdWU7XG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImZvbnQtd2VpZ2h0XCIsIHZhbHVlID8gXCJib2xkXCIgOiBcIm5vcm1hbFwiKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJmb250LXdlaWdodFwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoKVxuICAgIGdldCBpdGFsaWNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRhbGljcztcbiAgICB9XG4gICAgc2V0IGl0YWxpY3ModmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5faXRhbGljcyA9IHZhbHVlO1xuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJmb250LXN0eWxlXCIsIHZhbHVlID8gXCJpdGFsaWNcIiA6IFwibm9ybWFsXCIpO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInN0eWxlY2hhbmdlZFwiLCBcImZvbnQtc3R5bGVcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1wiQWxlZ3JleWFcIiwgXCJBbGVncmV5YVNhbnNcIiwgXCJBbGVncmV5YVNhbnNTQ1wiLCBcIkFsZWdyZXlhU0NcIiwgXCJBbG1lbmRyYVNDXCIsIFwiQW1hcmFudGhcIiwgXCJBbmRhZGFcIiwgXCJBbmRhZGFTQ1wiLCBcIkFub255bW91c1Byb1wiLCBcIkFyY2hpdm9OYXJyb3dcIiwgXCJBcnZvXCIsIFwiQXNhcFwiLCBcIkF2ZXJpYUxpYnJlXCIsIFwiQXZlcmlhU2Fuc0xpYnJlXCIsIFwiQXZlcmlhU2VyaWZMaWJyZVwiLCBcIkNhbWJheVwiLCBcIkNhdWRleFwiLCBcIkNyaW1zb25UZXh0XCIsIFwiQ3VwcnVtXCIsIFwiRWNvbm9taWNhXCIsIFwiRXhvMlwiLCBcIkV4b1wiLCBcIkV4cGxldHVzU2Fuc1wiLCBcIkZpcmFTYW5zXCIsIFwiSm9zZWZpblNhbnNcIiwgXCJKb3NlZmluU2xhYlwiLCBcIkthcmxhXCIsIFwiTGF0b1wiLCBcIkxvYnN0ZXJUd29cIiwgXCJMb3JhXCIsIFwiTWFydmVsXCIsIFwiTWVycml3ZWF0aGVyXCIsIFwiTWVycml3ZWF0aGVyU2Fuc1wiLCBcIk5vYmlsZVwiLCBcIk5vdGljaWFUZXh0XCIsIFwiT3ZlcmxvY2tcIiwgXCJQaGlsb3NvcGhlclwiLCBcIlBsYXlmYWlyRGlzcGxheVwiLCBcIlBsYXlmYWlyRGlzcGxheVNDXCIsIFwiUFRfU2VyaWYtV2ViXCIsIFwiUHVyaXRhblwiLCBcIlF1YW50aWNvXCIsIFwiUXVhdHRyb2NlbnRvU2Fuc1wiLCBcIlF1aWNrc2FuZFwiLCBcIlJhbWJsYVwiLCBcIlJvc2FyaW9cIiwgXCJTYW5zYXRpb25cIiwgXCJTYXJhYnVuXCIsIFwiU2NhZGFcIiwgXCJTaGFyZVwiLCBcIlNpdGFyYVwiLCBcIlNvdXJjZVNhbnNQcm9cIiwgXCJUaXRpbGxpdW1XZWJcIiwgXCJWb2xraG92XCIsIFwiVm9sbGtvcm5cIl0gfSlcbiAgICBnZXQgZm9udCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZm9udDtcbiAgICB9XG4gICAgc2V0IGZvbnQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9mb250ID0gdmFsdWU7XG4gICAgICAgIC8vY29weSBmcm9tIENTU1Byb3BlcnRpZXNcbiAgICAgICAgdmFyIGFwaSA9ICdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9JztcbiAgICAgICAgdmFyIHNmb250ID0gdmFsdWUucmVwbGFjZUFsbChcIiBcIiwgXCIrXCIpXG4gICAgICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCItLT5cIiArIGFwaSArIHNmb250KSkgey8vXCItLT5odHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9QWNsb25pY2FcIj5cbiAgICAgICAgICAgIGphc3NpanMubXlSZXF1aXJlKGFwaSArIHNmb250KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZm9udF9mYW1pbHlcIiwgXCJcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICQodGhpcy5kb20pLmNzcyhcImZvbnRfZmFtaWx5XCIsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJmb250XCIsIHZhbHVlKTtcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgZ2V0IGZvbnRTaXplKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcbiAgICB9XG4gICAgc2V0IGZvbnRTaXplKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fZm9udFNpemUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJmb250LXNpemVcIiwgXCJcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICQodGhpcy5kb20pLmNzcyhcImZvbnQtc2l6ZVwiLCB2YWx1ZSArIFwicHhcIik7XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwic3R5bGVjaGFuZ2VkXCIsIFwiZm9udFNpemVcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJjb2xvclwiIH0pXG4gICAgZ2V0IGJhY2tncm91bmQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmQ7XG4gICAgfVxuICAgIHNldCBiYWNrZ3JvdW5kKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fYmFja2dyb3VuZCA9IHZhbHVlO1xuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJiYWNrZ3JvdW5kXCIsIHZhbHVlKTtcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwiY29sb3JcIiB9KVxuICAgIGdldCBjb2xvcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgfVxuICAgIHNldCBjb2xvcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImNvbG9yXCIsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJjb2xvclwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyBjaG9vc2VGcm9tOiBbXCJsZWZ0XCIsIFwiY2VudGVyXCIsIFwicmlnaHRcIl0gfSlcbiAgICBnZXQgYWxpZ25tZW50KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGlnbm1lbnQ7XG4gICAgfVxuICAgIHNldCBhbGlnbm1lbnQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9hbGlnbm1lbnQgPSB2YWx1ZTtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwidGV4dC1hbGlnblwiLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwic3R5bGVjaGFuZ2VkXCIsIFwiYWxpZ25tZW50XCIsIHZhbHVlKTtcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7IGNob29zZUZyb206IFtcInVuZGVybGluZVwiLCBcImxpbmVUaHJvdWdoXCIsIFwib3ZlcmxpbmVcIl0gfSlcbiAgICBnZXQgZGVjb3JhdGlvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVjb3JhdGlvbjtcbiAgICB9XG4gICAgc2V0IGRlY29yYXRpb24odmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9kZWNvcmF0aW9uID0gdmFsdWU7XG4gICAgICAgIHZhciB2YWwgPSBcIm5vbmVcIjtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcInVuZGVybGluZVwiKVxuICAgICAgICAgICAgdmFsID0gXCJ1bmRlcmxpbmVcIjtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcImxpbmVUaHJvdWdoXCIpXG4gICAgICAgICAgICB2YWwgPSBcImxpbmUtdGhyb3VnaFwiO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwib3ZlcmxpbmVcIilcbiAgICAgICAgICAgIHZhbCA9IFwib3ZlcmxpbmVcIjtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwidGV4dC1kZWNvcmF0aW9uXCIsIHZhbCk7XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwic3R5bGVjaGFuZ2VkXCIsIFwiZGVjb3JhdGlvblwiLCB2YWx1ZSk7XG4gICAgfVxuXG5cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJjb2xvclwiIH0pXG4gICAgZ2V0IGRlY29yYXRpb25Db2xvcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVjb3JhdGlvbkNvbG9yO1xuICAgIH1cbiAgICBzZXQgZGVjb3JhdGlvbkNvbG9yKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZGVjb3JhdGlvbkNvbG9yID0gdmFsdWU7XG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcInRleHREZWNvcmF0aW9uQ29sb3JcIiwgdmFsdWUpO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInN0eWxlY2hhbmdlZFwiLCBcInRleHREZWNvcmF0aW9uQ29sb3JcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1wiZGFzaGVkXCIsIFwiZG90dGVkXCIsIFwiZG91YmxlXCIsIFwid2F2eVwiXSB9KVxuICAgIGdldCBkZWNvcmF0aW9uU3R5bGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlY29yYXRpb25TdHlsZTtcbiAgICB9XG4gICAgc2V0IGRlY29yYXRpb25TdHlsZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2RlY29yYXRpb25TdHlsZSA9IHZhbHVlO1xuICAgICAgICB2YXIgdmFsID0gXCJzb2xpZFwiO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwiZGFzaGVkXCIpXG4gICAgICAgICAgICB2YWwgPSBcImRhc2hlZFwiO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwiZG90dGVkXCIpXG4gICAgICAgICAgICB2YWwgPSBcImRvdHRlZFwiO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwiZG91YmxlXCIpXG4gICAgICAgICAgICB2YWwgPSBcImRvdWJsZVwiO1xuICAgICAgICBpZiAodmFsdWUgPT09IFwid2F2eVwiKVxuICAgICAgICAgICAgdmFsID0gXCJ3YXZ5XCI7XG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcInRleHREZWNvcmF0aW9uU3R5bGVcIiwgdmFsKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJkZWNvcmF0aW9uU3R5bGVcIiwgdmFsdWUpO1xuICAgIH1cbiAgICBzdGF0aWMgZmluZFJlcG9ydChwYXJlbnQpOiBSZXBvcnREZXNpZ24ge1xuICAgICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBpZiAocGFyZW50Py5yZXBvcnR0eXBlID09PSBcInJlcG9ydFwiKVxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIFJDb21wb25lbnQuZmluZFJlcG9ydChwYXJlbnQuX3BhcmVudCk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoKVxuICAgIGdldCBzdHlsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3R5bGU7XG4gICAgfVxuXG4gICAgc2V0IHN0eWxlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIG9sZCA9IHRoaXMuX3N0eWxlO1xuICAgICAgICB0aGlzLl9zdHlsZSA9IHZhbHVlO1xuICAgICAgICB2YXIgcmVwb3J0ID0gUkNvbXBvbmVudC5maW5kUmVwb3J0KHRoaXMpO1xuICAgICAgICBpZiAocmVwb3J0KSB7XG4gICAgICAgICAgICByZXBvcnQuc3R5bGVDb250YWluZXIuX2NvbXBvbmVudHMuZm9yRWFjaCgoY29tcDogUlN0eWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXAubmFtZSA9PT0gb2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5kb20pLnJlbW92ZUNsYXNzKGNvbXAuc3R5bGVpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXBvcnQuc3R5bGVDb250YWluZXIuX2NvbXBvbmVudHMuZm9yRWFjaCgoY29tcDogUlN0eWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXAubmFtZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmRvbSkuYWRkQ2xhc3MoY29tcC5zdHlsZWlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gIHN1cGVyLndpZHRoID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IDEgfSlcbiAgICBnZXQgbGluZUhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGluZUhlaWdodDtcbiAgICB9XG4gICAgc2V0IGxpbmVIZWlnaHQodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9saW5lSGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImxpbmUtaGVpZ2h0XCIsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzdHlsZWNoYW5nZWRcIiwgXCJsaW5lSGVpZ2h0XCIsIHZhbHVlKTtcbiAgICAgICAgLy8gIHN1cGVyLndpZHRoID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwibnVtYmVyW11cIiwgZGVzY3JpcHRpb246IFwibWFyZ2luIGxlZnQsIHRvcCwgcmlnaHQsIGJvdHRvbVwiIH0pXG4gICAgZ2V0IG1hcmdpbigpOiBudW1iZXJbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXJnaW47XG4gICAgfVxuICAgIHNldCBtYXJnaW4odmFsdWU6IG51bWJlcltdKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXJnaW4gPSB2YWx1ZTtcbiAgICAgICAgICAgICQodGhpcy5kb20pLmNzcyhcIm1hcmdpblwiLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHZhbHVlID0gW3ZhbHVlLCB2YWx1ZSwgdmFsdWUsIHZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFt2YWx1ZVswXSwgdmFsdWVbMV0sIHZhbHVlWzBdLCB2YWx1ZVsxXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9tYXJnaW4gPSB2YWx1ZTtcblxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwibWFyZ2luXCIsIHZhbHVlWzFdICsgXCJweCBcIiArIHZhbHVlWzJdICsgXCJweCBcIiArIHZhbHVlWzNdICsgXCJweCBcIiArIHZhbHVlWzBdICsgXCJweCBcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmcm9tSlNPTihvYjogYW55KTogUkNvbXBvbmVudCB7XG4gICAgICAgIHZhciByZXQgPSB0aGlzO1xuXG4gICAgICAgIGlmIChvYi5mb3JlYWNoKSB7XG4gICAgICAgICAgICByZXQuZm9yZWFjaCA9IG9iLmZvcmVhY2g7XG4gICAgICAgICAgICBkZWxldGUgb2IuZm9yZWFjaDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuY29sU3Bhbikge1xuICAgICAgICAgICAgcmV0LmNvbFNwYW4gPSBvYi5jb2xTcGFuO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmNvbFNwYW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLnJvd1NwYW4pIHtcbiAgICAgICAgICAgIHJldC5yb3dTcGFuID0gb2Iucm93U3BhbjtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5yb3dTcGFuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldC5oZWlnaHQgPSBvYi5oZWlnaHQ7XG4gICAgICAgICAgICBkZWxldGUgb2IuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi53aWR0aCkge1xuICAgICAgICAgICAgcmV0LndpZHRoID0gb2Iud2lkdGg7XG4gICAgICAgICAgICBkZWxldGUgb2Iud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmJvbGQpIHtcbiAgICAgICAgICAgIHJldC5ib2xkID0gb2IuYm9sZDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5pdGFsaWNzKSB7XG4gICAgICAgICAgICByZXQuaXRhbGljcyA9IG9iLml0YWxpY3M7XG4gICAgICAgICAgICBkZWxldGUgb2IuaXRhbGljcztcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuY29sb3IpIHtcbiAgICAgICAgICAgIHJldC5jb2xvciA9IG9iLmNvbG9yO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5kZWNvcmF0aW9uKSB7XG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvbiA9IG9iLmRlY29yYXRpb247XG4gICAgICAgICAgICBkZWxldGUgb2IuZGVjb3JhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuZGVjb3JhdGlvblN0eWxlKSB7XG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvblN0eWxlID0gb2IuZGVjb3JhdGlvblN0eWxlO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmRlY29yYXRpb25TdHlsZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuZGVjb3JhdGlvbkNvbG9yKSB7XG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvbkNvbG9yID0gb2IuZGVjb3JhdGlvbkNvbG9yO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmRlY29yYXRpb25Db2xvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IuZm9udFNpemUpIHtcbiAgICAgICAgICAgIHJldC5mb250U2l6ZSA9IG9iLmZvbnRTaXplO1xuICAgICAgICAgICAgZGVsZXRlIG9iLmZvbnRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5mb250KSB7XG4gICAgICAgICAgICByZXQuZm9udCA9IG9iLmZvbnQ7XG4gICAgICAgICAgICBkZWxldGUgb2IuZm9udDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IubGluZUhlaWdodCkge1xuICAgICAgICAgICAgcmV0LmxpbmVIZWlnaHQgPSBvYi5saW5lSGVpZ2h0O1xuICAgICAgICAgICAgZGVsZXRlIG9iLmxpbmVIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmFsaWdubWVudCkge1xuICAgICAgICAgICAgcmV0LmFsaWdubWVudCA9IG9iLmFsaWdubWVudDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5hbGlnbm1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmJhY2tncm91bmQpIHtcbiAgICAgICAgICAgIHJldC5iYWNrZ3JvdW5kID0gb2IuYmFja2dyb3VuZDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5iYWNrZ3JvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5zdHlsZSkge1xuICAgICAgICAgICAgcmV0LnN0eWxlID0gb2Iuc3R5bGU7XG4gICAgICAgICAgICBkZWxldGUgb2Iuc3R5bGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmZpbGxDb2xvcikge1xuICAgICAgICAgICAgcmV0LmZpbGxDb2xvciA9IG9iLmZpbGxDb2xvcjtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5maWxsQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmJvcmRlcikge1xuICAgICAgICAgICAgcmV0LmJvcmRlciA9IG9iLmJvcmRlcjtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5ib3JkZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLmNvdW50ZXIpIHtcbiAgICAgICAgICAgIHJldC5jb3VudGVyID0gb2IuY291bnRlcjtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5jb3VudGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5saXN0VHlwZSkge1xuICAgICAgICAgICAgcmV0Lmxpc3RUeXBlID0gb2IubGlzdFR5cGU7XG4gICAgICAgICAgICBkZWxldGUgb2IubGlzdFR5cGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iLm1hcmdpbikge1xuICAgICAgICAgICAgcmV0Lm1hcmdpbiA9IG9iLm1hcmdpbjtcbiAgICAgICAgICAgIGRlbGV0ZSBvYi5tYXJnaW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0Lm90aGVyUHJvcGVydGllcyA9IG9iO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHZhciByZXQ6IGFueSA9IHt9XG4gICAgICAgIGlmICh0aGlzLmNvbFNwYW4gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5jb2xTcGFuID0gdGhpcy5jb2xTcGFuO1xuICAgICAgICBpZiAodGhpcy5yb3dTcGFuICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQucm93U3BhbiA9IHRoaXMucm93U3BhbjtcbiAgICAgICAgaWYgKHRoaXMuZm9yZWFjaCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0LmZvcmVhY2ggPSB0aGlzLmZvcmVhY2g7XG4gICAgICAgIGlmICh0aGlzLndpZHRoICE9PSB1bmRlZmluZWQgJiYgIXRoaXMuX3BhcmVudD8uc2V0Q2hpbGRXaWR0aClcbiAgICAgICAgICAgIHJldC53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIGlmICh0aGlzLmhlaWdodCAhPT0gdW5kZWZpbmVkICYmICF0aGlzLl9wYXJlbnQ/LnNldENoaWxkSGVpZ2h0KVxuICAgICAgICAgICAgcmV0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmJvbGQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5ib2xkID0gdGhpcy5ib2xkO1xuICAgICAgICBpZiAodGhpcy5pdGFsaWNzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuaXRhbGljcyA9IHRoaXMuaXRhbGljcztcbiAgICAgICAgaWYgKHRoaXMuY29sb3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5jb2xvciA9IHRoaXMuY29sb3I7XG4gICAgICAgIGlmICh0aGlzLmRlY29yYXRpb24gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5kZWNvcmF0aW9uID0gdGhpcy5kZWNvcmF0aW9uO1xuICAgICAgICBpZiAodGhpcy5kZWNvcmF0aW9uU3R5bGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5kZWNvcmF0aW9uU3R5bGUgPSB0aGlzLmRlY29yYXRpb25TdHlsZTtcbiAgICAgICAgaWYgKHRoaXMuZGVjb3JhdGlvbkNvbG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuZGVjb3JhdGlvbkNvbG9yID0gdGhpcy5kZWNvcmF0aW9uQ29sb3I7XG4gICAgICAgIGlmICh0aGlzLmZvbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5mb250ID0gdGhpcy5mb250O1xuICAgICAgICBpZiAodGhpcy5mb250U2l6ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcbiAgICAgICAgaWYgKHRoaXMubGluZUhlaWdodCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0LmxpbmVIZWlnaHQgPSB0aGlzLmxpbmVIZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLmFsaWdubWVudCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0LmFsaWdubWVudCA9IHRoaXMuYWxpZ25tZW50O1xuICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXQuYmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZDtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5zdHlsZSA9IHRoaXMuc3R5bGU7XG4gICAgICAgIGlmICh0aGlzLmZpbGxDb2xvciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0LmZpbGxDb2xvciA9IHRoaXMuZmlsbENvbG9yO1xuICAgICAgICBpZiAodGhpcy5ib3JkZXIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldC5ib3JkZXIgPSB0aGlzLmJvcmRlcjtcbiAgICAgICAgaWYgKHRoaXMuY291bnRlcilcbiAgICAgICAgICAgIHJldC5jb3VudGVyID0gdGhpcy5jb3VudGVyO1xuICAgICAgICBpZiAodGhpcy5saXN0VHlwZSlcbiAgICAgICAgICAgIHJldC5saXN0VHlwZSA9IHRoaXMubGlzdFR5cGU7XG4gICAgICAgIGlmICh0aGlzLm1hcmdpbilcbiAgICAgICAgICAgIHJldC5tYXJnaW4gPSB0aGlzLm1hcmdpbjtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHRoaXNbXCJvdGhlclByb3BlcnRpZXNcIl0pO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxufSJdfQ==