import { Checkbox } from "jassi/ui/Checkbox";
import { Button } from "jassi/ui/Button";
import { Textbox } from "jassi/ui/Textbox";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { Numberformatter } from "jassi/util/Numberformatter";
import { NumberConverter } from "jassi/ui/converters/NumberConverter";
type Me = {
    textbox1?: Textbox;
    button1?: Button;
};
@$Class("de/Dialog")
export class Dialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.textbox1 = new Textbox();
        me.button1 = new Button();
        this.width = 750;
        this.height = 206;
        this.isAbsolute = false;
        me.textbox1.value = 50000;
        me.textbox1.format = "#.##0,00€";
        me.textbox1.converter = new NumberConverter();
        me.textbox1.onclick(() => {
           
        });
        me.textbox1.height = 10;
        me.textbox1.width = 135;
        /* let r=()=>{
             alert(1);
         };
         var a=$(me.textbox1.dom).on("click",r);
         $(me.textbox1.dom).click("click",()=>{
             alert(2);
         });
         $(me.textbox1.dom).off("click",undefined,a);*/
        /*   me.textbox1.dom.addEventListener('focus', (event) => {
               $(event.target).val(Numberformatter.numberToString(me.textbox1.value));
           });
   
           me.textbox1.dom.addEventListener('blur', (event) => {
               $(event.target).val(Numberformatter.stringToNumber($(me.textbox1.dom).val()));
           });*/
        this.add(me.textbox1);
        this.add(me.button1);
        me.button1.text = "button";
        me.button1.onclick(function (event) {
             var test = me.textbox1.value;
            debugger;
        });
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
