import { ClipboardData, ComponentDesigner } from "jassijs_editor/ComponentDesigner";
import { $Class } from "jassijs/remote/Registry";
import { Component, TextComponent, createComponent} from "jassijs/ui/Component";
import { Container } from "jassijs/ui/Container";
import { classes } from "jassijs/remote/Classes";


@$Class("jassijs_editor.HtmlDesigner")
export class HtmlDesigner extends ComponentDesigner {

    constructor() {
        super();
        var _this = this;
        this._designPlaceholder.dom.addEventListener("keydown", (ev => _this.keydown(ev)));
        this._designPlaceholder.dom.contentEditable = "true";
        this._designPlaceholder.dom.addEventListener("drop", (ev) => _this.ondrop(ev));
    }
    private getParentList(node: Node, list: Node[]) {
        list.push(node);
        if (node !== <any>document)
            this.getParentList(<any>node.parentNode, list);
    }
    private htmlToClipboardData(data: string) {
        var nodes = Component.createHTMLElement("<span>" + data + "</span>");
        var toInsert = [];
        var textvor;
        var textnach;
        var textpositions: any = {}
        for (var x = 0; x < nodes.childNodes.length; x++) {
            var nd: HTMLElement = <any>nodes.childNodes[x];
            if (nd.classList.contains("jcomponent")) {
                toInsert.push(document.getElementById(nd.id)._this);
            } else {
                var text = nd.innerText;
                textpositions[x] = nd.innerText;
            }
        }
        var clip: ClipboardData = JSON.parse(this.componentsToString(toInsert));
        var counter = 1000;
        for (var p in textpositions) {
            while (clip.allChilds.indexOf("text" + counter) !== -1) {
                counter++;
            }
            var varnamepre = "text" + counter;
            clip.allChilds.push(varnamepre);
            clip.varNamesToCopy.splice(parseInt(p), 0, varnamepre);
            clip.properties[varnamepre] = { "text": ['"' + textpositions[parseInt(p)] + '"'], "_new_": ['"' + textpositions[parseInt(p)] + '"'] };
            clip.types[varnamepre] = "jassijs.ui.TextComponent";
        }
        return clip;

    }
    ondrop(ev: DragEvent) {
        var _this = this;
        ev.preventDefault();
        var selection = document.getSelection();
        let anchorNodeToDel = selection.anchorNode;
        let anchorOffsetToDel = selection.anchorOffset;
        let focusNodeToDel = selection.focusNode;
        let focusOffsetToDel = selection.focusOffset;
        var data = ev.dataTransfer.getData("text");
        var range;
        if (document.caretRangeFromPoint) {
            // edge, chrome, android
            range = document.caretRangeFromPoint(ev.clientX, ev.clientY)
        } else {
            // firefox
            //@ts-ignore
            var pos = [ev.rangeParent, ev.rangeOffset]
            range = document.createRange()
            range.setStart(...pos);
            range.setEnd(...pos);
        }

        selection.removeAllRanges();
        selection.addRange(range);
        let anchorNode = selection.anchorNode;
        let anchorOffset = selection.anchorOffset;
        let focusNode = selection.focusNode;
        let focusOffset = selection.focusOffset;
        var position = anchorNode.compareDocumentPosition(focusNode);
        if (!position && anchorOffset > focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
            var k = focusNode;
            focusNode = focusNode;
            focusNode = k;
            var k1 = anchorOffset;
            anchorOffset = focusOffset;
            focusOffset = k1;
        }

        console.log("a" + anchorOffset);
        if (data.indexOf('"createFromType":') > -1) {


            var toCreate: { createFromType: string, createFromParam: string } = <any>JSON.parse(data);
            var cl = classes.getClass(toCreate.createFromType);
            var newComponent = new cl();
            var last = _this.splitText(selection);
            var text2 = this.createComponent(classes.getClassName(newComponent), newComponent, undefined, undefined, last._parent, last, true);

            //            _this.insertComponent(newComponent, selection);

        } else if (data.indexOf('"varNamesToCopy":') > -1) {
            var clip: ClipboardData = JSON.parse(data);
            var svar = clip.varNamesToCopy[0];
            var comp = _this._propertyEditor.getObjectFromVariable(svar);
            var last = _this.splitText(selection);
            this.moveComponent(comp, undefined, undefined, comp._parent, last._parent, last);
            last.domWrapper.parentNode.insertBefore(comp.domWrapper, last.domWrapper);
        } else {
            data = ev.dataTransfer.getData("text/html");
            var clip = this.htmlToClipboardData(data);
            var nodes = Component.createHTMLElement("<span>" + data + "</span>");
            if (anchorNode === anchorNodeToDel && anchorOffsetToDel < anchorOffset) {
                anchorOffset -= (<any>nodes.childNodes[0]).innerText.length;//removing the selection changes the insertposition
            }

            this.removeNode(anchorNodeToDel, anchorOffsetToDel, focusNodeToDel, focusOffsetToDel);
            range = document.createRange();
            var selection = getSelection();
            range.setStart(anchorNode, anchorOffset);
            selection.removeAllRanges();
            selection.addRange(range);;
            var last = _this.splitText(selection);
            this.pasteComponents(JSON.stringify(clip), last._parent, last).then(() => {
                _this._propertyEditor.updateParser();
                _this.codeHasChanged();
                _this.editDialog(true);
            });
            //this.removeNode(anchorNodeToDel,anchorOffsetToDel,focusNodeToDel,focusOffsetToDel);
            // var fneu=anchorNode.textContent.substring(0,anchorOffset)+toInsert[0]+anchorNode.textContent.substring(anchorOffset);
            //this.changeText(anchorNode, fneu);                    

        }

    }
    async paste() {
        var data = await navigator.clipboard.read();

        var sel = document.getSelection();
        var comp;
        if (sel.anchorNode == null)
            comp = this._propertyEditor.value;
        else
            comp = this.splitText(sel);
        if (data[0].types.indexOf("text/html") !== -1) {
            var data2 = await data[0].getType("text/html");
            var text = await data2.text();

            var clip = this.htmlToClipboardData(text);
            if (this.lastSelectedDummy.component === comp && !this.lastSelectedDummy.pre)
                await this.pasteComponents(JSON.stringify(clip), comp);//insert in Container at the End
            else
                await this.pasteComponents(JSON.stringify(clip), comp._parent, comp)

        } else {
            this._propertyEditor.value = comp;
            return await super.paste();
        }
        this._propertyEditor.updateParser();
        this.codeHasChanged();
        this.editDialog(true);
        //  alert(8);
        // debugger; 
        //return await super.paste(); 
    }
    async copy(): Promise<string> {
        var sel = document.getSelection();
        if (sel.focusNode === sel.anchorNode && sel.focusOffset === sel.anchorOffset)
            return super.copy();
        document.execCommand("copy");
        return await navigator.clipboard.readText();
    }
    /*set designedComponent(component) {
        alert(8);
        super.designedComponent=component;
        
    }*/
    /* registerKeys() {
 
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
                 evt.preventDefault();
                 _this.cutComponent();
                 return false;
             }
             if (evt.keyCode === 67 && evt.ctrlKey && evt.shiftKey) {//Ctrl+C
                 evt.preventDefault();
                 _this.copy();
                 return false;
             }
             if (evt.keyCode === 86 && evt.ctrlKey && evt.shiftKey) {//Ctrl+V
                 evt.preventDefault();
                 _this.paste();
                 return false;
             }
             if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey)) {//Str+s
                 _this.save();
                 event.preventDefault();
                 return false;
             }
 
         });
     }*/
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
        var components = [];
        while (todel !== par2) {
            var del = todel;
            todel = todel.nextSibling;
            components.push(del._this);
            // del.remove();
        }
        var s = this.componentsToString(components);
        this.deleteComponents(s);
    }
    editDialog(enable) {
        super.editDialog(enable);
    }
    createDragAndDropper() {
        return undefined;
    }
    private removeNode(from: Node, frompos: number, to: Node, topos: number) {
        var position = from.compareDocumentPosition(to);
        // selection has wrong direction
        if (!position && frompos > topos || position === Node.DOCUMENT_POSITION_PRECEDING) {
            var k = from;
            from = to;
            to = k;
            var k1 = frompos;
            frompos = topos;
            topos = k1;
        }
        if (from === to) {
            var neu = to.textContent;
            this.changeText(to, neu.substring(0, frompos) + "" + neu.substring(topos));
        } else {
            this.deleteNodeBetween(from, to);
            this.changeText(from, from.textContent.substring(0, frompos));
            this.changeText(to, to.textContent.substring(topos));
        }
        var range = document.createRange();
        var selection = getSelection();
        range.setStart(from, frompos);
        selection.removeAllRanges();
        selection.addRange(range);;
    }
    private changeText(node: Node, text: string): Node {
        var varname = this._propertyEditor.getVariableFromObject((<any>node)._this);
        this._propertyEditor.setPropertyInCode("text", '"' + text + '"', true, varname);
        if (text === "&nbsp;")
            (<HTMLHtmlElement>node).innerHTML = text
        else
            node.textContent = text;
        return node;
    }
    private splitText(sel: Selection = document.getSelection()): Component {
        // selection has wrong direction
        var offSet = sel.anchorOffset;
        var node = sel.anchorNode;
        if (sel.anchorNode.compareDocumentPosition(sel.focusNode) === Node.DOCUMENT_POSITION_PRECEDING) {
            node = sel.focusNode;
            offSet = sel.focusOffset;
        }
        var old = node.textContent;
        var node = node;
        var v1 = old.substring(0, offSet);
        var v2 = old.substring(offSet);
        this.changeText(node, v2);
        var comp: Component = (<any>node)._this;
        // var br = this.createComponent(classes.getClassName(component), component, undefined, undefined, comp._parent, comp, true, suggestedvarname);
        if (v1 === "")
            return comp;//v1 = "&nbsp;";

        var nd = document.createTextNode(v1);
        var comp2 = new TextComponent();
        comp2.init(<any>nd, { noWrapper: true });
        var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, comp._parent, comp, true, "text");

        this.changeText(text2.dom, v1);
        //this.updateDummies();
        return comp;
    }

    private keydown(e: KeyboardEvent) {
        if (e.keyCode === 115 && e.shiftKey) {//F4
            return false;
        } else if (e.keyCode === 115) {//F4
            return false;
        }
        if (e.keyCode === 90 && e.ctrlKey) {//Ctrl+Z

        }
        if (e.keyCode === 116) {//F5
            e.preventDefault();
            return false;
        }
        if (e.keyCode === 46 || (e.keyCode === 88 && e.ctrlKey && e.shiftKey)) {//Del or Ctrl X)

            return false;
        }
        if (e.keyCode === 67 && e.ctrlKey) {//Ctrl+C
            e.preventDefault();
            this.copy();
            return false;
        }
        if (e.keyCode === 86 && e.ctrlKey) {//Ctrl+V
            e.preventDefault();
            this.paste();
            return false;
        }
        if ((String.fromCharCode(e.which).toLowerCase() === 's' && e.ctrlKey)/* && (evt.which == 19)*/) {//Str+s

            return false;
        }
        if (e.ctrlKey)
            return;
        var sel = document.getSelection();
        if (sel.anchorNode === null) {
            var nd = document.createTextNode("");
            var comp2 = new TextComponent();
            comp2.init(<any>nd, { noWrapper: true });
            if (this.lastSelectedDummy.pre)
                var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, this._propertyEditor.value._parent, this._propertyEditor.value, true, "text");
            else
                var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, this._propertyEditor.value, undefined, true, "text");
            
            var selection = getSelection();
            var range = document.createRange();
            range.setStart(comp2.dom, 0);
            range.setEnd(comp2.dom, 0);

            selection.removeAllRanges();
            selection.addRange(range);
        }
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
            var enter = createComponent(React.createElement("br"));
            var comp = this.splitText(sel);
            this.createComponent(classes.getClassName(enter), enter, undefined, undefined, comp._parent, comp, true, "br");

            //     this.insertComponent(enter, sel, "br");
            //var enter = node.parentNode.insertBefore(document.createElement("br"), node);
            // var textnode = enter.parentNode.insertBefore(document.createTextNode(v1), enter);

        } else if (e.code === "Delete") {
            e.preventDefault();
            if (anchorNode === focusNode && anchorOffset === focusOffset) {//no selection
                (<any>sel).modify("extend", "right", "character");
                var newsel = document.getSelection();
                this.removeNode(anchorNode, anchorOffset, newsel.focusNode, newsel.focusOffset);
            } else {
                this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
            }
            return;
        } else if (e.code === "Backspace") {
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
        else if (e.key.length === 1) {

            var end = focusOffset;
            if (anchorNode !== focusNode) {
                end = anchorNode.textContent.length;
            }
            if (anchorNode === focusNode && anchorOffset === focusOffset) {//no selection

            } else {
                this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);

            }
            var neu = anchorNode.textContent.substring(0, anchorOffset) + e.key + anchorNode.textContent.substring(end);
            if (anchorNode.nodeType !== anchorNode.TEXT_NODE) {//there is no Textnode here we create one
                var before = undefined;
                if (anchorNode.childNodes.length > 0) {
                    before = (<any>anchorNode.childNodes[0])._this;
                }
                var comp2 = new TextComponent();
                var newone = document.createTextNode(e.key);
                var par = (<any>anchorNode)._this;
                comp2.init(<any>newone, { noWrapper: true });
                var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, par, before, true, "text");
                anchorOffset = 0;
                anchorNode = newone;
                neu = e.key;
            }
            this.changeText(anchorNode, neu);
            e.preventDefault();
            var range = document.createRange();
            range.setStart(anchorNode, anchorOffset + 1);
            sel.removeAllRanges();
            sel.addRange(range);

        }
        this.updateDummies();
    }
}
export function test() {
    var dom = React.createElement("div", {
        contenteditable: "true"


    },
        "Hallo", "Du");

    var ret = createComponent(dom);
    //ret.dom.addEventListener("keydown", keydown);
    //windows.add(ret, "Hallo");
    return ret;
}
