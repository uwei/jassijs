import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { Component, ComponentProperties, createComponent, HTMLComponent, TextComponent } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Table } from "jassijs/ui/Table";
import { Textbox } from "jassijs/ui/Textbox";
import { createState, State } from "jassijs/ui/State";

interface Prop extends ComponentProperties {
    mytext?: string;
     mycolor?:State|any;
}
var x = 1;

class MyComp extends Component<Prop> {

    makeGreen(){
        this.states.mycolor.current="green";
        this.states.mytext.current="green";
    }
    constructor(p:Prop){
        super(p);
    }
    render() {
//        var color: State|any = new State("red");
        var _this=this;
      
        var ret=<div>
            {this.states.mytext}
            <button style={{color:_this.states.mycolor}}  onClick={() => {
              this.states.mytext.current="ooo";
                _this.states.mycolor.current="blue";
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
  
    
    var ret = <MyComp mycolor="yellow" mytext="Hallo2"></MyComp>;
    //var comp = createComponent(ret);
    var comp=new MyComp({mycolor:"orange"})
    //comp.makeGreen();
    return comp;
}