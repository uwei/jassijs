import jassijs, { $Class } from "jassijs/remote/Jassi";
import registry from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";

export class $ConverterProperties{
	name?:string;
}
export function $Converter(param:$ConverterProperties):Function{
    return function(pclass){
        registry.register("$Converter",pclass,param);
    }
}
@$Class("jassijs.ui.converters.DefaultConverterProperties")
class DefaultConverterProperties{
	@$Property({ default: "function(ob){}" })
	stringToObject(){
	}
}
@$Converter({name:"custom"})
@$Class("jassijs.ui.converters.DefaultConverter")
@$Property({ name: "new", type: "json" ,componentType:"jassijs.ui.converters.DefaultConverterProperties"})
//@$Property({ name: "new/stringToObject", type: "function", default: "function(ob){}" })
export class DefaultConverter
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */ {
    constructor() {
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

