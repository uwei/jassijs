import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $UIComponent, Component } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";

//mdi-format-list-numbered
@$ReportComponent({ fullPath: "report/Unordered List", icon: "mdi mdi-format-list-bulleted", editableChildComponents: ["this"] })
@$Class("jassijs_report.RUList")
//@$Property({name:"horizontal",hide:true})

export class RUList extends RComponent {
    reporttype: string = "ul";
    _type:string;
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        this.init($("<ul></ul>")[0]);
       
    }
     /**
      * adds a component to the container before an other component
      * @param {jassijs.ui.Component} component - the component to add
      * @param {jassijs.ui.Component} before - the component before then component to add
      */
    addBefore(component, before) {
        if (component.addToParent)
            return component.addToParent(this);
        Component.replaceWrapper(component, document.createElement("li"));
        super.addBefore(component, before);
    }
    /**
  * adds a component to the container
  * @param {jassijs.ui.Component} component - the component to add
  */
    add(component) {
        if (component.addToParent)
            return component.addToParent(this);
        Component.replaceWrapper(component, document.createElement("li"));
        super.add(component);
    }
    @$Property({chooseFrom:["square","circle","none"]})
    set type(value:string){
        this._type=value;
        if(value===undefined)
            $(this.dom).css("list-style-type","");
        else
            $(this.dom).css("list-style-type",value);
    }
    get type():string{
        return this._type;
    } 
    toJSON() {
    	 var ret = super.toJSON();
        ret.ul= [];
        for (let x = 0;x < this._components.length;x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            //@ts-ignore
            ret.ul.push(this._components[x].toJSON());
        }
        return ret;
    }
    fromJSON(ob: any):RUList{
        var ret= this;
        var arr=ob.ul;
        for (let x = 0;x < arr.length;x++) {
            ret.add(ReportDesign.fromJSON(arr[x]));
        }
        delete ob.ul;
        return ret;
    }
}
