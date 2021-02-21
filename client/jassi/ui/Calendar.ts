import { Textbox } from "jassi/ui/Textbox";
import { $UIComponent } from "jassi/ui/Component";
import { $Class } from "jassi/remote/Jassi";
import { $Property } from "jassi/ui/Property";

@$UIComponent({fullPath:"common/Calendar",icon:"mdi mdi-calendar-month"})
@$Class("jassi.ui.Calendar")
@$Property({name:"new",type:"string"})
export  class Calendar extends Textbox{
    private _value=undefined;
    constructor(properties=undefined){
        super(properties);
        $( this.dom ).datepicker();
    }
    get value(){
        return<any> $(this.dom).datepicker( 'getDate' );
    }
    set value(val){
        $(this.dom).datepicker( 'setDate' ,val);
    }
}

export function test(){
    var cal=new Calendar();
    cal.value=new Date(1978,5,1);
    var dateFormat = $( cal.dom ).datepicker( "option", "dateFormat" );
 
   // cal.value=Date.now()
    return cal;
}