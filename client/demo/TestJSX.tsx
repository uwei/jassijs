import { createComponent, React } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Calendar } from "jassijs/ui/Calendar";
import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Table } from "jassijs/ui/Table";
import { Menu } from "jassijs/ui/Menu";
import { MenuItem } from "jassijs/ui/MenuItem";
import { ContextMenu } from "jassijs/ui/ContextMenu";

function MyTest() {
    /*
      
    */
    var check = { current: undefined };
    var values = [{ name: "Meier", vorname: "Max" }, { name: "Lehner", vorname: "Felix" }]
   // 
           //
    /*
     
    */
    var contextmenu={ current: undefined };
    return <Panel>

        <BoxPanel label="BoxPanel" horizontal={true} >
            <Button label="Button" text="Hi" onclick={() => { check.current.value = true; }} /><br />
            <Calendar label="Calendar"></Calendar>
            <Textbox label="Textbox" value="Hi"></Textbox>
            <Checkbox ref={check} label="Checkbox" text="Check" value={true}></Checkbox>
        </BoxPanel> 
        <Table items={values}></Table>
       <ContextMenu ref={contextmenu}> 
                 <MenuItem text="Menuitem2" onclick={()=>alert(8)}> </MenuItem>
                 <MenuItem text="Menuitem2" onclick={()=>alert(8)}> </MenuItem>
        
               
        </ContextMenu>
        <Button text="with Contextmenu" contextMenu={contextmenu}></Button>
    </Panel>
}
export function test() {
    var ret = MyTest();

    return createComponent(ret);
}