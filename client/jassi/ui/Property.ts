import jassi, { $Class } from "jassi/remote/Jassi";
import registry from "jassi/remote/Registry";
import { classes } from "jassi/remote/Classes";

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


@$Class("jassi.ui.Property")
export class Property
{
        [key:string]:any;
        public constructorClass?;
        public default?;
        /** @member - the name of the property*/
        public name?:string;
        /** @member - the type of the property*/
        public type?:string;
        /** @member - the user can choose this entries*/
        public chooseFrom?:any[]|((comp:any)=>any[]);
        /** @member - the description for tooltip **/
        public decription?:string;
        /** @member - hides the properties from the base class **/
        public hideBaseClassProperties?:boolean;
        public isVisible?:(component)=>boolean;
        /**
         * Property for PropertyEditor
         * @class jassi.ui.EditorProperty
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
