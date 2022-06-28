import { $Report, Report } from "jassijs_report/Report";
import { $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";
import { Customer } from "northwind/remote/Customer";
import { $Action, $ActionProvider } from "jassijs/base/Actions";

var reportdesign = {
	content: [
		{
			table: {
                dontBreakRows: false,
				widths: ["33%","33%","33%"],
				body: [
	            ]
			},
			layout: "noBorders"
		}
	]
};
var allCountries=["Germany"];
@$ActionProvider("jassijs.base.ActionNode")
@$Report({ name: "nothwind/Customer Labels",actionname: "Northwind/Reports/Customer Labels",  icon: "mdi mdi-file-chart-outline"})
@$Class("nothwind.CustomerLabels")
export class CustomerLabels extends Report {
    
    @$Property({chooseFrom:function(){
        return allCountries;
    }})
    country?: string;
    async fill() {
        var customers: Customer[] = <any>await Customer.find();
        for(var x=0;x<customers.length;x++){
          if(allCountries.indexOf(customers[x].Country)===-1){
                allCountries.push(customers[x].Country);
            }
        }
        allCountries.sort();
        if(this.country){
             customers = <any>await Customer.find({where:"Country=:c",whereParams:{c:this.country}});
        }
        var line;
        reportdesign.content[0].table.body=[];
        for(var x=0;x<customers.length;x++){
            if(x%3===0){
                line=[];
                reportdesign.content[0].table.body.push(line);        
            }
          
            var adr:any=  {text:  
                        customers[x].CompanyName+"\n"+
                        customers[x].Address+"\n"+
                        customers[x].City+" "+customers[x].PostalCode+"\n"+
                        customers[x].Country+"\n\n\n"}
            if((x-1)%21===0&&x>16)
                adr.pageBreak= 'after';
            line.push(adr);

        }
        while(x%3!==0){
            x=x+1;
            line.push("");
        }
        return {
            reportdesign
        }
    }
     @$Action ({
        name: "Northwind/Reports",
        icon: "mdi mdi-file-chart-outline",
    })
    static async dummy() {
        
    }
}

export async function test() {

    var cl = new CustomerLabels();
    cl.country="USA";
    return await cl.fill();
    //await cl.open();
}