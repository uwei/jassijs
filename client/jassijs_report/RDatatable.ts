import { BoxPanel } from "jassijs/ui/BoxPanel";
import  { $Class } from "jassijs/remote/Jassi";
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
import { Runlater } from "jassijs/util/Runlater";
import { RTable } from "jassijs_report/RTable";






//@$UIComponent({editableChildComponents:["this"]})
//@$Property({name:"horizontal",hide:true})
@$ReportComponent({ fullPath: "report/Datatable", icon: "mdi mdi-table-cog", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] })
@$Class("jassijs_report.RDatatable")

export class RDatatable extends RTable {
    reporttype: string = "datatable";
    headerPanel: RTablerow = new RTablerow();
    groupHeaderPanel: RTablerow[] = [];
    bodyPanel: RTablerow = new RTablerow();
    groupFooterPanel: RTablerow[] = [];
    groupExpression: string[] = [];
    footerPanel: RTablerow = new RTablerow();
    @$Property()
    dataforeach: string;
   
    /**
* 
* @param {object} properties - properties to init
* @param {string} [properties.id] -  connect to existing id (not reqired)
* @param {boolean} [properties.useSpan] -  use span not div
* 
*/
    constructor(properties:any ={isdatatable:true}) {//id connect to existing(not reqired)
        super(properties);
       // super.init($("<table style='min-width:50px;table-layout: fixed'></table>")[0]);
        var _this;
        //	this.backgroundPanel.width="500px";
        //$(this.backgroundPanel.dom).css("min-width","200px");
        //$(this.dom).css("display", "table");
        // $(this.dom).css("min-width", "50px");
        $(this.footerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tablefooter</text></svg>" + '")');
        $(this.headerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tableheader</text></svg>" + '")');
        this.removeAll();//from Table Constructor
        this.add(this.headerPanel);
        this.add(this.bodyPanel);
        this.add(this.footerPanel);
       // $(this.dom).addClass("designerNoResizable");
        this.headerPanel.parent = this;
        this.footerPanel.parent = this;
        this.bodyPanel.parent = this;
        

    }
    protected _setDesignMode(enable) {
        //do nothing - no add button
    }

  
    /*private fillTableRow(row: RTablerow, count: number) {
        if (!row._designMode || count - row._components.length !== 1)
            return;
        for (var x = row._components.length; x < count; x++) {
            var rr = new RText();
            row.addBefore(rr, row._components[row._components.length - 1]);//after addbutton
        }
    }*/
    addEmptyCellsIfNeeded(row: RTablerow) {
        var count = row._components.length;
        this.fillTableRow(this.headerPanel, count);
        this.fillTableRow(this.bodyPanel, count);
        this.fillTableRow(this.footerPanel, count);

    }
   /*
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
            var test = this.headerPanel._components[found].domWrapper;
            $((<Container>this._components[0])._components[found].domWrapper).attr("width", width);
        }
        //this._parent.setChildWidth(component,value);
    }
   
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
    */
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
        }
        super.extensionCalled(action);
    }
    @$Property()
    set groupCount(value: number) {
        if (value < 0 || value > 5) {
            throw new JassiError("groupCount must be a value between 0 and 5");
        }
        if (this.groupHeaderPanel.length === value)
            return;
        //remove unused
        while (this.groupHeaderPanel.length > value) {
            this.remove(this.groupHeaderPanel[this.groupHeaderPanel.length - 1], true);
            this.groupHeaderPanel.splice(this.groupHeaderPanel.length - 1, 1);

        }
        while (this.groupFooterPanel.length > value) {
            this.remove(this.groupFooterPanel[this.groupFooterPanel.length - 1], true);
            this.groupFooterPanel.splice(this.groupFooterPanel.length - 1, 1);
        }
        while (this.groupExpression.length > value) {
            this.groupExpression.splice(this.groupExpression.length - 1, 1);
        }
        //add new
        while (this.groupHeaderPanel.length < value) {
            let tr = new RGroupTablerow();
            tr.parent = this;
            var id = this.groupHeaderPanel.length + 1;
            $(tr.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Group" + id + "-Header</text></svg>" + '")');
            this.addBefore(tr, this.bodyPanel);
            this.groupHeaderPanel.push(tr);
        }
        while (this.groupFooterPanel.length < value) {
            let tr = new RGroupTablerow();
            tr.parent = this;
            var id = this.groupFooterPanel.length + 1;
            $(tr.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Group" + id + "-Footer</text></svg>" + '")');
            var prev = this.footerPanel;
            if (this.groupFooterPanel.length > 0)
                prev = this.groupFooterPanel[this.groupFooterPanel.length - 1];
            this.addBefore(tr, prev);
            this.groupFooterPanel.push(tr);
        }
        while (this.groupExpression.length < value) {
            this.groupExpression.push("");
        }
        this._componentDesigner?.editDialog(this._componentDesigner.editMode);
    }
    get groupCount(): number {
        return this.groupHeaderPanel.length;
    }
    fromJSON(obj: any, target: ReportDesign = undefined): any {
        var ob = obj.datatable;
        var ret = this;
        // this.removeAll();
        //ret.headerPanel.removeAll();
        //ret.bodyPanel.removeAll();
        //ret.footerPanel.removeAll();
        /* this.add(this.backgroundPanel);
         this.add(this.headerPanel);
         this.add(this.content);
         this.add(this.footerPanel);*/
        if (ob.header) {
            let obb = new RTablerow().fromJSON(ob.header);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));

            all.forEach((obp) => { ret.headerPanel.add(obp) });
            delete ob.header;
            obb.destroy();
        }
        if (ob.groups) {
            this.groupCount = ob.groups.length;//create Panels

            for (var x = 0; x < ob.groups.length; x++) {
                this.groupExpression[x] = ob.groups[x].expression;
                if (ob.groups[x].header) {
                    let obb = <RGroupTablerow>new RGroupTablerow().fromJSON(ob.groups[x].header);
                    obb.parent = ret;
                    let all = [];
                    obb._components.forEach((obp) => all.push(obp));
                    all.forEach((obp) => { ret.groupHeaderPanel[x].add(obp) });
                    obb.destroy();
                }
                if (ob.groups[x].footer) {
                    let obb = <RGroupTablerow>new RGroupTablerow().fromJSON(ob.groups[x].footer);
                    obb.parent = ret;
                    let all = [];
                    obb._components.forEach((obp) => all.push(obp));
                    all.forEach((obp) => { ret.groupFooterPanel[x].add(obp) });
                    obb.destroy();
                }
            }
        }
        delete ob.groups;
        if (ob.body) {
            let obb = new RTablerow().fromJSON(ob.body);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { ret.bodyPanel.add(obp) });
            delete ob.body;
            obb.destroy();
        }
        if (ob.footer) {
            let obb = new RTablerow().fromJSON(ob.footer);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { ret.footerPanel.add(obp) });
            delete ob.footer;
            obb.destroy();
        }
         if (ob?.widths) {
            ret.widths = ob.widths;
            delete ob.widths;
        }
        if (ob?.heights) {
            ret.heights = ob.heights;
            delete ob.heights;
        }
       /* if (ob.widths) {
            ret.widths = ob.widths;
            delete ob.widths;

        }
        var tr = (<RTablerow>this._components[0]);
        for (var x = 0; x < tr._components.length; x++) {

            $(tr._components[x].domWrapper).attr("width", this.widths[x]);
        }
        */
        ret.dataforeach = ob.dataforeach;
        delete ob.dataforeach;
        delete obj.datatable;
        super.fromJSON(obj,ob);
       
        return ret;
    }

    toJSON(): any {
       
        var ret: any = super.toJSON(true);
        ret.datatable = ret.table;
        delete ret.table;
        var r=ret.datatable;
        //TODO hack
        r.groups = ret.groups;
        delete ret.groups;
        //var _this = this;
        /*if (this.widths && this.widths.length > 0) {
            r.widths = this.widths;
            var len = this.headerPanel._components.length;
            if (this.headerPanel._designMode)
                len--;
            for (var t = r.widths.length; t < len; t++) {
                r.widths.push("auto");
            }
            //remove width
            while (r.widths.length > len) {
                r.widths.pop();
            }
        }*/
        if (this.groupHeaderPanel.length > 0) {
            r.groups = [];
            for (var x = 0; x < this.groupHeaderPanel.length; x++) {
                var gheader = undefined;
                var gfooter = undefined;
                if (!(this.groupHeaderPanel[x]._components.length === 0 || (this.groupHeaderPanel[x]._designMode && this.groupHeaderPanel[x]._components.length === 1))) {
                    gheader = this.groupHeaderPanel[x].toJSON();
                }
                if (!(this.groupFooterPanel[x]._components.length === 0 || (this.groupFooterPanel[x]._designMode && this.groupFooterPanel[x]._components.length === 1))) {
                    gfooter = this.groupFooterPanel[x].toJSON();
                }
                r.groups.push({
                    header: gheader,
                    expression: this.groupExpression[x],
                    footer: gfooter
                });
            }
        }
        if (!(this.headerPanel._components.length === 0 || (this.headerPanel._designMode && this.headerPanel._components.length === 1))) {
            r.header = this.headerPanel.toJSON();
        }
        if (!(this.footerPanel._components.length === 0 || (this.footerPanel._designMode && this.footerPanel._components.length === 1))) {
            r.footer = this.footerPanel.toJSON();
        }
        r.dataforeach = this.dataforeach;
        r.body = this.bodyPanel.toJSON();

        return ret;
    }

}



export async function test() {




}



