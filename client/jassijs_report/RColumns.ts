import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";
import { RText } from "jassijs_report/RText";

//Limitations: columnGap not implemented defaultStyle: {columnGap: 20}

@$ReportComponent({ fullPath: "report/Columns", icon: "mdi mdi-view-parallel-outline", editableChildComponents: ["this"] })
@$Class("jassijs_report.RColumns")

//@$Property({ hideBaseClassProperties: true })
export class RColumns extends RComponent {
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
        this.domWrapper.classList.add('BoxPanel');
        this.domWrapper.classList.remove('Panel');
        this.dom.classList.add("designerNoResizable");
        this.dom.style.display="table";
        this.dom.style["min-width"]= "50px";
        // this.width="300px"
    }

    /**
   * adds a component to the container before an other component
   * @param {jassijs.ui.Component} component - the component to add
   * @param {jassijs.ui.Component} before - the component before then component to add
   */
    addBefore(component, before) {
        if (component.addToParent)
            return component.addToParent(this);
        if (component["reporttype"] === "text") {
            //(<RText>component).newlineafter=true;
        }
        super.addBefore(component, before);
        component.domWrapper.style.display= "table-cell";
        component.dom.classList.remove("designerNoResizable");
        component.dom.classList.add("designerNoResizableY");
    }
    /**
  * adds a component to the container
  * @param {jassijs.ui.Component} component - the component to add
  */
    add(component) {
        if (component.addToParent)
            return component.addToParent(this);
        super.add(component);
        component.domWrapper.style.display= "table-cell";
        component.dom.classList.remove("designerNoResizable");
        component.dom.classList.add("designerNoResizableY");

    }
    toJSON() {
        var ret = super.toJSON();
        ret.columns = [];
        for (let x = 0; x < this._components.length; x++) {
            //@ts-ignore
            ret.columns.push(this._components[x].toJSON());
        }
        return ret;
    }

    fromJSON(ob: any): any {
        var ret = this;
        for (let x = 0; x < ob.columns.length; x++) {
            ret.add(ReportDesign.fromJSON(ob.columns[x]));
        }
        delete ob.columns;
        super.fromJSON(ob);
        return ret;
    }
}



//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");


