import { HTMLComponent,createComponent } from "jassijs/ui/Component";
import { ComponentProperties,SimpleComponentProperties } from "jassijs/ui/Component";
import { States,createRefs } from "jassijs/ui/State";
type Refs={};
interface DialogProperties extends SimpleComponentProperties {
    sampleProp?: string;
}
function Dialog1(props: DialogProperties,states: States<DialogProperties>) {
    var refs: Refs=createRefs();
    return <div>{states.sampleProp}</div>;
}
export function test() {
    var ret=<Dialog1 sampleProp="jj"></Dialog1>;
    var comp=createComponent(ret);
    return comp;
}
