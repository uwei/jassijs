import {NumberConverter} from "jassi/ui/converters/NumberConverter";
import {Textbox} from "jassi/ui/Textbox";
import { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { User } from "jassi/remote/security/User";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView, DBObjectViewMe, $DBObjectView } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";

type Me = {
	textbox1?:Textbox,
	textbox2?:Textbox
}&DBObjectViewMe

@$DBObjectView({classname:"jassi.security.User"})
@$Class("jassi/UserView")
export class UserView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: User;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "User" : "User " + this.value.email;
    }
    layout(me: Me) {
        me.textbox1=new Textbox();
	    me.textbox2=new Textbox();
    	this.add(me.textbox1);
    	this.add(me.textbox2); 
    	me.textbox1.bind(me.databinder,"id");
    	me.textbox1.width=40;
    	me.textbox1.converter=new NumberConverter();
    	me.textbox2.bind(me.databinder,"email");
    }
	createObject():any{
		super.createObject();
		this.value.password=Math.random().toString(36).slice(-8);//random password
		$.notify( "random password set: "+this.value.password,"info",{position:"right"});
		console.log("random password set: "+this.value.password);
	}
}

export async function test(){
	var ret=new UserView();
	
	ret["value"]=<User>await User.findOne();
	return ret;
}