import { HTMLComponent } from "jassijs/ui/Component";
import { TextComponent } from "jassijs/ui/Component";
import { createComponent,React } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
export function test() {
    /*var ret=<Panel height="153">
        <button width="202" contentEditable="false" style={{ color: "red" }} height="42">hall</button>
        <Button text="sdfsdfsdf"></Button>
        dddd
    </Panel>;
   */
    /*  def
         <Button></Button>
         <br />
 
         <Textbox value={"AA"}></Textbox>
         <Textbox value="fffrr3"></Textbox>
 
         <Panel height={400} width={295}>
             <Button></Button>
             <Textbox value="fffrr3" width={90}></Textbox>
         </Panel>*/
    /*
   var bt=new Button();
   bt.onclick(()=>ret.tag="u");
   bt.text="Hallo"
   var ret= new HTMLComponent();
   ret.add(bt);
   ret.add(new TextComponent({text:"Hallo" }))
   return ret;
   */
    var ret=<Panel>h a
        <button>Hhhhd</button>
        d

        fsdf
        <u>sdfsdfsdf</u>ka da
        <br />dd
        <br />
        ddddd
        <br />
        asdfa
        <br />
        asdfasdfasdf
        <br />
        asdf

        asdf






        <br />



        <br />
    </Panel>;
    var comp=createComponent(ret);
    return comp;
}
