import { $UIComponent } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { Textbox } from "jassijs/ui/Textbox";

@$UIComponent({fullPath:"common/Textarea",icon:"mdi mdi-text-box-outline"})
@$Class("jassijs.ui.Textarea")
@$Property({name:"new",type:"string"})
export  class Textarea extends Textbox{
      constructor(){ /* document.onkeydown = function(event) {
                alert("Hallo");
            };*/
            super();
            super.init($('<textarea  />')[0]);
        }
}