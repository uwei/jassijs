import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $UIComponent, Component } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";


@$ReportComponent({ fullPath: "report/Ordered List", icon: "mdi mdi-format-list-numbered", editableChildComponents: ["this"] })
@$Class("jassijs_report.ROList")
//@$Property({name:"horizontal",hide:true})

export class ROList extends RComponent {
    reporttype: string = "ol";
    _reversed:boolean;
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        this.init($("<ol></ol>")[0]);
       
    }
    @$Property({default:false})
    set reversed(value:boolean){
        this._reversed=value;
        if(this._reversed)
            $(this.__dom).attr("reversed","");
        else
            $(this.__dom).removeAttr("reversed");
    }
    get reversed():boolean{
        return this._reversed;
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
   
    toJSON() {
    	 var ret = super.toJSON();
        ret.ol= [];
        if(this.reversed)
            ret.reversed=true;
        for (let x = 0;x < this._components.length;x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            //@ts-ignore
            ret.ol.push(this._components[x].toJSON());
        }
        return ret;
    }
    fromJSON(ob: any):ROList{
        var ret= this;
        var arr=ob.ol;
        for (let x = 0;x < arr.length;x++) {
            ret.add(ReportDesign.fromJSON(arr[x]));
        }
        delete ob.ol;
        if(ob.reversed)
            ret.reversed=ob.reversed;
        delete ob.reversed;
        return ret;
    }
}
