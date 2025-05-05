import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { TextComponent } from "jassijs/ui/Component";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Component,ComponentProperties,createComponent,HTMLComponent,React } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { createState,createStates,State } from "jassijs/ui/State";
interface Props {
}
function KK(props: Props) {
    return <div>
        <Panel>
            ddddd
        </Panel>
        <HTMLPanel value="dfgdfg"></HTMLPanel>
        sdfsdf
        <br />

        <button>d sdfss</button>

        a
        dddddsdfsdf
        <button label="ff">


            fsdfg
            x
            d
            a
        </button>

        <br />
        <div></div>
aa

        <table>

            <tr>

                <td>ljkv
                    bnvbdnvbnj</td>
                <td>lj</td>
                <td>g4</td>
            </tr>
            <tr>
                <td>vvv       </td>
                <td>  sad</td>
                <td>g4</td>
            </tr>
            <tr>
                <td>vvv   </td>
                <td>  sad</td>
                <td></td>
            </tr>


        </table>
        bb
        ghgd b ggggg f d
        dd

        s

        df d
        d
        s
        d
        d
        <Panel>
        </Panel>
        d
        <Panel>
        </Panel>

    </div>;
}
export function test() {
    var comp=createComponent(<KK></KK>);
    //   comp.config({ color: "red" });
    return comp;
}
