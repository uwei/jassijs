import { ContextMenu } from "jassijs/ui/ContextMenu";
import { Menu } from "jassijs/ui/Menu";
import { MenuItem } from "jassijs/ui/MenuItem";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { createComponent } from "jassijs/ui/Component";
import { createRef, createRefs, createState } from "jassijs/ui/State";
var cm=createRef<ContextMenu>();
var refs=createRefs<{cm:ContextMenu}>();
function MyContextMenuTest(props={}) {
    return <Panel>
        <Button  contextMenu={cm} text="btHall" ></Button>
        <ContextMenu ref={cm}>
            <MenuItem text="Hallo"></MenuItem>
            <MenuItem text="Hallo2"></MenuItem>
        </ContextMenu>

        <Button  contextMenu={refs.cm} text="btHal2" ></Button>
        <ContextMenu ref={refs.cm}>
            <MenuItem text="Hallo4"></MenuItem>
            <MenuItem text="Hallo3"></MenuItem>
        </ContextMenu>
    </Panel>;
}
export async function test() {
    // kk.o=0;
    var dlg=createComponent(<MyContextMenuTest></MyContextMenuTest>);

    // debugger;
    return dlg;
}
