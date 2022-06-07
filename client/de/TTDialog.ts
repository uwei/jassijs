import { $Class } from "jassijs/remote/Jassi";
import {Panel} from "jassijs/ui/Panel";

type Me = {
}

@$Class("de/TTDialog")
export class TTDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.config({});
	}
}

export async function test(){
	var ret=new TTDialog();
	return ret;
}