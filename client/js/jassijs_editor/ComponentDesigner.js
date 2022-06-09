var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/util/Resizer", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs/ui/Repeater", "jassijs/ui/Button", "jassijs_editor/util/DragAndDropper", "jassijs/remote/Classes", "jassijs/ui/BoxPanel", "jassijs/ui/Databinder"], function (require, exports, Jassi_1, Panel_1, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, Resizer_1, CodeEditorInvisibleComponents_1, Repeater_1, Button_1, DragAndDropper_1, Classes_1, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentDesigner = void 0;
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
            this._componentExplorer.onclick(function (data) {
                var ob = data.data;
                _this._propertyEditor.value = ob;
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
                    if (ret.length > 0) {
                        _this._propertyEditor.value = ret[0];
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
        createComponent(type, component, top, left, newParent, beforeComponent) {
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
            _this._propertyEditor.value = varvalue;
            //include the new element
            _this.editDialog(true);
            _this._componentExplorer.update();
            //var test=_this._invisibleComponents;
            _this._updateInvisibleComponents();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50RGVzaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX2VkaXRvci9Db21wb25lbnREZXNpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBc0NBLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWtCLFNBQVEsYUFBSztRQXFCeEM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUV6QixDQUFDO1FBQ0QsYUFBYSxDQUFDLE1BQU07WUFDaEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3pDLENBQUM7UUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFLO1lBQ2hCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO1lBQzVDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSwrQkFBYyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1RCx3REFBd0Q7WUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1lBQ2hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHFDQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLG9CQUFv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LEVBQUUsQ0FBQzthQUNwQztZQUNELE1BQUEsSUFBSSxDQUFDLGVBQWUsMENBQUUsT0FBTyxFQUFFLENBQUM7WUFDaEMsTUFBQSxJQUFJLENBQUMsaUJBQWlCLDBDQUFFLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLE1BQUEsSUFBSSxDQUFDLGtCQUFrQiwwQ0FBRSxPQUFPLEVBQUUsQ0FBQztZQUNuQyxNQUFBLElBQUksQ0FBQyxvQkFBb0IsMENBQUUsT0FBTyxFQUFFLENBQUM7WUFDckMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FFSixDQUFBO0lBcG5CWSxpQkFBaUI7UUFEN0IsSUFBQSxjQUFNLEVBQUMsa0NBQWtDLENBQUM7O09BQzlCLGlCQUFpQixDQW9uQjdCO0lBcG5CWSw4Q0FBaUI7SUFxbkJ2QixLQUFLLFVBQVUsSUFBSTtRQUN0QixPQUFPLElBQUksaUJBQWlCLEVBQUUsQ0FBQztJQUVuQyxDQUFDO0lBSEQsb0JBR0M7SUFBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgVmFyaWFibGVQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1ZhcmlhYmxlUGFuZWxcIjtcclxuaW1wb3J0IHsgUHJvcGVydHlFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnRFeHBsb3JlciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db21wb25lbnRFeHBsb3JlclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnRQYWxldHRlIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvbXBvbmVudFBhbGV0dGVcIjtcclxuaW1wb3J0IHsgUmVzaXplciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci91dGlsL1Jlc2l6ZXJcIjtcclxuLy9pbXBvcnQgRHJhZ0FuZERyb3BwZXIgZnJvbSBcImphc3NpanMvdWkvaGVscGVyL0RyYWdBbmREcm9wcGVyXCI7XHJcbmltcG9ydCB7IEVycm9yUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9FcnJvclBhbmVsXCI7XHJcbmltcG9ydCB7IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzXCI7XHJcbmltcG9ydCB7IFJlcGVhdGVyIH0gZnJvbSBcImphc3NpanMvdWkvUmVwZWF0ZXJcIjtcclxuaW1wb3J0IFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgRHJhZ0FuZERyb3BwZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvdXRpbC9EcmFnQW5kRHJvcHBlclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnREZXNjcmlwdG9yIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50RGVzY3JpcHRvclwiO1xyXG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcImphc3NpanMvdWkvQ29udGFpbmVyXCI7XHJcbmltcG9ydCB7IEJveFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvQm94UGFuZWxcIjtcclxuLy9pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi91dGlsL1BhcnNlclwiO1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeHRlbnNpb25BY3Rpb24ge1xyXG4gICAgICAgIGNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZT86IHtcclxuICAgICAgICAgICAgZW5hYmxlOiBib29sZWFuLFxyXG4gICAgICAgICAgICBjb21wb25lbnREZXNpZ25lcjogQ29tcG9uZW50RGVzaWduZXJcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcG9uZW50RGVzaWduZXJDb21wb25lbnRDcmVhdGVkPzoge1xyXG4gICAgICAgICAgICAvL2NvbXBvbmVudDpDb21wb25lbnRcclxuICAgICAgICAgICAgbmV3UGFyZW50OiBDb250YWluZXJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbkAkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db21wb25lbnREZXNpZ25lclwiKVxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50RGVzaWduZXIgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBfY29kZUVkaXRvcjtcclxuICAgIGVkaXRNb2RlOiBib29sZWFuO1xyXG4gICAgdmFyaWFibGVzOiBWYXJpYWJsZVBhbmVsO1xyXG4gICAgX3Byb3BlcnR5RWRpdG9yOiBQcm9wZXJ0eUVkaXRvcjtcclxuICAgIF9lcnJvcnM6IEVycm9yUGFuZWw7XHJcbiAgICBfY29tcG9uZW50UGFsZXR0ZTogQ29tcG9uZW50UGFsZXR0ZTtcclxuICAgIF9jb21wb25lbnRFeHBsb3JlcjogQ29tcG9uZW50RXhwbG9yZXI7XHJcbiAgICBfaW52aXNpYmxlQ29tcG9uZW50czogQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHM7XHJcbiAgICBfZGVzaWduVG9vbGJhcjogUGFuZWw7XHJcbiAgICBfZGVzaWduUGxhY2Vob2xkZXI6IFBhbmVsO1xyXG4gICAgX3Jlc2l6ZXI6IFJlc2l6ZXI7XHJcbiAgICBfZHJhZ2FuZGRyb3BwZXI6IERyYWdBbmREcm9wcGVyO1xyXG4gICAgc2F2ZUJ1dHRvbjogQnV0dG9uO1xyXG4gICAgcnVuQnV0dG9uOiBCdXR0b247XHJcbiAgICBsYXNzb0J1dHRvbjogQnV0dG9uO1xyXG4gICAgdW5kb0J1dHRvbjogQnV0dG9uO1xyXG4gICAgZWRpdEJ1dHRvbjogQnV0dG9uO1xyXG4gICAgcmVtb3ZlQnV0dG9uOiBCdXR0b247XHJcbiAgICBpbmxpbmVFZGl0b3JQYW5lbDogUGFuZWw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuX2luaXREZXNpZ24oKTtcclxuICAgICAgICB0aGlzLmVkaXRNb2RlID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcbiAgICBjb25uZWN0UGFyc2VyKHBhcnNlcikge1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnBhcnNlciA9IHBhcnNlcjtcclxuICAgIH1cclxuICAgIHNldCBjb2RlRWRpdG9yKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSB0aGlzLl9jb2RlRWRpdG9yLnZhcmlhYmxlcztcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvciA9IG5ldyBQcm9wZXJ0eUVkaXRvcih2YWx1ZSwgdW5kZWZpbmVkKTtcclxuICAgICAgICAvLyAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yPW5ldyBQcm9wZXJ0eUVkaXRvcih1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMuX2Vycm9ycyA9IHRoaXMuX2NvZGVFZGl0b3IuX2Vycm9ycztcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRQYWxldHRlID0gbmV3IENvbXBvbmVudFBhbGV0dGUoKTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRQYWxldHRlLnNlcnZpY2UgPSBcIiRVSUNvbXBvbmVudFwiO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyID0gbmV3IENvbXBvbmVudEV4cGxvcmVyKHZhbHVlLCB0aGlzLl9wcm9wZXJ0eUVkaXRvcik7XHJcbiAgICAgICAgdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cyA9IG5ldyBDb2RlRWRpdG9ySW52aXNpYmxlQ29tcG9uZW50cyh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5hZGQodGhpcy5faW52aXNpYmxlQ29tcG9uZW50cyk7XHJcbiAgICAgICAgdGhpcy5faW5pdENvbXBvbmVudEV4cGxvcmVyKCk7XHJcbiAgICAgICAgdGhpcy5faW5zdGFsbFZpZXcoKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9jb2RlUGFuZWwub25ibHVyKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnVwZGF0ZVBhcnNlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJLZXlzKCk7XHJcblxyXG4gICAgfVxyXG4gICAgZ2V0IGNvZGVFZGl0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvZGVFZGl0b3I7XHJcbiAgICB9XHJcbiAgICBfaW5pdERlc2lnbigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIgPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlciA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1ydW4gbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24udG9vbHRpcCA9IFwiVGVzdCBEaWFsb2dcIjtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmVkaXREaWFsb2coIV90aGlzLmVkaXRNb2RlKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5lZGl0QnV0dG9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbi50b29sdGlwID0gXCJTYXZlKEN0cmwrUylcIjtcclxuICAgICAgICB0aGlzLnNhdmVCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1jb250ZW50LXNhdmUgbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLnNhdmVCdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLnNhdmVCdXR0b24pO1xyXG5cclxuICAgICAgICAvKiAgdGhpcy5ydW5CdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgICB0aGlzLnJ1bkJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLWNhci1oYXRjaGJhY2sgbWRpLTE4cHhcIjtcclxuICAgICAgICAgIHRoaXMucnVuQnV0dG9uLnRvb2x0aXAgPSBcIlJ1bihGNClcIjtcclxuICAgICAgICAgIHRoaXMucnVuQnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMucnVuQnV0dG9uKTsqL1xyXG5cclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy51bmRvQnV0dG9uLmljb24gPSBcIm1kaSBtZGktdW5kbyBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMudW5kb0J1dHRvbi50b29sdGlwID0gXCJVbmRvIChTdHJnK1opXCI7XHJcbiAgICAgICAgdGhpcy51bmRvQnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy51bmRvKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy51bmRvQnV0dG9uKTtcclxuXHJcbiAgICAgICAgLyogIHZhciB0ZXN0PW5ldyBCdXR0b24oKTtcclxuICAgICAgICAgdGVzdC5pY29uPVwibWRpIG1kaS1idWcgbWRpLTE4cHhcIjtcclxuICAgICAgICAgdGVzdC50b29sdGlwPVwiVGVzdFwiO1xyXG4gICAgICAgICB0ZXN0Lm9uY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgLy92YXIga2s9X3RoaXMuX2NvZGVWaWV3LmxheW91dDtcclxuICAgICAgICAgfSk7XHJcbiAgICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRlc3QpOyovXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMubGFzc29CdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5sYXNzb0J1dHRvbi5pY29uID0gXCJtZGkgbWRpLWxhc3NvIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5sYXNzb0J1dHRvbi50b29sdGlwID0gXCJTZWxlY3QgcnViYmVyYmFuZFwiO1xyXG4gICAgICAgIHRoaXMubGFzc29CdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5sYXNzb0J1dHRvbi50b2dnbGUoKTtcclxuICAgICAgICAgICAgX3RoaXMuX3Jlc2l6ZXIuc2V0TGFzc29Nb2RlKHZhbCk7XHJcbiAgICAgICAgICAgIF90aGlzLl9kcmFnYW5kZHJvcHBlci5lbmFibGVEcmFnZ2FibGUoIXZhbCk7XHJcbiAgICAgICAgICAgIC8vX3RoaXMuX2RyYWdhbmRkcm9wcGVyLmFjdGl2YXRlRHJhZ2dpbmcoIXZhbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5sYXNzb0J1dHRvbik7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQnV0dG9uLmljb24gPSBcIm1kaSBtZGktZGVsZXRlLWZvcmV2ZXItb3V0bGluZSBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQnV0dG9uLnRvb2x0aXAgPSBcIkRlbGV0ZSBzZWxlY3RlZCBDb250cm9sIChFTlRGKVwiO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVDb21wb25lbnQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLnJlbW92ZUJ1dHRvbik7XHJcbiAgICAgICAgdmFyIGJveCA9IG5ldyBCb3hQYW5lbCgpO1xyXG4gICAgICAgIGJveC5ob3Jpem9udGFsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbCA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuX2lkID0gXCJpXCIgKyB0aGlzLmlubGluZUVkaXRvclBhbmVsLl9pZDtcclxuICAgICAgICB0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlubGluZUVkaXRvclBhbmVsLl9pZCk7XHJcbiAgICAgICAgJCh0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbSkuY3NzKFwiZGlzcGxheVwiLCBcImlubGluZVwiKTtcclxuICAgICAgICAkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tV3JhcHBlcikuY3NzKFwiZGlzcGxheVwiLCBcImlubGluZVwiKTtcclxuICAgICAgICAkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tKS5hZGRDbGFzcyhcIklubGluZUVkaXRvclBhbmVsXCIpO1xyXG5cclxuICAgICAgICAvLyAgIGJveC5oZWlnaHQ9NDA7XHJcbiAgICAgICAgYm94LmFkZCh0aGlzLl9kZXNpZ25Ub29sYmFyKTtcclxuICAgICAgICBib3guYWRkKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwpO1xyXG4gICAgICAgIHRoaXMuYWRkKGJveCk7XHJcbiAgICAgICAgJCh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5kb21XcmFwcGVyKS5jc3MoXCJwb3NpdGlvblwiLCBcInJlbGF0aXZlXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgKiBtYW5hZ2Ugc2hvcnRjdXRzXHJcbiAgICovXHJcbiAgICByZWdpc3RlcktleXMoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAkKHRoaXMuX2NvZGVFZGl0b3IuX2Rlc2lnbi5kb20pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjFcIik7XHJcbiAgICAgICAgJCh0aGlzLl9jb2RlRWRpdG9yLl9kZXNpZ24uZG9tKS5rZXlkb3duKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUgJiYgZXZ0LnNoaWZ0S2V5KSB7Ly9GNFxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHRoaXNzPXRoaXMuX3RoaXMuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGVkaXRvciA9IGFjZS5lZGl0KHRoaXMuX3RoaXMuX2lkKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IDExNSkgey8vRjRcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gOTAgfHwgZXZ0LmN0cmxLZXkpIHsvL0N0cmwrWlxyXG4gICAgICAgICAgICAgICAgX3RoaXMudW5kbygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE2KSB7Ly9GNVxyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSA0Nikgey8vRGVsXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVDb21wb25lbnQoKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKFN0cmluZy5mcm9tQ2hhckNvZGUoZXZ0LndoaWNoKS50b0xvd2VyQ2FzZSgpID09PSAncycgJiYgZXZ0LmN0cmxLZXkpLyogJiYgKGV2dC53aGljaCA9PSAxOSkqLykgey8vU3RyK3NcclxuICAgICAgICAgICAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgfVxyXG4gICAgX2luc3RhbGxWaWV3KCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX3Byb3BlcnR5RWRpdG9yLCBcIlByb3BlcnRpZXNcIiwgXCJwcm9wZXJ0aWVzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLCBcIkNvbXBvbmVudHNcIiwgXCJjb21wb25lbnRzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX2NvbXBvbmVudFBhbGV0dGUsIFwiUGFsZXR0ZVwiLCBcImNvbXBvbmVudFBhbGV0dGVcIik7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5sYXlvdXQgPSAne1wic2V0dGluZ3NcIjp7XCJoYXNIZWFkZXJzXCI6dHJ1ZSxcImNvbnN0cmFpbkRyYWdUb0NvbnRhaW5lclwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJzZWxlY3Rpb25FbmFibGVkXCI6ZmFsc2UsXCJwb3BvdXRXaG9sZVN0YWNrXCI6ZmFsc2UsXCJibG9ja2VkUG9wb3V0c1Rocm93RXJyb3JcIjp0cnVlLFwiY2xvc2VQb3BvdXRzT25VbmxvYWRcIjp0cnVlLFwic2hvd1BvcG91dEljb25cIjpmYWxzZSxcInNob3dNYXhpbWlzZUljb25cIjp0cnVlLFwic2hvd0Nsb3NlSWNvblwiOnRydWUsXCJyZXNwb25zaXZlTW9kZVwiOlwib25sb2FkXCJ9LFwiZGltZW5zaW9uc1wiOntcImJvcmRlcldpZHRoXCI6NSxcIm1pbkl0ZW1IZWlnaHRcIjoxMCxcIm1pbkl0ZW1XaWR0aFwiOjEwLFwiaGVhZGVySGVpZ2h0XCI6MjAsXCJkcmFnUHJveHlXaWR0aFwiOjMwMCxcImRyYWdQcm94eUhlaWdodFwiOjIwMH0sXCJsYWJlbHNcIjp7XCJjbG9zZVwiOlwiY2xvc2VcIixcIm1heGltaXNlXCI6XCJtYXhpbWlzZVwiLFwibWluaW1pc2VcIjpcIm1pbmltaXNlXCIsXCJwb3BvdXRcIjpcIm9wZW4gaW4gbmV3IHdpbmRvd1wiLFwicG9waW5cIjpcInBvcCBpblwiLFwidGFiRHJvcGRvd25cIjpcImFkZGl0aW9uYWwgdGFic1wifSxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwiY29sdW1uXCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImNvbnRlbnRcIjpbe1widHlwZVwiOlwicm93XCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImhlaWdodFwiOjgxLjA0Mjk0MDY2MjU4OTg4LFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwid2lkdGhcIjo4MC41NzQ5MTI4OTE5ODYwNixcImhlaWdodFwiOjcxLjIzNTAzNDY1NjU4NDc2LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvZGVcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvZGUuLlwiLFwibmFtZVwiOlwiY29kZVwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfSx7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImRlc2lnblwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJuYW1lXCI6XCJkZXNpZ25cIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfSx7XCJ0eXBlXCI6XCJjb2x1bW5cIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwid2lkdGhcIjoxOS40MjUwODcxMDgwMTM5NCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6MTkuODQ0MzU3OTc2NjUzNjk3LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiUGFsZXR0ZVwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb21wb25lbnRQYWxldHRlXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJQYWxldHRlXCIsXCJuYW1lXCI6XCJjb21wb25lbnRQYWxldHRlXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6ODAuMTU1NjQyMDIzMzQ2MyxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlByb3BlcnRpZXNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwicHJvcGVydGllc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiUHJvcGVydGllc1wiLFwibmFtZVwiOlwicHJvcGVydGllc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19XX1dfSx7XCJ0eXBlXCI6XCJyb3dcIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiaGVpZ2h0XCI6MTguOTU3MDU5MzM3NDEwMTIyLFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwiaGVhZGVyXCI6e30sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJoZWlnaHRcIjoxOC45NTcwNTkzMzc0MTAxMjIsXCJ3aWR0aFwiOjc3LjcwMDM0ODQzMjA1NTc1LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiVmFyaWFibGVzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcInZhcmlhYmxlc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiVmFyaWFibGVzXCIsXCJuYW1lXCI6XCJ2YXJpYWJsZXNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX0se1widGl0bGVcIjpcIkVycm9yc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJlcnJvcnNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkVycm9yc1wiLFwibmFtZVwiOlwiZXJyb3JzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwid2lkdGhcIjoyMi4yOTk2NTE1Njc5NDQyNTYsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJDb21wb25lbnRzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvbXBvbmVudHNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvbXBvbmVudHNcIixcIm5hbWVcIjpcImNvbXBvbmVudHNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfV19XX1dLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJvcGVuUG9wb3V0c1wiOltdLFwibWF4aW1pc2VkSXRlbUlkXCI6bnVsbH0nO1xyXG4gICAgfVxyXG5cclxuICAgIF91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cy51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBfaW5pdENvbXBvbmVudEV4cGxvcmVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIub25jbGljayhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgb2IgPSBkYXRhLmRhdGE7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IG9iO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLmdldENvbXBvbmVudE5hbWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgdmFybmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChpdGVtKTtcclxuICAgICAgICAgICAgaWYgKHZhcm5hbWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcm5hbWUuc3Vic3RyaW5nKDUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFybmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZW1vdmVzIHRoZSBzZWxlY3RlZCBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlQ29tcG9uZW50KCkge1xyXG4gICAgICAgIHZhciB0b2RlbCA9IHRoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlO1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QodG9kZWwpO1xyXG4gICAgICAgIGlmICh2YXJuYW1lICE9PSBcInRoaXNcIikge1xyXG4gICAgICAgICAgICBpZiAodG9kZWwuZG9tV3JhcHBlci5fcGFyZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRvZGVsLmRvbVdyYXBwZXIuX3BhcmVudC5yZW1vdmUodG9kZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnJlbW92ZVZhcmlhYmxlSW5Db2RlKHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVWYXJpYWJsZUluRGVzaWduKHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBleGVjdXRlIHRoZSBjdXJyZW50IGNvZGVcclxuICAgICogQHBhcmFtIHtib29sZWFufSB0b0N1cnNvciAtICBpZiB0cnVlIHRoZSB2YXJpYWJsZXMgd2VyZSBpbnNwZWN0ZWQgb24gY3Vyc29yIHBvc2l0aW9uLCBcclxuICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBmYWxzZSBhdCB0aGUgZW5kIG9mIHRoZSBsYXlvdXQoKSBmdW5jdGlvbiBvciBhdCB0aGUgZW5kIG9mIHRoZSBjb2RlXHJcbiAgICAqL1xyXG4gICAgZXZhbENvZGUodG9DdXJzb3IgPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLmV2YWxDb2RlKHRvQ3Vyc29yKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogc2F2ZSB0aGUgY29kZSB0byBzZXJ2ZXJcclxuICAgICovXHJcbiAgICBzYXZlKCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3Iuc2F2ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVuZG8gYWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHVuZG8oKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci51bmRvKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldENvbXBvbmVudElEc0luRGVzaWduKGNvbXBvbmVudDogQ29tcG9uZW50LCBjb2xsZWN0OiBzdHJpbmdbXSkge1xyXG5cclxuICAgICAgICBjb2xsZWN0LnB1c2goXCIjXCIgKyBjb21wb25lbnQuX2lkKTtcclxuICAgICAgICB2YXIgY2hpbGRzID0gY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl07XHJcbiAgICAgICAgaWYgKGNoaWxkcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY2hpbGRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudElEc0luRGVzaWduKGNoaWxkc1t4XSwgY29sbGVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGRpYWxvZyBlZGl0IG1vZGVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gaWYgdHJ1ZSBhbGxvdyByZXNpemluZyBhbmQgZHJhZyBhbmQgZHJvcCBcclxuICAgICAqL1xyXG4gICAgZWRpdERpYWxvZyhlbmFibGUpIHtcclxuXHJcblxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGVuYWJsZTtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24udG9nZ2xlKCF0aGlzLmVkaXRNb2RlKTtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24uaGlkZGVuID0gIWVuYWJsZTtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLmhpZGRlbj0hZW5hYmxlO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQnV0dG9uLmhpZGRlbj0hZW5hYmxlO1xyXG4gICAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXTtcclxuICAgICAgICAvL3N3aXRjaCBkZXNpZ25tb2RlXHJcbiAgICAgICAgdmFyIGNvbXBzID0gJChjb21wb25lbnQuZG9tKS5maW5kKFwiLmpjb21wb25lbnRcIik7XHJcbiAgICAgICAgY29tcHMuYWRkQ2xhc3MoXCJqZGVzaWdubW9kZVwiKTtcclxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGNvbXBzLmxlbmd0aDsgYysrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tcHNbY10uX3RoaXNbXCJleHRlbnNpb25DYWxsZWRcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29tcHNbY10uX3RoaXNbXCJleHRlbnNpb25DYWxsZWRcIl0oe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZTogeyBlbmFibGUsIGNvbXBvbmVudERlc2lnbmVyOiB0aGlzIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy9jb21wc1tjXS5fdGhpc1tcInNldERlc2lnbk1vZGVcIl0oZW5hYmxlLHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wb25lbnRbXCJleHRlbnNpb25DYWxsZWRcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb21wb25lbnRbXCJleHRlbnNpb25DYWxsZWRcIl0oe1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50RGVzaWduZXJTZXREZXNpZ25Nb2RlOiB7IGVuYWJsZSwgY29tcG9uZW50RGVzaWduZXI6IHRoaXMgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vaWYoY29tcG9uZW50W1wic2V0RGVzaWduTW9kZVwiXSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgLy8gICAgICAgIGNvbXBvbmVudFtcInNldERlc2lnbk1vZGVcIl0oZW5hYmxlLHRoaXMpO1xyXG4gICAgICAgIC8vICAgIH1cclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpOy8vdmFyaWFibGVzIGNhbiBiZSBhZGRlZCB3aXRoIFJlcGVhdGVyLnNldERlc2lnbk1vZGVcclxuICAgICAgICBpZiAodGhpcy5fcmVzaXplciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIudW5pbnN0YWxsKCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZHJhZ2FuZGRyb3BwZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci51bmluc3RhbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbmFibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGFsbGNvbXBvbmVudHMgPSB0aGlzLnZhcmlhYmxlcy5nZXRFZGl0YWJsZUNvbXBvbmVudHMoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnR5RWRpdG9yLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50SURzSW5EZXNpZ24oY29tcG9uZW50LCByZXQpO1xyXG4gICAgICAgICAgICAgICAgYWxsY29tcG9uZW50cyA9IHJldC5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICBhbGxjb21wb25lbnRzID0gdGhpcy52YXJpYWJsZXMuZ2V0RWRpdGFibGVDb21wb25lbnRzKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5faW5zdGFsbFRpbnlFZGl0b3IoKTtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIgPSBuZXcgRHJhZ0FuZERyb3BwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplciA9IG5ldyBSZXNpemVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIuZHJhZ2FuZGRyb3BwZXIgPSB0aGlzLl9kcmFnYW5kZHJvcHBlcjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIub25lbGVtZW50c2VsZWN0ZWQgPSBmdW5jdGlvbiAoZWxlbWVudElEcywgZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBlbGVtZW50SURzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iID0gJChcIiNcIiArIGVsZW1lbnRJRHNbeF0pWzBdLl90aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYltcImVkaXRvcnNlbGVjdHRoaXNcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iID0gb2JbXCJlZGl0b3JzZWxlY3R0aGlzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKG9iKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZXQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IHJldFswXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIub25wcm9wZXJ0eWNoYW5nZWQgPSBmdW5jdGlvbiAoY29tcDogQ29tcG9uZW50LCBwcm9wOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgIT09IGNvbXApXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gY29tcDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShwcm9wLCB2YWx1ZSArIFwiXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLmluc3RhbGwoY29tcG9uZW50LCBhbGxjb21wb25lbnRzKTtcclxuICAgICAgICAgICAgYWxsY29tcG9uZW50cyA9IHRoaXMudmFyaWFibGVzLmdldEVkaXRhYmxlQ29tcG9uZW50cyhjb21wb25lbnQsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci5pbnN0YWxsKGNvbXBvbmVudCwgYWxsY29tcG9uZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLm9ucHJvcGVydHljaGFuZ2VkID0gZnVuY3Rpb24gKGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBvbGRQYXJlbnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5tb3ZlQ29tcG9uZW50KGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBvbGRQYXJlbnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9kcmFnYW5kZHJvcHBlci5vbnByb3BlcnR5YWRkZWQgPSBmdW5jdGlvbiAodHlwZSwgY29tcG9uZW50LCB0b3AsIGxlZnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVDb21wb25lbnQodHlwZSwgY29tcG9uZW50LCB0b3AsIGxlZnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLmlzRHJhZ0VuYWJsZWQgPSBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuX3Jlc2l6ZXIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX3Jlc2l6ZXIuY29tcG9uZW50VW5kZXJDdXJzb3IgIT09IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvKiAgJChcIi5ob2hvMlwiKS5zZWxlY3RhYmxlKHt9KTtcclxuICAgICAgICAgICQoXCIuaG9obzJcIikuc2VsZWN0YWJsZShcImRpc2FibGVcIik7Ki9cclxuICAgICAgICAvKiAgJChcIi5IVE1MUGFuZWxcIikuc2VsZWN0YWJsZSh7fSk7XHJcbiAgICAgICAgICAkKFwiLkhUTUxQYW5lbFwiKS5zZWxlY3RhYmxlKFwiZGlzYWJsZVwiKTtcclxuICAgICAgICAgICQoXCIuSFRNTFBhbmVsXCIpLmRyYWdnYWJsZSh7fSk7XHJcbiAgICAgICAgICAkKFwiLkhUTUxQYW5lbFwiKS5kcmFnZ2FibGUoXCJkaXNhYmxlXCIpOyovXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtb3ZlIGEgY29tcG9uZW50XHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRvIG1vdmVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgLSB0aGUgdG9wIGFic29sdXRlIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVmdCAtIHRoZSBsZWZ0IGFic29sdXRlIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29udGFpbmVyfSBuZXdQYXJlbnQgLSB0aGUgbmV3IHBhcmVudCBjb250YWluZXIgd2hlcmUgdGhlIGNvbXBvbmVudCBtb3ZlIHRvXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBiZWZvcmVDb21wb25lbnQgLSBpbnNlcnQgdGhlIGNvbXBvbmVudCBiZWZvcmUgYmVmb3JlQ29tcG9uZW50XHJcbiAgICAgKiovXHJcbiAgICBtb3ZlQ29tcG9uZW50KGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBvbGRQYXJlbnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAvKmlmKGJlZm9yZUNvbXBvbmVudCE9PXVuZGVmaW5lZCYmYmVmb3JlQ29tcG9uZW50LmRlc2lnbkR1bW15Rm9yIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgYmVmb3JlQ29tcG9uZW50PXVuZGVmaW5lZDtcclxuICAgICAgICB9Ki9cclxuICAgICAgICB2YXIgb2xkTmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChvbGRQYXJlbnQpO1xyXG4gICAgICAgIHZhciBuZXdOYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG5ld1BhcmVudCk7XHJcbiAgICAgICAgdmFyIGNvbXBOYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNvbXBvbmVudCk7XHJcbiAgICAgICAgaWYgKHRvcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInhcIiwgdG9wICsgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwieFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxlZnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJ5XCIsIGxlZnQgKyBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJ5XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9sZFBhcmVudCAhPT0gbmV3UGFyZW50IHx8IGJlZm9yZUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkIHx8IHRvcCA9PT0gdW5kZWZpbmVkKSB7Ly90b3A9dW5kZWZpbmVkIC0+b24gcmVsYXRpdmUgcG9zaXRpb24gYXQgdGhlIGVuZCBjYWxsIHRoZSBibG9ja1xyXG4gICAgICAgICAgICAvL2dldCBQb3NpdGlvblxyXG4gICAgICAgICAgICB2YXIgb2xkVmFsPV90aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcImFkZFwiLCBjb21wTmFtZSwgb2xkTmFtZSxmYWxzZSk7XHJcbiAgICAgICAgICAgIHZhciBiZWZvcmU7XHJcbiAgICAgICAgICAgIGlmIChiZWZvcmVDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiBiZWZvcmVDb21wb25lbnQudHlwZSAhPT0gXCJhdEVuZFwiKSB7Ly9kZXNpZ25kdW1teSBhdEVuZFxyXG4gICAgICAgICAgICAgICAgdmFyIG9uID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGJlZm9yZSA9IHsgdmFyaWFibGVuYW1lOiBwYXIsIHByb3BlcnR5OiBcImFkZFwiLCB2YWx1ZTogb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgLypjb21wTmFtZSovb2xkVmFsLCBmYWxzZSwgbmV3TmFtZSwgYmVmb3JlKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIGlmKG5ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGg+MSl7Ly9jb3JyZWN0IGR1bW15XHJcbiAgICAgICAgICAgICB2YXIgZHVtbXk9XHRuZXdQYXJlbnQuX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0yXTtcclxuICAgICAgICAgICAgIGlmKGR1bW15LmRlc2lnbkR1bW15Rm9yIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAvL3ZhciB0bXA9bmV3UGFyZW50Ll9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAgbmV3UGFyZW50LnJlbW92ZShkdW1teSk7Ly8uX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0xXT1uZXdQYXJlbnQuX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0yXTtcclxuICAgICAgICAgICAgICAgICBuZXdQYXJlbnQuYWRkKGR1bW15KTsvLy5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTFdPXRtcDtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSovXHJcbiAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlO1xyXG4gICAgICAgIF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci52YWx1ZSA9IF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgbmV3IGNvbXBvbmVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0aGUgdHlwZSBvZiB0aGUgbmV3IGNvbXBvbmVudFxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0aGVtc2VsZlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcCAtIHRoZSB0b3AgYWJzb2x1dGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0gdGhlIGxlZnQgYWJzb2x1dGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db250YWluZXJ9IG5ld1BhcmVudCAtIHRoZSBuZXcgcGFyZW50IGNvbnRhaW5lciB3aGVyZSB0aGUgY29tcG9uZW50IGlzIHBsYWNlZFxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gYmVmb3JlQ29tcG9uZW50IC0gaW5zZXJ0IHRoZSBuZXcgY29tcG9uZW50IGJlZm9yZSBiZWZvcmVDb21wb25lbnRcclxuICAgICAqKi9cclxuICAgIGNyZWF0ZUNvbXBvbmVudCh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpOiBDb21wb25lbnQge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLyppZihiZWZvcmVDb21wb25lbnQhPT11bmRlZmluZWQmJmJlZm9yZUNvbXBvbmVudC5kZXNpZ25EdW1teUZvciYmYmVmb3JlQ29tcG9uZW50LnR5cGU9PT1cImF0RW5kXCIpe1xyXG4gICAgICAgICAgICBiZWZvcmVDb21wb25lbnQ9dW5kZWZpbmVkO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHZhciBmaWxlID0gdHlwZS5yZXBsYWNlQWxsKFwiLlwiLCBcIi9cIik7XHJcbiAgICAgICAgdmFyIHN0eXBlID0gZmlsZS5zcGxpdChcIi9cIilbZmlsZS5zcGxpdChcIi9cIikubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLmFkZEltcG9ydElmTmVlZGVkKHN0eXBlLCBmaWxlKTtcclxuICAgICAgICB2YXIgcmVwZWF0ZXIgPSBfdGhpcy5faGFzUmVwZWF0aW5nQ29udGFpbmVyKG5ld1BhcmVudCk7XHJcbiAgICAgICAgdmFyIHNjb3BlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmIChyZXBlYXRlciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciByZXBlYXRlcm5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QocmVwZWF0ZXIpO1xyXG4gICAgICAgICAgICB2YXIgdGVzdCA9IF90aGlzLl9wcm9wZXJ0eUVkaXRvci5wYXJzZXIuZ2V0UHJvcGVydHlWYWx1ZShyZXBlYXRlcm5hbWUsIFwiY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50XCIpO1xyXG4gICAgICAgICAgICBzY29wZSA9IHsgdmFyaWFibGVuYW1lOiByZXBlYXRlcm5hbWUsIG1ldGhvZG5hbWU6IFwiY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50XCIgfTtcclxuICAgICAgICAgICAgaWYgKHRlc3QgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhcmRhdGFiaW5kZXIgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IuZ2V0TmV4dFZhcmlhYmxlTmFtZUZvclR5cGUoXCJqYXNzaWpzLnVpLkRhdGFiaW5kZXJcIik7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJjcmVhdGVSZXBlYXRpbmdDb21wb25lbnRcIiwgXCJmdW5jdGlvbihtZTpNZSl7XFxuXFx0XFxufVwiLCB0cnVlLCByZXBlYXRlcm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgcmVwZWF0ZXIuY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50KGZ1bmN0aW9uIChtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZXNpZ25Nb2RlICE9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgLy9fdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUodmFyZGF0YWJpbmRlcixkYXRhYmluZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLyp2YXIgZGI9bmV3IGphc3NpanMudWkuRGF0YWJpbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVwZWF0ZXIudmFsdWUhPT11bmRlZmluZWQmJnJlcGVhdGVyLnZhbHVlLmxlbmd0aD4wKVxyXG4gICAgICAgICAgICAgICAgICAgIGRiLnZhbHVlPXJlcGVhdGVyLnZhbHVlWzBdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFyaWFibGVzLmFkZCh2YXJkYXRhYmluZGVyLGRiKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpOyovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHZhcnZhbHVlID0gbmV3IChjbGFzc2VzLmdldENsYXNzKHR5cGUpKTtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IF90aGlzLmNyZWF0ZVZhcmlhYmxlKHR5cGUsIHNjb3BlLCB2YXJ2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnR5RWRpdG9yLmNvZGVFZGl0b3IgIT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG5ld05hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QobmV3UGFyZW50KTtcclxuICAgICAgICAgICAgdmFyIGJlZm9yZTtcclxuICAgICAgICAgICAgaWYgKGJlZm9yZUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkICYmIGJlZm9yZUNvbXBvbmVudC50eXBlICE9PSBcImF0RW5kXCIpIHsvL0Rlc2lnbmR1bW15IGF0RW5kXHJcbiAgICAgICAgICAgICAgICAvL2lmKGJlZm9yZUNvbXBvbmVudC50eXBlPT09XCJiZWZvcmVDb21wb25lbnRcIilcclxuICAgICAgICAgICAgICAgIC8vICAgYmVmb3JlQ29tcG9uZW50PWJlZm9yZUNvbXBvbmVudC5kZXNpZ25EdW1teUZvcjtcclxuICAgICAgICAgICAgICAgIHZhciBvbiA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChiZWZvcmVDb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhciA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChiZWZvcmVDb21wb25lbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBiZWZvcmUgPSB7IHZhcmlhYmxlbmFtZTogcGFyLCBwcm9wZXJ0eTogXCJhZGRcIiwgdmFsdWU6IG9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIHZhcm5hbWUsIGZhbHNlLCBuZXdOYW1lLCBiZWZvcmUsIHNjb3BlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChiZWZvcmVDb21wb25lbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBuZXdQYXJlbnQuYWRkQmVmb3JlKHZhcnZhbHVlLCBiZWZvcmVDb21wb25lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5ld1BhcmVudC5hZGQodmFydmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBpZihuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoPjEpey8vY29ycmVjdCBkdW1teVxyXG4gICAgICAgICAgICAgaWYobmV3UGFyZW50Ll9kZXNpZ25EdW1teSl7XHJcbiAgICAgICAgICAgICAgICAgLy92YXIgdG1wPW5ld1BhcmVudC5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICAgICAgIG5ld1BhcmVudC5kb20ucmVtb3ZlQ2hpbGQobmV3UGFyZW50Ll9kZXNpZ25EdW1teS5kb21XcmFwcGVyKVxyXG4gICAgICAgICAgICAgICAgIG5ld1BhcmVudC5kb20uYXBwZW5kKG5ld1BhcmVudC5fZGVzaWduRHVtbXkuZG9tV3JhcHBlcilcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSovXHJcbiAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcblxyXG4gICAgICAgIC8vc2V0IGluaXRpYWwgcHJvcGVydGllcyBmb3IgdGhlIG5ldyBjb21wb25lbnRcclxuICAgICAgICBpZiAoY29tcG9uZW50LmNyZWF0ZUZyb21QYXJhbSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wb25lbnQuY3JlYXRlRnJvbVBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gY29tcG9uZW50LmNyZWF0ZUZyb21QYXJhbVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCA9ICdcIicgKyB2YWwgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKGtleSwgdmFsLCB0cnVlLCB2YXJuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkLmV4dGVuZCh2YXJ2YWx1ZSwgY29tcG9uZW50LmNyZWF0ZUZyb21QYXJhbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0b3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJ4XCIsIHRvcCArIFwiXCIsIHRydWUsIHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB2YXJ2YWx1ZS54ID0gdG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGVmdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInlcIiwgbGVmdCArIFwiXCIsIHRydWUsIHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB2YXJ2YWx1ZS55ID0gbGVmdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbm90aWZ5IGNvbXBvbmVudGRlc2NyaXB0b3IgXHJcbiAgICAgICAgdmFyIGFjID0gdmFydmFsdWUuZXh0ZW5zaW9uQ2FsbGVkO1xyXG4gICAgICAgIGlmIChhYyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhcnZhbHVlLmV4dGVuc2lvbkNhbGxlZCh7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnREZXNpZ25lckNvbXBvbmVudENyZWF0ZWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQYXJlbnQ6IG5ld1BhcmVudFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSB2YXJ2YWx1ZTtcclxuICAgICAgICAvL2luY2x1ZGUgdGhlIG5ldyBlbGVtZW50XHJcbiAgICAgICAgX3RoaXMuZWRpdERpYWxvZyh0cnVlKTtcclxuICAgICAgICBfdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudXBkYXRlKCk7XHJcbiAgICAgICAgLy92YXIgdGVzdD1fdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cztcclxuICAgICAgICBfdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHJldHVybiB2YXJ2YWx1ZTtcclxuICAgIH1cclxuICAgIGNyZWF0ZVZhcmlhYmxlKHR5cGUsIHNjb3BlLCB2YXJ2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eUVkaXRvci5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHRoaXMuX3Byb3BlcnR5RWRpdG9yLmFkZFZhcmlhYmxlSW5Db2RlKHR5cGUsIHNjb3BlKTtcclxuXHJcbiAgICAgICBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwibWUuXCIpJiZ0aGlzLl9jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcIm1lXCIpIT09dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMuX2NvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwibWVcIik7XHJcbiAgICAgICAgICAgIG1lW3Zhcm5hbWUuc3Vic3RyaW5nKDMpXSA9IHZhcnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwidGhpcy5cIikpIHtcclxuICAgICAgICAgICAgdmFyIHRoID0gdGhpcy5fY29kZUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUoXCJ0aGlzXCIpO1xyXG4gICAgICAgICAgICB0aFt2YXJuYW1lLnN1YnN0cmluZyg1KV0gPSB2YXJ2YWx1ZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUodmFybmFtZSwgdmFydmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB2YXJuYW1lO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGVyZSBhIHBhcmVudCB0aGF0IGFjdHMgYSByZXBlYXRpbmcgY29udGFpbmVyP1xyXG4gICAgICoqL1xyXG4gICAgX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoY29tcG9uZW50ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNvbXBvbmVudCkgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgUmVwZWF0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihjb21wb25lbnQuX3BhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsVmFyaWFibGVzKHJvb3Q6Q29tcG9uZW50LGNvbXBvbmVudDpDb21wb25lbnQsY2FjaGU6e1tjb21wb25lbnRpZDogc3RyaW5nXToge2xpbmU6bnVtYmVyLGNvbHVtbjpudW1iZXJ9fSl7XHJcbiAgICAgICAgaWYoY2FjaGVbY29tcG9uZW50Ll9pZF09PT11bmRlZmluZWQmJmNvbXBvbmVudFtcIl9fc3RhY2tcIl0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB2YXIgbGluZXM9Y29tcG9uZW50W1wiX19zdGFja1wiXT8uc3BsaXQoXCJcXG5cIik7XHJcbiAgICAgICAgICAgIGZvcih2YXIgeD0wO3g8bGluZXMubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2xpbmU6c3RyaW5nPWxpbmVzW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYoc2xpbmUuaW5kZXhPZihcIiR0ZW1wLmpzXCIpPjApe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcGw9c2xpbmUuc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbnRyPXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlW2NvbXBvbmVudC5faWRdPXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZTpOdW1iZXIoc3BsW3NwbC5sZW5ndGgtMl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46TnVtYmVyKHNwbFtzcGwubGVuZ3RoLTFdLnJlcGxhY2UoXCIpXCIsXCJcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICBpZihjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgeD0wO3g8Y29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl0ubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxWYXJpYWJsZXMocm9vdCxjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXVt4XSxjYWNoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGNvbXBvbmVudD09PXJvb3Qpe1xyXG4gICAgICAgICAgICAgICAgLy9mZXJ0aWdcclxuICAgICAgICAgICAgICAgIHZhciBoaD0wOyAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge2phc3NpanMudWkuQ29tcG9uZW50fSAtIHRoZSBkZXNpZ25lZCBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgc2V0IGRlc2lnbmVkQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMuZmlsbFZhcmlhYmxlcyhjb21wb25lbnQsY29tcG9uZW50LHt9KTtcclxuICAgICAgICB2YXIgY29tID0gY29tcG9uZW50O1xyXG4gICAgICAgIGlmIChjb21bXCJpc0Fic29sdXRlXCJdICE9PSB0cnVlICYmIGNvbS53aWR0aCA9PT0gXCIwXCIgJiYgY29tLmhlaWdodCA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50LndpZHRoID0gXCJjYWxjKDEwMCUgLSAxcHgpXCI7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSBcImNhbGMoMTAwJSAtIDFweClcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVFZGl0b3IuX19ldmFsVG9DdXJzb3JSZWFjaGVkICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uc2hvdyhcImRlc2lnblwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLnJlbW92ZSh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuYWRkKGNvbXBvbmVudCk7XHJcbiAgICAgICAgLy8gXHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0RGlhbG9nKHRoaXMuZWRpdE1vZGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiB0aGlzLmVkaXRNb2RlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudmFsdWUgPSBjb21wb25lbnQ7XHJcblxyXG4gICAgICAgICQodGhpcy5kb20pLmZvY3VzKCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5kb20uZmlyc3RDaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdmFyIHBhcnNlcj1uZXcgamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvci5QYXJzZXIoKTtcclxuICAgICAgICAvL3BhcnNlci5wYXJzZShfdGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBnZXQgZGVzaWduZWRDb21wb25lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdO1xyXG4gICAgfVxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmVzaXplciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIudW5pbnN0YWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9kcmFnYW5kZHJvcHBlciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLmlzRHJhZ0VuYWJsZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLnVuaW5zdGFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvcj8uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGU/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlcj8uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHM/LmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgcmV0dXJuIG5ldyBDb21wb25lbnREZXNpZ25lcigpO1xyXG5cclxufTtcclxuXHJcblxyXG4iXX0=