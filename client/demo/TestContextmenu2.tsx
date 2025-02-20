import { ContextMenu } from "jassijs/ui/ContextMenu";
import { Menu } from "jassijs/ui/Menu";
import { MenuItem } from "jassijs/ui/MenuItem";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { createComponent,createRef } from "jassijs/ui/Component";
import { createState } from "jassijs/ui/State";
var cm=createState<ContextMenu>();
var bt=createState<Button>();
function MyContextMenuTest(props={}) {
    return <Panel>
        <Button ref={bt} contextMenu={cm} text="btHall" ></Button>
        <ContextMenu ref={cm}>
            <MenuItem text="Hallo"></MenuItem>
            <MenuItem text="Hallo2"></MenuItem>
        </ContextMenu>
    </Panel>;
}
export async function test() {
    // kk.o=0;
    var dlg=createComponent(<MyContextMenuTest></MyContextMenuTest>);

    // debugger;
    return dlg;
}
