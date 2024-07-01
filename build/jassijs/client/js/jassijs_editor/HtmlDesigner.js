var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_editor/ComponentDesigner", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/remote/Classes", "jassijs/ui/Button", "jassijs/util/Tools"], function (require, exports, ComponentDesigner_1, Registry_1, Component_1, Classes_1, Button_1, Tools_1) {
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
        htmlToClipboardData(data) {
            var nodes = Component_1.Component.createHTMLElement("<span>" + data + "</span>");
            var toInsert = [];
            var textvor;
            var textnach;
            var textpositions = {};
            for (var x = 0; x < nodes.childNodes.length; x++) {
                var nd = nodes.childNodes[x];
                if (nd.classList.contains("jcomponent")) {
                    toInsert.push(document.getElementById(nd.id)._this);
                }
                else {
                    var text = nd.innerText;
                    textpositions[x] = nd.innerText;
                }
            }
            var clip = JSON.parse(this.componentsToString(toInsert));
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
        ondrop(ev) {
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
                range = document.caretRangeFromPoint(ev.clientX, ev.clientY);
            }
            else {
                // firefox
                //@ts-ignore
                range = document.createRange();
                //@ts-ignore
                range.setStart(ev.rangeParent, ev.rangeOffse);
                //@ts-ignore
                range.setEnd(ev.rangeParent, ev.rangeOffse);
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
                var toCreate = JSON.parse(data);
                var cl = Classes_1.classes.getClass(toCreate.createFromType);
                var newComponent = new cl();
                var last = _this.splitText(selection)[1];
                var text2 = this.createComponent(Classes_1.classes.getClassName(newComponent), newComponent, undefined, undefined, last._parent, last, true);
                //            _this.insertComponent(newComponent, selection);
            }
            else if (data.indexOf('"varNamesToCopy":') > -1) {
                var clip = JSON.parse(data);
                var svar = clip.varNamesToCopy[0];
                var comp = _this._propertyEditor.getObjectFromVariable(svar);
                var last = _this.splitText(selection)[1];
                this.moveComponent(comp, undefined, undefined, comp._parent, last._parent, last);
                last.domWrapper.parentNode.insertBefore(comp.domWrapper, last.domWrapper);
            }
            else {
                data = ev.dataTransfer.getData("text/html");
                var clip = this.htmlToClipboardData(data);
                var nodes = Component_1.Component.createHTMLElement("<span>" + data + "</span>");
                if (anchorNode === anchorNodeToDel && anchorOffsetToDel < anchorOffset) {
                    anchorOffset -= nodes.childNodes[0].innerText.length; //removing the selection changes the insertposition
                }
                var newSel = getSelection();
                range = document.createRange();
                range.setStart(anchorNodeToDel, anchorOffsetToDel);
                range.setEnd(focusNodeToDel, focusOffsetToDel);
                newSel.addRange(range);
                ;
                this.removeNodes(newSel);
                range = document.createRange();
                var selection = getSelection();
                range.setStart(anchorNode, anchorOffset);
                selection.removeAllRanges();
                selection.addRange(range);
                ;
                var last = _this.splitText(selection)[1];
                this.pasteComponents(JSON.stringify(clip), last._parent, last).then(() => {
                    _this._propertyEditor.updateParser();
                    _this.codeHasChanged();
                    _this.editDialog(true);
                });
                //this.removeNodes(anchorNodeToDel,anchorOffsetToDel,focusNodeToDel,focusOffsetToDel);
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
                comp = this.splitText(sel)[1];
            if (data[0].types.indexOf("text/html") !== -1) {
                var data2 = await data[0].getType("text/html");
                var text = await data2.text();
                var clip = this.htmlToClipboardData(text);
                if (this.lastSelectedDummy.component === comp && !this.lastSelectedDummy.pre)
                    await this.pasteComponents(JSON.stringify(clip), comp); //insert in Container at the End
                else
                    await this.pasteComponents(JSON.stringify(clip), comp._parent, comp);
            }
            else {
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
        async copy() {
            var sel = document.getSelection();
            if (sel.focusNode === sel.anchorNode && sel.focusOffset === sel.anchorOffset)
                return await super.copy();
            document.execCommand("copy");
            return await navigator.clipboard.readText();
        }
        /*set designedComponent(component) {
            alert(8);
            super.designedComponent=component;
            
        }*/
        registerKeys() {
            //in keydown(...)
        }
        /* private deleteNodeBetween(node1: Node, node2: Node) {
             var list1 = [];
             var list2 = [];
             this.getParentList(node1, list1);
             this.getParentList(node2, list2);
             var pos = 0;
             var test = list1[pos];
             while (list2.indexOf(list1[pos]) === -1) {
                 pos++;
             }
            
             var par1 = list1[pos];
             var par2 = list2[list2.indexOf(list1[pos]) ];
             var components = [];
             if(node1===node2){
                 components.push(node1._this);
             }else{
                 var todel = par1.nextSibling;
     
                 var components = [];
                 while (todel !== par2) {
                     var del = todel;
                     todel = todel.nextSibling;
                     components.push(del._this);
                     // del.remove();
                 }
             }
             var s = this.componentsToString(components);
             this.deleteComponents(s);
         }*/
        deleteNodeBetween(selection) {
            var range = selection.getRangeAt(0);
            var parent = range.commonAncestorContainer;
            var contains = false;
            var components = [];
            for (var x = 0; x < parent.childNodes.length; x++) {
                var node = parent.childNodes[x];
                //@ts-ignore
                if (node._this === selection.anchorNode._this || node._this === selection.focusNode._this || selection.containsNode(node)) {
                    contains = true;
                }
                else {
                    contains = false;
                }
                if (contains) {
                    components.push(node._this);
                }
            }
            //@ts-ignore
            document.getSelection().modify("move", "left", "character");
            var a = getSelection().anchorNode;
            var apos = getSelection().anchorOffset;
            setTimeout(() => {
                var range = document.createRange();
                var selection = getSelection();
                console.log(range);
                range.setStart(a, apos); //removed position
                selection.removeAllRanges();
                selection.addRange(range);
            }, 10);
            //@ts-ignore
            if (components.length > 0 && components[0].dom.nodeType === components[0].dom.TEXT_NODE)
                components.splice(0, 1);
            if (components.length > 0 && components[components.length - 1].dom.nodeType === components[components.length - 1].dom.TEXT_NODE)
                components.splice(components.length - 1, 1);
            var s = this.componentsToString(components);
            console.log(components);
            this.deleteComponents(s);
        }
        wrapTextNodeIfNeeded(found) {
            var parent = found.parentNode;
            if (parent.childNodes.length !== 1) {
                //no wrap
                var textComp = found._this;
                var newSpan = new Component_1.HTMLComponent({ tag: "span" });
                var span = this.createComponent(Classes_1.classes.getClassName(newSpan), newSpan, undefined, undefined, textComp._parent, textComp, false);
                var varspan = this.codeEditor.getVariableFromObject(span);
                this._propertyEditor.setPropertyInCode("tag", "\"span\"", true, varspan);
                this.moveComponent(textComp, undefined, undefined, textComp._parent, span, undefined);
                span.add(textComp);
                parent = span.__dom;
            }
            return parent;
        }
        bold() {
            this.setStyle("bold");
        }
        setStyle(style, value = undefined) {
            var sel = getSelection();
            var anchorNode = sel.anchorNode;
            var anchorOffset = sel.anchorOffset;
            var focusNode = sel.focusNode;
            var focusOffset = sel.focusOffset;
            var position = anchorNode.compareDocumentPosition(focusNode);
            if (!position && anchorOffset > focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                var k = focusNode;
                focusNode = focusNode;
                focusNode = k;
                var k1 = anchorOffset;
                anchorOffset = focusOffset;
                focusOffset = k1;
            }
            var container = sel.getRangeAt(0).commonAncestorContainer;
            if (container.nodeType === container.TEXT_NODE)
                container = container.parentNode;
            var allModified = [];
            for (var x = 0; x < container.childNodes.length; x++) {
                var child = container.childNodes[x];
                if (child.tagName === "BR" || child.tagName === "br")
                    continue;
                var found = undefined;
                if (sel.containsNode(child)) {
                    found = child;
                }
                if (child.contains(anchorNode) || child === anchorNode) {
                    if (anchorOffset !== 0) {
                        var samenode = anchorNode === focusNode;
                        if (child === anchorNode)
                            x++;
                        var texts = this.splitText(sel);
                        anchorNode = texts[1].dom;
                        if (allModified.indexOf(texts[0]) === -1)
                            allModified.push(texts[0]);
                        if (allModified.indexOf(texts[1]) === -1)
                            allModified.push(texts[1]);
                        if (anchorNode.nodeType !== anchorNode.TEXT_NODE) { //textnode is wrapped
                            anchorNode = anchorNode.childNodes[0];
                        }
                        if (samenode) {
                            focusNode = anchorNode;
                            focusOffset -= anchorOffset;
                        }
                        anchorOffset = 0;
                    }
                    found = anchorNode;
                }
                if (child.contains(focusNode) || child === focusNode) {
                    if (focusOffset !== child.length) {
                        //  var samenode = anchorNode === focusNode;
                        range = document.createRange();
                        range.setStart(focusNode, focusOffset);
                        range.setEnd(focusNode, focusNode.length);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        if (child === focusNode)
                            x++;
                        var texts = this.splitText(sel);
                        var pos = allModified.indexOf(texts[1]);
                        debugger;
                        if (pos !== -1)
                            allModified.splice(pos, 0, texts[0]);
                        else
                            allModified.push(texts[0]);
                        if (allModified.indexOf(texts[1]) === -1)
                            allModified.push(texts[1]);
                        var newNode = texts[0].dom;
                        if (newNode.nodeType !== newNode.TEXT_NODE) { //textnode is wrapped
                            newNode = newNode.childNodes[0];
                        }
                        if (focusNode === anchorNode) {
                            focusNode = anchorNode = newNode;
                        }
                        else
                            focusNode = newNode;
                        //focusOffset=(<any>focusNode).length;
                    }
                    found = focusNode;
                }
                if (found) {
                    var parent = this.wrapTextNodeIfNeeded(found);
                    var compParent = parent._this;
                    if (allModified.indexOf(compParent) === -1)
                        allModified.push(compParent);
                    this.applyStyle(compParent, style);
                }
            }
            var range = document.createRange();
            range.setStart(anchorNode, anchorOffset);
            range.setEnd(focusNode, focusOffset);
            sel.removeAllRanges();
            sel.addRange(range);
            return allModified;
        }
        applyStyle(comp, stylename, value = undefined) {
            var varParent = this.codeEditor.getVariableFromObject(comp);
            var style = this._propertyEditor.parser.getPropertyValue(varParent, "style");
            var st = Tools_1.Tools.jsonToObject(style === undefined ? "{}" : style);
            if (st.fontWeight === "bold")
                delete st.fontWeight; //="normal";
            else
                st.fontWeight = "bold";
            if (this._propertyEditor.codeEditor)
                this._propertyEditor.setPropertyInCode("style", JSON.stringify(st), true, varParent, undefined, undefined);
            comp.style = st;
        }
        _initDesign() {
            super._initDesign();
            var _this = this;
            this.boldButton = new Button_1.Button();
            this.boldButton.icon = "mdi mdi-format-bold mdi-18px";
            this.boldButton.tooltip = "bold";
            this.boldButton.onclick(function () {
                _this.bold();
            });
            this._designToolbar.add(this.boldButton);
        }
        editDialog(enable) {
            super.editDialog(enable);
        }
        createDragAndDropper() {
            return undefined;
        }
        removeNodes(selection) {
            var from = selection.anchorNode;
            var frompos = selection.anchorOffset;
            var to = selection.focusNode;
            var topos = selection.focusOffset;
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
            this.deleteNodeBetween(selection);
            //@ts-ignore
            if (from === to && to.nodeType === from.TEXT_NODE) {
                var neu = to.textContent;
                this.changeText(to, neu.substring(0, frompos) + "" + neu.substring(topos));
            }
            else {
                if (from.nodeType === from.TEXT_NODE) {
                    this.changeText(from, from.textContent.substring(0, frompos));
                }
                if (to.nodeType === from.TEXT_NODE) {
                    this.changeText(to, to.textContent.substring(topos));
                }
                //this.changeText(from, from.textContent.substring(0, frompos));
                //this.changeText(to, to.textContent.substring(topos));
            }
            /*else {
                var end = to.childNodes[topos];
                if (end === undefined)
                    end = to.childNodes[to.childNodes.length - 1];
                this.deleteNodeBetween(from.childNodes[frompos], end);
            }*/
            /*} else {
                if (from.nodeType === from.TEXT_NODE){
                    this.deleteNodeBetween(from, to);
                    this.changeText(from, from.textContent.substring(0, frompos));
                    this.changeText(to, to.textContent.substring(topos));
                }else{
                     this.deleteNodeBetween(from.childNodes[frompos], to);
                    
                    this.changeText(to, to.textContent.substring(topos));
                }
            }*/
        }
        changeText(node, text) {
            var varname = this.codeEditor.getVariableFromObject(node._this);
            if (this._propertyEditor.codeEditor)
                this._propertyEditor.setPropertyInCode("text", '"' + text + '"', true, varname);
            if (text === "&nbsp;")
                node.innerHTML = text;
            else
                node.textContent = text;
            this._propertyEditor.callEvent("propertyChanged", event);
            return node;
        }
        splitText(sel = document.getSelection()) {
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
            var comp = node._this;
            // var br = this.createComponent(classes.getClassName(component), component, undefined, undefined, comp._parent, comp, true, suggestedvarname);
            if (v1 === "")
                return [comp, comp]; //v1 = "&nbsp;";
            var text2 = this.createTextComponent(v1, comp._parent, comp);
            /*        var nd = document.createTextNode(v1);
                    var comp2 = new TextComponent();
                    comp2.init(<any>nd, { noWrapper: true });
                    var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, comp._parent, comp, true, "text");
            */
            this.changeText(text2.dom, v1);
            //this.updateDummies();
            return [text2, comp];
        }
        async cutComponent() {
            var _this = this;
            var sel = document.getSelection();
            if (sel.focusNode === sel.anchorNode && sel.focusOffset === sel.anchorOffset)
                return super.cutComponent();
            document.execCommand("copy");
            var data = await navigator.clipboard.read();
            var tt = await data[0].getType("text/html");
            var text = await tt.text();
            var code = JSON.stringify(_this.htmlToClipboardData(text));
            navigator.clipboard.writeText(code);
            var e = new KeyboardEvent("keypress", {
                code: "Delete"
            });
            _this.keydown(e);
        }
        createTextComponent(text, par, before) {
            var comp2 = new Component_1.TextComponent();
            var newone = document.createTextNode(text);
            comp2.init(newone, { noWrapper: true });
            return this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, par, before, true, "text");
            ;
        }
        insertLineBreak(sel) {
            var enter = (0, Component_1.createComponent)(React.createElement("br"));
            var comp = this.splitText(sel)[1];
            var center = this.createComponent(Classes_1.classes.getClassName(enter), enter, undefined, undefined, comp._parent, comp, true, "br");
            this._propertyEditor.setPropertyInCode("tag", "\"br\"", true, this.codeEditor.getVariableFromObject(center));
        }
        keydown(e) {
            var _this = this;
            if (e.keyCode === 115 && e.shiftKey) { //F4
                return false;
            }
            else if (e.keyCode === 115) { //F4
                return false;
            }
            if (e.keyCode === 90 && e.ctrlKey) { //Ctrl+Z
            }
            if (e.keyCode === 116) { //F5
                e.preventDefault();
                return false;
            }
            if ((e.keyCode === 88 && e.ctrlKey)) { //Del or Ctrl X)
                e.preventDefault();
                this.cutComponent();
                return;
            }
            if (e.keyCode === 67 && e.ctrlKey) { //Ctrl+C
                e.preventDefault();
                this.copy();
                return false;
            }
            if (e.keyCode === 86 && e.ctrlKey) { //Ctrl+V
                e.preventDefault();
                this.paste();
                return false;
            }
            if ((String.fromCharCode(e.which).toLowerCase() === 's' && e.ctrlKey) /* && (evt.which == 19)*/) { //Str+s
                return false;
            }
            if (e.ctrlKey)
                return;
            var sel = document.getSelection();
            if (sel.anchorNode === null) {
                var nd = document.createTextNode("");
                var comp2 = new Component_1.TextComponent();
                comp2.init(nd, { noWrapper: true });
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
                this.insertLineBreak(sel);
                //     this.insertComponent(enter, sel, "br");
                //var enter = node.parentNode.insertBefore(document.createElement("br"), node);
                // var textnode = enter.parentNode.insertBefore(document.createTextNode(v1), enter);
            }
            else if (e.code === "Delete") {
                e.preventDefault();
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                    sel.modify("extend", "right", "character");
                    var newsel = document.getSelection();
                    this.removeNodes(newsel);
                }
                else {
                    this.removeNodes(sel);
                }
                this.updateDummies();
                return;
            }
            else if (e.code === "Backspace") {
                e.preventDefault();
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                    sel.modify("extend", "left", "character");
                    var newsel = document.getSelection();
                    this.removeNodes(newsel);
                }
                else {
                    this.removeNodes(sel);
                }
                this.updateDummies();
                return;
            }
            else if (e.key.length === 1) {
                var end = focusOffset;
                if (anchorNode !== focusNode) {
                    end = anchorNode.textContent.length;
                }
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                }
                else {
                    this.removeNodes(sel);
                }
                var neu = anchorNode.textContent.substring(0, anchorOffset) + e.key + anchorNode.textContent.substring(end);
                if (anchorNode.nodeType !== anchorNode.TEXT_NODE) { //there is no Textnode here we create one
                    var before = undefined;
                    if (anchorNode.childNodes.length > anchorOffset) {
                        before = anchorNode.childNodes[anchorOffset]._this;
                    }
                    anchorOffset = 0;
                    anchorNode = this.createTextComponent(e.key, anchorNode._this, before).dom;
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