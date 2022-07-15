import { DefaultConverter, $Converter } from "jassijs/ui/converters/DefaultConverter";
import "luxon";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { Component } from "jassijs/ui/Component";
import { Textbox } from "jassijs/ui/Textbox";
declare var luxon;
@$Class("jassijs.ui.converters.DateTimeConverterProperies")
class DateTimeConverterProperties {
    @$Property({ type: "string", chooseFrom: ["date", "time", "datetime", "timeseconds", "datetimeseconds"] })
    type?: "date" | "time" | "datetime" | "timeseconds" | "datetimeseconds";
}
@$Converter({ name: "datetime" })
@$Class("jassijs.ui.converters.DateTimeConverter")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.converters.DateTimeConverterProperties" })
export class DateTimeConverter extends DefaultConverter {
    @$Property({ type: "string", chooseFrom: ["date", "time", "datetime", "timeseconds", "datetimeseconds"] })
    type: "date" | "time" | "datetime" | "timeseconds" | "datetimeseconds";
    constructor(props?: DateTimeConverterProperties) {
        super();
        this.type = props?.type === undefined ? "date" : props?.type;
    }
    get component(): Component {
        return super.component;
    }
    set component(component: Component) {
        super.component = component;
        if (this.type === "date") {
            component.dom.setAttribute("type", "date");
        }
        if (this.type === "time" || this.type === "timeseconds") {
            component.dom.setAttribute("type", "time");
        }
        if (this.type === "timeseconds") {
            component.dom.setAttribute("step", "2");
        }
        if (this.type === "datetime" || this.type === "datetimeseconds") {
            component.dom.setAttribute("type", "datetime-local");
        }
        if (this.type === "datetimeseconds") {
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
        if (this.type === "date" || this.type === undefined) {
            ret = luxon.DateTime.fromFormat(str, 'yyyy-MM-dd');
        }
        else if (this.type === "datetime") {
            ret = luxon.DateTime.fromFormat(str, "yyyy-MM-dd\'T\'HH:mm");
        }
        else if (this.type === "time") {
            ret = luxon.DateTime.fromFormat(str, 'HH:mm');
        }
        else if (this.type === "datetimeseconds") {
            ret = luxon.DateTime.fromFormat(str, "yyyy-MM-dd\'T\'HH:mm:ss");
        }
        else if (this.type === "timeseconds") {
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
        if (this.type === "date" || this.type === undefined) {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd");
        }
        else if (this.type === "datetime") {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd\'T\'HH:mm");
        }
        else if (this.type === "time") {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("HH:mm");
        }
        else if (this.type === "datetimeseconds") {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd\'T\'HH:mm:ss");
        }
        else if (this.type === "timeseconds") {
            ret = luxon.DateTime.fromJSDate(obj).toFormat("HH:mm:ss");
        }
        return ret;
        //        1979-12-31
        //return Numberformatter.numberToString(obj);
    }
}
export function test() {
    var tb = new Textbox();
    tb.converter = new DateTimeConverter({
        type: "datetimeseconds"
    });
    tb.value = new Date(2022, 12, 3, 15, 5);
    return tb;
}
