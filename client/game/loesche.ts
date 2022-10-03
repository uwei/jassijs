import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";

type Me = {
}

@$Class("game/loesche")
export class loesche extends Panel {
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
	var ret=new loesche();
	return ret;
}