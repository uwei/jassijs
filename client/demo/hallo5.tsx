import { Component, ComponentProperties, createComponent, React } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { createRefs, createState, createStates, State } from "jassijs/ui/State";
interface Me {
    button?: Button;
    colorState?: State<string>;
}
interface Prop extends ComponentProperties {
    color;
}
var x = 1;
class MyComp extends Component<Prop> {
    me: Me;
    constructor(p: Prop) {
        super(p);
    }
    render() {
        this.me = {};
        var me = createRefs<Me>(this.me);
        //        var color: State|any = new State("red");
        //var ret = <div calculateState={calculateState}> 
        if (this.props.color === undefined)
            this.states.color.current = "yellow";
        //{me.states.colorState}  
        var ret = <div> 
                
                
                <Button ref={me.refs.button} text="kk" style={{ color: this.states.color.self }} onclick={() => {
                this.states.color.current = "blue";
                me.button.text = "oo";
                // _this.config({ text: "neu"+x++ });
            }}>
                </Button>Haello
        
                ggg
                <span>kkkk</span>
           
        </div>;
        return ret;
    }
}
function k() {
    this.a = 9;
}
export function test() {
    var ob = {};
    var o = k.bind(ob);
    o();
    var comp = new MyComp({ color: "green" });
    //   comp.config({ color: "red" });
    return comp;
}
