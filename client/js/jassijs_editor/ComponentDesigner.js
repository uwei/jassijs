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
            var created = _this.createComponent(clip.types[varname], newcomp, undefined, undefined, target, undefined, false);
            variablelistold.push(varname);
            //correct designdummy
            for (var t = 0; t < target._components.length; t++) {
                var ch = target._components[t];
                if (ch["type"] === "atEnd") {
                    target.remove(ch);
                    // target.add(ch);
                    break;
                }
            }
            variablelistnew.push(_this._codeEditor.getVariableFromObject(created));
            if (clip.children[varname] !== undefined) {
                for (var k = 0; k < clip.children[varname].length; k++) {
                    _this.pasteComponent(clip, created, clip.children[varname][k], variablelistold, variablelistnew);
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
                            var realvalue = new Function(...argnames, "return (" + svalue + ");").bind(_this._codeEditor.getObjectFromVariable("this"))(...args);
                            if (typeof (component[key]) === "function") {
                                component[key](realvalue);
                            }
                            else {
                                component[key] = realvalue;
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
        createComponent(type, component, top, left, newParent, beforeComponent, doUpdate = true) {
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
                    var vardatabinder = _this._propertyEditor.getNextVariableNameForType("jassijs.ui.Databinder");
                    _this._propertyEditor.setPropertyInCode("createRepeatingComponent", "function(me:Me){\n\t\n}", true, repeatername);
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
            var varname = _this.createVariable(type, scope, varvalue);
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
        createVariable(type, scope, varvalue) {
            if (this._propertyEditor.codeEditor === undefined)
                return;
            var varname = this._propertyEditor.addVariableInCode(type, scope);
            if (varname.startsWith("me.") && this._codeEditor.getObjectFromVariable("me") !== undefined) {
                var me = this._codeEditor.getObjectFromVariable("me");
                me[varname.substring(3)] = varvalue;
            }
            else if (varname.startsWith("this.")) {
                var th = this._codeEditor.getObjectFromVariable("this");
                th[varname.substring(5)] = varvalue;
            }
            else
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50RGVzaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX2VkaXRvci9Db21wb25lbnREZXNpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBa0NBLE1BQU0sYUFBYTtRQUFuQjtZQUNJLG1CQUFjLEdBQWEsRUFBRSxDQUFDO1lBQzlCLGFBQVEsR0FBaUMsRUFBRSxDQUFDO1lBQzVDLGVBQVUsR0FBc0QsRUFBRSxDQUFDO1lBQ25FLFVBQUssR0FBK0IsRUFBRSxDQUFDO1FBQzNDLENBQUM7S0FBQTtJQUlELElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWtCLFNBQVEsYUFBSztRQXVCeEM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUV6QixDQUFDO1FBQ0QsYUFBYSxDQUFDLE1BQU07WUFDaEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3pDLENBQUM7UUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFLO1lBQ2hCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO1lBQzVDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSwrQkFBYyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1RCx3REFBd0Q7WUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1lBQ2hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHFDQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksNkRBQTZCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRztnQkFDNUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4QixDQUFDO1FBQ0QsSUFBSSxVQUFVO1lBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzVCLENBQUM7UUFDRCxXQUFXO1lBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsc0JBQXNCLENBQUM7WUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2dCQUNwQixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXRDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXpDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7WUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsK0JBQStCLENBQUM7WUFDdkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV6Qzs7Ozs7O3dEQU00QztZQUU1QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsdUJBQXVCLENBQUM7WUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDO1lBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2dCQUNwQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFekM7Ozs7Ozs2Q0FNaUM7WUFLakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLHdCQUF3QixDQUFDO1lBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLG1CQUFtQixDQUFDO1lBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO2dCQUNyQixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNyQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUMsK0NBQStDO1lBQ25ELENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyx5Q0FBeUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxnQ0FBZ0MsQ0FBQztZQUM3RCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRTNDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxzQkFBc0IsQ0FBQztZQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7WUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFdEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsK0JBQStCLENBQUM7WUFDdkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO2dCQUNwQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLGdDQUFnQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztnQkFDckIsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzFDLElBQUksR0FBRyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQ3pCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBRXRCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUM7WUFDOUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFFNUQsbUJBQW1CO1lBQ25CLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRXRDLENBQUM7UUFDRDs7U0FFQztRQUNELFlBQVk7WUFDUixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUc7Z0JBQ2pELElBQUksR0FBRyxDQUFDLE9BQU8sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUk7b0JBQzFDLDRCQUE0QjtvQkFDNUIseUNBQXlDO29CQUN6QyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNyQixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3JCLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjtxQkFBTSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssR0FBRyxFQUFFLEVBQUMsSUFBSTtvQkFDakMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdEIsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNyQixPQUFPLEtBQUssQ0FBQztpQkFDaEI7Z0JBQ0QsSUFBSSxHQUFHLENBQUMsT0FBTyxLQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsUUFBUTtvQkFDNUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNoQjtnQkFDRCxJQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssR0FBRyxFQUFFLEVBQUMsSUFBSTtvQkFDMUIsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNyQixPQUFPLEtBQUssQ0FBQztpQkFDaEI7Z0JBQ0QsSUFBSSxHQUFHLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRSxFQUFDLEtBQUs7b0JBQzFCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDeEIsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNyQixPQUFPLEtBQUssQ0FBQztpQkFDaEI7Z0JBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUEseUJBQXlCLEVBQUUsRUFBQyxPQUFPO29CQUN4RyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixPQUFPLEtBQUssQ0FBQztpQkFDaEI7WUFFTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDRCxNQUFNO1lBQ0YsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUNELFlBQVk7WUFDUixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDaEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsNDRGQUE0NEYsQ0FBQztRQUNqN0YsQ0FBQztRQUVELDBCQUEwQjtZQUN0QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFFRCxzQkFBc0I7WUFDbEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsVUFBVSxJQUFJO2dCQUUzQyxtREFBbUQ7Z0JBQ25ELHVCQUF1QjtnQkFDdkIsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDWixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDbEQsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUM7d0JBQ2hCLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDdEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxJQUFJO2dCQUNyRCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLE9BQU8sS0FBSyxTQUFTO29CQUNyQixPQUFPO2dCQUNYLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsT0FBTyxPQUFPLENBQUM7WUFDbkIsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUNEOztXQUVHO1FBQ0gsZUFBZTtZQUNYLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO1lBQ3ZDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUQsSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO2dCQUNwQixJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtvQkFDeEMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMxQztnQkFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQzthQUNyQztRQUVMLENBQUM7UUFDTyxjQUFjLENBQUMsSUFBbUIsRUFBRSxTQUFvQjs7WUFDNUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoRSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxpQkFBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDakM7WUFDRCxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDdEIsTUFBQSx5Q0FBbUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQywwQ0FBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pHLEtBQUssSUFBSSxHQUFHLElBQUksVUFBVSxFQUFFO2dCQUN4QixJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssT0FBTyxJQUFJLEdBQUcsS0FBSyxLQUFLLEVBQUU7b0JBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUNoQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtxQkFDckM7b0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzdDLHVDQUF1Qzt3QkFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUNoRTtpQkFDSjthQUNKO1lBQ0QsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0RCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRixJQUFJLFNBQVMsRUFBRTt3QkFDWCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFOzRCQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQzt5QkFDL0I7d0JBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMxRDtpQkFDSjthQUNKO1FBQ0wsQ0FBQztRQUNELElBQUk7WUFFQSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztZQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDNUIsVUFBVSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDN0I7WUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QyxJQUFJLFNBQVMsR0FBYyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN4QztZQUlELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNPLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBbUIsRUFBRSxNQUFpQixFQUFFLE9BQWUsRUFBRSxlQUFzQixFQUFFLGVBQXNCO1lBQ2hJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLE9BQU87WUFDWCxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakQsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRSxJQUFJLE9BQU8sR0FBRyxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDdEQsTUFBTSxpQkFBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEgsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5QixxQkFBcUI7WUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRCxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxPQUFPLEVBQUU7b0JBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2xCLGtCQUFrQjtvQkFDbEIsTUFBTTtpQkFDVDthQUNKO1lBQ0QsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdkUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNwRCxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBYSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLENBQUM7aUJBQy9HO2FBQ0o7UUFDTCxDQUFDO1FBQ0QsS0FBSyxDQUFDLEtBQUs7WUFDUCxJQUFJLElBQUksR0FBRyxNQUFNLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEQsSUFBSSxPQUFPLENBQUE7WUFDWCxJQUFJLElBQUksR0FBa0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUN6QixtQkFBbUI7WUFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLE1BQU0sR0FBYyxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztnQkFDcEQsTUFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFcEYsZ0JBQWdCO2FBQ25CO1lBQ0QsMkNBQTJDO1lBQzNDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztZQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsSUFBSSxPQUFPLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLE9BQU8sR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQzlDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDakIsT0FBTyxLQUFLLElBQUksSUFBSSxFQUFFO29CQUNsQixLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNkLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU07d0JBQ2xFLHVEQUF1RDt3QkFDdkQsS0FBSyxHQUFHLElBQUksQ0FBQzt3QkFDYixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDN0YsQ0FBQyxDQUFDLENBQUM7aUJBQ047YUFDSjtZQUNELElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTNCLGdCQUFnQjtZQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsSUFBSSxZQUFZLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNyQyxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQzNDLElBQUksR0FBRyxLQUFLLE9BQU8sSUFBSSxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7d0JBQ3JELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2xELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUN0QyxJQUFJLE1BQU0sR0FBVyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2pDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7NEJBQ3RFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs0QkFDbEIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDOzRCQUNkLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQzs0QkFDL0Msc0RBQXNEOzRCQUN0RCxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtnQ0FFeEMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dDQUN2RCxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dDQUN6RCxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7b0NBQ3ZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0NBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lDQUNoQzs2QkFDSjs0QkFFRCxJQUFJLFNBQVMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLFFBQVEsRUFBRSxVQUFVLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzs0QkFDckksSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssVUFBVSxFQUFFO2dDQUN4QyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQzdCO2lDQUFNO2dDQUNILFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7NkJBQzlCOzRCQUNELHVEQUF1RDs0QkFDdkQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO3lCQUU3SDtxQkFDSjtpQkFDSjthQUNKO1lBQ0QsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1lBQ3RDLEtBQUssQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4RixLQUFLLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNuRCx5QkFBeUI7WUFDekIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbEMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFFdkMsQ0FBQztRQUNEOzs7O1VBSUU7UUFDRixRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVM7WUFDekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFeEMsQ0FBQztRQUNEOztVQUVFO1FBQ0YsSUFBSTtZQUNBLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFNUIsQ0FBQztRQUVEOztXQUVHO1FBQ0gsSUFBSTtZQUNBLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsQ0FBQztRQUNPLHVCQUF1QixDQUFDLFNBQW9CLEVBQUUsT0FBaUI7WUFFbkUsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0QyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNwQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUNwRDthQUNKO1FBQ0wsQ0FBQztRQUNEOzs7V0FHRztRQUNILFVBQVUsQ0FBQyxNQUFNO1lBR2IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ25DLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsbUJBQW1CO1lBQ25CLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2pELEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBRW5DLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDakQsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO3dCQUM5Qiw4QkFBOEIsRUFBRSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUU7cUJBQ3RFLENBQUMsQ0FBQztvQkFDSCwrQ0FBK0M7aUJBQ2xEO2FBQ0o7WUFDRCxJQUFJLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDNUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQ3pCLDhCQUE4QixFQUFFLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRTtpQkFDdEUsQ0FBQyxDQUFDO2FBRU47WUFDRCw2Q0FBNkM7WUFDN0Msa0RBQWtEO1lBQ2xELE9BQU87WUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUEsb0RBQW9EO1lBQ2pGLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDN0I7WUFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ3BDO1lBRUQsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO2dCQUNqQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2pCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3BFLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO29CQUMvQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBRWIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDN0MsYUFBYSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2pDOztvQkFDRyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDcEUsNEJBQTRCO2dCQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO2dCQUM1QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO2dCQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUVwRCxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsVUFBVSxFQUFFLENBQUM7b0JBQ3JELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDeEMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7d0JBQ3pDLElBQUksRUFBRSxDQUFDLGtCQUFrQixDQUFDOzRCQUN0QixFQUFFLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUM7d0JBQ2hDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ2hCO29CQUNELElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDO3dCQUNoQixLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BDLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ3JCLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztxQkFDckM7Z0JBQ0wsQ0FBQyxDQUFDO2dCQUVGLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxJQUFlLEVBQUUsSUFBWSxFQUFFLEtBQVU7b0JBQ2pGLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEtBQUssSUFBSTt3QkFDcEMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUN2QyxLQUFLLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNoRSxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztnQkFDOUQsQ0FBQyxDQUFDO2dCQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFDaEQsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQ3ZELElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWU7b0JBQzFHLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDckYsQ0FBQyxDQUFBO2dCQUNELElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxHQUFHLFVBQVUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxlQUFlO29CQUNuRyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRWxGLENBQUMsQ0FBQTtnQkFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsR0FBRyxVQUFVLEtBQUssRUFBRSxFQUFFO29CQUNwRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssU0FBUzt3QkFDNUIsT0FBTyxLQUFLLENBQUM7b0JBQ2pCLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLENBQUM7Z0JBQzdELENBQUMsQ0FBQTthQUNKO2lCQUFNO2FBRU47WUFDRDtrREFDc0M7WUFDdEM7OztxREFHeUM7UUFDN0MsQ0FBQztRQUVEOzs7Ozs7O1lBT0k7UUFDSixhQUFhLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxlQUFlO1lBQ3JFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQjs7ZUFFRztZQUNILElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakUsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNqRSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtnQkFDbkIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNoRTtpQkFBTTtnQkFDSCxLQUFLLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUNwQixLQUFLLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2pFO2lCQUFNO2dCQUNILEtBQUssQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkQ7WUFFRCxJQUFJLFNBQVMsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFLEVBQUMsZ0VBQWdFO2dCQUNoSixjQUFjO2dCQUNkLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3pGLElBQUksTUFBTSxDQUFDO2dCQUNYLElBQUksZUFBZSxLQUFLLFNBQVMsSUFBSSxlQUFlLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRSxFQUFDLG1CQUFtQjtvQkFDdkYsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDbEUsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzNFLE1BQU0sR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7aUJBQzlEO2dCQUNELEtBQUssQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzthQUU5RjtZQUNEOzs7Ozs7O2dCQU9JO1lBQ0osS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM5QixLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztZQUMxRCxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7UUFDcEUsQ0FBQztRQUNEOzs7Ozs7OztZQVFJO1FBQ0osZUFBZSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLFFBQVEsR0FBRyxJQUFJO1lBQ25GLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQjs7ZUFFRztZQUNILElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN0QixJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JFLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO2dCQUNuRyxLQUFLLEdBQUcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSwwQkFBMEIsRUFBRSxDQUFDO2dCQUMvRSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7b0JBQ3BCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsMEJBQTBCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFDOUYsS0FBSyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQywwQkFBMEIsRUFBRSx5QkFBeUIsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ25ILFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUU7d0JBQzFDLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJOzRCQUN6QixPQUFPO3dCQUNYLHdEQUF3RDt3QkFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDbEMsQ0FBQyxDQUFDLENBQUM7b0JBQ0g7Ozs7b0RBSWdDO2lCQUNuQzthQUNKO1lBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDNUMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzFELElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUUvQyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLE1BQU0sQ0FBQztnQkFDWCxJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUUsRUFBQyxtQkFBbUI7b0JBQ3ZGLDhDQUE4QztvQkFDOUMsb0RBQW9EO29CQUNwRCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUNsRSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDM0UsTUFBTSxHQUFHLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQztpQkFDOUQ7Z0JBQ0QsS0FBSyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzFGO1lBRUQsSUFBSSxlQUFlLEtBQUssU0FBUyxFQUFFO2dCQUMvQixTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQzthQUNsRDtpQkFBTTtnQkFDSCxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNCO1lBQ0Q7Ozs7OztnQkFNSTtZQUNKLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFOUIsOENBQThDO1lBQzlDLElBQUksU0FBUyxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7Z0JBQ3pDLEtBQUssSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLGVBQWUsRUFBRTtvQkFDdkMsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO3dCQUN2QixHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7b0JBQzFCLEtBQUssQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQ3BFO2dCQUNELENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUNqRDtZQUNELElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtnQkFDbkIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3RFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ3BCO1lBQ0QsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUNwQixLQUFLLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdkUsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDckI7WUFFRCw2QkFBNkI7WUFDN0IsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztZQUNsQyxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xCLFFBQVEsQ0FBQyxlQUFlLENBQUM7b0JBQ3JCLGlDQUFpQyxFQUFFO3dCQUMvQixTQUFTLEVBQUUsU0FBUztxQkFDdkI7aUJBQ0osQ0FBQyxDQUFDO2FBQ047WUFDRCxJQUFJLFFBQVEsRUFBRTtnQkFDVixLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7Z0JBQ3ZDLHlCQUF5QjtnQkFDekIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNsQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsQ0FBQzthQUN0QztZQUNELE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7UUFDRCxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRO1lBQ2hDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEtBQUssU0FBUztnQkFDN0MsT0FBTztZQUNYLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRWxFLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDekYsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEQsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7YUFDdkM7aUJBQU0sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN4RCxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQzthQUN2Qzs7Z0JBQ0csSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUM7UUFDRDs7WUFFSTtRQUNKLHNCQUFzQixDQUFDLFNBQVM7WUFDNUIsSUFBSSxTQUFTLEtBQUssU0FBUztnQkFDdkIsT0FBTyxTQUFTLENBQUM7WUFDckIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQVM7Z0JBQy9ELE9BQU8sU0FBUyxDQUFDO1lBQ3JCLElBQUksU0FBUyxZQUFZLG1CQUFRLEVBQUU7Z0JBQy9CLE9BQU8sU0FBUyxDQUFDO2FBQ3BCO1lBQ0QsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFFTyxhQUFhLENBQUMsSUFBZSxFQUFFLFNBQW9CLEVBQUUsS0FBa0U7O1lBQzNILElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDMUUsSUFBSSxLQUFLLEdBQUcsTUFBQSxTQUFTLENBQUMsU0FBUyxDQUFDLDBDQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ25DLElBQUksS0FBSyxHQUFXLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDM0IsSUFBSSxJQUFJLEdBQUcsRUFFVixDQUFBO3dCQUNELEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUc7NEJBQ25CLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ2pDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQzt5QkFDdkQsQ0FBQTt3QkFDRCxNQUFNO3FCQUNUO2lCQUNKO2dCQUNELElBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUNoRTtpQkFDSjtnQkFDRCxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7b0JBQ3BCLFFBQVE7b0JBQ1IsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUNkO2FBQ0o7UUFFTCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFJLGlCQUFpQixDQUFDLFNBQVM7WUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQztZQUNwQixJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7Z0JBQ3ZFLFNBQVMsQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUM7Z0JBQ3JDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUM7YUFDekM7WUFDRCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLEtBQUssSUFBSSxFQUFFO2dCQUNqRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDekM7WUFDRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqRixJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZDLEdBQUc7WUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXBFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1lBRTFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFHcEIsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7WUFDbEMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbEQ7WUFFRCxvREFBb0Q7WUFDcEQsNEJBQTRCO1FBQ2hDLENBQUM7UUFDRCxJQUFJLGlCQUFpQjtZQUNqQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELE9BQU87O1lBQ0gsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUM3QjtZQUNELElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNwQztZQUNELE1BQUEsSUFBSSxDQUFDLGVBQWUsMENBQUUsT0FBTyxFQUFFLENBQUM7WUFDaEMsTUFBQSxJQUFJLENBQUMsaUJBQWlCLDBDQUFFLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLE1BQUEsSUFBSSxDQUFDLGtCQUFrQiwwQ0FBRSxPQUFPLEVBQUUsQ0FBQztZQUNuQyxNQUFBLElBQUksQ0FBQyxvQkFBb0IsMENBQUUsT0FBTyxFQUFFLENBQUM7WUFDckMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FFSixDQUFBO0lBeHpCWSxpQkFBaUI7UUFEN0IsSUFBQSxjQUFNLEVBQUMsa0NBQWtDLENBQUM7O09BQzlCLGlCQUFpQixDQXd6QjdCO0lBeHpCWSw4Q0FBaUI7SUF5ekJ2QixLQUFLLFVBQVUsSUFBSTtRQUN0QixPQUFPLElBQUksaUJBQWlCLEVBQUUsQ0FBQztJQUVuQyxDQUFDO0lBSEQsb0JBR0M7SUFBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgVmFyaWFibGVQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1ZhcmlhYmxlUGFuZWxcIjtcclxuaW1wb3J0IHsgUHJvcGVydHlFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnRFeHBsb3JlciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db21wb25lbnRFeHBsb3JlclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnRQYWxldHRlIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvbXBvbmVudFBhbGV0dGVcIjtcclxuaW1wb3J0IHsgUmVzaXplciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci91dGlsL1Jlc2l6ZXJcIjtcclxuLy9pbXBvcnQgRHJhZ0FuZERyb3BwZXIgZnJvbSBcImphc3NpanMvdWkvaGVscGVyL0RyYWdBbmREcm9wcGVyXCI7XHJcbmltcG9ydCB7IEVycm9yUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9FcnJvclBhbmVsXCI7XHJcbmltcG9ydCB7IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzXCI7XHJcbmltcG9ydCB7IFJlcGVhdGVyIH0gZnJvbSBcImphc3NpanMvdWkvUmVwZWF0ZXJcIjtcclxuaW1wb3J0IFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgRHJhZ0FuZERyb3BwZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvdXRpbC9EcmFnQW5kRHJvcHBlclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnREZXNjcmlwdG9yIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50RGVzY3JpcHRvclwiO1xyXG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcImphc3NpanMvdWkvQ29udGFpbmVyXCI7XHJcbmltcG9ydCB7IEJveFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvQm94UGFuZWxcIjtcclxuLy9pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi91dGlsL1BhcnNlclwiO1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeHRlbnNpb25BY3Rpb24ge1xyXG4gICAgICAgIGNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZT86IHtcclxuICAgICAgICAgICAgZW5hYmxlOiBib29sZWFuLFxyXG4gICAgICAgICAgICBjb21wb25lbnREZXNpZ25lcjogQ29tcG9uZW50RGVzaWduZXJcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcG9uZW50RGVzaWduZXJDb21wb25lbnRDcmVhdGVkPzoge1xyXG4gICAgICAgICAgICAvL2NvbXBvbmVudDpDb21wb25lbnRcclxuICAgICAgICAgICAgbmV3UGFyZW50OiBDb250YWluZXJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENsaXBib2FyZERhdGEge1xyXG4gICAgdmFyTmFtZXNUb0NvcHk6IHN0cmluZ1tdID0gW107XHJcbiAgICBjaGlsZHJlbjogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nW10gfSA9IHt9O1xyXG4gICAgcHJvcGVydGllczogeyBbbmFtZTogc3RyaW5nXTogeyBbcHJvcG5hbWU6IHN0cmluZ106IGFueVtdIH0gfSA9IHt9O1xyXG4gICAgdHlwZXM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcbn1cclxuXHJcblxyXG5AJENsYXNzKFwiamFzc2lqc19lZGl0b3IuQ29tcG9uZW50RGVzaWduZXJcIilcclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudERlc2lnbmVyIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgX2NvZGVFZGl0b3I7XHJcbiAgICBlZGl0TW9kZTogYm9vbGVhbjtcclxuICAgIHZhcmlhYmxlczogVmFyaWFibGVQYW5lbDtcclxuICAgIF9wcm9wZXJ0eUVkaXRvcjogUHJvcGVydHlFZGl0b3I7XHJcbiAgICBfZXJyb3JzOiBFcnJvclBhbmVsO1xyXG4gICAgX2NvbXBvbmVudFBhbGV0dGU6IENvbXBvbmVudFBhbGV0dGU7XHJcbiAgICBfY29tcG9uZW50RXhwbG9yZXI6IENvbXBvbmVudEV4cGxvcmVyO1xyXG4gICAgX2ludmlzaWJsZUNvbXBvbmVudHM6IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzO1xyXG4gICAgX2Rlc2lnblRvb2xiYXI6IFBhbmVsO1xyXG4gICAgX2Rlc2lnblBsYWNlaG9sZGVyOiBQYW5lbDtcclxuICAgIF9yZXNpemVyOiBSZXNpemVyO1xyXG4gICAgX2RyYWdhbmRkcm9wcGVyOiBEcmFnQW5kRHJvcHBlcjtcclxuICAgIHNhdmVCdXR0b246IEJ1dHRvbjtcclxuICAgIHJ1bkJ1dHRvbjogQnV0dG9uO1xyXG4gICAgbGFzc29CdXR0b246IEJ1dHRvbjtcclxuICAgIHVuZG9CdXR0b246IEJ1dHRvbjtcclxuICAgIGVkaXRCdXR0b246IEJ1dHRvbjtcclxuICAgIHJlbW92ZUJ1dHRvbjogQnV0dG9uO1xyXG4gICAgaW5saW5lRWRpdG9yUGFuZWw6IFBhbmVsO1xyXG4gICAgY29weUJ1dHRvbjogQnV0dG9uO1xyXG4gICAgcGFzdGVCdXR0b246IEJ1dHRvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5faW5pdERlc2lnbigpO1xyXG4gICAgICAgIHRoaXMuZWRpdE1vZGUgPSB0cnVlO1xyXG5cclxuICAgIH1cclxuICAgIGNvbm5lY3RQYXJzZXIocGFyc2VyKSB7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyID0gcGFyc2VyO1xyXG4gICAgfVxyXG4gICAgc2V0IGNvZGVFZGl0b3IodmFsdWUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IHRoaXMuX2NvZGVFZGl0b3IudmFyaWFibGVzO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yID0gbmV3IFByb3BlcnR5RWRpdG9yKHZhbHVlLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIC8vICAgdGhpcy5fcHJvcGVydHlFZGl0b3I9bmV3IFByb3BlcnR5RWRpdG9yKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5fZXJyb3JzID0gdGhpcy5fY29kZUVkaXRvci5fZXJyb3JzO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGUgPSBuZXcgQ29tcG9uZW50UGFsZXR0ZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGUuc2VydmljZSA9IFwiJFVJQ29tcG9uZW50XCI7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIgPSBuZXcgQ29tcG9uZW50RXhwbG9yZXIodmFsdWUsIHRoaXMuX3Byb3BlcnR5RWRpdG9yKTtcclxuICAgICAgICB0aGlzLl9pbnZpc2libGVDb21wb25lbnRzID0gbmV3IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzKHZhbHVlKTtcclxuICAgICAgICB0aGlzLmFkZCh0aGlzLl9pbnZpc2libGVDb21wb25lbnRzKTtcclxuICAgICAgICB0aGlzLl9pbml0Q29tcG9uZW50RXhwbG9yZXIoKTtcclxuICAgICAgICB0aGlzLl9pbnN0YWxsVmlldygpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX2NvZGVQYW5lbC5vbmJsdXIoZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlcktleXMoKTtcclxuXHJcbiAgICB9XHJcbiAgICBnZXQgY29kZUVkaXRvcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29kZUVkaXRvcjtcclxuICAgIH1cclxuICAgIF9pbml0RGVzaWduKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhciA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyID0gbmV3IFBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLXJ1biBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi50b29sdGlwID0gXCJUZXN0IERpYWxvZ1wiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuZWRpdERpYWxvZyghX3RoaXMuZWRpdE1vZGUpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLmVkaXRCdXR0b24pO1xyXG5cclxuICAgICAgICB0aGlzLnNhdmVCdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uLnRvb2x0aXAgPSBcIlNhdmUoQ3RybCtTKVwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLWNvbnRlbnQtc2F2ZSBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuc2F2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMuc2F2ZUJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8qICB0aGlzLnJ1bkJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICAgIHRoaXMucnVuQnV0dG9uLmljb24gPSBcIm1kaSBtZGktY2FyLWhhdGNoYmFjayBtZGktMThweFwiO1xyXG4gICAgICAgICAgdGhpcy5ydW5CdXR0b24udG9vbHRpcCA9IFwiUnVuKEY0KVwiO1xyXG4gICAgICAgICAgdGhpcy5ydW5CdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgX3RoaXMuZXZhbENvZGUoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5ydW5CdXR0b24pOyovXHJcblxyXG4gICAgICAgIHRoaXMudW5kb0J1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24uaWNvbiA9IFwibWRpIG1kaS11bmRvIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy51bmRvQnV0dG9uLnRvb2x0aXAgPSBcIlVuZG8gKFN0cmcrWilcIjtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnVuZG8oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLnVuZG9CdXR0b24pO1xyXG5cclxuICAgICAgICAvKiAgdmFyIHRlc3Q9bmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICB0ZXN0Lmljb249XCJtZGkgbWRpLWJ1ZyBtZGktMThweFwiO1xyXG4gICAgICAgICB0ZXN0LnRvb2x0aXA9XCJUZXN0XCI7XHJcbiAgICAgICAgIHRlc3Qub25jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAvL3ZhciBraz1fdGhpcy5fY29kZVZpZXcubGF5b3V0O1xyXG4gICAgICAgICB9KTtcclxuICAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGVzdCk7Ki9cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5sYXNzb0J1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLmljb24gPSBcIm1kaSBtZGktbGFzc28gbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLnRvb2x0aXAgPSBcIlNlbGVjdCBydWJiZXJiYW5kXCI7XHJcbiAgICAgICAgdGhpcy5sYXNzb0J1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmxhc3NvQnV0dG9uLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICBfdGhpcy5fcmVzaXplci5zZXRMYXNzb01vZGUodmFsKTtcclxuICAgICAgICAgICAgX3RoaXMuX2RyYWdhbmRkcm9wcGVyLmVuYWJsZURyYWdnYWJsZSghdmFsKTtcclxuICAgICAgICAgICAgLy9fdGhpcy5fZHJhZ2FuZGRyb3BwZXIuYWN0aXZhdGVEcmFnZ2luZyghdmFsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLmxhc3NvQnV0dG9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1kZWxldGUtZm9yZXZlci1vdXRsaW5lIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24udG9vbHRpcCA9IFwiRGVsZXRlIHNlbGVjdGVkIENvbnRyb2wgKEVOVEYpXCI7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnJlbW92ZUNvbXBvbmVudCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMucmVtb3ZlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLXJ1biBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi50b29sdGlwID0gXCJUZXN0IERpYWxvZ1wiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuZWRpdERpYWxvZyghX3RoaXMuZWRpdE1vZGUpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3B5QnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuY29weUJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLWNvbnRlbnQtY29weSBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMuY29weUJ1dHRvbi50b29sdGlwID0gXCJDb3B5XCI7XHJcbiAgICAgICAgdGhpcy5jb3B5QnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5jb3B5QnV0dG9uKTtcclxuICAgICAgICB0aGlzLnBhc3RlQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMucGFzdGVCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1jb250ZW50LXBhc3RlIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5wYXN0ZUJ1dHRvbi50b29sdGlwID0gXCJQYXN0ZVwiO1xyXG4gICAgICAgIHRoaXMucGFzdGVCdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnBhc3RlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5wYXN0ZUJ1dHRvbik7XHJcbiAgICAgICAgdmFyIGJveCA9IG5ldyBCb3hQYW5lbCgpO1xyXG4gICAgICAgIGJveC5ob3Jpem9udGFsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbCA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuX2lkID0gXCJpXCIgKyB0aGlzLmlubGluZUVkaXRvclBhbmVsLl9pZDtcclxuICAgICAgICB0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlubGluZUVkaXRvclBhbmVsLl9pZCk7XHJcbiAgICAgICAgJCh0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbSkuY3NzKFwiZGlzcGxheVwiLCBcImlubGluZVwiKTtcclxuICAgICAgICAkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tV3JhcHBlcikuY3NzKFwiZGlzcGxheVwiLCBcImlubGluZVwiKTtcclxuICAgICAgICAkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tKS5hZGRDbGFzcyhcIklubGluZUVkaXRvclBhbmVsXCIpO1xyXG5cclxuICAgICAgICAvLyAgIGJveC5oZWlnaHQ9NDA7XHJcbiAgICAgICAgYm94LmFkZCh0aGlzLl9kZXNpZ25Ub29sYmFyKTtcclxuICAgICAgICBib3guYWRkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwpO1xyXG4gICAgICAgIHRoaXMuYWRkKGJveCk7XHJcbiAgICAgICAgJCh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5kb21XcmFwcGVyKS5jc3MoXCJwb3NpdGlvblwiLCBcInJlbGF0aXZlXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgKiBtYW5hZ2Ugc2hvcnRjdXRzXHJcbiAgICovXHJcbiAgICByZWdpc3RlcktleXMoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAkKHRoaXMuX2NvZGVFZGl0b3IuX2Rlc2lnbi5kb20pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjFcIik7XHJcbiAgICAgICAgJCh0aGlzLl9jb2RlRWRpdG9yLl9kZXNpZ24uZG9tKS5rZXlkb3duKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUgJiYgZXZ0LnNoaWZ0S2V5KSB7Ly9GNFxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHRoaXNzPXRoaXMuX3RoaXMuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGVkaXRvciA9IGFjZS5lZGl0KHRoaXMuX3RoaXMuX2lkKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IDExNSkgey8vRjRcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gOTAgfHwgZXZ0LmN0cmxLZXkpIHsvL0N0cmwrWlxyXG4gICAgICAgICAgICAgICAgX3RoaXMudW5kbygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE2KSB7Ly9GNVxyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSA0Nikgey8vRGVsXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVDb21wb25lbnQoKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKFN0cmluZy5mcm9tQ2hhckNvZGUoZXZ0LndoaWNoKS50b0xvd2VyQ2FzZSgpID09PSAncycgJiYgZXZ0LmN0cmxLZXkpLyogJiYgKGV2dC53aGljaCA9PSAxOSkqLykgey8vU3RyK3NcclxuICAgICAgICAgICAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgfVxyXG4gICAgX2luc3RhbGxWaWV3KCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX3Byb3BlcnR5RWRpdG9yLCBcIlByb3BlcnRpZXNcIiwgXCJwcm9wZXJ0aWVzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLCBcIkNvbXBvbmVudHNcIiwgXCJjb21wb25lbnRzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX2NvbXBvbmVudFBhbGV0dGUsIFwiUGFsZXR0ZVwiLCBcImNvbXBvbmVudFBhbGV0dGVcIik7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5sYXlvdXQgPSAne1wic2V0dGluZ3NcIjp7XCJoYXNIZWFkZXJzXCI6dHJ1ZSxcImNvbnN0cmFpbkRyYWdUb0NvbnRhaW5lclwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJzZWxlY3Rpb25FbmFibGVkXCI6ZmFsc2UsXCJwb3BvdXRXaG9sZVN0YWNrXCI6ZmFsc2UsXCJibG9ja2VkUG9wb3V0c1Rocm93RXJyb3JcIjp0cnVlLFwiY2xvc2VQb3BvdXRzT25VbmxvYWRcIjp0cnVlLFwic2hvd1BvcG91dEljb25cIjpmYWxzZSxcInNob3dNYXhpbWlzZUljb25cIjp0cnVlLFwic2hvd0Nsb3NlSWNvblwiOnRydWUsXCJyZXNwb25zaXZlTW9kZVwiOlwib25sb2FkXCJ9LFwiZGltZW5zaW9uc1wiOntcImJvcmRlcldpZHRoXCI6NSxcIm1pbkl0ZW1IZWlnaHRcIjoxMCxcIm1pbkl0ZW1XaWR0aFwiOjEwLFwiaGVhZGVySGVpZ2h0XCI6MjAsXCJkcmFnUHJveHlXaWR0aFwiOjMwMCxcImRyYWdQcm94eUhlaWdodFwiOjIwMH0sXCJsYWJlbHNcIjp7XCJjbG9zZVwiOlwiY2xvc2VcIixcIm1heGltaXNlXCI6XCJtYXhpbWlzZVwiLFwibWluaW1pc2VcIjpcIm1pbmltaXNlXCIsXCJwb3BvdXRcIjpcIm9wZW4gaW4gbmV3IHdpbmRvd1wiLFwicG9waW5cIjpcInBvcCBpblwiLFwidGFiRHJvcGRvd25cIjpcImFkZGl0aW9uYWwgdGFic1wifSxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwiY29sdW1uXCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImNvbnRlbnRcIjpbe1widHlwZVwiOlwicm93XCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImhlaWdodFwiOjgxLjA0Mjk0MDY2MjU4OTg4LFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwid2lkdGhcIjo4MC41NzQ5MTI4OTE5ODYwNixcImhlaWdodFwiOjcxLjIzNTAzNDY1NjU4NDc2LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvZGVcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvZGUuLlwiLFwibmFtZVwiOlwiY29kZVwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfSx7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImRlc2lnblwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJuYW1lXCI6XCJkZXNpZ25cIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfSx7XCJ0eXBlXCI6XCJjb2x1bW5cIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwid2lkdGhcIjoxOS40MjUwODcxMDgwMTM5NCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6MTkuODQ0MzU3OTc2NjUzNjk3LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiUGFsZXR0ZVwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb21wb25lbnRQYWxldHRlXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJQYWxldHRlXCIsXCJuYW1lXCI6XCJjb21wb25lbnRQYWxldHRlXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6ODAuMTU1NjQyMDIzMzQ2MyxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlByb3BlcnRpZXNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwicHJvcGVydGllc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiUHJvcGVydGllc1wiLFwibmFtZVwiOlwicHJvcGVydGllc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19XX1dfSx7XCJ0eXBlXCI6XCJyb3dcIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiaGVpZ2h0XCI6MTguOTU3MDU5MzM3NDEwMTIyLFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwiaGVhZGVyXCI6e30sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJoZWlnaHRcIjoxOC45NTcwNTkzMzc0MTAxMjIsXCJ3aWR0aFwiOjc3LjcwMDM0ODQzMjA1NTc1LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiVmFyaWFibGVzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcInZhcmlhYmxlc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiVmFyaWFibGVzXCIsXCJuYW1lXCI6XCJ2YXJpYWJsZXNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX0se1widGl0bGVcIjpcIkVycm9yc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJlcnJvcnNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkVycm9yc1wiLFwibmFtZVwiOlwiZXJyb3JzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwid2lkdGhcIjoyMi4yOTk2NTE1Njc5NDQyNTYsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJDb21wb25lbnRzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvbXBvbmVudHNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvbXBvbmVudHNcIixcIm5hbWVcIjpcImNvbXBvbmVudHNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfV19XX1dLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJvcGVuUG9wb3V0c1wiOltdLFwibWF4aW1pc2VkSXRlbUlkXCI6bnVsbH0nO1xyXG4gICAgfVxyXG5cclxuICAgIF91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cy51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBfaW5pdENvbXBvbmVudEV4cGxvcmVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIub25zZWxlY3QoZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci5zZWxlY3Rpb24pO1xyXG4gICAgICAgICAgICAvLyAgdmFyIG9iID0gZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWwgPSBfdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudHJlZS5zZWxlY3Rpb247XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsLmxlbmd0aCA9PT0gMSlcclxuICAgICAgICAgICAgICAgICAgICBzZWwgPSBzZWxbMF07XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBzZWw7XHJcbiAgICAgICAgICAgIH0sIDEwKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlci5nZXRDb21wb25lbnROYW1lID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIHZhcm5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoaXRlbSk7XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YXJuYW1lLnN1YnN0cmluZyg1KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhcm5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVtb3ZlcyB0aGUgc2VsZWN0ZWQgY29tcG9uZW50XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUNvbXBvbmVudCgpIHtcclxuICAgICAgICB2YXIgdG9kZWwgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHRoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHRvZGVsKTtcclxuICAgICAgICBpZiAodmFybmFtZSAhPT0gXCJ0aGlzXCIpIHtcclxuICAgICAgICAgICAgaWYgKHRvZGVsLmRvbVdyYXBwZXIuX3BhcmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0b2RlbC5kb21XcmFwcGVyLl9wYXJlbnQucmVtb3ZlKHRvZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVWYXJpYWJsZUluQ29kZSh2YXJuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlVmFyaWFibGVJbkRlc2lnbih2YXJuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvcHlQcm9wZXJ0aWVzKGNsaXA6IENsaXBib2FyZERhdGEsIGNvbXBvbmVudDogQ29tcG9uZW50KSB7XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSB0aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChjb21wb25lbnQpO1xyXG4gICAgICAgIHZhciBwYXJzZXJkYXRhID0gdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyLmRhdGFbdmFybmFtZV07XHJcbiAgICAgICAgY2xpcC50eXBlc1t2YXJuYW1lXSA9IGNsYXNzZXMuZ2V0Q2xhc3NOYW1lKGNvbXBvbmVudCk7XHJcbiAgICAgICAgaWYgKCFjbGlwLnByb3BlcnRpZXNbdmFybmFtZV0pIHtcclxuICAgICAgICAgICAgY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBlZGl0b3JmaWVsZHMgPSB7fTtcclxuICAgICAgICBDb21wb25lbnREZXNjcmlwdG9yLmRlc2NyaWJlKGNvbXBvbmVudC5jb25zdHJ1Y3Rvcik/LmZpZWxkcy5mb3JFYWNoKChmKSA9PiB7IGVkaXRvcmZpZWxkc1tmLm5hbWVdID0gZiB9KTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyc2VyZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZWRpdG9yZmllbGRzW2tleV0gfHwga2V5ID09PSBcIl9uZXdfXCIgfHwga2V5ID09PSBcImFkZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNsaXAucHJvcGVydGllc1t2YXJuYW1lXVtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdW2tleV0gPSBbXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJzZXJkYXRhW2tleV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAvL29ubHkgYWRkIGZpZWxkcyBpbiBQcm9wZXJ0eWRlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgICAgICBjbGlwLnByb3BlcnRpZXNbdmFybmFtZV1ba2V5XS5wdXNoKHBhcnNlcmRhdGFba2V5XVtpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZG5hbWUgPSB0aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXVt4XSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsaXAuY2hpbGRyZW5bdmFybmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlwLmNoaWxkcmVuW3Zhcm5hbWVdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsaXAuY2hpbGRyZW5bdmFybmFtZV0ucHVzaChjaGlsZG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29weVByb3BlcnRpZXMoY2xpcCwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl1beF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29weSgpIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50cykpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50cyA9IFtjb21wb25lbnRzXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjbGlwID0gbmV3IENsaXBib2FyZERhdGEoKTtcclxuICAgICAgICBjbGlwLnZhck5hbWVzVG9Db3B5ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnQ6IENvbXBvbmVudCA9IGNvbXBvbmVudHNbeF07XHJcbiAgICAgICAgICAgIHZhciB2YXJuYW1lID0gdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgY2xpcC52YXJOYW1lc1RvQ29weS5wdXNoKHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlQcm9wZXJ0aWVzKGNsaXAsIGNvbXBvbmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoY2xpcCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGV4dCk7XHJcbiAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFzeW5jIHBhc3RlQ29tcG9uZW50KGNsaXA6IENsaXBib2FyZERhdGEsIHRhcmdldDogQ29udGFpbmVyLCB2YXJuYW1lOiBzdHJpbmcsIHZhcmlhYmxlbGlzdG9sZDogYW55W10sIHZhcmlhYmxlbGlzdG5ldzogYW55W10pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB2YXJ0eXBlID0gY2xpcC5wcm9wZXJ0aWVzW3Zhcm5hbWVdW1wiX25ld19cIl1bMF07XHJcbiAgICAgICAgaWYgKHZhcmlhYmxlbGlzdG9sZC5pbmRleE9mKHZhcm5hbWUpID4gLTEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXJ0eXBlID0gdmFydHlwZS5zcGxpdChcIihcIilbMF0uc3BsaXQoXCJuZXcgXCIpWzFdO1xyXG5cclxuICAgICAgICB2YXIgdGFyZ2V0bmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdCh0YXJnZXQpO1xyXG4gICAgICAgIHZhciBuZXdjb21wID0geyBjcmVhdGVGcm9tVHlwZTogY2xpcC50eXBlc1t2YXJuYW1lXSB9O1xyXG4gICAgICAgIGF3YWl0IGNsYXNzZXMubG9hZENsYXNzKGNsaXAudHlwZXNbdmFybmFtZV0pO1xyXG4gICAgICAgIHZhciBjcmVhdGVkID0gX3RoaXMuY3JlYXRlQ29tcG9uZW50KGNsaXAudHlwZXNbdmFybmFtZV0sIG5ld2NvbXAsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0YXJnZXQsIHVuZGVmaW5lZCwgZmFsc2UpO1xyXG4gICAgICAgIHZhcmlhYmxlbGlzdG9sZC5wdXNoKHZhcm5hbWUpO1xyXG4gICAgICAgIC8vY29ycmVjdCBkZXNpZ25kdW1teVxyXG4gICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgdGFyZ2V0Ll9jb21wb25lbnRzLmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjaCA9IHRhcmdldC5fY29tcG9uZW50c1t0XTtcclxuICAgICAgICAgICAgaWYgKGNoW1widHlwZVwiXSA9PT0gXCJhdEVuZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlKGNoKTtcclxuICAgICAgICAgICAgICAgIC8vIHRhcmdldC5hZGQoY2gpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyaWFibGVsaXN0bmV3LnB1c2goX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNyZWF0ZWQpKTtcclxuICAgICAgICBpZiAoY2xpcC5jaGlsZHJlblt2YXJuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgY2xpcC5jaGlsZHJlblt2YXJuYW1lXS5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucGFzdGVDb21wb25lbnQoY2xpcCwgPENvbnRhaW5lcj5jcmVhdGVkLCBjbGlwLmNoaWxkcmVuW3Zhcm5hbWVdW2tdLCB2YXJpYWJsZWxpc3RvbGQsIHZhcmlhYmxlbGlzdG5ldyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBwYXN0ZSgpIHtcclxuICAgICAgICB2YXIgdGV4dCA9IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKTtcclxuICAgICAgICB2YXIgY3JlYXRlZFxyXG4gICAgICAgIHZhciBjbGlwOiBDbGlwYm9hcmREYXRhID0gSlNPTi5wYXJzZSh0ZXh0KTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB2YXJpYWJsZWxpc3RvbGQgPSBbXTtcclxuICAgICAgICB2YXIgdmFyaWFibGVsaXN0bmV3ID0gW107XHJcbiAgICAgICAgLy9jcmVhdGUgQ29tcG9uZW50c1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2xpcC52YXJOYW1lc1RvQ29weS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgdmFybmFtZSA9IGNsaXAudmFyTmFtZXNUb0NvcHlbeF07XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQ6IENvbnRhaW5lciA9IF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICAgICAgYXdhaXQgX3RoaXMucGFzdGVDb21wb25lbnQoY2xpcCwgdGFyZ2V0LCB2YXJuYW1lLCB2YXJpYWJsZWxpc3RvbGQsIHZhcmlhYmxlbGlzdG5ldyk7XHJcblxyXG4gICAgICAgICAgICAvL3NldCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vaW4gdGhlIG5ldyBUZXh0IHRoZSB2YXJpYWJsZXMgYXJlIHJlbmFtZWRcclxuICAgICAgICB2YXIgdGV4dG5ldyA9IHRleHQ7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YXJpYWJsZWxpc3RuZXcubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIG9sZE5hbWUgPSB2YXJpYWJsZWxpc3RvbGRbeF07XHJcbiAgICAgICAgICAgIHZhciBuZXdOYW1lID0gdmFyaWFibGVsaXN0bmV3W3hdO1xyXG4gICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIlxcXFxXXCIgKyBvbGROYW1lICsgXCJcXFxcV1wiKTtcclxuICAgICAgICAgICAgdmFyIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgd2hpbGUgKGZvdW5kID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0ZXh0bmV3ID0gdGV4dG5ldy5yZXBsYWNlKHJlZywgZnVuY3Rpb24gcmVwbGFjZXIobWF0Y2gsIG9mZnNldCwgc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcDEgaXMgbm9uZGlnaXRzLCBwMiBkaWdpdHMsIGFuZCBwMyBub24tYWxwaGFudW1lcmljc1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDAsIDEpICsgbmV3TmFtZSArIG1hdGNoLnN1YnN0cmluZyhtYXRjaC5sZW5ndGggLSAxLCBtYXRjaC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2xpcCA9IEpTT04ucGFyc2UodGV4dG5ldyk7XHJcblxyXG4gICAgICAgIC8vc2V0IHByb3BlcnRpZXNcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZhcmlhYmxlbGlzdG5ldy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgdmFyaWFibGVuYW1lID0gdmFyaWFibGVsaXN0bmV3W3hdXHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjbGlwLnByb3BlcnRpZXNbdmFyaWFibGVuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSAhPT0gXCJfbmV3X1wiICYmIGtleSAhPT0gXCJjb25maWdcIiAmJiBrZXkgIT0gXCJhZGRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZGF0YSA9IGNsaXAucHJvcGVydGllc1t2YXJpYWJsZW5hbWVdW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdiA9IDA7IHYgPCBwcm9wZGF0YS5sZW5ndGg7IHYrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ZhbHVlOiBzdHJpbmcgPSBwcm9wZGF0YVt2XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudCA9IF90aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZSh2YXJpYWJsZW5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJnbmFtZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsbHZhcnMgPSBfdGhpcy5jb2RlRWRpdG9yLnZhcmlhYmxlcy52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9pbnRyb2R1Y2UgdmFyaWFibGVzIHJlcGxhY2UgbWUudGV4dGJveDEtPm1lX3RleHRib3gxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHZ2ID0gMDsgdnYgPCBhbGx2YXJzLmxlbmd0aDsgdnYrKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXd2YXJuYW1lID0gYWxsdmFyc1t2dl0ubmFtZS5yZXBsYWNlQWxsKFwiLlwiLCBcIl9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdmFsdWUgPSBzdmFsdWUucmVwbGFjZUFsbChhbGx2YXJzW3Z2XS5uYW1lLCBuZXd2YXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXd2YXJuYW1lICE9PSBcInRoaXNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ25hbWVzLnB1c2gobmV3dmFybmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFsbHZhcnNbdnZdLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlYWx2YWx1ZSA9IG5ldyBGdW5jdGlvbiguLi5hcmduYW1lcywgXCJyZXR1cm4gKFwiICsgc3ZhbHVlICsgXCIpO1wiKS5iaW5kKF90aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIikpKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChjb21wb25lbnRba2V5XSkgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50W2tleV0ocmVhbHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFtrZXldID0gcmVhbHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5EZXNpZ24oa2V5LHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKGtleSwgcHJvcGRhdGFbdl0sIHByb3BkYXRhLmxlbmd0aCA+IDAsIHZhcmlhYmxlbmFtZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IGNyZWF0ZWQ7XHJcbiAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLmNvZGVFZGl0b3IudmFsdWUgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpO1xyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xyXG4gICAgICAgIC8vaW5jbHVkZSB0aGUgbmV3IGVsZW1lbnRcclxuICAgICAgICBfdGhpcy5lZGl0RGlhbG9nKHRydWUpO1xyXG4gICAgICAgIF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci51cGRhdGUoKTtcclxuICAgICAgICBfdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBleGVjdXRlIHRoZSBjdXJyZW50IGNvZGVcclxuICAgICogQHBhcmFtIHtib29sZWFufSB0b0N1cnNvciAtICBpZiB0cnVlIHRoZSB2YXJpYWJsZXMgd2VyZSBpbnNwZWN0ZWQgb24gY3Vyc29yIHBvc2l0aW9uLCBcclxuICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBmYWxzZSBhdCB0aGUgZW5kIG9mIHRoZSBsYXlvdXQoKSBmdW5jdGlvbiBvciBhdCB0aGUgZW5kIG9mIHRoZSBjb2RlXHJcbiAgICAqL1xyXG4gICAgZXZhbENvZGUodG9DdXJzb3IgPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLmV2YWxDb2RlKHRvQ3Vyc29yKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogc2F2ZSB0aGUgY29kZSB0byBzZXJ2ZXJcclxuICAgICovXHJcbiAgICBzYXZlKCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3Iuc2F2ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVuZG8gYWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHVuZG8oKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci51bmRvKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldENvbXBvbmVudElEc0luRGVzaWduKGNvbXBvbmVudDogQ29tcG9uZW50LCBjb2xsZWN0OiBzdHJpbmdbXSkge1xyXG5cclxuICAgICAgICBjb2xsZWN0LnB1c2goXCIjXCIgKyBjb21wb25lbnQuX2lkKTtcclxuICAgICAgICB2YXIgY2hpbGRzID0gY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl07XHJcbiAgICAgICAgaWYgKGNoaWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY2hpbGRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudElEc0luRGVzaWduKGNoaWxkc1t4XSwgY29sbGVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGRpYWxvZyBlZGl0IG1vZGVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gaWYgdHJ1ZSBhbGxvdyByZXNpemluZyBhbmQgZHJhZyBhbmQgZHJvcCBcclxuICAgICAqL1xyXG4gICAgZWRpdERpYWxvZyhlbmFibGUpIHtcclxuXHJcblxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGVuYWJsZTtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24udG9nZ2xlKCF0aGlzLmVkaXRNb2RlKTtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24uaGlkZGVuID0gIWVuYWJsZTtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLmhpZGRlbiA9ICFlbmFibGU7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVCdXR0b24uaGlkZGVuID0gIWVuYWJsZTtcclxuICAgICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF07XHJcbiAgICAgICAgLy9zd2l0Y2ggZGVzaWdubW9kZVxyXG4gICAgICAgIHZhciBjb21wcyA9ICQoY29tcG9uZW50LmRvbSkuZmluZChcIi5qY29tcG9uZW50XCIpO1xyXG4gICAgICAgIGNvbXBzLmFkZENsYXNzKFwiamRlc2lnbm1vZGVcIik7XHJcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBjb21wcy5sZW5ndGg7IGMrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbXBzW2NdLl90aGlzW1wiZXh0ZW5zaW9uQ2FsbGVkXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBzW2NdLl90aGlzW1wiZXh0ZW5zaW9uQ2FsbGVkXCJdKHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnREZXNpZ25lclNldERlc2lnbk1vZGU6IHsgZW5hYmxlLCBjb21wb25lbnREZXNpZ25lcjogdGhpcyB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vY29tcHNbY10uX3RoaXNbXCJzZXREZXNpZ25Nb2RlXCJdKGVuYWJsZSx0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tcG9uZW50W1wiZXh0ZW5zaW9uQ2FsbGVkXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50W1wiZXh0ZW5zaW9uQ2FsbGVkXCJdKHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZTogeyBlbmFibGUsIGNvbXBvbmVudERlc2lnbmVyOiB0aGlzIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2lmKGNvbXBvbmVudFtcInNldERlc2lnbk1vZGVcIl0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgIC8vICAgICAgICBjb21wb25lbnRbXCJzZXREZXNpZ25Nb2RlXCJdKGVuYWJsZSx0aGlzKTtcclxuICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTsvL3ZhcmlhYmxlcyBjYW4gYmUgYWRkZWQgd2l0aCBSZXBlYXRlci5zZXREZXNpZ25Nb2RlXHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLnVuaW5zdGFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZHJhZ2FuZGRyb3BwZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci51bmluc3RhbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbmFibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGFsbGNvbXBvbmVudHMgPSB0aGlzLnZhcmlhYmxlcy5nZXRFZGl0YWJsZUNvbXBvbmVudHMoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnR5RWRpdG9yLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50SURzSW5EZXNpZ24oY29tcG9uZW50LCByZXQpO1xyXG4gICAgICAgICAgICAgICAgYWxsY29tcG9uZW50cyA9IHJldC5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICBhbGxjb21wb25lbnRzID0gdGhpcy52YXJpYWJsZXMuZ2V0RWRpdGFibGVDb21wb25lbnRzKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5faW5zdGFsbFRpbnlFZGl0b3IoKTtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIgPSBuZXcgRHJhZ0FuZERyb3BwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplciA9IG5ldyBSZXNpemVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIuZHJhZ2FuZGRyb3BwZXIgPSB0aGlzLl9kcmFnYW5kZHJvcHBlcjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIub25lbGVtZW50c2VsZWN0ZWQgPSBmdW5jdGlvbiAoZWxlbWVudElEcywgZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBlbGVtZW50SURzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iID0gJChcIiNcIiArIGVsZW1lbnRJRHNbeF0pWzBdLl90aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYltcImVkaXRvcnNlbGVjdHRoaXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iID0gb2JbXCJlZGl0b3JzZWxlY3R0aGlzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKG9iKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZXQubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IHJldFswXTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJldC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gcmV0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplci5vbnByb3BlcnR5Y2hhbmdlZCA9IGZ1bmN0aW9uIChjb21wOiBDb21wb25lbnQsIHByb3A6IHN0cmluZywgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSAhPT0gY29tcClcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBjb21wO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKHByb3AsIHZhbHVlICsgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIuaW5zdGFsbChjb21wb25lbnQsIGFsbGNvbXBvbmVudHMpO1xyXG4gICAgICAgICAgICBhbGxjb21wb25lbnRzID0gdGhpcy52YXJpYWJsZXMuZ2V0RWRpdGFibGVDb21wb25lbnRzKGNvbXBvbmVudCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLmluc3RhbGwoY29tcG9uZW50LCBhbGxjb21wb25lbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIub25wcm9wZXJ0eWNoYW5nZWQgPSBmdW5jdGlvbiAoY29tcG9uZW50LCB0b3AsIGxlZnQsIG9sZFBhcmVudCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLm1vdmVDb21wb25lbnQoY29tcG9uZW50LCB0b3AsIGxlZnQsIG9sZFBhcmVudCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLm9ucHJvcGVydHlhZGRlZCA9IGZ1bmN0aW9uICh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmNyZWF0ZUNvbXBvbmVudCh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIuaXNEcmFnRW5hYmxlZCA9IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5fcmVzaXplciA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5fcmVzaXplci5jb21wb25lbnRVbmRlckN1cnNvciAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qICAkKFwiLmhvaG8yXCIpLnNlbGVjdGFibGUoe30pO1xyXG4gICAgICAgICAgJChcIi5ob2hvMlwiKS5zZWxlY3RhYmxlKFwiZGlzYWJsZVwiKTsqL1xyXG4gICAgICAgIC8qICAkKFwiLkhUTUxQYW5lbFwiKS5zZWxlY3RhYmxlKHt9KTtcclxuICAgICAgICAgICQoXCIuSFRNTFBhbmVsXCIpLnNlbGVjdGFibGUoXCJkaXNhYmxlXCIpO1xyXG4gICAgICAgICAgJChcIi5IVE1MUGFuZWxcIikuZHJhZ2dhYmxlKHt9KTtcclxuICAgICAgICAgICQoXCIuSFRNTFBhbmVsXCIpLmRyYWdnYWJsZShcImRpc2FibGVcIik7Ki9cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1vdmUgYSBjb21wb25lbnRcclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gbW92ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcCAtIHRoZSB0b3AgYWJzb2x1dGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0gdGhlIGxlZnQgYWJzb2x1dGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db250YWluZXJ9IG5ld1BhcmVudCAtIHRoZSBuZXcgcGFyZW50IGNvbnRhaW5lciB3aGVyZSB0aGUgY29tcG9uZW50IG1vdmUgdG9cclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGJlZm9yZUNvbXBvbmVudCAtIGluc2VydCB0aGUgY29tcG9uZW50IGJlZm9yZSBiZWZvcmVDb21wb25lbnRcclxuICAgICAqKi9cclxuICAgIG1vdmVDb21wb25lbnQoY29tcG9uZW50LCB0b3AsIGxlZnQsIG9sZFBhcmVudCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8qaWYoYmVmb3JlQ29tcG9uZW50IT09dW5kZWZpbmVkJiZiZWZvcmVDb21wb25lbnQuZGVzaWduRHVtbXlGb3IhPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBiZWZvcmVDb21wb25lbnQ9dW5kZWZpbmVkO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHZhciBvbGROYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9sZFBhcmVudCk7XHJcbiAgICAgICAgdmFyIG5ld05hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QobmV3UGFyZW50KTtcclxuICAgICAgICB2YXIgY29tcE5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoY29tcG9uZW50KTtcclxuICAgICAgICBpZiAodG9wICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwieFwiLCB0b3AgKyBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJ4XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGVmdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInlcIiwgbGVmdCArIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcInlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob2xkUGFyZW50ICE9PSBuZXdQYXJlbnQgfHwgYmVmb3JlQ29tcG9uZW50ICE9PSB1bmRlZmluZWQgfHwgdG9wID09PSB1bmRlZmluZWQpIHsvL3RvcD11bmRlZmluZWQgLT5vbiByZWxhdGl2ZSBwb3NpdGlvbiBhdCB0aGUgZW5kIGNhbGwgdGhlIGJsb2NrXHJcbiAgICAgICAgICAgIC8vZ2V0IFBvc2l0aW9uXHJcbiAgICAgICAgICAgIHZhciBvbGRWYWwgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgY29tcE5hbWUsIG9sZE5hbWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgdmFyIGJlZm9yZTtcclxuICAgICAgICAgICAgaWYgKGJlZm9yZUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkICYmIGJlZm9yZUNvbXBvbmVudC50eXBlICE9PSBcImF0RW5kXCIpIHsvL2Rlc2lnbmR1bW15IGF0RW5kXHJcbiAgICAgICAgICAgICAgICB2YXIgb24gPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoYmVmb3JlQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXIgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoYmVmb3JlQ29tcG9uZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYmVmb3JlID0geyB2YXJpYWJsZW5hbWU6IHBhciwgcHJvcGVydHk6IFwiYWRkXCIsIHZhbHVlOiBvbiB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcImFkZFwiLCAvKmNvbXBOYW1lKi9vbGRWYWwsIGZhbHNlLCBuZXdOYW1lLCBiZWZvcmUpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLyogaWYobmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aD4xKXsvL2NvcnJlY3QgZHVtbXlcclxuICAgICAgICAgICAgIHZhciBkdW1teT1cdG5ld1BhcmVudC5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTJdO1xyXG4gICAgICAgICAgICAgaWYoZHVtbXkuZGVzaWduRHVtbXlGb3IhPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgIC8vdmFyIHRtcD1uZXdQYXJlbnQuX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgICAgICBuZXdQYXJlbnQucmVtb3ZlKGR1bW15KTsvLy5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTFdPW5ld1BhcmVudC5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTJdO1xyXG4gICAgICAgICAgICAgICAgIG5ld1BhcmVudC5hZGQoZHVtbXkpOy8vLl9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMV09dG1wO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9Ki9cclxuICAgICAgICBfdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTtcclxuICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWU7XHJcbiAgICAgICAgX3RoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnZhbHVlID0gX3RoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgYSBuZXcgY29tcG9uZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIHRoZSB0eXBlIG9mIHRoZSBuZXcgY29tcG9uZW50XHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRoZW1zZWxmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9wIC0gdGhlIHRvcCBhYnNvbHV0ZSBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgLSB0aGUgbGVmdCBhYnNvbHV0ZSBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbnRhaW5lcn0gbmV3UGFyZW50IC0gdGhlIG5ldyBwYXJlbnQgY29udGFpbmVyIHdoZXJlIHRoZSBjb21wb25lbnQgaXMgcGxhY2VkXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBiZWZvcmVDb21wb25lbnQgLSBpbnNlcnQgdGhlIG5ldyBjb21wb25lbnQgYmVmb3JlIGJlZm9yZUNvbXBvbmVudFxyXG4gICAgICoqL1xyXG4gICAgY3JlYXRlQ29tcG9uZW50KHR5cGUsIGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCwgZG9VcGRhdGUgPSB0cnVlKTogQ29tcG9uZW50IHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8qaWYoYmVmb3JlQ29tcG9uZW50IT09dW5kZWZpbmVkJiZiZWZvcmVDb21wb25lbnQuZGVzaWduRHVtbXlGb3ImJmJlZm9yZUNvbXBvbmVudC50eXBlPT09XCJhdEVuZFwiKXtcclxuICAgICAgICAgICAgYmVmb3JlQ29tcG9uZW50PXVuZGVmaW5lZDtcclxuICAgICAgICB9Ki9cclxuICAgICAgICB2YXIgZmlsZSA9IHR5cGUucmVwbGFjZUFsbChcIi5cIiwgXCIvXCIpO1xyXG4gICAgICAgIHZhciBzdHlwZSA9IGZpbGUuc3BsaXQoXCIvXCIpW2ZpbGUuc3BsaXQoXCIvXCIpLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5hZGRJbXBvcnRJZk5lZWRlZChzdHlwZSwgZmlsZSk7XHJcbiAgICAgICAgdmFyIHJlcGVhdGVyID0gX3RoaXMuX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihuZXdQYXJlbnQpO1xyXG4gICAgICAgIHZhciBzY29wZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAocmVwZWF0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVwZWF0ZXJuYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHJlcGVhdGVyKTtcclxuICAgICAgICAgICAgdmFyIHRlc3QgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyLmdldFByb3BlcnR5VmFsdWUocmVwZWF0ZXJuYW1lLCBcImNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiKTtcclxuICAgICAgICAgICAgc2NvcGUgPSB7IHZhcmlhYmxlbmFtZTogcmVwZWF0ZXJuYW1lLCBtZXRob2RuYW1lOiBcImNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiIH07XHJcbiAgICAgICAgICAgIGlmICh0ZXN0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YXJkYXRhYmluZGVyID0gX3RoaXMuX3Byb3BlcnR5RWRpdG9yLmdldE5leHRWYXJpYWJsZU5hbWVGb3JUeXBlKFwiamFzc2lqcy51aS5EYXRhYmluZGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwiY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50XCIsIFwiZnVuY3Rpb24obWU6TWUpe1xcblxcdFxcbn1cIiwgdHJ1ZSwgcmVwZWF0ZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgIHJlcGVhdGVyLmNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudChmdW5jdGlvbiAobWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVzaWduTW9kZSAhPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vX3RoaXMudmFyaWFibGVzLmFkZFZhcmlhYmxlKHZhcmRhdGFiaW5kZXIsZGF0YWJpbmRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8qdmFyIGRiPW5ldyBqYXNzaWpzLnVpLkRhdGFiaW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlcGVhdGVyLnZhbHVlIT09dW5kZWZpbmVkJiZyZXBlYXRlci52YWx1ZS5sZW5ndGg+MClcclxuICAgICAgICAgICAgICAgICAgICBkYi52YWx1ZT1yZXBlYXRlci52YWx1ZVswXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy5hZGQodmFyZGF0YWJpbmRlcixkYik7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTsqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB2YXJ2YWx1ZSA9IG5ldyAoY2xhc3Nlcy5nZXRDbGFzcyh0eXBlKSk7XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSBfdGhpcy5jcmVhdGVWYXJpYWJsZSh0eXBlLCBzY29wZSwgdmFydmFsdWUpO1xyXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eUVkaXRvci5jb2RlRWRpdG9yICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBuZXdOYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG5ld1BhcmVudCk7XHJcbiAgICAgICAgICAgIHZhciBiZWZvcmU7XHJcbiAgICAgICAgICAgIGlmIChiZWZvcmVDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiBiZWZvcmVDb21wb25lbnQudHlwZSAhPT0gXCJhdEVuZFwiKSB7Ly9EZXNpZ25kdW1teSBhdEVuZFxyXG4gICAgICAgICAgICAgICAgLy9pZihiZWZvcmVDb21wb25lbnQudHlwZT09PVwiYmVmb3JlQ29tcG9uZW50XCIpXHJcbiAgICAgICAgICAgICAgICAvLyAgIGJlZm9yZUNvbXBvbmVudD1iZWZvcmVDb21wb25lbnQuZGVzaWduRHVtbXlGb3I7XHJcbiAgICAgICAgICAgICAgICB2YXIgb24gPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoYmVmb3JlQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXIgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoYmVmb3JlQ29tcG9uZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYmVmb3JlID0geyB2YXJpYWJsZW5hbWU6IHBhciwgcHJvcGVydHk6IFwiYWRkXCIsIHZhbHVlOiBvbiB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcImFkZFwiLCB2YXJuYW1lLCBmYWxzZSwgbmV3TmFtZSwgYmVmb3JlLCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYmVmb3JlQ29tcG9uZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbmV3UGFyZW50LmFkZEJlZm9yZSh2YXJ2YWx1ZSwgYmVmb3JlQ29tcG9uZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdQYXJlbnQuYWRkKHZhcnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyogaWYobmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aD4xKXsvL2NvcnJlY3QgZHVtbXlcclxuICAgICAgICAgICAgIGlmKG5ld1BhcmVudC5fZGVzaWduRHVtbXkpe1xyXG4gICAgICAgICAgICAgICAgIC8vdmFyIHRtcD1uZXdQYXJlbnQuX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgICAgICBuZXdQYXJlbnQuZG9tLnJlbW92ZUNoaWxkKG5ld1BhcmVudC5fZGVzaWduRHVtbXkuZG9tV3JhcHBlcilcclxuICAgICAgICAgICAgICAgICBuZXdQYXJlbnQuZG9tLmFwcGVuZChuZXdQYXJlbnQuX2Rlc2lnbkR1bW15LmRvbVdyYXBwZXIpXHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH0qL1xyXG4gICAgICAgIF90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpO1xyXG5cclxuICAgICAgICAvL3NldCBpbml0aWFsIHByb3BlcnRpZXMgZm9yIHRoZSBuZXcgY29tcG9uZW50XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudC5jcmVhdGVGcm9tUGFyYW0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcG9uZW50LmNyZWF0ZUZyb21QYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IGNvbXBvbmVudC5jcmVhdGVGcm9tUGFyYW1ba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgICAgICB2YWwgPSAnXCInICsgdmFsICsgJ1wiJztcclxuICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShrZXksIHZhbCwgdHJ1ZSwgdmFybmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJC5leHRlbmQodmFydmFsdWUsIGNvbXBvbmVudC5jcmVhdGVGcm9tUGFyYW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodG9wICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwieFwiLCB0b3AgKyBcIlwiLCB0cnVlLCB2YXJuYW1lKTtcclxuICAgICAgICAgICAgdmFydmFsdWUueCA9IHRvcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxlZnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJ5XCIsIGxlZnQgKyBcIlwiLCB0cnVlLCB2YXJuYW1lKTtcclxuICAgICAgICAgICAgdmFydmFsdWUueSA9IGxlZnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL25vdGlmeSBjb21wb25lbnRkZXNjcmlwdG9yIFxyXG4gICAgICAgIHZhciBhYyA9IHZhcnZhbHVlLmV4dGVuc2lvbkNhbGxlZDtcclxuICAgICAgICBpZiAoYWMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXJ2YWx1ZS5leHRlbnNpb25DYWxsZWQoe1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50RGVzaWduZXJDb21wb25lbnRDcmVhdGVkOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UGFyZW50OiBuZXdQYXJlbnRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkb1VwZGF0ZSkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSB2YXJ2YWx1ZTtcclxuICAgICAgICAgICAgLy9pbmNsdWRlIHRoZSBuZXcgZWxlbWVudFxyXG4gICAgICAgICAgICBfdGhpcy5lZGl0RGlhbG9nKHRydWUpO1xyXG4gICAgICAgICAgICBfdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIF90aGlzLl91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YXJ2YWx1ZTtcclxuICAgIH1cclxuICAgIGNyZWF0ZVZhcmlhYmxlKHR5cGUsIHNjb3BlLCB2YXJ2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eUVkaXRvci5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHRoaXMuX3Byb3BlcnR5RWRpdG9yLmFkZFZhcmlhYmxlSW5Db2RlKHR5cGUsIHNjb3BlKTtcclxuXHJcbiAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSAmJiB0aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcIm1lXCIpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcy5fY29kZUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUoXCJtZVwiKTtcclxuICAgICAgICAgICAgbWVbdmFybmFtZS5zdWJzdHJpbmcoMyldID0gdmFydmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSkge1xyXG4gICAgICAgICAgICB2YXIgdGggPSB0aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIik7XHJcbiAgICAgICAgICAgIHRoW3Zhcm5hbWUuc3Vic3RyaW5nKDUpXSA9IHZhcnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlcy5hZGRWYXJpYWJsZSh2YXJuYW1lLCB2YXJ2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHZhcm5hbWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGlzIHRoZXJlIGEgcGFyZW50IHRoYXQgYWN0cyBhIHJlcGVhdGluZyBjb250YWluZXI/XHJcbiAgICAgKiovXHJcbiAgICBfaGFzUmVwZWF0aW5nQ29udGFpbmVyKGNvbXBvbmVudCkge1xyXG4gICAgICAgIGlmIChjb21wb25lbnQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoY29tcG9uZW50KSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBSZXBlYXRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5faGFzUmVwZWF0aW5nQ29udGFpbmVyKGNvbXBvbmVudC5fcGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxWYXJpYWJsZXMocm9vdDogQ29tcG9uZW50LCBjb21wb25lbnQ6IENvbXBvbmVudCwgY2FjaGU6IHsgW2NvbXBvbmVudGlkOiBzdHJpbmddOiB7IGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIgfSB9KSB7XHJcbiAgICAgICAgaWYgKGNhY2hlW2NvbXBvbmVudC5faWRdID09PSB1bmRlZmluZWQgJiYgY29tcG9uZW50W1wiX19zdGFja1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGNvbXBvbmVudFtcIl9fc3RhY2tcIl0/LnNwbGl0KFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGxpbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2xpbmU6IHN0cmluZyA9IGxpbmVzW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNsaW5lLmluZGV4T2YoXCIkdGVtcC5qc1wiKSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3BsID0gc2xpbmUuc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbnRyID0ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVbY29tcG9uZW50Ll9pZF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IE51bWJlcihzcGxbc3BsLmxlbmd0aCAtIDJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBOdW1iZXIoc3BsW3NwbC5sZW5ndGggLSAxXS5yZXBsYWNlKFwiKVwiLCBcIlwiKSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsVmFyaWFibGVzKHJvb3QsIGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdW3hdLCBjYWNoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA9PT0gcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgLy9mZXJ0aWdcclxuICAgICAgICAgICAgICAgIHZhciBoaCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG1lbWJlciB7amFzc2lqcy51aS5Db21wb25lbnR9IC0gdGhlIGRlc2lnbmVkIGNvbXBvbmVudFxyXG4gICAgICovXHJcbiAgICBzZXQgZGVzaWduZWRDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgdGhpcy5maWxsVmFyaWFibGVzKGNvbXBvbmVudCwgY29tcG9uZW50LCB7fSk7XHJcbiAgICAgICAgdmFyIGNvbSA9IGNvbXBvbmVudDtcclxuICAgICAgICBpZiAoY29tW1wiaXNBYnNvbHV0ZVwiXSAhPT0gdHJ1ZSAmJiBjb20ud2lkdGggPT09IFwiMFwiICYmIGNvbS5oZWlnaHQgPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IFwiY2FsYygxMDAlIC0gMXB4KVwiO1xyXG4gICAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0ID0gXCJjYWxjKDEwMCUgLSAxcHgpXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jb2RlRWRpdG9yLl9fZXZhbFRvQ3Vyc29yUmVhY2hlZCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLnNob3coXCJkZXNpZ25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50cy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5yZW1vdmUodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF0sIHRydWUpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLmFkZChjb21wb25lbnQpO1xyXG4gICAgICAgIC8vIFxyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnVwZGF0ZVBhcnNlcigpO1xyXG4gICAgICAgIHRoaXMuZWRpdERpYWxvZyh0aGlzLmVkaXRNb2RlID09PSB1bmRlZmluZWQgPyB0cnVlIDogdGhpcy5lZGl0TW9kZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnZhbHVlID0gY29tcG9uZW50O1xyXG5cclxuICAgICAgICAkKHRoaXMuZG9tKS5mb2N1cygpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHdoaWxlICh0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbS5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tLmZpcnN0Q2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3ZhciBwYXJzZXI9bmV3IGphc3NpanMudWkuUHJvcGVydHlFZGl0b3IuUGFyc2VyKCk7XHJcbiAgICAgICAgLy9wYXJzZXIucGFyc2UoX3RoaXMudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGRlc2lnbmVkQ29tcG9uZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXTtcclxuICAgIH1cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLnVuaW5zdGFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZHJhZ2FuZGRyb3BwZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci5pc0RyYWdFbmFibGVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci51bmluc3RhbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3I/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRQYWxldHRlPy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXI/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9pbnZpc2libGVDb21wb25lbnRzPy5kZXN0cm95KCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHJldHVybiBuZXcgQ29tcG9uZW50RGVzaWduZXIoKTtcclxuXHJcbn07XHJcblxyXG5cclxuIl19