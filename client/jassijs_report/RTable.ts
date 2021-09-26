import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { RStack } from "jassijs_report/RStack";
import { RText } from "jassijs_report/RText";

import registry from "jassijs/remote/Registry";
import { ReportDesigner } from "jassijs_report/designer/ReportDesigner";
import { RColumns } from "jassijs_report/RColumns";
import { RUnknown } from "jassijs_report/RUnknown";
import { Panel } from "jassijs/ui/Panel";
import { Tools } from "jassijs/util/Tools";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { RTablerow } from "jassijs_report/RTablerow";
import { Component } from "jassijs/ui/Component";
import { Container } from "jassijs/ui/Container";
import { $Property } from "jassijs/ui/Property";
import { JassiError } from "jassijs/remote/Classes";
import { ComponentDesigner } from "jassijs_editor/ComponentDesigner";
import { RGroupTablerow } from "jassijs_report/RGroupTablerow";






//@$UIComponent({editableChildComponents:["this"]})
//@$Property({name:"horizontal",hide:true})
@$ReportComponent({ fullPath: "report/Table", icon: "mdi mdi-table-large", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] })
@$Class("jassijs_report.RTable")

export class RTable extends RComponent {
    _componentDesigner: ComponentDesigner;
    reporttype: string = "table";
    design: any;
   // bodyPanel: RTablerow[] = [new RTablerow()];

    widths: any[] = [];
    /**
* 
* @param {object} properties - properties to init
* @param {string} [properties.id] -  connect to existing id (not reqired)
* @param {boolean} [properties.useSpan] -  use span not div
* 
*/
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        super.init($("<table style='nin-width:50px;table-layout: fixed'></table>")[0]);
        //	this.backgroundPanel.width="500px";
        //$(this.backgroundPanel.dom).css("min-width","200px");
        //$(this.dom).css("display", "table");
        // $(this.dom).css("min-width", "50px");
        this.add(new RTablerow());
        $(this.dom).addClass("designerNoResizable");

    }
    protected _setDesignMode(enable) {
        //do nothing - no add button
    }


    /*	get design():any{
            return this.toJSON();
        };
        set design(value:any){
            ReportDesign.fromJSON(value,this);
        }*/

    private fillTableRow(row: RTablerow, count: number) {
        if (!row._designMode || count - row._components.length !== 1)
            return;
        for (var x = row._components.length; x < count; x++) {
            var rr = new RText();
            row.addBefore(rr, row._components[row._components.length - 1]);//after addbutton
        }
    }
    addEmptyCellsIfNeeded(row: RTablerow) {
        var count = row._components.length;
        var _this = this;
        this._components.forEach((tr:RTablerow) => {
            _this.fillTableRow(tr, count);
        })

    }
    /**
    * sets the width of a table cell
    * @param component - the table cell
    * @param width - the new width
    **/
    setChildWidth(component: Component, width: any) {
        var max = 0;
        var found = -1;
        for (var x = 0; x < this._components.length; x++) {
            for (var i = 0; i < (<Container>this._components[x])._components.length; i++) {
                if (i > max)
                    max = i;
                var row = (<Container>this._components[x])._components[i];
                if (row === component)
                    found = i;
            }
        }
        for (var t = this.widths.length; t < max; t++) {
            this.widths.push("auto");
        }
        if (found !== -1) {
            this.widths[found] = width;
            $((<Container>this._components[0])._components[found].domWrapper).attr("width", width);
        }
        //this._parent.setChildWidth(component,value);
    }
    /**
     * gets the width of a table cell
     * @param component - the table cell
     **/
    getChildWidth(component: Component): any {
        var found = -1;
        for (var x = 0; x < this._components.length; x++) {
            if ((<Container>this._components[x])._components) {
                for (var i = 0; i < (<Container>this._components[x])._components.length; i++) {
                    var row = (<Container>this._components[x])._components[i];
                    if (row === component)
                        found = i;
                }
            }
        }

        if (found !== -1)
            return this.widths[found];
        //this._parent.setChildWidth(component,value);
    }
    private create(ob: any) {

    }
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
        }
        super.extensionCalled(action);
    }
    fromJSON(obj: any): any {
        var ob = obj.table;
        var ret = this;
        ret.removeAll();
        if (ob.body) {
            for (var x = 0; x < ob.body.length; x++) {
                let obb = new RTablerow().fromJSON(ob.body[x]);
                ret.add(obb);
             /*   let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { obb.add(obp) });
                obb.destroy();*/
            }
            delete ob.body;

        }
        if (ob.widths) {
            ret.widths = ob.widths;
            delete ob.widths;

        }
        var tr = (<RTablerow>this._components[0]);
        for (var x = 0; x < tr._components.length; x++) {

            $(tr._components[x].domWrapper).attr("width", this.widths[x]);
        }

        super.fromJSON(ob);
        for (var x = 0; x < ret._components.length; x++) {
            (<RTablerow>ret._components[x]).correctHideAfterSpan();

        }
        return ret;
    }

    toJSON(): any {
        var r: any = {

        };
        var ret: any = super.toJSON();
        ret.table=r;
        if (this.widths && this.widths.length > 0) {
            r.widths = this.widths;
            var len = this._components.length;
            if (this._designMode)
                len--;
            for (var t = r.widths.length; t < len; t++) {
                r.widths.push("auto");
            }
            //remove width
            while (r.widths.length > len) {
                r.widths.pop();
            }
        }
        r.body =[];
        for(var x=0;x<this._components.length;x++){
            r.body.push((<RTablerow> this._components[x]).toJSON());
        } 

        return ret;
    }

}



export async function test() {




}



