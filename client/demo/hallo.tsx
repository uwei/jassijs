import { createState } from "jassijs/ui/State";
import { createComponent, React } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";

interface MyCompProp{
    mycolor?:string;
    mytext?:string;
    
}
export function MyComp(props:MyCompProp){
    
    var colorState=createState("green");
    var textState=createState("hallo");
    var calculateState=(props:MyCompProp)=>{
       
        if(props.mycolor)
            colorState.current=props.mycolor;
        if(props.mytext)
            textState.current=props.mytext;
    };
      //<Panel {{calculateState}}>
       // <Panel {...{calculateState}}>
    return <Panel calculateState={calculateState}>
        
        <input value={textState.self} />
        <input value={textState.self} />
        <button style={{ color: colorState.self }} onClick={() => {
            //  alert(8);
            colorState.current="blue";
            textState.current="oo";
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
