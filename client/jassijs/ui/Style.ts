import { InvisibleComponent } from "jassijs/ui/InvisibleComponent";
import { $UIComponent } from "jassijs/ui/Component";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Property, $Property } from "jassijs/ui/Property";

import { CSSProperties } from "jassijs/ui/CSSProperties";


@$UIComponent({ fullPath: "common/Style", icon: "mdi mdi-virus" })
@$Class("jassijs.ui.Style")
/**
 * on ore mors Style can be assigned to component
 * the style is appended to the head
 **/
export class Style extends InvisibleComponent {
    constructor() {//id connect to existing(not reqired)
        super();
        super.init($('<span class="InvisibleComponent"></span>')[0]);

    }
    get styleid() {
        return "jassistyle" + this._id;
    }
    /**
    * sets CSS Properties
    */
    @$Property({ type: "json", componentType: "jassijs.ui.CSSProperties"})
    css(properties: CSSProperties, removeOldProperties: boolean = true) {
        //never!super.css(properties,removeOldProperties);

        var style: HTMLElement = document.getElementById(this.styleid);
        if (!document.getElementById(this.styleid)) {
            style = $('<style id=' + this.styleid + '></style>')[0];
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
    var css: CSSProperties = {
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
    st.css({
        color: "red"
    })
    st.destroy();
}