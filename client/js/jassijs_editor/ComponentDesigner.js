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
            this.removeButton = new Button_1.Button();
            this.removeButton.icon = "mdi mdi-delete-forever-outline mdi-18px";
            this.removeButton.tooltip = "Delete selected Control (ENTF)";
            this.removeButton.onclick(function () {
                _this.removeComponent();
            });
            this._designToolbar.add(this.removeButton);
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
                    _this.removeComponent();
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
        removeComponent() {
            var todel = this._propertyEditor.value;
            var varname = this._codeEditor.getVariableFromObject(todel);
            if (varname !== "this") {
                if (todel.domWrapper._parent !== undefined) {
                    todel.domWrapper._parent.remove(todel);
                }
                this._propertyEditor.removeVariableInCode(varname);
                this._propertyEditor.removeVariableInDesign(varname);
                this._updateInvisibleComponents();
            }
        }
        copyProperties(clip, component) {
            var _a;
            var varname = this._codeEditor.getVariableFromObject(component);
            var parserdata = this._propertyEditor.parser.data[varname];
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
        copy() {
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
            navigator.clipboard.writeText(text).then(() => {
            });
        }
        async pasteComponent(clip, target, varname, variablelistold, variablelistnew) {
            var _this = this;
            var vartype = clip.properties[varname]["_new_"][0];
            if (variablelistold.indexOf(varname) > -1)
                return;
            vartype = vartype.split("(")[0].split("new ")[1];
            var targetname = _this._codeEditor.getVariableFromObject(target);
            var newcomp = { createFromType: clip.types[varname] };
            await Classes_1.classes.loadClass(clip.types[varname]);
            var svarname = varname.split(".")[varname.split(".").length - 1];
            var created = _this.createComponent(clip.types[varname], newcomp, undefined, undefined, target, undefined, false, svarname);
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
            this.removeButton.hidden = !enable;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50RGVzaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX2VkaXRvci9Db21wb25lbnREZXNpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBa0NBLE1BQU0sYUFBYTtRQUFuQjtZQUNJLG1CQUFjLEdBQWEsRUFBRSxDQUFDO1lBQzlCLGFBQVEsR0FBaUMsRUFBRSxDQUFDO1lBQzVDLGVBQVUsR0FBc0QsRUFBRSxDQUFDO1lBQ25FLFVBQUssR0FBK0IsRUFBRSxDQUFDO1FBQzNDLENBQUM7S0FBQTtJQUlELElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWtCLFNBQVEsYUFBSztRQXVCeEM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUV6QixDQUFDO1FBQ0QsYUFBYSxDQUFDLE1BQU07WUFDaEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3pDLENBQUM7UUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFLO1lBQ2hCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO1lBQzVDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSwrQkFBYyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1RCx3REFBd0Q7WUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ2hE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Q0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbEQ7WUFFRCxvREFBb0Q7WUFDcEQsNEJBQTRCO1FBQ2hDLENBQUM7UUFDRCxJQUFJLGlCQUFpQjtZQUNqQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELE9BQU87O1lBQ0gsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUM3QjtZQUNELElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNwQztZQUNELE1BQUEsSUFBSSxDQUFDLGVBQWUsMENBQUUsT0FBTyxFQUFFLENBQUM7WUFDaEMsTUFBQSxJQUFJLENBQUMsaUJBQWlCLDBDQUFFLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLE1BQUEsSUFBSSxDQUFDLGtCQUFrQiwwQ0FBRSxPQUFPLEVBQUUsQ0FBQztZQUNuQyxNQUFBLElBQUksQ0FBQyxvQkFBb0IsMENBQUUsT0FBTyxFQUFFLENBQUM7WUFDckMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FFSixDQUFBO0lBdjBCWSxpQkFBaUI7UUFEN0IsSUFBQSxjQUFNLEVBQUMsa0NBQWtDLENBQUM7O09BQzlCLGlCQUFpQixDQXUwQjdCO0lBdjBCWSw4Q0FBaUI7SUF3MEJ2QixLQUFLLFVBQVUsSUFBSTtRQUN0QixPQUFPLElBQUksaUJBQWlCLEVBQUUsQ0FBQztJQUVuQyxDQUFDO0lBSEQsb0JBR0M7SUFBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgVmFyaWFibGVQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1ZhcmlhYmxlUGFuZWxcIjtcclxuaW1wb3J0IHsgUHJvcGVydHlFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnRFeHBsb3JlciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db21wb25lbnRFeHBsb3JlclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnRQYWxldHRlIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvbXBvbmVudFBhbGV0dGVcIjtcclxuaW1wb3J0IHsgUmVzaXplciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci91dGlsL1Jlc2l6ZXJcIjtcclxuLy9pbXBvcnQgRHJhZ0FuZERyb3BwZXIgZnJvbSBcImphc3NpanMvdWkvaGVscGVyL0RyYWdBbmREcm9wcGVyXCI7XHJcbmltcG9ydCB7IEVycm9yUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9FcnJvclBhbmVsXCI7XHJcbmltcG9ydCB7IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzXCI7XHJcbmltcG9ydCB7IFJlcGVhdGVyIH0gZnJvbSBcImphc3NpanMvdWkvUmVwZWF0ZXJcIjtcclxuaW1wb3J0IFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgRHJhZ0FuZERyb3BwZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvdXRpbC9EcmFnQW5kRHJvcHBlclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnREZXNjcmlwdG9yIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50RGVzY3JpcHRvclwiO1xyXG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcImphc3NpanMvdWkvQ29udGFpbmVyXCI7XHJcbmltcG9ydCB7IEJveFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvQm94UGFuZWxcIjtcclxuLy9pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi91dGlsL1BhcnNlclwiO1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeHRlbnNpb25BY3Rpb24ge1xyXG4gICAgICAgIGNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZT86IHtcclxuICAgICAgICAgICAgZW5hYmxlOiBib29sZWFuLFxyXG4gICAgICAgICAgICBjb21wb25lbnREZXNpZ25lcjogQ29tcG9uZW50RGVzaWduZXJcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcG9uZW50RGVzaWduZXJDb21wb25lbnRDcmVhdGVkPzoge1xyXG4gICAgICAgICAgICAvL2NvbXBvbmVudDpDb21wb25lbnRcclxuICAgICAgICAgICAgbmV3UGFyZW50OiBDb250YWluZXJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENsaXBib2FyZERhdGEge1xyXG4gICAgdmFyTmFtZXNUb0NvcHk6IHN0cmluZ1tdID0gW107XHJcbiAgICBjaGlsZHJlbjogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nW10gfSA9IHt9O1xyXG4gICAgcHJvcGVydGllczogeyBbbmFtZTogc3RyaW5nXTogeyBbcHJvcG5hbWU6IHN0cmluZ106IGFueVtdIH0gfSA9IHt9O1xyXG4gICAgdHlwZXM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcbn1cclxuXHJcblxyXG5AJENsYXNzKFwiamFzc2lqc19lZGl0b3IuQ29tcG9uZW50RGVzaWduZXJcIilcclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudERlc2lnbmVyIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgX2NvZGVFZGl0b3I7XHJcbiAgICBlZGl0TW9kZTogYm9vbGVhbjtcclxuICAgIHZhcmlhYmxlczogVmFyaWFibGVQYW5lbDtcclxuICAgIF9wcm9wZXJ0eUVkaXRvcjogUHJvcGVydHlFZGl0b3I7XHJcbiAgICBfZXJyb3JzOiBFcnJvclBhbmVsO1xyXG4gICAgX2NvbXBvbmVudFBhbGV0dGU6IENvbXBvbmVudFBhbGV0dGU7XHJcbiAgICBfY29tcG9uZW50RXhwbG9yZXI6IENvbXBvbmVudEV4cGxvcmVyO1xyXG4gICAgX2ludmlzaWJsZUNvbXBvbmVudHM6IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzO1xyXG4gICAgX2Rlc2lnblRvb2xiYXI6IFBhbmVsO1xyXG4gICAgX2Rlc2lnblBsYWNlaG9sZGVyOiBQYW5lbDtcclxuICAgIF9yZXNpemVyOiBSZXNpemVyO1xyXG4gICAgX2RyYWdhbmRkcm9wcGVyOiBEcmFnQW5kRHJvcHBlcjtcclxuICAgIHNhdmVCdXR0b246IEJ1dHRvbjtcclxuICAgIHJ1bkJ1dHRvbjogQnV0dG9uO1xyXG4gICAgbGFzc29CdXR0b246IEJ1dHRvbjtcclxuICAgIHVuZG9CdXR0b246IEJ1dHRvbjtcclxuICAgIGVkaXRCdXR0b246IEJ1dHRvbjtcclxuICAgIHJlbW92ZUJ1dHRvbjogQnV0dG9uO1xyXG4gICAgaW5saW5lRWRpdG9yUGFuZWw6IFBhbmVsO1xyXG4gICAgY29weUJ1dHRvbjogQnV0dG9uO1xyXG4gICAgcGFzdGVCdXR0b246IEJ1dHRvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5faW5pdERlc2lnbigpO1xyXG4gICAgICAgIHRoaXMuZWRpdE1vZGUgPSB0cnVlO1xyXG5cclxuICAgIH1cclxuICAgIGNvbm5lY3RQYXJzZXIocGFyc2VyKSB7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyID0gcGFyc2VyO1xyXG4gICAgfVxyXG4gICAgc2V0IGNvZGVFZGl0b3IodmFsdWUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IHRoaXMuX2NvZGVFZGl0b3IudmFyaWFibGVzO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yID0gbmV3IFByb3BlcnR5RWRpdG9yKHZhbHVlLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIC8vICAgdGhpcy5fcHJvcGVydHlFZGl0b3I9bmV3IFByb3BlcnR5RWRpdG9yKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5fZXJyb3JzID0gdGhpcy5fY29kZUVkaXRvci5fZXJyb3JzO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGUgPSBuZXcgQ29tcG9uZW50UGFsZXR0ZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGUuc2VydmljZSA9IFwiJFVJQ29tcG9uZW50XCI7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIgPSBuZXcgQ29tcG9uZW50RXhwbG9yZXIodmFsdWUsIHRoaXMuX3Byb3BlcnR5RWRpdG9yKTtcclxuICAgICAgICB0aGlzLl9pbnZpc2libGVDb21wb25lbnRzID0gbmV3IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzKHZhbHVlKTtcclxuICAgICAgICB0aGlzLmFkZCh0aGlzLl9pbnZpc2libGVDb21wb25lbnRzKTtcclxuICAgICAgICB0aGlzLl9pbml0Q29tcG9uZW50RXhwbG9yZXIoKTtcclxuICAgICAgICB0aGlzLl9pbnN0YWxsVmlldygpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX2NvZGVQYW5lbC5vbmJsdXIoZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlcktleXMoKTtcclxuXHJcbiAgICB9XHJcbiAgICBnZXQgY29kZUVkaXRvcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29kZUVkaXRvcjtcclxuICAgIH1cclxuICAgIF9pbml0RGVzaWduKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhciA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyID0gbmV3IFBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLXJ1biBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi50b29sdGlwID0gXCJUZXN0IERpYWxvZ1wiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuZWRpdERpYWxvZyghX3RoaXMuZWRpdE1vZGUpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLmVkaXRCdXR0b24pO1xyXG5cclxuICAgICAgICB0aGlzLnNhdmVCdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uLnRvb2x0aXAgPSBcIlNhdmUoQ3RybCtTKVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLWNvbnRlbnQtc2F2ZSBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuc2F2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMuc2F2ZUJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8qICB0aGlzLnJ1bkJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICAgIHRoaXMucnVuQnV0dG9uLmljb24gPSBcIm1kaSBtZGktY2FyLWhhdGNoYmFjayBtZGktMThweFwiO1xyXG4gICAgICAgICAgdGhpcy5ydW5CdXR0b24udG9vbHRpcCA9IFwiUnVuKEY0KVwiO1xyXG4gICAgICAgICAgdGhpcy5ydW5CdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgX3RoaXMuZXZhbENvZGUoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5ydW5CdXR0b24pOyovXHJcblxyXG4gICAgICAgIHRoaXMudW5kb0J1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24uaWNvbiA9IFwibWRpIG1kaS11bmRvIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy51bmRvQnV0dG9uLnRvb2x0aXAgPSBcIlVuZG8gKFN0cmcrWilcIjtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnVuZG8oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLnVuZG9CdXR0b24pO1xyXG5cclxuICAgICAgICAvKiAgdmFyIHRlc3Q9bmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICB0ZXN0Lmljb249XCJtZGkgbWRpLWJ1ZyBtZGktMThweFwiO1xyXG4gICAgICAgICB0ZXN0LnRvb2x0aXA9XCJUZXN0XCI7XHJcbiAgICAgICAgIHRlc3Qub25jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAvL3ZhciBraz1fdGhpcy5fY29kZVZpZXcubGF5b3V0O1xyXG4gICAgICAgICB9KTtcclxuICAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGVzdCk7Ki9cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5sYXNzb0J1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLmljb24gPSBcIm1kaSBtZGktbGFzc28gbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLnRvb2x0aXAgPSBcIlNlbGVjdCBydWJiZXJiYW5kXCI7XHJcbiAgICAgICAgdGhpcy5sYXNzb0J1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmxhc3NvQnV0dG9uLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICBfdGhpcy5fcmVzaXplci5zZXRMYXNzb01vZGUodmFsKTtcclxuICAgICAgICAgICAgX3RoaXMuX2RyYWdhbmRkcm9wcGVyLmVuYWJsZURyYWdnYWJsZSghdmFsKTtcclxuICAgICAgICAgICAgLy9fdGhpcy5fZHJhZ2FuZGRyb3BwZXIuYWN0aXZhdGVEcmFnZ2luZyghdmFsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLmxhc3NvQnV0dG9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1kZWxldGUtZm9yZXZlci1vdXRsaW5lIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24udG9vbHRpcCA9IFwiRGVsZXRlIHNlbGVjdGVkIENvbnRyb2wgKEVOVEYpXCI7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnJlbW92ZUNvbXBvbmVudCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMucmVtb3ZlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLXJ1biBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi50b29sdGlwID0gXCJUZXN0IERpYWxvZ1wiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuZWRpdERpYWxvZyghX3RoaXMuZWRpdE1vZGUpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3B5QnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuY29weUJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLWNvbnRlbnQtY29weSBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMuY29weUJ1dHRvbi50b29sdGlwID0gXCJDb3B5XCI7XHJcbiAgICAgICAgdGhpcy5jb3B5QnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5jb3B5QnV0dG9uKTtcclxuICAgICAgICB0aGlzLnBhc3RlQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMucGFzdGVCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1jb250ZW50LXBhc3RlIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5wYXN0ZUJ1dHRvbi50b29sdGlwID0gXCJQYXN0ZVwiO1xyXG4gICAgICAgIHRoaXMucGFzdGVCdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnBhc3RlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5wYXN0ZUJ1dHRvbik7XHJcbiAgICAgICAgdmFyIGJveCA9IG5ldyBCb3hQYW5lbCgpO1xyXG4gICAgICAgIGJveC5ob3Jpem9udGFsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbCA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuX2lkID0gXCJpXCIgKyB0aGlzLmlubGluZUVkaXRvclBhbmVsLl9pZDtcclxuICAgICAgICB0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlubGluZUVkaXRvclBhbmVsLl9pZCk7XHJcbiAgICAgICAgJCh0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbSkuY3NzKFwiZGlzcGxheVwiLCBcImlubGluZVwiKTtcclxuICAgICAgICAkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tV3JhcHBlcikuY3NzKFwiZGlzcGxheVwiLCBcImlubGluZVwiKTtcclxuICAgICAgICAkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tKS5hZGRDbGFzcyhcIklubGluZUVkaXRvclBhbmVsXCIpO1xyXG5cclxuICAgICAgICAvLyAgIGJveC5oZWlnaHQ9NDA7XHJcbiAgICAgICAgYm94LmFkZCh0aGlzLl9kZXNpZ25Ub29sYmFyKTtcclxuICAgICAgICBib3guYWRkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwpO1xyXG4gICAgICAgIHRoaXMuYWRkKGJveCk7XHJcbiAgICAgICAgJCh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5kb21XcmFwcGVyKS5jc3MoXCJwb3NpdGlvblwiLCBcInJlbGF0aXZlXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgKiBtYW5hZ2Ugc2hvcnRjdXRzXHJcbiAgICovXHJcbiAgICByZWdpc3RlcktleXMoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAkKHRoaXMuX2NvZGVFZGl0b3IuX2Rlc2lnbi5kb20pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjFcIik7XHJcbiAgICAgICAgJCh0aGlzLl9jb2RlRWRpdG9yLl9kZXNpZ24uZG9tKS5rZXlkb3duKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUgJiYgZXZ0LnNoaWZ0S2V5KSB7Ly9GNFxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHRoaXNzPXRoaXMuX3RoaXMuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGVkaXRvciA9IGFjZS5lZGl0KHRoaXMuX3RoaXMuX2lkKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IDExNSkgey8vRjRcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gOTAgfHwgZXZ0LmN0cmxLZXkpIHsvL0N0cmwrWlxyXG4gICAgICAgICAgICAgICAgX3RoaXMudW5kbygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE2KSB7Ly9GNVxyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSA0Nikgey8vRGVsXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVDb21wb25lbnQoKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKFN0cmluZy5mcm9tQ2hhckNvZGUoZXZ0LndoaWNoKS50b0xvd2VyQ2FzZSgpID09PSAncycgJiYgZXZ0LmN0cmxLZXkpLyogJiYgKGV2dC53aGljaCA9PSAxOSkqLykgey8vU3RyK3NcclxuICAgICAgICAgICAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgfVxyXG4gICAgX2luc3RhbGxWaWV3KCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX3Byb3BlcnR5RWRpdG9yLCBcIlByb3BlcnRpZXNcIiwgXCJwcm9wZXJ0aWVzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLCBcIkNvbXBvbmVudHNcIiwgXCJjb21wb25lbnRzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX2NvbXBvbmVudFBhbGV0dGUsIFwiUGFsZXR0ZVwiLCBcImNvbXBvbmVudFBhbGV0dGVcIik7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5sYXlvdXQgPSAne1wic2V0dGluZ3NcIjp7XCJoYXNIZWFkZXJzXCI6dHJ1ZSxcImNvbnN0cmFpbkRyYWdUb0NvbnRhaW5lclwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJzZWxlY3Rpb25FbmFibGVkXCI6ZmFsc2UsXCJwb3BvdXRXaG9sZVN0YWNrXCI6ZmFsc2UsXCJibG9ja2VkUG9wb3V0c1Rocm93RXJyb3JcIjp0cnVlLFwiY2xvc2VQb3BvdXRzT25VbmxvYWRcIjp0cnVlLFwic2hvd1BvcG91dEljb25cIjpmYWxzZSxcInNob3dNYXhpbWlzZUljb25cIjp0cnVlLFwic2hvd0Nsb3NlSWNvblwiOnRydWUsXCJyZXNwb25zaXZlTW9kZVwiOlwib25sb2FkXCJ9LFwiZGltZW5zaW9uc1wiOntcImJvcmRlcldpZHRoXCI6NSxcIm1pbkl0ZW1IZWlnaHRcIjoxMCxcIm1pbkl0ZW1XaWR0aFwiOjEwLFwiaGVhZGVySGVpZ2h0XCI6MjAsXCJkcmFnUHJveHlXaWR0aFwiOjMwMCxcImRyYWdQcm94eUhlaWdodFwiOjIwMH0sXCJsYWJlbHNcIjp7XCJjbG9zZVwiOlwiY2xvc2VcIixcIm1heGltaXNlXCI6XCJtYXhpbWlzZVwiLFwibWluaW1pc2VcIjpcIm1pbmltaXNlXCIsXCJwb3BvdXRcIjpcIm9wZW4gaW4gbmV3IHdpbmRvd1wiLFwicG9waW5cIjpcInBvcCBpblwiLFwidGFiRHJvcGRvd25cIjpcImFkZGl0aW9uYWwgdGFic1wifSxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwiY29sdW1uXCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImNvbnRlbnRcIjpbe1widHlwZVwiOlwicm93XCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImhlaWdodFwiOjgxLjA0Mjk0MDY2MjU4OTg4LFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwid2lkdGhcIjo4MC41NzQ5MTI4OTE5ODYwNixcImhlaWdodFwiOjcxLjIzNTAzNDY1NjU4NDc2LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvZGVcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvZGUuLlwiLFwibmFtZVwiOlwiY29kZVwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfSx7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImRlc2lnblwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJuYW1lXCI6XCJkZXNpZ25cIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfSx7XCJ0eXBlXCI6XCJjb2x1bW5cIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwid2lkdGhcIjoxOS40MjUwODcxMDgwMTM5NCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6MTkuODQ0MzU3OTc2NjUzNjk3LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiUGFsZXR0ZVwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb21wb25lbnRQYWxldHRlXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJQYWxldHRlXCIsXCJuYW1lXCI6XCJjb21wb25lbnRQYWxldHRlXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6ODAuMTU1NjQyMDIzMzQ2MyxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlByb3BlcnRpZXNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwicHJvcGVydGllc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiUHJvcGVydGllc1wiLFwibmFtZVwiOlwicHJvcGVydGllc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19XX1dfSx7XCJ0eXBlXCI6XCJyb3dcIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiaGVpZ2h0XCI6MTguOTU3MDU5MzM3NDEwMTIyLFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwiaGVhZGVyXCI6e30sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJoZWlnaHRcIjoxOC45NTcwNTkzMzc0MTAxMjIsXCJ3aWR0aFwiOjc3LjcwMDM0ODQzMjA1NTc1LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiVmFyaWFibGVzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcInZhcmlhYmxlc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiVmFyaWFibGVzXCIsXCJuYW1lXCI6XCJ2YXJpYWJsZXNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX0se1widGl0bGVcIjpcIkVycm9yc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJlcnJvcnNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkVycm9yc1wiLFwibmFtZVwiOlwiZXJyb3JzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwid2lkdGhcIjoyMi4yOTk2NTE1Njc5NDQyNTYsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJDb21wb25lbnRzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvbXBvbmVudHNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvbXBvbmVudHNcIixcIm5hbWVcIjpcImNvbXBvbmVudHNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfV19XX1dLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJvcGVuUG9wb3V0c1wiOltdLFwibWF4aW1pc2VkSXRlbUlkXCI6bnVsbH0nO1xyXG4gICAgfVxyXG5cclxuICAgIF91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cy51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBfaW5pdENvbXBvbmVudEV4cGxvcmVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIub25zZWxlY3QoZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci5zZWxlY3Rpb24pO1xyXG4gICAgICAgICAgICAvLyAgdmFyIG9iID0gZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWwgPSBfdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudHJlZS5zZWxlY3Rpb247XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsLmxlbmd0aCA9PT0gMSlcclxuICAgICAgICAgICAgICAgICAgICBzZWwgPSBzZWxbMF07XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBzZWw7XHJcbiAgICAgICAgICAgIH0sIDEwKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlci5nZXRDb21wb25lbnROYW1lID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIHZhcm5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoaXRlbSk7XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YXJuYW1lLnN1YnN0cmluZyg1KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhcm5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVtb3ZlcyB0aGUgc2VsZWN0ZWQgY29tcG9uZW50XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUNvbXBvbmVudCgpIHtcclxuICAgICAgICB2YXIgdG9kZWwgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHRoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHRvZGVsKTtcclxuICAgICAgICBpZiAodmFybmFtZSAhPT0gXCJ0aGlzXCIpIHtcclxuICAgICAgICAgICAgaWYgKHRvZGVsLmRvbVdyYXBwZXIuX3BhcmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0b2RlbC5kb21XcmFwcGVyLl9wYXJlbnQucmVtb3ZlKHRvZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVWYXJpYWJsZUluQ29kZSh2YXJuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlVmFyaWFibGVJbkRlc2lnbih2YXJuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvcHlQcm9wZXJ0aWVzKGNsaXA6IENsaXBib2FyZERhdGEsIGNvbXBvbmVudDogQ29tcG9uZW50KSB7XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSB0aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChjb21wb25lbnQpO1xyXG4gICAgICAgIHZhciBwYXJzZXJkYXRhID0gdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyLmRhdGFbdmFybmFtZV07XHJcbiAgICAgICAgY2xpcC50eXBlc1t2YXJuYW1lXSA9IGNsYXNzZXMuZ2V0Q2xhc3NOYW1lKGNvbXBvbmVudCk7XHJcbiAgICAgICAgaWYgKCFjbGlwLnByb3BlcnRpZXNbdmFybmFtZV0pIHtcclxuICAgICAgICAgICAgY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBlZGl0b3JmaWVsZHMgPSB7fTtcclxuICAgICAgICBDb21wb25lbnREZXNjcmlwdG9yLmRlc2NyaWJlKGNvbXBvbmVudC5jb25zdHJ1Y3Rvcik/LmZpZWxkcy5mb3JFYWNoKChmKSA9PiB7IGVkaXRvcmZpZWxkc1tmLm5hbWVdID0gZiB9KTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyc2VyZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZWRpdG9yZmllbGRzW2tleV0gfHwga2V5ID09PSBcIl9uZXdfXCIgfHwga2V5ID09PSBcImFkZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNsaXAucHJvcGVydGllc1t2YXJuYW1lXVtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdW2tleV0gPSBbXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJzZXJkYXRhW2tleV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAvL29ubHkgYWRkIGZpZWxkcyBpbiBQcm9wZXJ0eWRlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgICAgICBjbGlwLnByb3BlcnRpZXNbdmFybmFtZV1ba2V5XS5wdXNoKHBhcnNlcmRhdGFba2V5XVtpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZG5hbWUgPSB0aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXVt4XSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsaXAuY2hpbGRyZW5bdmFybmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlwLmNoaWxkcmVuW3Zhcm5hbWVdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsaXAuY2hpbGRyZW5bdmFybmFtZV0ucHVzaChjaGlsZG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29weVByb3BlcnRpZXMoY2xpcCwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl1beF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29weSgpIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50cykpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50cyA9IFtjb21wb25lbnRzXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjbGlwID0gbmV3IENsaXBib2FyZERhdGEoKTtcclxuICAgICAgICBjbGlwLnZhck5hbWVzVG9Db3B5ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnQ6IENvbXBvbmVudCA9IGNvbXBvbmVudHNbeF07XHJcbiAgICAgICAgICAgIHZhciB2YXJuYW1lID0gdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgY2xpcC52YXJOYW1lc1RvQ29weS5wdXNoKHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlQcm9wZXJ0aWVzKGNsaXAsIGNvbXBvbmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoY2xpcCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGV4dCk7XHJcbiAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFzeW5jIHBhc3RlQ29tcG9uZW50KGNsaXA6IENsaXBib2FyZERhdGEsIHRhcmdldDogQ29udGFpbmVyLCB2YXJuYW1lOiBzdHJpbmcsIHZhcmlhYmxlbGlzdG9sZDogYW55W10sIHZhcmlhYmxlbGlzdG5ldzogYW55W10pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB2YXJ0eXBlID0gY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdW1wiX25ld19cIl1bMF07XHJcbiAgICAgICAgaWYgKHZhcmlhYmxlbGlzdG9sZC5pbmRleE9mKHZhcm5hbWUpID4gLTEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXJ0eXBlID0gdmFydHlwZS5zcGxpdChcIihcIilbMF0uc3BsaXQoXCJuZXcgXCIpWzFdO1xyXG5cclxuICAgICAgICB2YXIgdGFyZ2V0bmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdCh0YXJnZXQpO1xyXG4gICAgICAgIHZhciBuZXdjb21wID0geyBjcmVhdGVGcm9tVHlwZTogY2xpcC50eXBlc1t2YXJuYW1lXSB9O1xyXG4gICAgICAgIGF3YWl0IGNsYXNzZXMubG9hZENsYXNzKGNsaXAudHlwZXNbdmFybmFtZV0pO1xyXG4gICAgICAgIHZhciBzdmFybmFtZT12YXJuYW1lLnNwbGl0KFwiLlwiKVt2YXJuYW1lLnNwbGl0KFwiLlwiKS5sZW5ndGgtMV07XHJcbiAgICAgICAgdmFyIGNyZWF0ZWQgPSBfdGhpcy5jcmVhdGVDb21wb25lbnQoY2xpcC50eXBlc1t2YXJuYW1lXSwgbmV3Y29tcCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRhcmdldCwgdW5kZWZpbmVkLCBmYWxzZSxzdmFybmFtZSk7XHJcbiAgICAgICAgdmFyaWFibGVsaXN0b2xkLnB1c2godmFybmFtZSk7XHJcbiAgICAgICAgdmFyaWFibGVsaXN0bmV3LnB1c2goX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNyZWF0ZWQpKTtcclxuICAgICAgICAvL2NvcnJlY3QgZGVzaWduZHVtbXlcclxuICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRhcmdldC5fY29tcG9uZW50cy5sZW5ndGg7IHQrKykge1xyXG4gICAgICAgICAgICB2YXIgY2ggPSB0YXJnZXQuX2NvbXBvbmVudHNbdF07XHJcbiAgICAgICAgICAgIGlmIChjaFtcInR5cGVcIl0gPT09IFwiYXRFbmRcIikge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZShjaCk7XHJcbiAgICAgICAgICAgICAgICAvLyB0YXJnZXQuYWRkKGNoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2xpcC5jaGlsZHJlblt2YXJuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgY2xpcC5jaGlsZHJlblt2YXJuYW1lXS5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgX3RoaXMucGFzdGVDb21wb25lbnQoY2xpcCwgPENvbnRhaW5lcj5jcmVhdGVkLCBjbGlwLmNoaWxkcmVuW3Zhcm5hbWVdW2tdLCB2YXJpYWJsZWxpc3RvbGQsIHZhcmlhYmxlbGlzdG5ldyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBwYXN0ZSgpIHtcclxuICAgICAgICB2YXIgdGV4dCA9IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKTtcclxuICAgICAgICB2YXIgY3JlYXRlZFxyXG4gICAgICAgIHZhciBjbGlwOiBDbGlwYm9hcmREYXRhID0gSlNPTi5wYXJzZSh0ZXh0KTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB2YXJpYWJsZWxpc3RvbGQgPSBbXTtcclxuICAgICAgICB2YXIgdmFyaWFibGVsaXN0bmV3ID0gW107XHJcbiAgICAgICAgLy9jcmVhdGUgQ29tcG9uZW50c1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2xpcC52YXJOYW1lc1RvQ29weS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgdmFybmFtZSA9IGNsaXAudmFyTmFtZXNUb0NvcHlbeF07XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQ6IENvbnRhaW5lciA9IF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICAgICAgYXdhaXQgX3RoaXMucGFzdGVDb21wb25lbnQoY2xpcCwgdGFyZ2V0LCB2YXJuYW1lLCB2YXJpYWJsZWxpc3RvbGQsIHZhcmlhYmxlbGlzdG5ldyk7XHJcblxyXG4gICAgICAgICAgICAvL3NldCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vaW4gdGhlIG5ldyBUZXh0IHRoZSB2YXJpYWJsZXMgYXJlIHJlbmFtZWRcclxuICAgICAgICB2YXIgdGV4dG5ldyA9IHRleHQ7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YXJpYWJsZWxpc3RuZXcubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIG9sZE5hbWUgPSB2YXJpYWJsZWxpc3RvbGRbeF07XHJcbiAgICAgICAgICAgIHZhciBuZXdOYW1lID0gdmFyaWFibGVsaXN0bmV3W3hdO1xyXG4gICAgICAgICAgICBpZiAob2xkTmFtZSAhPT0gbmV3TmFtZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKFwiXFxcXFdcIiArIG9sZE5hbWUgKyBcIlxcXFxXXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChmb3VuZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0bmV3ID0gdGV4dG5ldy5yZXBsYWNlKHJlZywgZnVuY3Rpb24gcmVwbGFjZXIobWF0Y2gsIG9mZnNldCwgc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHAxIGlzIG5vbmRpZ2l0cywgcDIgZGlnaXRzLCBhbmQgcDMgbm9uLWFscGhhbnVtZXJpY3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDAsIDEpICsgbmV3TmFtZSArIG1hdGNoLnN1YnN0cmluZyhtYXRjaC5sZW5ndGggLSAxLCBtYXRjaC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsaXAgPSBKU09OLnBhcnNlKHRleHRuZXcpO1xyXG5cclxuICAgICAgICAvL3NldCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YXJpYWJsZWxpc3RuZXcubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlbmFtZSA9IHZhcmlhYmxlbGlzdG5ld1t4XVxyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY2xpcC5wcm9wZXJ0aWVzW3ZhcmlhYmxlbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgIT09IFwiX25ld19cIiAmJiBrZXkgIT09IFwiY29uZmlnXCIgJiYga2V5ICE9IFwiYWRkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcGRhdGEgPSBjbGlwLnByb3BlcnRpZXNbdmFyaWFibGVuYW1lXVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwgcHJvcGRhdGEubGVuZ3RoOyB2KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN2YWx1ZTogc3RyaW5nID0gcHJvcGRhdGFbdl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUodmFyaWFibGVuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ25hbWVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGx2YXJzID0gX3RoaXMuY29kZUVkaXRvci52YXJpYWJsZXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaW50cm9kdWNlIHZhcmlhYmxlcyByZXBsYWNlIG1lLnRleHRib3gxLT5tZV90ZXh0Ym94MVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB2diA9IDA7IHZ2IDwgYWxsdmFycy5sZW5ndGg7IHZ2KyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3dmFybmFtZSA9IGFsbHZhcnNbdnZdLm5hbWUucmVwbGFjZUFsbChcIi5cIiwgXCJfXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ZhbHVlID0gc3ZhbHVlLnJlcGxhY2VBbGwoYWxsdmFyc1t2dl0ubmFtZSwgbmV3dmFybmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3dmFybmFtZSAhPT0gXCJ0aGlzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmduYW1lcy5wdXNoKG5ld3Zhcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhbGx2YXJzW3Z2XS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc2V0IHZhbHVlIGluIERlc2lnbmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVhbHZhbHVlID0gbmV3IEZ1bmN0aW9uKC4uLmFyZ25hbWVzLCBcInJldHVybiAoXCIgKyBzdmFsdWUgKyBcIik7XCIpLmJpbmQoX3RoaXMuX2NvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwidGhpc1wiKSkoLi4uYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChjb21wb25lbnRba2V5XSkgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFtrZXldKHJlYWx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFtrZXldID0gcmVhbHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9fdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkRlc2lnbihrZXksdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoa2V5LCBwcm9wZGF0YVt2XSwgcHJvcGRhdGEubGVuZ3RoID4gMCwgdmFyaWFibGVuYW1lLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gY3JlYXRlZDtcclxuICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IuY29kZUVkaXRvci52YWx1ZSA9IF90aGlzLl9wcm9wZXJ0eUVkaXRvci5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XHJcbiAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnVwZGF0ZVBhcnNlcigpO1xyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XHJcbiAgICAgICAgLy9pbmNsdWRlIHRoZSBuZXcgZWxlbWVudFxyXG4gICAgICAgIF90aGlzLmVkaXREaWFsb2codHJ1ZSk7XHJcbiAgICAgICAgX3RoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnVwZGF0ZSgpO1xyXG4gICAgICAgIF90aGlzLl91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCk7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIGV4ZWN1dGUgdGhlIGN1cnJlbnQgY29kZVxyXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRvQ3Vyc29yIC0gIGlmIHRydWUgdGhlIHZhcmlhYmxlcyB3ZXJlIGluc3BlY3RlZCBvbiBjdXJzb3IgcG9zaXRpb24sIFxyXG4gICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZhbHNlIGF0IHRoZSBlbmQgb2YgdGhlIGxheW91dCgpIGZ1bmN0aW9uIG9yIGF0IHRoZSBlbmQgb2YgdGhlIGNvZGVcclxuICAgICovXHJcbiAgICBldmFsQ29kZSh0b0N1cnNvciA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuZXZhbENvZGUodG9DdXJzb3IpO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBzYXZlIHRoZSBjb2RlIHRvIHNlcnZlclxyXG4gICAgKi9cclxuICAgIHNhdmUoKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5zYXZlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdW5kbyBhY3Rpb25cclxuICAgICAqL1xyXG4gICAgdW5kbygpIHtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLnVuZG8oKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Q29tcG9uZW50SURzSW5EZXNpZ24oY29tcG9uZW50OiBDb21wb25lbnQsIGNvbGxlY3Q6IHN0cmluZ1tdKSB7XHJcblxyXG4gICAgICAgIGNvbGxlY3QucHVzaChcIiNcIiArIGNvbXBvbmVudC5faWQpO1xyXG4gICAgICAgIHZhciBjaGlsZHMgPSBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXTtcclxuICAgICAgICBpZiAoY2hpbGRzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBjaGlsZHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50SURzSW5EZXNpZ24oY2hpbGRzW3hdLCBjb2xsZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZGlhbG9nIGVkaXQgbW9kZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSBpZiB0cnVlIGFsbG93IHJlc2l6aW5nIGFuZCBkcmFnIGFuZCBkcm9wIFxyXG4gICAgICovXHJcbiAgICBlZGl0RGlhbG9nKGVuYWJsZSkge1xyXG5cclxuXHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmVkaXRNb2RlID0gZW5hYmxlO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi50b2dnbGUoIXRoaXMuZWRpdE1vZGUpO1xyXG4gICAgICAgIHRoaXMudW5kb0J1dHRvbi5oaWRkZW4gPSAhZW5hYmxlO1xyXG4gICAgICAgIHRoaXMubGFzc29CdXR0b24uaGlkZGVuID0gIWVuYWJsZTtcclxuICAgICAgICB0aGlzLnJlbW92ZUJ1dHRvbi5oaWRkZW4gPSAhZW5hYmxlO1xyXG4gICAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXTtcclxuICAgICAgICAvL3N3aXRjaCBkZXNpZ25tb2RlXHJcbiAgICAgICAgdmFyIGNvbXBzID0gJChjb21wb25lbnQuZG9tKS5maW5kKFwiLmpjb21wb25lbnRcIik7XHJcbiAgICAgICAgY29tcHMuYWRkQ2xhc3MoXCJqZGVzaWdubW9kZVwiKTtcclxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGNvbXBzLmxlbmd0aDsgYysrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tcHNbY10uX3RoaXNbXCJleHRlbnNpb25DYWxsZWRcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29tcHNbY10uX3RoaXNbXCJleHRlbnNpb25DYWxsZWRcIl0oe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZTogeyBlbmFibGUsIGNvbXBvbmVudERlc2lnbmVyOiB0aGlzIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy9jb21wc1tjXS5fdGhpc1tcInNldERlc2lnbk1vZGVcIl0oZW5hYmxlLHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnRbXCJleHRlbnNpb25DYWxsZWRcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb21wb25lbnRbXCJleHRlbnNpb25DYWxsZWRcIl0oe1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50RGVzaWduZXJTZXREZXNpZ25Nb2RlOiB7IGVuYWJsZSwgY29tcG9uZW50RGVzaWduZXI6IHRoaXMgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vaWYoY29tcG9uZW50W1wic2V0RGVzaWduTW9kZVwiXSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgLy8gICAgICAgIGNvbXBvbmVudFtcInNldERlc2lnbk1vZGVcIl0oZW5hYmxlLHRoaXMpO1xyXG4gICAgICAgIC8vICAgIH1cclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpOy8vdmFyaWFibGVzIGNhbiBiZSBhZGRlZCB3aXRoIFJlcGVhdGVyLnNldERlc2lnbk1vZGVcclxuICAgICAgICBpZiAodGhpcy5fcmVzaXplciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIudW5pbnN0YWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9kcmFnYW5kZHJvcHBlciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLnVuaW5zdGFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVuYWJsZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgYWxsY29tcG9uZW50cyA9IHRoaXMudmFyaWFibGVzLmdldEVkaXRhYmxlQ29tcG9uZW50cyhjb21wb25lbnQpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcHJvcGVydHlFZGl0b3IuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnRJRHNJbkRlc2lnbihjb21wb25lbnQsIHJldCk7XHJcbiAgICAgICAgICAgICAgICBhbGxjb21wb25lbnRzID0gcmV0LmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIGFsbGNvbXBvbmVudHMgPSB0aGlzLnZhcmlhYmxlcy5nZXRFZGl0YWJsZUNvbXBvbmVudHMoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgLy90aGlzLl9pbnN0YWxsVGlueUVkaXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlciA9IG5ldyBEcmFnQW5kRHJvcHBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyID0gbmV3IFJlc2l6ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplci5kcmFnYW5kZHJvcHBlciA9IHRoaXMuX2RyYWdhbmRkcm9wcGVyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplci5vbmVsZW1lbnRzZWxlY3RlZCA9IGZ1bmN0aW9uIChlbGVtZW50SURzLCBlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGVsZW1lbnRJRHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2IgPSAkKFwiI1wiICsgZWxlbWVudElEc1t4XSlbMF0uX3RoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iW1wiZWRpdG9yc2VsZWN0dGhpc1wiXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2IgPSBvYltcImVkaXRvcnNlbGVjdHRoaXNcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2gob2IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJldC5sZW5ndGggPT09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gcmV0WzBdO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmV0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSByZXQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLm9ucHJvcGVydHljaGFuZ2VkID0gZnVuY3Rpb24gKGNvbXA6IENvbXBvbmVudCwgcHJvcDogc3RyaW5nLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlICE9PSBjb21wKVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IGNvbXA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUocHJvcCwgdmFsdWUgKyBcIlwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplci5pbnN0YWxsKGNvbXBvbmVudCwgYWxsY29tcG9uZW50cyk7XHJcbiAgICAgICAgICAgIGFsbGNvbXBvbmVudHMgPSB0aGlzLnZhcmlhYmxlcy5nZXRFZGl0YWJsZUNvbXBvbmVudHMoY29tcG9uZW50LCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIuaW5zdGFsbChjb21wb25lbnQsIGFsbGNvbXBvbmVudHMpO1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci5vbnByb3BlcnR5Y2hhbmdlZCA9IGZ1bmN0aW9uIChjb21wb25lbnQsIHRvcCwgbGVmdCwgb2xkUGFyZW50LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubW92ZUNvbXBvbmVudChjb21wb25lbnQsIHRvcCwgbGVmdCwgb2xkUGFyZW50LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIub25wcm9wZXJ0eWFkZGVkID0gZnVuY3Rpb24gKHR5cGUsIGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlQ29tcG9uZW50KHR5cGUsIGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci5pc0RyYWdFbmFibGVkID0gZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLl9yZXNpemVyID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9yZXNpemVyLmNvbXBvbmVudFVuZGVyQ3Vyc29yICE9PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudXBkYXRlKCk7XHJcbiAgICAgICAgLyogICQoXCIuaG9obzJcIikuc2VsZWN0YWJsZSh7fSk7XHJcbiAgICAgICAgICAkKFwiLmhvaG8yXCIpLnNlbGVjdGFibGUoXCJkaXNhYmxlXCIpOyovXHJcbiAgICAgICAgLyogICQoXCIuSFRNTFBhbmVsXCIpLnNlbGVjdGFibGUoe30pO1xyXG4gICAgICAgICAgJChcIi5IVE1MUGFuZWxcIikuc2VsZWN0YWJsZShcImRpc2FibGVcIik7XHJcbiAgICAgICAgICAkKFwiLkhUTUxQYW5lbFwiKS5kcmFnZ2FibGUoe30pO1xyXG4gICAgICAgICAgJChcIi5IVE1MUGFuZWxcIikuZHJhZ2dhYmxlKFwiZGlzYWJsZVwiKTsqL1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbW92ZSBhIGNvbXBvbmVudFxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byBtb3ZlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9wIC0gdGhlIHRvcCBhYnNvbHV0ZSBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgLSB0aGUgbGVmdCBhYnNvbHV0ZSBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbnRhaW5lcn0gbmV3UGFyZW50IC0gdGhlIG5ldyBwYXJlbnQgY29udGFpbmVyIHdoZXJlIHRoZSBjb21wb25lbnQgbW92ZSB0b1xyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gYmVmb3JlQ29tcG9uZW50IC0gaW5zZXJ0IHRoZSBjb21wb25lbnQgYmVmb3JlIGJlZm9yZUNvbXBvbmVudFxyXG4gICAgICoqL1xyXG4gICAgbW92ZUNvbXBvbmVudChjb21wb25lbnQsIHRvcCwgbGVmdCwgb2xkUGFyZW50LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLyppZihiZWZvcmVDb21wb25lbnQhPT11bmRlZmluZWQmJmJlZm9yZUNvbXBvbmVudC5kZXNpZ25EdW1teUZvciE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGJlZm9yZUNvbXBvbmVudD11bmRlZmluZWQ7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgdmFyIG9sZE5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3Qob2xkUGFyZW50KTtcclxuICAgICAgICB2YXIgbmV3TmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChuZXdQYXJlbnQpO1xyXG4gICAgICAgIHZhciBjb21wTmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChjb21wb25lbnQpO1xyXG4gICAgICAgIGlmICh0b3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJ4XCIsIHRvcCArIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcInhcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwieVwiLCBsZWZ0ICsgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwieVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvbGRQYXJlbnQgIT09IG5ld1BhcmVudCB8fCBiZWZvcmVDb21wb25lbnQgIT09IHVuZGVmaW5lZCB8fCB0b3AgPT09IHVuZGVmaW5lZCkgey8vdG9wPXVuZGVmaW5lZCAtPm9uIHJlbGF0aXZlIHBvc2l0aW9uIGF0IHRoZSBlbmQgY2FsbCB0aGUgYmxvY2tcclxuICAgICAgICAgICAgLy9nZXQgUG9zaXRpb25cclxuICAgICAgICAgICAgdmFyIG9sZFZhbCA9IF90aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcImFkZFwiLCBjb21wTmFtZSwgb2xkTmFtZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB2YXIgYmVmb3JlO1xyXG4gICAgICAgICAgICBpZiAoYmVmb3JlQ29tcG9uZW50ICE9PSB1bmRlZmluZWQgJiYgYmVmb3JlQ29tcG9uZW50LnR5cGUgIT09IFwiYXRFbmRcIikgey8vZGVzaWduZHVtbXkgYXRFbmRcclxuICAgICAgICAgICAgICAgIHZhciBvbiA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChiZWZvcmVDb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhciA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChiZWZvcmVDb21wb25lbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBiZWZvcmUgPSB7IHZhcmlhYmxlbmFtZTogcGFyLCBwcm9wZXJ0eTogXCJhZGRcIiwgdmFsdWU6IG9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIC8qY29tcE5hbWUqL29sZFZhbCwgZmFsc2UsIG5ld05hbWUsIGJlZm9yZSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBpZihuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoPjEpey8vY29ycmVjdCBkdW1teVxyXG4gICAgICAgICAgICAgdmFyIGR1bW15PVx0bmV3UGFyZW50Ll9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMl07XHJcbiAgICAgICAgICAgICBpZihkdW1teS5kZXNpZ25EdW1teUZvciE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgLy92YXIgdG1wPW5ld1BhcmVudC5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAgICAgIG5ld1BhcmVudC5yZW1vdmUoZHVtbXkpOy8vLl9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMV09bmV3UGFyZW50Ll9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMl07XHJcbiAgICAgICAgICAgICAgICAgbmV3UGFyZW50LmFkZChkdW1teSk7Ly8uX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0xXT10bXA7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH0qL1xyXG4gICAgICAgIF90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpO1xyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICBfdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudmFsdWUgPSBfdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIG5ldyBjb21wb25lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gdGhlIHR5cGUgb2YgdGhlIG5ldyBjb21wb25lbnRcclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdGhlbXNlbGZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgLSB0aGUgdG9wIGFic29sdXRlIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVmdCAtIHRoZSBsZWZ0IGFic29sdXRlIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29udGFpbmVyfSBuZXdQYXJlbnQgLSB0aGUgbmV3IHBhcmVudCBjb250YWluZXIgd2hlcmUgdGhlIGNvbXBvbmVudCBpcyBwbGFjZWRcclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGJlZm9yZUNvbXBvbmVudCAtIGluc2VydCB0aGUgbmV3IGNvbXBvbmVudCBiZWZvcmUgYmVmb3JlQ29tcG9uZW50XHJcbiAgICAgKiovXHJcbiAgICBjcmVhdGVDb21wb25lbnQodHlwZSwgY29tcG9uZW50LCB0b3AsIGxlZnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50LCBkb1VwZGF0ZSA9IHRydWUsc3VnZ2VzdGVkTmFtZTpzdHJpbmc9dW5kZWZpbmVkKTogQ29tcG9uZW50IHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8qaWYoYmVmb3JlQ29tcG9uZW50IT09dW5kZWZpbmVkJiZiZWZvcmVDb21wb25lbnQuZGVzaWduRHVtbXlGb3ImJmJlZm9yZUNvbXBvbmVudC50eXBlPT09XCJhdEVuZFwiKXtcclxuICAgICAgICAgICAgYmVmb3JlQ29tcG9uZW50PXVuZGVmaW5lZDtcclxuICAgICAgICB9Ki9cclxuICAgICAgICB2YXIgZmlsZSA9IHR5cGUucmVwbGFjZUFsbChcIi5cIiwgXCIvXCIpO1xyXG4gICAgICAgIHZhciBzdHlwZSA9IGZpbGUuc3BsaXQoXCIvXCIpW2ZpbGUuc3BsaXQoXCIvXCIpLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5hZGRJbXBvcnRJZk5lZWRlZChzdHlwZSwgZmlsZSk7XHJcbiAgICAgICAgdmFyIHJlcGVhdGVyID0gX3RoaXMuX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihuZXdQYXJlbnQpO1xyXG4gICAgICAgIHZhciBzY29wZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAocmVwZWF0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVwZWF0ZXJuYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHJlcGVhdGVyKTtcclxuICAgICAgICAgICAgdmFyIHRlc3QgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyLmdldFByb3BlcnR5VmFsdWUocmVwZWF0ZXJuYW1lLCBcImNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiKTtcclxuICAgICAgICAgICAgc2NvcGUgPSB7IHZhcmlhYmxlbmFtZTogcmVwZWF0ZXJuYW1lLCBtZXRob2RuYW1lOiBcImNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiIH07XHJcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICB2YXIgc2Z1bmM9XCJmdW5jdGlvbihtZTpNZSl7XFxuXFx0XCIrcmVwZWF0ZXJuYW1lK1wiLmRlc2lnbi5jb25maWcoe30pO1xcbn1cIjtcclxuICAgICAgICAgICAgICAgIHZhciB2YXJkYXRhYmluZGVyID0gX3RoaXMuX3Byb3BlcnR5RWRpdG9yLmdldE5leHRWYXJpYWJsZU5hbWVGb3JUeXBlKFwiamFzc2lqcy51aS5EYXRhYmluZGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoIV90aGlzLl9wcm9wZXJ0eUVkaXRvci5wYXJzZXIuZ2V0UHJvcGVydHlWYWx1ZShyZXBlYXRlcm5hbWUsXCJjb25maWdcIikpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNmdW5jPVwiZnVuY3Rpb24obWU6TWUpe1xcblxcdFxcbn1cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcImNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiLCBzZnVuYywgdHJ1ZSwgcmVwZWF0ZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICAgICAgICAgIHJlcGVhdGVyLmNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudChmdW5jdGlvbiAobWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVzaWduTW9kZSAhPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vX3RoaXMudmFyaWFibGVzLmFkZFZhcmlhYmxlKHZhcmRhdGFiaW5kZXIsZGF0YWJpbmRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8qdmFyIGRiPW5ldyBqYXNzaWpzLnVpLkRhdGFiaW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlcGVhdGVyLnZhbHVlIT09dW5kZWZpbmVkJiZyZXBlYXRlci52YWx1ZS5sZW5ndGg+MClcclxuICAgICAgICAgICAgICAgICAgICBkYi52YWx1ZT1yZXBlYXRlci52YWx1ZVswXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy5hZGQodmFyZGF0YWJpbmRlcixkYik7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTsqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB2YXJ2YWx1ZSA9IG5ldyAoY2xhc3Nlcy5nZXRDbGFzcyh0eXBlKSk7XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSBfdGhpcy5jcmVhdGVWYXJpYWJsZSh0eXBlLCBzY29wZSwgdmFydmFsdWUsc3VnZ2VzdGVkTmFtZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnR5RWRpdG9yLmNvZGVFZGl0b3IgIT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG5ld05hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QobmV3UGFyZW50KTtcclxuICAgICAgICAgICAgdmFyIGJlZm9yZTtcclxuICAgICAgICAgICAgaWYgKGJlZm9yZUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkICYmIGJlZm9yZUNvbXBvbmVudC50eXBlICE9PSBcImF0RW5kXCIpIHsvL0Rlc2lnbmR1bW15IGF0RW5kXHJcbiAgICAgICAgICAgICAgICAvL2lmKGJlZm9yZUNvbXBvbmVudC50eXBlPT09XCJiZWZvcmVDb21wb25lbnRcIilcclxuICAgICAgICAgICAgICAgIC8vICAgYmVmb3JlQ29tcG9uZW50PWJlZm9yZUNvbXBvbmVudC5kZXNpZ25EdW1teUZvcjtcclxuICAgICAgICAgICAgICAgIHZhciBvbiA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChiZWZvcmVDb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhciA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChiZWZvcmVDb21wb25lbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBiZWZvcmUgPSB7IHZhcmlhYmxlbmFtZTogcGFyLCBwcm9wZXJ0eTogXCJhZGRcIiwgdmFsdWU6IG9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIHZhcm5hbWUsIGZhbHNlLCBuZXdOYW1lLCBiZWZvcmUsIHNjb3BlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChiZWZvcmVDb21wb25lbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBuZXdQYXJlbnQuYWRkQmVmb3JlKHZhcnZhbHVlLCBiZWZvcmVDb21wb25lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5ld1BhcmVudC5hZGQodmFydmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBpZihuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoPjEpey8vY29ycmVjdCBkdW1teVxyXG4gICAgICAgICAgICAgaWYobmV3UGFyZW50Ll9kZXNpZ25EdW1teSl7XHJcbiAgICAgICAgICAgICAgICAgLy92YXIgdG1wPW5ld1BhcmVudC5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAgICAgIG5ld1BhcmVudC5kb20ucmVtb3ZlQ2hpbGQobmV3UGFyZW50Ll9kZXNpZ25EdW1teS5kb21XcmFwcGVyKVxyXG4gICAgICAgICAgICAgICAgIG5ld1BhcmVudC5kb20uYXBwZW5kKG5ld1BhcmVudC5fZGVzaWduRHVtbXkuZG9tV3JhcHBlcilcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSovXHJcbiAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcblxyXG4gICAgICAgIC8vc2V0IGluaXRpYWwgcHJvcGVydGllcyBmb3IgdGhlIG5ldyBjb21wb25lbnRcclxuICAgICAgICBpZiAoY29tcG9uZW50LmNyZWF0ZUZyb21QYXJhbSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wb25lbnQuY3JlYXRlRnJvbVBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gY29tcG9uZW50LmNyZWF0ZUZyb21QYXJhbVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCA9ICdcIicgKyB2YWwgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKGtleSwgdmFsLCB0cnVlLCB2YXJuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkLmV4dGVuZCh2YXJ2YWx1ZSwgY29tcG9uZW50LmNyZWF0ZUZyb21QYXJhbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0b3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJ4XCIsIHRvcCArIFwiXCIsIHRydWUsIHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB2YXJ2YWx1ZS54ID0gdG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGVmdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInlcIiwgbGVmdCArIFwiXCIsIHRydWUsIHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB2YXJ2YWx1ZS55ID0gbGVmdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbm90aWZ5IGNvbXBvbmVudGRlc2NyaXB0b3IgXHJcbiAgICAgICAgdmFyIGFjID0gdmFydmFsdWUuZXh0ZW5zaW9uQ2FsbGVkO1xyXG4gICAgICAgIGlmIChhYyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhcnZhbHVlLmV4dGVuc2lvbkNhbGxlZCh7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnREZXNpZ25lckNvbXBvbmVudENyZWF0ZWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQYXJlbnQ6IG5ld1BhcmVudFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IHZhcnZhbHVlO1xyXG4gICAgICAgICAgICAvL2luY2x1ZGUgdGhlIG5ldyBlbGVtZW50XHJcbiAgICAgICAgICAgIF90aGlzLmVkaXREaWFsb2codHJ1ZSk7XHJcbiAgICAgICAgICAgIF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci51cGRhdGUoKTtcclxuICAgICAgICAgICAgX3RoaXMuX3VwZGF0ZUludmlzaWJsZUNvbXBvbmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhcnZhbHVlO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVmFyaWFibGUodHlwZSwgc2NvcGUsIHZhcnZhbHVlLHN1Z2dlc3RlZE5hbWU6c3RyaW5nPXVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eUVkaXRvci5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjsgXHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci5hZGRWYXJpYWJsZUluQ29kZSh0eXBlLCBzY29wZSxzdWdnZXN0ZWROYW1lKTtcclxuXHJcbiAgICAgICAvKiBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwibWUuXCIpICYmIHRoaXMuX2NvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwibWVcIikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcIm1lXCIpO1xyXG4gICAgICAgICAgICBtZVt2YXJuYW1lLnN1YnN0cmluZygzKV0gPSB2YXJ2YWx1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKSB7XHJcbiAgICAgICAgICAgIHZhciB0aCA9IHRoaXMuX2NvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwidGhpc1wiKTtcclxuICAgICAgICAgICAgdGhbdmFybmFtZS5zdWJzdHJpbmcoNSldID0gdmFydmFsdWU7XHJcbiAgICAgICAgfSBlbHNlKi9cclxuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUodmFybmFtZSwgdmFydmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB2YXJuYW1lO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGVyZSBhIHBhcmVudCB0aGF0IGFjdHMgYSByZXBlYXRpbmcgY29udGFpbmVyP1xyXG4gICAgICoqL1xyXG4gICAgX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoY29tcG9uZW50ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNvbXBvbmVudCkgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgUmVwZWF0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihjb21wb25lbnQuX3BhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsVmFyaWFibGVzKHJvb3Q6IENvbXBvbmVudCwgY29tcG9uZW50OiBDb21wb25lbnQsIGNhY2hlOiB7IFtjb21wb25lbnRpZDogc3RyaW5nXTogeyBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyIH0gfSkge1xyXG4gICAgICAgIGlmIChjYWNoZVtjb21wb25lbnQuX2lkXSA9PT0gdW5kZWZpbmVkICYmIGNvbXBvbmVudFtcIl9fc3RhY2tcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgbGluZXMgPSBjb21wb25lbnRbXCJfX3N0YWNrXCJdPy5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBsaW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNsaW5lOiBzdHJpbmcgPSBsaW5lc1t4XTtcclxuICAgICAgICAgICAgICAgIGlmIChzbGluZS5pbmRleE9mKFwiJHRlbXAuanNcIikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwbCA9IHNsaW5lLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZW50ciA9IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlW2NvbXBvbmVudC5faWRdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lOiBOdW1iZXIoc3BsW3NwbC5sZW5ndGggLSAyXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogTnVtYmVyKHNwbFtzcGwubGVuZ3RoIC0gMV0ucmVwbGFjZShcIilcIiwgXCJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbFZhcmlhYmxlcyhyb290LCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXVt4XSwgY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgPT09IHJvb3QpIHtcclxuICAgICAgICAgICAgICAgIC8vZmVydGlnXHJcbiAgICAgICAgICAgICAgICB2YXIgaGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge2phc3NpanMudWkuQ29tcG9uZW50fSAtIHRoZSBkZXNpZ25lZCBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgc2V0IGRlc2lnbmVkQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMuZmlsbFZhcmlhYmxlcyhjb21wb25lbnQsIGNvbXBvbmVudCwge30pO1xyXG4gICAgICAgIHZhciBjb20gPSBjb21wb25lbnQ7XHJcbiAgICAgICAgaWYgKGNvbVtcImlzQWJzb2x1dGVcIl0gIT09IHRydWUgJiYgY29tLndpZHRoID09PSBcIjBcIiAmJiBjb20uaGVpZ2h0ID09PSBcIjBcIikge1xyXG4gICAgICAgICAgICBjb21wb25lbnQud2lkdGggPSBcImNhbGMoMTAwJSAtIDFweClcIjtcclxuICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IFwiY2FsYygxMDAlIC0gMXB4KVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fY29kZUVkaXRvci5fX2V2YWxUb0N1cnNvclJlYWNoZWQgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5zaG93KFwiZGVzaWduXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIucmVtb3ZlKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdLCB0cnVlKTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5hZGQoY29tcG9uZW50KTtcclxuICAgICAgICAvLyBcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICB0aGlzLmVkaXREaWFsb2codGhpcy5lZGl0TW9kZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHRoaXMuZWRpdE1vZGUpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlci52YWx1ZSA9IGNvbXBvbmVudDtcclxuXHJcbiAgICAgICAgJCh0aGlzLmRvbSkuZm9jdXMoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUludmlzaWJsZUNvbXBvbmVudHMoKTtcclxuICAgICAgICB3aGlsZSAodGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5kb20uZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbS5maXJzdENoaWxkLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy92YXIgcGFyc2VyPW5ldyBqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yLlBhcnNlcigpO1xyXG4gICAgICAgIC8vcGFyc2VyLnBhcnNlKF90aGlzLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGdldCBkZXNpZ25lZENvbXBvbmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF07XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplci51bmluc3RhbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2RyYWdhbmRkcm9wcGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIuaXNEcmFnRW5hYmxlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIudW5pbnN0YWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yPy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50UGFsZXR0ZT8uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyPy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cz8uZGVzdHJveSgpO1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICByZXR1cm4gbmV3IENvbXBvbmVudERlc2lnbmVyKCk7XHJcblxyXG59O1xyXG5cclxuXHJcbiJdfQ==