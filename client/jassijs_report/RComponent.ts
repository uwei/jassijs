
import registry from "jassijs/remote/Registry";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { UIComponentProperties } from "jassijs/ui/UIComponents";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { RStyle } from "jassijs_report/RStyle";
//Limitations Styles1 -> not implemented	style as array e.g. style: ['quote', 'small']  
jassijs.includeCSSFile("jassijs_report.css");
export class ReportComponentProperties extends UIComponentProperties {

}
export function $ReportComponent(properties: ReportComponentProperties): Function {
    return function (pclass) {
        registry.register("$ReportComponent", pclass, properties);
    }
}



@$Class("jassijs_report.RComponent")
@$Property({ hideBaseClassProperties: true })
export class RComponent extends Panel {
    private _colSpan: number;
    private _rowSpan: number;
    @$Property()
    foreach: string;
    private _width: any;
    private _height: any;
    private _bold: boolean;
    private _decoration: string;
    private _decorationStyle: string;
    private _decorationColor: string;
    private _color: string;
    private _fontSize: number;
    private _lineHeight: number;
    private _italics: boolean;
    private _alignment: string;
    private _background: string;
    private _font: string;
    private _style: string;
    private _fillColor: string;
    private _border: boolean[];
    private _counter: number;
    private _listType: string;
    private _margin: number[];
    reporttype: string = "nothing";
    otherProperties: any;
    constructor(properties = undefined) {
        super( Object.assign({useWrapper:true},properties));

    }
    onstylechanged(func) {
        this.addEvent("stylechanged", func);
    }
    @$Property({
        default: undefined,
        isVisible: (component) => {
            return component._parent?.reporttype === "ol";
        }
    })
    set counter(value: number) {
        this._counter = value;
        if (value === undefined)
            this.domWrapper.removeAttribute("value");
        else
            this.domWrapper.setAttribute("value", value.toString());
    }
    get counter(): number {
        return this._counter;
    }



    @$Property({
        name: "listType",
        default: undefined,
        isVisible: (component) => {
            return component._parent?.reporttype === "ul" || component._parent?.reporttype === "ol";
        },
        chooseFrom: function (it) {
            if (it._parent.reporttype === "ol")
                return ["lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "none"];
            else
                return ["square", "circle", "none"];
        }
    })
    set listType(value: string) {
        this._listType = value;
        if (value === undefined)
            this.domWrapper.style["list-style-type"]= "";
        else
        this.domWrapper.style["list-style-type"]=value;
    }
    get listType(): string {
        return this._listType;
    }

    @$Property({
        type: "color", isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.reporttype === "tablerow";
        }
    })
    get fillColor(): string {
        return this._fillColor;
    }

    set fillColor(value: string) {
        this._fillColor = value;
        this.dom.style["background-color"]= value;

    }
    @$Property({
        type: "string", isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.reporttype === "tablerow";
        }
    })
    get colSpan(): number {
        return this._colSpan;
    }

    set colSpan(value: number) {
        this.domWrapper.setAttribute("colspan", value === undefined ? "" : value.toString());
        this._colSpan = value;
        if (this._parent?._parent?.updateLayout)
            this._parent?._parent?.updateLayout(true);
    }
    @$Property({
        type: "string", isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.reporttype === "tablerow";
        }
    })
    get rowSpan(): number {
        return this._rowSpan;
    }

    set rowSpan(value: number) {
        this.domWrapper.setAttribute("rowspan", value === undefined ? "" : value.toString());
        this._rowSpan = value;
        if (this._parent?._parent?.updateLayout)
            this._parent?._parent?.updateLayout(true);
    }
    @$Property({
        type: "boolean[]",
        default: [false, false, false, false],
        isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.setChildWidth || component._parent?.reporttype === "columns";
        },
        description: "border of the tablecell: left, top, right, bottom"
    })
    get border(): boolean[] {
        return this._border;
    }
    set border(value: boolean[]) {
        this._border = value;
        if (value === undefined)
            value = [false, false, false, false];


        this.domWrapper.style["border-left-style"]= value[0] ? "solid" : "none";
        this.domWrapper.style["border-top-style"]= value[1] ? "solid" : "none";
        this.domWrapper.style["border-right-style"]= value[2] ? "solid" : "none";
        this.domWrapper.style["border-bottom-style"]= value[3] ? "solid" : "none";
    }
    @$Property({
        type: "string", isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.setChildWidth || component._parent?.reporttype === "columns" || component.reporttype === "image";
        }
    })

    get width(): any {
        if (this._parent?.setChildWidth !== undefined)
            return this._parent.getChildWidth(this);
        else
            return this._width;
    }
    set width(value: any) {
        if (value && Number.parseInt(value).toString() === value) {
            value = Number.parseInt(value);
        }
        if (this._parent?.setChildWidth !== undefined)
            this._parent.setChildWidth(this, value);
        else {
            this._width = value;
            super.width = value;
        }
    }
    @$Property({
        type: "string", isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.setChildHeight || component._parent?.reporttype === "columns" || component.reporttype === "image";
        }
    })

    get height(): any {
        if (this._parent?.setChildHeight !== undefined)
            return this._parent.getChildHeight(this);
        else
            return this._height;
    }
    set height(value: any) {
        if (this._parent?.setChildHeight !== undefined)
            this._parent.setChildHeight(this, value);
        else {
            this._height = value;
            console.log(value);
            super.height = value;
        }
    }

    @$Property()
    get bold(): boolean {
        return this._bold;
    }
    set bold(value: boolean) {
        this._bold = value;
        this.dom.style["font-weight"]= value ? "bold" : "normal";
        this.callEvent("stylechanged", "font-weight", value);
    }
    @$Property()
    get italics(): boolean {
        return this._italics;
    }
    set italics(value: boolean) {
        this._italics = value;
        this.dom.style["font-style"]= value ? "italic" : "normal";
        this.callEvent("stylechanged", "font-style", value);
    }
    @$Property({ chooseFrom: ["Alegreya", "AlegreyaSans", "AlegreyaSansSC", "AlegreyaSC", "AlmendraSC", "Amaranth", "Andada", "AndadaSC", "AnonymousPro", "ArchivoNarrow", "Arvo", "Asap", "AveriaLibre", "AveriaSansLibre", "AveriaSerifLibre", "Cambay", "Caudex", "CrimsonText", "Cuprum", "Economica", "Exo2", "Exo", "ExpletusSans", "FiraSans", "JosefinSans", "JosefinSlab", "Karla", "Lato", "LobsterTwo", "Lora", "Marvel", "Merriweather", "MerriweatherSans", "Nobile", "NoticiaText", "Overlock", "Philosopher", "PlayfairDisplay", "PlayfairDisplaySC", "PT_Serif-Web", "Puritan", "Quantico", "QuattrocentoSans", "Quicksand", "Rambla", "Rosario", "Sansation", "Sarabun", "Scada", "Share", "Sitara", "SourceSansPro", "TitilliumWeb", "Volkhov", "Vollkorn"] })
    get font(): string {
        return this._font;
    }
    set font(value: string) {
        this._font = value;
        //copy from CSSProperties
        var api = 'https://fonts.googleapis.com/css?family=';
        var sfont = value.replaceAll(" ", "+")
        if (!document.getElementById("-->" + api + sfont)) {//"-->https://fonts.googleapis.com/css?family=Aclonica">
            jassijs.myRequire(api + sfont);
        }

        if (value === undefined)
            this.dom.style["font_family"]= "";
        else
            this.dom.style["font_family"]= value;
        this.callEvent("stylechanged", "font", value);
    }
    @$Property()
    get fontSize(): number {
        return this._fontSize;
    }
    set fontSize(value: number) {
        this._fontSize = value;
        if (value === undefined)
            this.dom.style["font-size"]= "";
        else
            this.dom.style["font-size"]= value + "px";
        this.callEvent("stylechanged", "fontSize", value);
    }
    @$Property({ type: "color" })
    get background(): string {
        return this._background;
    }
    set background(value: string) {
        this._background = value;
        this.dom.style["background-color"]= value;
        this.callEvent("stylechanged", "background", value);
    }
    @$Property({ type: "color" })
    get color(): string {
        return this._color;
    } 
    set color(value: string) {
        this._color = value;
        this.dom.style.color= value;
        this.callEvent("stylechanged", "color", value);
    }
    @$Property({ chooseFrom: ["left", "center", "right"] })
    get alignment(): string {
        return this._alignment;
    }
    set alignment(value: string) {
        this._alignment = value;
        this.dom.style["text-align"]= value;
        this.callEvent("stylechanged", "alignment", value);
    }
    @$Property({ chooseFrom: ["underline", "lineThrough", "overline"] })
    get decoration(): string {
        return this._decoration;
    }
    set decoration(value: string) {
        this._decoration = value;
        var val = "none";
        if (value === "underline")
            val = "underline";
        if (value === "lineThrough")
            val = "line-through";
        if (value === "overline")
            val = "overline";
        this.dom.style["text-decoration"]= val;
        this.callEvent("stylechanged", "decoration", value);
    }


    @$Property({ type: "color" })
    get decorationColor(): string {
        return this._decorationColor;
    }
    set decorationColor(value: string) {
        this._decorationColor = value;
        this.dom.style["textDecorationColor"]= value;
        this.callEvent("stylechanged", "textDecorationColor", value);
    }
    @$Property({ chooseFrom: ["dashed", "dotted", "double", "wavy"] })
    get decorationStyle(): string {
        return this._decorationStyle;
    }
    set decorationStyle(value: string) {
        this._decorationStyle = value;
        var val = "solid";
        if (value === "dashed")
            val = "dashed";
        if (value === "dotted")
            val = "dotted";
        if (value === "double")
            val = "double";
        if (value === "wavy")
            val = "wavy";
        this.dom.style["textDecorationStyle"]= val;
        this.callEvent("stylechanged", "decorationStyle", value);
    }
    static findReport(parent): ReportDesign {
        if (parent === undefined)
            return undefined;
        if (parent?.reporttype === "report")
            return parent;
        else
            return RComponent.findReport(parent._parent);
    }
    @$Property()
    //@ts-ignore
    get style(): string {
        return this._style;
    }
    //@ts-ignore
    set style(value: string) {
        var old = this._style;
        this._style = value;
        var report = RComponent.findReport(this);
        if (report) {
            report.styleContainer._components.forEach((comp:any) => {
                if (comp.name === old) {
                    this.dom.classList.remove(comp.styleid);
                }
            });
            report.styleContainer._components.forEach((comp:any) => {
                if (comp.name === value) {
                    this.dom.classList.add(comp.styleid);
                }
            });

        }

        //  super.width = value;
    }

    @$Property({ default: 1 })
    get lineHeight(): number {
        return this._lineHeight;
    }
    set lineHeight(value: number) {
        this._lineHeight = value;
        this.dom.style["line-height"]= value;
        this.callEvent("stylechanged", "lineHeight", value);
        //  super.width = value;
    }

    @$Property({ type: "number[]", description: "margin left, top, right, bottom" })
    get margin(): number[] {
        return this._margin;
    }
    set margin(value: number[]) {
        if (value === undefined) {
            this._margin = value;
            this.dom.style["margin"]= "";
        } else {
            if (Number.isInteger(value)) {
                //@ts-ignore
                value = [value, value, value, value];
            }
            if (value.length === 2) {
                value = [value[0], value[1], value[0], value[1]];
            }
            this._margin = value;

            this.dom.style["margin"]= value[1] + "px " + value[2] + "px " + value[3] + "px " + value[0] + "px ";
        }
    }

    fromJSON(ob: any): RComponent {
        var ret = this;

        if (ob.foreach) {
            ret.foreach = ob.foreach;
            delete ob.foreach;
        }
        if (ob.colSpan) {
            ret.colSpan = ob.colSpan;
            delete ob.colSpan;
        }
        if (ob.rowSpan) {
            ret.rowSpan = ob.rowSpan;
            delete ob.rowSpan;
        }
        if (ob.height) {
            ret.height = ob.height;
            delete ob.height;
        }
        if (ob.width) {
            ret.width = ob.width;
            delete ob.width;
        }
        if (ob.bold) {
            ret.bold = ob.bold;
            delete ob.bold;
        }
        if (ob.italics) {
            ret.italics = ob.italics;
            delete ob.italics;
        }
        if (ob.color) {
            ret.color = ob.color;
            delete ob.color;
        }
        if (ob.decoration) {
            ret.decoration = ob.decoration;
            delete ob.decoration;
        }
        if (ob.decorationStyle) {
            ret.decorationStyle = ob.decorationStyle;
            delete ob.decorationStyle;
        }
        if (ob.decorationColor) {
            ret.decorationColor = ob.decorationColor;
            delete ob.decorationColor;
        }
        if (ob.fontSize) {
            ret.fontSize = ob.fontSize;
            delete ob.fontSize;
        }
        if (ob.font) {
            ret.font = ob.font;
            delete ob.font;
        }
        if (ob.lineHeight) {
            ret.lineHeight = ob.lineHeight;
            delete ob.lineHeight;
        }
        if (ob.alignment) {
            ret.alignment = ob.alignment;
            delete ob.alignment;
        }
        if (ob.background) {
            ret.background = ob.background;
            delete ob.background;
        }
        if (ob.style) {
            ret.style = ob.style;
            delete ob.style;
        }
        if (ob.fillColor) {
            ret.fillColor = ob.fillColor;
            delete ob.fillColor;
        }
        if (ob.border) {
            ret.border = ob.border;
            delete ob.border;
        }
        if (ob.counter) {
            ret.counter = ob.counter;
            delete ob.counter;
        }
        if (ob.listType) {
            ret.listType = ob.listType;
            delete ob.listType;
        }
        if (ob.margin) {
            ret.margin = ob.margin;
            delete ob.margin;
        }
        if (ob.width) {
            ret.width = ob.width;
            delete ob.width;
        }
        ret.otherProperties = ob;
        return ret;
    }
    toJSON() {
        var ret: any = {}
        if (this.colSpan !== undefined)
            ret.colSpan = this.colSpan;
        if (this.rowSpan !== undefined)
            ret.rowSpan = this.rowSpan;
        if (this.foreach !== undefined)
            ret.foreach = this.foreach;
        if (this.width !== undefined && !this._parent?.setChildWidth)
            ret.width = this.width;
        if (this.height !== undefined && !this._parent?.setChildHeight)
            ret.height = this.height;

        if (this.bold !== undefined)
            ret.bold = this.bold;
        if (this.italics !== undefined)
            ret.italics = this.italics;
        if (this.color !== undefined)
            ret.color = this.color;
        if (this.decoration !== undefined)
            ret.decoration = this.decoration;
        if (this.decorationStyle !== undefined)
            ret.decorationStyle = this.decorationStyle;
        if (this.decorationColor !== undefined)
            ret.decorationColor = this.decorationColor;
        if (this.font !== undefined)
            ret.font = this.font;
        if (this.fontSize !== undefined)
            ret.fontSize = this.fontSize;
        if (this.lineHeight !== undefined)
            ret.lineHeight = this.lineHeight;
        if (this.alignment !== undefined)
            ret.alignment = this.alignment;
        if (this.background !== undefined)
            ret.background = this.background;
        if (this.style !== undefined)
            ret.style = this.style;
        if (this.fillColor !== undefined)
            ret.fillColor = this.fillColor;
        if (this.border !== undefined)
            ret.border = this.border;
        if (this.counter)
            ret.counter = this.counter;
        if (this.listType)
            ret.listType = this.listType;
        if (this.margin)
            ret.margin = this.margin;
        if (this.width&&this?._parent.reporttype==="column")
            ret.width = this.width;
        Object.assign(ret, this["otherProperties"]);
        return ret;
    }

}