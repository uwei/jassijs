import { $ActionProvider, $Action } from "jassi/base/Actions";
import { $Class } from "remote/jassi/base/Jassi";
import { FileNode } from "remote/jassi/base/FileNode";
import { OptionDialog } from "jassi/ui/OptionDialog";
import { FileExplorer, FileActions } from "jassi/ui/FileExplorer";
import { Server } from "remote/jassi/base/Server";
import { router } from "jassi/base/Router";
import { Property, $Property } from "jassi/ui/Property";
import { DBObject } from "remote/jassi/base/DBObject";
import { classes } from "remote/jassi/base/Classes";
import registry from "remote/jassi/base/Registry";
const code=`import { $Class } from "remote/jassi/base/Jassi";
import {Panel} from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { {{dbclassname}} } from "{{dbfilename}}";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"{{fulldbclassname}}"})
@$Class("{{fullclassname}}")
export class {{dialogname}} extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: {{dbclassname}};
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "{{dialogname}}" : "{{dialogname}} " + this.value.id;
    }
    layout(me: Me) {
    }
}

export async function test(){
	var ret=new {{dialogname}};
	
	ret["value"]=<{{dbclassname}}>await {{dbclassname}}.findOne();
	return ret;
}`;
@$Class("jassi.ui.TemplateDBDialogProperties")
export class TemplateDBDialogProperties {
	@$Property({decription:"name of the dialog"})
	dialogname:string;
	@$Property({type:"classselector", service:"$DBObject"})
    dbobject:DBObject;
}
@$ActionProvider("jassi.base.FileNode")
@$Class("jassi.ui.TemplateDBDialog")
export class TemplateDBDialog {
	static code:string=code;
    @$Action({
        name: "New/DBDialog",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFile(all: FileNode[]) {
		var props=new TemplateDBDialogProperties();
        var res = await OptionDialog.askProperties("Create new DBDialog:",props, ["ok", "cancel"],undefined,false);
        if (res.button === "ok" ) {
	    	var scode=code.replaceAll("{{dialogname}}",props.dialogname);
	    	var fulldbclassname= classes.getClassName(props.dbobject);
	    	var shortdbclassname=fulldbclassname.split(".")[fulldbclassname.split(".").length-1];
	    	var dbfilename=await registry.getJSONData("$Class",fulldbclassname)[0].filename;
	    	dbfilename=dbfilename.substring(0,dbfilename.length-3);
	    	scode=scode.replaceAll("{{fullclassname}}",(all[0].fullpath+"/"+props.dialogname).replaceAll("/","."));
	    	scode=scode.replaceAll("{{dbclassname}}",shortdbclassname);
	    	scode=scode.replaceAll("{{fulldbclassname}}",fulldbclassname);
	    	scode=scode.replaceAll("{{dbfilename}}",dbfilename);
	    
	    	FileActions.newFile(all,props.dialogname+".ts",scode,true);
        }
    }
}


