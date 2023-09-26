import { Component, ComponentCreateProperties, HTMLComponent } from "jassijs/ui/Component";


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
    var ret:HTMLComponent=<div>
                <div style={{display:"inline", minWidth:"5px",minHeight:"2px"}}></div>
                <div style={{borderStyle:"ridge",borderWidth:"5px"}}>
                <div style={{display:"inline", minWidth:"5px",minHeight:"2px"}}></div>
                    <button>hall</button>
                <div style={{display:"inline", minWidth:"5px",minHeight:"2px"}}></div>
                    <button>hall</button>
                <div style={{display:"inline", minWidth:"5px",minHeight:"2px"}}></div>
                    <button>hall</button>
                <div style={{display:"inline", minWidth:"5px",minHeight:"2px"}}></div>
                </div>
                <div style={{minWidth:"5px",minHeight:"2px"}}></div>
                <div>
                    <span>&nbsp;</span>
                    <button>hall</button>
                    <span>&nbsp;</span>
                    <button>hall</button>
                    <span>&nbsp;</span>
                    <button>hall</button>
                    <span>&nbsp;</span>
                </div>
                <span>&nbsp;</span>
                
            </div>
    ret.domWrapper.contentEditable="true"
    return ret;
}