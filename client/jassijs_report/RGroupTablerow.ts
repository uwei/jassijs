import { RTablerow } from "jassijs_report/RTablerow";
import { $ReportComponent } from "jassijs_report/RComponent";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";




//@$ReportComponent({ editableChildComponents: ["this"] })
@$Class("jassijs_report.RTablerow")
//@$Property({name:"horizontal",hide:true})
export class RGroupTablerow extends RTablerow {
   
    get expression():string{
        var pos=(<any>this.parent)?.groupFooterPanel.indexOf(this);
        if(pos===-1)
            pos=(<any>this.parent)?.groupHeaderPanel.indexOf(this);
        if(pos===-1)
            return undefined;
        return (<any>this.parent)?.groupExpression[pos];
    }
    @$Property()
    set expression(value:string){
        var pos=(<any>this.parent)?.groupFooterPanel.indexOf(this);
        if(pos===-1)
            pos=(<any>this.parent)?.groupHeaderPanel.indexOf(this);
        if(pos===-1)
            return;
            (<any>this.parent).groupExpression[pos] =value;
    }
    get _editorselectthis(){
		return this;
	}
}