import {DefaultConverter, $Converter } from "jassijs/ui/converters/DefaultConverter";

import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { Numberformatter } from "jassijs/util/Numberformatter";

@$Converter({name:"number"})
@$Class("jassijs.ui.converters.NumberConverter")
@$Property({name:"new",type:"json"})
//@$Property({name:"new/min",type:"number",default:undefined})
//@$Property({name:"new/max",type:"number",default:undefined})
export class NumberConverter extends DefaultConverter
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */
    {
        constructor(param:{[any:string]:any}={}){
        		super();
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str){
        	if(str===undefined||str==="")
        		return undefined;
            return  Numberformatter.stringToNumber(str);
        }
        /**
         * converts an object to string 
         * @param  obj - the object to convert
         */
        objectToString(obj){
        	if(obj===undefined)
        		return undefined;
            return Numberformatter.numberToString(obj);
        }
   
    }

