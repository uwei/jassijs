import { createState, createStates, State, States } from "jassijs/ui/State";
import { createComponent, React } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";

export interface MyCompProp{
    mycolor?:string;
    mytext?:string;
    
}

export function MyComp(props:MyCompProp,states:States<MyCompProp>=undefined){
    
   

    return <Panel>
        <input value={states.mytext} />
        <input value={states.mytext} />
        <span>Hallo</span>
        <button style={{ color: states.mycolor }} onClick={() => {
            //  alert(8);
            states.mycolor.current="blue";
            states.mytext.current="oo";
        }} >dfgdfg</button>

    </Panel>;
}
export function test() {

           // calculateState
    
    var ret = <MyComp mycolor="yellow" mytext="Top"></MyComp>

    var comp = createComponent(ret);
    comp.config({mycolor:"red"});
    return comp;
}
