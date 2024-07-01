import { InvisibleComponent } from "jassijs/ui/InvisibleComponent";
import { $UIComponent, Component, ComponentProperties } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { Property, $Property } from "jassijs/ui/Property";

import { CSSProperties } from "jassijs/ui/CSSProperties";

export interface StyleConfig extends ComponentProperties {
  /**
    * sets CSS Properties
    */
   style?:React.CSSProperties;
}

@$UIComponent({ fullPath: "common/Style", icon: "mdi mdi-virus" })
@$Class("jassijs.ui.Style")
/**
 * on ore mors Style can be assigned to component
 * the style is appended to the head
 **/
export class Style extends InvisibleComponent<StyleConfig> implements StyleConfig{
    
    constructor(props:StyleConfig={}) {//id connect to existing(not reqired)
        super(props);
       
    }
    render() {
        
        return React.createElement("span", {  className: "InvisibleComponent"       });
    }
    componentDidMount(): void {
       
    }
    config(config: StyleConfig): Style {
        super.config(config);
        return this;
    }
    get styleid() {
        return "jassistyle" + this._id;
    }
    /**
    * sets CSS Properties
    */
    @$Property({ type: "json", componentType: "jassijs.ui.CSSProperties"})
    set style(properties: React.CSSProperties) {
        //never!super.css(properties,removeOldProperties);

        var style: HTMLElement = document.getElementById(this.styleid);
        if (!document.getElementById(this.styleid)) {
            style =Component.createHTMLElement('<style id=' + this.styleid + '></style>');
            document.head.appendChild(style);
        }
        var prop = {};
        var sstyle = "\t." + this.styleid + "{\n";
        for (let key in properties) {
            var newKey = key.replaceAll("_", "-");
            prop[newKey] = (<string>properties[key]);
            sstyle = sstyle + "\t\t" + newKey + ":" + (<string>properties[key]) + ";\n";
        }
        sstyle = sstyle + "\t}\n";
        style.innerHTML = sstyle;
    }
    destroy() {
        super.destroy();
        if (document.getElementById(this.styleid)) {
            document.head.removeChild(document.getElementById(this.styleid));
        }
    }
}

export function test() {
    var css: React.CSSProperties = {
        filter: "drop-shadow(16px 16px 20px blue)"
    };
    jassijs.includeCSS("mytest2id", {
        ".Panel": css,
        ".jinlinecomponent":{
        	color:"red"
        }
    });
    setTimeout(()=>{
    	jassijs.includeCSS("mytest2id",undefined);//remove
    },400);
   // includeCSS("mytest2id",undefined);
}
export function test2() {
    var st = new Style();
    st.style={
        color: "red"
    };
    st.destroy();
}