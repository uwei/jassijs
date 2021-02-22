import { $UIComponent } from "jassi/ui/Component";
import { $Class } from "jassi/remote/Jassi";
import { $Property } from "jassi/ui/Property";
import { Textbox } from "jassi/ui/Textbox";

@$UIComponent({fullPath:"common/Textarea",icon:"mdi mdi-text-box-outline"})
@$Class("jassi.ui.Textarea")
@$Property({name:"new",type:"string"})
export  class Textarea extends Textbox{
      constructor(){ /* document.onkeydown = function(event) {
                alert("Hallo");
            };*/
            super();
            super.init($('<textarea  />')[0]);
        }
}