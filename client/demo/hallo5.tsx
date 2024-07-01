
import { Component, createComponent, React } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";

import { Textbox } from "jassijs/ui/Textbox";
import { createState, State } from "jassijs/ui/State";

interface Prop {
    mytext?: string;
    mycolor?: string;
}
var x = 1;
class MyComp extends Component<Prop> {


    constructor(p: Prop) {
        super(p);
    }
    render() {
        //        var color: State|any = new State("red");
        var mycolor = createState(this.props.mycolor);
        this.calculateState = (props: Prop) => {
            if (props.mycolor)
                mycolor.current = props.mycolor;
        };
        
        //var ret = <div calculateState={calculateState}> 
        
        var ret = <div> 
                {mycolor} 
                <button style={{ color: mycolor.self }} onClick={() => {
                    mycolor.current = "blue";
                    // _this.config({ text: "neu"+x++ });
                }}>Click
                </button>
                Haelloggg
                <span>kkkk</span>
           
        </div>;
        debugger;
        return ret;
    }
}
export function test() {

    var comp = new MyComp({ mycolor: "green" });
    comp.config({ mycolor: "red" });
    
    return comp;
}
