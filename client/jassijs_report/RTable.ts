import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
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
import { ContextMenu } from "jassijs/ui/ContextMenu";
import { MenuItem } from "jassijs/ui/MenuItem";
import { Button } from "jassijs/ui/Button";
import { Runlater } from "jassijs/util/Runlater";
import { tableLayouts } from "jassijs_report/RTableLayouts";



var allLayouts = Object.keys(tableLayouts);



//@$UIComponent({editableChildComponents:["this"]})
//@$Property({name:"horizontal",hide:true})
@$ReportComponent({ fullPath: "report/Table", icon: "mdi mdi-table-large", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] })
@$Class("jassijs_report.RTable")

export class RTable extends RComponent {
    _componentDesigner: ComponentDesigner;
    reporttype: string = "table";
    design: any;
    // bodyPanel: RTablerow[] = [new RTablerow()];
    private insertEmptyCells = true;
    widths: any[] = [];
    heights: any = [];
    layout: any;
    updater: Runlater;
    @$Property()
    headerRows: number;
    /**
* 
* @param {object} properties - properties to init
* @param {string} [properties.id] -  connect to existing id (not reqired)
* @param {boolean} [properties.useSpan] -  use span not div
* 
*/
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        super.init("<table  style='border-spacing:0px;min-width:50px;table-layout: fixed'></table>");
        this.updater = new Runlater(() => {
            _this.updateLayout(false);
        }, 100);
        let tr = new RTablerow();
        tr.parent = this;
        this.add(tr);
        this.dom.classList.add("designerNoResizable");
        this.initContextMenu(properties?.isdatatable);
        var _this = this;
        this.initKeys();

    }
    private initKeys() {
        var _this = this;
        this.on("keydown", (evt:any) => {
            if (evt.key === "Tab") {//Tabelle erweitern?
                if (evt.target?._this?.reporttype === "text"&&this.reporttype==="table") {
                    var rt: RText = evt.target?._this;
                    if (rt._parent._components.indexOf(rt) === rt._parent._components.length - 2) {//last row
                        if (rt._parent.parent._components.indexOf(rt._parent) + 1 === rt._parent.parent._components.length) {//lastline
                            var row = new RTablerow();
                            row.parent = this;
                            _this.add(row);
                            var cell = new RText();
                            row.add(cell);
                            _this._componentDesigner.editDialog(true);
                            _this.addEmptyCellsIfNeeded(<RTablerow>_this._components[0]);
                            _this._componentDesigner.editDialog(true);
                            evt.preventDefault();

                            setTimeout(() => {
                                (<HTMLElement>cell.dom).focus();
                            }, 100);
                        }
                    }
                }
            }
        })
    }
    private getInfoFromEvent(evt): { column: number, row: number, cell: RComponent, tableRow: RTablerow } {
        var ret: any = {};
        ret.cell = <any>this.contextMenu.target.parentNode._this;
        ret.tableRow = ret.cell.parent;
        ret.column = ret.tableRow._components.indexOf(ret.cell);
        ret.row = this._components.indexOf(ret.tableRow);
        return ret;
    }
    async initContextMenu(isDatatable) {//should not block creation
        var _this = this;
        this.contextMenu = new ContextMenu();
        this.contextMenu._isNotEditableInDesigner = true;
        this.contextMenu.menu.dom.style["font-family"]= "Roboto";
        this.contextMenu.menu.dom.style["font-size"]= "12px";
        this.contextMenu.menu._setDesignMode = (nothing) => { };//should net be editable in designer
        if (isDatatable !== true) {
            var insertRowBefore = new MenuItem();
            //@ts-ignore
            insertRowBefore._setDesignMode = (nothing) => { };//should net be editable in designer
            //@ts-ignore
            insertRowBefore.items._setDesignMode = (nothing) => { };
            insertRowBefore.text = "insert row before";
            insertRowBefore.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newRow = new RTablerow();
                if (_this.heights && Array.isArray(_this.heights))
                    _this.heights.splice(info.row, 0, "auto");
                newRow.parent = _this;
                _this.addBefore(newRow, _this._components[info.row]);
                newRow.add(new RText());
                //@ts-ignore
                newRow._setDesignMode(true);
                _this.fillTableRow(newRow, info.tableRow._components.length);
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            (<ContextMenu>this.contextMenu).menu.add(insertRowBefore);
            var insertRowAfter = new MenuItem();
            //@ts-ignore
            insertRowAfter._setDesignMode = (nothing) => { };//should net be editable in designer
            //@ts-ignore
            insertRowAfter.items._setDesignMode = (nothing) => { };
            insertRowAfter.text = "insert row after";
            insertRowAfter.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newRow = new RTablerow();
                if (_this.heights && Array.isArray(_this.heights))
                    _this.heights.splice(info.row + 1, 0, "auto");
                newRow.parent = _this;
                if (_this._components.length === info.row + 1)
                    _this.add(newRow);
                else
                    _this.addBefore(newRow, _this._components[info.row + 1]);
                newRow.add(new RText());
                //@ts-ignore
                newRow._setDesignMode(true);
                _this.fillTableRow(newRow, info.tableRow._components.length);
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            (<ContextMenu>this.contextMenu).menu.add(insertRowAfter);
        }
        var insertColumnBefore = new MenuItem();
        //@ts-ignore
        insertColumnBefore._setDesignMode = (nothing) => { };//should net be editable in designer
        //@ts-ignore
        insertColumnBefore.items._setDesignMode = (nothing) => { };
        insertColumnBefore.text = "insert column before";
        insertColumnBefore.onclick((evt) => {
            var info = _this.getInfoFromEvent(evt);
            var newCell = new RText();
            if (_this.widths&&_this.widths.length>0)
                _this.widths.splice(info.column, 0, "auto");
            _this.insertEmptyCells = false;
            for (var x = 0; x < _this._components.length; x++) {
                if((<RTablerow>_this._components[x])._components.length>1)
                    (<RTablerow>_this._components[x]).addBefore(new RText(), (<RTablerow>_this._components[x])._components[info.column]);
            }
            _this.insertEmptyCells = true;
            _this._componentDesigner.editDialog(true);
            _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
        });
        (<ContextMenu>this.contextMenu).menu.add(insertColumnBefore);

        var insertColumnAfter = new MenuItem();
        //@ts-ignore
        insertColumnAfter._setDesignMode = (nothing) => { };//should net be editable in designer
        //@ts-ignore
        insertColumnAfter.items._setDesignMode = (nothing) => { };
        insertColumnAfter.text = "insert column after";
        insertColumnAfter.onclick((evt) => {
            var info = _this.getInfoFromEvent(evt);
            var newCell = new RText();
           if (_this.widths&&_this.widths.length>0)
                _this.widths.splice(info.column + 1, 0, "auto");
            _this.insertEmptyCells = false;
            for (var x = 0; x < _this._components.length; x++) {
                 if((<RTablerow>_this._components[x])._components.length>1)
                    (<RTablerow>_this._components[x]).addBefore(new RText(), (<RTablerow>_this._components[x])._components[info.column + 1]);
            }
            _this.insertEmptyCells = true;
            _this._componentDesigner.editDialog(true);
            _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
        });
        (<ContextMenu>this.contextMenu).menu.add(insertColumnAfter);

        var removeColumn = new MenuItem();
        //@ts-ignore
        removeColumn._setDesignMode = (nothing) => { };//should net be editable in designer
        //@ts-ignore
        removeColumn.items._setDesignMode = (nothing) => { };
        removeColumn.text = "delete column";
        removeColumn.onclick((evt) => {
            var info = _this.getInfoFromEvent(evt);
            if (_this.widths&&_this.widths.length>0)
                _this.widths.slice(info.column, 0);

            for (var x = 0; x < _this._components.length; x++) {
                var tr = (<RTablerow>_this._components[x]);
                //@ts-ignore
                if (tr._components[info.column]?.designDummyFor === undefined){
                    if(tr._components.length>1)
                        tr.remove(tr._components[info.column], true);
                }
            }
            _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});

        });
        (<ContextMenu>this.contextMenu).menu.add(removeColumn);

        if (isDatatable !== true) {
            var removeRow = new MenuItem();
            //@ts-ignore
            removeRow._setDesignMode = (nothing) => { };//should net be editable in designer
            //@ts-ignore
            removeRow.items._setDesignMode = (nothing) => { };
            removeRow.text = "delete row";
            removeRow.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                if (_this.heights && Array.isArray(_this.heights))
                    _this.heights.slice(info.row, 0);
                _this.remove(_this._components[info.row]);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});

            });
            (<ContextMenu>this.contextMenu).menu.add(removeRow);
        }
        var copyMenu = new Button();
        copyMenu.dom.style["font-family"]= "Roboto";
        copyMenu.dom.style["font-size"]= "12px";
        copyMenu.text = "copy";
        copyMenu.width = "100%";
        copyMenu.dom.classList.remove("jinlinecomponent");
        let func = function (evt) {
            var info = _this.getInfoFromEvent(evt);
            //@ts-ignore
            var edi = tinymce.editors[info.cell._id];
            navigator.clipboard.writeText(edi.selection.getContent());
            (<ContextMenu>_this.contextMenu).close();
        }
        copyMenu.onclick(func);
        (<ContextMenu>this.contextMenu).menu.add(copyMenu);

        var pasteMenu = new Button();
        pasteMenu.dom.style["font-family"]= "Roboto";
        pasteMenu.dom.style["font-size"]= "12px";
        pasteMenu.text = "paste";
        pasteMenu.width = "100%";
        pasteMenu.dom.classList.remove("jinlinecomponent");
        let func2 = function (evt) {
            var info = _this.getInfoFromEvent(evt);
            //@ts-ignore
            var edi = tinymce.editors[info.cell._id];
            navigator.clipboard.readText().then((data) => {
                edi.selection.setContent(data);
            })

        }
        pasteMenu.onclick(func2);
        (<ContextMenu>this.contextMenu).menu.add(pasteMenu);

    }
    add(component) {
        super.add(component);
        this.updateLayout(true);
    }
    updateLayout(doitlater = false) {
        if (doitlater) {
            this.updater.runlater();
            return;
        }
        this.doTableLayout();
    }
    correctHideAfterSpan() {
        //rowspan
        var span: number;
        var hiddenCells: any = {};
        for (var r = 0; r < this._components.length; r++) {
            var row = <RTablerow>this._components[r];
            for (var c = 0; c < row._components.length; c++) {
                var cell = row._components[c];
                if (cell["colSpan"]) {
                    span = Number.parseInt(cell["colSpan"]);
                    for (var x = c + 1; x < c + span; x++) {
                        hiddenCells[r + ":" + x] = true;
                    }
                }
                if (cell["rowSpan"]) {
                    span = Number.parseInt(cell["rowSpan"]);
                    for (var x = r + 1; x < r + span; x++) {
                        hiddenCells[x + ":" + c] = true;
                    }
                }
                if (hiddenCells[r + ":" + c] === true) {
                    cell.domWrapper.classList.add("invisibleAfterSpan");
                } else {
                    cell.domWrapper.classList.remove("invisibleAfterSpan");
                }
            }
        }
    }
    doTableLayout() {
        this.correctHideAfterSpan();

        var tab = this.toJSON();
        if(tab.table===undefined)
            tab.table=tab.datatable;
        if (tab.table.widths === undefined)
            tab.table.widths = [];
        while ((<RTablerow>this._components[0])._components.length > tab.table.widths.length) {
            tab.table.widths.push("auto");//designer dummy
        }
        if (tab.table.heights === undefined)
            tab.table.heights = [];
        while (this._components.length - 1 > tab.table.widths.length) {
            tab.table.widths.push("auto");//designer dummy
        }


        for (var r = 0; r < this._components.length; r++) {
            var row = <RTablerow>this._components[r];
            for (var c = 0; c < row._components.length; c++) {
                var cssid = ["RColumn"];
                var css: any = {};
                var cell = <RText>row._components[c];
                if (this.heights) {
                    var val;
                    if (Number.isInteger(this.heights)) {
                        val = this.heights;
                    } else if (typeof (this.heights) === "function") {
                        //@ts-ignore
                        val = this.heights(r);
                    } else
                        val = this.heights[r];
                    row._components[c].dom.style.height= Number.isInteger(val) ? val + "px" : val;
                }


                var v: any = null;
                if (this.layout?.fillColor) {
                    v = this.layout?.fillColor(r, tab, c);
                }
                if (v === null)
                    v = "initial";
                css.ContainerProperties = v;
                cssid.push(v.replace("#", ""));

                v = 1;
                if (this.layout?.hLineWidth) {
                    v = this.layout?.hLineWidth(r, tab, c);
                }
                css.border_top_width = v + "px";
                cssid.push(v);

                v = 1;
                if (this.layout?.hLineWidth) {
                    v = this.layout?.hLineWidth(r + 1, tab, c);
                }
                css.border_bottom_width = v + "px";
                cssid.push(v);

                v = 1;
                if (this.layout?.vLineWidth) {
                    v = this.layout?.vLineWidth(c, tab, r);
                }
                css.border_left_width = v + "px";
                cssid.push(v);

                v = 1;
                if (this.layout?.vLineWidth) {
                    v = this.layout?.vLineWidth(c + 1, tab, r);
                }
                css.border_right_width = v + "px";
                cssid.push(v);

                v = "black";
                css.border_top_style = (this.layout === "noBorders" || this.layout?.defaultBorder === false) ? "none" : "solid";
                css.border_bottom_style = (this.layout === "noBorders" || this.layout?.defaultBorder === false) ? "none" : "solid";
                css.border_left_style = (this.layout === "noBorders" || this.layout?.defaultBorder === false) ? "none" : "solid";
                css.border_right_style = (this.layout === "noBorders" || this.layout?.defaultBorder === false) ? "none" : "solid";
                cssid.push(css.border_top_style);
                cssid.push(css.border_bottom_style);
                cssid.push(css.border_left_style);
                cssid.push(css.border_right_style);
                if (this.layout?.hLineColor) {
                    v = this.layout?.hLineColor(r, tab, c);
                }
                css.border_top_color = v;
                cssid.push(v.replace("#", ""));

                v = "black";
                if (this.layout?.hLineColor) {
                    v = this.layout?.hLineColor(r + 1, tab, c);
                }
                css.border_bottom_color = v;
                cssid.push(v.replace("#", ""));

                v = "black";
                if (this.layout?.vLineColor) {
                    v = this.layout?.vLineColor(c, tab, r);
                }
                css.border_left_color = v;
                cssid.push(v.replace("#", ""));

                v = "black";
                if (this.layout?.vLineColor) {
                    v = this.layout?.vLineColor(c + 1, tab, r);
                }
                css.border_right_color = v;
                cssid.push(v.replace("#", ""));

                v = 1;
                if (this.layout?.paddingLeft) {
                    v = this.layout?.paddingLeft(c + 1, tab, r);
                }
                css.padding_left = v + "px";
                cssid.push(v);

                v = 1;
                if (this.layout?.paddingRight) {
                    v = this.layout?.paddingRight(c + 1, tab, r);
                }
                css.padding_right = v + "px";
                cssid.push(v);

                v = 1;
                if (this.layout?.paddingTop) {
                    v = this.layout?.paddingTop(r + 1, tab, c);
                }
                css.padding_top = v + "px";
                cssid.push(v);

                v = 1;
                if (this.layout?.paddingBottom) {
                    v = this.layout?.paddingBottom(r + 1, tab, c);
                }
                css.padding_bottom = v + "px";
                cssid.push(v);

                var scssid = cssid.join("-")
                var found = false;
                cell.domWrapper.classList.forEach((cl) => {
                    if (cl.startsWith("RColumn")) {
                        if (cl === scssid)
                            found = true;
                        else
                            cell.domWrapper.classList.remove(cl);
                    }
                });
                if (!found) {
                    cell.domWrapper.classList.add(scssid);
                }
                if (document.getElementById(scssid) === null) {
                    var sc = {};
                    sc["." + scssid] = css;
                    jassijs.includeCSS(scssid, sc);
                }
            }

        }

    }
    protected _setDesignMode(enable) {
        this._designMode = enable;

        //do nothing - no add button
    }


    /*	get design():any{
            return this.toJSON();
        };
        set design(value:any){
            ReportDesign.fromJSON(value,this);
        }*/

    protected fillTableRow(row: RTablerow, count: number) {
        if (!row._designMode || count - row._components.length < 1)
            return;
        for (var x = row._components.length; x < count; x++) {
            var rr = new RText();
            row.addBefore(rr, row._components[row._components.length - 1]);//after addbutton
        }
    }
    addEmptyCellsIfNeeded(row: RTablerow) {
        if (this.insertEmptyCells === false)
            return;
        var count = row._components.length;
        var _this = this;
        this._components.forEach((tr: RTablerow) => {
            _this.fillTableRow(tr, count);
        })

    }
    /**
   * sets the height of a table cell
   * @param component - the table cell
   * @param height - the new height
   **/
    setChildHeight(component: Component, height: any) {
        if (Number.isInteger(this.heights)) {
            this.heights = height;
            var test = Number(height);
            for (var x = 0; x < tr._components.length; x++) {
                tr._components[x].dom.style.height= isNaN(test) ? height : (test + "px");
            }
            return;
        }
        if (typeof (this.heights) === "function") {
            this.heights = [];
        }
        var found = -1;
        var tr = <RTablerow>component._parent;
        var max = tr._components.length - 1;
        var test = Number(height);
        for (var x = 0; x < tr._components.length; x++) {
            tr._components[x].dom.style.height= isNaN(test) ? height : (test + "px");
        }
        for (var t = this.heights.length; t < max; t++) {
            this.heights.push("auto");
        }
        this.heights[this._components.indexOf(tr)] = isNaN(test) ? height : test;
    }
    /**
    * gets the width of a table cell
    * @param component - the table cell
    **/
    getChildHeight(component: Component): any {

        var pos = this._components.indexOf(component._parent);
        if (Number.isInteger(this.heights)) {
            return this.heights;
        } else if (typeof (this.heights) === "function") {
            //@ts-ignore
            return this.heights(pos);
        } else {//Array
            if (pos === -1)
                return undefined;
            return this.heights[pos];
        }
        //this._parent.setChildWidth(component,value);
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
            this.widths[found] = Number(width);
            if (isNaN(this.widths[found] ))
                this.widths[found] = width;
                (<Container>this._components[0])._components[found].domWrapper.setAttribute("width", width);
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
    @$Property({ chooseFrom: allLayouts, chooseFromStrict: true })
    set layoutName(value: string) {
        var old = this.layoutName;
        if (value === "custom" && old === undefined && this.layout !== undefined)
            return;//if user has changed the layout then do not modify

        this.layout = tableLayouts[value]?.layout;
        this.updateLayout(true);
    }
    get layoutName(): string {
        var ret = this.findTableLayout(this.layout);
        if (ret === undefined)
            ret = this.layout === undefined ? "" : "custom";
        return ret;
    }
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
        }
        super.extensionCalled(action);
    }
    private findTableLayout(func): string {
        var sfind = Tools.objectToJson(func, undefined, false).replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "")
        for (var key in tableLayouts) {
            var test = Tools.objectToJson(tableLayouts[key].layout, undefined, false).replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
            if (sfind === test)
                return key;
        }
        return undefined;
    }
    fromJSON(obj: any, callingFromTable = undefined): any {
        var ob = obj.table;
        var ret = this;
        if (ob)
            ret.removeAll();
        if (callingFromTable)
            ob = callingFromTable;
        if (ob?.body) {
            for (var x = 0; x < ob.body.length; x++) {
                let obb = new RTablerow().fromJSON(ob.body[x]);
                obb.parent = this;
                ret.add(obb);
                /*   let all = [];
                   obb._components.forEach((obp) => all.push(obp));
                   all.forEach((obp) => { obb.add(obp) });
                   obb.destroy();*/
            }
            delete ob.body;

        }
        if (ob?.headerRows) {
            ret.headerRows = ob.headerRows;
            delete ob.headerRows;
        }
        if (ob?.widths) {
            ret.widths = ob.widths;
            delete ob.widths;
        }
        if (ob?.heights) {
            ret.heights = ob.heights;
            delete ob.heights;
        }
        if (obj.layout) {
            if (typeof (obj.layout) === "string") {
                if (tableLayouts[obj.layout]?.isSystem === true) {
                    ret.layout = tableLayouts[obj.layout].layout;
                }

            } else
                ret.layout = obj.layout;

            delete obj.layout;

        }
        var tr = (<RTablerow>this._components[0]);
        for (var x = 0; x < tr._components.length; x++) {
            tr._components[x].domWrapper.setAttribute("width", this.widths[x]);
        }
        if (this.heights) {
            for (var r = 0; r < this._components.length; r++) {
                var row = <RTablerow>this._components[r];
                for (var c = 0; c < row._components.length; c++) {
                    var val;
                    if (Number.isInteger(this.heights)) {
                        val = this.heights;
                    } else if (typeof (this.heights) === "function") {
                        //@ts-ignore
                        val = this.heights(r);
                    } else
                        val = this.heights[r];
                        row._components[c].dom.style.height= Number.isInteger(val) ? val + "px" : val;

                }
            }
        }

        super.fromJSON(ob);

        this.updateLayout(false);
        return ret;
    }

    toJSON(datatable = undefined): any {
        var r: any = {

        };
        var ret: any = super.toJSON();
        ret.table = r;
        if (this.layout) {
            var test = this.findTableLayout(this.layout);
            if (tableLayouts[test]?.isSystem)
                ret.layout = test;
            else
                ret.layout = this.layout;
        }
        if (this.headerRows) {
            r.headerRows = this.headerRows;
        }
        if (this.widths && this.widths.length > 0) {
            r.widths = this.widths;
            var len = (<RTablerow>this._components[0])._components.length;
            //@ts-ignore
            if((<RTablerow>this._components[0])._components[len-1].designDummyFor!==undefined)
                len--;
            for (var t = r.widths.length; t < len; t++) {
                r.widths.push("auto");
            }
            //remove width
            while (r.widths.length > len) {
                r.widths.pop();
            }
        }
        //TODO height=50 -> gilt für alle und height=function() not supported
        if (Number.isInteger(this.heights) || typeof (this.heights) === "function") {
            r.heights = this.heights
        } else if (this.heights && this.heights.length > 0) {
            r.heights = this.heights;
            var len = this._components.length;

            for (var t = r.heights.length; t < len; t++) {
                r.heights.push("auto");
            }
            //remove heights
            while (r.heights.length > len) {
                r.heights.pop();
            }
        }
        if (datatable === true) {

        } else {
            r.body = [];
            for (var x = 0; x < this._components.length; x++) {
                r.body.push((<RTablerow>this._components[x]).toJSON());
            }
        }

        return ret;
    }

}



export async function test() {




}



