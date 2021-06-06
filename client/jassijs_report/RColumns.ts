import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $UIComponent } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, ReportComponent } from "jassijs_report/ReportComponent";
import { Panel } from "jassijs/ui/Panel";
import { RText } from "jassijs_report/RText";


//@$UIComponent({editableChildComponents:["this"]})
@$ReportComponent({ fullPath: "report/Columns", icon: "mdi mdi-view-parallel-outline", editableChildComponents: ["this"] })
@$Class("jassijs_report.RColumns")

@$Property({ hideBaseClassProperties: true })
export class RColumns extends ReportComponent {
    reporttype: string = "columns";
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        $(this.domWrapper).addClass('BoxPanel').removeClass('Panel');
        $(this.dom).css("display", "table");
        $(this.dom).css("min-width", "50px");
        // this.width="300px"
    }
   
    /**
   * adds a component to the container before an other component
   * @param {jassijs.ui.Component} component - the component to add
   * @param {jassijs.ui.Component} before - the component before then component to add
   */
    addBefore(component, before) {
        if (component["reporttype"] === "text") {
            //(<RText>component).newlineafter=true;
        }
        super.addBefore(component, before);
        $(component.domWrapper).css("display", "table-cell");

    }
    /**
  * adds a component to the container
  * @param {jassijs.ui.Component} component - the component to add
  */
    add(component) {

        super.add(component);
        $(component.domWrapper).css("display", "table-cell");

    }
    toJSON() {
        var ret = super.toJSON();
        ret.columns = [];
        for (let x = 0;x < this._components.length;x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            //@ts-ignore
            ret.columns.push(this._components[x].toJSON());
        }
        return ret;
    }

    fromJSON(ob: any): any {
        var ret = this;
        for (let x = 0;x < ob.columns.length;x++) {
            ret.add(ReportDesign.fromJSON(ob.columns[x]));
        }
        delete ob.columns;
        super.fromJSON(ob);
        return ret;
    }
}



//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");


