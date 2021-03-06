
import { $Class } from "jassi/remote/Jassi";
import { classes } from "jassi/remote/Classes";
import { $ActionProvider } from "jassi/base/Actions";
import {Panel} from "jassi/ui/Panel";
import {HTMLPanel} from "jassi/ui/HTMLPanel";
import {Button} from "jassi/ui/Button";

@$ActionProvider("3")
@$Class("de.KK3")
export class KK3{
	 
}
@$ActionProvider("4")
@$Class("de.KK4")
export class KK4{
	
}

export function test(){
	var pan=new Panel();
	//pan.tooltip="Pan";
	pan.width="100%";
	pan.height="100%";
	var div=new HTMLPanel();
	div.value="Hallo";
	div.height=50;
	div.tooltip="div";
	pan.add(div);
	var button=new Button();
	button.tooltip="But";
	button.text="Button";
	pan.add(button);
	return pan;
}