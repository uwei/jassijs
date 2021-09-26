var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RText", "jassijs_report/RComponent", "jassijs_report/RTablerow"], function (require, exports, Jassi_1, RText_1, RComponent_1, RTablerow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RTable = void 0;
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
            this.widths = [];
            super.init($("<table style='nin-width:50px;table-layout: fixed'></table>")[0]);
            //	this.backgroundPanel.width="500px";
            //$(this.backgroundPanel.dom).css("min-width","200px");
            //$(this.dom).css("display", "table");
            // $(this.dom).css("min-width", "50px");
            this.add(new RTablerow_1.RTablerow());
            $(this.dom).addClass("designerNoResizable");
        }
        _setDesignMode(enable) {
            //do nothing - no add button
        }
        /*	get design():any{
                return this.toJSON();
            };
            set design(value:any){
                ReportDesign.fromJSON(value,this);
            }*/
        fillTableRow(row, count) {
            if (!row._designMode || count - row._components.length !== 1)
                return;
            for (var x = row._components.length; x < count; x++) {
                var rr = new RText_1.RText();
                row.addBefore(rr, row._components[row._components.length - 1]); //after addbutton
            }
        }
        addEmptyCellsIfNeeded(row) {
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
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
            }
            super.extensionCalled(action);
        }
        fromJSON(obj) {
            var ob = obj.table;
            var ret = this;
            ret.removeAll();
            if (ob.body) {
                for (var x = 0; x < ob.body.length; x++) {
                    let obb = new RTablerow_1.RTablerow().fromJSON(ob.body[x]);
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
            var tr = this._components[0];
            for (var x = 0; x < tr._components.length; x++) {
                $(tr._components[x].domWrapper).attr("width", this.widths[x]);
            }
            super.fromJSON(ob);
            for (var x = 0; x < ret._components.length; x++) {
                ret._components[x].correctHideAfterSpan();
            }
            return ret;
        }
        toJSON() {
            var r = {};
            var ret = super.toJSON();
            ret.table = r;
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
            r.body = [];
            for (var x = 0; x < this._components.length; x++) {
                r.body.push(this._components[x].toJSON());
            }
            return ret;
        }
    };
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