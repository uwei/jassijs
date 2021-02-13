import { BoxPanel } from "jassi/ui/BoxPanel";
import jassi, { $Class } from "jassi/remote/Jassi";
import { $UIComponent } from "jassi/ui/Component";
import { $Property } from "jassi/ui/Property";
import { ReportDesign } from "jassi_report/ReportDesign";
import { $ReportComponent, ReportComponent } from "jassi_report/ReportComponent";
import { Panel } from "jassi/ui/Panel";


//@$UIComponent({editableChildComponents:["this"]})
@$ReportComponent({ fullPath: "report/Stack", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] })
@$Class("jassi_report.RStack")
//@$Property({name:"horizontal",hide:true})

export class RStack extends ReportComponent {
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
        $(this.dom).css("flex-direction", "column");
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
        

        return ret;
    }
    fromJSON(ob: any):RStack{
        var ret= this;
        for (let x = 0;x < ob.stack.length;x++) {
            ret.add(ReportDesign.fromJSON(ob.stack[x]));
        }
        delete ob.stack;
        super.fromJSON(ob);
        return ret;
    }
}



//    jassi.register("reportcomponent","jassi_report.Stack","report/Stack","res/boxpanel.ico");


