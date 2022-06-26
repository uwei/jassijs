import { $Report, Report } from "jassijs_report/remote/Report";
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
@$Class("jassijs_report.remote.ClientReportParameter")
class ClientReportParameter {
    sort?: string;
}
@$Report({name:"test/Sample Serverreport",serverReportPath:"jassijs_report/TestServerreport"})
@$Class("jassijs_report.test.ClientReport")
class ServerReport extends Report {
    @$Property({ type: "json", componentType: "jassijs_report.remote.ClientReportParameter" })
    declare parameter: ClientReportParameter;
    
}

export async function test(){
    var cl=new ServerReport();
    await cl.open();
}