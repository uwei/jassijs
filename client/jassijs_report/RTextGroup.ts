import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $UIComponent, Component } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";
import { JassiError } from "jassijs/remote/Classes";


//@$UIComponent({editableChildComponents:["this"]})
@$ReportComponent({ fullPath: "report/TextGroup", icon: "mdi mdi-text-box-multiple-outline", editableChildComponents: ["this"] })
@$Class("jassijs_report.RTextGroup")
//@$Property({name:"horizontal",hide:true})

export class RTextGroup extends RComponent {
    reporttype: string = "textgroup";
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        if (!properties)
            properties = {};
        properties.useSpan = true;
        super(properties);
        // $(this.dom).css("flex-direction", "column");
        //$(this.dom).addClass("designerNoResizable");
    }
    /**
      * adds a component to the container before an other component
      * @param {jassijs.ui.Component} component - the component to add
      * @param {jassijs.ui.Component} before - the component before then component to add
      */
    addBefore(component, before) {
        if (component.addToParent)
            return component.addToParent(this);
        if (component.reporttype !== "text" && component.reporttype !== "textgroup" && !component.designDummyFor)
            throw new JassiError("only text oder textgroup could be added to TextGroup");
        super.addBefore(component, before);
      //  $(component.dom).css("display", "inline");
        $(component.domWrapper).css("display", "inline-block");
    }
    /**
  * adds a component to the container
  * @param {jassijs.ui.Component} component - the component to add
  */
    add(component) {
        if (component.addToParent)
            return component.addToParent(this);
        if (component.reporttype !== "text" && component.reporttype !== "textgroup" && !component.designDummyFor)
            throw new JassiError("only text oder textgroup could be added to TextGroup");
        super.add(component);
    //  $(component.dom).css("display", "inline-block");
        $(component.domWrapper).css("display", "inline-block");
    }
    toJSON() {
        var ret = super.toJSON();
        ret.text = [];
        for (let x = 0; x < this._components.length; x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            //@ts-ignore
            ret.text.push(this._components[x].toJSON());
        }
        return ret;
    }
    fromJSON(ob: any): RTextGroup {
        var ret = this;
        var arr = ob.text;
        for (let x = 0; x < arr.length; x++) {
            ret.add(ReportDesign.fromJSON(arr[x]));
        }

        delete ob.text;
        return ret;
    }
}



//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");


