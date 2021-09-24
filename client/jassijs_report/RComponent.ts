import { UIComponentProperties } from "jassijs/ui/Component";
import registry from "jassijs/remote/Registry";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { RStyle } from "jassijs_report/RStyle";

export class ReportComponentProperties extends UIComponentProperties {

}
export function $ReportComponent(properties: ReportComponentProperties): Function {
    return function (pclass) {
        registry.register("$ReportComponent", pclass, properties);
    }
}



@$Class("jassijs_report.ReportComponent")
@$Property({ hideBaseClassProperties: true })
export class RComponent extends Panel {
    private _colSpan: number;
    @$Property()
    foreach: string;
    private _width: any;
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
    private _style:string;
    
    reporttype: string = "nothing";
    otherProperties: any;
    constructor(properties = undefined) {
        super(properties);

    }
    onstylechanged(func){
        this.addEvent("stylechanged",func);
    }
    @$Property({
        type: "string", isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.reporttype === "tablerow";
        }
    })
    get colSpan(): number {
        /*if(this._parent?.setChildWidth!==undefined)
            return this._parent.getChildWidth(this);
        else 
            return this._width;*/

        return this._colSpan;
    }

    set colSpan(value: number) {
        $(this.domWrapper).attr("colspan", value === undefined ? "" : value);

        /*	if(this._parent?.setChildWidth!==undefined)
                this._parent.setChildWidth(this,value);
            else{
                this._width = value;
                console.log(value);
                super.width = value;
            }*/
        this._colSpan = value;
        if (this._parent)
            this._parent.correctHideAfterSpan();
    }
    @$Property({
        type: "string", isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.setChildWidth || component._parent?.reporttype === "columns";
        }
    })
    get width(): any {
        if (this._parent?.setChildWidth !== undefined)
            return this._parent.getChildWidth(this);
        else
            return this._width;
    }
    set width(value: any) {
        if (this._parent?.setChildWidth !== undefined)
            this._parent.setChildWidth(this, value);
        else {
            this._width = value;
            console.log(value);
            super.width = value;
        }
    }
    @$Property()
    get bold(): boolean {
        return this._bold;
    }
    set bold(value: boolean) {
        this._bold = value;
        $(this.dom).css("font-weight", value ? "bold" : "normal");
        this.callEvent("stylechanged","font-weight",value);
    }
    @$Property()
    get italics(): boolean {
        return this._italics;
    }
    set italics(value: boolean) {
        this._italics = value;
        $(this.dom).css("font-style", value ? "italic" : "normal");
        this.callEvent("stylechanged","font-style",value);
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
            $(this.dom).css("font_family", "");
        else
            $(this.dom).css("font_family", value);
        this.callEvent("stylechanged","font",value);
    }
    @$Property()
    get fontSize(): number {
        return this._fontSize;
    }
    set fontSize(value: number) {
        this._fontSize = value;
        if (value === undefined)
            $(this.dom).css("font-size", "");
        else
            $(this.dom).css("font-size", value + "px");
        this.callEvent("stylechanged","fontSize",value);
    }
    @$Property({ type: "color" })
    get background(): string {
        return this._background;
    }
    set background(value: string) {
        this._background = value;
        $(this.dom).css("background-color", value);
        this.callEvent("stylechanged","background",value);
    }
    @$Property({ type: "color" })
    get color(): string {
        return this._color;
    }
    set color(value: string) {
        this._color = value;
        $(this.dom).css("color", value);
        this.callEvent("stylechanged","color",value);
    }
    @$Property({ chooseFrom: ["left", "center", "right"] })
    get alignment(): string {
        return this._alignment;
    }
    set alignment(value: string) {
        this._alignment = value;
        $(this.dom).css("text-align", value);
         this.callEvent("stylechanged","alignment",value);
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
        $(this.dom).css("text-decoration", val);
        this.callEvent("stylechanged","decoration",value);
    }


    @$Property({ type: "color" })
    get decorationColor(): string {
        return this._decorationColor;
    }
    set decorationColor(value: string) {
        this._decorationColor = value;
        $(this.dom).css("textDecorationColor", value);
        this.callEvent("stylechanged","textDecorationColor",value);
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
        $(this.dom).css("textDecorationStyle", val);
        this.callEvent("stylechanged","decorationStyle",value);
    }
    static findReport(parent):ReportDesign{
        if(parent===undefined)
            return undefined;
        if(parent?.reporttype=== "report")
            return parent;
        else
            return RComponent.findReport(parent._parent);
    }
    @$Property()
    get style(): string {
        return this._style;
    }

    set style(value: string) {
        var old=this._style ;
        this._style = value;
        var report=RComponent.findReport(this);
        if(report){
            report.styleContainer._components.forEach((comp:RStyle)=>{
                if(comp.name===old){
                    $(this.dom).removeClass(comp.styleid);
                }
            });
            report.styleContainer._components.forEach((comp:RStyle)=>{
                if(comp.name===value){
                    $(this.dom).addClass(comp.styleid);
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
        $(this.dom).css("line-height", value);
        this.callEvent("stylechanged","lineHeight",value);
        //  super.width = value;
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
        ret.otherProperties = ob;
        return ret;
    }
    toJSON() {
        var ret: any = {}
        if (this.colSpan !== undefined)
            ret.colSpan = this.colSpan;
        if (this.foreach !== undefined)
            ret.foreach = this.foreach;
        if (this.width !== undefined && !this._parent?.setChildWidth)
            ret.width = this.width;
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
        Object.assign(ret, this["otherProperties"]);
        return ret;
    }

}