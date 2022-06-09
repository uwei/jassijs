var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/util/Numberformatter"], function (require, exports, Jassi_1, Component_1, DataComponent_1, DefaultConverter_1, Registry_1, Property_1, Numberformatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Textbox = void 0;
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
        ret.push("0");
        ret.push("0" + decimal + "00");
        return ret;
    })();
    let Textbox = class Textbox extends DataComponent_1.DataComponent {
        constructor(color = undefined) {
            super();
            this._value = "";
            this._formatProps = undefined;
            super.init($('<input type="text" />')[0]);
            $(this.dom).css("color", color);
            this.converter = undefined;
        }
        config(config) {
            super.config(config);
            return this;
            //    return new c();
        }
        set disabled(value) {
            $(this.dom).prop('disabled', true);
        }
        get disabled() {
            return $(this.dom).prop('disabled');
        }
        set format(value) {
            this._format = value;
            var _this = this;
            if (value === undefined && this._formatProps) {
                this.off("focus", this._formatProps.focus);
                this.off("blur", this._formatProps.blur);
            }
            if (value && this._formatProps === undefined) {
                _this._formatProps = { blur: undefined, focus: undefined, inEditMode: false };
                this._formatProps.focus = this.on("focus", () => {
                    let val = this.value;
                    _this._formatProps.inEditMode = true;
                    $(this.dom).val(Numberformatter_1.Numberformatter.numberToString(val));
                });
                this._formatProps.blur = this.on("blur", () => {
                    _this.updateValue();
                    _this._formatProps.inEditMode = false;
                    $(this.dom).val(Numberformatter_1.Numberformatter.format(this._format, this.value));
                });
            }
            if (this.value)
                this.value = this.value; //apply the ne format
            //      $(this.dom).val(value);
        }
        get format() {
            return this._format;
        }
        updateValue() {
            var ret = $(this.dom).val();
            if (this.converter !== undefined) {
                ret = this.converter.stringToObject(ret);
            }
            this._value = ret;
        }
        set value(value) {
            this._value = value;
            var v = value;
            if (this.converter)
                v = this.converter.objectToString(v);
            if (this._format) {
                v = Numberformatter_1.Numberformatter.format(this._format, value);
            }
            $(this.dom).val(v);
        }
        get value() {
            if (this._formatProps && this._formatProps.inEditMode === false) //
                var j = 0; //do nothing
            else
                this.updateValue();
            return this._value;
        }
        onclick(handler) {
            return this.on("click", handler);
        }
        onchange(handler) {
            return this.on("change", handler);
        }
        onkeydown(handler) {
            return this.on("keydown", handler);
        }
        oninput(handler) {
            return this.on("input", handler);
        }
        /*
         * <input list="browsers" name="myBrowser" />
    <datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    </datalist>+>
         */
        set placeholder(text) {
            $(this.dom).attr("placeholder", text);
        }
        get placeholder() {
            return $(this.dom).attr("placeholder");
        }
        set autocompleterDisplay(value) {
            this._autocompleterDisplay = value;
            if (this.autocompleter !== undefined) {
                this.autocompleter = this.autocompleter; //force rendering
            }
        }
        get autocompleterDisplay() {
            return this._autocompleterDisplay;
        }
        fillCompletionList(values) {
            var h;
            var list = $(this.dom).attr("list");
            var html = "";
            var comp = $("#" + list);
            comp[0]._values = values;
            //comp.empty();
            for (var x = 0; x < values.length; x++) {
                var val = values[x];
                if (typeof (this.autocompleterDisplay) === "function") {
                    val = this.autocompleterDisplay(val);
                }
                else if (this.autocompleterDisplay !== undefined) {
                    val = val[this.autocompleterDisplay];
                }
                html += '<option value="' + val + '">';
                //comp.append('<option value="'+val+'">');
            }
            comp[0].innerHTML = html;
        }
        set autocompleter(value) {
            var list = $(this.dom).attr("list");
            var _this = this;
            if (!list && typeof (value) === "function") {
                $(this.dom).on("mouseover", (ob) => {
                    if (_this._autocompleter.children.length === 0) {
                        var values = value();
                        _this.fillCompletionList(values);
                    }
                });
            }
            if (list === undefined) {
                list = Registry_1.default.nextID();
                this._autocompleter = $('<datalist id="' + list + '"/>')[0];
                this.domWrapper.appendChild(this._autocompleter);
                $(this.dom).attr("list", list);
            }
            if (typeof (value) === "function") {
            }
            else {
                this.fillCompletionList(value);
            }
            // $(this.dom).val(value);
        }
        get autocompleter() {
            var list = $(this.dom).prop("list");
            if (list === undefined)
                return undefined;
            var comp = $(list)[0];
            if (comp === undefined)
                return undefined;
            return comp._values;
            // return $(this.dom).val();
        }
        /**
         * focus the textbox
         */
        focus() {
            $(this.dom).focus();
        }
        destroy() {
            if (this._autocompleter)
                $(this._autocompleter).remove();
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ type: "classselector", service: "$Converter" }),
        __metadata("design:type", DefaultConverter_1.DefaultConverter)
    ], Textbox.prototype, "converter", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "string", chooseFrom: allFormats }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Textbox.prototype, "format", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Textbox.prototype, "value", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onclick", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onchange", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onkeydown", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "oninput", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Textbox.prototype, "placeholder", null);
    Textbox = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Textbox", icon: "mdi mdi-form-textbox" }),
        (0, Jassi_1.$Class)("jassijs.ui.Textbox"),
        (0, Property_1.$Property)({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], Textbox);
    exports.Textbox = Textbox;
    function test() {
        var ret = new Textbox();
        //ret.autocompleter=()=>[];
        return ret;
    }
    exports.test = test;
});
// return CodeEditor.constructor;
//# sourceMappingURL=Textbox.js.map