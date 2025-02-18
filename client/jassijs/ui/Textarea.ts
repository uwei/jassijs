import { $UIComponent } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { Textbox, TextboxProperties } from "jassijs/ui/Textbox";

@$UIComponent({fullPath:"common/Textarea",icon:"mdi mdi-text-box-outline"})
@$Class("jassijs.ui.Textarea")
@$Property({name:"new",type:"string"})
export  class Textarea<T extends TextboxProperties=TextboxProperties> extends Textbox<T>{
      constructor(props:TextboxProperties={}){ /* document.onkeydown = function(event) {
                alert("Hallo");
            };*/
            super(props);
           
        }
        render() {
            var _this = this;
            return <any>React.createElement("textarea", {  className: "Textarea"       });
        }
        componentDidMount(): void {
           
        }
}

export function test(){
    debugger;
    var t=new Textarea();
    return t;
}