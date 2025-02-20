
import { Component, ComponentProperties, createComponent,React } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";

import { Textbox } from "jassijs/ui/Textbox";
import { createState, State } from "jassijs/ui/State";

interface Prop extends ComponentProperties {
    mytext?: string;
     mycolor?:string;
}
var x = 1;
class MyComp extends Component<Prop> {
   
    
    constructor(p:Prop){
        super(p);
    }
    render() {
//        var color: State|any = new State("red");
        var mycolor = createState("red")

        var ret=<div>
            {this.state.mycolor} 
            <button style={{color:this.state.mycolor}}  onClick={() => {
              mycolor.current="blue";
               // _this.config({ text: "neu"+x++ });
            }}>Click
            </button>
            Haello
            <span>kkkk</span>
        </div>;
        return ret;
    }
}
export function test() {
   
    var comp=new MyComp({mycolor:"green"});
    return comp;
}
