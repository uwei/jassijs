var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/RText", "jassijs_report/ReportComponent", "jassijs_report/RTablerow", "jassijs/ui/Property"], function (require, exports, jassijs_1, RText_1, ReportComponent_1, RTablerow_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RDatatable = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let RDatatable = class RDatatable extends ReportComponent_1.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "datatable";
            this.headerPanel = new RTablerow_1.RTablerow();
            this.bodyPanel = new RTablerow_1.RTablerow();
            this.footerPanel = new RTablerow_1.RTablerow();
            this.widths = [];
            super.init($("<table style='nin-width:50px;table-layout: fixed'></table>")[0]);
            //	this.backgroundPanel.width="500px";
            //$(this.backgroundPanel.dom).css("min-width","200px");
            //$(this.dom).css("display", "table");
            // $(this.dom).css("min-width", "50px");
            $(this.footerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tablefooter</text></svg>" + '")');
            $(this.headerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tableheader</text></svg>" + '")');
            this.add(this.headerPanel);
            this.add(this.bodyPanel);
            this.add(this.footerPanel);
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
            this.fillTableRow(this.headerPanel, count);
            this.fillTableRow(this.bodyPanel, count);
            this.fillTableRow(this.footerPanel, count);
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
                var test = this.headerPanel._components[found].domWrapper;
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
        fromJSON(obj, target = undefined) {
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
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.header);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.headerPanel.add(obp); });
                delete ob.header;
                obb.destroy();
            }
            if (ob.body) {
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.body);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.bodyPanel.add(obp); });
                delete ob.body;
                obb.destroy();
            }
            if (ob.footer) {
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.footer);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.footerPanel.add(obp); });
                delete ob.footer;
                obb.destroy();
            }
            if (ob.widths) {
                ret.widths = ob.widths;
                delete ob.widths;
            }
            var tr = this._components[0];
            for (var x = 0; x < tr._components.length; x++) {
                $(tr._components[x].domWrapper).attr("width", this.widths[x]);
            }
            ret.dataforeach = ob.dataforeach;
            delete ob.dataforeach;
            delete ob.datatable;
            super.fromJSON(ob);
            for (var x = 0; x < ret._components.length; x++) {
                ret._components[x].correctHideAfterSpan();
            }
            return ret;
        }
        toJSON() {
            var r = {};
            var ret = super.toJSON();
            ret.datatable = r;
            //var _this = this;
            if (this.widths && this.widths.length > 0) {
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
    };
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String)
    ], RDatatable.prototype, "dataforeach", void 0);
    RDatatable = __decorate([
        ReportComponent_1.$ReportComponent({ fullPath: "report/Datatable", icon: "mdi mdi-file-table-box-multiple-outline", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] }),
        jassijs_1.$Class("jassijs_report.RDatatable"),
        __metadata("design:paramtypes", [Object])
    ], RDatatable);
    exports.RDatatable = RDatatable;
    async function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=RDatatable.js.map