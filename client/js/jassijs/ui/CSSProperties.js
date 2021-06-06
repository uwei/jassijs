var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property"], function (require, exports, Jassi_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSSProperties = exports.loadFontIfNedded = void 0;
    var systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    var api = 'https://fonts.googleapis.com/css?family=';
    /**
     * loads googlefonts if needed
     **/
    function loadFontIfNedded(font) {
        if (systemFonts.indexOf(font) === -1) {
            var sfont = font.replaceAll(" ", "+");
            if (!document.getElementById("-->" + api + sfont)) { //"-->https://fonts.googleapis.com/css?family=Aclonica">
                Jassi_1.default.myRequire(api + sfont);
            }
        }
    }
    exports.loadFontIfNedded = loadFontIfNedded;
    let CSSProperties = class CSSProperties {
        static applyTo(properties, component) {
            var prop = {};
            for (let key in properties) {
                var newKey = key.replaceAll("_", "-");
                prop[newKey] = properties[key];
                if (newKey === "font-family") {
                    loadFontIfNedded(prop[newKey]);
                }
            }
            $(component.dom).css(prop);
            return prop;
        }
    };
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "background_color", void 0);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "background_image", void 0);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_color", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_style", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["thin", "medium", "thick", "2px", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_width", void 0);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "color", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait", "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "cursor", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["blur(5px)", "brightness(0.4)", "contrast(200%)", "drop-shadow(16px 16px 20px blue)", "grayscale(50%)", "hue-rotate(90deg)", "invert(75%)", "opacity(25%)", "saturate(30%)", "sepia(60%)", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "filter", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["left", "right", "none", "inline-start", "inline-end", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "float", void 0);
    __decorate([
        Property_1.$Property({ type: "font" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_family", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["12px", "xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large", "larger", "smaller", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_size", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["normal", "small-caps", "small-caps slashed-zero", "common-ligatures tabular-nums", "no-common-ligatures proportional-nums", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_variant", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["normal", "bold", "lighter", "bolder", "100", "900", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_weight", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["normal", "1px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "letter_spacing", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["normal", "32px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "line_height", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_bottom", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_left", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_right", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_top", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["visible", "hidden", "clip", "scroll", "auto", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "overflow", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_bottom", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_left", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_right", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_top", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["static", "relative", "absolute", "sticky", "fixed", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "position", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["start", "end", "left", "right", "center", "justify", "match-parent", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_align", void 0);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_color", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["none", "underline", "overline", "line-through", "blink", "spelling-error", "grammar-error", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_line", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["solid", "double", "dotted", "dashed", "wavy", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_style", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_thickness", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["none", "capitalize", "uppercase", "lowercase", "full-width", "full-size-kana", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_transform", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["baseline", "sub", "super", "text-top", "text-bottom", "middle", "top", "bottom", "3px", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "vertical_align", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["1", "2", "auto"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "z_index", void 0);
    CSSProperties = __decorate([
        Jassi_1.$Class("jassijs.ui.CSSProperties")
    ], CSSProperties);
    exports.CSSProperties = CSSProperties;
});
//# sourceMappingURL=CSSProperties.js.map