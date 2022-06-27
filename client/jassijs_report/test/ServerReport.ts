import { $Report, Report } from "jassijs_report/Report";
import { $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";

var reportdesign:JassijsReportDefinition = {
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
};
@$Class("jassijs_report.remote.ServerReportParameter")
class ServerReportParameter {
    sort?: string;
}
@$Report({name:"test/Sample Serverreport",serverReportPath:"jassijs_report/TestServerreport"})
@$Class("jassijs_report.test.ClientReport")
class ServerReport extends Report {
    @$Property({ type: "json", componentType: "jassijs_report.remote.ServerReportParameter" })
    declare parameter:ServerReportParameter;
    
}

export async function test(){
    var cl=new ServerReport();
    cl.parameter={sort:"name"};
    await cl.open();
}