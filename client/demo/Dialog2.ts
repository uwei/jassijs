import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";

type Me = {
}

@$Class("demo/Dialog2")
export class Dialog2 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        this.config({});
	}
}

export async function test(){
	var ret=new Dialog2();
	return ret;
}