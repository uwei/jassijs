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
                console.log("uninstall");
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
                console.log("onselect");
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
                    console.log("prop change " + comp._id);
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
                _this._propertyEditor.removePropertyInCode("add", compName, oldName);
                var before;
                if (beforeComponent !== undefined && beforeComponent.type !== "atEnd") { //designdummy atEnd
                    var on = _this._codeEditor.getVariableFromObject(beforeComponent);
                    var par = _this._codeEditor.getVariableFromObject(beforeComponent._parent);
                    before = { variablename: par, property: "add", value: on };
                }
                _this._propertyEditor.setPropertyInCode("add", compName, false, newName, before);
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
            if (varname.startsWith("me.")) {
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
        /**
         * @member {jassijs.ui.Component} - the designed component
         */
        set designedComponent(component) {
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
        Jassi_1.$Class("jassijs_editor.ComponentDesigner"),
        __metadata("design:paramtypes", [])
    ], ComponentDesigner);
    exports.ComponentDesigner = ComponentDesigner;
    async function test() {
        return new ComponentDesigner();
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50RGVzaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX2VkaXRvci9Db21wb25lbnREZXNpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBc0NBLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWtCLFNBQVEsYUFBSztRQXFCeEM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUV6QixDQUFDO1FBQ0QsYUFBYSxDQUFDLE1BQU07WUFDaEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3pDLENBQUM7UUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFLO1lBQ2hCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO1lBQzVDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSwrQkFBYyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1RCx3REFBd0Q7WUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1lBQ2hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHFDQUFpQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLG9CQUFv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QkFBb0IsMENBQUUsT0FBTyxFQUFFLENBQUM7WUFDckMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FFSixDQUFBO0lBdmxCWSxpQkFBaUI7UUFEN0IsY0FBTSxDQUFDLGtDQUFrQyxDQUFDOztPQUM5QixpQkFBaUIsQ0F1bEI3QjtJQXZsQlksOENBQWlCO0lBd2xCdkIsS0FBSyxVQUFVLElBQUk7UUFDdEIsT0FBTyxJQUFJLGlCQUFpQixFQUFFLENBQUM7SUFFbkMsQ0FBQztJQUhELG9CQUdDO0lBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9WYXJpYWJsZVBhbmVsXCI7XHJcbmltcG9ydCB7IFByb3BlcnR5RWRpdG9yIH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50RXhwbG9yZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50RXhwbG9yZXJcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50UGFsZXR0ZSB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db21wb25lbnRQYWxldHRlXCI7XHJcbmltcG9ydCB7IFJlc2l6ZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvdXRpbC9SZXNpemVyXCI7XHJcbi8vaW1wb3J0IERyYWdBbmREcm9wcGVyIGZyb20gXCJqYXNzaWpzL3VpL2hlbHBlci9EcmFnQW5kRHJvcHBlclwiO1xyXG5pbXBvcnQgeyBFcnJvclBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvRXJyb3JQYW5lbFwiO1xyXG5pbXBvcnQgeyBDb2RlRWRpdG9ySW52aXNpYmxlQ29tcG9uZW50cyB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db2RlRWRpdG9ySW52aXNpYmxlQ29tcG9uZW50c1wiO1xyXG5pbXBvcnQgeyBSZXBlYXRlciB9IGZyb20gXCJqYXNzaWpzL3VpL1JlcGVhdGVyXCI7XHJcbmltcG9ydCBcImphc3NpanMvdWkvRGF0YWJpbmRlclwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiamFzc2lqcy91aS9CdXR0b25cIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IERyYWdBbmREcm9wcGVyIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvRHJhZ0FuZERyb3BwZXJcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50RGVzY3JpcHRvciB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudERlc2NyaXB0b3JcIjtcclxuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XHJcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbnRhaW5lclwiO1xyXG5pbXBvcnQgeyBCb3hQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL0JveFBhbmVsXCI7XHJcbi8vaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vdXRpbC9QYXJzZXJcIjtcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRXh0ZW5zaW9uQWN0aW9uIHtcclxuICAgICAgICBjb21wb25lbnREZXNpZ25lclNldERlc2lnbk1vZGU/OiB7XHJcbiAgICAgICAgICAgIGVuYWJsZTogYm9vbGVhbixcclxuICAgICAgICAgICAgY29tcG9uZW50RGVzaWduZXI6IENvbXBvbmVudERlc2lnbmVyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBvbmVudERlc2lnbmVyQ29tcG9uZW50Q3JlYXRlZD86IHtcclxuICAgICAgICAgICAgLy9jb21wb25lbnQ6Q29tcG9uZW50XHJcbiAgICAgICAgICAgIG5ld1BhcmVudDogQ29udGFpbmVyXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5AJENsYXNzKFwiamFzc2lqc19lZGl0b3IuQ29tcG9uZW50RGVzaWduZXJcIilcclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudERlc2lnbmVyIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgX2NvZGVFZGl0b3I7XHJcbiAgICBlZGl0TW9kZTogYm9vbGVhbjtcclxuICAgIHZhcmlhYmxlczogVmFyaWFibGVQYW5lbDtcclxuICAgIF9wcm9wZXJ0eUVkaXRvcjogUHJvcGVydHlFZGl0b3I7XHJcbiAgICBfZXJyb3JzOiBFcnJvclBhbmVsO1xyXG4gICAgX2NvbXBvbmVudFBhbGV0dGU6IENvbXBvbmVudFBhbGV0dGU7XHJcbiAgICBfY29tcG9uZW50RXhwbG9yZXI6IENvbXBvbmVudEV4cGxvcmVyO1xyXG4gICAgX2ludmlzaWJsZUNvbXBvbmVudHM6IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzO1xyXG4gICAgX2Rlc2lnblRvb2xiYXI6IFBhbmVsO1xyXG4gICAgX2Rlc2lnblBsYWNlaG9sZGVyOiBQYW5lbDtcclxuICAgIF9yZXNpemVyOiBSZXNpemVyO1xyXG4gICAgX2RyYWdhbmRkcm9wcGVyOiBEcmFnQW5kRHJvcHBlcjtcclxuICAgIHNhdmVCdXR0b246IEJ1dHRvbjtcclxuICAgIHJ1bkJ1dHRvbjogQnV0dG9uO1xyXG4gICAgbGFzc29CdXR0b246IEJ1dHRvbjtcclxuICAgIHVuZG9CdXR0b246IEJ1dHRvbjtcclxuICAgIGVkaXRCdXR0b246IEJ1dHRvbjtcclxuICAgIHJlbW92ZUJ1dHRvbjogQnV0dG9uO1xyXG4gICAgaW5saW5lRWRpdG9yUGFuZWw6IFBhbmVsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvciA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9pbml0RGVzaWduKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IHRydWU7XHJcblxyXG4gICAgfVxyXG4gICAgY29ubmVjdFBhcnNlcihwYXJzZXIpIHtcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5wYXJzZXIgPSBwYXJzZXI7XHJcbiAgICB9XHJcbiAgICBzZXQgY29kZUVkaXRvcih2YWx1ZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gdGhpcy5fY29kZUVkaXRvci52YXJpYWJsZXM7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IgPSBuZXcgUHJvcGVydHlFZGl0b3IodmFsdWUsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgLy8gICB0aGlzLl9wcm9wZXJ0eUVkaXRvcj1uZXcgUHJvcGVydHlFZGl0b3IodW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLl9lcnJvcnMgPSB0aGlzLl9jb2RlRWRpdG9yLl9lcnJvcnM7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50UGFsZXR0ZSA9IG5ldyBDb21wb25lbnRQYWxldHRlKCk7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50UGFsZXR0ZS5zZXJ2aWNlID0gXCIkVUlDb21wb25lbnRcIjtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3JlciA9IG5ldyBDb21wb25lbnRFeHBsb3Jlcih2YWx1ZSwgdGhpcy5fcHJvcGVydHlFZGl0b3IpO1xyXG4gICAgICAgIHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHMgPSBuZXcgQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHModmFsdWUpO1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHMpO1xyXG4gICAgICAgIHRoaXMuX2luaXRDb21wb25lbnRFeHBsb3JlcigpO1xyXG4gICAgICAgIHRoaXMuX2luc3RhbGxWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fY29kZVBhbmVsLm9uYmx1cihmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyS2V5cygpO1xyXG5cclxuICAgIH1cclxuICAgIGdldCBjb2RlRWRpdG9yKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2RlRWRpdG9yO1xyXG4gICAgfVxyXG4gICAgX2luaXREZXNpZ24oKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyID0gbmV3IFBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIgPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLmljb24gPSBcIm1kaSBtZGktcnVuIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLnRvb2x0aXAgPSBcIlRlc3QgRGlhbG9nXCI7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5lZGl0RGlhbG9nKCFfdGhpcy5lZGl0TW9kZSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMuZWRpdEJ1dHRvbik7XHJcblxyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLnNhdmVCdXR0b24udG9vbHRpcCA9IFwiU2F2ZShDdHJsK1MpXCI7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uLmljb24gPSBcIm1kaSBtZGktY29udGVudC1zYXZlIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5zYXZlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgLyogIHRoaXMucnVuQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgdGhpcy5ydW5CdXR0b24uaWNvbiA9IFwibWRpIG1kaS1jYXItaGF0Y2hiYWNrIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICB0aGlzLnJ1bkJ1dHRvbi50b29sdGlwID0gXCJSdW4oRjQpXCI7XHJcbiAgICAgICAgICB0aGlzLnJ1bkJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZSgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0aGlzLnJ1bkJ1dHRvbik7Ki9cclxuXHJcbiAgICAgICAgdGhpcy51bmRvQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMudW5kb0J1dHRvbi5pY29uID0gXCJtZGkgbWRpLXVuZG8gbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLnVuZG9CdXR0b24udG9vbHRpcCA9IFwiVW5kbyAoU3RyZytaKVwiO1xyXG4gICAgICAgIHRoaXMudW5kb0J1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMudW5kbygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMudW5kb0J1dHRvbik7XHJcblxyXG4gICAgICAgIC8qICB2YXIgdGVzdD1uZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgIHRlc3QuaWNvbj1cIm1kaSBtZGktYnVnIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgIHRlc3QudG9vbHRpcD1cIlRlc3RcIjtcclxuICAgICAgICAgdGVzdC5vbmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGtrPV90aGlzLl9jb2RlVmlldy5sYXlvdXQ7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgICAgICB0aGlzLl9kZXNpZ25Ub29sYmFyLmFkZCh0ZXN0KTsqL1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMubGFzc29CdXR0b24uaWNvbiA9IFwibWRpIG1kaS1sYXNzbyBtZGktMThweFwiO1xyXG4gICAgICAgIHRoaXMubGFzc29CdXR0b24udG9vbHRpcCA9IFwiU2VsZWN0IHJ1YmJlcmJhbmRcIjtcclxuICAgICAgICB0aGlzLmxhc3NvQnV0dG9uLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMubGFzc29CdXR0b24udG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIF90aGlzLl9yZXNpemVyLnNldExhc3NvTW9kZSh2YWwpO1xyXG4gICAgICAgICAgICBfdGhpcy5fZHJhZ2FuZGRyb3BwZXIuZW5hYmxlRHJhZ2dhYmxlKCF2YWwpO1xyXG4gICAgICAgICAgICAvL190aGlzLl9kcmFnYW5kZHJvcHBlci5hY3RpdmF0ZURyYWdnaW5nKCF2YWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblRvb2xiYXIuYWRkKHRoaXMubGFzc29CdXR0b24pO1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZUJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLWRlbGV0ZS1mb3JldmVyLW91dGxpbmUgbWRpLTE4cHhcIjtcclxuICAgICAgICB0aGlzLnJlbW92ZUJ1dHRvbi50b29sdGlwID0gXCJEZWxldGUgc2VsZWN0ZWQgQ29udHJvbCAoRU5URilcIjtcclxuICAgICAgICB0aGlzLnJlbW92ZUJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMucmVtb3ZlQ29tcG9uZW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduVG9vbGJhci5hZGQodGhpcy5yZW1vdmVCdXR0b24pO1xyXG4gICAgICAgIHZhciBib3ggPSBuZXcgQm94UGFuZWwoKTtcclxuICAgICAgICBib3guaG9yaXpvbnRhbCA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuaW5saW5lRWRpdG9yUGFuZWwgPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLmlubGluZUVkaXRvclBhbmVsLl9pZCA9IFwiaVwiICsgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5faWQ7XHJcbiAgICAgICAgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5kb20uc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5faWQpO1xyXG4gICAgICAgICQodGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5kb20pLmNzcyhcImRpc3BsYXlcIiwgXCJpbmxpbmVcIik7XHJcbiAgICAgICAgJCh0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbVdyYXBwZXIpLmNzcyhcImRpc3BsYXlcIiwgXCJpbmxpbmVcIik7XHJcbiAgICAgICAgJCh0aGlzLmlubGluZUVkaXRvclBhbmVsLmRvbSkuYWRkQ2xhc3MoXCJJbmxpbmVFZGl0b3JQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgLy8gICBib3guaGVpZ2h0PTQwO1xyXG4gICAgICAgIGJveC5hZGQodGhpcy5fZGVzaWduVG9vbGJhcik7XHJcbiAgICAgICAgYm94LmFkZCh0aGlzLmlubGluZUVkaXRvclBhbmVsKTtcclxuICAgICAgICB0aGlzLmFkZChib3gpO1xyXG4gICAgICAgICQodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuZG9tV3JhcHBlcikuY3NzKFwicG9zaXRpb25cIiwgXCJyZWxhdGl2ZVwiKTtcclxuICAgICAgICB0aGlzLmFkZCh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlcik7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICogbWFuYWdlIHNob3J0Y3V0c1xyXG4gICAqL1xyXG4gICAgcmVnaXN0ZXJLZXlzKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGlzLl9jb2RlRWRpdG9yLl9kZXNpZ24uZG9tKS5hdHRyKFwidGFiaW5kZXhcIiwgXCIxXCIpO1xyXG4gICAgICAgICQodGhpcy5fY29kZUVkaXRvci5fZGVzaWduLmRvbSkua2V5ZG93bihmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE1ICYmIGV2dC5zaGlmdEtleSkgey8vRjRcclxuICAgICAgICAgICAgICAgIC8vIHZhciB0aGlzcz10aGlzLl90aGlzLl9pZDtcclxuICAgICAgICAgICAgICAgIC8vIHZhciBlZGl0b3IgPSBhY2UuZWRpdCh0aGlzLl90aGlzLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUpIHsvL0Y0XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDkwIHx8IGV2dC5jdHJsS2V5KSB7Ly9DdHJsK1pcclxuICAgICAgICAgICAgICAgIF90aGlzLnVuZG8oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDExNikgey8vRjVcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gNDYpIHsvL0RlbFxyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlQ29tcG9uZW50KCk7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChTdHJpbmcuZnJvbUNoYXJDb2RlKGV2dC53aGljaCkudG9Mb3dlckNhc2UoKSA9PT0gJ3MnICYmIGV2dC5jdHJsS2V5KS8qICYmIChldnQud2hpY2ggPT0gMTkpKi8pIHsvL1N0citzXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUludmlzaWJsZUNvbXBvbmVudHMoKTtcclxuICAgIH1cclxuICAgIF9pbnN0YWxsVmlldygpIHtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9wcm9wZXJ0eUVkaXRvciwgXCJQcm9wZXJ0aWVzXCIsIFwicHJvcGVydGllc1wiKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9jb21wb25lbnRFeHBsb3JlciwgXCJDb21wb25lbnRzXCIsIFwiY29tcG9uZW50c1wiKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9jb21wb25lbnRQYWxldHRlLCBcIlBhbGV0dGVcIiwgXCJjb21wb25lbnRQYWxldHRlXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4ubGF5b3V0ID0gJ3tcInNldHRpbmdzXCI6e1wiaGFzSGVhZGVyc1wiOnRydWUsXCJjb25zdHJhaW5EcmFnVG9Db250YWluZXJcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwic2VsZWN0aW9uRW5hYmxlZFwiOmZhbHNlLFwicG9wb3V0V2hvbGVTdGFja1wiOmZhbHNlLFwiYmxvY2tlZFBvcG91dHNUaHJvd0Vycm9yXCI6dHJ1ZSxcImNsb3NlUG9wb3V0c09uVW5sb2FkXCI6dHJ1ZSxcInNob3dQb3BvdXRJY29uXCI6ZmFsc2UsXCJzaG93TWF4aW1pc2VJY29uXCI6dHJ1ZSxcInNob3dDbG9zZUljb25cIjp0cnVlLFwicmVzcG9uc2l2ZU1vZGVcIjpcIm9ubG9hZFwifSxcImRpbWVuc2lvbnNcIjp7XCJib3JkZXJXaWR0aFwiOjUsXCJtaW5JdGVtSGVpZ2h0XCI6MTAsXCJtaW5JdGVtV2lkdGhcIjoxMCxcImhlYWRlckhlaWdodFwiOjIwLFwiZHJhZ1Byb3h5V2lkdGhcIjozMDAsXCJkcmFnUHJveHlIZWlnaHRcIjoyMDB9LFwibGFiZWxzXCI6e1wiY2xvc2VcIjpcImNsb3NlXCIsXCJtYXhpbWlzZVwiOlwibWF4aW1pc2VcIixcIm1pbmltaXNlXCI6XCJtaW5pbWlzZVwiLFwicG9wb3V0XCI6XCJvcGVuIGluIG5ldyB3aW5kb3dcIixcInBvcGluXCI6XCJwb3AgaW5cIixcInRhYkRyb3Bkb3duXCI6XCJhZGRpdGlvbmFsIHRhYnNcIn0sXCJjb250ZW50XCI6W3tcInR5cGVcIjpcImNvbHVtblwiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInJvd1wiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJoZWlnaHRcIjo4MS4wNDI5NDA2NjI1ODk4OCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcIndpZHRoXCI6ODAuNTc0OTEyODkxOTg2MDYsXCJoZWlnaHRcIjo3MS4yMzUwMzQ2NTY1ODQ3NixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIkNvZGUuLlwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb2RlXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJDb2RlLi5cIixcIm5hbWVcIjpcImNvZGVcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX0se1widGl0bGVcIjpcIkRlc2lnblwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJkZXNpZ25cIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkRlc2lnblwiLFwibmFtZVwiOlwiZGVzaWduXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwiY29sdW1uXCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcIndpZHRoXCI6MTkuNDI1MDg3MTA4MDEzOTQsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjE5Ljg0NDM1Nzk3NjY1MzY5NyxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlBhbGV0dGVcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiY29tcG9uZW50UGFsZXR0ZVwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiUGFsZXR0ZVwiLFwibmFtZVwiOlwiY29tcG9uZW50UGFsZXR0ZVwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjgwLjE1NTY0MjAyMzM0NjMsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJQcm9wZXJ0aWVzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcInByb3BlcnRpZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlByb3BlcnRpZXNcIixcIm5hbWVcIjpcInByb3BlcnRpZXNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfV19XX0se1widHlwZVwiOlwicm93XCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImhlaWdodFwiOjE4Ljk1NzA1OTMzNzQxMDEyMixcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6MTguOTU3MDU5MzM3NDEwMTIyLFwid2lkdGhcIjo3Ny43MDAzNDg0MzIwNTU3NSxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJ2YXJpYWJsZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwibmFtZVwiOlwidmFyaWFibGVzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9LHtcInRpdGxlXCI6XCJFcnJvcnNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiZXJyb3JzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJFcnJvcnNcIixcIm5hbWVcIjpcImVycm9yc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcIndpZHRoXCI6MjIuMjk5NjUxNTY3OTQ0MjU2LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiQ29tcG9uZW50c1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb21wb25lbnRzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJDb21wb25lbnRzXCIsXCJuYW1lXCI6XCJjb21wb25lbnRzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX1dfV19XSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwib3BlblBvcG91dHNcIjpbXSxcIm1heGltaXNlZEl0ZW1JZFwiOm51bGx9JztcclxuICAgIH1cclxuXHJcbiAgICBfdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHMudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXRDb21wb25lbnRFeHBsb3JlcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLm9uY2xpY2soZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIG9iID0gZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBvYjtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlci5nZXRDb21wb25lbnROYW1lID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIHZhcm5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoaXRlbSk7XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YXJuYW1lLnN1YnN0cmluZyg1KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhcm5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVtb3ZlcyB0aGUgc2VsZWN0ZWQgY29tcG9uZW50XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUNvbXBvbmVudCgpIHtcclxuICAgICAgICB2YXIgdG9kZWwgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHRoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHRvZGVsKTtcclxuICAgICAgICBpZiAodmFybmFtZSAhPT0gXCJ0aGlzXCIpIHtcclxuICAgICAgICAgICAgaWYgKHRvZGVsLmRvbVdyYXBwZXIuX3BhcmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0b2RlbC5kb21XcmFwcGVyLl9wYXJlbnQucmVtb3ZlKHRvZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVWYXJpYWJsZUluQ29kZSh2YXJuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlVmFyaWFibGVJbkRlc2lnbih2YXJuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogZXhlY3V0ZSB0aGUgY3VycmVudCBjb2RlXHJcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdG9DdXJzb3IgLSAgaWYgdHJ1ZSB0aGUgdmFyaWFibGVzIHdlcmUgaW5zcGVjdGVkIG9uIGN1cnNvciBwb3NpdGlvbiwgXHJcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgZmFsc2UgYXQgdGhlIGVuZCBvZiB0aGUgbGF5b3V0KCkgZnVuY3Rpb24gb3IgYXQgdGhlIGVuZCBvZiB0aGUgY29kZVxyXG4gICAgKi9cclxuICAgIGV2YWxDb2RlKHRvQ3Vyc29yID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5ldmFsQ29kZSh0b0N1cnNvcik7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIHNhdmUgdGhlIGNvZGUgdG8gc2VydmVyXHJcbiAgICAqL1xyXG4gICAgc2F2ZSgpIHtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLnNhdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1bmRvIGFjdGlvblxyXG4gICAgICovXHJcbiAgICB1bmRvKCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IudW5kbygpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRDb21wb25lbnRJRHNJbkRlc2lnbihjb21wb25lbnQ6IENvbXBvbmVudCwgY29sbGVjdDogc3RyaW5nW10pIHtcclxuXHJcbiAgICAgICAgY29sbGVjdC5wdXNoKFwiI1wiICsgY29tcG9uZW50Ll9pZCk7XHJcbiAgICAgICAgdmFyIGNoaWxkcyA9IGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdO1xyXG4gICAgICAgIGlmIChjaGlsZHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNoaWxkcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnRJRHNJbkRlc2lnbihjaGlsZHNbeF0sIGNvbGxlY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBkaWFsb2cgZWRpdCBtb2RlXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZSAtIGlmIHRydWUgYWxsb3cgcmVzaXppbmcgYW5kIGRyYWcgYW5kIGRyb3AgXHJcbiAgICAgKi9cclxuICAgIGVkaXREaWFsb2coZW5hYmxlKSB7XHJcblxyXG5cclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZWRpdE1vZGUgPSBlbmFibGU7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLnRvZ2dsZSghdGhpcy5lZGl0TW9kZSk7XHJcbiAgICAgICAgdGhpcy51bmRvQnV0dG9uLmhpZGRlbiA9ICFlbmFibGU7XHJcbiAgICAgICAgdGhpcy5sYXNzb0J1dHRvbi5oaWRkZW49IWVuYWJsZTtcclxuICAgICAgICB0aGlzLnJlbW92ZUJ1dHRvbi5oaWRkZW49IWVuYWJsZTtcclxuICAgICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF07XHJcbiAgICAgICAgLy9zd2l0Y2ggZGVzaWdubW9kZVxyXG4gICAgICAgIHZhciBjb21wcyA9ICQoY29tcG9uZW50LmRvbSkuZmluZChcIi5qY29tcG9uZW50XCIpO1xyXG4gICAgICAgIGNvbXBzLmFkZENsYXNzKFwiamRlc2lnbm1vZGVcIik7XHJcbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBjb21wcy5sZW5ndGg7IGMrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbXBzW2NdLl90aGlzW1wiZXh0ZW5zaW9uQ2FsbGVkXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBzW2NdLl90aGlzW1wiZXh0ZW5zaW9uQ2FsbGVkXCJdKHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnREZXNpZ25lclNldERlc2lnbk1vZGU6IHsgZW5hYmxlLCBjb21wb25lbnREZXNpZ25lcjogdGhpcyB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vY29tcHNbY10uX3RoaXNbXCJzZXREZXNpZ25Nb2RlXCJdKGVuYWJsZSx0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tcG9uZW50W1wiZXh0ZW5zaW9uQ2FsbGVkXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50W1wiZXh0ZW5zaW9uQ2FsbGVkXCJdKHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZTogeyBlbmFibGUsIGNvbXBvbmVudERlc2lnbmVyOiB0aGlzIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2lmKGNvbXBvbmVudFtcInNldERlc2lnbk1vZGVcIl0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgIC8vICAgICAgICBjb21wb25lbnRbXCJzZXREZXNpZ25Nb2RlXCJdKGVuYWJsZSx0aGlzKTtcclxuICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTsvL3ZhcmlhYmxlcyBjYW4gYmUgYWRkZWQgd2l0aCBSZXBlYXRlci5zZXREZXNpZ25Nb2RlXHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLnVuaW5zdGFsbCgpOyBjb25zb2xlLmxvZyhcInVuaW5zdGFsbFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2RyYWdhbmRkcm9wcGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIudW5pbnN0YWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZW5hYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBhbGxjb21wb25lbnRzID0gdGhpcy52YXJpYWJsZXMuZ2V0RWRpdGFibGVDb21wb25lbnRzKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eUVkaXRvci5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudElEc0luRGVzaWduKGNvbXBvbmVudCwgcmV0KTtcclxuICAgICAgICAgICAgICAgIGFsbGNvbXBvbmVudHMgPSByZXQuam9pbihcIixcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgYWxsY29tcG9uZW50cyA9IHRoaXMudmFyaWFibGVzLmdldEVkaXRhYmxlQ29tcG9uZW50cyhjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAvL3RoaXMuX2luc3RhbGxUaW55RWRpdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyID0gbmV3IERyYWdBbmREcm9wcGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIgPSBuZXcgUmVzaXplcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLmRyYWdhbmRkcm9wcGVyID0gdGhpcy5fZHJhZ2FuZGRyb3BwZXI7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uc2VsZWN0XCIpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLm9uZWxlbWVudHNlbGVjdGVkID0gZnVuY3Rpb24gKGVsZW1lbnRJRHMsIGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZWxlbWVudElEcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYiA9ICQoXCIjXCIgKyBlbGVtZW50SURzW3hdKVswXS5fdGhpcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JbXCJlZGl0b3JzZWxlY3R0aGlzXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYiA9IG9iW1wiZWRpdG9yc2VsZWN0dGhpc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICByZXQucHVzaChvYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmV0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSByZXRbMF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVyLm9ucHJvcGVydHljaGFuZ2VkID0gZnVuY3Rpb24gKGNvbXA6IENvbXBvbmVudCwgcHJvcDogc3RyaW5nLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb3AgY2hhbmdlIFwiICsgY29tcC5faWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSAhPT0gY29tcClcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBjb21wO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKHByb3AsIHZhbHVlICsgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIuaW5zdGFsbChjb21wb25lbnQsIGFsbGNvbXBvbmVudHMpO1xyXG4gICAgICAgICAgICBhbGxjb21wb25lbnRzID0gdGhpcy52YXJpYWJsZXMuZ2V0RWRpdGFibGVDb21wb25lbnRzKGNvbXBvbmVudCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLmluc3RhbGwoY29tcG9uZW50LCBhbGxjb21wb25lbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIub25wcm9wZXJ0eWNoYW5nZWQgPSBmdW5jdGlvbiAoY29tcG9uZW50LCB0b3AsIGxlZnQsIG9sZFBhcmVudCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLm1vdmVDb21wb25lbnQoY29tcG9uZW50LCB0b3AsIGxlZnQsIG9sZFBhcmVudCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLm9ucHJvcGVydHlhZGRlZCA9IGZ1bmN0aW9uICh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmNyZWF0ZUNvbXBvbmVudCh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fZHJhZ2FuZGRyb3BwZXIuaXNEcmFnRW5hYmxlZCA9IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5fcmVzaXplciA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5fcmVzaXplci5jb21wb25lbnRVbmRlckN1cnNvciAhPT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qICAkKFwiLmhvaG8yXCIpLnNlbGVjdGFibGUoe30pO1xyXG4gICAgICAgICAgJChcIi5ob2hvMlwiKS5zZWxlY3RhYmxlKFwiZGlzYWJsZVwiKTsqL1xyXG4gICAgICAgIC8qICAkKFwiLkhUTUxQYW5lbFwiKS5zZWxlY3RhYmxlKHt9KTtcclxuICAgICAgICAgICQoXCIuSFRNTFBhbmVsXCIpLnNlbGVjdGFibGUoXCJkaXNhYmxlXCIpO1xyXG4gICAgICAgICAgJChcIi5IVE1MUGFuZWxcIikuZHJhZ2dhYmxlKHt9KTtcclxuICAgICAgICAgICQoXCIuSFRNTFBhbmVsXCIpLmRyYWdnYWJsZShcImRpc2FibGVcIik7Ki9cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1vdmUgYSBjb21wb25lbnRcclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gbW92ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcCAtIHRoZSB0b3AgYWJzb2x1dGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0gdGhlIGxlZnQgYWJzb2x1dGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db250YWluZXJ9IG5ld1BhcmVudCAtIHRoZSBuZXcgcGFyZW50IGNvbnRhaW5lciB3aGVyZSB0aGUgY29tcG9uZW50IG1vdmUgdG9cclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGJlZm9yZUNvbXBvbmVudCAtIGluc2VydCB0aGUgY29tcG9uZW50IGJlZm9yZSBiZWZvcmVDb21wb25lbnRcclxuICAgICAqKi9cclxuICAgIG1vdmVDb21wb25lbnQoY29tcG9uZW50LCB0b3AsIGxlZnQsIG9sZFBhcmVudCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8qaWYoYmVmb3JlQ29tcG9uZW50IT09dW5kZWZpbmVkJiZiZWZvcmVDb21wb25lbnQuZGVzaWduRHVtbXlGb3IhPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBiZWZvcmVDb21wb25lbnQ9dW5kZWZpbmVkO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHZhciBvbGROYW1lID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9sZFBhcmVudCk7XHJcbiAgICAgICAgdmFyIG5ld05hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QobmV3UGFyZW50KTtcclxuICAgICAgICB2YXIgY29tcE5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoY29tcG9uZW50KTtcclxuICAgICAgICBpZiAodG9wICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwieFwiLCB0b3AgKyBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJ4XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGVmdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInlcIiwgbGVmdCArIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcInlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob2xkUGFyZW50ICE9PSBuZXdQYXJlbnQgfHwgYmVmb3JlQ29tcG9uZW50ICE9PSB1bmRlZmluZWQgfHwgdG9wID09PSB1bmRlZmluZWQpIHsvL3RvcD11bmRlZmluZWQgLT5vbiByZWxhdGl2ZSBwb3NpdGlvbiBhdCB0aGUgZW5kIGNhbGwgdGhlIGJsb2NrXHJcbiAgICAgICAgICAgIC8vZ2V0IFBvc2l0aW9uXHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcImFkZFwiLCBjb21wTmFtZSwgb2xkTmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBiZWZvcmU7XHJcbiAgICAgICAgICAgIGlmIChiZWZvcmVDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiBiZWZvcmVDb21wb25lbnQudHlwZSAhPT0gXCJhdEVuZFwiKSB7Ly9kZXNpZ25kdW1teSBhdEVuZFxyXG4gICAgICAgICAgICAgICAgdmFyIG9uID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGJlZm9yZSA9IHsgdmFyaWFibGVuYW1lOiBwYXIsIHByb3BlcnR5OiBcImFkZFwiLCB2YWx1ZTogb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgY29tcE5hbWUsIGZhbHNlLCBuZXdOYW1lLCBiZWZvcmUpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLyogaWYobmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aD4xKXsvL2NvcnJlY3QgZHVtbXlcclxuICAgICAgICAgICAgIHZhciBkdW1teT1cdG5ld1BhcmVudC5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTJdO1xyXG4gICAgICAgICAgICAgaWYoZHVtbXkuZGVzaWduRHVtbXlGb3IhPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgIC8vdmFyIHRtcD1uZXdQYXJlbnQuX2NvbXBvbmVudHNbbmV3UGFyZW50Ll9jb21wb25lbnRzLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgICAgICBuZXdQYXJlbnQucmVtb3ZlKGR1bW15KTsvLy5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTFdPW5ld1BhcmVudC5fY29tcG9uZW50c1tuZXdQYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTJdO1xyXG4gICAgICAgICAgICAgICAgIG5ld1BhcmVudC5hZGQoZHVtbXkpOy8vLl9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMV09dG1wO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9Ki9cclxuICAgICAgICBfdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTtcclxuICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWU7XHJcbiAgICAgICAgX3RoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnZhbHVlID0gX3RoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgYSBuZXcgY29tcG9uZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIHRoZSB0eXBlIG9mIHRoZSBuZXcgY29tcG9uZW50XHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRoZW1zZWxmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9wIC0gdGhlIHRvcCBhYnNvbHV0ZSBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgLSB0aGUgbGVmdCBhYnNvbHV0ZSBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbnRhaW5lcn0gbmV3UGFyZW50IC0gdGhlIG5ldyBwYXJlbnQgY29udGFpbmVyIHdoZXJlIHRoZSBjb21wb25lbnQgaXMgcGxhY2VkXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBiZWZvcmVDb21wb25lbnQgLSBpbnNlcnQgdGhlIG5ldyBjb21wb25lbnQgYmVmb3JlIGJlZm9yZUNvbXBvbmVudFxyXG4gICAgICoqL1xyXG4gICAgY3JlYXRlQ29tcG9uZW50KHR5cGUsIGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCk6IENvbXBvbmVudCB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAvKmlmKGJlZm9yZUNvbXBvbmVudCE9PXVuZGVmaW5lZCYmYmVmb3JlQ29tcG9uZW50LmRlc2lnbkR1bW15Rm9yJiZiZWZvcmVDb21wb25lbnQudHlwZT09PVwiYXRFbmRcIil7XHJcbiAgICAgICAgICAgIGJlZm9yZUNvbXBvbmVudD11bmRlZmluZWQ7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgdmFyIGZpbGUgPSB0eXBlLnJlcGxhY2VBbGwoXCIuXCIsIFwiL1wiKTtcclxuICAgICAgICB2YXIgc3R5cGUgPSBmaWxlLnNwbGl0KFwiL1wiKVtmaWxlLnNwbGl0KFwiL1wiKS5sZW5ndGggLSAxXTtcclxuICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IuYWRkSW1wb3J0SWZOZWVkZWQoc3R5cGUsIGZpbGUpO1xyXG4gICAgICAgIHZhciByZXBlYXRlciA9IF90aGlzLl9oYXNSZXBlYXRpbmdDb250YWluZXIobmV3UGFyZW50KTtcclxuICAgICAgICB2YXIgc2NvcGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHJlcGVhdGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcGVhdGVybmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChyZXBlYXRlcik7XHJcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnBhcnNlci5nZXRQcm9wZXJ0eVZhbHVlKHJlcGVhdGVybmFtZSwgXCJjcmVhdGVSZXBlYXRpbmdDb21wb25lbnRcIik7XHJcbiAgICAgICAgICAgIHNjb3BlID0geyB2YXJpYWJsZW5hbWU6IHJlcGVhdGVybmFtZSwgbWV0aG9kbmFtZTogXCJjcmVhdGVSZXBlYXRpbmdDb21wb25lbnRcIiB9O1xyXG4gICAgICAgICAgICBpZiAodGVzdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFyZGF0YWJpbmRlciA9IF90aGlzLl9wcm9wZXJ0eUVkaXRvci5nZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZShcImphc3NpanMudWkuRGF0YWJpbmRlclwiKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcImNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiLCBcImZ1bmN0aW9uKG1lOk1lKXtcXG5cXHRcXG59XCIsIHRydWUsIHJlcGVhdGVybmFtZSk7XHJcbiAgICAgICAgICAgICAgICByZXBlYXRlci5jcmVhdGVSZXBlYXRpbmdDb21wb25lbnQoZnVuY3Rpb24gKG1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Rlc2lnbk1vZGUgIT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAvL190aGlzLnZhcmlhYmxlcy5hZGRWYXJpYWJsZSh2YXJkYXRhYmluZGVyLGRhdGFiaW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvKnZhciBkYj1uZXcgamFzc2lqcy51aS5EYXRhYmluZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXBlYXRlci52YWx1ZSE9PXVuZGVmaW5lZCYmcmVwZWF0ZXIudmFsdWUubGVuZ3RoPjApXHJcbiAgICAgICAgICAgICAgICAgICAgZGIudmFsdWU9cmVwZWF0ZXIudmFsdWVbMF07XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YXJpYWJsZXMuYWRkKHZhcmRhdGFiaW5kZXIsZGIpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7Ki9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdmFydmFsdWUgPSBuZXcgKGNsYXNzZXMuZ2V0Q2xhc3ModHlwZSkpO1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gX3RoaXMuY3JlYXRlVmFyaWFibGUodHlwZSwgc2NvcGUsIHZhcnZhbHVlKTtcclxuICAgICAgICBpZiAodGhpcy5fcHJvcGVydHlFZGl0b3IuY29kZUVkaXRvciAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbmV3TmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChuZXdQYXJlbnQpO1xyXG4gICAgICAgICAgICB2YXIgYmVmb3JlO1xyXG4gICAgICAgICAgICBpZiAoYmVmb3JlQ29tcG9uZW50ICE9PSB1bmRlZmluZWQgJiYgYmVmb3JlQ29tcG9uZW50LnR5cGUgIT09IFwiYXRFbmRcIikgey8vRGVzaWduZHVtbXkgYXRFbmRcclxuICAgICAgICAgICAgICAgIC8vaWYoYmVmb3JlQ29tcG9uZW50LnR5cGU9PT1cImJlZm9yZUNvbXBvbmVudFwiKVxyXG4gICAgICAgICAgICAgICAgLy8gICBiZWZvcmVDb21wb25lbnQ9YmVmb3JlQ29tcG9uZW50LmRlc2lnbkR1bW15Rm9yO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9uID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyID0gX3RoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGJlZm9yZUNvbXBvbmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGJlZm9yZSA9IHsgdmFyaWFibGVuYW1lOiBwYXIsIHByb3BlcnR5OiBcImFkZFwiLCB2YWx1ZTogb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgdmFybmFtZSwgZmFsc2UsIG5ld05hbWUsIGJlZm9yZSwgc2NvcGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGJlZm9yZUNvbXBvbmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG5ld1BhcmVudC5hZGRCZWZvcmUodmFydmFsdWUsIGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3UGFyZW50LmFkZCh2YXJ2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIGlmKG5ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGg+MSl7Ly9jb3JyZWN0IGR1bW15XHJcbiAgICAgICAgICAgICBpZihuZXdQYXJlbnQuX2Rlc2lnbkR1bW15KXtcclxuICAgICAgICAgICAgICAgICAvL3ZhciB0bXA9bmV3UGFyZW50Ll9jb21wb25lbnRzW25ld1BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAgbmV3UGFyZW50LmRvbS5yZW1vdmVDaGlsZChuZXdQYXJlbnQuX2Rlc2lnbkR1bW15LmRvbVdyYXBwZXIpXHJcbiAgICAgICAgICAgICAgICAgbmV3UGFyZW50LmRvbS5hcHBlbmQobmV3UGFyZW50Ll9kZXNpZ25EdW1teS5kb21XcmFwcGVyKVxyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9Ki9cclxuICAgICAgICBfdGhpcy52YXJpYWJsZXMudXBkYXRlQ2FjaGUoKTtcclxuXHJcbiAgICAgICAgLy9zZXQgaW5pdGlhbCBwcm9wZXJ0aWVzIGZvciB0aGUgbmV3IGNvbXBvbmVudFxyXG4gICAgICAgIGlmIChjb21wb25lbnQuY3JlYXRlRnJvbVBhcmFtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBvbmVudC5jcmVhdGVGcm9tUGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBjb21wb25lbnQuY3JlYXRlRnJvbVBhcmFtW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gJ1wiJyArIHZhbCArICdcIic7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoa2V5LCB2YWwsIHRydWUsIHZhcm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHZhcnZhbHVlLCBjb21wb25lbnQuY3JlYXRlRnJvbVBhcmFtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRvcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInhcIiwgdG9wICsgXCJcIiwgdHJ1ZSwgdmFybmFtZSk7XHJcbiAgICAgICAgICAgIHZhcnZhbHVlLnggPSB0b3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5Db2RlKFwieVwiLCBsZWZ0ICsgXCJcIiwgdHJ1ZSwgdmFybmFtZSk7XHJcbiAgICAgICAgICAgIHZhcnZhbHVlLnkgPSBsZWZ0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9ub3RpZnkgY29tcG9uZW50ZGVzY3JpcHRvciBcclxuICAgICAgICB2YXIgYWMgPSB2YXJ2YWx1ZS5leHRlbnNpb25DYWxsZWQ7XHJcbiAgICAgICAgaWYgKGFjICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFydmFsdWUuZXh0ZW5zaW9uQ2FsbGVkKHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudERlc2lnbmVyQ29tcG9uZW50Q3JlYXRlZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1BhcmVudDogbmV3UGFyZW50XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IHZhcnZhbHVlO1xyXG4gICAgICAgIC8vaW5jbHVkZSB0aGUgbmV3IGVsZW1lbnRcclxuICAgICAgICBfdGhpcy5lZGl0RGlhbG9nKHRydWUpO1xyXG4gICAgICAgIF90aGlzLl9jb21wb25lbnRFeHBsb3Jlci51cGRhdGUoKTtcclxuICAgICAgICAvL3ZhciB0ZXN0PV90aGlzLl9pbnZpc2libGVDb21wb25lbnRzO1xyXG4gICAgICAgIF90aGlzLl91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgcmV0dXJuIHZhcnZhbHVlO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVmFyaWFibGUodHlwZSwgc2NvcGUsIHZhcnZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnR5RWRpdG9yLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gdGhpcy5fcHJvcGVydHlFZGl0b3IuYWRkVmFyaWFibGVJbkNvZGUodHlwZSwgc2NvcGUpO1xyXG5cclxuICAgICAgICBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwibWUuXCIpKSB7XHJcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMuX2NvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwibWVcIik7XHJcbiAgICAgICAgICAgIG1lW3Zhcm5hbWUuc3Vic3RyaW5nKDMpXSA9IHZhcnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwidGhpcy5cIikpIHtcclxuICAgICAgICAgICAgdmFyIHRoID0gdGhpcy5fY29kZUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUoXCJ0aGlzXCIpO1xyXG4gICAgICAgICAgICB0aFt2YXJuYW1lLnN1YnN0cmluZyg1KV0gPSB2YXJ2YWx1ZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUodmFybmFtZSwgdmFydmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB2YXJuYW1lO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGVyZSBhIHBhcmVudCB0aGF0IGFjdHMgYSByZXBlYXRpbmcgY29udGFpbmVyP1xyXG4gICAgICoqL1xyXG4gICAgX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoY29tcG9uZW50ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNvbXBvbmVudCkgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgUmVwZWF0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc1JlcGVhdGluZ0NvbnRhaW5lcihjb21wb25lbnQuX3BhcmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gLSB0aGUgZGVzaWduZWQgY29tcG9uZW50XHJcbiAgICAgKi9cclxuICAgIHNldCBkZXNpZ25lZENvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICB2YXIgY29tID0gY29tcG9uZW50O1xyXG4gICAgICAgIGlmIChjb21bXCJpc0Fic29sdXRlXCJdICE9PSB0cnVlICYmIGNvbS53aWR0aCA9PT0gXCIwXCIgJiYgY29tLmhlaWdodCA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50LndpZHRoID0gXCJjYWxjKDEwMCUgLSAxcHgpXCI7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSBcImNhbGMoMTAwJSAtIDFweClcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVFZGl0b3IuX19ldmFsVG9DdXJzb3JSZWFjaGVkICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uc2hvdyhcImRlc2lnblwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLnJlbW92ZSh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuYWRkKGNvbXBvbmVudCk7XHJcbiAgICAgICAgLy8gXHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0RGlhbG9nKHRoaXMuZWRpdE1vZGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiB0aGlzLmVkaXRNb2RlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudmFsdWUgPSBjb21wb25lbnQ7XHJcblxyXG4gICAgICAgICQodGhpcy5kb20pLmZvY3VzKCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVJbnZpc2libGVDb21wb25lbnRzKCk7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuaW5saW5lRWRpdG9yUGFuZWwuZG9tLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbmxpbmVFZGl0b3JQYW5lbC5kb20uZmlyc3RDaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdmFyIHBhcnNlcj1uZXcgamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvci5QYXJzZXIoKTtcclxuICAgICAgICAvL3BhcnNlci5wYXJzZShfdGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBnZXQgZGVzaWduZWRDb21wb25lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdO1xyXG4gICAgfVxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmVzaXplciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZXIudW5pbnN0YWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9kcmFnYW5kZHJvcHBlciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLmlzRHJhZ0VuYWJsZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYWdhbmRkcm9wcGVyLnVuaW5zdGFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvcj8uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGU/LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlcj8uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHM/LmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgcmV0dXJuIG5ldyBDb21wb25lbnREZXNpZ25lcigpO1xyXG5cclxufTtcclxuXHJcblxyXG4iXX0=