import { DefaultConverter, $Converter } from "jassijs/ui/converters/DefaultConverter";

import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { Numberformatter } from "jassijs/util/Numberformatter";

let allFormats = (() => {
    var ret = [];
    const format = new Intl.NumberFormat();
    var decimal = format.format(1.1).substring(1, 2);
    var group = format.format(1234).substring(1, 2);
    /*	const parts = format.formatToParts(1234.6);
            var decimal = ".";
        var group=",";
        parts.forEach(p => {
            if (p.type === "decimal")
                decimal = p.value;
            if (p.type === "group")
                group = p.value;
        });*/
    ret.push("#" + group + "##0" + decimal + "00");
    ret.push("#" + group + "##0" + decimal + "00 €");
    ret.push("#" + group + "##0" + decimal + "00 $");
    ret.push("0");
    ret.push("0" + decimal + "00");
    return ret;
})();

@$Class("jassijs.ui.converters.NumberConverterProperies")
class NumberConverterProperties {
    @$Property()
    min?: number;
    @$Property()
    max?: number;
    @$Property({ type: "string", chooseFrom: allFormats })
    format?: string;
}

@$Converter({ name: "number" })
@$Class("jassijs.ui.converters.NumberConverter")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.converters.NumberConverterProperies" })

export class NumberConverter extends DefaultConverter
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */ {
    min:number;
    max:number;
    format: string;
    constructor(props?: NumberConverterProperties) {
        super();
        this.min=props?.min;
        this.max=props?.max;
        this.format=props?.format;
    }
    /**
     * converts a string to the object
     * an error can be thrown for validation
     * @param {string} str - the string to convert
     */
    stringToObject(str) {
        if (str === undefined || str === "")
            return undefined;
        return Numberformatter.stringToNumber(str);
    }
    /**
     * converts an object to string 
     * @param  obj - the object to convert
     */
    objectToString(obj) {
        if (obj === undefined)
            return undefined;
        return Numberformatter.numberToString(obj);
    }
    objectToFormatedString(obj) {
        return Numberformatter.format(this.format, obj);
    }
}

