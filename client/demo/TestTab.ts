
import { $Class } from "jassijs/remote/Jassi";
import { classes } from "jassijs/remote/Classes";
import { $ActionProvider } from "jassijs/base/Actions";
import {Panel} from "jassijs/ui/Panel";
import {HTMLPanel} from "jassijs/ui/HTMLPanel";
import {Button} from "jassijs/ui/Button";

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