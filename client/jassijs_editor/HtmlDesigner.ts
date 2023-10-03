import { ComponentDesigner } from "jassijs_editor/ComponentDesigner";
import { $Class } from "jassijs/remote/Registry";
import { createComponent } from "jassijs/ui/Component";

@$Class("jassijs_editor.HtmlDesigner")
export class HtmlDesigner extends ComponentDesigner {

    constructor(){
        super();
        var _this=this;
        this._designPlaceholder.dom.addEventListener("keydown", (ev=>_this.keydown(ev)));
        this._designPlaceholder.dom.contentEditable="true";
    }
    private getParentList(node: Node, list: Node[]) {
        list.push(node);
        if (node !== <any>document)
            this.getParentList(<any>node.parentNode, list);
    }
     registerKeys() {
         return;
        var _this = this;
        this._codeEditor._design.dom.tabindex = "1";
        this._codeEditor._design.dom.addEventListener("keydown", function (evt) {
            if (evt.keyCode === 115 && evt.shiftKey) {//F4
                // var thiss=this._this._id;
                // var editor = ace.edit(this._this._id);
                _this.evalCode(true);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === 115) {//F4
                _this.evalCode(false);
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 90 && evt.ctrlKey) {//Ctrl+Z
                _this.undo();
            }
            if (evt.keyCode === 116) {//F5
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 46 || (evt.keyCode === 88 && evt.ctrlKey && evt.shiftKey)) {//Del or Ctrl X)
                _this.cutComponent();
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 67 && evt.ctrlKey && evt.shiftKey) {//Ctrl+C
                _this.copy();
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 86 && evt.ctrlKey && evt.shiftKey) {//Ctrl+V
                _this.paste();
                evt.preventDefault();
                return false;
            }
            if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey)/* && (evt.which == 19)*/) {//Str+s
                _this.save();
                event.preventDefault();
                return false;
            }

        });
    }
    private deleteNodeBetween(node1: Node, node2: Node) {
        var list1 = [];
        var list2 = [];
        this.getParentList(node1, list1);
        this.getParentList(node2, list2);
        var pos = 0;
        var test = list1[pos];
        while (list2.indexOf(list1[pos]) === -1) {
            pos++;
        }
        var par1 = list1[pos - 1];
        var par2 = list2[list2.indexOf(list1[pos]) - 1];
        var todel = par1.nextSibling;
        while (todel !== par2) {
            var del = todel;
            todel = todel.nextSibling;
            del.remove();
        }

    }
    editDialog(enable) {
        super.editDialog(enable);
    }
    createDragAndDropper() {
        return undefined;
    }
    private removeNode(from: Node, frompos: number, to: Node, topos: number) {
        if (from === to) {
            var neu = to.textContent;
            to.textContent = neu.substring(0, frompos) + "" + neu.substring(topos);
        } else {
            this.deleteNodeBetween(from, to);
            from.textContent = from.textContent.substring(0, frompos);
            to.textContent = to.textContent.substring(topos);
        }
        var range = document.createRange();
        var selection = getSelection();
        range.setStart(from, frompos);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    private keydown(e: KeyboardEvent) {
        var sel = document.getSelection();
        var position = sel.anchorNode.compareDocumentPosition(sel.focusNode);
        var anchorNode = sel.anchorNode;
        var anchorOffset = sel.anchorOffset;
        var focusNode = sel.focusNode;
        var focusOffset = sel.focusOffset;


        // selection has wrong direction
        if (!position && sel.anchorOffset > sel.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
            anchorOffset = sel.focusOffset;
            anchorNode = sel.focusNode;
            focusNode = sel.anchorNode;
            focusOffset = sel.anchorOffset;
        }

        if (e.keyCode === 13) {
            e.preventDefault();

            var old = anchorNode.textContent;
            var node = anchorNode;
            var v1 = old.substring(0, anchorOffset);
            var v2 = old.substring(focusOffset);
            node.textContent = v2;
            var enter = node.parentNode.insertBefore(document.createElement("br"), node);
            var textnode = enter.parentNode.insertBefore(document.createTextNode(v1), enter);
            return;
        }
        if (e.code === "Delete") {
            e.preventDefault();
            if (anchorNode === focusNode && anchorOffset === focusOffset) {//no selection
                (<any>sel).modify("extend", "right", "character");
                var newsel = document.getSelection();
                this.removeNode(anchorNode, anchorOffset, newsel.focusNode, newsel.focusOffset);
            } else {
                this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
            }
            return;
        }

        if (e.code === "Backspace") {
            e.preventDefault();
            if (anchorNode === focusNode && anchorOffset === focusOffset) {//no selection
                (<any>sel).modify("extend", "left", "character");
                var newsel = document.getSelection();
                this.removeNode(newsel.focusNode, newsel.focusOffset, anchorNode, anchorOffset);
            } else {
                this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
            }
            return;
        }
        if (e.key.length === 1) {
            var end = focusOffset;
            if (anchorNode !== focusNode) {
                end = anchorNode.textContent.length;
            }
            var neu = anchorNode.textContent.substring(0, anchorOffset) + e.key + anchorNode.textContent.substring(end);

            if (anchorNode === focusNode && anchorOffset === focusOffset) {//no selection

            } else {
                this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);

            }
            var varname=this._propertyEditor.getVariableFromObject((<any>anchorNode)._this);
            this._propertyEditor.setPropertyInCode("text", '"'+neu+'"',true,varname);

            anchorNode.textContent = neu;
            e.preventDefault();
            var range = document.createRange();
            range.setStart(anchorNode, anchorOffset + 1);
            sel.removeAllRanges();
            sel.addRange(range);

        }
    }
}
export function test() {
    var dom = React.createElement("div", {
        contenteditable: "true"


    },
        "Hallo", "Du");

    var ret = createComponent(dom);
    ret.dom.addEventListener("keydown", keydown);
    //windows.add(ret, "Hallo");
    return ret;
}