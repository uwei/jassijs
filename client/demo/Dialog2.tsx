import { Textbox } from "jassijs/ui/Textbox";
import { TextComponent } from "jassijs/ui/Component";
import { Button } from "jassijs/ui/Button";
import { Checkbox } from "jassijs/ui/Checkbox";
import { HTMLComponent,createComponent } from "jassijs/ui/Component";
import { ComponentProperties,SimpleComponentProperties } from "jassijs/ui/Component";
import { States,createRefs } from "jassijs/ui/State";
type Refs={};
interface Dialog2Properties extends SimpleComponentProperties {
    sampleProp?: string;
}
function Dialog2(props: Dialog2Properties,states: States<Dialog2Properties>) {
    var refs: Refs=createRefs();
    return <div><Checkbox text="errt"></Checkbox>Hallo
        <br />
        sdfasdfsdf
        <span style={{ "color": "green","fontSize": "18px" }}>sadfasdfasdf
        </span>


        <Textbox label="sdafsdf"></Textbox>
        asd</div>;
}
export function test() {
    var ret=<Dialog2 sampleProp="jj"></Dialog2>;
    var comp=createComponent(ret);
    return comp;
}
