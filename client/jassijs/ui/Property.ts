import { $Class } from "jassijs/remote/Registry";
import registry from "jassijs/remote/Registry";
import { classes } from "jassijs/remote/Classes";

export function $Property(property:Property=undefined):Function{
   
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        //debugger;
        var test=classes.getClassName(target);
        if(propertyKey===undefined)
            registry.registerMember("$Property",target.prototype,"new",property);//allow registerMember in class definition
        else
            registry.registerMember("$Property",target,propertyKey,property);
    }
}


@$Class("jassijs.ui.Property")
export class Property
{
        [key:string]:any;
        public constructorClass?;
        public default?;
        /** the name of the property*/
        public name?:string;
        /** the type of the property*/
        public type?:string;
        /** the user can choose this entries */
        public chooseFrom?:any[]|((comp:any,propertyeditor?)=>any[]);
        /** @member - the user can select from chooseFrom but can not input own entries*/
        public chooseFromStrict?:boolean;
        /** @member - the description for tooltip **/
        public decription?:string;
        /** @member - hides the properties from the base class **/
        public hideBaseClassProperties?:boolean;
        public isVisible?:(component,propertyeditor?)=>boolean;
        /**
         * Property for PropertyEditor
         * @class jassijs.ui.EditorProperty
         */
        constructor(name=undefined,type=undefined){
            
            this.name=name;
            
            this.type=type;
        }
        public componentType?;
        public description?:string;
        public hide?:boolean;
        /**
         * this property could be set by browser url
         */
        public isUrlTag?:boolean;
}
