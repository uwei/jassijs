import jassi, { $Class } from "remote/jassi/base/Jassi";
import {BoxPanel} from "jassi/ui/BoxPanel";

@$Class("jassi_report.Report")
//@$UIComponent({editableChildComponents:["this"]})
//@$Property({name:"horizontal",hide:true})
export class Report extends BoxPanel {

   
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties) {//id connect to existing(not reqired)
        super(properties);
    }
}
//jassi.register("reportcomponent", "jassi_report.Report", "report/Report", "res/report.ico");

   // return CodeEditor.constructor;

