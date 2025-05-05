import registry, { $Class } from "jassijs/remote/Registry";
import { Button } from "jassijs/ui/Button";
import { $Property } from "jassijs/ui/Property";
import { Component, HTMLComponent, TextComponent } from "jassijs/ui/Component";

jassijs.includeCSSFile("jassijs.css");
jassijs.includeCSSFile("materialdesignicons.min.css");
//@$UIComponent is used so this file is loaded with ComponentPalette


//vergleichen
//jeder bekommt componentid
//gehe durch baum wenn dom_component fehlt, dann ist kopiert und muss mit id von componentid gerenderd werden

export class UIComponentProperties {

    /**
     * full path to classifiy the UIComponent e.g common/TopComponent 
     */
    fullPath?: string;
    icon?: string;
    /**
     * initproperties are automatically set on new created Components
     * e.g. {text:"button"}
     */
    initialize?: { [initproperties: string]: any };
    /**
     * allcomponents 
     */
    editableChildComponents?: string[];

}
export function $UIComponent(properties: UIComponentProperties): Function {
    return function (pclass) {
        registry.register("$UIComponent", pclass, properties);
    }
}


@$UIComponent({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } })
@$Property({ name: "text", type: "string" })
@$Property({ name: "onclick", type: "function", default: "function(event){\n\t\n}" })
@$Property({ name: "icon", type: "image" })
@$Class("jassijs.ui.Button", Button)
class DummyButton { }

@$Property({ name: "useWrapper", type: "boolean", description: "wraps the component with div" })
@$Property({ name: "onfocus", type: "function", default: "function(event){\n\t\n}" })
@$Property({ name: "onblur", type: "function", default: "function(event){\n\t\n}" })
@$Property({ name: "label", type: "string", description: "adds a label above the component" })
@$Property({ name: "tooltip", type: "string", description: "tooltip are displayed on mouse over" })
@$Property({ name: "x", type: "number" })
@$Property({ name: "y", type: "number" })
@$Property({ name: "hidden", type: "boolean" })
@$Property({ name: "width", type: "number" })
@$Property({ name: "height", type: "number" })
@$Property({ name: "style", type: "json", componentType: "jassijs.ui.CSSProperties" })
@$Property({ name: "styles", type: "componentselector", componentType: "[jassijs.ui.Style]" })
@$Property({ name:"contextMenu",type: "componentselector", componentType: "jassijs.ui.ContextMenu" })
    
@$Class("jassijs.ui.Component", Component)
class DummyComponent { }

@$Property({ name: "children", type: "jassijs.ui.Component", createDummyInDesigner: doCreateDummyForHTMLComponent })
@$UIComponent({ fullPath: "common/HTMLComponent", icon: "mdi mdi-cloud-tags" , initialize:{tag:"input"},} )
@$Class("jassijs.ui.HTMLComponent",HTMLComponent)
class DummyHTMLComponent { }

function doCreateDummyForHTMLComponent(component: any, isPreDummy: boolean) {
    var disabledBoth = ["tr", "td", "th"];
    var enabledPost = ["div","ol","ul"];
    var disabledPre = [];
    var tag = component?.tag;
    if (tag === undefined)
        return false;
    if (disabledBoth.indexOf(tag.toLowerCase()) !== -1) {
        return false;
    } else if (isPreDummy && disabledPre.indexOf(tag.toLowerCase()) !== -1) {
        return false;
    } else if (!isPreDummy && enabledPost.indexOf(tag.toLowerCase()) !== -1) {
        return true;
    }
    return isPreDummy;//prodummy is enabled at default / postdummy is disabled 
}
@$Property({
    name:"tag",
    type:"string",
    chooseFromStrict: true,
    chooseFrom: (comp) => {
        const allElements = <any>document.body.getElementsByTagName('*');
        const uniqueTags = new Set();

        for (let element of allElements) {
            uniqueTags.add(element.tagName.toLowerCase());
        }
        return Array.from(uniqueTags).sort();
    }
})
@$Property({ name: "text", type: "string" })
@$Class("jassijs.ui.TextComponent",TextComponent)
class DummyTextComponent{};
