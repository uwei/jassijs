import { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";

type Me = {
}

@$Class("de/Dialog")
export class Dialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
	}
}

export async function test(){
	var ret=new Dialog();
	return ret;
}