var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/DataComponent", "jassi/ui/converters/DefaultConverter", "jassi/remote/Registry", "jassi/ui/Property"], function (require, exports, Jassi_1, Component_1, DataComponent_1, DefaultConverter_1, Registry_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Textbox = void 0;
    let Textbox = class Textbox extends DataComponent_1.DataComponent {
        constructor(color = undefined) {
            super();
            super.init($('<input type="text" />')[0]);
            $(this.dom).css("color", color);
            this.converter = undefined;
        }
        /**
         * @member {boolean} disabled - enable or disable the element
         */
        set disabled(value) {
            $(this.dom).prop('disabled', true);
        }
        get disabled() {
            return $(this.dom).prop('disabled');
        }
        /**
         * @member {string} value - value of the component
         */
        set value(value) {
            $(this.dom).val(value);
        }
        get value() {
            var ret = $(this.dom).val();
            if (this.converter !== undefined) {
                ret = this.converter.stringToObject(ret);
            }
            return ret;
        }
        /**
       * called if value has changed
       * @param {function} handler - the function which is executed
       */
        onclick(handler) {
            $("#" + this._id).click(function (e) {
                handler(e);
            });
        }
        /**
         * called if value has changed
         * @param {function} handler - the function which is executed
         */
        onchange(handler) {
            $("#" + this._id).change(function (e) {
                handler(e);
            });
        }
        /**
         * called if a key is pressed down
         * @param {function} handler - the function which is executed
         */
        onkeydown(handler) {
            $(this.dom).keydown(function (e) {
                handler(e);
            });
        }
        /**
         * called if user has something typed
         * @param {function} handler - the function which is executed
         */
        oninput(handler) {
            $("#" + this._id).on("input", function () {
                handler();
            });
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
        /**
        *  @member {string|function} completerDisplay - property or function used to gets the value to display
        */
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
            console.log("fill");
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
        /**
         *  @member {[object]} completer - values used for autocompleting
         */
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
        Property_1.$Property({ type: "classselector", service: "$Converter" }),
        __metadata("design:type", DefaultConverter_1.DefaultConverter)
    ], Textbox.prototype, "converter", void 0);
    __decorate([
        Property_1.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Textbox.prototype, "value", null);
    __decorate([
        Property_1.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onclick", null);
    __decorate([
        Property_1.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onchange", null);
    __decorate([
        Property_1.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onkeydown", null);
    __decorate([
        Property_1.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "oninput", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Textbox.prototype, "placeholder", null);
    Textbox = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Textbox", icon: "mdi mdi-form-textbox" }),
        Jassi_1.$Class("jassi.ui.Textbox"),
        Property_1.$Property({ name: "new", type: "string" }),
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