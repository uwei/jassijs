import { Panel } from "jassijs/ui/Panel";
import { Textbox } from "jassijs/ui/Textbox";
import { Server } from "jassijs/remote/Server";
import jassi from "jassijs/jassi";
import { AR } from "de/remote/AR";
import { ARZeile } from "de/remote/ARZeile";
import { Transaction } from "jassijs/remote/Transaction";
import { Kunde } from "de/remote/Kunde";
var systemFonts= ["Arial","Helvetica Neue","Courier New","Times New Roman","Comic Sans MS","Impact"];

export async  function test(){
	 let test=new Kunde();
    Kunde.prototype= Object.create(Kunde.prototype, {
	setPosition: {
		value: function() {
		//... etc
		},
		writable: true,
		enumerable: true,
		configurable: true
	}});
    for(var key in test) {
        console.log(key);
    }
}