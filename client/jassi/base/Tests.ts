import { $Class } from "jassi/remote/Jassi";
import { $ActionProvider, $Action } from "jassi/base/Actions";
import { FileNode } from "jassi/remote/FileNode";
import typescript, { Typescript } from "jassi_editor/util/Typescript";
import { Component } from "jassi/ui/Component";
import { Container } from "jassi/ui/Container";
import { BoxPanel } from "jassi/ui/BoxPanel";
import windows from "jassi/base/Windows";
import { HTMLPanel } from "jassi/ui/HTMLPanel";



@$ActionProvider("jassi.base.FileNode")
@$Class("jassi.ui.TestAction")
export class TestAction {
    @$Action({
        name: "Test"
    })
    static async testNode(all: FileNode[],container:Container=undefined) {
    	//var isRoot=false;
    	if(container===undefined){
    		container=new BoxPanel();
    		windows.add(container,"Tests");
    	//	isRoot=true;
    	}
        for (var x = 0;x < all.length;x++) {
            var file = all[x];
            if (file.isDirectory()) {
                await TestAction.testNode(file.files,container);

            } else {
                await typescript.initService();
                var text: string = typescript.getCode(file.fullpath);
                if (text !== undefined) {
                    text = text.toLowerCase();
                    console.log("test " + file.fullpath);
                    if (text.indexOf("export function test(") !== -1 || text.indexOf("export async function test(") !== -1) {
                        var func = (await import(file.fullpath.substring(0, file.fullpath.length - 3))).test;
                        if(typeof func==="function"){
							var ret = await func(new Test());
							if (ret instanceof Component) {
								$(ret.dom).css({position:"relative"});
								ret.width=400;
								var head=new HTMLPanel();
								head.value="<b>"+file.fullpath+"</b>";
								container.add(head);
                                container.add(ret);
                            }
                        }
                    }
                }
            }
        }
       // if(isRoot&&container._components.length>0){
        	
      //  }
    }
}

@$Class("jassi.base.Test")
export class Test {
	/**
	 * fails if the condition is false
	 * @parameter condition 
	 **/
    expectEqual(condition: boolean) {
        if (!condition)
            throw new Error("Test fails");
    }
    /**
     * fails if the func does not throw an error
     * @parameter func - the function that should failed
     **/
    expectError(func) {
        try {

            if (func.toString().startsWith("async ")){
                var errobj;
                try {
                    throw new Error("test fails");
                } catch (err) {
                    errobj = err;
                }
                func().then(() => {
                    throw errobj;
                }).catch((err) => {
                    if (err.message === "test fails")
                        throw errobj;
                    var k = 1;//io
                });
                return;
            }else {
                func();
            }
        } catch{
            return;//io
        }
        throw new Error("test fails");
    }
}
export class Tests {

}


