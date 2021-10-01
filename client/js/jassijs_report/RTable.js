var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RText", "jassijs/util/Tools", "jassijs_report/RComponent", "jassijs_report/RTablerow", "jassijs/ui/Property", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Button", "jassijs/util/Runlater", "jassijs_report/RTableLayouts"], function (require, exports, Jassi_1, RText_1, Tools_1, RComponent_1, RTablerow_1, Property_1, ContextMenu_1, MenuItem_1, Button_1, Runlater_1, RTableLayouts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RTable = void 0;
    var allLayouts = Object.keys(RTableLayouts_1.tableLayouts);
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let RTable = class RTable extends RComponent_1.RComponent {
        /**
    *
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    *
    */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "table";
            // bodyPanel: RTablerow[] = [new RTablerow()];
            this.insertEmptyCells = true;
            this.widths = [];
            super.init($("<table  style='border-spacing:0px;min-width:50px;table-layout: fixed'></table>")[0]);
            //	this.backgroundPanel.width="500px";
            //$(this.backgroundPanel.dom).css("min-width","200px");
            //$(this.dom).css("display", "table");
            // $(this.dom).css("min-width", "50px");
            this.updater = new Runlater_1.Runlater(() => {
                _this.updateLayout(false);
            }, 100);
            let tr = new RTablerow_1.RTablerow();
            tr.parent = this;
            this.add(tr);
            $(this.dom).addClass("designerNoResizable");
            this.initContextMenu();
            var _this = this;
        }
        getInfoFromEvent(evt) {
            var ret = {};
            ret.cell = this.contextMenu.target.parentNode._this;
            ret.tableRow = ret.cell.parent;
            ret.column = ret.tableRow._components.indexOf(ret.cell);
            ret.row = this._components.indexOf(ret.tableRow);
            return ret;
        }
        async initContextMenu() {
            var _this = this;
            this.contextMenu = new ContextMenu_1.ContextMenu();
            this.contextMenu._isNotEditableInDesigner = true;
            $(this.contextMenu.menu.dom).css("font-family", "Roboto");
            $(this.contextMenu.menu.dom).css("font-size", "12px");
            this.contextMenu.menu._setDesignMode = (nothing) => { }; //should net be editable in designer
            var insertRowBefore = new MenuItem_1.MenuItem();
            //@ts-ignore
            insertRowBefore._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            insertRowBefore.items._setDesignMode = (nothing) => { };
            insertRowBefore.text = "insert row before";
            insertRowBefore.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newRow = new RTablerow_1.RTablerow();
                newRow.parent = _this;
                _this.addBefore(newRow, _this._components[info.row]);
                newRow.add(new RText_1.RText());
                //@ts-ignore
                newRow._setDesignMode(true);
                _this.fillTableRow(newRow, info.tableRow._components.length);
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(insertRowBefore);
            var insertRowAfter = new MenuItem_1.MenuItem();
            //@ts-ignore
            insertRowAfter._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            insertRowAfter.items._setDesignMode = (nothing) => { };
            insertRowAfter.text = "insert row after";
            insertRowAfter.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newRow = new RTablerow_1.RTablerow();
                newRow.parent = _this;
                if (_this._components.length === info.row + 1)
                    _this.add(newRow);
                else
                    _this.addBefore(newRow, _this._components[info.row + 1]);
                newRow.add(new RText_1.RText());
                //@ts-ignore
                newRow._setDesignMode(true);
                _this.fillTableRow(newRow, info.tableRow._components.length);
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(insertRowAfter);
            var insertColumnBefore = new MenuItem_1.MenuItem();
            //@ts-ignore
            insertColumnBefore._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            insertColumnBefore.items._setDesignMode = (nothing) => { };
            insertColumnBefore.text = "insert column before";
            insertColumnBefore.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newCell = new RText_1.RText();
                if (_this.widths)
                    _this.widths.splice(info.column, 0, "auto");
                _this.insertEmptyCells = false;
                for (var x = 0; x < _this._components.length; x++) {
                    _this._components[x].addBefore(new RText_1.RText(), _this._components[x]._components[info.column]);
                }
                _this.insertEmptyCells = true;
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(insertColumnBefore);
            var insertColumnAfter = new MenuItem_1.MenuItem();
            //@ts-ignore
            insertColumnAfter._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            insertColumnAfter.items._setDesignMode = (nothing) => { };
            insertColumnAfter.text = "insert column after";
            insertColumnAfter.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newCell = new RText_1.RText();
                if (_this.widths)
                    _this.widths.splice(info.column + 1, 0, "auto");
                _this.insertEmptyCells = false;
                for (var x = 0; x < _this._components.length; x++) {
                    _this._components[x].addBefore(new RText_1.RText(), _this._components[x]._components[info.column + 1]);
                }
                _this.insertEmptyCells = true;
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(insertColumnAfter);
            var removeColumn = new MenuItem_1.MenuItem();
            //@ts-ignore
            removeColumn._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            removeColumn.items._setDesignMode = (nothing) => { };
            removeColumn.text = "delete column";
            removeColumn.onclick((evt) => {
                var _a;
                var info = _this.getInfoFromEvent(evt);
                if (_this.widths)
                    _this.widths.slice(info.column, 0);
                for (var x = 0; x < _this._components.length; x++) {
                    var tr = _this._components[x];
                    //@ts-ignore
                    if (((_a = tr._components[info.column]) === null || _a === void 0 ? void 0 : _a.designDummyFor) === undefined)
                        tr.remove(tr._components[info.column], true);
                }
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(removeColumn);
            var removeRow = new MenuItem_1.MenuItem();
            //@ts-ignore
            removeRow._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            removeRow.items._setDesignMode = (nothing) => { };
            removeRow.text = "delete row";
            removeRow.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                _this.remove(_this._components[info.row]);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(removeRow);
            var copyMenu = new Button_1.Button();
            $(copyMenu.dom).css("font-family", "Roboto");
            $(copyMenu.dom).css("font-size", "12px");
            copyMenu.text = "copy";
            copyMenu.width = "100%";
            $(copyMenu.dom).removeClass("jinlinecomponent");
            let func = function (evt) {
                var info = _this.getInfoFromEvent(evt);
                //@ts-ignore
                var edi = tinymce.editors[info.cell._id];
                navigator.clipboard.writeText(edi.selection.getContent());
                _this.contextMenu.close();
            };
            copyMenu.onclick(func);
            this.contextMenu.menu.add(copyMenu);
            var pasteMenu = new Button_1.Button();
            $(pasteMenu.dom).css("font-family", "Roboto");
            $(pasteMenu.dom).css("font-size", "12px");
            pasteMenu.text = "paste";
            pasteMenu.width = "100%";
            $(pasteMenu.dom).removeClass("jinlinecomponent");
            let func2 = function (evt) {
                var info = _this.getInfoFromEvent(evt);
                //@ts-ignore
                var edi = tinymce.editors[info.cell._id];
                navigator.clipboard.readText().then((data) => {
                    edi.selection.setContent(data);
                });
            };
            pasteMenu.onclick(func2);
            this.contextMenu.menu.add(pasteMenu);
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
            var span;
            var hiddenCells = {};
            for (var r = 0; r < this._components.length; r++) {
                var row = this._components[r];
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
                        $(cell.domWrapper).addClass("invisibleAfterSpan");
                    }
                    else {
                        $(cell.domWrapper).removeClass("invisibleAfterSpan");
                    }
                }
            }
        }
        doTableLayout() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
            this.correctHideAfterSpan();
            var tab = this.toJSON();
            if (tab.table.widths === undefined)
                tab.table.widths = [];
            while (this._components[0]._components.length > tab.table.widths.length) {
                tab.table.widths.push("auto"); //designer dummy
            }
            for (var r = 0; r < this._components.length; r++) {
                var row = this._components[r];
                for (var c = 0; c < row._components.length; c++) {
                    var cssid = ["RColumn"];
                    var css = {};
                    var cell = row._components[c];
                    var v = null;
                    if ((_a = this.layout) === null || _a === void 0 ? void 0 : _a.fillColor) {
                        v = (_b = this.layout) === null || _b === void 0 ? void 0 : _b.fillColor(r, tab, c);
                    }
                    if (v === null)
                        v = "white";
                    css.background_color = v;
                    cssid.push(v.replace("#", ""));
                    v = 1;
                    if ((_c = this.layout) === null || _c === void 0 ? void 0 : _c.hLineWidth) {
                        v = (_d = this.layout) === null || _d === void 0 ? void 0 : _d.hLineWidth(r, tab, c);
                    }
                    css.border_top_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_e = this.layout) === null || _e === void 0 ? void 0 : _e.hLineWidth) {
                        v = (_f = this.layout) === null || _f === void 0 ? void 0 : _f.hLineWidth(r + 1, tab, c);
                    }
                    css.border_bottom_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_g = this.layout) === null || _g === void 0 ? void 0 : _g.vLineWidth) {
                        v = (_h = this.layout) === null || _h === void 0 ? void 0 : _h.vLineWidth(c, tab, r);
                    }
                    css.border_left_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_j = this.layout) === null || _j === void 0 ? void 0 : _j.vLineWidth) {
                        v = (_k = this.layout) === null || _k === void 0 ? void 0 : _k.vLineWidth(c + 1, tab, r);
                    }
                    css.border_right_width = v + "px";
                    cssid.push(v);
                    v = "black";
                    css.border_top_style = "solid";
                    css.border_bottom_style = "solid";
                    css.border_left_style = "solid";
                    css.border_right_style = "solid";
                    if ((_l = this.layout) === null || _l === void 0 ? void 0 : _l.hLineColor) {
                        v = (_m = this.layout) === null || _m === void 0 ? void 0 : _m.hLineColor(r, tab, c);
                    }
                    css.border_top_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_o = this.layout) === null || _o === void 0 ? void 0 : _o.hLineColor) {
                        v = (_p = this.layout) === null || _p === void 0 ? void 0 : _p.hLineColor(r + 1, tab, c);
                    }
                    css.border_bottom_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_q = this.layout) === null || _q === void 0 ? void 0 : _q.vLineColor) {
                        v = (_r = this.layout) === null || _r === void 0 ? void 0 : _r.vLineColor(c, tab, r);
                    }
                    css.border_left_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_s = this.layout) === null || _s === void 0 ? void 0 : _s.vLineColor) {
                        v = (_t = this.layout) === null || _t === void 0 ? void 0 : _t.vLineColor(c + 1, tab, r);
                    }
                    css.border_right_color = v;
                    cssid.push(v.replace("#", ""));
                    v = 1;
                    if ((_u = this.layout) === null || _u === void 0 ? void 0 : _u.paddingLeft) {
                        v = (_v = this.layout) === null || _v === void 0 ? void 0 : _v.paddingLeft(c + 1, tab, r);
                    }
                    css.padding_left = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_w = this.layout) === null || _w === void 0 ? void 0 : _w.paddingRight) {
                        v = (_x = this.layout) === null || _x === void 0 ? void 0 : _x.paddingRight(c + 1, tab, r);
                    }
                    css.padding_right = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_y = this.layout) === null || _y === void 0 ? void 0 : _y.paddingTop) {
                        v = (_z = this.layout) === null || _z === void 0 ? void 0 : _z.paddingTop(r + 1, tab, c);
                    }
                    css.padding_top = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_0 = this.layout) === null || _0 === void 0 ? void 0 : _0.paddingBottom) {
                        v = (_1 = this.layout) === null || _1 === void 0 ? void 0 : _1.paddingBottom(r + 1, tab, c);
                    }
                    css.padding_bottom = v + "px";
                    cssid.push(v);
                    var scssid = cssid.join("-");
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
                        Jassi_1.default.includeCSS(scssid, sc);
                    }
                }
            }
        }
        _setDesignMode(enable) {
            this._designMode = enable;
            //do nothing - no add button
        }
        /*	get design():any{
                return this.toJSON();
            };
            set design(value:any){
                ReportDesign.fromJSON(value,this);
            }*/
        fillTableRow(row, count) {
            if (!row._designMode || count - row._components.length < 1)
                return;
            for (var x = row._components.length; x < count; x++) {
                var rr = new RText_1.RText();
                row.addBefore(rr, row._components[row._components.length - 1]); //after addbutton
            }
        }
        addEmptyCellsIfNeeded(row) {
            if (this.insertEmptyCells === false)
                return;
            var count = row._components.length;
            var _this = this;
            this._components.forEach((tr) => {
                _this.fillTableRow(tr, count);
            });
        }
        /**
        * sets the width of a table cell
        * @param component - the table cell
        * @param width - the new width
        **/
        setChildWidth(component, width) {
            var max = 0;
            var found = -1;
            for (var x = 0; x < this._components.length; x++) {
                for (var i = 0; i < this._components[x]._components.length; i++) {
                    if (i > max)
                        max = i;
                    var row = this._components[x]._components[i];
                    if (row === component)
                        found = i;
                }
            }
            for (var t = this.widths.length; t < max; t++) {
                this.widths.push("auto");
            }
            if (found !== -1) {
                this.widths[found] = width;
                $(this._components[0]._components[found].domWrapper).attr("width", width);
            }
            //this._parent.setChildWidth(component,value);
        }
        /**
         * gets the width of a table cell
         * @param component - the table cell
         **/
        getChildWidth(component) {
            var found = -1;
            for (var x = 0; x < this._components.length; x++) {
                if (this._components[x]._components) {
                    for (var i = 0; i < this._components[x]._components.length; i++) {
                        var row = this._components[x]._components[i];
                        if (row === component)
                            found = i;
                    }
                }
            }
            if (found !== -1)
                return this.widths[found];
            //this._parent.setChildWidth(component,value);
        }
        create(ob) {
        }
        set layoutName(value) {
            var _a;
            var old = this.layoutName;
            if (value === "custom" && old === undefined && this.layout !== undefined)
                return; //if user has changed the layout then do not modify
            this.layout = (_a = RTableLayouts_1.tableLayouts[value]) === null || _a === void 0 ? void 0 : _a.layout;
            this.updateLayout(true);
        }
        get layoutName() {
            var ret = this.findTableLayout(this.layout);
            if (ret === undefined)
                ret = this.layout === undefined ? "" : "custom";
            return ret;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
            }
            super.extensionCalled(action);
        }
        findTableLayout(func) {
            var sfind = Tools_1.Tools.objectToJson(func, undefined, false).replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
            for (var key in RTableLayouts_1.tableLayouts) {
                var test = Tools_1.Tools.objectToJson(RTableLayouts_1.tableLayouts[key].layout, undefined, false).replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
                if (sfind === test)
                    return key;
            }
            return undefined;
        }
        fromJSON(obj) {
            var _a;
            var ob = obj.table;
            var ret = this;
            ret.removeAll();
            if (ob.body) {
                for (var x = 0; x < ob.body.length; x++) {
                    let obb = new RTablerow_1.RTablerow().fromJSON(ob.body[x]);
                    obb.parent = this;
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
            if (obj.layout) {
                if (typeof (obj.layout) === "string") {
                    if (((_a = RTableLayouts_1.tableLayouts[obj.layout]) === null || _a === void 0 ? void 0 : _a.isSystem) === true) {
                        ret.layout = RTableLayouts_1.tableLayouts[obj.layout].layout;
                    }
                }
                else
                    ret.layout = obj.layout;
                delete obj.layout;
            }
            var tr = this._components[0];
            for (var x = 0; x < tr._components.length; x++) {
                $(tr._components[x].domWrapper).attr("width", this.widths[x]);
            }
            super.fromJSON(ob);
            this.updateLayout(false);
            return ret;
        }
        toJSON() {
            var _a;
            var r = {};
            var ret = super.toJSON();
            ret.table = r;
            if (this.layout) {
                var test = this.findTableLayout(this.layout);
                if ((_a = RTableLayouts_1.tableLayouts[test]) === null || _a === void 0 ? void 0 : _a.isSystem)
                    ret.layout = test;
                else
                    ret.layout = this.layout;
            }
            if (this.widths && this.widths.length > 0) {
                r.widths = this.widths;
                var len = this._components[0]._components.length;
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
            r.body = [];
            for (var x = 0; x < this._components.length; x++) {
                r.body.push(this._components[x].toJSON());
            }
            return ret;
        }
    };
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: allLayouts, chooseFromStrict: true }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RTable.prototype, "layoutName", null);
    RTable = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Table", icon: "mdi mdi-table-large", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] }),
        (0, Jassi_1.$Class)("jassijs_report.RTable"),
        __metadata("design:paramtypes", [Object])
    ], RTable);
    exports.RTable = RTable;
    async function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=RTable.js.map