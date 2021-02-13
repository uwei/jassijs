import { BoxPanel } from "jassi/ui/BoxPanel";
import jassi, { $Class } from "jassi/remote/Jassi";
import { $UIComponent, Component } from "jassi/ui/Component";
import { $Property } from "jassi/ui/Property";
import { ReportDesign } from "jassi_report/ReportDesign";
import { $ReportComponent, ReportComponent } from "jassi_report/ReportComponent";
import { Panel } from "jassi/ui/Panel";
import { RText } from "jassi_report/RText";


//@$UIComponent({editableChildComponents:["this"]})
@$ReportComponent({ editableChildComponents: ["this"] })
@$Class("jassi_report.RTablerow")
//@$Property({name:"horizontal",hide:true})
export class RTablerow extends ReportComponent {
    otherProperties: any;
    reporttype: string = "tablerow";
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
    * @param {jassi.ui.Component} component - the component to add
    */
    add(component) {

		this.wrapComponent(component);
		
        super.add(component);
       // $(component.domWrapper).css("display", "table-cell");
        this.callEvent("componentAdded", component, this);
        if (this._parent)
            this._parent.addEmptyCellsIfNeeded(this);
    }
    /**
  * adds a component to the container before an other component
  * @param {jassi.ui.Component} component - the component to add
  * @param {jassi.ui.Component} before - the component before then component to add
  */
    addBefore(component, before) {
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



//    jassi.register("reportcomponent","jassi_report.Stack","report/Stack","res/boxpanel.ico");


