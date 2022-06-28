import { $Report, Report } from "jassijs_report/Report";
import { $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";

/*var reportdesign:JassijsReportDefinition = {
    content: [
        {
            datatable: {
                dataforeach:"person",
                body: [
                    "${person.name}","${person.lastname}"
                ] 
            }
        }
    ]
};*/ 
@$Report({name:"test/Sample Serverreport",serverReportPath:"jassijs_report/TestServerreport"})
@$Class("jassijs_report.test.ServerReport")
export class ServerReport extends Report {
     @$Property({chooseFromStrict:true,chooseFrom:["name","lastname"]})
    sort?: string;
}

export async function test(){
    var cl=new ServerReport();
    cl.sort="lastname";
    await cl.show();
}