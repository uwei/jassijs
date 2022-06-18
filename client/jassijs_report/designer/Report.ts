import { $Class } from "jassijs/remote/Registry";
import {BoxPanel} from "jassijs/ui/BoxPanel";

@$Class("jassijs_report.Report")
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
//jassijs.register("reportcomponent", "jassijs_report.Report", "report/Report", "res/report.ico");

   // return CodeEditor.constructor;

