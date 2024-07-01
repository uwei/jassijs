import { $Class } from "jassijs/remote/Registry";
import { ComponentProperties, $UIComponent } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";
import { DataComponent, DataComponentProperties } from "jassijs/ui/DataComponent";

export interface CheckboxProperties extends DataComponentProperties {
    /**
  * register an event if the button is clicked
  * @param {function} handler - the function that is called on change
  */
    onclick?(handler);
    /**
     * @member - true or "true" if selected
     */
    value?: string | boolean;
    /**
    * @member {string} - the caption of the button
    */
    text?: string; //the Code

}

@$UIComponent({ fullPath: "common/Ceckbox", icon: "mdi mdi-checkbox-marked-outline" })
@$Class("jassijs.ui.Checkbox")
export class Checkbox<T extends CheckboxProperties={}> extends DataComponent<CheckboxProperties> {
    checkbox: HTMLInputElement;
    /* get dom(){
         return this.dom;
     }*/
    constructor(properties:CheckboxProperties={}) {
        super(properties);
        //super.init('<div><input type="checkbox"><span class="checkboxtext" style="width:100%"></span></div>');
        this.checkbox = <HTMLInputElement>this.dom.firstChild;
    }
    render(){
        return React.createElement("div",{},
            React.createElement("input",{
                type:"checkbox",

            },
                React.createElement("span",{
                    className:"checkboxtext",
                    style:{
                        width:"100%"
                    }
                })));
    }
    config(config: CheckboxProperties): Checkbox {
        super.config(<ComponentProperties>config);
        return this;
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onclick(handler) {
        this.on("click",function () {
            handler();
        });
    }
    set value(value: string | boolean) { //the Code
        if (value === "true")
            value = true;
        if (value === "false")
            value = false;

        this.checkbox.checked= <boolean>value;
    }
    @$Property({ type: "boolean" })
    get value() {
        return this.checkbox.checked;
    }

    set text(value: string) { //the Code
        this.domWrapper.querySelector(".checkboxtext").innerHTML=value===undefined?"":value;
    }
    @$Property()
    get text(): string {
        return this.domWrapper.querySelector(".checkboxtext").innerHTML;
    }

}
export function test() {
    var cb = new Checkbox();
    cb.label = "label";
    cb.value = true;
    return cb;
}