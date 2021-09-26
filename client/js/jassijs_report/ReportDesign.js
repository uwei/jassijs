var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/BoxPanel", "jassijs/remote/Jassi", "jassijs_report/RStack", "jassijs_report/RText", "jassijs_report/RColumns", "jassijs_report/RUnknown", "jassijs/ui/Panel", "jassijs_report/RComponent", "jassijs_report/RDatatable", "jassijs/ui/Property", "jassijs_report/RStyle", "jassijs_report/RTextGroup", "jassijs_report/RTable"], function (require, exports, BoxPanel_1, Jassi_1, RStack_1, RText_1, RColumns_1, RUnknown_1, Panel_1, RComponent_1, RDatatable_1, Property_1, RStyle_1, RTextGroup_1, RTable_1) {
    "use strict";
    var ReportDesign_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportDesign = void 0;
    let InfoProperties = class InfoProperties {
    };
    __decorate([
        (0, Property_1.$Property)({ description: "the title of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "title", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "the name of the author" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "author", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "the subject of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "subject", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "keywords associated with the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "keywords", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "the creator of the document (default is ‘pdfmake’)" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "creator", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "the producer of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "producer", void 0);
    InfoProperties = __decorate([
        (0, Jassi_1.$Class)("jassijs_report.InfoProperties")
    ], InfoProperties);
    let PermissionProperties = class PermissionProperties {
        constructor() {
            this.modifying = true;
            this.copying = true;
            this.annotating = true;
            this.fillingForms = true;
            this.contentAccessibility = true;
            this.documentAssembly = true;
        }
    };
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["lowResolution", "highResolution"], description: 'whether printing is allowed. Specify "lowResolution" to allow degraded printing, or "highResolution" to allow printing with high resolution' }),
        __metadata("design:type", String)
    ], PermissionProperties.prototype, "printing", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "whether modifying the file is allowed. Specify true to allow modifying document content" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "modifying", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "whether copying text or graphics is allowed. Specify true to allow copying" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "copying", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "whether annotating, form filling is allowed. Specify true to allow annotating and form filling" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "annotating", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "whether form filling and signing is allowed. Specify true to allow filling in form fields and signing" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "fillingForms", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "whether copying text for accessibility is allowed. Specify true to allow copying for accessibility" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "contentAccessibility", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "whether assembling document is allowed. Specify true to allow document assembly" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "documentAssembly", void 0);
    PermissionProperties = __decorate([
        (0, Jassi_1.$Class)("jassijs_report.PermissionProperties")
    ], PermissionProperties);
    let StyleContainer = class StyleContainer extends Panel_1.Panel {
        constructor(props) {
            super(props);
            $(this.dom).removeClass("Panel").removeClass("jinlinecomponent");
            $(this.domWrapper).removeClass("jcomponent").removeClass("jcontainer");
            $(this.dom).hide();
        }
    };
    StyleContainer = __decorate([
        (0, Jassi_1.$Class)("jassijs_report.StyleContainer"),
        (0, Property_1.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], StyleContainer);
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let ReportDesign = ReportDesign_1 = class ReportDesign extends BoxPanel_1.BoxPanel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.styleContainer = new StyleContainer(undefined);
            this.defaultStyle = new RStyle_1.RStyle();
            this.reporttype = "report";
            this.backgroundPanel = new RStack_1.RStack();
            this.headerPanel = new RStack_1.RStack();
            this.contentPanel = new RStack_1.RStack();
            this.footerPanel = new RStack_1.RStack();
            this._pageSize = undefined;
            /**
           * adds a component to the container
           * @param {jassijs.ui.Component} component - the component to add
           */
            /* add(component) {
                 if (component["designPanel"])
                     super.add(component);
                 else
                     super.addBefore(component, this.footerPanel);
         
             }*/
            this.pageSized = {
                '4A0': [4767.87, 6740.79],
                '2A0': [3370.39, 4767.87],
                A0: [2383.94, 3370.39],
                A1: [1683.78, 2383.94],
                A2: [1190.55, 1683.78],
                A3: [841.89, 1190.55],
                A4: [595.28, 841.89],
                A5: [419.53, 595.28],
                A6: [297.64, 419.53],
                A7: [209.76, 297.64],
                A8: [147.40, 209.76],
                A9: [104.88, 147.40],
                A10: [73.70, 104.88],
                B0: [2834.65, 4008.19],
                B1: [2004.09, 2834.65],
                B2: [1417.32, 2004.09],
                B3: [1000.63, 1417.32],
                B4: [708.66, 1000.63],
                B5: [498.90, 708.66],
                B6: [354.33, 498.90],
                B7: [249.45, 354.33],
                B8: [175.75, 249.45],
                B9: [124.72, 175.75],
                B10: [87.87, 124.72],
                C0: [2599.37, 3676.54],
                C1: [1836.85, 2599.37],
                C2: [1298.27, 1836.85],
                C3: [918.43, 1298.27],
                C4: [649.13, 918.43],
                C5: [459.21, 649.13],
                C6: [323.15, 459.21],
                C7: [229.61, 323.15],
                C8: [161.57, 229.61],
                C9: [113.39, 161.57],
                C10: [79.37, 113.39],
                RA0: [2437.80, 3458.27],
                RA1: [1729.13, 2437.80],
                RA2: [1218.90, 1729.13],
                RA3: [864.57, 1218.90],
                RA4: [609.45, 864.57],
                SRA0: [2551.18, 3628.35],
                SRA1: [1814.17, 2551.18],
                SRA2: [1275.59, 1814.17],
                SRA3: [907.09, 1275.59],
                SRA4: [637.80, 907.09],
                EXECUTIVE: [521.86, 756.00],
                FOLIO: [612.00, 936.00],
                LEGAL: [612.00, 1008.00],
                LETTER: [612.00, 792.00],
                TABLOID: [792.00, 1224.00]
            };
            //	this.backgroundPanel.width="500px";
            //$(this.backgroundPanel.dom).css("min-width","200px");
            $(this.backgroundPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Background</text></svg>" + '")');
            $(this.footerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Footer</text></svg>" + '")');
            $(this.headerPanel.dom).css("background-image", 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Header</text></svg>" + '")');
            //select the Report if the user click the Panel
            this.backgroundPanel["_editorselectthis"] = this;
            this.headerPanel["_editorselectthis"] = this;
            //this.contentPanel["_editorselectthis"]=this;     
            this.footerPanel["_editorselectthis"] = this;
            this.add(this.backgroundPanel);
            this.add(this.headerPanel);
            this.add(this.contentPanel);
            this.add(this.footerPanel);
            this.add(this.styleContainer);
            //this.pageSize = "A4";
            //this.pageMargins = [40, 40, 40, 40];
        }
        update(design) {
            this.design = design;
            ReportDesign_1.fromJSON(this.design, this);
        }
        get pageMargins() {
            return this._pageMargins;
        }
        set pageMargins(value) {
            this._pageMargins = value;
            if (value === undefined)
                value = [40, 40, 40, 40];
            this.updateWidth();
            $(this.contentPanel.dom).css("margin-left", value[1] + "px");
            $(this.contentPanel.dom).css("margin-right", value[3] + "px");
        }
        get pageSize() {
            return this._pageSize;
        }
        set pageSize(value) {
            this._pageSize = value;
            this.updateWidth();
        }
        get pageOrientation() {
            return this._pageOrientation;
        }
        set pageOrientation(value) {
            this._pageOrientation = value;
            this.updateWidth();
        }
        updateWidth() {
            var ps = this.pageSize === undefined ? "A4" : this.pageSize;
            var po = this.pageOrientation === 'landscape' ? 1 : 0;
            var pm = this.pageMargins == undefined ? [40, 40, 40, 40] : this.pageMargins;
            this.width = this.pageSized[ps][po]; //-pm[0]-pm[2];
        }
        _setDesignMode(enable) {
            //do nothing - no add button
        }
        static collectForEach(component, allforeach) {
            if (component.foreach)
                allforeach.unshift(component.foreach);
            if (component["dataforeach"])
                allforeach.unshift(component["dataforeach"]);
            if (component.reporttype === "report")
                return component;
            return ReportDesign_1.collectForEach(component._parent, allforeach);
        }
        static getVariable(path, data) {
            var mems = path.split(".");
            var curdata = data;
            for (var x = 0; x < mems.length; x++) {
                curdata = curdata[mems[x]];
                if (curdata === undefined)
                    return undefined;
            }
            return curdata;
        }
        static addVariablenames(path, data, names) {
            for (var key in data) {
                var val = data[key];
                if (Array.isArray(val)) {
                }
                else if (typeof (val) === "object") {
                    ReportDesign_1.addVariablenames(path + (path === "" ? "" : ".") + key, val, names);
                }
                else {
                    names.push("${" + path + (path === "" ? "" : ".") + key + "}");
                }
            }
        }
        //get all possible variabelnames
        static getVariables(component) {
            var allforeach = [];
            var report = ReportDesign_1.collectForEach(component, allforeach);
            var data = {};
            Object.assign(data, report.otherProperties.data);
            for (var x = 0; x < allforeach.length; x++) {
                var fe = allforeach[x].split(" in ");
                if (fe.length !== 2)
                    continue;
                var test = ReportDesign_1.getVariable(fe[1], data);
                if (test && test.length > 0)
                    data[fe[0]] = test[0];
            }
            Object.assign(data, report.otherProperties.data);
            var ret = [];
            ReportDesign_1.addVariablenames("", data, ret);
            return ret;
        }
        static fromJSON(ob, target = undefined) {
            var ret = undefined;
            if (ob.content !== undefined) {
                ret = target;
                if (ret === undefined)
                    ret = new ReportDesign_1();
                ret.create(ob);
            }
            else if (typeof ob === 'string' || ob instanceof String) {
                ret = new RText_1.RText();
                ret.value = ob;
            }
            else if (ob.text !== undefined && !Array.isArray(ob.text)) {
                ret = new RText_1.RText().fromJSON(ob);
            }
            else if (ob.text !== undefined && Array.isArray(ob.text)) {
                ret = new RTextGroup_1.RTextGroup().fromJSON(ob);
            }
            else if (ob.stack !== undefined || Array.isArray(ob)) {
                ret = new RStack_1.RStack().fromJSON(ob);
            }
            else if (ob.columns !== undefined) {
                ret = new RColumns_1.RColumns().fromJSON(ob);
            }
            else if (ob.datatable !== undefined) {
                ret = new RDatatable_1.RDatatable().fromJSON(ob);
            }
            else if (ob.table !== undefined) {
                ret = new RTable_1.RTable().fromJSON(ob);
            }
            else {
                ret = new RUnknown_1.RUnknown().fromJSON(ob);
            }
            return ret;
        }
        create(ob) {
            var _this = this;
            // this.removeAll();
            this.defaultStyle = new RStyle_1.RStyle();
            this._pageSize = undefined;
            this._pageOrientation = undefined;
            this._pageMargins = undefined;
            this.compress = undefined;
            this.userPassword = undefined;
            this.ownerPassword = undefined;
            this.info = undefined;
            this.permissions = undefined;
            this.backgroundPanel.removeAll();
            this.headerPanel.removeAll();
            this.contentPanel.removeAll();
            this.footerPanel.removeAll();
            if (ob.defaultStyle) {
                this.defaultStyle = new RStyle_1.RStyle().fromJSON(ob.defaultStyle);
                this.defaultStyle.name = "defaultStyle";
                $(this.dom).addClass(this.defaultStyle.styleid);
                delete ob.defaultStyle;
            }
            if (ob.styles) {
                for (var st in ob.styles) {
                    var rs = new RStyle_1.RStyle().fromJSON(ob.styles[st]);
                    rs.name = st;
                    this.styleContainer.add(rs);
                }
                delete ob.styles;
            }
            if (ob.background) {
                let obb = ReportDesign_1.fromJSON(ob.background);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.backgroundPanel.add(obp); });
                delete ob.background;
                obb.destroy();
            }
            if (ob.header) {
                let obb = ReportDesign_1.fromJSON(ob.header);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.headerPanel.add(obp); });
                delete ob.header;
                obb.destroy();
            }
            let obb = ReportDesign_1.fromJSON(ob.content);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { _this.contentPanel.add(obp); });
            delete ob.content;
            obb.destroy();
            if (ob.footer) {
                let obb = ReportDesign_1.fromJSON(ob.footer);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.footerPanel.add(obp); });
                delete ob.footer;
                obb.destroy();
            }
            if (ob.pageOrientation) {
                this.pageOrientation = ob.pageOrientation;
                delete ob.pageOrientation;
            }
            if (ob.pageMargins) {
                this.pageMargins = ob.pageMargins;
                delete ob.pageMargins;
            }
            if (ob.pageSize) {
                this.pageSize = ob.pageSize;
                delete ob.pageSize;
            }
            if (ob.info) {
                this.info = ob.info;
                delete ob.info;
            }
            if (ob.compress) {
                this.compress = ob.compress;
                delete ob.compress;
            }
            if (ob.userPassword) {
                this.userPassword = ob.userPassword;
                delete ob.userPassword;
            }
            if (ob.ownerPassword) {
                this.ownerPassword = ob.ownerPassword;
                delete ob.ownerPassword;
            }
            if (ob.permissions) {
                this.permissions = ob.permissions;
                delete ob.permissions;
            }
            //delete ob.data;//should not be to json
            this.otherProperties = ob;
            ReportDesign_1.linkStyles(this);
        }
        static linkStyles(parent) {
            for (var x = 0; x < parent._components.length; x++) {
                var comp = parent._components[x];
                if (comp["style"]) {
                    comp["style"] = comp["style"];
                }
                if (comp["_components"]) {
                    ReportDesign_1.linkStyles(comp);
                }
            }
        }
        toJSON() {
            var r = {};
            if (JSON.stringify(this.defaultStyle) !== "{}") {
                r.defaultStyle = this.defaultStyle.toJSON();
            }
            if (this.styleContainer._components.length > 0) {
                r.styles = {};
                for (var x = 0; x < this.styleContainer._components.length; x++) {
                    r.styles[this.styleContainer._components[x]["name"]] = this.styleContainer._components[x].toJSON();
                }
            }
            //var _this = this;
            if (!(this.backgroundPanel._components.length === 0 || (this.backgroundPanel._designMode && this.backgroundPanel._components.length === 1))) {
                r.background = this.backgroundPanel.toJSON();
            }
            if (!(this.headerPanel._components.length === 0 || (this.headerPanel._designMode && this.headerPanel._components.length === 1))) {
                r.header = this.headerPanel.toJSON();
            }
            if (!(this.footerPanel._components.length === 0 || (this.footerPanel._designMode && this.footerPanel._components.length === 1))) {
                r.footer = this.footerPanel.toJSON();
            }
            r.content = this.contentPanel.toJSON();
            if (this.pageOrientation) {
                r.pageOrientation = this.pageOrientation;
            }
            if (this.pageMargins)
                r.pageMargins = this.pageMargins;
            if (this.pageSize)
                r.pageSize = this.pageSize;
            if (this.info)
                r.info = this.info;
            if (this.compress)
                r.compress = this.compress;
            if (this.userPassword)
                r.userPassword = this.userPassword;
            if (this.ownerPassword)
                r.ownerPassword = this.ownerPassword;
            if (this.permissions)
                r.permissions = this.permissions;
            Object.assign(r, this["otherProperties"]);
            //delete r.data;
            return r;
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean)
    ], ReportDesign.prototype, "compress", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "To enable encryption set user password in userPassword (string value). The PDF file will be encrypted when a user password is provided, and users will be prompted to enter the password to decrypt the file when opening it." }),
        __metadata("design:type", String)
    ], ReportDesign.prototype, "userPassword", void 0);
    __decorate([
        (0, Property_1.$Property)({ description: "To set access privileges for the PDF file, you need to provide an owner password in ownerPassword (string value) and object permissions with permissions. By default, all operations are disallowed. You need to explicitly allow certain operations." }),
        __metadata("design:type", String)
    ], ReportDesign.prototype, "ownerPassword", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs_report.InfoProperties" }),
        __metadata("design:type", InfoProperties)
    ], ReportDesign.prototype, "info", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs_report.PermissionProperties" }),
        __metadata("design:type", PermissionProperties)
    ], ReportDesign.prototype, "permissions", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "number[]", default: [40, 40, 40, 40], description: "margin of the page: left, top, right, bottom" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], ReportDesign.prototype, "pageMargins", null);
    __decorate([
        (0, Property_1.$Property)({ description: "the size of the page", default: "A4", chooseFrom: ['4A0', '2A0', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'RA0', 'RA1', 'RA2', 'RA3', 'RA4', 'SRA0', 'SRA1', 'SRA2', 'SRA3', 'SRA4', 'EXECUTIVE', 'FOLIO', 'LEGAL', 'LETTER', 'TABLOID'] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ReportDesign.prototype, "pageSize", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ['landscape', 'portrait'], default: "portrait", description: "the orientation of the page landscape or portrait" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ReportDesign.prototype, "pageOrientation", null);
    ReportDesign = ReportDesign_1 = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: undefined, icon: undefined, editableChildComponents: ["this", "this.backgroundPanel", "this.headerPanel", "this.contentPanel", "this.footerPanel"] }),
        (0, Jassi_1.$Class)("jassijs_report.ReportDesign"),
        (0, Property_1.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], ReportDesign);
    exports.ReportDesign = ReportDesign;
    //jassijs.myRequire(modul.css["jassijs_report.css"]);
    async function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=ReportDesign.js.map