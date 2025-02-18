var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_editor/ComponentDesigner", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/remote/Classes", "jassijs/ui/Button", "jassijs/util/Tools", "jassijs/ui/Textbox", "jassijs/ui/ComponentDescriptor", "jassijs/ext/spectrum"], function (require, exports, ComponentDesigner_1, Registry_1, Component_1, Classes_1, Button_1, Tools_1, Textbox_1, ComponentDescriptor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.HtmlDesigner = void 0;
    let HtmlDesigner = class HtmlDesigner extends ComponentDesigner_1.ComponentDesigner {
        constructor() {
            super({});
            var _this = this;
            this._designPlaceholder.dom.addEventListener("keydown", (ev => _this.keydown(ev)));
            this._designPlaceholder.dom.contentEditable = "true";
            this._designPlaceholder.dom.addEventListener("drop", (ev) => _this.ondrop(ev));
            this.onDesignedComponentChanged((component) => _this.updateContentEditable(component));
            this.dom.onclick = ((ev) => _this.onclick(ev));
        }
        onclick(ev) {
            if (!ev.target.classList.contains("_dummy_")) {
                this.lastSelectedDummy.component = undefined;
                this.lastSelectedDummy.pre = false;
            }
            return undefined;
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
        select(nodeStart, posStart, nodeEnd = undefined, posEnd = undefined) {
            var newSel = getSelection();
            var range = document.createRange();
            range.setStart(nodeStart, posStart);
            if (nodeEnd !== undefined)
                range.setEnd(nodeEnd, posEnd);
            newSel.removeAllRanges();
            newSel.addRange(range);
            return range;
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
                range = this.select(ev.rangeParent, ev.rangeOffse, ev.rangeParent, ev.rangeOffse);
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
                this.select(anchorNodeToDel, anchorOffsetToDel, focusNodeToDel, focusOffsetToDel);
                var newSel = getSelection();
                this.removeNodes(newSel);
                range = this.select(anchorNode, anchorOffset);
                selection.removeAllRanges();
                selection.addRange(range);
                var selection = getSelection();
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
        updateContentEditable(component) {
            var _a;
            var allComponents = [component.dom._this];
            if (component.dom._thisOther)
                allComponents.push(...component.dom._thisOther);
            var varname = undefined;
            for (var curComponent = 0; curComponent < allComponents.length; curComponent++) {
                var comp = allComponents[curComponent];
                varname = this._codeEditor.getVariableFromObject(comp);
                if (varname !== undefined)
                    break;
                //        var desc = ComponentDescriptor.describe(comp.constructor);
                //      var fnew = desc.findField("children");
                for (var x = 0; x < ((_a = comp._components) === null || _a === void 0 ? void 0 : _a.length); x++) {
                    this.updateContentEditable(comp._components[x]);
                }
            }
            if (varname === undefined) {
                component.dom.contentEditable = "false";
            }
            else {
                component.dom.contentEditable = "true";
            }
        }
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
                if (a.parentNode == null)
                    return;
                this.select(a, apos); //removed position
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
        italic() {
            this.setStyle("italic");
        }
        underline() {
            this.setStyle("underline");
        }
        /**
         * if user select lastnode to firstnode
         */
        reverseSelectionIfNeeded() {
            var sel = getSelection();
            var anchorNode = sel.anchorNode;
            var anchorOffset = sel.anchorOffset;
            var focusNode = sel.focusNode;
            var focusOffset = sel.focusOffset;
            var position = anchorNode.compareDocumentPosition(focusNode);
            if (!position && anchorOffset > focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                var k = focusNode;
                anchorNode = focusNode;
                focusNode = k;
                var k1 = anchorOffset;
                anchorOffset = focusOffset;
                focusOffset = k1;
                this.select(anchorNode, anchorOffset, focusNode, focusOffset);
            }
        }
        setStyle(style, value = undefined) {
            this.reverseSelectionIfNeeded();
            var sel = getSelection();
            var anchorNode = sel.anchorNode;
            var anchorOffset = sel.anchorOffset;
            var focusNode = sel.focusNode;
            var focusOffset = sel.focusOffset;
            var position = anchorNode.compareDocumentPosition(focusNode);
            if (!position && anchorOffset > focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                var k = focusNode;
                anchorNode = focusNode;
                focusNode = k;
                var k1 = anchorOffset;
                anchorOffset = focusOffset;
                focusOffset = k1;
                this.select(anchorNode, anchorOffset, focusNode, focusOffset);
                var sel = document.getSelection();
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
                        this.select(focusNode, focusOffset, focusNode, focusNode.length);
                        sel = document.getSelection();
                        if (child === focusNode)
                            x++;
                        var texts = this.splitText(sel);
                        var pos = allModified.indexOf(texts[1]);
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
                    this.applyStyle(compParent, style, value);
                }
            }
            this.select(anchorNode, anchorOffset, focusNode, focusOffset);
            return allModified;
        }
        applyStyle(comp, stylename, value = undefined) {
            var varParent = this.codeEditor.getVariableFromObject(comp);
            var style = this._propertyEditor.parser.getPropertyValue(varParent, "style");
            var st = Tools_1.Tools.jsonToObject(style === undefined ? "{}" : style);
            if (stylename === "bold") {
                if (st.fontWeight === "bold")
                    delete st.fontWeight; //="normal";
                else
                    st.fontWeight = "bold";
            }
            else if (stylename === "italic") {
                if (st.fontStyle === "italic")
                    delete st.fontStyle; //="normal";
                else
                    st.fontStyle = "italic";
            }
            else if (stylename === "underline") {
                if (st.textDecorationLine === "underline")
                    delete st.textDecorationLine; //="normal";
                else
                    st.textDecorationLine = "underline";
            }
            else if (stylename === "color") {
                st.color = value;
            }
            else if (stylename === "backgroundColor") {
                st.backgroundColor = value;
            }
            else if (stylename === "fontSize") {
                st.fontSize = value;
            }
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
            this.italicButton = new Button_1.Button();
            this.italicButton.icon = "mdi mdi-format-italic mdi-18px";
            this.italicButton.tooltip = "italic";
            this.italicButton.onclick(function () {
                _this.italic();
            });
            this._designToolbar.add(this.italicButton);
            this.underlineButton = new Button_1.Button();
            this.underlineButton.icon = "mdi mdi-format-underline mdi-18px";
            this.underlineButton.tooltip = "italic";
            this.underlineButton.onclick(function () {
                _this.underline();
            });
            this._designToolbar.add(this.underlineButton);
            this._createColorIcon();
            this._createBGColorIcon();
            this._createFontSizeIcon();
        }
        _createFontSizeIcon() {
            var _this = this;
            this.fontSizeButton = (0, Component_1.createComponent)((0, Component_1.jc)("select", {
                style: {
                    fontSize: "8pt", "height": "24px", "verticalAlign": "2px"
                },
                onChange: (e) => {
                    var val = e.target.value;
                    _this.setStyle("fontSize", val);
                },
                children: [
                    (0, Component_1.jc)("option", { children: ["8px"], value: "8px" }),
                    (0, Component_1.jc)("option", { children: ["10px"], value: "10px" }),
                    (0, Component_1.jc)("option", { children: ["12px"], value: "12px" }),
                    (0, Component_1.jc)("option", { children: ["14px"], value: "14px" }),
                    (0, Component_1.jc)("option", { children: ["18px"], value: "18px" }),
                    (0, Component_1.jc)("option", { children: ["24px"], value: "24px" }),
                    (0, Component_1.jc)("option", { children: ["36px"], value: "36px" }),
                ]
            }));
            this._designToolbar.add(this.fontSizeButton);
        }
        _createColorIcon() {
            var _this = this;
            this.colorIcon = new Textbox_1.Textbox({ useWrapper: true });
            var spec = $(this.colorIcon.dom)["spectrum"]({
                color: "#f00",
                showPalette: true,
                palette: [
                    ['black'], ["brown"], ["blue"], ["green"], ["red"], ["orange"], ["yellow"], ['white']
                ],
                change: function (color) {
                    var scolor = color.toHexString();
                    if (color.toName())
                        scolor = color.toName();
                    _this.setStyle("color", scolor);
                    // debugger;
                    //		    _this.paletteChanged(color.toHexString()); // #ff0000
                }
            });
            //correct height
            var bt = this.colorIcon.domWrapper.querySelector(".sp-preview");
            bt.style.width = "14px";
            bt.style.height = "14px";
            var bx = this.colorIcon.domWrapper.querySelector(".sp-replacer");
            bx.style.verticalAlign = "-7px";
            bx.style.height = "16px";
            bx.style.width = "16px";
            var bp = this.colorIcon.domWrapper.querySelector(".sp-dd");
            bp.innerHTML = "<bolder>T</bolder>";
            bp.style.zIndex = "100";
            bp.style.position = "relative";
            bp.style.top = "-19px";
            bp.style.height = "12px";
            bp.style.fontSize = "25px";
            // spec.width="10px";
            //	spec.height="10px";
            this._designToolbar.add(this.colorIcon);
        }
        _createBGColorIcon() {
            var _this = this;
            this.bgcolorIcon = new Textbox_1.Textbox({ useWrapper: true });
            var spec = $(this.bgcolorIcon.dom)["spectrum"]({
                color: "#f00",
                showPalette: true,
                palette: [
                    ['black'], ["brown"], ["blue"], ["green"], ["red"], ["orange"], ["yellow"], ['white']
                ],
                change: function (color) {
                    var scolor = color.toHexString();
                    if (color.toName())
                        scolor = color.toName();
                    _this.setStyle("backgroundColor", scolor);
                    // debugger;
                    //		    _this.paletteChanged(color.toHexString()); // #ff0000
                }
            });
            //correct height
            var bt = this.bgcolorIcon.domWrapper.querySelector(".sp-preview");
            bt.style.width = "14px";
            bt.style.height = "14px";
            var bx = this.bgcolorIcon.domWrapper.querySelector(".sp-replacer");
            bx.style.verticalAlign = "-7px";
            bx.style.height = "16px";
            bx.style.width = "16px";
            // spec.width="10px";
            //	spec.height="10px";
            this._designToolbar.add(this.bgcolorIcon);
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
                this.changeText(to, neu.substring(0, frompos) + "" + neu.substring(topos), true);
            }
            else {
                if (from.nodeType === from.TEXT_NODE) {
                    this.changeText(from, from.textContent.substring(0, frompos), true);
                }
                if (to.nodeType === from.TEXT_NODE) {
                    this.changeText(to, to.textContent.substring(topos), true);
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
                                                                                            this.deleteNodeBetween(from,to);
                                                                                        this.changeText(from, from.textContent.substring(0, frompos));
                                                                                        this.changeText(to, to.textContent.substring(topos));
                }else{
                                                                                            this.deleteNodeBetween(from.childNodes[frompos],to);
    
                                                                                        this.changeText(to, to.textContent.substring(topos));
                }
            }*/
        }
        changeText(node, text, deleteNodeIfEmpty = false) {
            var varname = this.codeEditor.getVariableFromObject(node._this);
            if (this._propertyEditor.codeEditor) {
                if (deleteNodeIfEmpty && text === "") {
                    var s = this.componentsToString([node._this]);
                    this.deleteComponents(s);
                }
                else
                    this._propertyEditor.setPropertyInCode("text", '"' + text + '"', true, varname);
            }
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
                    comp2.init(<any>nd, {});
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
            /*        var comp2 = new TextComponent();
                                                                                                            var newone = document.createTextNode(text);
                                                                                                            comp2.init(<any>newone, {noWrapper: true });*/
            var comp2 = new Component_1.TextComponent();
            var newone = comp2.dom;
            return this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, par, before, true, "text");
            ;
        }
        insertLineBreak(sel, atEndOfContainer = undefined) {
            var enter = (0, Component_1.createComponent)(React.createElement("br"));
            var center, comp;
            if (sel.anchorNode.nodeType !== sel.anchorNode.TEXT_NODE) {
                if (atEndOfContainer !== undefined) {
                    center = this.createComponent(Classes_1.classes.getClassName(enter), enter, undefined, undefined, atEndOfContainer, undefined, true, "br");
                }
                else {
                    comp = sel.anchorNode._this;
                    center = this.createComponent(Classes_1.classes.getClassName(enter), enter, undefined, undefined, comp._parent, comp, true, "br");
                }
            }
            else {
                comp = this.splitText(sel)[1];
                center = this.createComponent(Classes_1.classes.getClassName(enter), enter, undefined, undefined, comp._parent, comp, true, "br");
            }
            this._propertyEditor.setPropertyInCode("tag", "\"br\"", true, this.codeEditor.getVariableFromObject(center));
        }
        keydown(e) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var dummyPre = undefined;
            //predeummy is selected
            if (((_a = this.lastSelectedDummy) === null || _a === void 0 ? void 0 : _a.pre) && this.lastSelectedDummy.component !== undefined) {
                this.select(this.lastSelectedDummy.component.dom, 0);
                dummyPre = true;
            }
            if (!((_b = this.lastSelectedDummy) === null || _b === void 0 ? void 0 : _b.pre) && this.lastSelectedDummy.component !== undefined) {
                var con = this.lastSelectedDummy.component;
                this.select(con.dom, 0);
                dummyPre = false;
            }
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
            if (sel.anchorNode === null && sel.focusNode == null)
                return;
            if (sel.anchorNode === null) {
                /*  var nd = document.createTextNode("");
                                                                                                                var comp2 = new TextComponent();
                                                                                                                comp2.init(<any>nd, {noWrapper: true });*/
                var comp2 = new Component_1.TextComponent();
                var nd = comp2.dom;
                if (this.lastSelectedDummy.pre)
                    var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, this._propertyEditor.value._parent, this._propertyEditor.value, true, "text");
                else
                    var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, this._propertyEditor.value, undefined, true, "text");
                this.select(comp2.dom, 0, comp2.dom, 0);
                var selection = getSelection();
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
            //Table up =up in same column
            if (e.keyCode === 38 && (((_c = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode) === null || _c === void 0 ? void 0 : _c.tagName) == "TR" || ((_d = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode.parentNode) === null || _d === void 0 ? void 0 : _d.tagName) == "TR")) {
                var tr = ((_e = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode) === null || _e === void 0 ? void 0 : _e.tagName) == "TR" ? focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode : focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode.parentNode;
                var td = focusNode;
                if (((_f = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode) === null || _f === void 0 ? void 0 : _f.tagName) == "TD")
                    td = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode;
                var poscol = -1;
                for (var x = 0; x < tr.children.length; x++) {
                    if (tr.children[x] === td)
                        poscol = x;
                }
                var posrow = -1;
                for (var x = 0; x < tr.parentNode.children.length; x++) {
                    if (tr.parentNode.children[x] === tr)
                        posrow = x;
                }
                if (posrow !== -1 && posrow > 0 && poscol !== -1 && tr.parentNode.children[posrow - 1].children.length > poscol) {
                    e.preventDefault();
                    const cell = tr.parentNode.children[posrow - 1].children[poscol];
                    this.select(cell, 0);
                    return;
                }
            }
            //Table down =down in same column
            if (e.keyCode === 40 && (((_g = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode) === null || _g === void 0 ? void 0 : _g.tagName) == "TR" || ((_h = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode.parentNode) === null || _h === void 0 ? void 0 : _h.tagName) == "TR")) {
                var tr = ((_j = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode) === null || _j === void 0 ? void 0 : _j.tagName) == "TR" ? focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode : focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode.parentNode;
                var td = focusNode;
                if (((_k = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode) === null || _k === void 0 ? void 0 : _k.tagName) == "TD")
                    td = focusNode === null || focusNode === void 0 ? void 0 : focusNode.parentNode;
                var poscol = -1;
                for (var x = 0; x < tr.children.length; x++) {
                    if (tr.children[x] === td)
                        poscol = x;
                }
                var posrow = -1;
                for (var x = 0; x < tr.parentNode.children.length; x++) {
                    if (tr.parentNode.children[x] === tr)
                        posrow = x;
                }
                if (posrow !== -1 && posrow < (tr.parentNode.children.length - 1) && poscol !== -1 && tr.parentNode.children[posrow + 1].children.length > poscol) {
                    e.preventDefault();
                    const cell = tr.parentNode.children[posrow + 1].children[poscol];
                    this.select(cell, 0);
                    return;
                }
            }
            if (e.keyCode === 13) {
                e.preventDefault();
                this.insertLineBreak(sel, dummyPre === false ? this.lastSelectedDummy.component : undefined);
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
                    if (sel.anchorNode === sel.focusNode && sel.anchorNode.nodeName === "TD") {
                        console.log("return");
                        return;
                    }
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
                    if (dummyPre === true) {
                        var before = undefined;
                        // if (anchorNode.childNodes.length > anchorOffset) {
                        before = anchorNode._this;
                        //}
                        anchorOffset = 0;
                        anchorNode = this.createTextComponent(e.key, anchorNode._this._parent, before).dom;
                        neu = e.key;
                    }
                    else if (dummyPre === false) {
                        var container = this.lastSelectedDummy.component;
                        //}
                        anchorOffset = 0;
                        anchorNode = this.createTextComponent(e.key, container, undefined).dom;
                        neu = e.key;
                    }
                    else { //insert in Container
                        var desc = ComponentDescriptor_1.ComponentDescriptor.describe(anchorNode._this.constructor);
                        var fnew = desc.findField("children");
                        if (fnew === undefined)
                            return;
                        var before = undefined;
                        if (anchorNode.childNodes.length > anchorOffset) {
                            before = anchorNode.childNodes[anchorOffset]._this;
                        }
                        anchorOffset = 0;
                        anchorNode = this.createTextComponent(e.key, anchorNode._this, before).dom;
                        neu = e.key;
                    }
                }
                this.changeText(anchorNode, neu);
                e.preventDefault();
                this.select(anchorNode, anchorOffset + 1);
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