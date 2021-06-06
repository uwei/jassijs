var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs_editor/util/Typescript", "jassijs/base/Router"], function (require, exports, jassijs_1, Panel_1, Typescript_1, Router_1) {
    "use strict";
    var CodePanel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodePanel = void 0;
    let CodePanel = CodePanel_1 = class CodePanel extends Panel_1.Panel {
        resize() {
        }
        undo() {
        }
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
        getBreakpoints() {
            return undefined;
        }
        numberToPosition(pos) {
            return CodePanel_1.numberToPosition(this.file, pos, this.value);
            /*var ret = typescript.getLineAndCharacterOfPosition(this.file, pos);
            return {
                row: ret.line,
                column: ret.character
            };*/
        }
        static numberToPosition(file, pos, code) {
            if (code !== undefined)
                Typescript_1.default.setCode(file, code);
            var ret = Typescript_1.default.getLineAndCharacterOfPosition(file, pos);
            return {
                row: ret.line,
                column: ret.character
            };
        }
        positionToNumber(pos) {
            Typescript_1.default.setCode(this.file, this.value);
            var ret = Typescript_1.default.getPositionOfLineAndCharacter(this.file, {
                line: pos.row,
                character: pos.column
            });
            return ret;
        }
        static async getAutoimport(lpos, file, code) {
            //var lpos = this.positionToNumber(this.cursorPosition);
            //@ts-ignore
            var change = await Typescript_1.default.getCodeFixesAtPosition(file, code, lpos, lpos, [2304]);
            if (change === undefined)
                return;
            for (let x = 0; x < change.length; x++) {
                if (change[x].changes[0].textChanges[0].newText === "const ") {
                    change.splice(x, 1);
                }
            }
            if (change.length > 0) {
                var entr = change[0].changes[0].textChanges[0];
                let insertPos = CodePanel_1.numberToPosition(file, entr.span.start, code);
                insertPos.row = insertPos.row - 1;
                //Bug duplicate insert {Kunde,Kunde}
                if (entr.newText.indexOf(",") > -1) {
                    var thisline = code.substring(1 + code.lastIndexOf("{", entr.span.start), code.indexOf("}", entr.span.start));
                    thisline = "*" + thisline.replaceAll(" ", "*").replaceAll("}", "*").replaceAll(",", "*") + "*";
                    var cl = entr.newText.split(",")[0];
                    if (thisline.indexOf("*" + cl + "*") > 0) {
                        return;
                    }
                }
                //relative to absolute
                var words = entr.newText.split("\"");
                var oldPath = words[1];
                var path = file.split("/");
                path.splice(-1, 1); //remove last
                if (oldPath !== undefined && oldPath.startsWith(".")) { //convert relative to absolute
                    if (oldPath.startsWith("./"))
                        oldPath = oldPath.substring(2);
                    while (oldPath.startsWith("../")) {
                        oldPath = oldPath.substring(3);
                        path.splice(-1, 1);
                    }
                    var newPath = "";
                    for (let x = 0; x < path.length; x++) {
                        newPath = newPath + path[x] + "/";
                    }
                    newPath = newPath + oldPath;
                    return {
                        text: words[0] + "\"" + newPath + "\"" + words[2],
                        pos: insertPos
                    };
                    //  this.insert(this.positionToNumber(insertPos), words[0] + "\"" + newPath + "\"" + words[2]);
                }
                else {
                    return {
                        text: entr.newText,
                        pos: insertPos
                    };
                    //this.insert(this.positionToNumber(insertPos), entr.newText);
                }
                // typescript.setCode(this.file, this.value);
            }
            return undefined;
        }
        /**
             * goes to the declaration under cursor
             */
        gotoDeclaration() {
            var pos = this.positionToNumber(this.cursorPosition);
            var test = this.numberToPosition(pos);
            if (!Typescript_1.default.isInited(this.file)) {
                $.notify("please try later ... loading in progress", "info", { position: "bottom right" });
                return;
            }
            Typescript_1.default.getDefinitionAtPosition(this.file, pos).then((def) => {
                var _a;
                if (def !== undefined && def.length > 0) {
                    var entr = def[0];
                    var file = (_a = entr.fileName) === null || _a === void 0 ? void 0 : _a.replace("file:///", "");
                    var p = entr.textSpan.start;
                    var newPos = CodePanel_1.numberToPosition(file, p, undefined);
                    var line = newPos.row;
                    Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
                }
            });
        }
    };
    CodePanel = CodePanel_1 = __decorate([
        jassijs_1.$Class("jassijs_editor.CodePanel")
    ], CodePanel);
    exports.CodePanel = CodePanel;
});
//# sourceMappingURL=CodePanel.js.map
//# sourceMappingURL=CodePanel.js.map