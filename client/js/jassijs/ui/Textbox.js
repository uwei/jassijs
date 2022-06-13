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
    var _a;
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
        __metadata("design:type", typeof (_a = typeof DefaultConverter_1.DefaultConverter !== "undefined" && DefaultConverter_1.DefaultConverter) === "function" ? _a : Object)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dGJveC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvVGV4dGJveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQVFBLDBCQUEwQjtJQUMxQixJQUFJLFVBQVUsR0FBRyxDQUFDLEdBQUcsRUFBRTtRQUNuQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixNQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV2QyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hEOzs7Ozs7OztpQkFRUztRQUNULEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9DLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFL0IsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDLENBQUMsRUFBRSxDQUFDO0lBa0RMLElBQWEsT0FBTyxHQUFwQixNQUFhLE9BQVEsU0FBUSw2QkFBYTtRQVd0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LEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQzs7T0FDOUIsT0FBTyxDQXNNbkI7SUF0TVksMEJBQU87SUF1TXBCLFNBQWdCLElBQUk7UUFDaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN4QiwyQkFBMkI7UUFDM0IsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBSkQsb0JBSUM7O0FBQ0UsaUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgJFVJQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IERhdGFDb21wb25lbnQsIERhdGFDb21wb25lbnRDb25maWcgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IERlZmF1bHRDb252ZXJ0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9jb252ZXJ0ZXJzL0RlZmF1bHRDb252ZXJ0ZXJcIjtcclxuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBQcm9wZXJ0eSwgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcclxuaW1wb3J0IHsgTnVtYmVyZm9ybWF0dGVyIH0gZnJvbSBcImphc3NpanMvdXRpbC9OdW1iZXJmb3JtYXR0ZXJcIjtcclxuXHJcbi8vY2FsYyB0aGUgZGVmYXVsdCBGb3JtYXRzXHJcbmxldCBhbGxGb3JtYXRzID0gKCgpID0+IHtcclxuICAgIHZhciByZXQgPSBbXTtcclxuICAgIGNvbnN0IGZvcm1hdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCgpO1xyXG5cclxuICAgIHZhciBkZWNpbWFsID0gZm9ybWF0LmZvcm1hdCgxLjEpLnN1YnN0cmluZygxLCAyKTtcclxuICAgIHZhciBncm91cCA9IGZvcm1hdC5mb3JtYXQoMTIzNCkuc3Vic3RyaW5nKDEsIDIpO1xyXG4gICAgLypcdGNvbnN0IHBhcnRzID0gZm9ybWF0LmZvcm1hdFRvUGFydHMoMTIzNC42KTtcclxuICAgICAgICAgICAgdmFyIGRlY2ltYWwgPSBcIi5cIjtcclxuICAgICAgICB2YXIgZ3JvdXA9XCIsXCI7XHJcbiAgICAgICAgcGFydHMuZm9yRWFjaChwID0+IHtcclxuICAgICAgICAgICAgaWYgKHAudHlwZSA9PT0gXCJkZWNpbWFsXCIpXHJcbiAgICAgICAgICAgICAgICBkZWNpbWFsID0gcC52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHAudHlwZSA9PT0gXCJncm91cFwiKVxyXG4gICAgICAgICAgICAgICAgZ3JvdXAgPSBwLnZhbHVlO1xyXG4gICAgICAgIH0pOyovXHJcbiAgICByZXQucHVzaChcIiNcIiArIGdyb3VwICsgXCIjIzBcIiArIGRlY2ltYWwgKyBcIjAwXCIpO1xyXG4gICAgcmV0LnB1c2goXCIjXCIgKyBncm91cCArIFwiIyMwXCIgKyBkZWNpbWFsICsgXCIwMCDigqxcIik7XHJcbiAgICByZXQucHVzaChcIiNcIiArIGdyb3VwICsgXCIjIzBcIiArIGRlY2ltYWwgKyBcIjAwICRcIik7XHJcbiAgICByZXQucHVzaChcIjBcIik7XHJcbiAgICByZXQucHVzaChcIjBcIiArIGRlY2ltYWwgKyBcIjAwXCIpO1xyXG5cclxuICAgIHJldHVybiByZXQ7XHJcbn0pKCk7XHJcbmV4cG9ydCBpbnRlcmZhY2UgVGV4dGJveENvbmZpZyBleHRlbmRzIERhdGFDb21wb25lbnRDb25maWcge1xyXG4gICAgY29udmVydGVyPzogRGVmYXVsdENvbnZlcnRlcjtcclxuICAgIC8qKlxyXG4gICAgKiBAbWVtYmVyIHtib29sZWFufSBkaXNhYmxlZCAtIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBlbGVtZW50XHJcbiAgICAqL1xyXG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xyXG4gICAgLyoqXHJcbiAgICAqIEBtZW1iZXIge3N0cmluZ30gdmFsdWUgLSB2YWx1ZSBvZiB0aGUgY29tcG9uZW50IFxyXG4gICAgKi9cclxuICAgIGZvcm1hdD86IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBjb21wb25lbnQgXHJcbiAgICAgKi9cclxuICAgIHZhbHVlPztcclxuICAgIC8qKlxyXG4gICAgKiBjYWxsZWQgaWYgdmFsdWUgaGFzIGNoYW5nZWRcclxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZFxyXG4gICAgKi9cclxuICAgIG9uY2xpY2s/KGhhbmRsZXIpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsZWQgaWYgdmFsdWUgaGFzIGNoYW5nZWRcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSB0aGUgZnVuY3Rpb24gd2hpY2ggaXMgZXhlY3V0ZWRcclxuICAgICAqL1xyXG5cclxuICAgIG9uY2hhbmdlPyhoYW5kbGVyKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGxlZCBpZiBhIGtleSBpcyBwcmVzc2VkIGRvd25cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSB0aGUgZnVuY3Rpb24gd2hpY2ggaXMgZXhlY3V0ZWRcclxuICAgICAqL1xyXG4gICAgb25rZXlkb3duPyhoYW5kbGVyKTtcclxuICAgIC8qKlxyXG4gICAgICogY2FsbGVkIGlmIHVzZXIgaGFzIHNvbWV0aGluZyB0eXBlZFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZFxyXG4gICAgICovXHJcbiAgICBvbmlucHV0PyhoYW5kbGVyKTtcclxuICAgIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAqICBAbWVtYmVyIHtzdHJpbmd8ZnVuY3Rpb259IGNvbXBsZXRlckRpc3BsYXkgLSBwcm9wZXJ0eSBvciBmdW5jdGlvbiB1c2VkIHRvIGdldHMgdGhlIHZhbHVlIHRvIGRpc3BsYXlcclxuICAgICovXHJcbiAgICBhdXRvY29tcGxldGVyRGlzcGxheT86IHN0cmluZyB8ICgob2JqZWN0OiBhbnkpID0+IHN0cmluZylcclxuICAgIC8qKlxyXG4gICAgKiAgQG1lbWJlciB7W29iamVjdF19IGNvbXBsZXRlciAtIHZhbHVlcyB1c2VkIGZvciBhdXRvY29tcGxldGluZyBcclxuICAgICovXHJcbiAgICBhdXRvY29tcGxldGVyPzogYW55W10gfCAoKCkgPT4gYW55KTtcclxufVxyXG5AJFVJQ29tcG9uZW50KHsgZnVsbFBhdGg6IFwiY29tbW9uL1RleHRib3hcIiwgaWNvbjogXCJtZGkgbWRpLWZvcm0tdGV4dGJveFwiIH0pXHJcbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlRleHRib3hcIilcclxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwibmV3XCIsIHR5cGU6IFwic3RyaW5nXCIgfSlcclxuZXhwb3J0IGNsYXNzIFRleHRib3ggZXh0ZW5kcyBEYXRhQ29tcG9uZW50IGltcGxlbWVudHMgVGV4dGJveENvbmZpZyB7XHJcbiAgICAvKiBnZXQgZG9tKCl7XHJcbiAgICAgICAgIHJldHVybiB0aGlzLmRvbTtcclxuICAgICB9Ki9cclxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImNsYXNzc2VsZWN0b3JcIiwgc2VydmljZTogXCIkQ29udmVydGVyXCIgfSlcclxuICAgIGNvbnZlcnRlcjogRGVmYXVsdENvbnZlcnRlcjtcclxuICAgIF9hdXRvY29tcGxldGVyRGlzcGxheTtcclxuICAgIF9hdXRvY29tcGxldGVyO1xyXG4gICAgcHJpdmF0ZSBfdmFsdWU6IGFueSA9IFwiXCI7XHJcbiAgICBfZm9ybWF0OiBzdHJpbmc7XHJcbiAgICBfZm9ybWF0UHJvcHM6IHsgZm9jdXM6IGFueSwgYmx1cjogYW55LCBpbkVkaXRNb2RlOiBib29sZWFuIH0gPSB1bmRlZmluZWQ7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb2xvciA9IHVuZGVmaW5lZCkgeyAvKiBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJIYWxsb1wiKTtcclxuICAgICAgICAgICAgfTsqL1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgkKCc8aW5wdXQgdHlwZT1cInRleHRcIiAvPicpWzBdKTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJjb2xvclwiLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0ZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBjb25maWcoY29uZmlnOiBUZXh0Ym94Q29uZmlnKTogVGV4dGJveCB7XHJcbiAgICAgICAgc3VwZXIuY29uZmlnKGNvbmZpZyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXQgZGlzYWJsZWQodmFsdWUpIHtcclxuICAgICAgICAkKHRoaXMuZG9tKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGRpc2FibGVkKCkge1xyXG4gICAgICAgIHJldHVybiAkKHRoaXMuZG9tKS5wcm9wKCdkaXNhYmxlZCcpO1xyXG4gICAgfVxyXG4gICAgc2V0IGZvcm1hdCh2YWx1ZSkgeyAvL3RoZSBDb2RlXHJcbiAgICAgICAgdGhpcy5fZm9ybWF0ID0gdmFsdWU7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiB0aGlzLl9mb3JtYXRQcm9wcykge1xyXG4gICAgICAgICAgICB0aGlzLm9mZihcImZvY3VzXCIsIHRoaXMuX2Zvcm1hdFByb3BzLmZvY3VzKTtcclxuICAgICAgICAgICAgdGhpcy5vZmYoXCJibHVyXCIsIHRoaXMuX2Zvcm1hdFByb3BzLmJsdXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHRoaXMuX2Zvcm1hdFByb3BzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX2Zvcm1hdFByb3BzID0geyBibHVyOiB1bmRlZmluZWQsIGZvY3VzOiB1bmRlZmluZWQsIGluRWRpdE1vZGU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2Zvcm1hdFByb3BzLmZvY3VzID0gdGhpcy5vbihcImZvY3VzXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2Zvcm1hdFByb3BzLmluRWRpdE1vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmRvbSkudmFsKE51bWJlcmZvcm1hdHRlci5udW1iZXJUb1N0cmluZyh2YWwpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zvcm1hdFByb3BzLmJsdXIgPSB0aGlzLm9uKFwiYmx1clwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2Zvcm1hdFByb3BzLmluRWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICQodGhpcy5kb20pLnZhbChOdW1iZXJmb3JtYXR0ZXIuZm9ybWF0KHRoaXMuX2Zvcm1hdCwgdGhpcy52YWx1ZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlOy8vYXBwbHkgdGhlIG5lIGZvcm1hdFxyXG4gICAgICAgIC8vICAgICAgJCh0aGlzLmRvbSkudmFsKHZhbHVlKTtcclxuICAgIH1cclxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiLCBjaG9vc2VGcm9tOiBhbGxGb3JtYXRzIH0pXHJcbiAgICBnZXQgZm9ybWF0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVZhbHVlKCkge1xyXG4gICAgICAgIHZhciByZXQgPSAkKHRoaXMuZG9tKS52YWwoKTtcclxuICAgICAgICBpZiAodGhpcy5jb252ZXJ0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLmNvbnZlcnRlci5zdHJpbmdUb09iamVjdChyZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl92YWx1ZSA9IHJldDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmFsdWUodmFsdWUpIHsgLy90aGUgQ29kZVxyXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdmFyIHYgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5jb252ZXJ0ZXIpXHJcbiAgICAgICAgICAgIHYgPSB0aGlzLmNvbnZlcnRlci5vYmplY3RUb1N0cmluZyh2KTtcclxuICAgICAgICBpZiAodGhpcy5fZm9ybWF0KSB7XHJcbiAgICAgICAgICAgIHYgPSBOdW1iZXJmb3JtYXR0ZXIuZm9ybWF0KHRoaXMuX2Zvcm1hdCwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh0aGlzLmRvbSkudmFsKHYpO1xyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZm9ybWF0UHJvcHMgJiYgdGhpcy5fZm9ybWF0UHJvcHMuaW5FZGl0TW9kZSA9PT0gZmFsc2UpLy9cclxuICAgICAgICAgICAgdmFyIGogPSAwOy8vZG8gbm90aGluZ1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJmdW5jdGlvbihldmVudCl7XFxuXFx0XFxufVwiIH0pXHJcbiAgICBvbmNsaWNrKGhhbmRsZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbihcImNsaWNrXCIsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZ1bmN0aW9uKGV2ZW50KXtcXG5cXHRcXG59XCIgfSlcclxuICAgIG9uY2hhbmdlKGhhbmRsZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbihcImNoYW5nZVwiLCBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IFwiZnVuY3Rpb24oZXZlbnQpe1xcblxcdFxcbn1cIiB9KVxyXG4gICAgb25rZXlkb3duKGhhbmRsZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbihcImtleWRvd25cIiwgaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IFwiZnVuY3Rpb24oZXZlbnQpe1xcblxcdFxcbn1cIiB9KVxyXG4gICAgb25pbnB1dChoYW5kbGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub24oXCJpbnB1dFwiLCBoYW5kbGVyKTtcclxuICAgIH1cclxuICAgIC8qXHJcbiAgICAgKiA8aW5wdXQgbGlzdD1cImJyb3dzZXJzXCIgbmFtZT1cIm15QnJvd3NlclwiIC8+XHJcbjxkYXRhbGlzdCBpZD1cImJyb3dzZXJzXCI+XHJcbjxvcHRpb24gdmFsdWU9XCJDaHJvbWVcIj5cclxuPG9wdGlvbiB2YWx1ZT1cIkZpcmVmb3hcIj5cclxuPC9kYXRhbGlzdD4rPlxyXG4gICAgICovXHJcbiAgICBAJFByb3BlcnR5KClcclxuICAgIHNldCBwbGFjZWhvbGRlcih0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAkKHRoaXMuZG9tKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgdGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBsYWNlaG9sZGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICQodGhpcy5kb20pLmF0dHIoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYXV0b2NvbXBsZXRlckRpc3BsYXkodmFsdWU6IHN0cmluZyB8ICgob2JqZWN0OiBhbnkpID0+IHN0cmluZykpIHtcclxuICAgICAgICB0aGlzLl9hdXRvY29tcGxldGVyRGlzcGxheSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZXIgPSB0aGlzLmF1dG9jb21wbGV0ZXI7Ly9mb3JjZSByZW5kZXJpbmdcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQgYXV0b2NvbXBsZXRlckRpc3BsYXkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9jb21wbGV0ZXJEaXNwbGF5O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaWxsQ29tcGxldGlvbkxpc3QodmFsdWVzOiBhbnkpIHtcclxuICAgICAgICB2YXIgaDogYW55W10gfCAoKCkgPT4gYW55KTtcclxuICAgICAgICB2YXIgbGlzdCA9ICQodGhpcy5kb20pLmF0dHIoXCJsaXN0XCIpO1xyXG4gICAgICAgIHZhciBodG1sID0gXCJcIjtcclxuICAgICAgICB2YXIgY29tcDogYW55ID0gJChcIiNcIiArIGxpc3QpO1xyXG4gICAgICAgIGNvbXBbMF0uX3ZhbHVlcyA9IHZhbHVlcztcclxuICAgICAgICAvL2NvbXAuZW1wdHkoKTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZhbHVlcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdmFsdWVzW3hdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mICh0aGlzLmF1dG9jb21wbGV0ZXJEaXNwbGF5KSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLmF1dG9jb21wbGV0ZXJEaXNwbGF5KHZhbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvY29tcGxldGVyRGlzcGxheSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWxbdGhpcy5hdXRvY29tcGxldGVyRGlzcGxheV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaHRtbCArPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyB2YWwgKyAnXCI+JztcclxuICAgICAgICAgICAgLy9jb21wLmFwcGVuZCgnPG9wdGlvbiB2YWx1ZT1cIicrdmFsKydcIj4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcFswXS5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBhdXRvY29tcGxldGVyKHZhbHVlOiBhbnlbXSB8ICgoKSA9PiBhbnkpKSB7XHJcbiAgICAgICAgdmFyIGxpc3QgPSAkKHRoaXMuZG9tKS5hdHRyKFwibGlzdFwiKTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICghbGlzdCAmJiB0eXBlb2YgKHZhbHVlKSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5kb20pLm9uKFwibW91c2VvdmVyXCIsIChvYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLl9hdXRvY29tcGxldGVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSB2YWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmZpbGxDb21wbGV0aW9uTGlzdCh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGlzdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSByZWdpc3RyeS5uZXh0SUQoKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b2NvbXBsZXRlciA9ICQoJzxkYXRhbGlzdCBpZD1cIicgKyBsaXN0ICsgJ1wiLz4nKVswXTtcclxuICAgICAgICAgICAgdGhpcy5kb21XcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuX2F1dG9jb21wbGV0ZXIpO1xyXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5hdHRyKFwibGlzdFwiLCBsaXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUpID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5maWxsQ29tcGxldGlvbkxpc3QodmFsdWUpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gJCh0aGlzLmRvbSkudmFsKHZhbHVlKTtcclxuICAgIH1cclxuICAgIGdldCBhdXRvY29tcGxldGVyKCkge1xyXG4gICAgICAgIHZhciBsaXN0ID0gJCh0aGlzLmRvbSkucHJvcChcImxpc3RcIik7XHJcbiAgICAgICAgaWYgKGxpc3QgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgY29tcCA9ICQobGlzdClbMF07XHJcbiAgICAgICAgaWYgKGNvbXAgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gY29tcC5fdmFsdWVzO1xyXG4gICAgICAgIC8vIHJldHVybiAkKHRoaXMuZG9tKS52YWwoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZm9jdXMgdGhlIHRleHRib3hcclxuICAgICAqL1xyXG4gICAgZm9jdXMoKSB7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9jb21wbGV0ZXIpXHJcbiAgICAgICAgICAgICQodGhpcy5fYXV0b2NvbXBsZXRlcikucmVtb3ZlKCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciByZXQgPSBuZXcgVGV4dGJveCgpO1xyXG4gICAgLy9yZXQuYXV0b2NvbXBsZXRlcj0oKT0+W107XHJcbiAgICByZXR1cm4gcmV0O1xyXG59XHJcbiAgIC8vIHJldHVybiBDb2RlRWRpdG9yLmNvbnN0cnVjdG9yO1xyXG4iXX0=