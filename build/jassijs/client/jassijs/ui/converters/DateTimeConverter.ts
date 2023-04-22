import { DefaultConverter, $Converter } from "jassijs/ui/converters/DefaultConverter";
import "luxon";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { Component } from "jassijs/ui/Component";
import { Textbox } from "jassijs/ui/Textbox";
declare var luxon;
@$Class("jassijs.ui.converters.DateTimeConverterProperies")
class DateTimeConverterProperties {
    @$Property({ type: "string", chooseFrom: ["DATE_SHORT", "TIME_SIMPLE", "DATETIME_SHORT", "TIME_WITH_SECONDS", "DATETIME_SHORT_WITH_SECONDS"] })
    type?: "DATE_SHORT" | "TIME_SIMPLE" | "DATETIME_SHORT" | "TIME_WITH_SECONDS" | "DATETIME_SHORT_WITH_SECONDS";
}
@$Converter({ name: "datetime" })
@$Class("jassijs.ui.converters.DateTimeConverter")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.converters.DateTimeConverterProperties" })
export class DateTimeConverter extends DefaultConverter {
    @$Property({ type: "string", chooseFrom: ["DATE_SHORT", "TIME_SIMPLE", "DATETIME_SHORT", "TIME_WITH_SECONDS", "DATETIME_SHORT_WITH_SECONDS"] })
    type: "DATE_SHORT" | "TIME_SIMPLE" | "DATETIME_SHORT" | "TIME_WITH_SECONDS" | "DATETIME_SHORT_WITH_SECONDS";
    constructor(props?: DateTimeConverterProperties) {
        super();
        this.type = props?.type === undefined ? "DATE_SHORT" : props?.type;
    }
    get component(): Component {
        return super.component;
    }
    set component(component: Component) {
        super.component = component;
        if (this.type === "DATE_SHORT") {
            component.dom.setAttribute("type", "date");
        }
        if (this.type === "TIME_SIMPLE" || this.type === "TIME_WITH_SECONDS") {
            component.dom.setAttribute("type", "time");
        }
        if (this.type === "TIME_WITH_SECONDS") {
            component.dom.setAttribute("step", "2");
        }
        if (this.type === "DATETIME_SHORT" || this.type === "DATETIME_SHORT_WITH_SECONDS") {
            component.dom.setAttribute("type", "datetime-local");
        }
        if (this.type === "DATETIME_SHORT_WITH_SECONDS") {
            component.dom.setAttribute("step", "2");
        }
    }
    /**
     * converts a string to the object
     * an error can be thrown for validation
     * @param {string} str - the string to convert
     */
    stringToObject(str) {
        if (str === undefined || str === "")
            return undefined;
        var ret;
        if (this.type === "DATE_SHORT" || this.type === undefined) {
            ret = luxon.DateTime.fromFormat(str, 'yyyy-MM-dd');
        }
        else if (this.type === "DATETIME_SHORT") {
            ret = luxon.DateTime.fromFormat(str, "yyyy-MM-dd\'T\'HH:mm");
        }
        else if (this.type === "TIME_SIMPLE") {
            ret = luxon.DateTime.fromFormat(str, 'HH:mm');
        }
        else if (this.type === "DATETIME_SHORT_WITH_SECONDS") {
            ret = luxon.DateTime.fromFormat(str, "yyyy-MM-dd\'T\'HH:mm:ss");
        }
        else if (this.type === "TIME_WITH_SECONDS") {
            ret = luxon.DateTime.fromFormat(str, 'HH:mm:ss');
        }
        return ret.toJSDate();
        // return Numberformatter.stringToNumber(str);
    }
    /**
     * converts an object to string
     * @param  obj - the object to convert
     */
    objectToString(obj) {
        if (obj === undefined)
            return undefined;
        var ret;
        if (this.type === "DATE_SHORT" || this.type === undefined) {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd");
        }
        else if (this.type === "DATETIME_SHORT") {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd\'T\'HH:mm");
        }
        else if (this.type === "TIME_SIMPLE") {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("HH:mm");
        }
        else if (this.type === "DATETIME_SHORT_WITH_SECONDS") {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd\'T\'HH:mm:ss");
        }
        else if (this.type === "TIME_WITH_SECONDS") {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("HH:mm:ss");
        }
        return ret;
        //        1979-12-31
        //return Numberformatter.numberToString(obj);
    }
    /**
     * format date to string 
     * @param format- e.g. "yyyy-MM-dd" or "HH:mm:ss"
     */
    static toFormat(date:Date,format:string):string{
        return luxon.DateTime.fromJSDate(date).toFormat(format);
    }
      /**
     * parse date a string 
     * @param format- e.g. "yyyy-MM-dd" or "HH:mm:ss"
     */
    static fromFormat(date:string,format:string):Date{
        return luxon.DateTime.fromFormat(date,format).toJSDate();
    }
    static toLocalString(date:Date,format:DateTimeFormat):string{
        return luxon.DateTime.fromJSDate(date).toLocaleString(luxon.DateTime[format]);
    }
}
export type DateTimeFormat="DATE_SHORT"| "TIME_SIMPLE"| "DATETIME_SHORT"|"TIME_WITH_SECONDS"| "DATETIME_SHORT_WITH_SECONDS"|"DATE_MED"|
"DATE_MED_WITH_WEEKDAY"|"DATE_FULL"|"DATE_HUGE"|"TIME_WITH_SHORT_OFFSET"|"TIME_WITH_LONG_OFFSET"|"DATETIME_MED"|"DATETIME_MED_WITH_SECONDS"|
"DATETIME_MED_WITH_WEEKDAY"|"DATETIME_FULL"|"DATETIME_FULL_WITH_SECONDS"|"DATETIME_HUGE"|"DATETIME_HUGE_WITH_SECONDS";
export function test() {
    var tb = new Textbox();
    tb.converter = new DateTimeConverter({
        type: "DATETIME_SHORT_WITH_SECONDS"
    });
    tb.value = new Date(2022, 12, 3, 15, 5);
    //console.log(DateTimeConverter.toLocalString(new Date(),""));
   // console.log(luxon.DateTime.fromJSDate(new Date()).toLocaleString(luxon.DateTime.DATETIME_SHORT));//Format(luxon.DateTime["DATETIME_SHORT"]));
//    return tb;
}
