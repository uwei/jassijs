import {DefaultConverter, $Converter } from "jassi/ui/converters/DefaultConverter";

import jassi, { $Class } from "jassi/remote/Jassi";
import { $Property } from "jassi/ui/Property";

@$Converter({name:"number"})
@$Class("jassi.ui.converters.NumberConverter")
@$Property({name:"new",type:"json"})
//@$Property({name:"new/min",type:"number",default:undefined})
//@$Property({name:"new/max",type:"number",default:undefined})
export class NumberConverter extends DefaultConverter
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassi.ui.PropertyEditors.BooleanEditor
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
            return Number(str);
        }
        /**
         * converts an object to string 
         * @param {string} obj - the object to convert
         */
        objectToString(obj){
        	if(obj===undefined)
        		return undefined;
            return obj.ToString();
        }
   
    }

