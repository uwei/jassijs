import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import typescript from "jassi_editor/util/Typescript";
import { router } from "jassi/base/Router";

@$Class("jassi_editor.CodePanel")
export abstract class CodePanel extends Panel {
    file: string;


    resize() {

    }
    undo() {

    }
    abstract set mode(mode: string);
    abstract get mode(): string;
    abstract set value(value: string);
    abstract get value(): string;
    /**
     * breakpoint changed
     * @param {function} handler - function(line,enabled,type)
     */
    onBreakpointChanged(handler) {
        this.addEvent("breakpointChanged", handler);
    }

    /**
    * gets a list of all lines with breakpoint
    * @returns {Object.<number, boolean>}
    */
    getBreakpoints(): { [line: number]: boolean } {
        return undefined;
    }
    public numberToPosition(pos: number): { row: number, column: number } {
		return CodePanel.numberToPosition(this.file,pos,this.value);
        /*var ret = typescript.getLineAndCharacterOfPosition(this.file, pos);
        return {
            row: ret.line,
            column: ret.character
        };*/
    }
    public static numberToPosition(file:string,pos: number,code:string): { row: number, column: number } {
		if(code!==undefined)
    		typescript.setCode(file,code);
        var ret = typescript.getLineAndCharacterOfPosition(file, pos);
        return {
            row: ret.line,
            column: ret.character
        };
    }
    public positionToNumber(pos: { row: number, column: number }): number {
    	typescript.setCode(this.file,this.value);
        var ret = typescript.getPositionOfLineAndCharacter(this.file, {
            line: pos.row,
            character: pos.column
        });
        return ret;
    }
    public static async getAutoimport(lpos:number,file:string,code:string):Promise<{text:string,pos:{ row: number, column: number }}> {
       
        //var lpos = this.positionToNumber(this.cursorPosition);
        //@ts-ignore
        var change=await typescript.getCodeFixesAtPosition(file, code, lpos, lpos, [2304]);
            if (change === undefined)
                return;
            for (let x = 0;x < change.length;x++) {
                if (change[x].changes[0].textChanges[0].newText === "const ") {
                    change.splice(x, 1);
                }
            }
            if (change.length > 0) {
                var entr = change[0].changes[0].textChanges[0];
                let insertPos = CodePanel.numberToPosition(file,entr.span.start,code);
                insertPos.row = insertPos.row - 1;
                //Bug duplicate insert {Kunde,Kunde}
                if (entr.newText.indexOf(",")>-1) {
                    var thisline = code.substring(1 + code.lastIndexOf("{", entr.span.start), code.indexOf("}", entr.span.start));
                    thisline="*"+thisline.replaceAll(" ","*").replaceAll("}","*").replaceAll(",","*")+"*";
                    
                    var cl = entr.newText.split(",")[0];
                    if (thisline.indexOf("*"+cl+"*")>0) {
                        return;
                    }
                }

                //relative to absolute
                var words = entr.newText.split("\"");
                var oldPath: string = words[1];

                var path = file.split("/");
                path.splice(-1, 1);//remove last
                if (oldPath !== undefined && oldPath.startsWith(".")) {//convert relative to absolute
                    if (oldPath.startsWith("./"))
                        oldPath = oldPath.substring(2);
                    while (oldPath.startsWith("../")) {
                        oldPath = oldPath.substring(3);
                        path.splice(-1, 1);
                    }
                    var newPath = "";
                    for (let x = 0;x < path.length;x++) {
                        newPath = newPath + path[x] + "/";
                    }
                    newPath = newPath + oldPath;
                    return {
                    	text:words[0] + "\"" + newPath + "\"" + words[2],
                    	pos:insertPos
                    }
                  //  this.insert(this.positionToNumber(insertPos), words[0] + "\"" + newPath + "\"" + words[2]);
                } else {
                	 return {
                    	text:entr.newText,
                    	pos:insertPos
                    }
                    //this.insert(this.positionToNumber(insertPos), entr.newText);
                }
               // typescript.setCode(this.file, this.value);
            }
            return undefined;

    }

    /**
   * @param {object} position - the current cursor position {row= ,column=}
   */
    abstract set cursorPosition(cursor: { row: number, column: number });

    abstract get cursorPosition(): { row: number, column: number };
    /**
         * goes to the declaration under cursor
         */
    gotoDeclaration() {
        var pos = this.positionToNumber(this.cursorPosition)
        var test = this.numberToPosition(pos);
        if (!typescript.isInited(this.file)) {
            $.notify("please try later ... loading in progress", "info", { position: "bottom right" });
            return;
        }
        typescript.getDefinitionAtPosition(this.file, pos).then((def) => {
            if (def !== undefined && def.length > 0) {
                var entr = def[0];
                var file = entr.fileName?.replace("file:///", "");
                var p = entr.textSpan.start;
                var newPos = CodePanel.numberToPosition(file,p,undefined);
                var line = newPos.row;
                router.navigate("#do=jassi_editor.CodeEditor&file=" + file + "&line=" + line);
            }

        });
    }
}