import { Panel } from "jassi/ui/Panel";
import { Textbox } from "jassi/ui/Textbox";
import { Server } from "jassi/remote/Server";
import jassi from "jassi/jassi";
import { AR } from "de/remote/AR";
import { ARZeile } from "de/remote/ARZeile";
import { Transaction } from "jassi/remote/Transaction";
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