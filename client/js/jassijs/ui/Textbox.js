var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_1, Component_1, DataComponent_1, DefaultConverter_1, Registry_2, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Textbox = void 0;
    Registry_2 = __importDefault(Registry_2);
    let Textbox = class Textbox extends DataComponent_1.DataComponent {
        constructor(props = {}) {
            super(props);
            this._value = "";
            this._isFocused = false;
            var _this = this;
            this.onblur((e) => _this.blurcalled(e));
            this.onfocus((e) => _this.focuscalled(e));
            // this.converter = undefined;
        }
        render() {
            return React.createElement("input", Object.assign(Object.assign({}, this.props.domProperties), { type: "text" }));
        }
        get dom() {
            return super.dom;
        }
        set dom(value) {
            super.dom = value;
        }
        set disabled(value) {
            this.dom.disabled = value;
            this.state.disabled.current = value;
        }
        get disabled() {
            return this.dom.disabled;
        }
        set readOnly(value) {
            this.dom.readOnly = value;
        }
        get converter() {
            return this._converter;
        }
        set converter(value) {
            this._converter = value;
            if (value)
                this.converter.component = this;
            this.value = this.value;
        }
        get readOnly() {
            return this.dom.readOnly;
        }
        focuscalled(evt) {
            this._isFocused = true;
            if (this.converter) {
                this.dom.value = this.converter.objectToString(this._value);
            }
        }
        blurcalled(evt) {
            this._isFocused = false;
            this.updateValue();
            if (this.converter) {
                this.dom.value = this.converter.objectToFormatedString(this.value);
            }
        }
        set value(value) {
            this._value = value;
            var v = value;
            if (this.converter)
                v = this.converter.objectToFormatedString(v);
            if (this.dom)
                this.dom.value = v === undefined ? "" : v;
            this.state.value.current = value;
        }
        get value() {
            //  if (this._isFocused)
            this.updateValue();
            // else if (this.converter) {
            //   return  this.converter.stringToObject(this.dom.value);
            //} 
            return this._value;
        }
        updateValue() {
            var _a;
            if (this.converter) {
                this.value = this.converter.stringToObject(this.dom.value);
            }
            else {
                this.value = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.value;
            }
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
            this.dom.placeholder = text;
        }
        get placeholder() {
            return this.dom.placeholder;
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
            var list = this.dom.getAttribute("list");
            var html = "";
            var comp = document.getElementById(list);
            comp._values = values;
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
            comp.innerHTML = html;
        }
        set autocompleter(value) {
            var list = this.dom.getAttribute("list");
            var _this = this;
            if (!list && typeof (value) === "function") {
                this.on("mouseover", (ob) => {
                    if (_this._autocompleter.children.length === 0) {
                        var values = value();
                        _this.fillCompletionList(values);
                    }
                });
            }
            if (list === undefined || list === null) {
                list = "j" + Registry_2.default.nextID();
                this._autocompleter = Component_1.Component.createHTMLElement('<datalist id="' + list + '"/>');
                this.domWrapper.appendChild(this._autocompleter);
                this.dom.setAttribute("list", list);
            }
            if (typeof (value) === "function") {
            }
            else {
                this.fillCompletionList(value);
            }
        }
        get autocompleter() {
            var list = this.dom.list;
            if (list === undefined)
                return undefined;
            var comp = list; //$(list)[0];
            if (comp === undefined)
                return undefined;
            return comp["_values"];
        }
        /**
         * focus the textbox
         */
        focus() {
            this.dom.focus();
        }
        destroy() {
            if (this._autocompleter)
                this._autocompleter.remove();
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ type: "classselector", service: "$Converter" }),
        __metadata("design:type", DefaultConverter_1.DefaultConverter),
        __metadata("design:paramtypes", [DefaultConverter_1.DefaultConverter])
    ], Textbox.prototype, "converter", null);
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
        (0, Registry_1.$Class)("jassijs.ui.Textbox"),
        __metadata("design:paramtypes", [Object])
    ], Textbox);
    exports.Textbox = Textbox;
    function test() {
        var ret = new Textbox();
        ret.autocompleter = ["Hallo", "Du"];
        ret.value = 10.1;
        //ret.autocompleter=()=>[];
        return ret;
    }
    exports.test = test;
});
// return CodeEditor.constructor;
//# sourceMappingURL=Textbox.js.map