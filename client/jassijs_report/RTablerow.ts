import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $UIComponent, Component } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";
import { RText } from "jassijs_report/RText";
import { RDatatable } from "jassijs_report/RDatatable";


//@$UIComponent({editableChildComponents:["this"]})
@$ReportComponent({ editableChildComponents: ["this"] })
@$Class("jassijs_report.RTablerow")
//@$Property({name:"horizontal",hide:true})
export class RTablerow extends RComponent {
    reporttype: string = "tablerow";
    parent:RDatatable;

    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        properties = undefined === properties ? {} : properties;
        properties.noWrapper = true;
        super.init($("<tr></tr>")[0], properties);
        $(this.dom).addClass("designerNoResizable");
    }

    toJSON() {
        var columns = [];

        for (let x = 0;x < this._components.length;x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            //@ts-ignore
            columns.push(this._components[x].toJSON());
        }
        //Object.assign(ret, this["otherProperties"]);

        return columns;
    }
    oncomponentAdded(callback) {
        this.addEvent("componentAdded", callback);
    }
	get _editorselectthis(){
		return this._parent;
	}
    setChildWidth(component: Component, value: any) {
        this._parent?.setChildWidth(component, value);
    }
    getChildWidth(component: Component): any {
        return this._parent?.getChildWidth(component);
    }
    private wrapComponent(component:Component){
    	if(component.domWrapper?.tagName==="TD")
    	    return;//allready wrapped
    	var colspan=	$(component.domWrapper).attr("colspan");//save colspan
    	Component.replaceWrapper(component,document.createElement("td"));
    	$(component.domWrapper).attr("colspan",colspan);
    	$(component.domWrapper).css("word-break","break-all");
    	$(component.domWrapper).css("display","");
    }
     correctHideAfterSpan(){
        //rowspan
    	var span:number;
    	for(var x=0;x<this._components.length;x++){
    		if(this._components[x]["colSpan"]){
    			span=this._components[x]["colSpan"];
    		}else{
    			span--;
    			if(span>0){
    				$(this._components[x].domWrapper).addClass("invisibleAfterColspan");
    			}else{
    				$(this._components[x].domWrapper).removeClass("invisibleAfterColspan");
    			}
    		}
    	}
    }
    /**
    * adds a component to the container
    * @param {jassijs.ui.Component} component - the component to add
    */
    add(component) {
        if (component.addToParent)
            return component.addToParent(this);
		this.wrapComponent(component);
		
        super.add(component);
       // $(component.domWrapper).css("display", "table-cell");
        this.callEvent("componentAdded", component, this);
        if (this._parent)
            this._parent.addEmptyCellsIfNeeded(this);
        if(component.designDummyFor){
        	$(component.domWrapper).attr("colspan","100");
        	if($(this.dom).width()<140){
        		component.width=140-$(this.dom).width();
        	}
        }
         $(component.dom).removeClass("designerNoResizable");
         $(component.dom).addClass("designerNoResizableY");
         
    }
    /**
  * adds a component to the container before an other component
  * @param {jassijs.ui.Component} component - the component to add
  * @param {jassijs.ui.Component} before - the component before then component to add
  */
    addBefore(component, before) {
        if (component.addToParent)
            return component.addToParent(this);
    	this.wrapComponent(component)
        
        if (component["reporttype"] === "text") {
            //(<RText>component).newlineafter = true;
        }
        super.addBefore(component, before);
       // $(component.domWrapper).css("display", "table-cell");
        this.callEvent("componentAdded", component, this);
        if (this._parent)
            this._parent.addEmptyCellsIfNeeded(this);
    }
    fromJSON(columns: any[]): RTablerow {
        var ret = this;
        for (let x = 0;x < columns.length;x++) {
            ret.add(ReportDesign.fromJSON(columns[x]));
        }
        return ret;
    }
}



//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");


