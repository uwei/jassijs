import { $Class } from "jassijs/remote/Registry";
import { Component, $UIComponent } from "jassijs/ui/Component";
import { DataComponent, DataComponentConfig } from "jassijs/ui/DataComponent";
import { DefaultConverter } from "jassijs/ui/converters/DefaultConverter";
import registry from "jassijs/remote/Registry";
import { Property, $Property } from "jassijs/ui/Property";
import { Numberformatter } from "jassijs/util/Numberformatter";
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
export interface TextboxConfig extends DataComponentConfig {
    converter?: DefaultConverter;
    /**
    * @member {boolean} disabled - enable or disable the element
    */
    disabled?: boolean;
    /**
    * @member {string} value - value of the component
    */
    format?: string;
    /**
     * @member {string} value - value of the component
     */
    value?;
    /**
    * called if value has changed
    * @param {function} handler - the function which is executed
    */
    onclick?(handler);
    /**
     * called if value has changed
     * @param {function} handler - the function which is executed
     */
    onchange?(handler);
    /**
     * called if a key is pressed down
     * @param {function} handler - the function which is executed
     */
    onkeydown?(handler);
    /**
     * called if user has something typed
     * @param {function} handler - the function which is executed
     */
    oninput?(handler);
    placeholder?: string;
    /**
    *  @member {string|function} completerDisplay - property or function used to gets the value to display
    */
    autocompleterDisplay?: string | ((object: any) => string);
    /**
    *  @member {[object]} completer - values used for autocompleting
    */
    autocompleter?: any[] | (() => any);
    /**
     * @member {boolean} - the textfield is readonly
     */
    readOnly?: boolean;
}
@$UIComponent({ fullPath: "common/Textbox", icon: "mdi mdi-form-textbox" })
@$Class("jassijs.ui.Textbox")
@$Property({ name: "new", type: "string" })
export class Textbox extends DataComponent implements TextboxConfig {
    /* get dom(){
         return this.dom;
     }*/
    @$Property({ type: "classselector", service: "$Converter" })
    converter: DefaultConverter;
    _autocompleterDisplay;
    _autocompleter;
    private _value: any = "";
    _format: string;
    _formatProps: {
        focus: any;
        blur: any;
        inEditMode: boolean;
    } = undefined;
    constructor(color = undefined) {
        super();
        super.init('<input type="text" />');
        this.dom.style.color = color;
        this.converter = undefined;
    }
    config(config: TextboxConfig): Textbox {
        super.config(config);
        return this;
    }
    get dom(): HTMLInputElement {
        return <any>super.dom;
    }
    set dom(value: HTMLInputElement) {
        super.dom = value;
    }
    set disabled(value) {
        this.dom.disabled = true;
    }
    get disabled() {
        return this.dom.disabled;
    }
    set readOnly(value: boolean) {
        this.dom.readOnly = true;
    }
    @$Property()
    get readOnly(): boolean {
        return this.dom.readOnly;
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
                this.dom.value = Numberformatter.numberToString(val);
            });
            this._formatProps.blur = this.on("blur", () => {
                _this.updateValue();
                _this._formatProps.inEditMode = false;
                this.dom.value = Numberformatter.format(this._format, this.value);
            });
        }
        if (this.value)
            this.value = this.value; //apply the ne format
    }
    @$Property({ type: "string", chooseFrom: allFormats })
    get format() {
        return this._format;
    }
    private updateValue() {
        var ret = this.dom?.value;
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
            v = Numberformatter.format(this._format, value);
        }
        this.dom.value = v === undefined ? "" : v;
    }
    @$Property({ type: "string" })
    get value() {
        if (this._formatProps && this._formatProps.inEditMode === false) //
            var j = 0; //do nothing
        else
            this.updateValue();
        return this._value;
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onclick(handler) {
        return this.on("click", handler);
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onchange(handler) {
        return this.on("change", handler);
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onkeydown(handler) {
        return this.on("keydown", handler);
    }
    @$Property({ default: "function(event){\n\t\n}" })
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
    @$Property()
    set placeholder(text: string) {
        this.dom.placeholder = text;
    }
    get placeholder(): string {
        return this.dom.placeholder;
    }
    set autocompleterDisplay(value: string | ((object: any) => string)) {
        this._autocompleterDisplay = value;
        if (this.autocompleter !== undefined) {
            this.autocompleter = this.autocompleter; //force rendering
        }
    }
    get autocompleterDisplay() {
        return this._autocompleterDisplay;
    }
    private fillCompletionList(values: any) {
        var h: any[] | (() => any);
        var list = this.dom.getAttribute("list");
        var html = "";
        var comp: any = document.getElementById(list);
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
    set autocompleter(value: any[] | (() => any)) {
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
            list = "j" + registry.nextID();
            this._autocompleter = Component.createHTMLElement('<datalist id="' + list + '"/>');
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
}
export function test() {
    var ret = new Textbox();
    ret.autocompleter = ["Hallo", "Du"];
    ret.format="###,00";
    ret.value=10.1;
    //ret.autocompleter=()=>[];
    return ret;
}
// return CodeEditor.constructor;
