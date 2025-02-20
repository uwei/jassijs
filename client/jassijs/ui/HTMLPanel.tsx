var bugtinymce = undefined;
import { Component, $UIComponent, ComponentProperties } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { Property, $Property } from "jassijs/ui/Property";
import { DataComponent, DataComponentProperties } from "jassijs/ui/DataComponent";
declare global {
    interface JQuery {
        doubletap: any;
    }
}

export interface HTMLPanelProperties extends DataComponentProperties {
    newlineafter?: boolean;

    /**
     * template string  component.value=new Person();component.template:"{{name}}"}
     */
    template?: string;
    value?: string;

}

@$UIComponent({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags" /*, initialize: { value: "text" } */ })
@$Class("jassijs.ui.HTMLPanel")
export class HTMLPanel<T extends HTMLPanelProperties=HTMLPanelProperties> extends DataComponent<T> implements HTMLPanelProperties {
    toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
    private _template: string;
    constructor(properties:HTMLPanelProperties={}) {
        super(properties);
        this.newlineafter = false;
    }
    render() {
        return <div contentEditable="false" className="HTMLPanel" tabIndex={-1} ><div className="HTMLPanelContent"> </div></div>;
   }
    config(config: T): HTMLPanel { 
        super.config(config);
        return this;
    }


    get newlineafter(): boolean {
        return this.dom.style.display === "inline-block";
    }
    @$Property({ description: "line break after element", default: false })
    set newlineafter(value) {
        this.dom.style.display = value ? "" : "inline-block";
        this.domWrapper.style.display = value ? "" : "inline-block";
        (this.dom.children[0] as HTMLElement).style.display = value ? "" : "inline-block";
    }
    compileTemplate(template) {
        return new Function('obj', 'with(obj){ return \'' +
            template.replace(/\n/g, '\\n').split(/{{([^{}]+)}}/g).map(function (expression, i) {
                return i % 2 ? ('\'+(' + expression.trim() + ')+\'') : expression;
            }).join('') +
            '\'; }');
    }
   get template(): string {
        return this._template;
    }
    @$Property({ decription: 'e.g. component.value=new Person();component.template:"{{name}}"' })
    set template(value: string) {
        this._template = value;
        this.value = this.value; //reformat value
    }
    /**
     * @member {string} code - htmlcode of the component
     **/
    @$Property()
    set value(code: string) {
        var scode = code;
        this.state.value.current = code;
        if (this.template) {
            if (this.state.value.current === undefined)
                scode = "";
            else {
                try {
                    scode = this.compileTemplate(this.template)(code);
                }
                catch (err) {
                    scode = err.message;
                }
            }
        }
        var el: any = this.dom.children[0];
        if (el === undefined) {
            el = document.createTextNode(scode);
            this.dom.appendChild(el);
        }
        else
            el.innerHTML = scode;
    }
    get value(): string {

        return this.state.value.current;
    }
    
    destroy() {
        super.destroy();
    }
}
export function test() {
    var ret = new HTMLPanel();


    ret.value = "<span style='font-size: 12px;' data-mce-style='font-size: 12px;'>dsf<span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>g<strong>sdfgsd</strong>fgsdfg</span></span><br><strong><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>sdfgsdgsdf</span>gfdsg</strong>";
    ret.height = 400;
    ret.width = 400;
    return ret;
}
