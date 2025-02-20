import { $Class } from "jassijs/remote/Registry";
import { Component, $UIComponent, ComponentProperties, jc } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { Container } from "jassijs/ui/Container";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { createState } from "jassijs/ui/State";




export class PlaceholderComponentNotExists extends Component {
    inactiveNode: React.ReactNode;
    constructor(properties) {
        super();
        this.dom = <any>document.createComment("ExistsIfTest");
        this.domWrapper = this.dom;
    }
    render() {

        return undefined;
    }
}

export async function test() {
    var stateExists = createState<boolean>(false);
    var stateText = createState<string>("Haa");
    var ret = new Panel();
    var e = new Button({
        text: stateText.self, onclick: () => {
            stateExists.current = true
        }
    });
    ret.add(e);
    var e2 = new Button({
        text: stateText.self, exists: stateExists.self,
        onclick: () => { 
            stateText.current="kkk";
            e2.forceUpdate();
        }
    }
    );
    ret.add(e2);
    var e3 = new Button({
        text: "hide", onclick: () => {
            debugger;
            stateExists.current = false;

            stateText.current = "textneu";
        }
    });
    ret.add(e3);
    return ret;
}