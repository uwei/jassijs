var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Image", "jassijs/ui/ComponentDescriptor", "jassijs/ui/PropertyEditors/NameEditor", "jassijs/base/PropertyEditorService", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/ext/jquerylib", "jassijs/base/PropertyEditorService"], function (require, exports, Registry_1, Panel_1, Button_1, Image_1, ComponentDescriptor_1, NameEditor_1, PropertyEditorService_1, Property_1, Component_1) {
    "use strict";
    var PropertyEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.PropertyEditorTestSubProperties = exports.PropertyEditor = void 0;
    let PropertyEditor = PropertyEditor_1 = class PropertyEditor extends Panel_1.Panel {
        /**
        * edit object properties
        */
        constructor(codeEditor = undefined, parser = undefined) {
            super();
            this.readPropertyValueFromDesign = false;
            this.codeChanges = {};
            this.table = (0, Component_1.createComponent)(this.createTable());
            this.toolbar = new Panel_1.Panel();
            this.parser = parser;
            this.add(this.toolbar);
            this.add(this.table);
            this.table.width = "98%";
            $(this.table.dom).find(".propertyeditorheader").resizable({ handles: "e" });
            this.clear();
            this.layout();
            /**
             * @member {jassijs_editor.CodeEditor} - the parent CodeEditor
             * if undefined - no code changes would be done
             * */
            this.codeEditor = codeEditor;
            /** @member {jassijs.base.Parser} - the code-parser*/
            /** @member {string} - the name of the variable in code*/
            this.variablename = "";
            /** @member {jassijs.ui.PropertyEditor} - parent propertyeditor*/
            this.parentPropertyEditor;
            /** @member {[jassijs.ui.PropertyEditor]} - if multiselect - the propertyeditors of the other elements*/
            this._multiselectEditors;
        }
        createTable() {
            return React.createElement("table", { style: { tableLayout: "fixed", fontSize: "11px" } },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "propertyeditorheader" }, "Name"),
                        React.createElement("th", { className: "propertyeditorheader" }, "Value"))),
                React.createElement("tbody", null,
                    React.createElement("tr", { className: "propertyeditorrow" },
                        React.createElement("td", null, "a1"),
                        React.createElement("td", null, "b1"))));
        }
        componentDidMount() {
        }
        /**
         * adds a new property
         * @param {string} name  - the name of the property
         * @param {jassijs.ui.PropertyEditors.Editor} editor - the propertyeditor to render the property
         * @param {string} description - the the description is tooltip over the name
         */
        addProperty(name, editor, description) {
            var component = editor.getComponent();
            //dont work
            //var row =Component.createHTMLElement('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>');
            var row = Component_1.Component.createHTMLElement('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>');
            //var row=$('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>')[0];
            var deletebutton = new Image_1.Image();
            deletebutton.src = "mdi mdi-delete-forever-outline";
            var _this = this;
            deletebutton.onclick(function () {
                _this.removePropertyInDesign(name);
                _this.removePropertyInCode(name);
                _this.updateParser();
                _this.value = _this.value;
                _this.callEvent("propertyChanged", event);
            });
            row.children[0].prepend(deletebutton.dom);
            this.table.dom.children[1].appendChild(row);
            row["propertyName"] = name;
            row["_components"] = [editor, deletebutton];
            try {
                row.children[1].appendChild(component.dom);
            }
            catch (_a) {
                //Why
                //debugger;
            }
        }
        /**
         * register an event if the property has changed
         * @param {function} handler - the function that is called on change
         */
        oncodeChanged(handler) {
            this.addEvent("codeChanged", handler);
        }
        /**
         * register an event if the property has changed
         * @param {function} handler - the function that is called on change
         */
        onpropertyChanged(handler) {
            this.addEvent("propertyChanged", handler);
        }
        /**
         * delete all properties
         */
        clear() {
            var trs = this.dom.querySelectorAll(".propertyeditorrow");
            for (var x = 0; x < trs.length; x++) {
                var row = trs[x];
                if (row["_components"] !== undefined) {
                    for (var c = 0; c < row["_components"].length; c++) {
                        row["_components"][c]["__destroyed"] = true;
                        row["_components"][c].destroy();
                    }
                }
                row.remove();
            }
        }
        /**
       * if parentPropertyEditor is defined then the value of the property must be substituted
       * @param {jassijs.ui.PropertyEditor propertyEditor
       * @param {[opject} props
       * @param {string} propname the propertyName
       */
        /* _getParentEditorValue(propertyEditor,ob,propname){
             
         }*/
        /**
         * if parentPropertyEditor is defined then the properties are defined there
         * @param {jassijs.ui.PropertyEditor propertyEditor
         * @param {[opject} props
         * @param {string} propname the propertyName
        
        _addParentEditorProperties(propertyEditor, props, propname) {
            if (propertyEditor.parentPropertyEditor !== undefined)
                this._addParentEditorProperties(propertyEditor.parentPropertyEditor, props, propertyEditor.variablename + "/" + propname);
            else {
                var ret;
                if (this.showThisProperties !== undefined) {
                    ret = Tools.copyObject(this.showThisProperties);
                } else
                    ret = ComponentDescriptor.describe(propertyEditor.value.constructor, true).fields;
                for (var x = 0;x < ret.length;x++) {
                    if (ret[x].name.startsWith(propname + "/")) {
                        var test = ret[x].name.substring((propname + "/").length);
                        if (test.indexOf("/") < 0) {
                            ret[x].name = test;
                            props.push(ret[x]);
                        }
                    }
    
                }
            }
        } */
        /**
         * get all known instances for type
         * @param {type} type - the type we are interested
         * @returns {[string]}
         */
        getVariablesForType(type) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getVariablesForType(type);
        }
        /**
         * get the variablename of an object
         * @param {object} ob - the object to search
         * @returns {string}
         */
        getVariableFromObject(ob) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getVariableFromObject(ob);
        }
        /**
          * gets the name object of the given variabel
          * @param {string} ob - the name of the variable
         *  @returns {string}
         */
        getObjectFromVariable(ob) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getObjectFromVariable(ob);
        }
        isVariableAutoGenerated(varname) {
            return this.codeEditor.isVariableAutogenerated(varname);
        }
        /**
         * @member {object}  - the rendered object
         */
        set value(value) {
            if (value !== this._value && this.parentPropertyEditor === undefined)
                this.codeChanges = {};
            if (value !== undefined || (value === null || value === void 0 ? void 0 : value.dom) !== undefined) {
                //if (!$(value.dom).is(":focus"))
                if (value.dom && document.activeElement !== value.dom && value.dom.focus)
                    value.dom.focus();
            }
            if (value !== undefined && this.value !== undefined && this.value.constructor === value.constructor) {
                this._value = value;
                if (this.codeEditor)
                    this.variablename = this.codeEditor.getVariableFromObject(this._value);
                this.update();
                this.addActions();
                return;
            }
            this._multiselectEditors = [];
            if (value !== undefined && value.length > 1) {
                for (var x = 1; x < value.length; x++) {
                    var multi = new PropertyEditor_1(this.codeEditor, this.parser);
                    multi.codeEditor = this.codeEditor;
                    multi.parentPropertyEditor = this.parentPropertyEditor;
                    multi.value = value[x];
                    multi.parser = this.parser;
                    if (multi.codeEditor !== undefined)
                        this.variablename = this.codeEditor.getVariableFromObject(value[x]);
                    this._multiselectEditors.push(multi);
                }
                this._value = value;
            }
            else
                this._value = value;
            if (Array.isArray(value) && value.length === 0) {
                this._value = undefined;
                this.addActions();
                return;
            }
            if (this.codeEditor !== undefined && this.parentPropertyEditor === undefined) {
                if (Array.isArray(this._value) && this._value.length > 0)
                    this.variablename = this.codeEditor.getVariableFromObject(this._value[0]);
                else
                    this.variablename = this.codeEditor.getVariableFromObject(this._value);
            }
            this.addActions();
            var _this = this;
            if (this._initValue())
                _this.update();
        }
        addActions() {
            var _a, _b, _c;
            var _this = this;
            var all = [];
            (_a = this.actions) === null || _a === void 0 ? void 0 : _a.forEach((e) => all.push(e));
            if ((_b = this._value) === null || _b === void 0 ? void 0 : _b.extensionCalled) {
                (_c = this._value) === null || _c === void 0 ? void 0 : _c.extensionCalled({
                    getPropertyEditorActions: {
                        propertyEditor: this,
                        actions: all
                    }
                });
            }
            this.toolbar.removeAll();
            for (var x = 0; x < all.length; x++) {
                var bt = this.createAction(all[x]);
                this.toolbar.add(bt);
            }
        }
        createAction(action) {
            var bt = new Button_1.Button();
            bt.icon = action.icon;
            bt.onclick(() => action.call(this._value, this));
            bt.tooltip = action.description;
            return bt;
        }
        swapComponents(first, second) {
            //swap Design
            if (first._parent !== second._parent)
                throw "swaped components must have the same parent";
            var parent = first._parent;
            var ifirst = parent._components.indexOf(first);
            var isecond = parent._components.indexOf(second);
            var dummy = Component_1.Component.createHTMLElement("<div/>");
            parent._components[ifirst] = second;
            parent._components[isecond] = first;
            first.domWrapper.replaceWith(dummy);
            second.domWrapper.replaceWith(first.domWrapper);
            dummy.replaceWith(second.domWrapper);
            //swap Code
            var firstname = this.getVariableFromObject(first);
            var secondname = this.getVariableFromObject(second);
            var parentname = this.getVariableFromObject(parent);
            this.parser.swapPropertyWithParameter(parentname, "add", firstname, secondname);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
        }
        controlEditor(editor) {
            let _this = this;
            editor.onedit(function (event) {
                _this.callEvent("propertyChanged", event);
                let deletebutton = editor.component.dom.parentNode.parentNode.children[0].children[0];
                if (deletebutton)
                    deletebutton.style.visibility = 'visible';
            });
        }
        _initValue() {
            var _a, _b;
            var props = [];
            /* if (this.parentPropertyEditor !== undefined)
                 this._addParentEditorProperties(this.parentPropertyEditor, props, this.variablename);
             else*/ {
                if (this.showThisProperties !== undefined)
                    props = this.showThisProperties;
                else {
                    if (!this._value)
                        props = [];
                    else {
                        if (Array.isArray(this._value) && this._value.length > 0)
                            props = (_a = ComponentDescriptor_1.ComponentDescriptor.describe(this._value[0].constructor)) === null || _a === void 0 ? void 0 : _a.fields;
                        else
                            props = (_b = ComponentDescriptor_1.ComponentDescriptor.describe(this._value.constructor)) === null || _b === void 0 ? void 0 : _b.fields;
                    }
                    if (!props)
                        props = [];
                }
            }
            //TODO cache this
            var _this = this;
            _this.properties = {};
            /*for (var x = 0; x < props.length; x++) {
                _this.properties[props[x].name] = { name: props[x].name, component: undefined, description: props[x].description };
            }*/
            var allProperties = [];
            if (_this._multiselectEditors.length === 0) {
                var hasvarname = _this.getVariableFromObject(_this._value);
                if (hasvarname !== undefined) {
                    var nameEditor = new NameEditor_1.NameEditor("name", _this);
                    //_this.addProperty("name", nameEditor, "the name of the component");
                    //allProperties.push({name:"name",editor:nameEditor,description:"the name of the component"});
                    _this.properties["name"] = {
                        name: "name", editor: nameEditor,
                        description: "the name of the component", "component": nameEditor.getComponent()
                    };
                    //nameEditor.ob = _this._value;
                }
            }
            var editorNotLoaded = [];
            for (var x = 0; x < props.length; x++) {
                if (props[x].name.indexOf("/") > -1) {
                }
                else {
                    _this.properties[props[x].name] = { isVisible: props[x].isVisible, name: props[x].name, component: undefined, description: props[x].description };
                    var editor = PropertyEditorService_1.propertyeditor.createFor(props[x], _this);
                    if (editor["then"]) { //editor is not loaded yet
                        editorNotLoaded.push(editor);
                    }
                    else {
                        //  if (classes.getClassName(editor) === "jassijs.ui.PropertyEditors.LoadingEditor") {
                        //    this.hasLoadingEditor = true;
                        // }
                        if (editor === undefined) {
                            console.log("Editor not found for " + _this.variablename);
                            continue;
                        }
                        var sname = editor.property.name;
                        this.controlEditor(editor);
                        if (_this.properties[editor.property.name] === undefined) {
                            console.log("Property not found " + editor.property);
                            continue;
                        }
                        _this.properties[editor.property.name].editor = editor;
                        if (editor !== undefined && _this.properties[editor.property.name] !== undefined) {
                            _this.properties[editor.property.name].component = editor.getComponent();
                        }
                    }
                }
            }
            if (editorNotLoaded.length > 0) {
                Promise.all(editorNotLoaded).then(() => {
                    _this._initValue();
                    _this.value = this.value; //load again
                });
                return false;
            }
            for (var key in _this.properties) {
                var prop = _this.properties[key];
                var doAdd = true;
                for (var m = 0; m < _this._multiselectEditors.length; m++) {
                    var test = _this._multiselectEditors[m].properties[prop.name];
                    if (test === undefined)
                        doAdd = false;
                }
                if (doAdd) {
                    if (prop.component !== undefined)
                        //_this.addProperty(prop.name, prop.editor, prop.description);
                        allProperties.push({ name: prop.name, editor: prop.editor, description: prop.description, isVisible: prop.isVisible });
                }
            }
            _this.clear();
            for (let p = 0; p < allProperties.length; p++) {
                let prop = allProperties[p];
                _this.addProperty(prop.name, prop.editor, prop.description);
            }
            return true;
            // });
        }
        /**
         * updates values
         */
        update() {
            for (var key in this.properties) {
                var prop = this.properties[key];
                if (prop.editor === undefined) {
                    console.warn("PropertyEditor for " + key + " not found");
                    continue;
                }
                //sometimes the component is already deleted e.g.resize
                if (prop.editor["__destroyed"] !== true) {
                    if (prop.isVisible) {
                        var isVisible = prop.isVisible(this.value, this);
                        var label = undefined;
                        for (let r = 0; r < this.table.dom.children[1].children.length; r++) {
                            var row = this.table.dom.children[1].children[r];
                            if (row["propertyName"] === prop.name)
                                label = row;
                        }
                        if (isVisible) {
                            prop.editor.component.dom.parentNode.style.display = '';
                            label.style.display = '';
                        }
                        else {
                            prop.editor.component.dom.parentNode.style.display = 'none';
                            label.style.display = 'none';
                        }
                    }
                    let deletebutton = prop.editor.component.dom.parentNode.parentNode.children[0].children[0];
                    if (deletebutton) {
                        var ll = this.getPropertyValue(prop, false);
                        if (ll === undefined) {
                            deletebutton.style.visibility = 'hidden';
                        }
                        else {
                            deletebutton.style.visibility = 'visible';
                        }
                    }
                    prop.editor.ob = this.value;
                }
            }
        }
        get value() {
            return this._value;
        }
        /**
         * gets the value of the property
         * @param {string} property
         * @param {boolean} [noDefaultValue] - returns no default value of the property
         * @returns {object}
         */
        getPropertyValue(property, noDefaultValue = undefined) {
            var _a, _b;
            if (this.readPropertyValueFromDesign) {
                let ret = this._value[property.name];
                if (ret === undefined && !noDefaultValue)
                    ret = property.default;
                return ret;
            }
            var ret = undefined;
            if (this.codeEditor === undefined) { //read property
                var r = this.codeChanges[property.name];
                if (r === undefined) {
                    if (this.parentPropertyEditor === undefined && this._value[property.name])
                        return this._value[property.name];
                    if (noDefaultValue !== true)
                        return property.default;
                    return r;
                }
                return r;
            }
            if (property.name === "new" && ((_a = this.variablename) === null || _a === void 0 ? void 0 : _a.startsWith("me."))) {
                if (this.parser.data["me"] === undefined)
                    return undefined;
                var prop = this.parser.data["me"][this.variablename.substring(3)];
                if (prop === undefined)
                    return undefined;
                var constr = prop[0].value;
                if (constr.startsWith("typedeclaration:") && prop.length > 1)
                    constr = prop[1].value;
                ret = constr.substring(constr.indexOf("(") + 1, constr.lastIndexOf(")"));
                if (ret === "")
                    ret = undefined;
            }
            else {
                ret = (_b = this.parser) === null || _b === void 0 ? void 0 : _b.getPropertyValue(this.variablename, property.name);
                if (this.codeEditor === undefined && ret === undefined && this._value !== undefined) {
                    ret = this._value[property.name];
                    if (typeof (ret) === "function") {
                        ret = undefined;
                    }
                }
                if (ret === undefined && noDefaultValue !== true)
                    ret = property.default;
            }
            if (this._multiselectEditors !== undefined) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].updateParser();
                    var test = this._multiselectEditors[m].getPropertyValue(property, noDefaultValue);
                    if (test !== ret) {
                        return undefined;
                    }
                }
            }
            return ret;
        }
        updateCodeEditor() {
            this.codeEditor.evalCode();
        }
        /**
         * update the parser
         */
        updateParser() {
            if (this.codeEditor === undefined)
                return;
            if (this.codeEditor.file.endsWith(".tsx"))
                return;
            if (this.parentPropertyEditor !== undefined) {
                this.parentPropertyEditor.updateParser();
            }
            else {
                var text = this.codeEditor.value;
                var val = this.codeEditor.getObjectFromVariable("this");
                if (text && this.parser)
                    this.parser.updateCode(text);
                // this.parser.parse(text, [{ classname: val?.constructor?.name, methodname: "layout" }, { classname: undefined, methodname: "test" }]);
            }
        }
        /**
         * adds an required file to the code
         */
        addImportIfNeeded(name, file) {
            if (this.codeEditor === undefined)
                return;
            this.parser.addImportIfNeeded(name, file);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
        }
        /**
         * gets the next variablename
         * */
        getNextVariableNameForType(type) {
            return this.parser.getNextVariableNameForType(type);
        }
        /**
         * adds an Property
         * @param type - name of the type o create
         * @param scopename - the scope {variable: ,methodname:} to add the variable - if missing layout()
         * @returns  the name of the object
         */
        addVariableInCode(type, scopename, suggestedName = undefined) {
            var val = this.codeEditor.getObjectFromVariable("this");
            var codeHasChanged = {};
            var ret = this.parser.addVariableInCode(type, undefined, scopename, suggestedName, codeHasChanged);
            /* var ret = this.parser.addVariableInCode(type, [{ classname: val?.constructor?.name, methodname: "layout" },
             { classname: undefined, methodname: "test" }], scopename);
             */
            if ((codeHasChanged === null || codeHasChanged === void 0 ? void 0 : codeHasChanged.value) === false) {
            }
            else {
                this.codeEditor.value = this.parser.getModifiedCode();
                this.updateParser();
                this.callEvent("codeChanged", {});
            }
            return ret;
        }
        /**
         * modify the property in code
         * @param {string} property - the property
         * @param {string} value - the new value
         * @param {boolean} [replace]  - if true the old value is deleted
         * @param {string} [variablename] - the name of the variable - default=this.variablename
         * @param {object} [before] - {variablename,property,value=undefined}
         * @param {object} scope - the scope {variable: ,methodname:} the scope - if missing layout()
        */
        setPropertyInCode(property, value, replace = undefined, variableName = undefined, before = undefined, scopename = undefined, doUpdate = true) {
            if (this.codeEditor === undefined) {
                this.codeChanges[property] = value;
                this.callEvent("codeChanged", {});
                return;
            }
            if (this.codeEditor === undefined || this.parentPropertyEditor !== undefined) {
                this.callEvent("codeChanged", {});
                return;
            }
            if (variableName === undefined && this._multiselectEditors !== undefined) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].updateParser();
                    this._multiselectEditors[m].setPropertyInCode(property, value, replace, variableName, before);
                }
                if (this._multiselectEditors.length > 0)
                    this.updateParser();
            }
            var prop;
            var isFunction = false;
            if (property !== "") {
                if (variableName === undefined) {
                    variableName = this.variablename;
                    prop = this._value[property];
                }
                else {
                    prop = this.codeEditor.getObjectFromVariable(variableName)[property];
                }
                isFunction = (typeof (prop) === "function");
            }
            this.parser.setPropertyInCode(variableName, property, value, 
            /*[{ classname: val?.constructor?.name, methodname: "layout" }, { classname: undefined, methodname: "test" }]*/ undefined, isFunction, replace, before, scopename);
            if (doUpdate) {
                //correct spaces
                if (value && value.indexOf && value.indexOf("\n") > -1) {
                    // this.codeEditor.value = this.parser.getModifiedCode();
                    // this.updateParser();
                }
                this.codeEditor.value = this.parser.getModifiedCode();
                this.updateParser();
                this.callEvent("codeChanged", {});
            }
        }
        /**
        * modify the property in design
        * @param {string} property - the property
        * @param {string} value - the new value
        */
        setPropertyInDesign(property, value) {
            var _a, _b;
            if (this._multiselectEditors) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].setPropertyInDesign(property, value);
                }
            }
            if (property === "new" && this.variablename.startsWith("me.")) {
                this.codeEditor.evalCode();
                //  var test=this.codeEditor.getObjectFromVariable(this.variablename);
                //  this.value=this.codeEditor.getObjectFromVariable(this.variablename);
                return;
            }
            if (typeof (this._value[property]) === "function")
                this._value[property](value);
            else {
                // if(property==="value"){
                //   console.log("rerender");
                //this._value.lastconfig[property]=value;
                //this._value.rerender();
                if (this._value.config) {
                    var prop = {};
                    prop[property] = value;
                    this._value.config(prop);
                }
                else
                    this._value[property] = value;
            }
            var updateDummies = (_a = this.codeEditor) === null || _a === void 0 ? void 0 : _a.getDesigner().updateDummies;
            if (updateDummies) {
                (_b = this.codeEditor) === null || _b === void 0 ? void 0 : _b.getDesigner().updateDummies();
            }
        }
        /**
         * goto source position
         * @param position - in Code
         */
        gotoCodePosition(position) {
            if (this.parentPropertyEditor !== undefined)
                return this.parentPropertyEditor.gotoCodePosition(position);
            this.codeEditor.viewmode = "code";
            this.codeEditor.setCursorPorition(position);
        }
        /**
         * goto source line
         * @param {number} line - line in Code
         */
        gotoCodeLine(line) {
            if (this.parentPropertyEditor !== undefined)
                return this.parentPropertyEditor.gotoCodeLine(line);
            this.codeEditor.viewmode = "code";
            this.codeEditor.cursorPosition = { row: line, column: 200 };
        }
        /**
         * renames a variable in code
         */
        renameVariableInCode(oldName, newName) {
            var code = this.codeEditor.value;
            if (this.codeEditor === undefined)
                return;
            var found = true;
            if (oldName.startsWith("me."))
                oldName = oldName.substring(3);
            if (newName.startsWith("me."))
                newName = newName.substring(3);
            if (oldName.startsWith("this."))
                oldName = oldName.substring(5);
            if (newName.startsWith("this."))
                newName = newName.substring(5);
            var reg = new RegExp("\\W" + oldName + "\\W");
            while (found == true) {
                found = false;
                code = code.replace(reg, function replacer(match, offset, string) {
                    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                    found = true;
                    return match.substring(0, 1) + newName + match.substring(match.length - 1, match.length);
                });
            }
            var newvarname = this.parser.renameVariable(oldName, newName);
            this.codeEditor.value = this.parser.getModifiedCode();
            //this.codeEditor.value = code;
            this.updateParser();
            this.callEvent("codeChanged", {});
            return newvarname;
        }
        /**
         * renames a variable in design
         */
        renameVariableInDesign(oldName, newName, autogenerated = false) {
            this.codeEditor.renameVariable(oldName, newName, autogenerated);
        }
        /**
        * removes the variable from design
        * @param  varname - the variable to remove
        */
        removeVariableInDesign(varname) {
            //TODO this und var?
            if (varname.startsWith("me.") && this.codeEditor.getObjectFromVariable("me")) {
                var vname = varname.substring(3);
                var me = this.codeEditor.getObjectFromVariable("me");
                delete me[vname];
            }
            this.codeEditor.removeVariableInDesign(varname);
        }
        /**
         * removes the variable from code
         * @param {string} varname - the variable to remove
         */
        removeVariablesInCode(varname) {
            if (this.codeEditor === undefined) {
                this.callEvent("codeChanged", {});
                return;
            }
            this.parser.removeVariablesInCode(varname);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
            this.callEvent("codeChanged", {});
        }
        /**
        * removes the property from code
        * @param {type} property - the property to remove
        * @param {type} [onlyValue] - remove the property only if the value is found
        * @param {string} [variablename] - the name of the variable - default=this.variablename
        */
        removePropertyInCode(property, onlyValue = undefined, variablename = undefined, doupdate = true) {
            if (this.codeEditor === undefined) {
                delete this.codeChanges[property];
                this.callEvent("codeChanged", {});
                return;
            }
            if (this.codeEditor === undefined) {
                delete this._value[property];
                this.callEvent("codeChanged", {});
                return;
            }
            for (var m = 0; m < this._multiselectEditors.length; m++) {
                this._multiselectEditors[m].updateParser();
                this._multiselectEditors[m].removePropertyInCode(property, onlyValue, variablename);
            }
            if (variablename === undefined)
                variablename = this.variablename;
            if (doupdate) {
                this.updateParser(); //notwendig?
            }
            var ret = this.parser.removePropertyInCode(property, onlyValue, variablename);
            if (doupdate) {
                var text = this.parser.getModifiedCode();
                this.codeEditor.value = text;
                this.updateParser();
                this.callEvent("codeChanged", {});
            }
            return ret;
        }
        /**
        * removes the property in design
        */
        removePropertyInDesign(property) {
            for (var m = 0; m < this._multiselectEditors.length; m++) {
                this._multiselectEditors[m].removePropertyInDesign(property);
            }
            if (typeof (this._value[property]) === "function")
                this._value[property](undefined);
            else {
                try {
                    this._value[property] = undefined;
                }
                catch (_a) {
                }
                delete this._value[property];
            }
        }
        layout(me = undefined) {
        }
        destroy() {
            this._value = undefined;
            this.clear();
            super.destroy();
        }
    };
    PropertyEditor = PropertyEditor_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], PropertyEditor);
    exports.PropertyEditor = PropertyEditor;
    let PropertyEditorTestSubProperties = class PropertyEditorTestSubProperties {
        constructor() {
            this.num = 19;
            this.text = "prop";
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number)
    ], PropertyEditorTestSubProperties.prototype, "num", void 0);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], PropertyEditorTestSubProperties.prototype, "text", void 0);
    PropertyEditorTestSubProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditorTestSubProperties")
    ], PropertyEditorTestSubProperties);
    exports.PropertyEditorTestSubProperties = PropertyEditorTestSubProperties;
    let TestProperties = class TestProperties {
        constructor() {
            this.html = "sample";
        }
        func(any) {
        }
        ;
    };
    __decorate([
        (0, Property_1.$Property)({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean)
    ], TestProperties.prototype, "checked", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "color" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "color", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "componentselector", componentType: "jassi.ui.Component" }),
        __metadata("design:type", Component_1.Component)
    ], TestProperties.prototype, "component", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "databinder" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "databinder", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "dbobject", componentType: "de.Kunde" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "dbobject", void 0);
    __decorate([
        (0, Property_1.$Property)({ default: 80 }),
        __metadata("design:type", Number)
    ], TestProperties.prototype, "num", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "font" }),
        __metadata("design:type", Number)
    ], TestProperties.prototype, "font", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "function" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TestProperties.prototype, "func", null);
    __decorate([
        (0, Property_1.$Property)({ type: "html" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "html", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "image" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "image", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs.ui.PropertyEditorTestSubProperties" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "json", void 0);
    TestProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditorTestProperties")
    ], TestProperties);
    function test() {
        var ret = new PropertyEditor();
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=PropertyEditor.js.map