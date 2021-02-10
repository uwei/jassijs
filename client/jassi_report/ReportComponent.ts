import { UIComponentProperties } from "jassi/ui/Component";
import registry from "remote/jassi/base/Registry";
import { $Class } from "remote/jassi/base/Jassi";
import { Panel } from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";

export class ReportComponentProperties extends UIComponentProperties {

}
export function $ReportComponent(properties: ReportComponentProperties): Function {
    return function (pclass) {
        registry.register("$ReportComponent", pclass, properties);
    }
}



@$Class("jassi_report.ReportComponent")
@$Property({ hideBaseClassProperties: true })
export class ReportComponent extends Panel {
    private _colSpan: number;
	@$Property()
	foreach:string;
	private _width: any;
    reporttype: string = "nothing";
	otherProperties:any;
    @$Property({
        type: "string", isVisible: (component) => {
            //only in table and column width is posible
            return component._parent?.reporttype === "tablerow";
        }
    })
    get colSpan(): number {
        /*if(this._parent?.setChildWidth!==undefined)
            return this._parent.getChildWidth(this);
        else 
            return this._width;*/

        return this._colSpan;
    }

    set colSpan(value: number) {
        $(this.domWrapper).attr("colspan", value === undefined ? "" : value);

        /*	if(this._parent?.setChildWidth!==undefined)
                this._parent.setChildWidth(this,value);
            else{
                this._width = value;
                console.log(value);
                super.width = value;
            }*/
        this._colSpan = value;
        if (this._parent)
            this._parent.correctHideAfterSpan();
    }
     @$Property({type:"string",isVisible:(component)=>{
    	//only in table and column width is posible
    	return component._parent?.setChildWidth||component._parent?.reporttype==="columns";
    }})
    get width(): any {
    	if(this._parent?.setChildWidth!==undefined)
    		return this._parent.getChildWidth(this);
    	else 
	        return this._width;
    }
    set width(value: any) {
    	if(this._parent?.setChildWidth!==undefined)
    		this._parent.setChildWidth(this,value);
    	else{
        	this._width = value;
	        console.log(value);
	        super.width = value;
    	}
    }
     fromJSON(ob: any):ReportComponent {
        var ret = this;
     
        if (ob.foreach) {
            ret.foreach = ob.foreach;
            delete ob.foreach;
        }
        if (ob.colSpan) {
            ret.colSpan = ob.colSpan;
            delete ob.colSpan;
        }
        ret.otherProperties = ob;
        return ret;
    }
    toJSON() {
    	var ret:any={}
    	 if (this.colSpan !== undefined)
            ret.colSpan = this.colSpan;
		if (this.foreach !== undefined)
            ret.foreach = this.foreach;
        Object.assign(ret, this["otherProperties"]);
		return ret;
	}

}