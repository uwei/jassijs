import { Panel } from "jassi/ui/Panel";
import { Textbox } from "jassi/ui/Textbox";
import { Server } from "jassi/remote/Server";
import jassi from "jassi/jassi";
var systemFonts= ["Arial","Helvetica Neue","Courier New","Times New Roman","Comic Sans MS","Impact"];

export function test(){
	var h=Server["isonline"];
	var font="Bebas Neue";
	//loadFontIfNedded(font);	
	var pan=new Panel();
	var tb=new Textbox();
	tb.value="AHallo";
	console.log(tb._id);

	
	tb.css({
		font_family:font
	})
		pan.add(tb);
		return pan;
}