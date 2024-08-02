import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
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
       
    }
  
    render(){
        return React.createElement("ul", { className: "RUList"});
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
         if(component._listType!==undefined)
            component.listType=component._listType;
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
         if(component.listType!==undefined)
            component.listType=component._listType;
        super.add(component);
    }
    @$Property({chooseFrom:["square","circle","none"]})
    set type(value:string){
        this._type=value;
        if(value===undefined)
            this.dom.style["list-style-type"]="";
        else
            this.dom.style["list-style-type"]=value;
    }
    get type():string{
        return this._type;
    } 
    toJSON() {
    	 var ret = super.toJSON();
        ret.ul= [];
        for (let x = 0;x < this._components.length;x++) {
          
            //@ts-ignore
            ret.ul.push(this._components[x].toJSON());
        }
        if (this.type)
            ret.type = this.type;
        return ret;
    }
    fromJSON(ob: any):RUList{
        var ret= this;
        var arr=ob.ul;
        for (let x = 0;x < arr.length;x++) {
            ret.add(ReportDesign.fromJSON(arr[x]));
        }
        delete ob.ul;
        if (ob.type)
            ret.type = ob.type;
        delete ob.type;
        super.fromJSON(ob);
        return ret;
    }
}
