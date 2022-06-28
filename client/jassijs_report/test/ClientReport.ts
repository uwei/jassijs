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

@$Report({name:"test/Sample Clientreport"})
@$Class("jassijs_report.test.ClientReport")
export class ClientReport extends Report {
    @$Property()
    sort?: string;
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