var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_editor/ComponentDesigner", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/remote/Classes"], function (require, exports, ComponentDesigner_1, Registry_1, Component_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.HtmlDesigner = void 0;
    let HtmlDesigner = class HtmlDesigner extends ComponentDesigner_1.ComponentDesigner {
        constructor() {
            super();
            var _this = this;
            this._designPlaceholder.dom.addEventListener("keydown", (ev => _this.keydown(ev)));
            this._designPlaceholder.dom.contentEditable = "true";
            this._designPlaceholder.dom.addEventListener("drop", (ev) => _this.ondrop(ev));
        }
        getParentList(node, list) {
            list.push(node);
            if (node !== document)
                this.getParentList(node.parentNode, list);
        }
        ondrop(ev) {
            var _this = this;
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            var range;
            if (document.caretRangeFromPoint) {
                // edge, chrome, android
                range = document.caretRangeFromPoint(ev.clientX, ev.clientY);
            }
            else {
                // firefox
                var pos = [ev.rangeParent, ev.rangeOffset];
                range = document.createRange();
                range.setStart(...pos);
                range.setEnd(...pos);
            }
            var selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            if (data.indexOf('"createFromType":') > -1) {
                var toCreate = JSON.parse(data);
                var cl = Classes_1.classes.getClass(toCreate.createFromType);
                var newComponent = new cl();
                _this.insertComponent(newComponent, selection);
                _this.updateDummies();
            }
        }
        /*set designedComponent(component) {
            alert(8);
            super.designedComponent=component;
            
        }*/
        registerKeys() {
            return;
            var _this = this;
            this._codeEditor._design.dom.tabindex = "1";
            this._codeEditor._design.dom.addEventListener("keydown", function (evt) {
                if (evt.keyCode === 115 && evt.shiftKey) { //F4
                    // var thiss=this._this._id;
                    // var editor = ace.edit(this._this._id);
                    _this.evalCode(true);
                    evt.preventDefault();
                    return false;
                }
                else if (evt.keyCode === 115) { //F4
                    _this.evalCode(false);
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 90 && evt.ctrlKey) { //Ctrl+Z
                    _this.undo();
                }
                if (evt.keyCode === 116) { //F5
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 46 || (evt.keyCode === 88 && evt.ctrlKey && evt.shiftKey)) { //Del or Ctrl X)
                    _this.cutComponent();
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 67 && evt.ctrlKey && evt.shiftKey) { //Ctrl+C
                    _this.copy();
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 86 && evt.ctrlKey && evt.shiftKey) { //Ctrl+V
                    _this.paste();
                    evt.preventDefault();
                    return false;
                }
                if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey) /* && (evt.which == 19)*/) { //Str+s
                    _this.save();
                    event.preventDefault();
                    return false;
                }
            });
        }
        deleteNodeBetween(node1, node2) {
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
        removeNode(from, frompos, to, topos) {
            if (from === to) {
                var neu = to.textContent;
                this.changeText(to, neu.substring(0, frompos) + "" + neu.substring(topos));
            }
            else {
                this.deleteNodeBetween(from, to);
                this.changeText(from, from.textContent.substring(0, frompos));
                this.changeText(to, to.textContent.substring(topos));
            }
            var range = document.createRange();
            var selection = getSelection();
            range.setStart(from, frompos);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        changeText(node, text) {
            var varname = this._propertyEditor.getVariableFromObject(node._this);
            this._propertyEditor.setPropertyInCode("text", '"' + text + '"', true, varname);
            node.textContent = text;
        }
        insertComponent(component, sel = document.getSelection(), suggestedvarname = undefined) {
            var anchorNode = sel.anchorNode;
            var old = anchorNode.textContent;
            var node = anchorNode;
            var v1 = old.substring(0, sel.anchorOffset);
            var v2 = old.substring(sel.focusOffset);
            this.changeText(node, v2);
            var comp = node._this;
            var br = this.createComponent(Classes_1.classes.getClassName(component), component, undefined, undefined, comp._parent, comp, true, suggestedvarname);
            var nd = document.createTextNode(v1);
            var comp2 = new Component_1.TextComponent();
            comp2.init(nd, { noWrapper: true });
            var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, comp._parent, br, true, "text");
            this.changeText(text2.dom, v1);
            this.updateDummies();
        }
        keydown(e) {
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
                var enter = (0, Component_1.createComponent)(React.createElement("br"));
                this.insertComponent(enter, sel, "br");
                //var enter = node.parentNode.insertBefore(document.createElement("br"), node);
                // var textnode = enter.parentNode.insertBefore(document.createTextNode(v1), enter);
                return;
            }
            if (e.code === "Delete") {
                e.preventDefault();
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                    sel.modify("extend", "right", "character");
                    var newsel = document.getSelection();
                    this.removeNode(anchorNode, anchorOffset, newsel.focusNode, newsel.focusOffset);
                }
                else {
                    this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
                }
                return;
            }
            if (e.code === "Backspace") {
                e.preventDefault();
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                    sel.modify("extend", "left", "character");
                    var newsel = document.getSelection();
                    this.removeNode(newsel.focusNode, newsel.focusOffset, anchorNode, anchorOffset);
                }
                else {
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
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                }
                else {
                    this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
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
    };
    HtmlDesigner = __decorate([
        (0, Registry_1.$Class)("jassijs_editor.HtmlDesigner"),
        __metadata("design:paramtypes", [])
    ], HtmlDesigner);
    exports.HtmlDesigner = HtmlDesigner;
    function test() {
        var dom = React.createElement("div", {
            contenteditable: "true"
        }, "Hallo", "Du");
        var ret = (0, Component_1.createComponent)(dom);
        //ret.dom.addEventListener("keydown", keydown);
        //windows.add(ret, "Hallo");
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=HtmlDesigner.js.map