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
    static parseDate(date:string,format=undefined,settings=undefined){
        if(settings===undefined)
            settings=$.datepicker.regional[navigator.language.split("-")[0]];
        if(format===undefined)
            format=settings.dateFormat;
        return $.datepicker.parseDate(format,date,settings);

    }
     static formatDate(date:Date,format=undefined,settings=undefined){
        if(settings===undefined)
            settings=$.datepicker.regional[navigator.language.split("-")[0]];
        if(format===undefined)
            format=settings.dateFormat;
        return $.datepicker.formatDate(format,date,settings);

    }
}

export function test(){
    var cal=new Calendar();
   
    cal.value=new Date(1978,5,1);
    var h=Calendar.parseDate("18.03.2020");
    var hh=Calendar.formatDate(h);
    var i=cal.value;
    
 
   // cal.value=Date.now()
    return cal;
}