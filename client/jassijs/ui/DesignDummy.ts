import { Component } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { Image } from "jassijs/ui/Image";
import { Container } from "jassijs/ui/Container";

@$Class("jassijs.ui.DesignDummy")
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
        (<Component> designDummy).domWrapper.classList.remove("jcomponent");
       (<Component> designDummy).domWrapper.classList.add("jdesigndummy");
        (<Component> designDummy).domWrapper.style.width="16px";
       
        if(oclass?._classname==='jassijs.ui.MenuItem'){
    		designDummy.icon = icon;	
        }else
	        designDummy.src = icon;
        if(type==="atEnd")
	         (<Container>designDummyFor).add(designDummy);
	    if(type==="beforeComponent")
	        designDummyFor.domWrapper.prepend(designDummy.domWrapper);
        if(!designDummyFor["designDummies"])
        	designDummyFor["designDummies"]=[];
        designDummyFor["designDummies"].push(designDummy);
        
        (<Component>designDummy).dom.classList.add("designerNoResizable");
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

