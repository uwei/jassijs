import jassijs, { $Class } from "jassijs/remote/Jassi";
import { $ReportComponent, ReportComponent } from "jassijs_report/ReportComponent";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { InvisibleComponent } from "jassijs/ui/InvisibleComponent";
import { Panel } from "jassijs/ui/Panel";

//@$ReportComponent({fullPath:"report/Text",icon:"res/textbox.ico",initialize:{value:"text"}})
@$Class("jassijs_report.RUnknown")
export class RUnknown extends ReportComponent{
    horizonzal: boolean;
    reporttype:string="unkown";
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties=undefined) {//id connect to existing(not reqired)
        super(properties);
        super.init($('<span class="InvisibleComponent"></span>')[0]);
        this.horizonzal = false;
    }
   fromJSON(ob:any){
        var ret=this;
        super.fromJSON(ob);
       // Object.assign(ret,this.otherProperties);
        return ret;
    }
    toJSON(){
    	var ret= super.toJSON();
    	Object.assign(ret,this.otherProperties);
		return ret;
    }
}