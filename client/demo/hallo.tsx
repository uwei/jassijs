
import { Button } from "jassijs/ui/Button";
import { Panel } from "jassijs/ui/Panel";

function j(){

}

export function test(){
    var h=9; 
  /*  return <div style={{color:"green"}}>
        hallo
</div>;*/ 
    var ret=<button style={{color:"red"}} onClick={()=>alert(8)} >Hallo</button>;
    
    return ret;
}