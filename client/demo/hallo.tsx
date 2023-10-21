import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { Component,ComponentProperties,createComponent,HTMLComponent,TextComponent } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Table } from "jassijs/ui/Table";
import { Textbox } from "jassijs/ui/Textbox";
/*
function j() {
}
interface Prop {
    name?: string;
}
function createDummy(): HTMLElement {
    function allowDrop(ev) {
        ev.preventDefault();
    }
    function drag(ev) {
        var child: HTMLElement=ev.target;
        ev.dataTransfer.setDragImage(child.nextSibling,20,20);
        ev.dataTransfer.setData("text",ev.target.id);
    }
    function drop(ev) {
        ev.preventDefault();
        var data=ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    }
    function keydown(ev) {
        console.log(ev);
    }
    var ret: HTMLComponent=<span className="designdummy" draggable="true" onDragStart={drag} onKeyDown={keydown} style={{
        verticalAlign: "text-top",display: "inline-block",
        minWidth: "8px",minHeight: "5px",backgroundColor: "red"
    }}>
    </span> as any;
    //ret.dom.removeEventListener("keydown", keydown);
    //    ret.dom.addEventListener("keydown", (ev)=>keydown(ev));
    ret.dom.classList.remove("jcomponent");
    return ret;
}
function correctdummy(node: HTMLElement) {
    for(var x=0;x<node.childNodes.length;x++) {
        var el=node.childNodes[x] as HTMLElement;
        if(x%2===0&&!el.classList?.contains("designdummy")) {
            el.parentNode.insertBefore(createDummy().dom,el);
        }
        if(x%2===1&&el.classList?.contains("designdummy")) {
            el.remove();
            x=x-1;
        }
        if(!el.classList?.contains("designdummy")) {
            correctdummy(el);
        }
    }
    if(node.childNodes.length===0||(node.childNodes[node.childNodes.length-1] as HTMLElement).classList?.contains("dummy")) {
        if(node.append!==undefined)
            node.append(createDummy());
    }
}
function keydown(ev) {
    console.log(ev);
    ev.preventDefault();
}
interface Prop {
    text?: string;
}*/
var x=1;
/*
class MyComp extends Component<Prop> {
    render() {
        var _this=this;
        var ret=<div>
            {this.props.text}
            <button onClick={() => {
                _this.config({ text: "neu"+x++ });
            }}>Click
            </button>
            Haello
            <span>kkkk</span>
        </div>;
        return ret;
    }
}*/
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
    var ret=<Panel height={100}>
      
       sddsf
        <button style={{color:"red"}}>dfgdfg</button>
dfg


    </Panel>;
    /*
      var ret=<span text="sss" height={15}>
      <button style={{ color: "blue" }}>Hallo2</button>
      Halo
          <u>unter
              <button>Hall1</button>
  
              ter
          </u>
          test
          <span>das
              <b>
                  fett
              </b>ist e
              <u>unter
  
                  
  
  
                  ter
  
              </u>in
  
  
              <Panel>
  
                  <button>Hallo2
                  </button>
              </Panel>
              Te
  
              st
              <br />
              <b>fe
  
                  tts
  
              </b>
          </span>
          <Button text="Hallo" domProperties={{ style: { color: "red" },onClick: () => alert(8) }}></Button>s
          <Button text="Hallo"></Button>
          a
          <br />
  
  
          <Button></Button>
  
  
          df
  
  
      </span>;*/
    /*<Panel>xyzdas



        istein

        test
        <Panel height={100}>Hallo
        </Panel>
        bcdefg


        Hallo</Panel>;*/
    /*<div>v
      sdfsdf
          <div style={{color:"blue"}}>
              sdfsdfsdf
          </div>sdfs
          <br />
          d
          <br />
  
  
  
          ssss
          <Table></Table>
  
      </div>;*/
    // var ret= <Button text="Hallo" ></Button>
    //
    //<MyComp text="sdfsdfddsdf"></MyComp>;
    var comp=createComponent(ret);
    return comp;
}
