var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/util/Resizer", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs/ui/Repeater", "jassijs/ui/Button", "jassijs_editor/util/DragAndDropper", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Classes", "jassijs/ui/BoxPanel", "jassijs/ui/Databinder"], function (require, exports, Jassi_1, Panel_1, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, Resizer_1, CodeEditorInvisibleComponents_1, Repeater_1, Button_1, DragAndDropper_1, ComponentDescriptor_1, Classes_1, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentDesigner = void 0;
    class ClipboardData {
        constructor() {
            this.varNamesToCopy = [];
            this.children = {};
            this.properties = {};
            this.types = {};
            this.allChilds = [];
        }
    }
    let ComponentDesigner = class ComponentDesigner extends Panel_1.Panel {
        constructor() {
            super();
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
            this.cutButton.tooltip = "Cut selected Controls (ENTF)";
            this.cutButton.onclick(function () {
                _this.cutComponent();
            });
            this._designToolbar.add(this.cutButton);
            this.editButton = new Button_1.Button();
            this.editButton.icon = "mdi mdi-run mdi-18px";
            this.editButton.tooltip = "Test Dialog";
            this.editButton.onclick(function () {
                _this.editDialog(!_this.editMode);
            });
            this.copyButton = new Button_1.Button();
            this.copyButton.icon = "mdi mdi-content-copy mdi-18px";
            this.copyButton.tooltip = "Copy";
            this.copyButton.onclick(function () {
                _this.copy();
            });
            this._designToolbar.add(this.copyButton);
            this.pasteButton = new Button_1.Button();
            this.pasteButton.icon = "mdi mdi-content-paste mdi-18px";
            this.pasteButton.tooltip = "Paste";
            this.pasteButton.onclick(function () {
                _this.paste();
            });
            this._designToolbar.add(this.pasteButton);
            var box = new BoxPanel_1.BoxPanel();
            box.horizontal = true;
            this.inlineEditorPanel = new Panel_1.Panel();
            this.inlineEditorPanel._id = "i" + this.inlineEditorPanel._id;
            this.inlineEditorPanel.dom.setAttribute("id", this.inlineEditorPanel._id);
            $(this.inlineEditorPanel.dom).css("display", "inline");
            $(this.inlineEditorPanel.domWrapper).css("display", "inline");
            $(this.inlineEditorPanel.dom).addClass("InlineEditorPanel");
            //   box.height=40;
            box.add(this._designToolbar);
            box.add(this.inlineEditorPanel);
            this.add(box);
            $(this._designPlaceholder.domWrapper).css("position", "relative");
            this.add(this._designPlaceholder);
        }
        /**
       * manage shortcuts
       */
        registerKeys() {
            var _this = this;
            $(this._codeEditor._design.dom).attr("tabindex", "1");
            $(this._codeEditor._design.dom).keydown(function (evt) {
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
                if (evt.keyCode === 90 || evt.ctrlKey) { //Ctrl+Z
                    _this.undo();
                }
                if (evt.keyCode === 116) { //F5
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 46) { //Del
                    _this.cutComponent();
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
        /**
         * removes the selected component
         */
        async cutComponent() {
            var _a;
            var text = await this.copy();
            if (await navigator.clipboard.readText() !== text) {
                alert("could not copy to Clipboard.");
                return;
            }
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
            this._propertyEditor.removeVariablesInCode(all);
            this._updateInvisibleComponents();
            this._componentExplorer.update();
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
                if (editorfields[key] || key === "_new_" || key === "add") {
                    if (!clip.properties[varname][key]) {
                        clip.properties[varname][key] = [];
                    }
                    for (var i = 0; i < parserdata[key].length; i++) {
                        //only add fields in Propertydescriptor
                        clip.properties[varname][key].push(parserdata[key][i].value);
                    }
                }
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
        async copy() {
            var components = this._propertyEditor.value;
            if (!Array.isArray(components)) {
                components = [components];
            }
            var clip = new ClipboardData();
            clip.varNamesToCopy = [];
            for (var x = 0; x < components.length; x++) {
                var component = components[x];
                var varname = this._codeEditor.getVariableFromObject(component);
                clip.varNamesToCopy.push(varname);
                this.copyProperties(clip, component);
            }
            var text = JSON.stringify(clip);
            console.log(text);
            await navigator.clipboard.writeText(text);
            return text;
        }
        async pasteComponent(clip, target, varname, variablelistold, variablelistnew) {
            var _this = this;
            var created;
            if (clip.properties[varname] !== undefined && clip.properties[varname]["_new_"] !== undefined) {
                var vartype = clip.properties[varname]["_new_"][0];
                if (variablelistold.indexOf(varname) > -1)
                    return;
                vartype = vartype.split("(")[0].split("new ")[1];
                var targetname = _this._codeEditor.getVariableFromObject(target);
                var newcomp = { createFromType: clip.types[varname] };
                await Classes_1.classes.loadClass(clip.types[varname]);
                var svarname = varname.split(".")[varname.split(".").length - 1];
                created = _this.createComponent(clip.types[varname], newcomp, undefined, undefined, target, undefined, false, svarname);
                variablelistold.push(varname);
                variablelistnew.push(_this._codeEditor.getVariableFromObject(created));
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
                    await _this.pasteComponent(clip, created, clip.children[varname][k], variablelistold, variablelistnew);
                }
            }
        }
        async paste() {
            var text = await navigator.clipboard.readText();
            var created;
            var clip = JSON.parse(text);
            var _this = this;
            var variablelistold = [];
            var variablelistnew = [];
            //create Components
            for (var x = 0; x < clip.varNamesToCopy.length; x++) {
                var varname = clip.varNamesToCopy[x];
                var target = _this._propertyEditor.value;
                await _this.pasteComponent(clip, target, varname, variablelistold, variablelistnew);
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
            _this._propertyEditor.value = created;
            _this._propertyEditor.codeEditor.value = _this._propertyEditor.parser.getModifiedCode();
            _this._propertyEditor.updateParser();
            _this._propertyEditor.callEvent("codeChanged", {});
            //include the new element
            _this.editDialog(true);
            _this._componentExplorer.update();
            _this._updateInvisibleComponents();
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
            var comps = $(component.dom).find(".jcomponent");
            comps.addClass("jdesignmode");
            for (var c = 0; c < comps.length; c++) {
                if (comps[c]._this["extensionCalled"] !== undefined) {
                    comps[c]._this["extensionCalled"]({
                        componentDesignerSetDesignMode: { enable, componentDesigner: this }
                    });
                    //comps[c]._this["setDesignMode"](enable,this);
                }
            }
            if (component["extensionCalled"] !== undefined) {
                component["extensionCalled"]({
                    componentDesignerSetDesignMode: { enable, componentDesigner: this }
                });
            }
            //if(component["setDesignMode"]!==undefined){
            //        component["setDesignMode"](enable,this);
            //    }
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
                this._draganddropper = new DragAndDropper_1.DragAndDropper();
                this._resizer = new Resizer_1.Resizer();
                this._resizer.draganddropper = this._draganddropper;
                this._resizer.onelementselected = function (elementIDs, e) {
                    var ret = [];
                    for (var x = 0; x < elementIDs.length; x++) {
                        var ob = $("#" + elementIDs[x])[0]._this;
                        if (ob["editorselectthis"])
                            ob = ob["editorselectthis"];
                        ret.push(ob);
                    }
                    if (ret.length === 1)
                        _this._propertyEditor.value = ret[0];
                    else if (ret.length > 0) {
                        _this._propertyEditor.value = ret;
                    }
                };
                this._resizer.onpropertychanged = function (comp, prop, value) {
                    if (_this._propertyEditor.value !== comp)
                        _this._propertyEditor.value = comp;
                    _this._propertyEditor.setPropertyInCode(prop, value + "", true);
                    _this._propertyEditor.value = _this._propertyEditor.value;
                };
                this._resizer.install(component, allcomponents);
                allcomponents = this.variables.getEditableComponents(component, true);
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
            else {
            }
            this._componentExplorer.update();
            /*  $(".hoho2").selectable({});
              $(".hoho2").selectable("disable");*/
            /*  $(".HTMLPanel").selectable({});
              $(".HTMLPanel").selectable("disable");
              $(".HTMLPanel").draggable({});
              $(".HTMLPanel").draggable("disable");*/
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
            /*if(beforeComponent!==undefined&&beforeComponent.designDummyFor!==undefined){
                beforeComponent=undefined;
            }*/
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
            /* if(newParent._components.length>1){//correct dummy
                 var dummy=	newParent._components[newParent._components.length-2];
                 if(dummy.designDummyFor!==undefined){
                     //var tmp=newParent._components[newParent._components.length-1];
                     newParent.remove(dummy);//._components[newParent._components.length-1]=newParent._components[newParent._components.length-2];
                     newParent.add(dummy);//._components[newParent._components.length-1]=tmp;
                 }
             }*/
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
        createComponent(type, component, top, left, newParent, beforeComponent, doUpdate = true, suggestedName = undefined) {
            var _this = this;
            /*if(beforeComponent!==undefined&&beforeComponent.designDummyFor&&beforeComponent.type==="atEnd"){
                beforeComponent=undefined;
            }*/
            var file = type.replaceAll(".", "/");
            var stype = file.split("/")[file.split("/").length - 1];
            _this._propertyEditor.addImportIfNeeded(stype, file);
            var repeater = _this._hasRepeatingContainer(newParent);
            var scope = undefined;
            if (repeater !== undefined) {
                var repeatername = _this._codeEditor.getVariableFromObject(repeater);
                var test = _this._propertyEditor.parser.getPropertyValue(repeatername, "createRepeatingComponent");
                scope = { variablename: repeatername, methodname: "createRepeatingComponent" };
                if (test === undefined) {
                    var sfunc = "function(me:Me){\n\t" + repeatername + ".design.config({});\n}";
                    var vardatabinder = _this._propertyEditor.getNextVariableNameForType("jassijs.ui.Databinder");
                    if (!_this._propertyEditor.parser.getPropertyValue(repeatername, "config")) {
                        sfunc = "function(me:Me){\n\t\n}";
                    }
                    _this._propertyEditor.setPropertyInCode("createRepeatingComponent", sfunc, true, repeatername);
                    _this._propertyEditor.updateParser();
                    repeater.createRepeatingComponent(function (me) {
                        if (this._designMode !== true)
                            return;
                        //_this.variables.addVariable(vardatabinder,databinder);
                        _this.variables.updateCache();
                    });
                    /*var db=new jassijs.ui.Databinder();
                    if(repeater.value!==undefined&&repeater.value.length>0)
                        db.value=repeater.value[0];
                    _this.variables.add(vardatabinder,db);
                    _this.variables.updateCache();*/
                }
            }
            var varvalue = new (Classes_1.classes.getClass(type));
            var varname = _this.createVariable(type, scope, varvalue, suggestedName);
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
            /* if(newParent._components.length>1){//correct dummy
                 if(newParent._designDummy){
                     //var tmp=newParent._components[newParent._components.length-1];
                     newParent.dom.removeChild(newParent._designDummy.domWrapper)
                     newParent.dom.append(newParent._designDummy.domWrapper)
                 }
             }*/
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
            }
            return varvalue;
        }
        createVariable(type, scope, varvalue, suggestedName = undefined) {
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
            this.variables.addVariable(varname, varvalue);
            return varname;
        }
        /**
         * is there a parent that acts a repeating container?
         **/
        _hasRepeatingContainer(component) {
            if (component === undefined)
                return undefined;
            if (this._codeEditor.getVariableFromObject(component) === undefined)
                return undefined;
            if (component instanceof Repeater_1.Repeater) {
                return component;
            }
            return this._hasRepeatingContainer(component._parent);
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
            if (this._designPlaceholder._components.length > 0)
                this._designPlaceholder.remove(this._designPlaceholder._components[0], true);
            this._designPlaceholder.add(component);
            // 
            this._propertyEditor.updateParser();
            this.editDialog(this.editMode === undefined ? true : this.editMode);
            this._componentExplorer.value = component;
            $(this.dom).focus();
            this._updateInvisibleComponents();
            while (this.inlineEditorPanel.dom.firstChild) {
                this.inlineEditorPanel.dom.firstChild.remove();
            }
            //var parser=new jassijs.ui.PropertyEditor.Parser();
            //parser.parse(_this.value);
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
        (0, Jassi_1.$Class)("jassijs_editor.ComponentDesigner"),
        __metadata("design:paramtypes", [])
    ], ComponentDesigner);
    exports.ComponentDesigner = ComponentDesigner;
    async function test() {
        return new ComponentDesigner();
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50RGVzaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX2VkaXRvci9Db21wb25lbnREZXNpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBa0NBLE1BQU0sYUFBYTtRQUFuQjtZQUNJLG1CQUFjLEdBQWEsRUFBRSxDQUFDO1lBQzlCLGFBQVEsR0FBaUMsRUFBRSxDQUFDO1lBQzVDLGVBQVUsR0FBc0QsRUFBRSxDQUFDO1lBQ25FLFVBQUssR0FBK0IsRUFBRSxDQUFDO1lBQ3ZDLGNBQVMsR0FBVSxFQUFFLENBQUM7UUFDMUIsQ0FBQztLQUFBO0lBSUQsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBa0IsU0FBUSxhQUFLO1FBdUJ4QztZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7WUFDN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRXpCLENBQUM7UUFDRCxhQUFhLENBQUMsTUFBTTtZQUNoQixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDekMsQ0FBQztRQUNELElBQUksVUFBVSxDQUFDLEtBQUs7WUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLCtCQUFjLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzVELHdEQUF3RDtZQUN4RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJ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aUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNsRDtZQUVELG9EQUFvRDtZQUNwRCw0QkFBNEI7UUFDaEMsQ0FBQztRQUNELElBQUksaUJBQWlCO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsT0FBTzs7WUFDSCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQzdCO1lBQ0QsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ3BDO1lBQ0QsTUFBQSxJQUFJLENBQUMsZUFBZSwwQ0FBRSxPQUFPLEVBQUUsQ0FBQztZQUNoQyxNQUFBLElBQUksQ0FBQyxpQkFBaUIsMENBQUUsT0FBTyxFQUFFLENBQUM7WUFDbEMsTUFBQSxJQUFJLENBQUMsa0JBQWtCLDBDQUFFLE9BQU8sRUFBRSxDQUFDO1lBQ25DLE1BQUEsSUFBSSxDQUFDLG9CQUFvQiwwQ0FBRSxPQUFPLEVBQUUsQ0FBQztZQUNyQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQztLQUVKLENBQUE7SUE1MUJZLGlCQUFpQjtRQUQ3QixJQUFBLGNBQU0sRUFBQyxrQ0FBa0MsQ0FBQzs7T0FDOUIsaUJBQWlCLENBNDFCN0I7SUE1MUJZLDhDQUFpQjtJQTYxQnZCLEtBQUssVUFBVSxJQUFJO1FBQ3RCLE9BQU8sSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0lBRW5DLENBQUM7SUFIRCxvQkFHQztJQUFBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZVBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvVmFyaWFibGVQYW5lbFwiO1xyXG5pbXBvcnQgeyBQcm9wZXJ0eUVkaXRvciB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9yXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudEV4cGxvcmVyIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvbXBvbmVudEV4cGxvcmVyXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudFBhbGV0dGUgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50UGFsZXR0ZVwiO1xyXG5pbXBvcnQgeyBSZXNpemVyIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvUmVzaXplclwiO1xyXG4vL2ltcG9ydCBEcmFnQW5kRHJvcHBlciBmcm9tIFwiamFzc2lqcy91aS9oZWxwZXIvRHJhZ0FuZERyb3BwZXJcIjtcclxuaW1wb3J0IHsgRXJyb3JQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL0Vycm9yUGFuZWxcIjtcclxuaW1wb3J0IHsgQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHMgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHNcIjtcclxuaW1wb3J0IHsgUmVwZWF0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9SZXBlYXRlclwiO1xyXG5pbXBvcnQgXCJqYXNzaWpzL3VpL0RhdGFiaW5kZXJcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBEcmFnQW5kRHJvcHBlciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci91dGlsL0RyYWdBbmREcm9wcGVyXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudERlc2NyaXB0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnREZXNjcmlwdG9yXCI7XHJcbmltcG9ydCB7IGNsYXNzZXMgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvQ2xhc3Nlc1wiO1xyXG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiamFzc2lqcy91aS9Db250YWluZXJcIjtcclxuaW1wb3J0IHsgQm94UGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9Cb3hQYW5lbFwiO1xyXG4vL2ltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL3V0aWwvUGFyc2VyXCI7XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4dGVuc2lvbkFjdGlvbiB7XHJcbiAgICAgICAgY29tcG9uZW50RGVzaWduZXJTZXREZXNpZ25Nb2RlPzoge1xyXG4gICAgICAgICAgICBlbmFibGU6IGJvb2xlYW4sXHJcbiAgICAgICAgICAgIGNvbXBvbmVudERlc2lnbmVyOiBDb21wb25lbnREZXNpZ25lclxyXG4gICAgICAgIH1cclxuICAgICAgICBjb21wb25lbnREZXNpZ25lckNvbXBvbmVudENyZWF0ZWQ/OiB7XHJcbiAgICAgICAgICAgIC8vY29tcG9uZW50OkNvbXBvbmVudFxyXG4gICAgICAgICAgICBuZXdQYXJlbnQ6IENvbnRhaW5lclxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ2xpcGJvYXJkRGF0YSB7XHJcbiAgICB2YXJOYW1lc1RvQ29weTogc3RyaW5nW10gPSBbXTtcclxuICAgIGNoaWxkcmVuOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmdbXSB9ID0ge307XHJcbiAgICBwcm9wZXJ0aWVzOiB7IFtuYW1lOiBzdHJpbmddOiB7IFtwcm9wbmFtZTogc3RyaW5nXTogYW55W10gfSB9ID0ge307XHJcbiAgICB0eXBlczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgIGFsbENoaWxkczpzdHJpbmdbXT1bXTtcclxufVxyXG5cclxuXHJcbkAkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db21wb25lbnREZXNpZ25lclwiKVxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50RGVzaWduZXIgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBfY29kZUVkaXRvcjtcclxuICAgIGVkaXRNb2RlOiBib29sZWFuO1xyXG4gICAgdmFyaWFibGVzOiBWYXJpYWJsZVBhbmVsO1xyXG4gICAgX3Byb3BlcnR5RWRpdG9yOiBQcm9wZXJ0eUVkaXRvcjtcclxuICAgIF9lcnJvcnM6IEVycm9yUGFuZWw7XHJcbiAgICBfY29tcG9uZW50UGFsZXR0ZTogQ29tcG9uZW50UGFsZXR0ZTtcclxuICAgIF9jb21wb25lbnRFeHBsb3JlcjogQ29tcG9uZW50RXhwbG9yZXI7XHJcbiAgICBfaW52aXNpYmxlQ29tcG9uZW50czogQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHM7XHJcbiAgICBfZGVzaWduVG9vbGJhcjogUGFuZWw7XHJcbiAgICBfZGVzaWduUGxhY2Vob2xkZXI6IFBhbmVsO1xyXG4gICAgX3Jlc2l6ZXI6IFJlc2l6ZXI7XHJcbiAgICBfZHJhZ2FuZGRyb3BwZXI6IERyYWdBbmREcm9wcGVyO1xyXG4gICAgc2F2ZUJ1dHRvbjogQnV0dG9uO1xyXG4gICAgcnVuQnV0dG9uOiBCdXR0b247XHJcbiAgICBsYXNzb0J1dHRvbjogQnV0dG9uO1xyXG4gICAgdW5kb0J1dHRvbjogQnV0dG9uO1xyXG4gICAgZWRpdEJ1dHRvbjogQnV0dG9uO1xyXG4gICAgY3V0QnV0dG9uOiBCdXR0b247XHJcbiAgICBpbmxpbmVFZGl0b3JQYW5lbDogUGFuZWw7XHJcbiAgICBjb3B5QnV0dG9uOiBCdXR0b247XHJcbiAgICBwYXN0ZUJ1dHRvbjogQnV0dG9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvciA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9pbml0RGVzaWduKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IHRydWU7XHJcblxyXG4gICAgfVxyXG4gICAgY29ubmVjdFBhcnNlcihwYXJzZXIpIHtcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5wYXJzZXIgPSBwYXJzZXI7XHJcbiAgICB9XHJcbiAgICBzZXQgY29kZUVkaXRvcih2YWx1ZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gdGhpcy5fY29kZUVkaXRvci52YXJpYWJsZXM7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IgPSBuZXcgUHJvcGVydHlFZGl0b3IodmFsdWUsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgLy8gICB0aGlzLl9wcm9wZXJ0eUVkaXRvcj1uZXcgUHJvcGVydHlFZGl0b3IodW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLl9lcnJvcnMgPSB0aGlzLl9jb2RlRWRpdG9yLl9lcnJvcnM7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50UGFsZXR0ZSA9IG5ldyBDb21wb25lbnRQYWxldHRlKCk7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50UGFsZXR0ZS5zZXJ2aWNlID0gXCIkVUlDb21wb25lbnRcIjtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3JlciA9IG5ldyBDb21wb25lbnRFeHBsb3Jlcih2YWx1ZSwgdGhpcy5fcHJvcGVydHlFZGl0b3IpO1xyXG4gICAgICAgIHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHMgPSBuZXcgQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHModmFsdWUpO1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHMpO1xyXG4gICAgICAgIHRoaXMuX2luaXRDb21wb25lbnRFeHBsb3JlcigpO1xyXG4gICAgICAgIHRoaXMuX2luc3RhbGxWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fY29kZVBhbmVsLm9uYmx1cihmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyS2V5cygpO1xyXG5cclxuICAgIH1cclxuICAgIGdldCBjb2RlRWRpdG9yKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2RlRWRpdG9yO1xyXG4gICAgfVxyXG4gICAgX2luaXREZXNpZ24oKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyID0gbmV3IFBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIgPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLmljb24gPSBcIm1kaSBtZGktcnVuIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLnRvb2x0aXAgPSBcIlRlc3QgRGlhbG9nXCI7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5lZGl0RGlhbG9nKCFfdGhpcy5lZGl0TW9kZSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMuZWRpdEJ1dHRvbik7XHJcblxyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLnNhdmVCdXR0b24udG9vbHRpcCA9IFwiU2F2ZShDdHJsK1MpXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uLmljb24gPSBcIm1kaSBtZGktY29udGVudC1zYXZlIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5zYXZlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgLyogIHRoaXMucnVuQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgdGhpcy5ydW5CdXR0b24uaWNvbiA9IFwibWRpIG1kaS1jYXItaGF0Y2hiYWNrIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICB0aGlzLnJ1bkJ1dHRvbi50b29sdGlwID0gXCJSdW4oRjQpXCI7XHJcbiAgICAgICAgICB0aGlzLnJ1bkJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZSgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLnJ1bkJ1dHRvbik7Ki9cclxuXHJcbiAgICAgICAgdGhpcy51bmRvQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMudW5kb0J1dHRvbi5pY29uID0gXCJtZGkgbWRpLXVuZG8gbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24udG9vbHRpcCA9IFwiVW5kbyAoU3RyZytaKVwiO1xyXG4gICAgICAgIHRoaXMudW5kb0J1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMudW5kbygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMudW5kb0J1dHRvbik7XHJcblxyXG4gICAgICAgIC8qICB2YXIgdGVzdD1uZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgIHRlc3QuaWNvbj1cIm1kaSBtZGktYnVnIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgIHRlc3QudG9vbHRpcD1cIlRlc3RcIjtcclxuICAgICAgICAgdGVzdC5vbmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGtrPV90aGlzLl9jb2RlVmlldy5sYXlvdXQ7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0ZXN0KTsqL1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMubGFzc29CdXR0b24uaWNvbiA9IFwibWRpIG1kaS1sYXNzbyBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMubGFzc29CdXR0b24udG9vbHRpcCA9IFwiU2VsZWN0IHJ1YmJlcmJhbmRcIjtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMubGFzc29CdXR0b24udG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIF90aGlzLl9yZXNpemVyLnNldExhc3NvTW9kZSh2YWwpO1xyXG4gICAgICAgICAgICBfdGhpcy5fZHJhZ2FuZGRyb3BwZXIuZW5hYmxlRHJhZ2dhYmxlKCF2YWwpO1xyXG4gICAgICAgICAgICAvL190aGlzLl9kcmFnYW5kZHJvcHBlci5hY3RpdmF0ZURyYWdnaW5nKCF2YWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMubGFzc29CdXR0b24pO1xyXG5cclxuICAgICAgICB0aGlzLmN1dEJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmN1dEJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLWNvbnRlbnQtY3V0IG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5jdXRCdXR0b24udG9vbHRpcCA9IFwiQ3V0IHNlbGVjdGVkIENvbnRyb2xzIChFTlRGKVwiO1xyXG4gICAgICAgIHRoaXMuY3V0QnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5jdXRDb21wb25lbnQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLmN1dEJ1dHRvbik7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1ydW4gbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24udG9vbHRpcCA9IFwiVGVzdCBEaWFsb2dcIjtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmVkaXREaWFsb2coIV90aGlzLmVkaXRNb2RlKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29weUJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmNvcHlCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1jb250ZW50LWNvcHkgbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLmNvcHlCdXR0b24udG9vbHRpcCA9IFwiQ29weVwiO1xyXG4gICAgICAgIHRoaXMuY29weUJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuY29weSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMuY29weUJ1dHRvbik7XHJcbiAgICAgICAgdGhpcy5wYXN0ZUJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLnBhc3RlQnV0dG9uLmljb24gPSBcIm1kaSBtZGktY29udGVudC1wYXN0ZSBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMucGFzdGVCdXR0b24udG9vbHRpcCA9IFwiUGFzdGVcIjtcclxuICAgICAgICB0aGlzLnBhc3RlQnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5wYXN0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMucGFzdGVCdXR0b24pO1xyXG4gICAgICAgIHZhciBib3ggPSBuZXcgQm94UGFuZWwoKTtcclxuICAgICAgICBib3guaG9yaXpvbnRhbCA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuaW5saW5lRWRpdG9yUGFuZWwgPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLmlubGluZUVkaXRvclBhbmVsLl9pZCA9IFwiaVwiICsgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5faWQ7XHJcbiAgICAgICAgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5kb20uc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5faWQpO1xyXG4gICAgICAgICQodGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5kb20pLmNzcyhcImRpc3BsYXlcIiwgXCJpbmxpbmVcIik7XHJcbiAgICAgICAgJCh0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbVdyYXBwZXIpLmNzcyhcImRpc3BsYXlcIiwgXCJpbmxpbmVcIik7XHJcbiAgICAgICAgJCh0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbSkuYWRkQ2xhc3MoXCJJbmxpbmVFZGl0b3JQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgLy8gICBib3guaGVpZ2h0PTQwO1xyXG4gICAgICAgIGJveC5hZGQodGhpcy5fZGVzaWduVG9vbGJhcik7XHJcbiAgICAgICAgYm94LmFkZCh0aGlzLmlubGluZUVkaXRvclBhbmVsKTtcclxuICAgICAgICB0aGlzLmFkZChib3gpO1xyXG4gICAgICAgICQodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuZG9tV3JhcHBlcikuY3NzKFwicG9zaXRpb25cIiwgXCJyZWxhdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmFkZCh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlcik7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICogbWFuYWdlIHNob3J0Y3V0c1xyXG4gICAqL1xyXG4gICAgcmVnaXN0ZXJLZXlzKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGlzLl9jb2RlRWRpdG9yLl9kZXNpZ24uZG9tKS5hdHRyKFwidGFiaW5kZXhcIiwgXCIxXCIpO1xyXG4gICAgICAgICQodGhpcy5fY29kZUVkaXRvci5fZGVzaWduLmRvbSkua2V5ZG93bihmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE1ICYmIGV2dC5zaGlmdEtleSkgey8vRjRcclxuICAgICAgICAgICAgICAgIC8vIHZhciB0aGlzcz10aGlzLl90aGlzLl9pZDtcclxuICAgICAgICAgICAgICAgIC8vIHZhciBlZGl0b3IgPSBhY2UuZWRpdCh0aGlzLl90aGlzLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUpIHsvL0Y0XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDkwIHx8IGV2dC5jdHJsS2V5KSB7Ly9DdHJsK1pcclxuICAgICAgICAgICAgICAgIF90aGlzLnVuZG8oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDExNikgey8vRjVcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gNDYpIHsvL0RlbFxyXG4gICAgICAgICAgICAgICAgX3RoaXMuY3V0Q29tcG9uZW50KCk7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChTdHJpbmcuZnJvbUNoYXJDb2RlKGV2dC53aGljaCkudG9Mb3dlckNhc2UoKSA9PT0gJ3MnICYmIGV2dC5jdHJsS2V5KS8qICYmIChldnQud2hpY2ggPT0gMTkpKi8pIHsvL1N0citzXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUludmlzaWJsZUNvbXBvbmVudHMoKTtcclxuICAgIH1cclxuICAgIF9pbnN0YWxsVmlldygpIHtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9wcm9wZXJ0eUVkaXRvciwgXCJQcm9wZXJ0aWVzXCIsIFwicHJvcGVydGllc1wiKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9jb21wb25lbnRFeHBsb3JlciwgXCJDb21wb25lbnRzXCIsIFwiY29tcG9uZW50c1wiKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9jb21wb25lbnRQYWxldHRlLCBcIlBhbGV0dGVcIiwgXCJjb21wb25lbnRQYWxldHRlXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4ubGF5b3V0ID0gJ3tcInNldHRpbmdzXCI6e1wiaGFzSGVhZGVyc1wiOnRydWUsXCJjb25zdHJhaW5EcmFnVG9Db250YWluZXJcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwic2VsZWN0aW9uRW5hYmxlZFwiOmZhbHNlLFwicG9wb3V0V2hvbGVTdGFja1wiOmZhbHNlLFwiYmxvY2tlZFBvcG91dHNUaHJvd0Vycm9yXCI6dHJ1ZSxcImNsb3NlUG9wb3V0c09uVW5sb2FkXCI6dHJ1ZSxcInNob3dQb3BvdXRJY29uXCI6ZmFsc2UsXCJzaG93TWF4aW1pc2VJY29uXCI6dHJ1ZSxcInNob3dDbG9zZUljb25cIjp0cnVlLFwicmVzcG9uc2l2ZU1vZGVcIjpcIm9ubG9hZFwifSxcImRpbWVuc2lvbnNcIjp7XCJib3JkZXJXaWR0aFwiOjUsXCJtaW5JdGVtSGVpZ2h0XCI6MTAsXCJtaW5JdGVtV2lkdGhcIjoxMCxcImhlYWRlckhlaWdodFwiOjIwLFwiZHJhZ1Byb3h5V2lkdGhcIjozMDAsXCJkcmFnUHJveHlIZWlnaHRcIjoyMDB9LFwibGFiZWxzXCI6e1wiY2xvc2VcIjpcImNsb3NlXCIsXCJtYXhpbWlzZVwiOlwibWF4aW1pc2VcIixcIm1pbmltaXNlXCI6XCJtaW5pbWlzZVwiLFwicG9wb3V0XCI6XCJvcGVuIGluIG5ldyB3aW5kb3dcIixcInBvcGluXCI6XCJwb3AgaW5cIixcInRhYkRyb3Bkb3duXCI6XCJhZGRpdGlvbmFsIHRhYnNcIn0sXCJjb250ZW50XCI6W3tcInR5cGVcIjpcImNvbHVtblwiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInJvd1wiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJoZWlnaHRcIjo4MS4wNDI5NDA2NjI1ODk4OCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcIndpZHRoXCI6ODAuNTc0OTEyODkxOTg2MDYsXCJoZWlnaHRcIjo3MS4yMzUwMzQ2NTY1ODQ3NixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIkNvZGUuLlwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb2RlXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJDb2RlLi5cIixcIm5hbWVcIjpcImNvZGVcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX0se1widGl0bGVcIjpcIkRlc2lnblwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJkZXNpZ25cIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkRlc2lnblwiLFwibmFtZVwiOlwiZGVzaWduXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwiY29sdW1uXCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcIndpZHRoXCI6MTkuNDI1MDg3MTA4MDEzOTQsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjE5Ljg0NDM1Nzk3NjY1MzY5NyxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlBhbGV0dGVcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiY29tcG9uZW50UGFsZXR0ZVwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiUGFsZXR0ZVwiLFwibmFtZVwiOlwiY29tcG9uZW50UGFsZXR0ZVwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjgwLjE1NTY0MjAyMzM0NjMsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJQcm9wZXJ0aWVzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcInByb3BlcnRpZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlByb3BlcnRpZXNcIixcIm5hbWVcIjpcInByb3BlcnRpZXNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfV19XX0se1widHlwZVwiOlwicm93XCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImhlaWdodFwiOjE4Ljk1NzA1OTMzNzQxMDEyMixcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6MTguOTU3MDU5MzM3NDEwMTIyLFwid2lkdGhcIjo3Ny43MDAzNDg0MzIwNTU3NSxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJ2YXJpYWJsZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwibmFtZVwiOlwidmFyaWFibGVzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9LHtcInRpdGxlXCI6XCJFcnJvcnNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiZXJyb3JzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJFcnJvcnNcIixcIm5hbWVcIjpcImVycm9yc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcIndpZHRoXCI6MjIuMjk5NjUxNTY3OTQ0MjU2LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiQ29tcG9uZW50c1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb21wb25lbnRzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJDb21wb25lbnRzXCIsXCJuYW1lXCI6XCJjb21wb25lbnRzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX1dfV19XSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwib3BlblBvcG91dHNcIjpbXSxcIm1heGltaXNlZEl0ZW1JZFwiOm51bGx9JztcclxuICAgIH1cclxuXHJcbiAgICBfdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHMudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXRDb21wb25lbnRFeHBsb3JlcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLm9uc2VsZWN0KGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhfdGhpcy5fY29tcG9uZW50RXhwbG9yZXIuc2VsZWN0aW9uKTtcclxuICAgICAgICAgICAgLy8gIHZhciBvYiA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsID0gX3RoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnRyZWUuc2VsZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbC5sZW5ndGggPT09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsID0gc2VsWzBdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gc2VsO1xyXG4gICAgICAgICAgICB9LCAxMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIuZ2V0Q29tcG9uZW50TmFtZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciB2YXJuYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGl0ZW0pO1xyXG4gICAgICAgICAgICBpZiAodmFybmFtZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwidGhpcy5cIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFybmFtZS5zdWJzdHJpbmcoNSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YXJuYW1lO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJlbW92ZXMgdGhlIHNlbGVjdGVkIGNvbXBvbmVudFxyXG4gICAgICovXHJcbiAgICBhc3luYyBjdXRDb21wb25lbnQoKSB7XHJcbiAgICAgICAgdmFyIHRleHQ9YXdhaXQgdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgaWYoYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpIT09dGV4dCl7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiY291bGQgbm90IGNvcHkgdG8gQ2xpcGJvYXJkLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjbGlwOiBDbGlwYm9hcmREYXRhID0gSlNPTi5wYXJzZSh0ZXh0KTsvL3RvIENsaXBib2FyZFxyXG4gICAgICAgXHJcbiAgICAgICAgdmFyIGFsbCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2xpcC5hbGxDaGlsZHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIHZhcm5hbWUgPSBjbGlwLmFsbENoaWxkc1t4XTsvL3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHRvZGVsKTtcclxuICAgICAgICAgICAgdmFyIHRvZGVsPXRoaXMuX2NvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHZhcm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodmFybmFtZSAhPT0gXCJ0aGlzXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2RlbD8uZG9tV3JhcHBlcj8uX3BhcmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9kZWwuZG9tV3JhcHBlci5fcGFyZW50LnJlbW92ZSh0b2RlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhbGwucHVzaCh2YXJuYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnJlbW92ZVZhcmlhYmxlSW5EZXNpZ24odmFybmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlVmFyaWFibGVzSW5Db2RlKGFsbCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnVwZGF0ZSgpO1xyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgY29weVByb3BlcnRpZXMoY2xpcDogQ2xpcGJvYXJkRGF0YSwgY29tcG9uZW50OiBDb21wb25lbnQpIHtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHRoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNvbXBvbmVudCk7XHJcbiAgICAgICAgdmFyIHBhcnNlcmRhdGEgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci5wYXJzZXIuZGF0YVt2YXJuYW1lXTtcclxuICAgICAgICBjbGlwLmFsbENoaWxkcy5wdXNoKHZhcm5hbWUpO1xyXG4gICAgICAgIGNsaXAudHlwZXNbdmFybmFtZV0gPSBjbGFzc2VzLmdldENsYXNzTmFtZShjb21wb25lbnQpO1xyXG4gICAgICAgIGlmICghY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdKSB7XHJcbiAgICAgICAgICAgIGNsaXAucHJvcGVydGllc1t2YXJuYW1lXSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZWRpdG9yZmllbGRzID0ge307XHJcbiAgICAgICAgQ29tcG9uZW50RGVzY3JpcHRvci5kZXNjcmliZShjb21wb25lbnQuY29uc3RydWN0b3IpPy5maWVsZHMuZm9yRWFjaCgoZikgPT4geyBlZGl0b3JmaWVsZHNbZi5uYW1lXSA9IGYgfSk7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcnNlcmRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVkaXRvcmZpZWxkc1trZXldIHx8IGtleSA9PT0gXCJfbmV3X1wiIHx8IGtleSA9PT0gXCJhZGRcIikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjbGlwLnByb3BlcnRpZXNbdmFybmFtZV1ba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaXAucHJvcGVydGllc1t2YXJuYW1lXVtrZXldID0gW11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyc2VyZGF0YVtrZXldLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9vbmx5IGFkZCBmaWVsZHMgaW4gUHJvcGVydHlkZXNjcmlwdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdW2tleV0ucHVzaChwYXJzZXJkYXRhW2tleV1baV0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRuYW1lID0gdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl1beF0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGlwLmNoaWxkcmVuW3Zhcm5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpcC5jaGlsZHJlblt2YXJuYW1lXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjbGlwLmNoaWxkcmVuW3Zhcm5hbWVdLnB1c2goY2hpbGRuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcHlQcm9wZXJ0aWVzKGNsaXAsIGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdW3hdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFzeW5jIGNvcHkoKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50cykpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50cyA9IFtjb21wb25lbnRzXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjbGlwID0gbmV3IENsaXBib2FyZERhdGEoKTtcclxuICAgICAgICBjbGlwLnZhck5hbWVzVG9Db3B5ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnQ6IENvbXBvbmVudCA9IGNvbXBvbmVudHNbeF07XHJcbiAgICAgICAgICAgIHZhciB2YXJuYW1lID0gdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgY2xpcC52YXJOYW1lc1RvQ29weS5wdXNoKHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlQcm9wZXJ0aWVzKGNsaXAsIGNvbXBvbmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoY2xpcCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGV4dCk7XHJcbiAgICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFzeW5jIHBhc3RlQ29tcG9uZW50KGNsaXA6IENsaXBib2FyZERhdGEsIHRhcmdldDogQ29udGFpbmVyLCB2YXJuYW1lOiBzdHJpbmcsIHZhcmlhYmxlbGlzdG9sZDogYW55W10sIHZhcmlhYmxlbGlzdG5ldzogYW55W10pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjcmVhdGVkOiBDb21wb25lbnQ7XHJcbiAgICAgICAgaWYgKGNsaXAucHJvcGVydGllc1t2YXJuYW1lXSAhPT0gdW5kZWZpbmVkICYmIGNsaXAucHJvcGVydGllc1t2YXJuYW1lXVtcIl9uZXdfXCJdICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB2YXJ0eXBlID0gY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdW1wiX25ld19cIl1bMF07XHJcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZWxpc3RvbGQuaW5kZXhPZih2YXJuYW1lKSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXJ0eXBlID0gdmFydHlwZS5zcGxpdChcIihcIilbMF0uc3BsaXQoXCJuZXcgXCIpWzFdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhcmdldG5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QodGFyZ2V0KTtcclxuICAgICAgICAgICAgdmFyIG5ld2NvbXAgPSB7IGNyZWF0ZUZyb21UeXBlOiBjbGlwLnR5cGVzW3Zhcm5hbWVdIH07XHJcbiAgICAgICAgICAgIGF3YWl0IGNsYXNzZXMubG9hZENsYXNzKGNsaXAudHlwZXNbdmFybmFtZV0pO1xyXG4gICAgICAgICAgICB2YXIgc3Zhcm5hbWUgPSB2YXJuYW1lLnNwbGl0KFwiLlwiKVt2YXJuYW1lLnNwbGl0KFwiLlwiKS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgY3JlYXRlZCA9IF90aGlzLmNyZWF0ZUNvbXBvbmVudChjbGlwLnR5cGVzW3Zhcm5hbWVdLCBuZXdjb21wLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGFyZ2V0LCB1bmRlZmluZWQsIGZhbHNlLCBzdmFybmFtZSk7XHJcbiAgICAgICAgICAgIHZhcmlhYmxlbGlzdG9sZC5wdXNoKHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB2YXJpYWJsZWxpc3RuZXcucHVzaChfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoY3JlYXRlZCkpO1xyXG4gICAgICAgICAgICAvL2NvcnJlY3QgZGVzaWduZHVtbXlcclxuICAgICAgICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCB0YXJnZXQuX2NvbXBvbmVudHMubGVuZ3RoOyB0KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaCA9IHRhcmdldC5fY29tcG9uZW50c1t0XTtcclxuICAgICAgICAgICAgICAgIGlmIChjaFtcInR5cGVcIl0gPT09IFwiYXRFbmRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5yZW1vdmUoY2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldC5hZGQoY2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9jb21wb25lbnQgaXMgYWxyZWFkeSBjcmVhdGVkIG91dHNpZGUgdGhlIGNvZGVcclxuICAgICAgICAgICAgY3JlYXRlZCA9IF90aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZSh2YXJuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsaXAuY2hpbGRyZW5bdmFybmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGNsaXAuY2hpbGRyZW5bdmFybmFtZV0ubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IF90aGlzLnBhc3RlQ29tcG9uZW50KGNsaXAsIDxDb250YWluZXI+Y3JlYXRlZCwgY2xpcC5jaGlsZHJlblt2YXJuYW1lXVtrXSwgdmFyaWFibGVsaXN0b2xkLCB2YXJpYWJsZWxpc3RuZXcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXN5bmMgcGFzdGUoKSB7XHJcbiAgICAgICAgdmFyIHRleHQgPSBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XHJcbiAgICAgICAgdmFyIGNyZWF0ZWRcclxuICAgICAgICB2YXIgY2xpcDogQ2xpcGJvYXJkRGF0YSA9IEpTT04ucGFyc2UodGV4dCk7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgdmFyaWFibGVsaXN0b2xkID0gW107XHJcbiAgICAgICAgdmFyIHZhcmlhYmxlbGlzdG5ldyA9IFtdO1xyXG4gICAgICAgIC8vY3JlYXRlIENvbXBvbmVudHNcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNsaXAudmFyTmFtZXNUb0NvcHkubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIHZhcm5hbWUgPSBjbGlwLnZhck5hbWVzVG9Db3B5W3hdO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0OiBDb250YWluZXIgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWU7XHJcbiAgICAgICAgICAgIGF3YWl0IF90aGlzLnBhc3RlQ29tcG9uZW50KGNsaXAsIHRhcmdldCwgdmFybmFtZSwgdmFyaWFibGVsaXN0b2xkLCB2YXJpYWJsZWxpc3RuZXcpO1xyXG5cclxuICAgICAgICAgICAgLy9zZXQgcHJvcGVydGllc1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2luIHRoZSBuZXcgVGV4dCB0aGUgdmFyaWFibGVzIGFyZSByZW5hbWVkXHJcbiAgICAgICAgdmFyIHRleHRuZXcgPSB0ZXh0O1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmFyaWFibGVsaXN0bmV3Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvbGROYW1lID0gdmFyaWFibGVsaXN0b2xkW3hdO1xyXG4gICAgICAgICAgICB2YXIgbmV3TmFtZSA9IHZhcmlhYmxlbGlzdG5ld1t4XTtcclxuICAgICAgICAgICAgaWYgKG9sZE5hbWUgIT09IG5ld05hbWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIlxcXFxXXCIgKyBvbGROYW1lICsgXCJcXFxcV1wiKTtcclxuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoZm91bmQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dG5ldyA9IHRleHRuZXcucmVwbGFjZShyZWcsIGZ1bmN0aW9uIHJlcGxhY2VyKG1hdGNoLCBvZmZzZXQsIHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwMSBpcyBub25kaWdpdHMsIHAyIGRpZ2l0cywgYW5kIHAzIG5vbi1hbHBoYW51bWVyaWNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoLnN1YnN0cmluZygwLCAxKSArIG5ld05hbWUgKyBtYXRjaC5zdWJzdHJpbmcobWF0Y2gubGVuZ3RoIC0gMSwgbWF0Y2gubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjbGlwID0gSlNPTi5wYXJzZSh0ZXh0bmV3KTtcclxuXHJcbiAgICAgICAgLy9zZXQgcHJvcGVydGllc1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmFyaWFibGVsaXN0bmV3Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZW5hbWUgPSB2YXJpYWJsZWxpc3RuZXdbeF1cclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNsaXAucHJvcGVydGllc1t2YXJpYWJsZW5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSBcIl9uZXdfXCIgJiYga2V5ICE9PSBcImNvbmZpZ1wiICYmIGtleSAhPSBcImFkZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BkYXRhID0gY2xpcC5wcm9wZXJ0aWVzW3ZhcmlhYmxlbmFtZV1ba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IHByb3BkYXRhLmxlbmd0aDsgdisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdmFsdWU6IHN0cmluZyA9IHByb3BkYXRhW3ZdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50ID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHZhcmlhYmxlbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmduYW1lcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxsdmFycyA9IF90aGlzLmNvZGVFZGl0b3IudmFyaWFibGVzLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2ludHJvZHVjZSB2YXJpYWJsZXMgcmVwbGFjZSBtZS50ZXh0Ym94MS0+bWVfdGV4dGJveDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdnYgPSAwOyB2diA8IGFsbHZhcnMubGVuZ3RoOyB2disrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld3Zhcm5hbWUgPSBhbGx2YXJzW3Z2XS5uYW1lLnJlcGxhY2VBbGwoXCIuXCIsIFwiX1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN2YWx1ZSA9IHN2YWx1ZS5yZXBsYWNlQWxsKGFsbHZhcnNbdnZdLm5hbWUsIG5ld3Zhcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld3Zhcm5hbWUgIT09IFwidGhpc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnbmFtZXMucHVzaChuZXd2YXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzLnB1c2goYWxsdmFyc1t2dl0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3NldCB2YWx1ZSBpbiBEZXNpZ25lclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlYWx2YWx1ZSA9IG5ldyBGdW5jdGlvbiguLi5hcmduYW1lcywgXCJyZXR1cm4gKFwiICsgc3ZhbHVlICsgXCIpO1wiKS5iaW5kKF90aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIikpKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoY29tcG9uZW50W2tleV0pID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRba2V5XShyZWFsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRba2V5XSA9IHJlYWx2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5EZXNpZ24oa2V5LHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKGtleSwgcHJvcGRhdGFbdl0sIHByb3BkYXRhLmxlbmd0aCA+IDAsIHZhcmlhYmxlbmFtZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IGNyZWF0ZWQ7XHJcbiAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLmNvZGVFZGl0b3IudmFsdWUgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpO1xyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xyXG4gICAgICAgIC8vaW5jbHVkZSB0aGUgbmV3IGVsZW1lbnRcclxuICAgICAgICBfdGhpcy5lZGl0RGlhbG9nKHRydWUpO1xyXG4gICAgICAgIF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci51cGRhdGUoKTtcclxuICAgICAgICBfdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBleGVjdXRlIHRoZSBjdXJyZW50IGNvZGVcclxuICAgICogQHBhcmFtIHtib29sZWFufSB0b0N1cnNvciAtICBpZiB0cnVlIHRoZSB2YXJpYWJsZXMgd2VyZSBpbnNwZWN0ZWQgb24gY3Vyc29yIHBvc2l0aW9uLCBcclxuICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBmYWxzZSBhdCB0aGUgZW5kIG9mIHRoZSBsYXlvdXQoKSBmdW5jdGlvbiBvciBhdCB0aGUgZW5kIG9mIHRoZSBjb2RlXHJcbiAgICAqL1xyXG4gICAgZXZhbENvZGUodG9DdXJzb3IgPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLmV2YWxDb2RlKHRvQ3Vyc29yKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogc2F2ZSB0aGUgY29kZSB0byBzZXJ2ZXJcclxuICAgICovXHJcbiAgICBzYXZlKCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3Iuc2F2ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVuZG8gYWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHVuZG8oKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci51bmRvKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldENvbXBvbmVudElEc0luRGVzaWduKGNvbXBvbmVudDogQ29tcG9uZW50LCBjb2xsZWN0OiBzdHJpbmdbXSkge1xyXG5cclxuICAgICAgICBjb2xsZWN0LnB1c2goXCIjXCIgKyBjb21wb25lbnQuX2lkKTtcclxuICAgICAgICB2YXIgY2hpbGRzID0gY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl07XHJcbiAgICAgICAgaWYgKGNoaWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY2hpbGRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudElEc0luRGVzaWduKGNoaWxkc1t4XSwgY29sbGVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGRpYWxvZyBlZGl0IG1vZGVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gaWYgdHJ1ZSBhbGxvdyByZXNpemluZyBhbmQgZHJhZyBhbmQgZHJvcCBcclxuICAgICAqL1xyXG4gICAgZWRpdERpYWxvZyhlbmFibGUpIHtcclxuXHJcblxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGVuYWJsZTtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24udG9nZ2xlKCF0aGlzLmVkaXRNb2RlKTtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24uaGlkZGVuID0gIWVuYWJsZTtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLmhpZGRlbiA9ICFlbmFibGU7XHJcbiAgICAgICAgdGhpcy5jdXRCdXR0b24uaGlkZGVuID0gIWVuYWJsZTtcclxuICAgICAgICB0aGlzLmNvcHlCdXR0b24uaGlkZGVuID0gIWVuYWJsZTtcclxuICAgICAgICB0aGlzLnBhc3RlQnV0dG9uLmhpZGRlbiA9ICFlbmFibGU7XHJcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdO1xyXG4gICAgICAgIC8vc3dpdGNoIGRlc2lnbm1vZGVcclxuICAgICAgICB2YXIgY29tcHMgPSAkKGNvbXBvbmVudC5kb20pLmZpbmQoXCIuamNvbXBvbmVudFwiKTtcclxuICAgICAgICBjb21wcy5hZGRDbGFzcyhcImpkZXNpZ25tb2RlXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY29tcHMubGVuZ3RoOyBjKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb21wc1tjXS5fdGhpc1tcImV4dGVuc2lvbkNhbGxlZFwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wc1tjXS5fdGhpc1tcImV4dGVuc2lvbkNhbGxlZFwiXSh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50RGVzaWduZXJTZXREZXNpZ25Nb2RlOiB7IGVuYWJsZSwgY29tcG9uZW50RGVzaWduZXI6IHRoaXMgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbXBzW2NdLl90aGlzW1wic2V0RGVzaWduTW9kZVwiXShlbmFibGUsdGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudFtcImV4dGVuc2lvbkNhbGxlZFwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudFtcImV4dGVuc2lvbkNhbGxlZFwiXSh7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnREZXNpZ25lclNldERlc2lnbk1vZGU6IHsgZW5hYmxlLCBjb21wb25lbnREZXNpZ25lcjogdGhpcyB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9pZihjb21wb25lbnRbXCJzZXREZXNpZ25Nb2RlXCJdIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAvLyAgICAgICAgY29tcG9uZW50W1wic2V0RGVzaWduTW9kZVwiXShlbmFibGUsdGhpcyk7XHJcbiAgICAgICAgLy8gICAgfVxyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7Ly92YXJpYWJsZXMgY2FuIGJlIGFkZGVkIHdpdGggUmVwZWF0ZXIuc2V0RGVzaWduTW9kZVxyXG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplci51bmluc3RhbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2RyYWdhbmRkcm9wcGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIudW5pbnN0YWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZW5hYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBhbGxjb21wb25lbnRzID0gdGhpcy52YXJpYWJsZXMuZ2V0RWRpdGFibGVDb21wb25lbnRzKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eUVkaXRvci5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudElEc0luRGVzaWduKGNvbXBvbmVudCwgcmV0KTtcclxuICAgICAgICAgICAgICAgIGFsbGNvbXBvbmVudHMgPSByZXQuam9pbihcIixcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgYWxsY29tcG9uZW50cyA9IHRoaXMudmFyaWFibGVzLmdldEVkaXRhYmxlQ29tcG9uZW50cyhjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAvL3RoaXMuX2luc3RhbGxUaW55RWRpdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyID0gbmV3IERyYWdBbmREcm9wcGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIgPSBuZXcgUmVzaXplcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLmRyYWdhbmRkcm9wcGVyID0gdGhpcy5fZHJhZ2FuZGRyb3BwZXI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLm9uZWxlbWVudHNlbGVjdGVkID0gZnVuY3Rpb24gKGVsZW1lbnRJRHMsIGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZWxlbWVudElEcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYiA9ICQoXCIjXCIgKyBlbGVtZW50SURzW3hdKVswXS5fdGhpcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JbXCJlZGl0b3JzZWxlY3R0aGlzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYiA9IG9iW1wiZWRpdG9yc2VsZWN0dGhpc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICByZXQucHVzaChvYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmV0Lmxlbmd0aCA9PT0gMSlcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSByZXRbMF07XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IHJldDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIub25wcm9wZXJ0eWNoYW5nZWQgPSBmdW5jdGlvbiAoY29tcDogQ29tcG9uZW50LCBwcm9wOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgIT09IGNvbXApXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gY29tcDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShwcm9wLCB2YWx1ZSArIFwiXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLmluc3RhbGwoY29tcG9uZW50LCBhbGxjb21wb25lbnRzKTtcclxuICAgICAgICAgICAgYWxsY29tcG9uZW50cyA9IHRoaXMudmFyaWFibGVzLmdldEVkaXRhYmxlQ29tcG9uZW50cyhjb21wb25lbnQsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci5pbnN0YWxsKGNvbXBvbmVudCwgYWxsY29tcG9uZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLm9ucHJvcGVydHljaGFuZ2VkID0gZnVuY3Rpb24gKGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBvbGRQYXJlbnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5tb3ZlQ29tcG9uZW50KGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBvbGRQYXJlbnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci5vbnByb3BlcnR5YWRkZWQgPSBmdW5jdGlvbiAodHlwZSwgY29tcG9uZW50LCB0b3AsIGxlZnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVDb21wb25lbnQodHlwZSwgY29tcG9uZW50LCB0b3AsIGxlZnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLmlzRHJhZ0VuYWJsZWQgPSBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuX3Jlc2l6ZXIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX3Jlc2l6ZXIuY29tcG9uZW50VW5kZXJDdXJzb3IgIT09IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlci51cGRhdGUoKTtcclxuICAgICAgICAvKiAgJChcIi5ob2hvMlwiKS5zZWxlY3RhYmxlKHt9KTtcclxuICAgICAgICAgICQoXCIuaG9obzJcIikuc2VsZWN0YWJsZShcImRpc2FibGVcIik7Ki9cclxuICAgICAgICAvKiAgJChcIi5IVE1MUGFuZWxcIikuc2VsZWN0YWJsZSh7fSk7XHJcbiAgICAgICAgICAkKFwiLkhUTUxQYW5lbFwiKS5zZWxlY3RhYmxlKFwiZGlzYWJsZVwiKTtcclxuICAgICAgICAgICQoXCIuSFRNTFBhbmVsXCIpLmRyYWdnYWJsZSh7fSk7XHJcbiAgICAgICAgICAkKFwiLkhUTUxQYW5lbFwiKS5kcmFnZ2FibGUoXCJkaXNhYmxlXCIpOyovXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtb3ZlIGEgY29tcG9uZW50XHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRvIG1vdmVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgLSB0aGUgdG9wIGFic29sdXRlIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVmdCAtIHRoZSBsZWZ0IGFic29sdXRlIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29udGFpbmVyfSBuZXdQYXJlbnQgLSB0aGUgbmV3IHBhcmVudCBjb250YWluZXIgd2hlcmUgdGhlIGNvbXBvbmVudCBtb3ZlIHRvXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBiZWZvcmVDb21wb25lbnQgLSBpbnNlcnQgdGhlIGNvbXBvbmVudCBiZWZvcmUgYmVmb3JlQ29tcG9uZW50XHJcbiAgICAgKiovXHJcbiAgICBtb3ZlQ29tcG9uZW50KGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBvbGRQYXJlbnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAvKmlmKGJlZm9yZUNvbXBvbmVudCE9PXVuZGVmaW5lZCYmYmVmb3JlQ29tcG9uZW50LmRlc2lnbkR1bW15Rm9yIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgYmVmb3JlQ29tcG9uZW50PXVuZGVmaW5lZDtcclxuICAgICAgICB9Ki9cclxuICAgICAgICB2YXIgb2xkTmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChvbGRQYXJlbnQpO1xyXG4gICAgICAgIHZhciBuZXdOYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG5ld1BhcmVudCk7XHJcbiAgICAgICAgdmFyIGNvbXBOYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNvbXBvbmVudCk7XHJcbiAgICAgICAgaWYgKHRvcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInhcIiwgdG9wICsgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwieFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxlZnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJ5XCIsIGxlZnQgKyBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJ5XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9sZFBhcmVudCAhPT0gbmV3UGFyZW50IHx8IGJlZm9yZUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkIHx8IHRvcCA9PT0gdW5kZWZpbmVkKSB7Ly90b3A9dW5kZWZpbmVkIC0+b24gcmVsYXRpdmUgcG9zaXRpb24gYXQgdGhlIGVuZCBjYWxsIHRoZSBibG9ja1xyXG4gICAgICAgICAgICAvL2dldCBQb3NpdGlvblxyXG4gICAgICAgICAgICB2YXIgb2xkVmFsID0gX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIGNvbXBOYW1lLCBvbGROYW1lLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHZhciBiZWZvcmU7XHJcbiAgICAgICAgICAgIGlmIChiZWZvcmVDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiBiZWZvcmVDb21wb25lbnQudHlwZSAhPT0gXCJhdEVuZFwiKSB7Ly9kZXNpZ25kdW1teSBhdEVuZFxyXG4gICAgICAgICAgICAgICAgdmFyIG9uID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGJlZm9yZSA9IHsgdmFyaWFibGVuYW1lOiBwYXIsIHByb3BlcnR5OiBcImFkZFwiLCB2YWx1ZTogb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgLypjb21wTmFtZSovb2xkVmFsLCBmYWxzZSwgbmV3TmFtZSwgYmVmb3JlKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIGlmKG5ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGg+MSl7Ly9jb3JyZWN0IGR1bW15XHJcbiAgICAgICAgICAgICB2YXIgZHVtbXk9XHRuZXdQYXJlbnQuX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0yXTtcclxuICAgICAgICAgICAgIGlmKGR1bW15LmRlc2lnbkR1bW15Rm9yIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAvL3ZhciB0bXA9bmV3UGFyZW50Ll9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAgbmV3UGFyZW50LnJlbW92ZShkdW1teSk7Ly8uX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0xXT1uZXdQYXJlbnQuX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0yXTtcclxuICAgICAgICAgICAgICAgICBuZXdQYXJlbnQuYWRkKGR1bW15KTsvLy5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTFdPXRtcDtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSovXHJcbiAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlO1xyXG4gICAgICAgIF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci52YWx1ZSA9IF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgbmV3IGNvbXBvbmVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgbmV3IGNvbXBvbmVudFxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0aGVtc2VsZlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcCAtIHRoZSB0b3AgYWJzb2x1dGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0gdGhlIGxlZnQgYWJzb2x1dGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db250YWluZXJ9IG5ld1BhcmVudCAtIHRoZSBuZXcgcGFyZW50IGNvbnRhaW5lciB3aGVyZSB0aGUgY29tcG9uZW50IGlzIHBsYWNlZFxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gYmVmb3JlQ29tcG9uZW50IC0gaW5zZXJ0IHRoZSBuZXcgY29tcG9uZW50IGJlZm9yZSBiZWZvcmVDb21wb25lbnRcclxuICAgICAqKi9cclxuICAgIGNyZWF0ZUNvbXBvbmVudCh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQsIGRvVXBkYXRlID0gdHJ1ZSwgc3VnZ2VzdGVkTmFtZTogc3RyaW5nID0gdW5kZWZpbmVkKTogQ29tcG9uZW50IHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8qaWYoYmVmb3JlQ29tcG9uZW50IT09dW5kZWZpbmVkJiZiZWZvcmVDb21wb25lbnQuZGVzaWduRHVtbXlGb3ImJmJlZm9yZUNvbXBvbmVudC50eXBlPT09XCJhdEVuZFwiKXtcclxuICAgICAgICAgICAgYmVmb3JlQ29tcG9uZW50PXVuZGVmaW5lZDtcclxuICAgICAgICB9Ki9cclxuICAgICAgICB2YXIgZmlsZSA9IHR5cGUucmVwbGFjZUFsbChcIi5cIiwgXCIvXCIpO1xyXG4gICAgICAgIHZhciBzdHlwZSA9IGZpbGUuc3BsaXQoXCIvXCIpW2ZpbGUuc3BsaXQoXCIvXCIpLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5hZGRJbXBvcnRJZk5lZWRlZChzdHlwZSwgZmlsZSk7XHJcbiAgICAgICAgdmFyIHJlcGVhdGVyID0gX3RoaXMuX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihuZXdQYXJlbnQpO1xyXG4gICAgICAgIHZhciBzY29wZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAocmVwZWF0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVwZWF0ZXJuYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHJlcGVhdGVyKTtcclxuICAgICAgICAgICAgdmFyIHRlc3QgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyLmdldFByb3BlcnR5VmFsdWUocmVwZWF0ZXJuYW1lLCBcImNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiKTtcclxuICAgICAgICAgICAgc2NvcGUgPSB7IHZhcmlhYmxlbmFtZTogcmVwZWF0ZXJuYW1lLCBtZXRob2RuYW1lOiBcImNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiIH07XHJcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZnVuYyA9IFwiZnVuY3Rpb24obWU6TWUpe1xcblxcdFwiICsgcmVwZWF0ZXJuYW1lICsgXCIuZGVzaWduLmNvbmZpZyh7fSk7XFxufVwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhcmRhdGFiaW5kZXIgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IuZ2V0TmV4dFZhcmlhYmxlTmFtZUZvclR5cGUoXCJqYXNzaWpzLnVpLkRhdGFiaW5kZXJcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLl9wcm9wZXJ0eUVkaXRvci5wYXJzZXIuZ2V0UHJvcGVydHlWYWx1ZShyZXBlYXRlcm5hbWUsIFwiY29uZmlnXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Z1bmMgPSBcImZ1bmN0aW9uKG1lOk1lKXtcXG5cXHRcXG59XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJjcmVhdGVSZXBlYXRpbmdDb21wb25lbnRcIiwgc2Z1bmMsIHRydWUsIHJlcGVhdGVybmFtZSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgICAgICAgICByZXBlYXRlci5jcmVhdGVSZXBlYXRpbmdDb21wb25lbnQoZnVuY3Rpb24gKG1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Rlc2lnbk1vZGUgIT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAvL190aGlzLnZhcmlhYmxlcy5hZGRWYXJpYWJsZSh2YXJkYXRhYmluZGVyLGRhdGFiaW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvKnZhciBkYj1uZXcgamFzc2lqcy51aS5EYXRhYmluZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXBlYXRlci52YWx1ZSE9PXVuZGVmaW5lZCYmcmVwZWF0ZXIudmFsdWUubGVuZ3RoPjApXHJcbiAgICAgICAgICAgICAgICAgICAgZGIudmFsdWU9cmVwZWF0ZXIudmFsdWVbMF07XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YXJpYWJsZXMuYWRkKHZhcmRhdGFiaW5kZXIsZGIpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7Ki9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdmFydmFsdWUgPSBuZXcgKGNsYXNzZXMuZ2V0Q2xhc3ModHlwZSkpO1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gX3RoaXMuY3JlYXRlVmFyaWFibGUodHlwZSwgc2NvcGUsIHZhcnZhbHVlLCBzdWdnZXN0ZWROYW1lKTtcclxuICAgICAgICBpZiAodGhpcy5fcHJvcGVydHlFZGl0b3IuY29kZUVkaXRvciAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbmV3TmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChuZXdQYXJlbnQpO1xyXG4gICAgICAgICAgICB2YXIgYmVmb3JlO1xyXG4gICAgICAgICAgICBpZiAoYmVmb3JlQ29tcG9uZW50ICE9PSB1bmRlZmluZWQgJiYgYmVmb3JlQ29tcG9uZW50LnR5cGUgIT09IFwiYXRFbmRcIikgey8vRGVzaWduZHVtbXkgYXRFbmRcclxuICAgICAgICAgICAgICAgIC8vaWYoYmVmb3JlQ29tcG9uZW50LnR5cGU9PT1cImJlZm9yZUNvbXBvbmVudFwiKVxyXG4gICAgICAgICAgICAgICAgLy8gICBiZWZvcmVDb21wb25lbnQ9YmVmb3JlQ29tcG9uZW50LmRlc2lnbkR1bW15Rm9yO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9uID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGJlZm9yZSA9IHsgdmFyaWFibGVuYW1lOiBwYXIsIHByb3BlcnR5OiBcImFkZFwiLCB2YWx1ZTogb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgdmFybmFtZSwgZmFsc2UsIG5ld05hbWUsIGJlZm9yZSwgc2NvcGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGJlZm9yZUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG5ld1BhcmVudC5hZGRCZWZvcmUodmFydmFsdWUsIGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3UGFyZW50LmFkZCh2YXJ2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIGlmKG5ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGg+MSl7Ly9jb3JyZWN0IGR1bW15XHJcbiAgICAgICAgICAgICBpZihuZXdQYXJlbnQuX2Rlc2lnbkR1bW15KXtcclxuICAgICAgICAgICAgICAgICAvL3ZhciB0bXA9bmV3UGFyZW50Ll9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAgbmV3UGFyZW50LmRvbS5yZW1vdmVDaGlsZChuZXdQYXJlbnQuX2Rlc2lnbkR1bW15LmRvbVdyYXBwZXIpXHJcbiAgICAgICAgICAgICAgICAgbmV3UGFyZW50LmRvbS5hcHBlbmQobmV3UGFyZW50Ll9kZXNpZ25EdW1teS5kb21XcmFwcGVyKVxyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9Ki9cclxuICAgICAgICBfdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTtcclxuXHJcbiAgICAgICAgLy9zZXQgaW5pdGlhbCBwcm9wZXJ0aWVzIGZvciB0aGUgbmV3IGNvbXBvbmVudFxyXG4gICAgICAgIGlmIChjb21wb25lbnQuY3JlYXRlRnJvbVBhcmFtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBvbmVudC5jcmVhdGVGcm9tUGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBjb21wb25lbnQuY3JlYXRlRnJvbVBhcmFtW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gJ1wiJyArIHZhbCArICdcIic7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoa2V5LCB2YWwsIHRydWUsIHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHZhcnZhbHVlLCBjb21wb25lbnQuY3JlYXRlRnJvbVBhcmFtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRvcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInhcIiwgdG9wICsgXCJcIiwgdHJ1ZSwgdmFybmFtZSk7XHJcbiAgICAgICAgICAgIHZhcnZhbHVlLnggPSB0b3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwieVwiLCBsZWZ0ICsgXCJcIiwgdHJ1ZSwgdmFybmFtZSk7XHJcbiAgICAgICAgICAgIHZhcnZhbHVlLnkgPSBsZWZ0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9ub3RpZnkgY29tcG9uZW50ZGVzY3JpcHRvciBcclxuICAgICAgICB2YXIgYWMgPSB2YXJ2YWx1ZS5leHRlbnNpb25DYWxsZWQ7XHJcbiAgICAgICAgaWYgKGFjICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFydmFsdWUuZXh0ZW5zaW9uQ2FsbGVkKHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudERlc2lnbmVyQ29tcG9uZW50Q3JlYXRlZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1BhcmVudDogbmV3UGFyZW50XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG9VcGRhdGUpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gdmFydmFsdWU7XHJcbiAgICAgICAgICAgIC8vaW5jbHVkZSB0aGUgbmV3IGVsZW1lbnRcclxuICAgICAgICAgICAgX3RoaXMuZWRpdERpYWxvZyh0cnVlKTtcclxuICAgICAgICAgICAgX3RoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBfdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFydmFsdWU7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVWYXJpYWJsZSh0eXBlLCBzY29wZSwgdmFydmFsdWUsIHN1Z2dlc3RlZE5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eUVkaXRvci5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHRoaXMuX3Byb3BlcnR5RWRpdG9yLmFkZFZhcmlhYmxlSW5Db2RlKHR5cGUsIHNjb3BlLCBzdWdnZXN0ZWROYW1lKTtcclxuXHJcbiAgICAgICAgLyogaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSAmJiB0aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcIm1lXCIpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgIHZhciBtZSA9IHRoaXMuX2NvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwibWVcIik7XHJcbiAgICAgICAgICAgICBtZVt2YXJuYW1lLnN1YnN0cmluZygzKV0gPSB2YXJ2YWx1ZTtcclxuICAgICAgICAgfSBlbHNlIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSkge1xyXG4gICAgICAgICAgICAgdmFyIHRoID0gdGhpcy5fY29kZUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUoXCJ0aGlzXCIpO1xyXG4gICAgICAgICAgICAgdGhbdmFybmFtZS5zdWJzdHJpbmcoNSldID0gdmFydmFsdWU7XHJcbiAgICAgICAgIH0gZWxzZSovXHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUodmFybmFtZSwgdmFydmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB2YXJuYW1lO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGVyZSBhIHBhcmVudCB0aGF0IGFjdHMgYSByZXBlYXRpbmcgY29udGFpbmVyP1xyXG4gICAgICoqL1xyXG4gICAgX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoY29tcG9uZW50ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNvbXBvbmVudCkgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgUmVwZWF0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihjb21wb25lbnQuX3BhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsVmFyaWFibGVzKHJvb3Q6IENvbXBvbmVudCwgY29tcG9uZW50OiBDb21wb25lbnQsIGNhY2hlOiB7IFtjb21wb25lbnRpZDogc3RyaW5nXTogeyBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyIH0gfSkge1xyXG4gICAgICAgIGlmIChjYWNoZVtjb21wb25lbnQuX2lkXSA9PT0gdW5kZWZpbmVkICYmIGNvbXBvbmVudFtcIl9fc3RhY2tcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgbGluZXMgPSBjb21wb25lbnRbXCJfX3N0YWNrXCJdPy5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBsaW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNsaW5lOiBzdHJpbmcgPSBsaW5lc1t4XTtcclxuICAgICAgICAgICAgICAgIGlmIChzbGluZS5pbmRleE9mKFwiJHRlbXAuanNcIikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwbCA9IHNsaW5lLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZW50ciA9IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlW2NvbXBvbmVudC5faWRdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lOiBOdW1iZXIoc3BsW3NwbC5sZW5ndGggLSAyXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogTnVtYmVyKHNwbFtzcGwubGVuZ3RoIC0gMV0ucmVwbGFjZShcIilcIiwgXCJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbFZhcmlhYmxlcyhyb290LCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXVt4XSwgY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgPT09IHJvb3QpIHtcclxuICAgICAgICAgICAgICAgIC8vZmVydGlnXHJcbiAgICAgICAgICAgICAgICB2YXIgaGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge2phc3NpanMudWkuQ29tcG9uZW50fSAtIHRoZSBkZXNpZ25lZCBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgc2V0IGRlc2lnbmVkQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMuZmlsbFZhcmlhYmxlcyhjb21wb25lbnQsIGNvbXBvbmVudCwge30pO1xyXG4gICAgICAgIHZhciBjb20gPSBjb21wb25lbnQ7XHJcbiAgICAgICAgaWYgKGNvbVtcImlzQWJzb2x1dGVcIl0gIT09IHRydWUgJiYgY29tLndpZHRoID09PSBcIjBcIiAmJiBjb20uaGVpZ2h0ID09PSBcIjBcIikge1xyXG4gICAgICAgICAgICBjb21wb25lbnQud2lkdGggPSBcImNhbGMoMTAwJSAtIDFweClcIjtcclxuICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IFwiY2FsYygxMDAlIC0gMXB4KVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fY29kZUVkaXRvci5fX2V2YWxUb0N1cnNvclJlYWNoZWQgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5zaG93KFwiZGVzaWduXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIucmVtb3ZlKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdLCB0cnVlKTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5hZGQoY29tcG9uZW50KTtcclxuICAgICAgICAvLyBcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICB0aGlzLmVkaXREaWFsb2codGhpcy5lZGl0TW9kZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHRoaXMuZWRpdE1vZGUpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlci52YWx1ZSA9IGNvbXBvbmVudDtcclxuXHJcbiAgICAgICAgJCh0aGlzLmRvbSkuZm9jdXMoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUludmlzaWJsZUNvbXBvbmVudHMoKTtcclxuICAgICAgICB3aGlsZSAodGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5kb20uZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbS5maXJzdENoaWxkLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy92YXIgcGFyc2VyPW5ldyBqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yLlBhcnNlcigpO1xyXG4gICAgICAgIC8vcGFyc2VyLnBhcnNlKF90aGlzLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGdldCBkZXNpZ25lZENvbXBvbmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF07XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplci51bmluc3RhbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2RyYWdhbmRkcm9wcGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIuaXNEcmFnRW5hYmxlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIudW5pbnN0YWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yPy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50UGFsZXR0ZT8uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyPy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cz8uZGVzdHJveSgpO1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICByZXR1cm4gbmV3IENvbXBvbmVudERlc2lnbmVyKCk7XHJcblxyXG59O1xyXG5cclxuXHJcbiJdfQ==