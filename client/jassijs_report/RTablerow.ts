import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $UIComponent, Component } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";
import { RText } from "jassijs_report/RText";
import { RDatatable } from "jassijs_report/RDatatable";
import { RTable } from "jassijs_report/RTable";


//@$UIComponent({editableChildComponents:["this"]})
@$ReportComponent({ editableChildComponents: ["this"] })
@$Class("jassijs_report.RTablerow")
//@$Property({name:"horizontal",hide:true})
export class RTablerow extends RComponent {
    reporttype: string = "tablerow";
    parent: RTable;
    //foreach is defined
    forEachDummy;
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        properties = undefined === properties ? {} : properties;
        properties.noWrapper = true;
        super.init($("<tr></tr>")[0], properties);
        $(this.dom).addClass("designerNoResizable");
    }


    oncomponentAdded(callback) {
        this.addEvent("componentAdded", callback);
    }
    get _editorselectthis() {
        return this._parent;
    }
    setChildWidth(component: Component, value: any) {
        this._parent?.setChildWidth(component, value);
    }
    getChildWidth(component: Component): any {
        return this._parent?.getChildWidth(component);
    }
    setChildHeight(component: Component, value: any) {
        this._parent?.setChildHeight(component, value);
    }
    getChildHeight(component: Component): any {
        return this._parent?.getChildHeight(component);
    }
    private wrapComponent(component: RComponent) {
        var _this = this;
        if (component.domWrapper?.tagName === "TD")
            return;//allready wrapped

        Component.replaceWrapper(component, document.createElement("td"));
        var border = component["border"];
        if (border !== undefined) {
            $(component.domWrapper).css("border-left-style", border[0] ? "solid" : "none");
            $(component.domWrapper).css("border-top-style", border[1] ? "solid" : "none");
            $(component.domWrapper).css("border-right-style", border[2] ? "solid" : "none");
            $(component.domWrapper).css("border-bottom-style", border[3] ? "solid" : "none");
        }
        if (component.colSpan)
            $(component.domWrapper).attr("colspan", component.colSpan);
        if (component.rowSpan)
            $(component.domWrapper).attr("rowspan", component.rowSpan);

        //$(component.dom).css("background-color","inherit");
        $(component.domWrapper).css("word-break", "break-all");
        $(component.domWrapper).css("display", "");
        if (component.reporttype === "text") {
            var rt = (<RText>component);
            rt.customToolbarButtons["Table"] = {
                title: "<span class='mdi mdi-grid'><span>",
                action: () => {
                    var test=rt;
                    rt._parent.parent.contextMenu.target = (<RText>component).dom.children[0];
                    rt._parent.parent.contextMenu.show();
                }
            }

        }
        $(component.dom).removeClass("designerNoResizable");
        $(component.dom).addClass("designerNoResizableY");
        

    }

    /**
    * adds a component to the container
    * @param {jassijs.ui.Component} component - the component to add
    */
    add(component) {
        if (component.addToParent)
            return component.addToParent(this);
        if (this.forEachDummy)
            return;
        this.wrapComponent(component);
        component.parent = this;
        super.add(component);
        // $(component.domWrapper).css("display", "table-cell");
        this.callEvent("componentAdded", component, this);
        if (this._parent)
            this._parent.addEmptyCellsIfNeeded(this);
        if (component.designDummyFor) {
            $(component.domWrapper).attr("colspan", "100");
            if ($(this.dom).width() < 140) {
                component.width = 140 - $(this.dom).width();
            }
        }
        if (this.parent?.updateLayout)
            this.parent?.updateLayout(true);
        /*  var test=component.height;
          if(test)
              component.height=test;*/

    }
    /**
  * adds a component to the container before an other component
  * @param {jassijs.ui.Component} component - the component to add
  * @param {jassijs.ui.Component} before - the component before then component to add
  */
    addBefore(component, before) {
        if (component.addToParent)
            return component.addToParent(this);
        if (this.forEachDummy)
            return;
        this.wrapComponent(component)
        component.parent = this;
        if (component["reporttype"] === "text") {
            //(<RText>component).newlineafter = true;
        }
        super.addBefore(component, before);
        // $(component.domWrapper).css("display", "table-cell");
        this.callEvent("componentAdded", component, this);
        //if (this._parent)
        //  this._parent.addEmptyCellsIfNeeded(this);
        if (this.parent?.updateLayout)
            this.parent?.updateLayout(true);
        /*var test=component.height;
        if(test)
            component.height=test;*/
    }
    fromJSON(columns: any[]): RTablerow {
        var ret = this;
        if (columns["foreach"]) {
            var dummy = new RText();
            dummy.value = "foreach";
            dummy.colSpan = 200;
            this.add(dummy);
            //this.domWrapper.appendChild($('<td colspan=500>foreach</td>')[0]);
            ret.forEachDummy = columns;

            return ret;
        }
        for (let x = 0; x < columns.length; x++) {
            ret.add(ReportDesign.fromJSON(columns[x]));
        }
        return ret;
    }
    toJSON() {
        var columns = [];
        if (this.forEachDummy)
            return this.forEachDummy;
        for (let x = 0; x < this._components.length; x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            //@ts-ignore
            columns.push(this._components[x].toJSON());
        }
        //Object.assign(ret, this["otherProperties"]);

        return columns;
    }
}



//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");


