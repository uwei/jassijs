import {DefaultConverter,  $Converter } from "jassijs/ui/converters/DefaultConverter";
import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";

@$Converter({name:"string"})
@$Class("jassijs.ui.converters.StringConverter")

@$Property({ name: "new", type: "json" })
//@$Property({ name: "new/minChars", type: "number", default: undefined })
//@$Property({ name: "new/maxChars", type: "number", default: undefined })
export  class StringConverter extends DefaultConverter
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */ {
    constructor() {
        super();
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
        return obj.ToString();
    }


}


