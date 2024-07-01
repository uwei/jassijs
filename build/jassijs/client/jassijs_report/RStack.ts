import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
import { $UIComponent } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";


//@$UIComponent({editableChildComponents:["this"]})
@$ReportComponent({ fullPath: "report/Stack", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] })
@$Class("jassijs_report.RStack")
//@$Property({name:"horizontal",hide:true})
@$Property({name:"children",type:"jassijs_report.RComponent"})
export class RStack extends RComponent {
    reporttype: string = "stack";
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        this.dom.style["flex-direction"]= "column";
        this.dom.classList.add("designerNoResizable");
    }
    /**
      * adds a component to the container before an other component
      * @param {jassijs.ui.Component} component - the component to add
      * @param {jassijs.ui.Component} before - the component before then component to add
      */
    addBefore(component, before) {
        if (component.addToParent)
            return component.addToParent(this);
        super.addBefore(component, before);
    }
    /**
  * adds a component to the container
  * @param {jassijs.ui.Component} component - the component to add
  */
    add(component) {
        if (component.addToParent)
            return component.addToParent(this);
        super.add(component);
    }
    toJSON() {
    	 var ret = super.toJSON();
        ret.stack= [];
        for (let x = 0;x < this._components.length;x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            //@ts-ignore
            ret.stack.push(this._components[x].toJSON());
        }
        var test=0;
        for(var key in ret){
            test++;
        }
        if(test===1)
            ret=ret.stack;//short version

        return ret;
    }
    fromJSON(ob: any):RStack{
        var ret= this;
        var arr=ob;
        if(ob.stack)
            arr=ob.stack;
        for (let x = 0;x < arr.length;x++) {
            ret.add(ReportDesign.fromJSON(arr[x]));
        }

        delete ob.stack;
        if(!Array.isArray(ob))
             super.fromJSON(ob);
        return ret;
    }
}



//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");


