import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Component, $UIComponent } from "jassijs/ui/Component";
import { DataComponent } from "jassijs/ui/DataComponent";
import { DefaultConverter } from "jassijs/ui/converters/DefaultConverter";
import registry from "jassijs/remote/Registry";
import { Property, $Property } from "jassijs/ui/Property";
import { Numberformatter } from "jassijs/util/Numberformatter";

//calc the default Formats
let allFormats=(()=>{
    var ret=[];
    const format = new Intl.NumberFormat();
		const parts = format.formatToParts(1234.6);
  		var decimal = ".";
        var group=",";
		parts.forEach(p => {
			if (p.type === "decimal")
				decimal = p.value;
            if (p.type === "group")
				group = p.value;
		});
    ret.push("#"+group+"##0"+decimal+"00");
    ret.push("#"+group+"##0"+decimal+"00 €");
    ret.push("#"+group+"##0"+decimal+"00 $");
    ret.push("0");
    ret.push("0"+decimal+"00");

    return ret;
})();

@$UIComponent({ fullPath: "common/Textbox", icon: "mdi mdi-form-textbox" })
@$Class("jassijs.ui.Textbox")
@$Property({ name: "new", type: "string" })
export class Textbox extends DataComponent {
    /* get dom(){
         return this.dom;
     }*/
    @$Property({ type: "classselector", service: "$Converter" })
    converter: DefaultConverter;
    _autocompleterDisplay;
    _autocompleter;
    private _value: any = "";
    _format: string;
    _formatProps: { focus: any, blur: any, inEditMode: boolean } = undefined;
    constructor(color = undefined) { /* document.onkeydown = function(event) {
                alert("Hallo");
            };*/
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
    set format(value) { //the Code
        this._format = value;
        var _this = this;
        if (value === undefined && this._formatProps) {
            this.off("focus", this._formatProps.focus);
            this.off("blur", this._formatProps.blur);
        }
       
        if (value && this._formatProps === undefined) {
            _this._formatProps={blur:undefined,focus:undefined,inEditMode:false};
            this._formatProps.focus = this.on("focus", () => {
                let val=this.value;
                _this._formatProps.inEditMode = true;
                $(this.dom).val(Numberformatter.numberToString(val));
            });
            this._formatProps.blur = this.on("blur", () => {
                _this.updateValue();
                _this._formatProps.inEditMode = false;
                $(this.dom).val(Numberformatter.format(this._format, this.value));
            });
        }
        if(this.value)
            this.value=this.value;//apply the ne format
        //      $(this.dom).val(value);
    }
    @$Property({ type: "string" ,chooseFrom:allFormats})
    get format() {
        return this._format;
    }
    private updateValue() {
        var ret = $(this.dom).val();
        if (this.converter !== undefined) {
            ret = this.converter.stringToObject(ret);
        }
        this._value = ret;
    }
    /**
     * @member {string} value - value of the component 
     */
    set value(value) { //the Code
        this._value = value;
        var v = value;
        if (this.converter)
            v = this.converter.objectToString(v);
        if(this._format){
            v=Numberformatter.format(this._format, value);
        }

        $(this.dom).val(v);
    }
    @$Property({ type: "string" })
    get value() {
        if (this._formatProps && this._formatProps.inEditMode === false)//
            var j = 0;//do nothing
        else
            this.updateValue();
        return this._value;
    }
    /**
   * called if value has changed
   * @param {function} handler - the function which is executed
   */

    @$Property({ default: "function(event){\n\t\n}" })
    onclick(handler) {
        return this.on("click", handler);
    }
    /**
     * called if value has changed
     * @param {function} handler - the function which is executed
     */

    @$Property({ default: "function(event){\n\t\n}" })
    onchange(handler) {
        return this.on("change", handler);
    }

    /**
     * called if a key is pressed down
     * @param {function} handler - the function which is executed
     */
    @$Property({ default: "function(event){\n\t\n}" })
    onkeydown(handler) {
        return this.on("keydown", handler);
    }
    /**
     * called if user has something typed
     * @param {function} handler - the function which is executed
     */
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
        $(this.dom).attr("placeholder", text);
    }

    get placeholder(): string {
        return $(this.dom).attr("placeholder");
    }
    /**
    *  @member {string|function} completerDisplay - property or function used to gets the value to display
    */
    set autocompleterDisplay(value: string | ((object: any) => string)) {
        this._autocompleterDisplay = value;
        if (this.autocompleter !== undefined) {
            this.autocompleter = this.autocompleter;//force rendering
        }
    }
    get autocompleterDisplay() {
        return this._autocompleterDisplay;
    }
    private fillCompletionList(values: any) {
        var h: any[] | (() => any);
        var list = $(this.dom).attr("list");
        var html = "";
        var comp: any = $("#" + list);
        comp[0]._values = values;
        //comp.empty();
        for (var x = 0; x < values.length; x++) {
            var val = values[x];
            if (typeof (this.autocompleterDisplay) === "function") {
                val = this.autocompleterDisplay(val);
            } else if (this.autocompleterDisplay !== undefined) {
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
    set autocompleter(value: any[] | (() => any)) {
        var list = $(this.dom).attr("list");
        var _this = this;
        if (!list && typeof (value) === "function") {
            $(this.dom).on("mouseover", (ob) => {
                if (_this._autocompleter.children.length === 0) {
                    var values = value();
                    _this.fillCompletionList(values);
                }
            })
        }
        if (list === undefined) {
            list = registry.nextID();
            this._autocompleter = $('<datalist id="' + list + '"/>')[0];
            this.domWrapper.appendChild(this._autocompleter);
            $(this.dom).attr("list", list);
        }
        if (typeof (value) === "function") {

        } else {
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

}
export function test() {
    var ret = new Textbox();
    //ret.autocompleter=()=>[];
    return ret;
}
   // return CodeEditor.constructor;