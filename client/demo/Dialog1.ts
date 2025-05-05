import { HTMLComponent } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { Component,ComponentProperties,SimpleComponentProperties,jc } from "jassijs/ui/Component";
import { Button } from "jassijs/ui/Button";
type Refs={
    sdf?: HTMLComponent;
};
interface DialogProperties extends SimpleComponentProperties {
    sampleProp?: string;
}
@$Class("demo/Dialog1")
export class Dialog1 extends Component<DialogProperties> {
    declare refs: Refs;
    constructor(props: DialogProperties={}) {
        super(props);
    }
    render() {
        return jc("div",{ children: [
            this.state.sampleProp,
            jc(Button)
        ],ref: this.refs.sdf });
    }
}
export async function test() {
    var ret=new Dialog1({ sampleProp: "jj" });
    return ret;
}
