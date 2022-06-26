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
@$Report({name:"test/Sample Clientreport"})
@$Class("jassijs_report.test.ClientReport")
class ClientReport extends Report {
    @$Property({ type: "json", componentType: "jassijs_report.remote.ClientReportParameter" })
    declare parameter: ClientReportParameter;
    async fill() {
        var data=[
            {name:"Aoron",lastname:"Müller"},
            {name:"Heino",lastname:"Brecht"}
            ]
        return {
            reportdesign,
            data
        }
    }
}

export async function test(){
    var cl=new ClientReport();
    await cl.open();
}