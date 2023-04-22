import { DefaultConverter, $Converter } from "jassijs/ui/converters/DefaultConverter";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";



@$Class("jassijs.ui.converters.StringConverterProperies")
class StringConverterProperties {
    @$Property()
    minChars?: number;
    @$Property()
    maxChars?: number;
}

@$Converter({ name: "string" })
@$Class("jassijs.ui.converters.StringConverter")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.converters.StringConverterProperies" })
//@$Property({ name: "new/minChars", type: "number", default: undefined })
//@$Property({ name: "new/maxChars", type: "number", default: undefined })
export class StringConverter extends DefaultConverter

    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */ {
    minChars?: number;
    maxChars?: number;
    constructor(props?:StringConverterProperties) {
        super();
        this.minChars=props?.minChars;
        this.maxChars=props?.maxChars;
    }
    /**
     * converts a string to the object
     * an error can be thrown for validation
     * @param {string} str - the string to convert
     */
    stringToObject(str) {
        return str;
    }
    /**
     * converts an object to string 
     * @param {string} obj - the object to convert
     */
    objectToString(obj) {
        return obj?.toString()+this.maxChars;
    }


}


