import { Component, ComponentCreateProperties } from "jassijs/ui/Component";


function j(){
 
}
interface Prop{
    name?:string;
}

class TC extends Component<Prop>{
    constructor(prop:Prop){
       super(prop);
    }
    render():JSX.Element{
        return <div>{this.props.name}</div>;
    }
}

function TC2(data:Prop){
return <div>{data.name}</div>;
}

export function test(){ 
   
  /*  return <div style={{color:"green"}}>
        hallo
</div>;*/ 
   // var ret=<button style={{color:"red"}} onClick={()=>alert(8)} >Hallo</button>;
    var ret=<span><TC name="Hallo"></TC>;<TC2 name="Hallo2"></TC2> </span>

    return ret;
}