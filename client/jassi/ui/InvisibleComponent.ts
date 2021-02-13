import jassi from "jassi/jassi";
import {Component} from "jassi/ui/Component";
import { $Class } from "jassi/remote/Jassi";
import { $Property, Property } from "./Property";

/**
 * invivisible Component
 **/
@$Class("jassi.ui.InvisibleComponent")
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
export class InvisibleComponent extends Component
{
	constructor(properties=undefined){
    	super(properties);
    }
    
        
}

