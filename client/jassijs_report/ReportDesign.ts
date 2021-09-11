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
import { $ReportComponent, ReportComponent } from "jassijs_report/ReportComponent";

import { RDatatable } from "jassijs_report/RDatatable";
import { Component } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";

@$Class("jassijs_report.InfoProperties")
class InfoProperties {
    @$Property({ description: "the title of the document" })
    title: string;
    @$Property({ description: "the name of the author" })
    author: string;
    @$Property({ description: "the subject of the document" })
    subject: string;
    @$Property({ description: "keywords associated with the document" })
    keywords: string;
    @$Property({ description: "the creator of the document (default is ‘pdfmake’)" })
    creator: string;
    @$Property({ description: "the producer of the document" })
    producer: string;
}
@$Class("jassijs_report.PermissionProperties")
class PermissionProperties {
    @$Property({ chooseFrom: ["lowResolution", "highResolution"], description: 'whether printing is allowed. Specify "lowResolution" to allow degraded printing, or "highResolution" to allow printing with high resolution' })
    printing: string;
    @$Property({ description: "whether modifying the file is allowed. Specify true to allow modifying document content" })
    modifying: boolean=true;
    @$Property({ description: "whether copying text or graphics is allowed. Specify true to allow copying" })
    copying: boolean=true;
    @$Property({ description: "whether annotating, form filling is allowed. Specify true to allow annotating and form filling" })
    annotating: boolean=true;
    @$Property({ description: "whether form filling and signing is allowed. Specify true to allow filling in form fields and signing" })
    fillingForms: boolean=true;
    @$Property({ description: "whether copying text for accessibility is allowed. Specify true to allow copying for accessibility" })
    contentAccessibility: boolean=true;
    @$Property({ description: "whether assembling document is allowed. Specify true to allow document assembly" })
    documentAssembly: boolean=true;
}
//@$UIComponent({editableChildComponents:["this"]})
//@$Property({name:"horizontal",hide:true})
@$ReportComponent({ fullPath: undefined, icon: undefined, editableChildComponents: ["this", "this.backgroundPanel", "this.headerPanel", "this.contentPanel", "this.footerPanel"] })
@$Class("jassijs_report.ReportDesign")
export class ReportDesign extends BoxPanel {
    reporttype: string = "report";
    design: any;
    otherProperties: any;
    backgroundPanel: RStack = new RStack();
    headerPanel: RStack = new RStack();
    contentPanel: RStack = new RStack();
    footerPanel: RStack = new RStack();
    _pageSize: string = undefined;
    _pageOrientation: string;
    _pageMargins: number[];
    @$Property()
    compress: boolean;
    @$Property({ description: "To enable encryption set user password in userPassword (string value). The PDF file will be encrypted when a user password is provided, and users will be prompted to enter the password to decrypt the file when opening it." })
    userPassword: string;
    @$Property({ description: "To set access privileges for the PDF file, you need to provide an owner password in ownerPassword (string value) and object permissions with permissions. By default, all operations are disallowed. You need to explicitly allow certain operations." })
    ownerPassword: string;
    @$Property({ type: "json", componentType: "jassijs_report.InfoProperties" })
    info: InfoProperties;
    @$Property({ type: "json", componentType: "jassijs_report.PermissionProperties" })
    permissions: PermissionProperties;
	/**
	* 
	* @param {object} properties - properties to init
	* @param {string} [properties.id] -  connect to existing id (not reqired)
	* @param {boolean} [properties.useSpan] -  use span not div
	* 
	*/
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
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
        //this.pageSize = "A4";
        //this.pageMargins = [40, 40, 40, 40];
    }
   
    update(design){
        this.design=design;
        ReportDesign.fromJSON(this.design, this);
    }
    @$Property({ type: "number[]", default: [40, 40, 40, 40], description: "margin of the page: left, top, right, bottom" })
    get pageMargins(): number[] {
        return this._pageMargins;
    }
    set pageMargins(value: number[]) {
        this._pageMargins = value;
        if (value === undefined)
            value = [40, 40, 40, 40];
        this.updateWidth();
        $(this.contentPanel.dom).css("margin-left", value[1] + "px");
        $(this.contentPanel.dom).css("margin-right", value[3] + "px");

    }
    @$Property({ description: "the size of the page", default: "A4", chooseFrom: ['4A0', '2A0', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'RA0', 'RA1', 'RA2', 'RA3', 'RA4', 'SRA0', 'SRA1', 'SRA2', 'SRA3', 'SRA4', 'EXECUTIVE', 'FOLIO', 'LEGAL', 'LETTER', 'TABLOID'] })
    get pageSize(): string {
        return this._pageSize;
    }
    set pageSize(value: string) {
        this._pageSize = value;
        this.updateWidth();
    }

    @$Property({ chooseFrom: ['landscape', 'portrait'], default: "portrait", description: "the orientation of the page landscape or portrait" })
    get pageOrientation(): string {
        return this._pageOrientation;
    }
    set pageOrientation(value: string) {
        this._pageOrientation = value;
        this.updateWidth();
    }
    private updateWidth() {
        var ps = this.pageSize === undefined ? "A4" : this.pageSize;
        var po = this.pageOrientation === 'landscape' ? 1 : 0;
        var pm = this.pageMargins == undefined ? [40, 40, 40, 40] : this.pageMargins;
        this.width = this.pageSized[ps][po];//-pm[0]-pm[2];
    }
    protected _setDesignMode(enable) {
        //do nothing - no add button
    }


    private static collectForEach(component: ReportComponent, allforeach: string[]): ReportDesign {
        if (component.foreach)
            allforeach.unshift(component.foreach);
        if (component["dataforeach"])
            allforeach.unshift(component["dataforeach"]);

        if (component.reporttype === "report")
            return <ReportDesign><any>component;
        return ReportDesign.collectForEach(component._parent, allforeach);

    }
    private static getVariable(path: string, data: any) {
        var mems = path.split(".");
        var curdata = data;
        for (var x = 0;x < mems.length;x++) {
            curdata = curdata[mems[x]];
            if (curdata === undefined)
                return undefined;
        }
        return curdata;
    }
    private static addVariablenames(path: string, data: any, names: string[]) {
        for (var key in data) {
            var val = data[key];
            if (Array.isArray(val)) {

            } else if (typeof (val) === "object") {
                ReportDesign.addVariablenames(path + (path === "" ? "" : ".") + key, val, names);
            } else {
                names.push("{{" + path + (path === "" ? "" : ".") + key + "}}");
            }
        }
    }
    //get all possible variabelnames
    public static getVariables(component: ReportComponent) {
        var allforeach: string[] = [];
        var report = ReportDesign.collectForEach(component, allforeach);
        var data = {};
        Object.assign(data, report.otherProperties.data);
        for (var x = 0;x < allforeach.length;x++) {
            var fe = allforeach[x].split(" in ");
            if (fe.length !== 2)
                continue;
            var test = ReportDesign.getVariable(fe[1], data);
            if (test && test.length > 0)
                data[fe[0]] = test[0];
        }
        Object.assign(data, report.otherProperties.data);
        var ret: string[] = [];
        ReportDesign.addVariablenames("", data, ret);
        return ret;
    }
    static fromJSON(ob: any, target: ReportDesign = undefined): any {
        var ret = undefined;
        if (ob.content !== undefined) {
            ret = target;
            if (ret === undefined)
                ret = new ReportDesign();
            ret.create(ob);
        }else if (typeof ob === 'string' || ob instanceof String){
            ret=new RText();
            ret.value=ob;
        } else if (ob.text !== undefined) {
            ret = new RText().fromJSON(ob);
        } else if (ob.stack !== undefined||Array.isArray(ob)) {
            ret = new RStack().fromJSON(ob);
        } else if (ob.columns !== undefined) {
            ret = new RColumns().fromJSON(ob);
        } else if (ob.datatable !== undefined) {
            ret = new RDatatable().fromJSON(ob);
        } else {
            ret = new RUnknown().fromJSON(ob);
        }

        return ret;
    }

    private create(ob: any) {
        var _this = this;
        // this.removeAll();
        
 
    this._pageSize = undefined;
    this._pageOrientation=undefined;
    this._pageMargins=undefined;
    this.compress=undefined;
    this.userPassword=undefined;
    this.ownerPassword=undefined;
    this.info=undefined;
    this.permissions=undefined;
        this.backgroundPanel.removeAll();
        this.headerPanel.removeAll();
        this.contentPanel.removeAll();
        this.footerPanel.removeAll();
        if (ob.background) {
            let obb: RStack = ReportDesign.fromJSON(ob.background);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { _this.backgroundPanel.add(obp) });
            delete ob.background;
            obb.destroy();
        }
        if (ob.header) {
            let obb = ReportDesign.fromJSON(ob.header);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { _this.headerPanel.add(obp) });
            delete ob.header;
            obb.destroy();
        }
        let obb = ReportDesign.fromJSON(ob.content);
        let all = [];
        obb._components.forEach((obp) => all.push(obp));
        all.forEach((obp) => { _this.contentPanel.add(obp) });
        delete ob.content;
        obb.destroy();
        if (ob.footer) {
            let obb = ReportDesign.fromJSON(ob.footer);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { _this.footerPanel.add(obp) });
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
    }

    toJSON(): any {

        var r: any = {

        };
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
    private pageSized = { //https://github.com/bpampuch/pdfmake/blob/master/src/standardPageSizes.js
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
}



export async function test() {




}



