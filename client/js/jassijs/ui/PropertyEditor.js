var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Image", "jassijs/ui/ComponentDescriptor", "jassijs/ui/PropertyEditors/NameEditor", "jassijs/base/PropertyEditorService", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/base/PropertyEditorService"], function (require, exports, Jassi_1, Panel_1, Image_1, ComponentDescriptor_1, NameEditor_1, PropertyEditorService_1, Property_1, Component_1) {
    "use strict";
    var PropertyEditor_1, _a;
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
            this.table = new Panel_1.Panel();
            this.parser = parser;
            this.table.init($(`<table style="table-layout: fixed;font-size:11px">
                            <thead>
                                <tr>
                                    <th class="propertyeditorheader">Name</th>
                                    <th class="propertyeditorheader">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="propertyeditorrow">
                                    <td >a1</td><td>b1</td>
                                </tr>
                            </tbody>
                            </table>`)[0]);
            this.add(this.table);
            this.table.width = "98%";
            $(".propertyeditorheader").resizable({ handles: "e" });
            //            $( ".propertyeditorheader" ).css("height","8px");
            //$(this.dom).css("height","");
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
        /**
         * adds a new property
         * @param {string} name  - the name of the property
         * @param {jassijs.ui.PropertyEditors.Editor} editor - the propertyeditor to render the property
         * @param {string} description - the the description is tooltip over the name
         */
        addProperty(name, editor, description) {
            var component = editor.getComponent();
            var row = $('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>')[0];
            var deletebutton = new Image_1.Image();
            deletebutton.src = "mdi mdi-delete-forever-outline";
            var _this = this;
            deletebutton.onclick(function () {
                _this.removePropertyInDesign(name);
                _this.removePropertyInCode(name);
                _this.updateParser();
                _this.value = _this.value;
            });
            $(row.children[0]).tooltip();
            // $(row.children[0]).css("font-size", "11px");
            $(row.children[0]).prepend(deletebutton.dom);
            //$(component.dom).css("font-size", "11px");
            this.table.dom.children[1].appendChild(row);
            row["propertyName"] = name;
            row["_components"] = [editor, deletebutton];
            /* $(component.dom).css({
                 "width":"100%",
                 "padding":"initial",
                 "font-size":"11px"
             });*/
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
            var trs = $(this.dom).find(".propertyeditorrow");
            for (var x = 0; x < trs.length; x++) {
                var row = trs[x];
                if (row["_components"] !== undefined) {
                    for (var c = 0; c < row["_components"].length; c++) {
                        row["_components"][c]["__destroyed"] = true;
                        row["_components"][c].destroy();
                    }
                }
                $(row).remove();
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
        /**
         * @member {object}  - the rendered object
         */
        set value(value) {
            if (value !== this._value && this.parentPropertyEditor === undefined)
                this.codeChanges = {};
            if (value !== undefined || (value === null || value === void 0 ? void 0 : value.dom) !== undefined) {
                if (!$(value.dom).is(":focus"))
                    $(value.dom).focus();
            }
            if (value !== undefined && this.value !== undefined && this.value.constructor === value.constructor) {
                this._value = value;
                if (this.codeEditor)
                    this.variablename = this.codeEditor.getVariableFromObject(this._value);
                this.update();
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
            if (value === []) {
                this._value = undefined;
                return;
            }
            if (this.codeEditor !== undefined && this.parentPropertyEditor === undefined) {
                if (Array.isArray(this._value) && this._value.length > 0)
                    this.variablename = this.codeEditor.getVariableFromObject(this._value[0]);
                else
                    this.variablename = this.codeEditor.getVariableFromObject(this._value);
            }
            var _this = this;
            this._initValue();
            _this.update();
        }
        swapComponents(first, second) {
            //swap Design
            if (first._parent !== second._parent)
                throw "swaped components must have the same parent";
            var parent = first._parent;
            var ifirst = parent._components.indexOf(first);
            var isecond = parent._components.indexOf(second);
            var dummy = $("<div/>");
            parent._components[ifirst] = second;
            parent._components[isecond] = first;
            $(first.domWrapper).replaceWith(dummy);
            $(second.domWrapper).replaceWith($(first.domWrapper));
            dummy.replaceWith($(second.domWrapper));
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
                $(deletebutton).css('visibility', 'visible');
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
            for (var x = 0; x < props.length; x++) {
                if (props[x].name.indexOf("/") > -1) {
                }
                else {
                    _this.properties[props[x].name] = { isVisible: props[x].isVisible, name: props[x].name, component: undefined, description: props[x].description };
                    var editor = PropertyEditorService_1.propertyeditor.createFor(props[x], _this);
                    if (editor === undefined) {
                        console.log("Editor not found for " + _this.variablename);
                        continue;
                    }
                    var sname = editor.property.name;
                    this.controlEditor(editor);
                    /*                editor.onedit(function (event) {
                                        _this.callEvent("propertyChanged", event);
                                        let deletebutton = editor.component.dom.parentNode.parentNode.children[0].children[0];
                                        $(deletebutton).css('visibility', 'visible');
                                    });*/
                    //editor.ob = _this._value;
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
                        var isVisible = prop.isVisible(this.value);
                        var label = undefined;
                        for (let r = 0; r < this.table.dom.children[1].children.length; r++) {
                            var row = this.table.dom.children[1].children[r];
                            if (row["propertyName"] === prop.name)
                                label = row;
                        }
                        if (isVisible) {
                            $(prop.editor.component.dom.parentNode).css('display', '');
                            $(label).css('display', '');
                        }
                        else {
                            $(prop.editor.component.dom.parentNode).css('display', 'none');
                            $(label).css('display', 'none');
                        }
                    }
                    let deletebutton = prop.editor.component.dom.parentNode.parentNode.children[0].children[0];
                    var ll = this.getPropertyValue(prop, false);
                    if (ll === undefined) {
                        $(deletebutton).css('visibility', 'hidden');
                    }
                    else {
                        $(deletebutton).css('visibility', 'visible');
                    }
                    /*   $(prop.editor.component.dom.parentNode).css('display', '');
                         } else {
                             $(prop.editor.component.dom.parentNode).css('display', 'none');
     */
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
            if (this.parentPropertyEditor !== undefined) {
                this.parentPropertyEditor.updateParser();
            }
            else {
                var text = this.codeEditor.value;
                var val = this.codeEditor.getObjectFromVariable("this");
                if (text)
                    this.parser.parse(text);
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
            var ret = this.parser.addVariableInCode(type, undefined, scopename, suggestedName);
            /* var ret = this.parser.addVariableInCode(type, [{ classname: val?.constructor?.name, methodname: "layout" },
             { classname: undefined, methodname: "test" }], scopename);
             */ this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
            this.callEvent("codeChanged", {});
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
            if (variableName === undefined) {
                variableName = this.variablename;
                prop = this._value[property];
            }
            else {
                prop = this.codeEditor.getObjectFromVariable(variableName)[property];
            }
            var isFunction = (typeof (prop) === "function");
            var val = this.codeEditor.getObjectFromVariable("this");
            this.parser.setPropertyInCode(variableName, property, value, 
            /*[{ classname: val?.constructor?.name, methodname: "layout" }, { classname: undefined, methodname: "test" }]*/ undefined, isFunction, replace, before, scopename);
            if (doUpdate) {
                //correct spaces
                if (value && value.indexOf && value.indexOf("\n") > -1) {
                    this.codeEditor.value = this.parser.getModifiedCode();
                    this.updateParser();
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
            else
                this._value[property] = value;
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
            this.codeEditor.value = code;
            this.updateParser();
            this.callEvent("codeChanged", {});
        }
        /**
         * renames a variable in design
         */
        renameVariableInDesign(oldName, newName) {
            this.codeEditor.renameVariable(oldName, newName);
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
        (0, Jassi_1.$Class)("jassijs.ui.PropertyEditor"),
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
        (0, Jassi_1.$Class)("jassijs.ui.PropertyEditorTestSubProperties")
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
        (0, Property_1.$Property)({ decription: "name of the dialog", }),
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
        __metadata("design:type", typeof (_a = typeof Component_1.Component !== "undefined" && Component_1.Component) === "function" ? _a : Object)
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
        (0, Jassi_1.$Class)("jassijs.ui.PropertyEditorTestProperties")
    ], TestProperties);
    function test() {
        var ret = new PropertyEditor();
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvcGVydHlFZGl0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBa0JBLElBQWEsY0FBYyxzQkFBM0IsTUFBYSxjQUFlLFNBQVEsYUFBSztRQVlyQzs7VUFFRTtRQUNGLFlBQVksVUFBVSxHQUFHLFNBQVMsRUFBRSxNQUFNLEdBQUcsU0FBUztZQUNsRCxLQUFLLEVBQUUsQ0FBQztZQWZaLGdDQUEyQixHQUFZLEtBQUssQ0FBQztZQVU3QyxnQkFBVyxHQUF3QyxFQUFFLENBQUM7WUFNbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O3FDQVlXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUN6QixDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUV2RCwrREFBK0Q7WUFDL0QsK0JBQStCO1lBQy9CLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkOzs7aUJBR0s7WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixxREFBcUQ7WUFFckQseURBQXlEO1lBQ3pELElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLGlFQUFpRTtZQUNqRSxJQUFJLENBQUMs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QUksRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDOztvREFDbEQ7SUFFVDtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQzs7K0NBQ2Y7SUFFWjtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs7Z0RBQ2Y7SUFFYjtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQzs7Ozs4Q0FHL0I7SUFFRDtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs7Z0RBQ0o7SUFFeEI7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7O2lEQUNmO0lBRWQ7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSw0Q0FBNEMsRUFBRSxDQUFDOztnREFDL0U7SUExQlIsY0FBYztRQURuQixJQUFBLGNBQU0sRUFBQyx5Q0FBeUMsQ0FBQztPQUM1QyxjQUFjLENBNEJuQjtJQUNELFNBQWdCLElBQUk7UUFDaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMvQixHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDakMsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBSkQsb0JBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCBcImphc3NpanMvYmFzZS9Qcm9wZXJ0eUVkaXRvclNlcnZpY2VcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvUGFyc2VyXCI7XG5pbXBvcnQgeyBJbWFnZSB9IGZyb20gXCJqYXNzaWpzL3VpL0ltYWdlXCI7XG5cbmltcG9ydCB7IFRvb2xzIH0gZnJvbSBcImphc3NpanMvdXRpbC9Ub29sc1wiO1xuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50RGVzY3JpcHRvciB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudERlc2NyaXB0b3JcIjtcbmltcG9ydCB7IE5hbWVFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvcnMvTmFtZUVkaXRvclwiO1xuaW1wb3J0IHsgcHJvcGVydHllZGl0b3IgfSBmcm9tIFwiamFzc2lqcy9iYXNlL1Byb3BlcnR5RWRpdG9yU2VydmljZVwiO1xuaW1wb3J0IHsgUHJvcGVydHksICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvcnMvRWRpdG9yXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbnRhaW5lclwiO1xuXG5AJENsYXNzKFwiamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvclwiKVxuZXhwb3J0IGNsYXNzIFByb3BlcnR5RWRpdG9yIGV4dGVuZHMgUGFuZWwge1xuICAgIHJlYWRQcm9wZXJ0eVZhbHVlRnJvbURlc2lnbjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHRhYmxlOiBQYW5lbDtcbiAgICBjb2RlRWRpdG9yO1xuICAgIHBhcnNlcjogUGFyc2VyO1xuICAgIHZhcmlhYmxlbmFtZTogc3RyaW5nO1xuICAgIHBhcmVudFByb3BlcnR5RWRpdG9yOiBQcm9wZXJ0eUVkaXRvcjtcbiAgICBfbXVsdGlzZWxlY3RFZGl0b3JzOiBQcm9wZXJ0eUVkaXRvcltdO1xuICAgIHNob3dUaGlzUHJvcGVydGllcztcbiAgICBwcm9wZXJ0aWVzO1xuICAgIF92YWx1ZTtcbiAgICBjb2RlQ2hhbmdlczogeyBbcHJvcGVydHk6IHN0cmluZ106IHN0cmluZyB8IHt9IH0gPSB7fTtcbiAgICAvKipcbiAgICAqIGVkaXQgb2JqZWN0IHByb3BlcnRpZXNcbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvZGVFZGl0b3IgPSB1bmRlZmluZWQsIHBhcnNlciA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnRhYmxlID0gbmV3IFBhbmVsKCk7XG4gICAgICAgIHRoaXMucGFyc2VyID0gcGFyc2VyO1xuICAgICAgICB0aGlzLnRhYmxlLmluaXQoJChgPHRhYmxlIHN0eWxlPVwidGFibGUtbGF5b3V0OiBmaXhlZDtmb250LXNpemU6MTFweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicHJvcGVydHllZGl0b3JoZWFkZXJcIj5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInByb3BlcnR5ZWRpdG9yaGVhZGVyXCI+VmFsdWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9XCJwcm9wZXJ0eWVkaXRvcnJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkID5hMTwvdGQ+PHRkPmIxPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+YClbMF0pO1xuICAgICAgICB0aGlzLmFkZCh0aGlzLnRhYmxlKTtcbiAgICAgICAgdGhpcy50YWJsZS53aWR0aCA9IFwiOTglXCI7XG4gICAgICAgICQoXCIucHJvcGVydHllZGl0b3JoZWFkZXJcIikucmVzaXphYmxlKHsgaGFuZGxlczogXCJlXCIgfSk7XG5cbiAgICAgICAgLy8gICAgICAgICAgICAkKCBcIi5wcm9wZXJ0eWVkaXRvcmhlYWRlclwiICkuY3NzKFwiaGVpZ2h0XCIsXCI4cHhcIik7XG4gICAgICAgIC8vJCh0aGlzLmRvbSkuY3NzKFwiaGVpZ2h0XCIsXCJcIik7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgICAgLyoqIFxuICAgICAgICAgKiBAbWVtYmVyIHtqYXNzaWpzX2VkaXRvci5Db2RlRWRpdG9yfSAtIHRoZSBwYXJlbnQgQ29kZUVkaXRvclxuICAgICAgICAgKiBpZiB1bmRlZmluZWQgLSBubyBjb2RlIGNoYW5nZXMgd291bGQgYmUgZG9uZSBcbiAgICAgICAgICogKi9cbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yID0gY29kZUVkaXRvcjtcbiAgICAgICAgLyoqIEBtZW1iZXIge2phc3NpanMuYmFzZS5QYXJzZXJ9IC0gdGhlIGNvZGUtcGFyc2VyKi9cblxuICAgICAgICAvKiogQG1lbWJlciB7c3RyaW5nfSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSBpbiBjb2RlKi9cbiAgICAgICAgdGhpcy52YXJpYWJsZW5hbWUgPSBcIlwiO1xuICAgICAgICAvKiogQG1lbWJlciB7amFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcn0gLSBwYXJlbnQgcHJvcGVydHllZGl0b3IqL1xuICAgICAgICB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yO1xuICAgICAgICAvKiogQG1lbWJlciB7W2phc3NpanMudWkuUHJvcGVydHlFZGl0b3JdfSAtIGlmIG11bHRpc2VsZWN0IC0gdGhlIHByb3BlcnR5ZWRpdG9ycyBvZiB0aGUgb3RoZXIgZWxlbWVudHMqL1xuICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnM7XG5cbiAgICB9XG4gICAgLyoqXG4gICAgICogYWRkcyBhIG5ldyBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICAtIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcnMuRWRpdG9yfSBlZGl0b3IgLSB0aGUgcHJvcGVydHllZGl0b3IgdG8gcmVuZGVyIHRoZSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbiAtIHRoZSB0aGUgZGVzY3JpcHRpb24gaXMgdG9vbHRpcCBvdmVyIHRoZSBuYW1lXG4gICAgICovXG4gICAgYWRkUHJvcGVydHkobmFtZTogc3RyaW5nLCBlZGl0b3I6IEVkaXRvciwgZGVzY3JpcHRpb246IHN0cmluZykge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gZWRpdG9yLmdldENvbXBvbmVudCgpO1xuICAgICAgICB2YXIgcm93ID0gJCgnPHRyIG5vd3JhcCBjbGFzcz1cInByb3BlcnR5ZWRpdG9ycm93XCI+PHRkICBzdHlsZT1cImZvbnQtc2l6ZToxMXB4XCIgbm93cmFwIHRpdGxlPVwiJyArIGRlc2NyaXB0aW9uICsgJ1wiPicgKyBuYW1lICsgJzwvdGQ+PHRkIGNsYXNzPVwicHJvcGVydHl2YWx1ZVwiICBub3dyYXA+PC90ZD48L3RyPicpWzBdO1xuICAgICAgICB2YXIgZGVsZXRlYnV0dG9uID0gbmV3IEltYWdlKCk7XG4gICAgICAgIGRlbGV0ZWJ1dHRvbi5zcmMgPSBcIm1kaSBtZGktZGVsZXRlLWZvcmV2ZXItb3V0bGluZVwiO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBkZWxldGVidXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVQcm9wZXJ0eUluRGVzaWduKG5hbWUpO1xuICAgICAgICAgICAgX3RoaXMucmVtb3ZlUHJvcGVydHlJbkNvZGUobmFtZSk7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgICAgIF90aGlzLnZhbHVlID0gX3RoaXMudmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQocm93LmNoaWxkcmVuWzBdKS50b29sdGlwKCk7XG4gICAgICAgIC8vICQocm93LmNoaWxkcmVuWzBdKS5jc3MoXCJmb250LXNpemVcIiwgXCIxMXB4XCIpO1xuXG4gICAgICAgICQocm93LmNoaWxkcmVuWzBdKS5wcmVwZW5kKGRlbGV0ZWJ1dHRvbi5kb20pO1xuICAgICAgICAvLyQoY29tcG9uZW50LmRvbSkuY3NzKFwiZm9udC1zaXplXCIsIFwiMTFweFwiKTtcbiAgICAgICAgdGhpcy50YWJsZS5kb20uY2hpbGRyZW5bMV0uYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgcm93W1wicHJvcGVydHlOYW1lXCJdID0gbmFtZTtcbiAgICAgICAgcm93W1wiX2NvbXBvbmVudHNcIl0gPSBbZWRpdG9yLCBkZWxldGVidXR0b25dO1xuICAgICAgICAvKiAkKGNvbXBvbmVudC5kb20pLmNzcyh7XG4gICAgICAgICAgICAgXCJ3aWR0aFwiOlwiMTAwJVwiLFxuICAgICAgICAgICAgIFwicGFkZGluZ1wiOlwiaW5pdGlhbFwiLFxuICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6XCIxMXB4XCJcbiAgICAgICAgIH0pOyovXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblsxXS5hcHBlbmRDaGlsZChjb21wb25lbnQuZG9tKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAvL1doeVxuICAgICAgICAgICAgLy9kZWJ1Z2dlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiByZWdpc3RlciBhbiBldmVudCBpZiB0aGUgcHJvcGVydHkgaGFzIGNoYW5nZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIG9uIGNoYW5nZVxuICAgICAqL1xuICAgIG9uY29kZUNoYW5nZWQoaGFuZGxlcikge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KFwiY29kZUNoYW5nZWRcIiwgaGFuZGxlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIGFuIGV2ZW50IGlmIHRoZSBwcm9wZXJ0eSBoYXMgY2hhbmdlZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSB0aGUgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb24gY2hhbmdlXG4gICAgICovXG4gICAgb25wcm9wZXJ0eUNoYW5nZWQoaGFuZGxlcikge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KFwicHJvcGVydHlDaGFuZ2VkXCIsIGhhbmRsZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBkZWxldGUgYWxsIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdmFyIHRycyA9ICQodGhpcy5kb20pLmZpbmQoXCIucHJvcGVydHllZGl0b3Jyb3dcIik7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gdHJzW3hdO1xuICAgICAgICAgICAgaWYgKHJvd1tcIl9jb21wb25lbnRzXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHJvd1tcIl9jb21wb25lbnRzXCJdLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd1tcIl9jb21wb25lbnRzXCJdW2NdW1wiX19kZXN0cm95ZWRcIl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByb3dbXCJfY29tcG9uZW50c1wiXVtjXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChyb3cpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgKiBpZiBwYXJlbnRQcm9wZXJ0eUVkaXRvciBpcyBkZWZpbmVkIHRoZW4gdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSBtdXN0IGJlIHN1YnN0aXR1dGVkXG4gICAqIEBwYXJhbSB7amFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvciBwcm9wZXJ0eUVkaXRvclxuICAgKiBAcGFyYW0ge1tvcGplY3R9IHByb3BzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wbmFtZSB0aGUgcHJvcGVydHlOYW1lXG4gICAqL1xuICAgIC8qIF9nZXRQYXJlbnRFZGl0b3JWYWx1ZShwcm9wZXJ0eUVkaXRvcixvYixwcm9wbmFtZSl7XG4gICAgICAgICBcbiAgICAgfSovXG4gICAgLyoqXG4gICAgICogaWYgcGFyZW50UHJvcGVydHlFZGl0b3IgaXMgZGVmaW5lZCB0aGVuIHRoZSBwcm9wZXJ0aWVzIGFyZSBkZWZpbmVkIHRoZXJlXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yIHByb3BlcnR5RWRpdG9yXG4gICAgICogQHBhcmFtIHtbb3BqZWN0fSBwcm9wc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wbmFtZSB0aGUgcHJvcGVydHlOYW1lXG4gICAgXG4gICAgX2FkZFBhcmVudEVkaXRvclByb3BlcnRpZXMocHJvcGVydHlFZGl0b3IsIHByb3BzLCBwcm9wbmFtZSkge1xuICAgICAgICBpZiAocHJvcGVydHlFZGl0b3IucGFyZW50UHJvcGVydHlFZGl0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX2FkZFBhcmVudEVkaXRvclByb3BlcnRpZXMocHJvcGVydHlFZGl0b3IucGFyZW50UHJvcGVydHlFZGl0b3IsIHByb3BzLCBwcm9wZXJ0eUVkaXRvci52YXJpYWJsZW5hbWUgKyBcIi9cIiArIHByb3BuYW1lKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmV0O1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1RoaXNQcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXQgPSBUb29scy5jb3B5T2JqZWN0KHRoaXMuc2hvd1RoaXNQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHJldCA9IENvbXBvbmVudERlc2NyaXB0b3IuZGVzY3JpYmUocHJvcGVydHlFZGl0b3IudmFsdWUuY29uc3RydWN0b3IsIHRydWUpLmZpZWxkcztcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwO3ggPCByZXQubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgICAgIGlmIChyZXRbeF0ubmFtZS5zdGFydHNXaXRoKHByb3BuYW1lICsgXCIvXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmV0W3hdLm5hbWUuc3Vic3RyaW5nKChwcm9wbmFtZSArIFwiL1wiKS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdC5pbmRleE9mKFwiL1wiKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFt4XS5uYW1lID0gdGVzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLnB1c2gocmV0W3hdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSAqL1xuICAgIC8qKlxuICAgICAqIGdldCBhbGwga25vd24gaW5zdGFuY2VzIGZvciB0eXBlXG4gICAgICogQHBhcmFtIHt0eXBlfSB0eXBlIC0gdGhlIHR5cGUgd2UgYXJlIGludGVyZXN0ZWRcbiAgICAgKiBAcmV0dXJucyB7W3N0cmluZ119XG4gICAgICovXG4gICAgZ2V0VmFyaWFibGVzRm9yVHlwZSh0eXBlKSB7XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFyaWFibGVzRm9yVHlwZSh0eXBlKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIHZhcmlhYmxlbmFtZSBvZiBhbiBvYmplY3RcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2IgLSB0aGUgb2JqZWN0IHRvIHNlYXJjaFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9iKSB7XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9iKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAqIGdldHMgdGhlIG5hbWUgb2JqZWN0IG9mIHRoZSBnaXZlbiB2YXJpYWJlbFxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2IgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGVcbiAgICAgKiAgQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRPYmplY3RGcm9tVmFyaWFibGUob2IpIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUob2IpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9ICAtIHRoZSByZW5kZXJlZCBvYmplY3QgXG4gICAgICovXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgIFxuICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX3ZhbHVlICYmIHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuY29kZUNoYW5nZXMgPSB7fTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgfHwgdmFsdWU/LmRvbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoISQodmFsdWUuZG9tKS5pcyhcIjpmb2N1c1wiKSlcbiAgICAgICAgICAgICAgICAkKHZhbHVlLmRvbSkuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlICE9PSB1bmRlZmluZWQgJiYgdGhpcy52YWx1ZS5jb25zdHJ1Y3RvciA9PT0gdmFsdWUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yKVxuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGVuYW1lID0gdGhpcy5jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdCh0aGlzLl92YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycyA9IFtdO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IHZhbHVlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG11bHRpID0gbmV3IFByb3BlcnR5RWRpdG9yKHRoaXMuY29kZUVkaXRvciwgdGhpcy5wYXJzZXIpO1xuICAgICAgICAgICAgICAgIG11bHRpLmNvZGVFZGl0b3IgPSB0aGlzLmNvZGVFZGl0b3I7XG4gICAgICAgICAgICAgICAgbXVsdGkucGFyZW50UHJvcGVydHlFZGl0b3IgPSB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yO1xuICAgICAgICAgICAgICAgIG11bHRpLnZhbHVlID0gdmFsdWVbeF07XG4gICAgICAgICAgICAgICAgbXVsdGkucGFyc2VyID0gdGhpcy5wYXJzZXI7XG4gICAgICAgICAgICAgICAgaWYgKG11bHRpLmNvZGVFZGl0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZW5hbWUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHZhbHVlW3hdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMucHVzaChtdWx0aSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gW10pIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheSh0aGlzLl92YWx1ZSkmJnRoaXMuX3ZhbHVlLmxlbmd0aD4wKVxuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGVuYW1lID0gdGhpcy5jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdCh0aGlzLl92YWx1ZVswXSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZW5hbWUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHRoaXMuX3ZhbHVlKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9pbml0VmFsdWUoKTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICB9XG4gICAgc3dhcENvbXBvbmVudHMoZmlyc3Q6IENvbXBvbmVudCwgc2Vjb25kOiBDb21wb25lbnQpIHtcbiAgICAgICAgLy9zd2FwIERlc2lnblxuICAgICAgICBpZiAoZmlyc3QuX3BhcmVudCAhPT0gc2Vjb25kLl9wYXJlbnQpXG4gICAgICAgICAgICB0aHJvdyBcInN3YXBlZCBjb21wb25lbnRzIG11c3QgaGF2ZSB0aGUgc2FtZSBwYXJlbnRcIlxuICAgICAgICB2YXIgcGFyZW50OiBDb250YWluZXIgPSBmaXJzdC5fcGFyZW50O1xuICAgICAgICB2YXIgaWZpcnN0ID0gcGFyZW50Ll9jb21wb25lbnRzLmluZGV4T2YoZmlyc3QpO1xuICAgICAgICB2YXIgaXNlY29uZCA9IHBhcmVudC5fY29tcG9uZW50cy5pbmRleE9mKHNlY29uZCk7XG4gICAgICAgIHZhciBkdW1teSA9ICQoXCI8ZGl2Lz5cIik7XG5cbiAgICAgICAgcGFyZW50Ll9jb21wb25lbnRzW2lmaXJzdF0gPSBzZWNvbmQ7XG4gICAgICAgIHBhcmVudC5fY29tcG9uZW50c1tpc2Vjb25kXSA9IGZpcnN0O1xuICAgICAgICAkKGZpcnN0LmRvbVdyYXBwZXIpLnJlcGxhY2VXaXRoKGR1bW15KTtcbiAgICAgICAgJChzZWNvbmQuZG9tV3JhcHBlcikucmVwbGFjZVdpdGgoJChmaXJzdC5kb21XcmFwcGVyKSk7XG4gICAgICAgIGR1bW15LnJlcGxhY2VXaXRoKCQoc2Vjb25kLmRvbVdyYXBwZXIpKTtcbiAgICAgICAgLy9zd2FwIENvZGVcbiAgICAgICAgdmFyIGZpcnN0bmFtZSA9IHRoaXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGZpcnN0KTtcbiAgICAgICAgdmFyIHNlY29uZG5hbWUgPSB0aGlzLmdldFZhcmlhYmxlRnJvbU9iamVjdChzZWNvbmQpO1xuICAgICAgICB2YXIgcGFyZW50bmFtZSA9IHRoaXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHBhcmVudCk7XG4gICAgICAgIHRoaXMucGFyc2VyLnN3YXBQcm9wZXJ0eVdpdGhQYXJhbWV0ZXIocGFyZW50bmFtZSwgXCJhZGRcIiwgZmlyc3RuYW1lLCBzZWNvbmRuYW1lKTtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gdGhpcy5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFyc2VyKCk7XG4gICAgfVxuICAgIHByaXZhdGUgY29udHJvbEVkaXRvcihlZGl0b3IpIHtcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgZWRpdG9yLm9uZWRpdChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLmNhbGxFdmVudChcInByb3BlcnR5Q2hhbmdlZFwiLCBldmVudCk7XG4gICAgICAgICAgICBsZXQgZGVsZXRlYnV0dG9uID0gZWRpdG9yLmNvbXBvbmVudC5kb20ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgJChkZWxldGVidXR0b24pLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIF9pbml0VmFsdWUoKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IFtdO1xuICAgICAgIC8qIGlmICh0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9hZGRQYXJlbnRFZGl0b3JQcm9wZXJ0aWVzKHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IsIHByb3BzLCB0aGlzLnZhcmlhYmxlbmFtZSk7XG4gICAgICAgIGVsc2UqLyB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG93VGhpc1Byb3BlcnRpZXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBwcm9wcyA9IHRoaXMuc2hvd1RoaXNQcm9wZXJ0aWVzO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl92YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMgPSBbXTtcbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuX3ZhbHVlKSYmdGhpcy5fdmFsdWUubGVuZ3RoPjApXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wcyA9IENvbXBvbmVudERlc2NyaXB0b3IuZGVzY3JpYmUodGhpcy5fdmFsdWVbMF0uY29uc3RydWN0b3IpPy5maWVsZHM7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzID0gQ29tcG9uZW50RGVzY3JpcHRvci5kZXNjcmliZSh0aGlzLl92YWx1ZS5jb25zdHJ1Y3Rvcik/LmZpZWxkcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wcylcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL1RPRE8gY2FjaGUgdGhpc1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfdGhpcy5wcm9wZXJ0aWVzID0ge307XG4gICAgICAgIC8qZm9yICh2YXIgeCA9IDA7IHggPCBwcm9wcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgX3RoaXMucHJvcGVydGllc1twcm9wc1t4XS5uYW1lXSA9IHsgbmFtZTogcHJvcHNbeF0ubmFtZSwgY29tcG9uZW50OiB1bmRlZmluZWQsIGRlc2NyaXB0aW9uOiBwcm9wc1t4XS5kZXNjcmlwdGlvbiB9O1xuICAgICAgICB9Ki9cbiAgICAgICAgdmFyIGFsbFByb3BlcnRpZXM6IHsgbmFtZTogc3RyaW5nLCBlZGl0b3I6IEVkaXRvciwgZGVzY3JpcHRpb246IHN0cmluZywgaXNWaXNpYmxlPzogKG9iamVjdCkgPT4gYm9vbGVhbiB9W10gPSBbXTtcblxuICAgICAgICBpZiAoX3RoaXMuX211bHRpc2VsZWN0RWRpdG9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHZhciBoYXN2YXJuYW1lID0gX3RoaXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KF90aGlzLl92YWx1ZSk7XG4gICAgICAgICAgICBpZiAoaGFzdmFybmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWVFZGl0b3IgPSBuZXcgTmFtZUVkaXRvcihcIm5hbWVcIiwgX3RoaXMpO1xuICAgICAgICAgICAgICAgIC8vX3RoaXMuYWRkUHJvcGVydHkoXCJuYW1lXCIsIG5hbWVFZGl0b3IsIFwidGhlIG5hbWUgb2YgdGhlIGNvbXBvbmVudFwiKTtcbiAgICAgICAgICAgICAgICAvL2FsbFByb3BlcnRpZXMucHVzaCh7bmFtZTpcIm5hbWVcIixlZGl0b3I6bmFtZUVkaXRvcixkZXNjcmlwdGlvbjpcInRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnRcIn0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnByb3BlcnRpZXNbXCJuYW1lXCJdID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIm5hbWVcIiwgZWRpdG9yOiBuYW1lRWRpdG9yLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJ0aGUgbmFtZSBvZiB0aGUgY29tcG9uZW50XCIsIFwiY29tcG9uZW50XCI6IG5hbWVFZGl0b3IuZ2V0Q29tcG9uZW50KClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIC8vbmFtZUVkaXRvci5vYiA9IF90aGlzLl92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHByb3BzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAocHJvcHNbeF0ubmFtZS5pbmRleE9mKFwiL1wiKSA+IC0xKSB7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLnByb3BlcnRpZXNbcHJvcHNbeF0ubmFtZV0gPSB7IGlzVmlzaWJsZTogcHJvcHNbeF0uaXNWaXNpYmxlLCBuYW1lOiBwcm9wc1t4XS5uYW1lLCBjb21wb25lbnQ6IHVuZGVmaW5lZCwgZGVzY3JpcHRpb246IHByb3BzW3hdLmRlc2NyaXB0aW9uIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gcHJvcGVydHllZGl0b3IuY3JlYXRlRm9yKHByb3BzW3hdLCBfdGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdG9yIG5vdCBmb3VuZCBmb3IgXCIgKyBfdGhpcy52YXJpYWJsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHNuYW1lID0gZWRpdG9yLnByb3BlcnR5Lm5hbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sRWRpdG9yKGVkaXRvcik7XG4gICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgZWRpdG9yLm9uZWRpdChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmNhbGxFdmVudChcInByb3BlcnR5Q2hhbmdlZFwiLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVsZXRlYnV0dG9uID0gZWRpdG9yLmNvbXBvbmVudC5kb20ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkZWxldGVidXR0b24pLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgICAgICAgICAgLy9lZGl0b3Iub2IgPSBfdGhpcy5fdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnByb3BlcnRpZXNbZWRpdG9yLnByb3BlcnR5Lm5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wZXJ0eSBub3QgZm91bmQgXCIgKyBlZGl0b3IucHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcGVydGllc1tlZGl0b3IucHJvcGVydHkubmFtZV0uZWRpdG9yID0gZWRpdG9yO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IgIT09IHVuZGVmaW5lZCAmJiBfdGhpcy5wcm9wZXJ0aWVzW2VkaXRvci5wcm9wZXJ0eS5uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnByb3BlcnRpZXNbZWRpdG9yLnByb3BlcnR5Lm5hbWVdLmNvbXBvbmVudCA9IGVkaXRvci5nZXRDb21wb25lbnQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBfdGhpcy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IF90aGlzLnByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgIHZhciBkb0FkZCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IF90aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IF90aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0ucHJvcGVydGllc1twcm9wLm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIGRvQWRkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZG9BZGQpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5jb21wb25lbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgLy9fdGhpcy5hZGRQcm9wZXJ0eShwcm9wLm5hbWUsIHByb3AuZWRpdG9yLCBwcm9wLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgYWxsUHJvcGVydGllcy5wdXNoKHsgbmFtZTogcHJvcC5uYW1lLCBlZGl0b3I6IHByb3AuZWRpdG9yLCBkZXNjcmlwdGlvbjogcHJvcC5kZXNjcmlwdGlvbiwgaXNWaXNpYmxlOiBwcm9wLmlzVmlzaWJsZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5jbGVhcigpO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IGFsbFByb3BlcnRpZXMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gYWxsUHJvcGVydGllc1twXTtcbiAgICAgICAgICAgIF90aGlzLmFkZFByb3BlcnR5KHByb3AubmFtZSwgcHJvcC5lZGl0b3IsIHByb3AuZGVzY3JpcHRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHVwZGF0ZXMgdmFsdWVzXG4gICAgICovXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgaWYgKHByb3AuZWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJQcm9wZXJ0eUVkaXRvciBmb3IgXCIgKyBrZXkgKyBcIiBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3NvbWV0aW1lcyB0aGUgY29tcG9uZW50IGlzIGFscmVhZHkgZGVsZXRlZCBlLmcucmVzaXplXG4gICAgICAgICAgICBpZiAocHJvcC5lZGl0b3JbXCJfX2Rlc3Ryb3llZFwiXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNWaXNpYmxlID0gcHJvcC5pc1Zpc2libGUodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCB0aGlzLnRhYmxlLmRvbS5jaGlsZHJlblsxXS5jaGlsZHJlbi5sZW5ndGg7IHIrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGUuZG9tLmNoaWxkcmVuWzFdLmNoaWxkcmVuW3JdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1tcInByb3BlcnR5TmFtZVwiXSA9PT0gcHJvcC5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gcm93O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocHJvcC5lZGl0b3IuY29tcG9uZW50LmRvbS5wYXJlbnROb2RlKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGxhYmVsKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHByb3AuZWRpdG9yLmNvbXBvbmVudC5kb20ucGFyZW50Tm9kZSkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQobGFiZWwpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgZGVsZXRlYnV0dG9uID0gcHJvcC5lZGl0b3IuY29tcG9uZW50LmRvbS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgdmFyIGxsID0gdGhpcy5nZXRQcm9wZXJ0eVZhbHVlKHByb3AsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAobGwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAkKGRlbGV0ZWJ1dHRvbikuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoZGVsZXRlYnV0dG9uKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKiAgICQocHJvcC5lZGl0b3IuY29tcG9uZW50LmRvbS5wYXJlbnROb2RlKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICQocHJvcC5lZGl0b3IuY29tcG9uZW50LmRvbS5wYXJlbnROb2RlKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICovXG4gICAgICAgICAgICAgICAgcHJvcC5lZGl0b3Iub2IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXRzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtub0RlZmF1bHRWYWx1ZV0gLSByZXR1cm5zIG5vIGRlZmF1bHQgdmFsdWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5OiBQcm9wZXJ0eSwgbm9EZWZhdWx0VmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZFByb3BlcnR5VmFsdWVGcm9tRGVzaWduKSB7XG4gICAgICAgICAgICBsZXQgcmV0ID0gdGhpcy5fdmFsdWVbcHJvcGVydHkubmFtZV07XG4gICAgICAgICAgICBpZiAocmV0ID09PSB1bmRlZmluZWQgJiYgIW5vRGVmYXVsdFZhbHVlKVxuICAgICAgICAgICAgICAgIHJldCA9IHByb3BlcnR5LmRlZmF1bHQ7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZCkgey8vcmVhZCBwcm9wZXJ0eVxuXG4gICAgICAgICAgICB2YXIgcjogc3RyaW5nID0gPHN0cmluZz50aGlzLmNvZGVDaGFuZ2VzW3Byb3BlcnR5Lm5hbWVdO1xuXG4gICAgICAgICAgICBpZiAociA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgPT09IHVuZGVmaW5lZCAmJiB0aGlzLl92YWx1ZVtwcm9wZXJ0eS5uYW1lXSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlW3Byb3BlcnR5Lm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmIChub0RlZmF1bHRWYWx1ZSAhPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LmRlZmF1bHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydHkubmFtZSA9PT0gXCJuZXdcIiAmJiB0aGlzLnZhcmlhYmxlbmFtZT8uc3RhcnRzV2l0aChcIm1lLlwiKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VyLmRhdGFbXCJtZVwiXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMucGFyc2VyLmRhdGFbXCJtZVwiXVt0aGlzLnZhcmlhYmxlbmFtZS5zdWJzdHJpbmcoMyldO1xuICAgICAgICAgICAgaWYgKHByb3AgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdmFyIGNvbnN0ciA9IHByb3BbMF0udmFsdWU7XG4gICAgICAgICAgICBpZiAoY29uc3RyLnN0YXJ0c1dpdGgoXCJ0eXBlZGVjbGFyYXRpb246XCIpICYmIHByb3AubGVuZ3RoID4gMSlcbiAgICAgICAgICAgICAgICBjb25zdHIgPSBwcm9wWzFdLnZhbHVlO1xuXG4gICAgICAgICAgICByZXQgPSBjb25zdHIuc3Vic3RyaW5nKGNvbnN0ci5pbmRleE9mKFwiKFwiKSArIDEsIGNvbnN0ci5sYXN0SW5kZXhPZihcIilcIikpO1xuICAgICAgICAgICAgaWYgKHJldCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICByZXQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMucGFyc2VyPy5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMudmFyaWFibGVuYW1lLCBwcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZCAmJiByZXQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLl92YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5fdmFsdWVbcHJvcGVydHkubmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAocmV0KSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmV0ID09PSB1bmRlZmluZWQgJiYgbm9EZWZhdWx0VmFsdWUgIT09IHRydWUpXG4gICAgICAgICAgICAgICAgcmV0ID0gcHJvcGVydHkuZGVmYXVsdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnVwZGF0ZVBhcnNlcigpO1xuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHksIG5vRGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAodGVzdCAhPT0gcmV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHVwZGF0ZUNvZGVFZGl0b3IoKSB7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci5ldmFsQ29kZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgdGhlIHBhcnNlclxuICAgICAqL1xuICAgIHVwZGF0ZVBhcnNlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRQcm9wZXJ0eUVkaXRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yLnVwZGF0ZVBhcnNlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLmNvZGVFZGl0b3IudmFsdWU7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIik7XG4gICAgICAgICAgICBpZiAodGV4dClcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlci5wYXJzZSh0ZXh0KTtcbiAgICAgICAgICAgIC8vIHRoaXMucGFyc2VyLnBhcnNlKHRleHQsIFt7IGNsYXNzbmFtZTogdmFsPy5jb25zdHJ1Y3Rvcj8ubmFtZSwgbWV0aG9kbmFtZTogXCJsYXlvdXRcIiB9LCB7IGNsYXNzbmFtZTogdW5kZWZpbmVkLCBtZXRob2RuYW1lOiBcInRlc3RcIiB9XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGRzIGFuIHJlcXVpcmVkIGZpbGUgdG8gdGhlIGNvZGVcbiAgICAgKi9cbiAgICBhZGRJbXBvcnRJZk5lZWRlZChuYW1lOiBzdHJpbmcsIGZpbGU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucGFyc2VyLmFkZEltcG9ydElmTmVlZGVkKG5hbWUsIGZpbGUpO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXRzIHRoZSBuZXh0IHZhcmlhYmxlbmFtZVxuICAgICAqICovXG4gICAgZ2V0TmV4dFZhcmlhYmxlTmFtZUZvclR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5nZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYWRkcyBhbiBQcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB0eXBlIC0gbmFtZSBvZiB0aGUgdHlwZSBvIGNyZWF0ZVxuICAgICAqIEBwYXJhbSBzY29wZW5hbWUgLSB0aGUgc2NvcGUge3ZhcmlhYmxlOiAsbWV0aG9kbmFtZTp9IHRvIGFkZCB0aGUgdmFyaWFibGUgLSBpZiBtaXNzaW5nIGxheW91dCgpIFxuICAgICAqIEByZXR1cm5zICB0aGUgbmFtZSBvZiB0aGUgb2JqZWN0XG4gICAgICovXG4gICAgYWRkVmFyaWFibGVJbkNvZGUodHlwZTogc3RyaW5nLCBzY29wZW5hbWU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9LHN1Z2dlc3RlZE5hbWU6c3RyaW5nPXVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgICAgIHZhciB2YWwgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwidGhpc1wiKTtcbiAgICAgICAgdmFyIHJldCA9IHRoaXMucGFyc2VyLmFkZFZhcmlhYmxlSW5Db2RlKHR5cGUsIHVuZGVmaW5lZCwgc2NvcGVuYW1lLHN1Z2dlc3RlZE5hbWUpO1xuICAgICAgIC8qIHZhciByZXQgPSB0aGlzLnBhcnNlci5hZGRWYXJpYWJsZUluQ29kZSh0eXBlLCBbeyBjbGFzc25hbWU6IHZhbD8uY29uc3RydWN0b3I/Lm5hbWUsIG1ldGhvZG5hbWU6IFwibGF5b3V0XCIgfSxcbiAgICAgICAgeyBjbGFzc25hbWU6IHVuZGVmaW5lZCwgbWV0aG9kbmFtZTogXCJ0ZXN0XCIgfV0sIHNjb3BlbmFtZSk7XG4gICAgICAgICovdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gdGhpcy5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFyc2VyKCk7XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBtb2RpZnkgdGhlIHByb3BlcnR5IGluIGNvZGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSB0aGUgcHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0aGUgbmV3IHZhbHVlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbcmVwbGFjZV0gIC0gaWYgdHJ1ZSB0aGUgb2xkIHZhbHVlIGlzIGRlbGV0ZWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhcmlhYmxlbmFtZV0gLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgLSBkZWZhdWx0PXRoaXMudmFyaWFibGVuYW1lXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtiZWZvcmVdIC0ge3ZhcmlhYmxlbmFtZSxwcm9wZXJ0eSx2YWx1ZT11bmRlZmluZWR9XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHNjb3BlIC0gdGhlIHNjb3BlIHt2YXJpYWJsZTogLG1ldGhvZG5hbWU6fSB0aGUgc2NvcGUgLSBpZiBtaXNzaW5nIGxheW91dCgpIFxuICAgICovXG4gICAgc2V0UHJvcGVydHlJbkNvZGUocHJvcGVydHk6IHN0cmluZywgdmFsdWUsIHJlcGxhY2U6IGJvb2xlYW4gPSB1bmRlZmluZWQsIHZhcmlhYmxlTmFtZTogc3RyaW5nID0gdW5kZWZpbmVkLFxuICAgICAgICBiZWZvcmU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlP30gPSB1bmRlZmluZWQsXG4gICAgICAgIHNjb3BlbmFtZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH0gPSB1bmRlZmluZWQsZG9VcGRhdGU9dHJ1ZSkge1xuXG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb2RlQ2hhbmdlc1twcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhcmlhYmxlTmFtZSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgICAgIHRoaXMuX211bHRpc2VsZWN0RWRpdG9yc1ttXS51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0uc2V0UHJvcGVydHlJbkNvZGUocHJvcGVydHksIHZhbHVlLCByZXBsYWNlLCB2YXJpYWJsZU5hbWUsIGJlZm9yZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvcDtcbiAgICAgICAgaWYgKHZhcmlhYmxlTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSB0aGlzLnZhcmlhYmxlbmFtZTtcbiAgICAgICAgICAgIHByb3AgPSB0aGlzLl92YWx1ZVtwcm9wZXJ0eV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZSh2YXJpYWJsZU5hbWUpW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNGdW5jdGlvbiA9ICh0eXBlb2YgKHByb3ApID09PSBcImZ1bmN0aW9uXCIpO1xuICAgICAgICB2YXIgdmFsID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIik7XG4gICAgICAgIHRoaXMucGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKHZhcmlhYmxlTmFtZSwgcHJvcGVydHksIHZhbHVlLFxuICAgICAgICAgICAgLypbeyBjbGFzc25hbWU6IHZhbD8uY29uc3RydWN0b3I/Lm5hbWUsIG1ldGhvZG5hbWU6IFwibGF5b3V0XCIgfSwgeyBjbGFzc25hbWU6IHVuZGVmaW5lZCwgbWV0aG9kbmFtZTogXCJ0ZXN0XCIgfV0qL3VuZGVmaW5lZCxcbiAgICAgICAgICAgIGlzRnVuY3Rpb24sIHJlcGxhY2UsIGJlZm9yZSwgc2NvcGVuYW1lKTtcbiAgICAgICAgaWYoZG9VcGRhdGUpe1xuICAgICAgICAgICAgLy9jb3JyZWN0IHNwYWNlc1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmluZGV4T2YgJiYgdmFsdWUuaW5kZXhPZihcIlxcblwiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gdGhpcy5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRoaXMucGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBtb2RpZnkgdGhlIHByb3BlcnR5IGluIGRlc2lnblxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0aGUgbmV3IHZhbHVlXG4gICAgKi9cbiAgICBzZXRQcm9wZXJ0eUluRGVzaWduKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnNldFByb3BlcnR5SW5EZXNpZ24ocHJvcGVydHksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwibmV3XCIgJiYgdGhpcy52YXJpYWJsZW5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5jb2RlRWRpdG9yLmV2YWxDb2RlKCk7XG4gICAgICAgICAgICAvLyAgdmFyIHRlc3Q9dGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZSh0aGlzLnZhcmlhYmxlbmFtZSk7XG4gICAgICAgICAgICAvLyAgdGhpcy52YWx1ZT10aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHRoaXMudmFyaWFibGVuYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mICh0aGlzLl92YWx1ZVtwcm9wZXJ0eV0pID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICB0aGlzLl92YWx1ZVtwcm9wZXJ0eV0odmFsdWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl92YWx1ZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnb3RvIHNvdXJjZSBwb3NpdGlvblxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAtIGluIENvZGVcbiAgICAgKi9cbiAgICBnb3RvQ29kZVBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yLmdvdG9Db2RlUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3Iudmlld21vZGUgPSBcImNvZGVcIjtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnNldEN1cnNvclBvcml0aW9uKHBvc2l0aW9uKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnb3RvIHNvdXJjZSBsaW5lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxpbmUgLSBsaW5lIGluIENvZGVcbiAgICAgKi9cbiAgICBnb3RvQ29kZUxpbmUobGluZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRQcm9wZXJ0eUVkaXRvci5nb3RvQ29kZUxpbmUobGluZSk7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci52aWV3bW9kZSA9IFwiY29kZVwiO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3IuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogbGluZSwgY29sdW1uOiAyMDAgfTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiByZW5hbWVzIGEgdmFyaWFibGUgaW4gY29kZVxuICAgICAqL1xuICAgIHJlbmFtZVZhcmlhYmxlSW5Db2RlKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5jb2RlRWRpdG9yLnZhbHVlO1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBmb3VuZCA9IHRydWU7XG4gICAgICAgIGlmIChvbGROYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpXG4gICAgICAgICAgICBvbGROYW1lID0gb2xkTmFtZS5zdWJzdHJpbmcoMyk7XG4gICAgICAgIGlmIChuZXdOYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpXG4gICAgICAgICAgICBuZXdOYW1lID0gbmV3TmFtZS5zdWJzdHJpbmcoMyk7XG4gICAgICAgIGlmIChvbGROYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSlcbiAgICAgICAgICAgIG9sZE5hbWUgPSBvbGROYW1lLnN1YnN0cmluZyg1KTtcbiAgICAgICAgaWYgKG5ld05hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKVxuICAgICAgICAgICAgbmV3TmFtZSA9IG5ld05hbWUuc3Vic3RyaW5nKDUpO1xuICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIlxcXFxXXCIgKyBvbGROYW1lICsgXCJcXFxcV1wiKTtcbiAgICAgICAgd2hpbGUgKGZvdW5kID09IHRydWUpIHtcbiAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKHJlZywgZnVuY3Rpb24gcmVwbGFjZXIobWF0Y2gsIG9mZnNldCwgc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gcDEgaXMgbm9uZGlnaXRzLCBwMiBkaWdpdHMsIGFuZCBwMyBub24tYWxwaGFudW1lcmljc1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDAsIDEpICsgbmV3TmFtZSArIG1hdGNoLnN1YnN0cmluZyhtYXRjaC5sZW5ndGggLSAxLCBtYXRjaC5sZW5ndGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gY29kZTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlbmFtZXMgYSB2YXJpYWJsZSBpbiBkZXNpZ25cbiAgICAgKi9cbiAgICByZW5hbWVWYXJpYWJsZUluRGVzaWduKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci5yZW5hbWVWYXJpYWJsZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiByZW1vdmVzIHRoZSB2YXJpYWJsZSBmcm9tIGRlc2lnblxuICAgICogQHBhcmFtICB2YXJuYW1lIC0gdGhlIHZhcmlhYmxlIHRvIHJlbW92ZVxuICAgICovXG4gICAgcmVtb3ZlVmFyaWFibGVJbkRlc2lnbih2YXJuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgLy9UT0RPIHRoaXMgdW5kIHZhcj9cbiAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSAmJiB0aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwibWVcIikpIHtcbiAgICAgICAgICAgIHZhciB2bmFtZSA9IHZhcm5hbWUuc3Vic3RyaW5nKDMpO1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcIm1lXCIpO1xuICAgICAgICAgICAgZGVsZXRlIG1lW3ZuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvZGVFZGl0b3IucmVtb3ZlVmFyaWFibGVJbkRlc2lnbih2YXJuYW1lKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiByZW1vdmVzIHRoZSB2YXJpYWJsZSBmcm9tIGNvZGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFybmFtZSAtIHRoZSB2YXJpYWJsZSB0byByZW1vdmVcbiAgICAgKi9cbiAgICByZW1vdmVWYXJpYWJsZXNJbkNvZGUodmFybmFtZTogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcnNlci5yZW1vdmVWYXJpYWJsZXNJbkNvZGUodmFybmFtZSk7IFxuICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogcmVtb3ZlcyB0aGUgcHJvcGVydHkgZnJvbSBjb2RlXG4gICAgKiBAcGFyYW0ge3R5cGV9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIHJlbW92ZVxuICAgICogQHBhcmFtIHt0eXBlfSBbb25seVZhbHVlXSAtIHJlbW92ZSB0aGUgcHJvcGVydHkgb25seSBpZiB0aGUgdmFsdWUgaXMgZm91bmRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVuYW1lXSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSAtIGRlZmF1bHQ9dGhpcy52YXJpYWJsZW5hbWVcbiAgICAqL1xuICAgIHJlbW92ZVByb3BlcnR5SW5Db2RlKHByb3BlcnR5OiBzdHJpbmcsIG9ubHlWYWx1ZSA9IHVuZGVmaW5lZCwgdmFyaWFibGVuYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQsIGRvdXBkYXRlID0gdHJ1ZSkge1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvZGVDaGFuZ2VzW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3ZhbHVlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0udXBkYXRlUGFyc2VyKCk7XG4gICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0ucmVtb3ZlUHJvcGVydHlJbkNvZGUocHJvcGVydHksIG9ubHlWYWx1ZSwgdmFyaWFibGVuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJpYWJsZW5hbWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHZhcmlhYmxlbmFtZSA9IHRoaXMudmFyaWFibGVuYW1lO1xuICAgICAgICBpZiAoZG91cGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFyc2VyKCk7Ly9ub3R3ZW5kaWc/XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IHRoaXMucGFyc2VyLnJlbW92ZVByb3BlcnR5SW5Db2RlKHByb3BlcnR5LCBvbmx5VmFsdWUsIHZhcmlhYmxlbmFtZSk7XG4gICAgICAgIGlmIChkb3VwZGF0ZSkge1xuICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgICAgIHRoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRleHQ7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhcnNlcigpO1xuICAgICAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICAvKipcbiAgICAqIHJlbW92ZXMgdGhlIHByb3BlcnR5IGluIGRlc2lnblxuICAgICovXG4gICAgcmVtb3ZlUHJvcGVydHlJbkRlc2lnbihwcm9wZXJ0eTogc3RyaW5nKSB7XG4gICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0ucmVtb3ZlUHJvcGVydHlJbkRlc2lnbihwcm9wZXJ0eSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5fdmFsdWVbcHJvcGVydHldKSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgdGhpcy5fdmFsdWVbcHJvcGVydHldKHVuZGVmaW5lZCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZVtwcm9wZXJ0eV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9IGNhdGNoIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3ZhbHVlW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxheW91dChtZSA9IHVuZGVmaW5lZCkge1xuXG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgIH1cbn1cbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yVGVzdFN1YlByb3BlcnRpZXNcIilcbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eUVkaXRvclRlc3RTdWJQcm9wZXJ0aWVzIHtcbiAgICBAJFByb3BlcnR5KClcbiAgICBudW06IG51bWJlciA9IDE5O1xuICAgIEAkUHJvcGVydHkoKVxuICAgIHRleHQ6IHN0cmluZyA9IFwicHJvcFwiO1xufVxuXG5cblxuQCRDbGFzcyhcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JUZXN0UHJvcGVydGllc1wiKVxuY2xhc3MgVGVzdFByb3BlcnRpZXMge1xuICAgIEAkUHJvcGVydHkoeyBkZWNyaXB0aW9uOiBcIm5hbWUgb2YgdGhlIGRpYWxvZ1wiLCB9KVxuICAgIGRpYWxvZ25hbWU6IHN0cmluZztcbiAgICBAJFByb3BlcnR5KClcbiAgICBjaGVja2VkOiBib29sZWFuO1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImNvbG9yXCIgfSlcbiAgICBjb2xvcjogc3RyaW5nO1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImNvbXBvbmVudHNlbGVjdG9yXCIsIGNvbXBvbmVudFR5cGU6IFwiamFzc2kudWkuQ29tcG9uZW50XCIgfSlcbiAgICBjb21wb25lbnQ6IENvbXBvbmVudDtcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJkYXRhYmluZGVyXCIgfSlcbiAgICBkYXRhYmluZGVyOiBhbnk7XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwiZGJvYmplY3RcIiwgY29tcG9uZW50VHlwZTogXCJkZS5LdW5kZVwiIH0pXG4gICAgZGJvYmplY3Q7XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IDgwIH0pXG4gICAgbnVtOiBudW1iZXI7XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwiZm9udFwiIH0pXG4gICAgZm9udDogbnVtYmVyO1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImZ1bmN0aW9uXCIgfSlcbiAgICBmdW5jKGFueSkge1xuXG4gICAgfTtcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJodG1sXCIgfSlcbiAgICBodG1sOiBzdHJpbmcgPSBcInNhbXBsZVwiO1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImltYWdlXCIgfSlcbiAgICBpbWFnZTogc3RyaW5nO1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImpzb25cIiwgY29tcG9uZW50VHlwZTogXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yVGVzdFN1YlByb3BlcnRpZXNcIiB9KVxuICAgIGpzb246IGFueTtcblxufVxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJldCA9IG5ldyBQcm9wZXJ0eUVkaXRvcigpO1xuICAgIHJldC52YWx1ZSA9IG5ldyBUZXN0UHJvcGVydGllcygpO1xuICAgIHJldHVybiByZXQ7XG59Il19