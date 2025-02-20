import { TextComponent } from "jassijs/ui/Component";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Component,ComponentProperties,createComponent,HTMLComponent,React,Ref } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { createState,createStates,State } from "jassijs/ui/State";
interface Me {
    button?: Button;
    colorState?: State<string>;
}
interface MProp extends ComponentProperties {
    color?:string;
}
var x=1;
type Refs={};
class MyComp<Prop> extends Component<MProp> {
    declare refs: Refs;
    constructor(p: MProp) {
        super(p);
    }
    render() { 
        if(this.props.color===undefined)
            this.state.color.current="yellow";
        //{me.states.colorState}  
        var ret=<div>

            <Button text="kk" style={{ color: this.state.color }} onclick={() => {
                this.state.color.current="blue";
                // _this.config({ text: "neu"+x++ });
            }}>
            </Button>
            Haello
            ggg

            <Checkbox text="456456" style={{
                color: "green"
            }}></Checkbox>
            Hallo
            Das
            <span>kkk
                g
                <Checkbox text="456456" style={{
                    color: "green"
                }}></Checkbox>
                Hallo
                <br />Du
                Hallo
                <br></br>Du
                Hallo
                <br></br>Du
                Hallo
                <br></br>Du

                Hallo
                <br></br>Du Hallo
                <Panel></Panel>


                <br></br>
                Du

                Hallo

                Du
                ;
                Hallo
                <br></br>
                Du
                Hallo
                <br></br>
                Du
                Hallo
                <br></br>Du
                Hallo
                <br></br>Du
                Hallo
                <br />Du
                Hallo
                <br />
                Du
                <Button text="kk" style={{ color: this.state.color.self }} onclick={() => {
                    this.state.color.current="blue";
                    // _this.config({ text: "neu"+x++ });
                }}></Button>
                Ha



































            </span>

        </div>;
        return ret;
    }
}
function k() {
    this.a=9;
}
export function test() {
    var ob={};
    var o=k.bind(ob);
    o();
    var comp=new MyComp({ color: "green" });
    //   comp.config({ color: "red" });
    return comp;
}
