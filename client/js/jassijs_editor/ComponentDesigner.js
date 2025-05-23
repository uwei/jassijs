var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/util/Resizer", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs/ui/Button", "jassijs_editor/util/DragAndDropper", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Classes", "jassijs/ui/BoxPanel", "jassijs/ui/StateBinder"], function (require, exports, Registry_1, Panel_1, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, Resizer_1, CodeEditorInvisibleComponents_1, Button_1, DragAndDropper_1, ComponentDescriptor_1, Classes_1, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentDesigner = exports.ClipboardData = void 0;
    Registry_1 = __importStar(Registry_1);
    //import { Parser } from "./util/Parser";
    class ClipboardData {
        constructor() {
            this.varNamesToCopy = [];
            this.children = {};
            this.properties = {};
            this.types = {};
            this.allChilds = [];
        }
    }
    exports.ClipboardData = ClipboardData;
    let ComponentDesigner = class ComponentDesigner extends Panel_1.Panel {
        constructor(props) {
            super(props);
            this.lastSelectedDummy = {
                component: undefined,
                pre: false
            };
            this._codeEditor = undefined;
            this._initDesign();
            this.editMode = true;
        }
        connectParser(parser) {
            this._propertyEditor.parser = parser;
        }
        set codeEditor(value) {
            var _this = this;
            this._codeEditor = value;
            this.variables = this._codeEditor.variables;
            this._propertyEditor = new PropertyEditor_1.PropertyEditor(value, undefined);
            //   this._propertyEditor=new PropertyEditor(undefined);
            this._errors = this._codeEditor._errors;
            this._componentPalette = new ComponentPalette_1.ComponentPalette();
            this._componentPalette.service = "$UIComponent";
            this._componentExplorer = new ComponentExplorer_1.ComponentExplorer(value, this._propertyEditor);
            this._invisibleComponents = new CodeEditorInvisibleComponents_1.CodeEditorInvisibleComponents(value);
            this.add(this._invisibleComponents);
            this._initComponentExplorer();
            this._installView();
            this._codeEditor._codePanel.onblur(function (evt) {
                _this._propertyEditor.updateParser();
            });
            this.registerKeys();
        }
        get codeEditor() {
            return this._codeEditor;
        }
        _initDesign() {
            var _this = this;
            this._designToolbar = new Panel_1.Panel();
            this._designPlaceholder = new Panel_1.Panel();
            this.editButton = new Button_1.Button();
            this.editButton.icon = "mdi mdi-run mdi-18px";
            this.editButton.tooltip = "Test Dialog";
            this.editButton.onclick(function () {
                _this.editDialog(!_this.editMode);
            });
            this._designToolbar.add(this.editButton);
            this.saveButton = new Button_1.Button();
            this.saveButton.tooltip = "Save(Ctrl+S)";
            this.saveButton.icon = "mdi mdi-content-save mdi-18px";
            this.saveButton.onclick(function () {
                _this.save();
            });
            this._designToolbar.add(this.saveButton);
            /*  this.runButton = new Button();
              this.runButton.icon = "mdi mdi-car-hatchback mdi-18px";
              this.runButton.tooltip = "Run(F4)";
              this.runButton.onclick(function () {
                  _this.evalCode();
              });
              this._designToolbar.add(this.runButton);*/
            this.undoButton = new Button_1.Button();
            this.undoButton.icon = "mdi mdi-undo mdi-18px";
            this.undoButton.tooltip = "Undo (Strg+Z)";
            this.undoButton.onclick(function () {
                _this.undo();
            });
            this._designToolbar.add(this.undoButton);
            /*  var test=new Button();
             test.icon="mdi mdi-bug mdi-18px";
             test.tooltip="Test";
             test.onclick(function(){
                         //var kk=_this._codeView.layout;
             });
             this._designToolbar.add(test);*/
            this.lassoButton = new Button_1.Button();
            this.lassoButton.icon = "mdi mdi-lasso mdi-18px";
            this.lassoButton.tooltip = "Select rubberband";
            this.lassoButton.onclick(function () {
                var val = _this.lassoButton.toggle();
                _this._resizer.setLassoMode(val);
                _this._draganddropper.enableDraggable(!val);
                //_this._draganddropper.activateDragging(!val);
            });
            this._designToolbar.add(this.lassoButton);
            this.cutButton = new Button_1.Button();
            this.cutButton.icon = "mdi mdi-content-cut mdi-18px";
            this.cutButton.tooltip = "Cut selected Controls (Ctrl+Shift+X)";
            this.cutButton.onclick(function () {
                _this.cutComponent();
            });
            this._designToolbar.add(this.cutButton);
            this.copyButton = new Button_1.Button();
            this.copyButton.icon = "mdi mdi-content-copy mdi-18px";
            this.copyButton.tooltip = "Copy (Ctrl+Shift+C)";
            this.copyButton.onclick(function () {
                _this.copy();
            });
            this._designToolbar.add(this.copyButton);
            this.pasteButton = new Button_1.Button();
            this.pasteButton.icon = "mdi mdi-content-paste mdi-18px";
            this.pasteButton.tooltip = "Paste (Ctrl+Shift+V)";
            this.pasteButton.onclick(function () {
                _this.paste();
            });
            this._designToolbar.add(this.pasteButton);
            var box = new BoxPanel_1.BoxPanel();
            box.horizontal = true;
            this.inlineEditorPanel = new Panel_1.Panel();
            this.inlineEditorPanel._id = "i" + this.inlineEditorPanel._id;
            this.inlineEditorPanel.dom.setAttribute("id", this.inlineEditorPanel._id);
            this.inlineEditorPanel.dom.style.display = "inline";
            this.inlineEditorPanel.domWrapper.style.display = "inline";
            this.inlineEditorPanel.dom.classList.add("InlineEditorPanel");
            //   box.height=40;
            box.add(this._designToolbar);
            box.add(this.inlineEditorPanel);
            this.add(box);
            this._designPlaceholder.domWrapper.style.position = "relative";
            this.dummyHolder = document.createElement("span");
            this.__dom.append(this.dummyHolder);
            this.add(this._designPlaceholder);
        }
        /**
       * manage shortcuts
       */
        registerKeys() {
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
        resize() {
            this._updateInvisibleComponents();
        }
        _installView() {
            this._codeEditor._main.add(this._propertyEditor, "Properties", "properties");
            this._codeEditor._main.add(this._componentExplorer, "Components", "components");
            this._codeEditor._main.add(this._componentPalette, "Palette", "componentPalette");
            this._codeEditor._main.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        _updateInvisibleComponents() {
            var _this = this;
            this._invisibleComponents.update();
        }
        _initComponentExplorer() {
            var _this = this;
            this._componentExplorer.onselect(function (data) {
                // console.log(_this._componentExplorer.selection);
                //  var ob = data.data;
                setTimeout(() => {
                    var sel = _this._componentExplorer.tree.selection;
                    if (sel.length === 1)
                        sel = sel[0];
                    _this._propertyEditor.value = sel;
                }, 10);
            });
            this._componentExplorer.getComponentName = function (item) {
                var varname = _this._codeEditor.getVariableFromObject(item);
                if (varname === undefined)
                    return;
                if (varname.startsWith("this."))
                    return varname.substring(5);
                return varname;
            };
        }
        deleteComponents(text) {
            var _a;
            var clip = JSON.parse(text); //to Clipboard
            var all = [];
            for (var x = 0; x < clip.allChilds.length; x++) {
                var varname = clip.allChilds[x]; //this._codeEditor.getVariableFromObject(todel);
                var todel = this._codeEditor.getObjectFromVariable(varname);
                if (varname !== "this") {
                    if (((_a = todel === null || todel === void 0 ? void 0 : todel.domWrapper) === null || _a === void 0 ? void 0 : _a._parent) !== undefined) {
                        todel.domWrapper._parent.remove(todel);
                    }
                    all.push(varname);
                    this._propertyEditor.removeVariableInDesign(varname);
                }
            }
            console.log(all);
            this._propertyEditor.removeVariablesInCode(all);
            this._componentExplorer.update();
        }
        /**
         * removes the selected component
         */
        async cutComponent() {
            var text = await this.copy();
            if (await navigator.clipboard.readText() !== text) {
                alert("could not copy to Clipboard.");
                return;
            }
            this.deleteComponents(text);
            this._updateInvisibleComponents();
            this.updateDummies();
        }
        copyProperties(clip, component) {
            var _a;
            var varname = this._codeEditor.getVariableFromObject(component);
            var parserdata = this._propertyEditor.parser.data[varname];
            clip.allChilds.push(varname);
            clip.types[varname] = Classes_1.classes.getClassName(component);
            if (!clip.properties[varname]) {
                clip.properties[varname] = {};
            }
            var editorfields = {};
            (_a = ComponentDescriptor_1.ComponentDescriptor.describe(component.constructor)) === null || _a === void 0 ? void 0 : _a.fields.forEach((f) => { editorfields[f.name] = f; });
            for (var key in parserdata) {
                //if (editorfields[key] ||key === "_new_" || key === "add") {
                if (!clip.properties[varname][key]) {
                    clip.properties[varname][key] = [];
                }
                for (var i = 0; i < parserdata[key].length; i++) {
                    //only add fields in Propertydescriptor
                    clip.properties[varname][key].push(parserdata[key][i].value);
                }
                //}
            }
            if (component["_components"]) {
                for (var x = 0; x < component["_components"].length; x++) {
                    var childname = this._codeEditor.getVariableFromObject(component["_components"][x]);
                    if (childname) {
                        if (clip.children[varname] === undefined) {
                            clip.children[varname] = [];
                        }
                        clip.children[varname].push(childname);
                        this.copyProperties(clip, component["_components"][x]);
                    }
                }
            }
        }
        componentsToString(components) {
            var clip = new ClipboardData();
            clip.varNamesToCopy = [];
            for (var x = 0; x < components.length; x++) {
                var component = components[x];
                var varname = this._codeEditor.getVariableFromObject(component);
                clip.varNamesToCopy.push(varname);
                this.copyProperties(clip, component);
            }
            var text = JSON.stringify(clip);
            return text;
        }
        async copy() {
            var components = this._propertyEditor.value;
            if (!Array.isArray(components)) {
                components = [components];
            }
            var text = this.componentsToString(components);
            await navigator.clipboard.writeText(text);
            return text;
        }
        async pasteComponent(clip, target, before, varname, variablelistold, variablelistnew) {
            var _this = this;
            var created;
            console.log(clip);
            if (clip.properties[varname] !== undefined && clip.properties[varname]["_new_"] !== undefined) {
                var vartype = clip.properties[varname]["_new_"][0];
                if (variablelistold.indexOf(varname) > -1)
                    return;
                vartype = vartype.split("(")[0].split("new ")[1];
                var targetname = _this._codeEditor.getVariableFromObject(target);
                var newcomp = { createFromType: clip.types[varname] };
                await Classes_1.classes.loadClass(clip.types[varname]);
                var svarname = varname.split(".")[varname.split(".").length - 1];
                created = _this.createComponent(clip.types[varname], newcomp, undefined, undefined, target, before, false, svarname, false);
                variablelistold.push(varname);
                var newvarname = _this._codeEditor.getVariableFromObject(created);
                variablelistnew.push(newvarname);
                //correct designdummy
                for (var t = 0; t < target._components.length; t++) {
                    var ch = target._components[t];
                    if (ch["type"] === "atEnd") {
                        target.remove(ch);
                        // target.add(ch);
                        break;
                    }
                }
            }
            else {
                //component is already created outside the code
                created = _this._codeEditor.getObjectFromVariable(varname);
            }
            if (clip.children[varname] !== undefined) {
                for (var k = 0; k < clip.children[varname].length; k++) {
                    await _this.pasteComponent(clip, created, undefined, clip.children[varname][k], variablelistold, variablelistnew);
                }
            }
            return created;
        }
        async pasteComponents(text, parent, before = undefined) {
            var _this = this;
            var variablelistold = [];
            var variablelistnew = [];
            var clip = JSON.parse(text);
            //create Components
            for (var x = 0; x < clip.varNamesToCopy.length; x++) {
                var varname = clip.varNamesToCopy[x];
                await _this.pasteComponent(clip, parent, before, varname, variablelistold, variablelistnew);
                //set properties
            }
            //in the new Text the variables are renamed
            var textnew = text;
            for (var x = 0; x < variablelistnew.length; x++) {
                var oldName = variablelistold[x];
                var newName = variablelistnew[x];
                if (oldName !== newName) {
                    var reg = new RegExp("\\W" + oldName + "\\W");
                    var found = true;
                    while (found == true) {
                        found = false;
                        textnew = textnew.replace(reg, function replacer(match, offset, string) {
                            // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                            found = true;
                            return match.substring(0, 1) + newName + match.substring(match.length - 1, match.length);
                        });
                    }
                }
            }
            clip = JSON.parse(textnew);
            //set properties
            for (var x = 0; x < variablelistnew.length; x++) {
                var variablename = variablelistnew[x];
                for (var key in clip.properties[variablename]) {
                    if (key !== "_new_" && key !== "config" && key != "add") {
                        var propdata = clip.properties[variablename][key];
                        for (var v = 0; v < propdata.length; v++) {
                            var svalue = propdata[v];
                            var component = _this._codeEditor.getObjectFromVariable(variablename);
                            var argnames = [];
                            var args = [];
                            var allvars = _this.codeEditor.variables.value;
                            //introduce variables replace me.textbox1->me_textbox1
                            for (var vv = 0; vv < allvars.length; vv++) {
                                var newvarname = allvars[vv].name.replaceAll(".", "_");
                                svalue = svalue.replaceAll(allvars[vv].name, newvarname);
                                if (newvarname !== "this") {
                                    argnames.push(newvarname);
                                    args.push(allvars[vv].value);
                                }
                            }
                            try {
                                //set value in Designer
                                var realvalue = new Function(...argnames, "return (" + svalue + ");").bind(_this._codeEditor.getObjectFromVariable("this"))(...args);
                                if (typeof (component[key]) === "function") {
                                    component[key](realvalue);
                                }
                                else {
                                    component[key] = realvalue;
                                }
                            }
                            catch (_a) {
                            }
                            //_this._propertyEditor.setPropertyInDesign(key,value);
                            _this._propertyEditor.setPropertyInCode(key, propdata[v], propdata.length > 0, variablename, undefined, undefined, false);
                        }
                    }
                }
            }
            _this.variables.updateCache();
        }
        async paste() {
            var text = await navigator.clipboard.readText();
            //    var clip: ClipboardData = JSON.parse(text);
            var _this = this;
            var target = _this._propertyEditor.value;
            var insertBefore = target._components === undefined;
            if (this.lastSelectedDummy.component === target && this.lastSelectedDummy.pre)
                insertBefore = true;
            if (this.lastSelectedDummy.component === target && !this.lastSelectedDummy.pre)
                insertBefore = false;
            if (!insertBefore)
                await this.pasteComponents(text, target, undefined); // await _this.pasteComponent(clip, target, undefined, varname, variablelistold, variablelistnew);
            else {
                // if(x===0)
                //    before=target;
                await this.pasteComponents(text, target._parent, target); //await _this.pasteComponent(clip, target._parent, target, varname, variablelistold, variablelistnew);
            }
            //_this._propertyEditor.value = created;
            // _this._propertyEditor.codeEditor.value = _this._propertyEditor.parser.getModifiedCode();
            _this._propertyEditor.updateParser();
            _this.codeHasChanged();
            // _this._propertyEditor.callEvent("codeChanged", {});
            //include the new element
            _this.editDialog(true);
            //  _this._componentExplorer.update();
            //  _this._updateInvisibleComponents();
        }
        /**
        * execute the current code
        * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
        *                              if false at the end of the layout() function or at the end of the code
        */
        evalCode(toCursor = undefined) {
            this._codeEditor.evalCode(toCursor);
        }
        /**
        * save the code to server
        */
        save() {
            this._codeEditor.save();
        }
        /**
         * undo action
         */
        undo() {
            this._codeEditor.undo();
        }
        getComponentIDsInDesign(component, collect) {
            collect.push("#" + component._id);
            var childs = component["_components"];
            if (childs !== undefined) {
                for (let x = 0; x < childs.length; x++) {
                    this.getComponentIDsInDesign(childs[x], collect);
                }
            }
        }
        createDragAndDropper() {
            return new DragAndDropper_1.DragAndDropper();
        }
        selectComponents(components) {
            var component = this._designPlaceholder._components[0];
            component.dom.querySelectorAll(".jselected").forEach((c) => { c.classList.remove("jselected"); });
            //                   $(".jselected").removeClass("jselected");
            for (var x = 0; x < components.length; x++) {
                if (components[x]["editorselectthis"])
                    components[x] = components[x]["editorselectthis"];
                components[x].domWrapper.classList.add("jselected");
            }
            if (components.length === 1) {
                this._propertyEditor.value = components[0];
                this._componentExplorer.select(components[0]);
            }
            else if (components.length > 0) {
                this._propertyEditor.value = components;
                this._componentExplorer.select(components[0]);
            }
        }
        /**
         * dialog edit mode
         * @param {boolean} enable - if true allow resizing and drag and drop
         */
        editDialog(enable) {
            var _this = this;
            this.editMode = enable;
            this.editButton.toggle(!this.editMode);
            this.undoButton.hidden = !enable;
            this.lassoButton.hidden = !enable;
            this.cutButton.hidden = !enable;
            this.copyButton.hidden = !enable;
            this.pasteButton.hidden = !enable;
            var component = this._designPlaceholder._components[0];
            //switch designmode
            var comps = component.dom.querySelectorAll(".jeditablecomponent");
            if (enable)
                comps.forEach((c) => c.classList.add("jdesignmode"));
            else
                comps.forEach((c) => c.classList.remove("jdesignmode"));
            for (var c = 0; c < comps.length; c++) {
                if (comps[c]._this["extensionCalled"] !== undefined) {
                    comps[c]._this["extensionCalled"]({
                        componentDesignerSetDesignMode: { enable, componentDesigner: this }
                    });
                }
            }
            if (component["extensionCalled"] !== undefined) {
                component["extensionCalled"]({
                    componentDesignerSetDesignMode: { enable, componentDesigner: this }
                });
            }
            this.variables.updateCache(); //variables can be added with Repeater.setDesignMode
            if (this._resizer !== undefined) {
                this._resizer.uninstall();
            }
            if (this._draganddropper !== undefined) {
                this._draganddropper.uninstall();
            }
            if (enable === true) {
                var _this = this;
                var allcomponents = this.variables.getEditableComponents(component);
                if (this._propertyEditor.codeEditor === undefined) {
                    var ret = [];
                    this.getComponentIDsInDesign(component, ret);
                    allcomponents = ret.join(",");
                }
                else
                    allcomponents = this.variables.getEditableComponents(component);
                //this._installTinyEditor();
                // this._draganddropper = this.createDragAndDropper();
                this._resizer = new Resizer_1.Resizer();
                this._resizer.draganddropper = this._draganddropper;
                this._resizer.onelementselected = function (elementIDs, e) {
                    var ret = [];
                    for (var x = 0; x < elementIDs.length; x++) {
                        var ob = document.getElementById(elementIDs[x])._this;
                        ret.push(ob);
                    }
                    _this.selectComponents(ret);
                };
                this._resizer.onpropertychanged = function (comp, prop, value) {
                    if (_this._propertyEditor.value !== comp)
                        _this._propertyEditor.value = comp;
                    _this._propertyEditor.setPropertyInCode(prop, value + "", true);
                    _this._propertyEditor.value = _this._propertyEditor.value;
                    // _this._propertyEditor.setPropertyInDesign(prop, value);
                    console.log(value);
                    _this.updateDummies();
                };
                this._resizer.install(component, allcomponents);
                allcomponents = this.variables.getEditableComponents(component, true);
                if (this._draganddropper) {
                    this._draganddropper.install(component, allcomponents);
                    this._draganddropper.onpropertychanged = function (component, top, left, oldParent, newParent, beforeComponent) {
                        _this.moveComponent(component, top, left, oldParent, newParent, beforeComponent);
                    };
                    this._draganddropper.onpropertyadded = function (type, component, top, left, newParent, beforeComponent) {
                        _this.createComponent(type, component, top, left, newParent, beforeComponent);
                    };
                    this._draganddropper.isDragEnabled = function (event, ui) {
                        if (_this._resizer === undefined)
                            return false;
                        return _this._resizer.componentUnderCursor !== undefined;
                    };
                }
                this.dummyHolder.hidden = false;
            }
            else {
                this.dummyHolder.hidden = true;
            }
            this._componentExplorer.update();
        }
        /**
         * move a component
         * @param {jassijs.ui.Component} component - the component to move
         * @param {number} top - the top absolute position
         * @param {number} left - the left absolute position
         * @param {jassijs.ui.Container} newParent - the new parent container where the component move to
         * @param {jassijs.ui.Component} beforeComponent - insert the component before beforeComponent
         **/
        moveComponent(component, top, left, oldParent, newParent, beforeComponent) {
            var _this = this;
            var oldName = _this._codeEditor.getVariableFromObject(oldParent);
            var newName = _this._codeEditor.getVariableFromObject(newParent);
            var compName = _this._codeEditor.getVariableFromObject(component);
            if (top !== undefined) {
                _this._propertyEditor.setPropertyInCode("x", top + "", true);
            }
            else {
                _this._propertyEditor.removePropertyInCode("x");
            }
            if (left !== undefined) {
                _this._propertyEditor.setPropertyInCode("y", left + "", true);
            }
            else {
                _this._propertyEditor.removePropertyInCode("y");
            }
            if (oldParent !== newParent || beforeComponent !== undefined || top === undefined) { //top=undefined ->on relative position at the end call the block
                //get Position
                var oldVal = _this._propertyEditor.removePropertyInCode("add", compName, oldName, false);
                var before;
                if (beforeComponent !== undefined && beforeComponent.type !== "atEnd") { //designdummy atEnd
                    var on = _this._codeEditor.getVariableFromObject(beforeComponent);
                    var par = _this._codeEditor.getVariableFromObject(beforeComponent._parent);
                    before = { variablename: par, property: "add", value: on };
                }
                _this._propertyEditor.setPropertyInCode("add", /*compName*/ oldVal, false, newName, before);
            }
            _this.variables.updateCache();
            _this._propertyEditor.value = _this._propertyEditor.value;
            _this._componentExplorer.value = _this._componentExplorer.value;
        }
        /**
         * create a new component
         * @param {string} type - the type of the new component
         * @param {jassijs.ui.Component} component - the component themself
         * @param {number} top - the top absolute position
         * @param {number} left - the left absolute position
         * @param {jassijs.ui.Container} newParent - the new parent container where the component is placed
         * @param {jassijs.ui.Component} beforeComponent - insert the new component before beforeComponent
         **/
        createComponent(type, component, top, left, newParent, beforeComponent, doUpdate = true, suggestedName = undefined, refresh = undefined) {
            var _this = this;
            /*if(beforeComponent!==undefined&&beforeComponent.designDummyFor&&beforeComponent.type==="atEnd"){
                beforeComponent=undefined;
            }*/
            var file = type.replaceAll(".", "/");
            var stype = file.split("/")[file.split("/").length - 1];
            Registry_1.default.getJSONData("$Class", type).then((data) => {
                var filename = data[0].filename;
                _this._propertyEditor.addImportIfNeeded(stype, filename.substring(0, filename.lastIndexOf(".")));
            });
            var scope = undefined;
            var varvalue;
            if (Classes_1.classes.getClassName(component) === type)
                varvalue = component;
            else
                varvalue = new (Classes_1.classes.getClass(type));
            var varname = _this.createVariable(type, scope, varvalue, suggestedName, refresh);
            if (this._propertyEditor.codeEditor !== undefined) {
                var newName = _this._codeEditor.getVariableFromObject(newParent);
                var before;
                if (beforeComponent !== undefined && beforeComponent.type !== "atEnd") { //Designdummy atEnd
                    //if(beforeComponent.type==="beforeComponent")
                    //   beforeComponent=beforeComponent.designDummyFor;
                    var on = _this._codeEditor.getVariableFromObject(beforeComponent);
                    var par = _this._codeEditor.getVariableFromObject(beforeComponent._parent);
                    before = { variablename: par, property: "add", value: on };
                }
                _this._propertyEditor.setPropertyInCode("add", varname, false, newName, before, scope);
            }
            if (beforeComponent !== undefined) {
                newParent.addBefore(varvalue, beforeComponent);
            }
            else {
                newParent.add(varvalue);
            }
            if (refresh)
                _this.variables.updateCache();
            //set initial properties for the new component
            if (component.createFromParam !== undefined) {
                for (var key in component.createFromParam) {
                    var val = component.createFromParam[key];
                    if (typeof val === 'string')
                        val = '"' + val + '"';
                    _this._propertyEditor.setPropertyInCode(key, val, true, varname);
                }
                $.extend(varvalue, component.createFromParam);
            }
            if (top !== undefined) {
                _this._propertyEditor.setPropertyInCode("x", top + "", true, varname);
                varvalue.x = top;
            }
            if (left !== undefined) {
                _this._propertyEditor.setPropertyInCode("y", left + "", true, varname);
                varvalue.y = left;
            }
            //notify componentdescriptor 
            var ac = varvalue.extensionCalled;
            if (ac !== undefined) {
                varvalue.extensionCalled({
                    componentDesignerComponentCreated: {
                        newParent: newParent
                    }
                });
            }
            if (doUpdate) {
                _this._propertyEditor.value = varvalue;
                //include the new element
                _this.editDialog(true);
                _this._componentExplorer.update();
                _this._updateInvisibleComponents();
                _this.updateDummies();
            }
            return varvalue;
        }
        createVariable(type, scope, varvalue, suggestedName = undefined, refresh = undefined) {
            if (this._propertyEditor.codeEditor === undefined)
                return;
            var varname = this._propertyEditor.addVariableInCode(type, scope, suggestedName);
            /* if (varname.startsWith("me.") && this._codeEditor.getObjectFromVariable("me") !== undefined) {
                 var me = this._codeEditor.getObjectFromVariable("me");
                 me[varname.substring(3)] = varvalue;
             } else if (varname.startsWith("this.")) {
                 var th = this._codeEditor.getObjectFromVariable("this");
                 th[varname.substring(5)] = varvalue;
             } else*/
            this.variables.addVariable(varname, varvalue, refresh, true);
            return varname;
        }
        fillVariables(root, component, cache) {
            var _a;
            if (cache[component._id] === undefined && component["__stack"] !== undefined) {
                var lines = (_a = component["__stack"]) === null || _a === void 0 ? void 0 : _a.split("\n");
                for (var x = 0; x < lines.length; x++) {
                    var sline = lines[x];
                    if (sline.indexOf("$temp.js") > 0) {
                        var spl = sline.split(":");
                        var entr = {};
                        cache[component._id] = {
                            line: Number(spl[spl.length - 2]),
                            column: Number(spl[spl.length - 1].replace(")", ""))
                        };
                        break;
                    }
                }
                if (component["_components"]) {
                    for (var x = 0; x < component["_components"].length; x++) {
                        this.fillVariables(root, component["_components"][x], cache);
                    }
                }
                if (component === root) {
                    //fertig
                    var hh = 0;
                }
            }
        }
        codeHasChanged() {
            var _this = this;
            _this.updateDummies();
            _this._propertyEditor.codeEditor.value = _this._propertyEditor.parser.getModifiedCode();
            _this._propertyEditor.callEvent("codeChanged", {});
            _this._componentExplorer.update();
            _this._updateInvisibleComponents();
        }
        createPreDummy(node) {
            var _this = this;
            var dummy;
            //  if (ComponentDesigner.beforeDummy === undefined) {
            dummy = document.createElement("span");
            dummy.contentEditable = node.tagName.toUpperCase() === "BR" ? "true" : "false";
            dummy.draggable = true;
            dummy.classList.add("_dummy_");
            dummy.onkeydown = (e) => {
                if (_this.keydown) {
                    e.preventDefault();
                    _this.keydown(e);
                }
            };
            dummy.ondrop = (ev) => {
                ev.preventDefault();
                async function doit() {
                    var data = ev.dataTransfer.getData("text");
                    if (data.indexOf('"createFromType":') > -1) {
                        var toCreate = JSON.parse(data);
                        var cl = Classes_1.classes.getClass(toCreate.createFromType);
                        var newComponent = new cl();
                        newComponent.createFromParam = toCreate.createFromParam;
                        var beforeComponent = ev.target._this;
                        var newParent = beforeComponent._parent;
                        _this.createComponent(toCreate.createFromType, newComponent, undefined, undefined, newParent, beforeComponent); // beforeComponent);
                    }
                    else if (data.indexOf('"varNamesToCopy":') > -1) {
                        var beforeComponent = ev.target._this;
                        var newParent = beforeComponent._parent;
                        await _this.pasteComponents(data, newParent, beforeComponent);
                        _this.deleteComponents(data);
                    }
                    else {
                    }
                    _this.codeHasChanged();
                }
                ;
                doit();
            };
            dummy.onclick = (ev) => {
                var _a;
                ev.preventDefault();
                var all = [ev.target._this];
                if (node._thisOther) {
                    for (var x = 0; x < node._thisOther.length; x++) {
                        var varname = this._codeEditor.getVariableFromObject(node._thisOther[x]);
                        if (varname) {
                            all.push(node._thisOther[x]);
                            break;
                        }
                    }
                }
                var comp = ev.target._this;
                /* if (all.length > 1) {//there are more nodes under cursor so we switch the components
                     var pos = all.indexOf(_this._propertyEditor.value);
                     if (pos == -1)
                         pos = 0;
                     else
                         pos++;
                     if (pos >= all.length)
                         pos = 0;
                     comp = all[pos];
                 }*/
                _this._propertyEditor.value = comp;
                _this.lastSelectedDummy.component = comp;
                this.lastSelectedDummy.pre = true;
                if (((_a = _this.lastSelectedDummy.component.tag) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === "BR") {
                    //dummy.contentEditable=true;
                    //dummy.focus();//with this the keydown event will work
                    console.log("focus");
                }
                console.log("setcomp");
                /*  var newSel = getSelection();
                  var range = document.createRange();
                  range.setStart(_this.lastSelectedDummy.component.dom, 0);
                  newSel.removeAllRanges();
                  newSel.addRange(range);*/
                // (<any>newSel).modify("move", "left", "character");
                getSelection().removeAllRanges(); //the next paste is before the component
            };
            dummy.ondragover = (ev) => {
                ev.preventDefault();
            };
            dummy.ondragstart = ev => {
                ev.dataTransfer.setDragImage(event.target.nd, 20, 20);
                ev.dataTransfer.setData("text", _this.componentsToString([event.target._this]));
            };
            dummy.style.zIndex = "10000";
            dummy.style.backgroundColor = "rgba(245,234,39,0.6)";
            dummy.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
            dummy.style.fontSize = "10px";
            dummy.style.position = "absolute";
            dummy.ondragenter = dummy.onmouseenter = (e) => {
                e.target._this.dom.classList.add("dummyselected");
            };
            dummy.ondragleave = dummy.onmouseleave = (e) => e.target._this.dom.classList.remove("dummyselected");
            //  ComponentDesigner.beforeDummy = dummy;
            // }
            // dummy = ComponentDesigner.beforeDummy.cloneNode(true);
            return dummy;
        }
        createPostDummy() {
            var _this = this;
            var dummy;
            //  if (ComponentDesigner.beforeDummy === undefined) {
            dummy = document.createElement("span");
            dummy.contentEditable = "true";
            dummy.draggable = true;
            dummy.classList.add("_dummy_");
            dummy.classList.add("ui-droppable");
            dummy.onclick = (ev) => {
                _this._propertyEditor.value = ev.target._this;
                //getSelection().removeAllRanges();//the next paste is before the component
                _this.lastSelectedDummy.component = ev.target._this;
                this.lastSelectedDummy.pre = false;
                this.select(this.designedComponent.__dom, 0);
                //setTimeout(()=>getSelection().removeAllRanges(),3000);
            };
            //dummy.onclick = (ev) => console.log(ev);
            dummy.ondrop = (ev) => {
                ev.preventDefault();
                async function doit() {
                    var data = ev.dataTransfer.getData("text");
                    if (data.indexOf('"createFromType":') > -1) {
                        var toCreate = JSON.parse(data);
                        var cl = Classes_1.classes.getClass(toCreate.createFromType);
                        var newComponent = new cl();
                        newComponent.createFromParam = toCreate.createFromParam;
                        let newParent = ev.target._this;
                        _this.createComponent(toCreate.createFromType, newComponent, undefined, undefined, newParent, undefined); // beforeComponent);
                    }
                    else if (data.indexOf('"varNamesToCopy":') > -1) {
                        let newParent = ev.target._this;
                        await _this.pasteComponents(data, newParent, undefined);
                        _this.deleteComponents(data);
                    }
                    else {
                    }
                    _this.codeHasChanged();
                }
                ;
                doit();
            };
            /* dummy.onkeydown = (e) => {
                
                if ((<any>_this).keydown) {
                    e.preventDefault();
                    (<any>_this).keydown(e);
                }
            }*/
            dummy.ondragover = (ev) => {
                ev.preventDefault();
                //  ev.dataTransfer.dropEffect = "move";
            }; /*
            dummy.ondragstart = ev => {
                ev.dataTransfer.setDragImage((<any>event.target).nd, 20, 20);
                ev.dataTransfer.setData("text", "Hallo");
            }*/
            dummy.style.zIndex = "10000";
            dummy.style.backgroundColor = "rgba(56, 146, 232, 0.2)";
            dummy.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
            dummy.style.fontSize = "10px";
            dummy.style.position = "absolute";
            dummy.ondragenter = dummy.onmouseenter = (e) => {
                e.target._this.dom.classList.add("dummyselected");
                var name = this._codeEditor.getVariableFromObject(e.target._this);
                if (e.target._this.dom._backgroundsic === undefined)
                    e.target._this.dom._backgroundsic = e.target._this.dom.style["background-image"];
                e.target._this.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='12'>" + name + "</text></svg>" + '")';
            };
            dummy.ondragleave = dummy.onmouseleave = (e) => {
                e.target._this.dom.classList.remove("dummyselected");
                e.target._this.dom.style["background-image"] = e.target._this.dom._backgroundsic;
                delete e.target._this.dom._backgroundsic;
            };
            //   ComponentDesigner.beforeDummy = dummy;
            // }
            // dummy = ComponentDesigner.beforeDummy.cloneNode(true);
            return dummy;
        }
        insertDummies(node, root, arr, rootRect) {
            if (node._this === undefined)
                return;
            var node = node._this.dom; //eliminate Wrapper
            if (node._dummyholder === true)
                return;
            if (root === undefined)
                root = node;
            //only elements with varaiables can have dummies
            var allComponents = [];
            var varname = this._codeEditor.getVariableFromObject(node._this);
            if (varname)
                allComponents.push(node._this);
            if (node._thisOther) {
                for (var x = 0; x < node._thisOther.length; x++) {
                    var varname2 = this._codeEditor.getVariableFromObject(node._thisOther[x]);
                    if (varname2)
                        allComponents.push(node._thisOther[x]);
                }
            }
            for (var curComponent = 0; curComponent < allComponents.length; curComponent++) {
                varname = this._codeEditor.getVariableFromObject(allComponents[curComponent]);
                var comp = allComponents[curComponent];
                /* if (!varname && node._thisOther) {
                     for (var x = 0; x < node._thisOther.length; x++) {
                         varname = this._codeEditor.getVariableFromObject(node._thisOther[x]);
                         if (varname) {
                             comp = node._thisOther[x];
                             break;
                         }
                     }
                 }*/
                var hasChildren = false;
                var desc = ComponentDescriptor_1.ComponentDescriptor.describe(comp.constructor);
                var fnew = desc.findField("children");
                if (fnew) {
                    if ((fnew === null || fnew === void 0 ? void 0 : fnew.createDummyInDesigner) !== undefined) {
                        if (typeof (fnew.createDummyInDesigner) == "boolean") {
                            hasChildren = fnew.createDummyInDesigner;
                        }
                        else {
                            hasChildren = fnew.createDummyInDesigner(comp, false);
                        }
                    }
                    else {
                        hasChildren = true;
                    }
                    if (hasChildren) {
                        if (!node.classList.contains("jeditablecontainer")) {
                            node.classList.add("jeditablecontainer");
                        }
                    }
                }
                if (varname && node.classList) {
                    if (!node.classList.contains("jeditablecomponent")) {
                        node.classList.add("jeditablecomponent");
                    }
                }
                else {
                    if (node.contentEditable !== "false")
                        node.contentEditable = "false";
                }
                if ((fnew === null || fnew === void 0 ? void 0 : fnew.createDummyInDesigner) !== undefined) {
                    if (typeof (fnew.createDummyInDesigner) === "boolean") {
                        if (fnew.createDummyInDesigner === false)
                            varname = undefined;
                    }
                    else {
                        if (fnew.createDummyInDesigner(comp, true) === false)
                            varname = undefined;
                    }
                }
                if (node.getClientRects === undefined)
                    return;
                var rect = node.getClientRects()[0];
                if (rect === undefined)
                    return;
                rect = {
                    left: rect.left - rootRect.left + window.scrollX,
                    top: rect.top - rootRect.top + window.scrollY,
                    right: rect.right - rootRect.left + window.scrollX,
                    bottom: rect.bottom - rootRect.top + window.scrollY
                };
                if (node === null || node === void 0 ? void 0 : node.nd)
                    return;
                if (varname) {
                    var preDummy = undefined;
                    if (node._preDummies_)
                        preDummy = node._preDummies_[curComponent];
                    if (!preDummy) {
                        if (node._preDummies_ === undefined)
                            node._preDummies_ = [];
                        preDummy = this.createPreDummy(node);
                        preDummy.nd = node;
                        preDummy._this = comp;
                        preDummy.title = varname;
                        arr.push(preDummy);
                        node._preDummies_.push(preDummy);
                    }
                    var newTop = rect.top;
                    var newLeft = rect.left + curComponent * 8;
                    node.myTop = rect.top;
                    node.myLeft = rect.left;
                    var parentNode = node.parentNode;
                    //wrapper
                    if (node._this === node.parentNode._this)
                        parentNode = node.parentNode.parentNode;
                    if (parentNode._preDummies_) {
                        const rp = {
                            top: parentNode.myTop,
                            left: parentNode.myLeft,
                            right: parentNode.myLeft + parentNode._preDummies_.length * 8
                        };
                        if (rect.top > rp.top - 5 && rect.top < rp.top + 5 && rect.left > rp.left - 5 && rect.left < rp.right + 5) {
                            var pr = parentNode._preDummies_[parentNode._preDummies_.length - 1];
                            newLeft = parseInt(pr.style.left.replace("px", "")) + 8;
                        }
                    }
                    preDummy.style.top = newTop + "px";
                    preDummy.style.left = newLeft + "px";
                }
                if (hasChildren) {
                    var postDummy = undefined;
                    if (node._postDummies_)
                        postDummy = node._postDummies_[curComponent];
                    if (!(postDummy)) {
                        if (node._postDummies_ === undefined)
                            node._postDummies_ = [];
                        postDummy = this.createPostDummy();
                        postDummy.nd = node;
                        postDummy._this = comp;
                        postDummy.title = varname;
                        arr.push(postDummy);
                        node._postDummies_.push(postDummy);
                    }
                    var newBottom = rect.bottom;
                    var newRight = rect.right - curComponent * 8;
                    node.myBottom = rect.bottom;
                    node.myRight = rect.right;
                    //var par = (<any>node)._this._parent;
                    if (parentNode._postDummies_) {
                        const rp = {
                            bottom: parentNode.myBottom,
                            right: parentNode.myRight,
                            left: parentNode.myRight - parentNode._postDummies_.length * 8
                        };
                        if (rect.bottom > rp.bottom - 5 && rect.bottom < rp.bottom + 5 && rect.right > rp.right - 5 && rect.right < rp.right + 5) {
                            var pr = parentNode._postDummies_[parentNode._postDummies_.length - 1];
                            newRight = pr.style.left.replace("px", "");
                        }
                    }
                    postDummy.style.top = (newBottom - 8) + "px";
                    postDummy.style.left = (newRight - 8) + "px";
                }
            }
            for (var x = 0; x < node.childNodes.length; x++) {
                if (node._this !== node.childNodes[x]._this) //Wrapper
                    this.insertDummies(node.childNodes[x], root, arr, rootRect);
            }
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
        /**
         * @member {jassijs.ui.Component} - the designed component
         */
        set designedComponent(component) {
            this.fillVariables(component, component, {});
            var com = component;
            if (com["isAbsolute"] !== true && com.width === "0" && com.height === "0") {
                component.width = "calc(100% - 1px)";
                component.height = "calc(100% - 1px)";
            }
            if (this._codeEditor.__evalToCursorReached !== true) {
                this._codeEditor._main.show("design");
            }
            while (this._designPlaceholder._components.length > 0)
                this._designPlaceholder.remove(this._designPlaceholder._components[0], true);
            this._designPlaceholder.add(component);
            // 
            this._propertyEditor.updateParser();
            this.editDialog(this.editMode === undefined ? true : this.editMode);
            this._componentExplorer.value = component;
            this.dom.focus();
            this._updateInvisibleComponents();
            while (this.inlineEditorPanel.dom.firstChild) {
                this.inlineEditorPanel.dom.firstChild.remove();
            }
            this.updateDummies();
            this.callEvent("onDesignedComponentChanged", component);
            //var parser=new jassijs.ui.PropertyEditor.Parser();
            //parser.parse(_this.value);
        }
        onDesignedComponentChanged(handler) {
            this.addEvent("onDesignedComponentChanged", handler);
        }
        updateDummies() {
            var _a, _b;
            var arr = [];
            var component = this.designedComponent; //this._componentExplorer.value;
            if (this._lastComponent !== component) { //delete dummies if the designedComponent has changed
                //if((<any>this.dom).dummyholder)
                //  (<any>this.dom).dummyholder.innerHTML="";
                this.dummyHolder.innerHTML = ""; //delete all
                this._lastComponent = component;
            }
            /* if ((<any>this.dom).dummyholder === undefined) {
                 (<any>this.dom).dummyholder = document.createElement("span");
                 (<any>this.dom).dummyholder._dummyholder = true;
                 this.dom.prepend((<any>component.dom).dummyholder);
             }*/
            this.insertDummies(component.dom, this.dummyHolder, arr, this.dom.getClientRects()[0]);
            this.dummyHolder.append(...arr);
            component.dom.contentEditable = "true";
            this._designPlaceholder.domWrapper.contentEditable = "false";
            this._designPlaceholder.dom.contentEditable = "false";
            //delete removed dummies
            for (var x = 0; x < this.dummyHolder.childNodes.length; x++) {
                if (((_b = (_a = this.dummyHolder.childNodes[x]._this.dom) === null || _a === void 0 ? void 0 : _a._this) === null || _b === void 0 ? void 0 : _b._parent) === undefined) {
                    //if ((<any>this.dummyHolder.childNodes[x])._this._parent === undefined) {
                    this.dummyHolder.removeChild(this.dummyHolder.childNodes[x]);
                }
            }
        }
        get designedComponent() {
            return this._designPlaceholder._components[0];
        }
        destroy() {
            var _a, _b, _c, _d;
            if (this._resizer !== undefined) {
                this._resizer.uninstall();
            }
            if (this._draganddropper !== undefined) {
                this._draganddropper.isDragEnabled = undefined;
                this._draganddropper.uninstall();
            }
            (_a = this._propertyEditor) === null || _a === void 0 ? void 0 : _a.destroy();
            (_b = this._componentPalette) === null || _b === void 0 ? void 0 : _b.destroy();
            (_c = this._componentExplorer) === null || _c === void 0 ? void 0 : _c.destroy();
            (_d = this._invisibleComponents) === null || _d === void 0 ? void 0 : _d.destroy();
            super.destroy();
        }
    };
    ComponentDesigner = __decorate([
        (0, Registry_1.$Class)("jassijs_editor.ComponentDesigner"),
        __metadata("design:paramtypes", [Object])
    ], ComponentDesigner);
    exports.ComponentDesigner = ComponentDesigner;
    async function test() {
        return new ComponentDesigner({});
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=ComponentDesigner.js.map