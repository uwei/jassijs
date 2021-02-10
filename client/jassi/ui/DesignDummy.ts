import { Component } from "./Component";
import { $Class } from "remote/jassi/base/Jassi";
import { Image } from "jassi/ui/Image";
import { MenuItem } from "jassi/ui/MenuItem";
import { Container } from "jassi/ui/Container";

@$Class("jassi.ui.DesignDummy")
export class DesignDummy extends Image {
    type: "beforeComponent" | "atEnd";
    editorselectthis: Component;
    designDummyFor: Component;
    constructor() {
        super();
       
	
    }
    static createIfNeeded(designDummyFor: Component, type: "beforeComponent" | "atEnd", editorselectthis: Component=undefined,oclass:any=undefined): DesignDummy {
        var icon="mdi mdi-card-plus-outline";
        if(type==="beforeComponent")
        	icon="mdi mdi-card-plus";
        if (designDummyFor["designDummies"]) {
        	for(var x=0;x<designDummyFor["designDummies"].length;x++){
            	var du:DesignDummy=<DesignDummy> designDummyFor["designDummies"][x];
            	if(du.type===type)
            		return du;
        	}
        }
		
        var  designDummy;
        if(oclass===undefined)
        	designDummy= new DesignDummy();
        else
        	designDummy=new oclass();
        designDummy.designDummyFor = designDummyFor;
        designDummy.type = type;
        designDummy._parent=designDummyFor;
        designDummy.editorselectthis = editorselectthis;
        $(designDummy.domWrapper).removeClass("jcomponent");
        $(designDummy.domWrapper).addClass("jdesigndummy");
        $(designDummy.domWrapper).css("width", "16px");
        if(oclass===MenuItem){
    		designDummy.icon = icon;	
        }else
	        designDummy.src = icon;
        if(type==="atEnd")
	         (<Container>designDummyFor).add(designDummy);
	    if(type==="beforeComponent")
	        $(designDummyFor.domWrapper).prepend(designDummy.domWrapper);
        if(!designDummyFor["designDummies"])
        	designDummyFor["designDummies"]=[];
        designDummyFor["designDummies"].push(designDummy);

        return designDummy;
        //
    }
    static destroyIfNeeded(designDummyFor: Component, type: "beforeComponent" | "atEnd"){

    	 if (designDummyFor["designDummies"]) {
            designDummyFor["designDummies"].forEach((dummy) => { 
            	if (dummy["type"] === type){
            		 if(type==="atEnd")
	        			(<Container>designDummyFor).remove(dummy);
	        		if(type==="beforeComponent")
		        		designDummyFor.domWrapper.removeChild(dummy.domWrapper);
	        			//(<Container>designDummyFor).remove(dummy); // comp.domWrapper.removeChild(comp["_designDummyPre"].domWrapper);
            		dummy.destroy();
		            /*dummy.domWrapper.parentNode.removeChild(dummy.domWrapper)
            		var pos=designDummyFor["designDummies"].indexOf(dummy);
		            if(pos>=0)
        		        designDummyFor["designDummies"].splice(pos, 1);*/
            	}
            })
        }
    }
}