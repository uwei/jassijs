import { Textbox } from "jassijs/ui/Textbox";
import { $UIComponent, ComponentConfig } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { DataComponentConfig } from "jassijs/ui/DataComponent";

export interface CalendarConfig extends ComponentConfig,DataComponentConfig {

    /**
    * @member  - the date
    */
    value?;

}

@$UIComponent({ fullPath: "common/Calendar", icon: "mdi mdi-calendar-month" })
@$Class("jassijs.ui.Calendar")
@$Property({ name: "new", type: "string" })
export class Calendar extends Textbox implements CalendarConfig {
    constructor(properties = undefined) { 
        super(properties);
        $(this.dom).datepicker();
    }
    config(config: CalendarConfig): Calendar {
        super.config(config);
        return this;
    }
    get value() {
        return <any>$(this.dom).datepicker('getDate');
    }
    set value(val) {
        $(this.dom).datepicker('setDate', val);
    }
    static parseDate(date: string, format = undefined, settings = undefined) {
        if (settings === undefined)
            settings = $.datepicker.regional[navigator.language.split("-")[0]];
        if (format === undefined)
            format = settings.dateFormat;
        return $.datepicker.parseDate(format, date, settings);

    }
    static formatDate(date: Date, format = undefined, settings = undefined) {
        if (settings === undefined)
            settings = $.datepicker.regional[navigator.language.split("-")[0]];
        if (format === undefined)
            format = settings.dateFormat;
        return $.datepicker.formatDate(format, date, settings);

    }
}

export function test() {
    var cal = new Calendar();

    cal.value = new Date(1978, 5, 1);
    var h = Calendar.parseDate("18.03.2020");
    var hh = Calendar.formatDate(h);
    var i = cal.value;


    // cal.value=Date.now()
    return cal;
}