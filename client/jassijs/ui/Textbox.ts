import { $Class } from "jassijs/remote/Registry";
import { Component, $UIComponent } from "jassijs/ui/Component";
import { DataComponent, DataComponentConfig } from "jassijs/ui/DataComponent";
import { DefaultConverter } from "jassijs/ui/converters/DefaultConverter";
import registry from "jassijs/remote/Registry";
import { Property, $Property } from "jassijs/ui/Property";

export interface TextboxConfig extends DataComponentConfig {
    converter?: DefaultConverter;
    /**
    * @member {boolean} disabled - enable or disable the element
    */
    disabled?: boolean;
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

    _converter: DefaultConverter;
    _autocompleterDisplay;
    _autocompleter;
    private _value: any = "";
    private _isFocused = false;
    constructor(color = undefined) {
        super();
        super.init('<input type="text" />');
        var _this = this;
        this.dom.style.color = color;
        this.onblur((e) => _this.blurcalled(e));
        this.onfocus((e) => _this.focuscalled(e));
        // this.converter = undefined;
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
        this.dom.readOnly = value;
    }
    get converter(): DefaultConverter {
        return this._converter;
    }
    @$Property({ type: "classselector", service: "$Converter" })
    set converter(value: DefaultConverter) {
        this._converter = value;
        if(value)
            this.converter.component=this;
        this.value=this.value;
    }
    @$Property()
    get readOnly(): boolean {
        return this.dom.readOnly;
    }
    private focuscalled(evt) {
        this._isFocused = true;
        if (this.converter) {
            this.dom.value = this.converter.objectToString(this._value)
        }
    }
    private updateValue() {
        if (this.converter) {
            this.value = this.converter.stringToObject(this.dom.value);
        } else {
            this.value = this.dom.value;
        }
    }
    private blurcalled(evt) {
        this._isFocused = false;
        this.updateValue();
        if (this.converter) {
            this.dom.value = this.converter.objectToFormatedString(this.value)
        }
    }

    set value(value) {
        this._value = value;
        var v = value;
        if (this.converter)
            v = this.converter.objectToFormatedString(v);
        this.dom.value = v === undefined ? "" : v;
    }
    @$Property({ type: "string" })
    get value() {
        if (this._isFocused)
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
    ret.value = 10.1;

    //ret.autocompleter=()=>[];
    return ret;
}
// return CodeEditor.constructor;
