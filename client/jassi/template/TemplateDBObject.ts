import { $Class } from "jassi/remote/Jassi";
import { $Property } from "jassi/ui/Property";
import { $ActionProvider, $Action } from "jassi/base/Actions";
import { DBObject } from "jassi/remote/DBObject";
import { FileNode } from "jassi/remote/FileNode";
import { OptionDialog } from "jassi/ui/OptionDialog";
import { classes } from "jassi/remote/Classes";
import registry from "jassi/remote/Registry";
import { FileActions } from "jassi/ui/FileExplorer";
import { TemplateDBDialog } from "jassi/template/TemplateDBDialog";

var code=`import {DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany,JoinColumn,JoinTable } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";


@$DBObject()
@$Class("{{fullclassname}}")

export class {{classname}} extends DBObject {

    {{PrimaryAnnotator}}
    id: number;
  
    constructor() {
        super();
    }
}


export async function test() {
};`;

@$Class("jassi.ui.TemplateDBDialogProperties")
export class TemplateDBObjectProperties {
	@$Property({decription:"name of the db class"})
	name:string;
	@$Property({default:"true",description:"the primary column alue will be automatically generated with an auto-increment value"})
    autogeneratedid:string;
}
@$ActionProvider("jassi.remote.FileNode")
@$Class("jassi.ui.TemplateDBObject")
export class TemplateDBObject {
	static code:string=code;
    @$Action({
        name: "New/DBObject",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory()&&all[0].fullpath.startsWith("remote/");
        }
    })
    static async newFile(all: FileNode[]) {
		var props=new TemplateDBObjectProperties();
        var res = await OptionDialog.askProperties("Create Database Class:",props, ["ok", "cancel"],undefined,false);
        if (res.button === "ok" ) {
	    	var scode=TemplateDBObject.code.replaceAll("{{fullclassname}}",all[0].fullpath+"/"+props.name);
	    	scode=scode.replaceAll("{{classname}}",props.name);
	    	var anno="@PrimaryColumn()";
	    	if(props.autogeneratedid)
	    		 anno="@PrimaryGeneratedColumn()";
	    	scode=scode.replaceAll("{{PrimaryAnnotator}}",anno);

	    	FileActions .newFile(all,props.name+".ts",scode,true);
        }
    }
}


