import registry from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { Report } from "jassijs_report/designer/Report";

export class ReportProperties {

    /**
     * full path to classifiy the UIComponent e.g common/TopComponent 
     */
    fullPath?: string;
    icon?: string;
    serverReportClass?:string;
    

}
export function $Report(properties: ReportProperties): Function {
    return function (pclass) {
        registry.register("$Report", pclass, properties);
    }
}
@$Report({fullPath:"northwind.SampleServerReport",serverReportClass:"northwind.SampleServerReport"})
export class SampleServerReport{
    @$Property()
    name:string;
    arFrom:number;
    content=undefined;
    async open() {
      //  this.report.open();
    }
    async download() {
      //  this.report.download();
    }
    async print() {
       // this.report.print();
    }
    async getBase64(){
        //holt sichs vom Server - parameter übertragen
        this.content=undefined;//report;
    }
    //this would be rendered on server
    layout(me){
        this.content={
            stack: [
                {
                    columns: [
                        {
                            stack: [
                                {
                                    text: "{{name}}{{name2}}"
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    }
    
}

@$Report({fullPath:"northwind.SampleServerReport"})
export class SampleClientReport{
    @$Property()
    name:string;
    
    content:any=undefined;
    data:any;
    async open() {
      //  this.report.open();
    }
    async download() {
      //  this.report.download();
    }
    async print() {
       // this.report.print();
    }
    async getBase64(){
        //holt sichs vom Server - parameter übertragen
        this.content=undefined;//report;
    }
    layout(me){
        this.content={
            stack: [
                {
                    columns: [
                        {
                            stack: [
                                {
                                    text: "{{name}}{{name2}}"
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    }
    
}

export async function test() {
    // kk.o=0;
    var dlg = new SampleClientReport();
    dlg.name="hh";
    this.data={
        name2:"Hallo"
    };
    //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
    //	dlg.value=jassijs.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
    return dlg;
}