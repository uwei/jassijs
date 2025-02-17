import { Panel } from "jassijs/ui/Panel";
import { Textbox } from "jassijs/ui/Textbox";
import { Button } from "jassijs/ui/Button";
import { createComponent } from "jassijs/ui/Component";
import { State, States, ccs, createComputedState, createState } from "jassijs/ui/State";

interface MyTestProp{
    text?:string;
}



function MyTest(prop:MyTestProp,states:States<MyTestProp>=undefined) {
    var computedState=createComputedState(()=>{
        return "Hallo "+states.text.current; 
    },states,states); {/*called if one of the states are changed*/}
    var num=createState(10);

    return <Panel>
        <span>{computedState}</span> 
        <Button text={states.text} onclick={()=>{ states.text.current="Max";num.current =5; }}>
        </Button>
        {ccs(()=>(10*num.current),num)} {/*called if states.text is changed* ccs is shortcut for createComputedState*/}
    </Panel>
}
export function test() {
    var ret = <MyTest text="Heinz">
    </MyTest>
 return createComponent(ret);

}