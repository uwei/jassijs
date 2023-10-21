
import {Component, ComponentProperties} from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { $Property, Property } from "jassijs/ui/Property";


export interface InvisibleComponentProperties extends ComponentProperties{

}
/**
 * invivisible Component
 **/
@$Class("jassijs.ui.InvisibleComponent")
/*@$Property({name:"label",hide:true})
@$Property({name:"icon",hide:true})
@$Property({name:"tooltip",hide:true})
@$Property({name:"x",hide:true})
@$Property({name:"y",hide:true})
@$Property({name:"width",hide:true})
@$Property({name:"height",hide:true})
@$Property({name:"contextMenu",hide:true})
@$Property({name:"invisible",hide:true})
@$Property({name:"hidden",hide:true})
@$Property({name:"styles",hide:true})*/
@$Property({hideBaseClassProperties:true})
export class InvisibleComponent<T extends InvisibleComponentProperties={}> extends Component<InvisibleComponentProperties>
{
	$isInivisibleComponent:boolean;
	constructor(properties:InvisibleComponentProperties=undefined){
    	super(properties);
		this.$isInivisibleComponent=true;
    }
    
        
}

