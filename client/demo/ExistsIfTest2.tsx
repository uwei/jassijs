import { States } from "jassijs/ui/State";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { createComponent } from "jassijs/ui/Component";
 

interface MyTestProp{
    showexists?:boolean;
    text?:string;
}
/*
function MyTest2(prop:MyTestProp,states:States<MyTestProp>=undefined) {
   return <Panel>
   <Button text="show" onclick={()=>{ states.showexists.current=true }}></Button>
    <Button text="HalloButton" exists={states.showexists}></Button>
      <Button text="HalloButton" exists={states.showexists}></Button>
    <span exists={states.showexists}>HalloSpan</span>
      <Panel  exists={states.showexists} label="Panel">Hallo</Panel>

    <Button text="hide" onclick={()=>{ states.showexists.current=false }}></Button>
    </Panel>
}*/
function MyTest2(prop:MyTestProp,states:States<MyTestProp>=undefined) {
   return <Panel>
   <Button text="show" onclick={()=>{ 
    
    states.showexists.current=true }}></Button>

     <Panel    exists={states.showexists}  label="Panel">HalloPanel</Panel>
     <div    exists={states.showexists}  >HalloDiv</div>
  
     <Button text="HalloButton" exists={states.showexists}></Button>


    <Button text="hide" onclick={()=>{ 
      
      states.showexists.current=false ;
      }}></Button>
    </Panel>
}
export function test() { 
    var ret = <MyTest2 showexists={false}></MyTest2>
     return createComponent(ret); 
 //      <Button text="show" onclick={()=>{ states.exists.current=true }}> </Button>
  //      <Button text="hide" onclick={()=>{ states.exists.current=true }}> </Button>
//    //<Button text="hello" exists={states.exists} > </Button>
    
}