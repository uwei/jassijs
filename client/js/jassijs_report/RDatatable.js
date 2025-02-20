var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs_report/RComponent", "jassijs_report/RTablerow", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs_report/RGroupTablerow", "jassijs_report/RTable"], function (require, exports, Registry_1, RComponent_1, RTablerow_1, Property_1, Classes_1, RGroupTablerow_1, RTable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RDatatable = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let RDatatable = class RDatatable extends RTable_1.RTable {
        /**
    *
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    *
    */
        constructor(properties = { isdatatable: true }) {
            super(properties);
            this.reporttype = "datatable";
            this.headerPanel = new RTablerow_1.RTablerow();
            this.groupHeaderPanel = [];
            this.bodyPanel = new RTablerow_1.RTablerow();
            this.groupFooterPanel = [];
            this.groupExpression = [];
            this.footerPanel = new RTablerow_1.RTablerow();
            var _this;
            this.footerPanel.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tablefooter</text></svg>" + '")';
            this.headerPanel.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tableheader</text></svg>" + '")';
            this.removeAll(); //from Table Constructor
            this.add(this.headerPanel);
            this.add(this.bodyPanel);
            this.add(this.footerPanel);
            this.headerPanel.parent = this;
            this.footerPanel.parent = this;
            this.bodyPanel.parent = this;
        }
        addEmptyCellsIfNeeded(row) {
            var count = row._components.length;
            this.fillTableRow(this.headerPanel, count);
            this.fillTableRow(this.bodyPanel, count);
            this.fillTableRow(this.footerPanel, count);
        }
        set groupCount(value) {
            var _a;
            if (value < 0 || value > 5) {
                throw new Classes_1.JassiError("groupCount must be a value between 0 and 5");
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
                let tr = new RGroupTablerow_1.RGroupTablerow();
                tr.parent = this;
                var id = this.groupHeaderPanel.length + 1;
                tr.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Group" + id + "-Header</text></svg>" + '")';
                this.addBefore(tr, this.bodyPanel);
                this.groupHeaderPanel.push(tr);
            }
            while (this.groupFooterPanel.length < value) {
                let tr = new RGroupTablerow_1.RGroupTablerow();
                tr.parent = this;
                var id = this.groupFooterPanel.length + 1;
                tr.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Group" + id + "-Footer</text></svg>" + '")';
                var prev = this.footerPanel;
                if (this.groupFooterPanel.length > 0)
                    prev = this.groupFooterPanel[this.groupFooterPanel.length - 1];
                this.addBefore(tr, prev);
                this.groupFooterPanel.push(tr);
            }
            while (this.groupExpression.length < value) {
                this.groupExpression.push("");
            }
            (_a = this._componentDesigner) === null || _a === void 0 ? void 0 : _a.editDialog(this._componentDesigner.editMode);
        }
        get groupCount() {
            return this.groupHeaderPanel.length;
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
            if (ob.groups) {
                this.groupCount = ob.groups.length; //create Panels
                for (var x = 0; x < ob.groups.length; x++) {
                    this.groupExpression[x] = ob.groups[x].expression;
                    if (ob.groups[x].header) {
                        let obb = new RGroupTablerow_1.RGroupTablerow().fromJSON(ob.groups[x].header);
                        obb.parent = ret;
                        let all = [];
                        obb._components.forEach((obp) => all.push(obp));
                        all.forEach((obp) => { ret.groupHeaderPanel[x].add(obp); });
                        obb.destroy();
                    }
                    if (ob.groups[x].footer) {
                        let obb = new RGroupTablerow_1.RGroupTablerow().fromJSON(ob.groups[x].footer);
                        obb.parent = ret;
                        let all = [];
                        obb._components.forEach((obp) => all.push(obp));
                        all.forEach((obp) => { ret.groupFooterPanel[x].add(obp); });
                        obb.destroy();
                    }
                }
            }
            delete ob.groups;
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
            if (ob === null || ob === void 0 ? void 0 : ob.widths) {
                ret.widths = ob.widths;
                delete ob.widths;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.heights) {
                ret.heights = ob.heights;
                delete ob.heights;
            }
            ret.dataforeach = ob.dataforeach;
            delete ob.dataforeach;
            delete obj.datatable;
            super.fromJSON(obj, ob);
            return ret;
        }
        toJSON() {
            var ret = super.toJSON(true);
            ret.datatable = ret.table;
            delete ret.table;
            var r = ret.datatable;
            //TODO hack
            r.groups = ret.groups;
            delete ret.groups;
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
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], RDatatable.prototype, "dataforeach", void 0);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RDatatable.prototype, "groupCount", null);
    RDatatable = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Datatable", icon: "mdi mdi-table-cog", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] }),
        (0, Registry_1.$Class)("jassijs_report.RDatatable"),
        __metadata("design:paramtypes", [Object])
    ], RDatatable);
    exports.RDatatable = RDatatable;
    async function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=RDatatable.js.map