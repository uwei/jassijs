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
                this._value = value[0];
            }
            else
                this._value = value;
            if (value === []) {
                this._value = undefined;
                return;
            }
            if (this.codeEditor !== undefined && this.parentPropertyEditor === undefined)
                this.variablename = this.codeEditor.getVariableFromObject(this._value);
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
            var _a;
            var props = [];
            /* if (this.parentPropertyEditor !== undefined)
                 this._addParentEditorProperties(this.parentPropertyEditor, props, this.variablename);
             else*/ {
                if (this.showThisProperties !== undefined)
                    props = this.showThisProperties;
                else {
                    if (!this._value)
                        props = [];
                    else
                        props = (_a = ComponentDescriptor_1.ComponentDescriptor.describe(this._value.constructor)) === null || _a === void 0 ? void 0 : _a.fields;
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
            var _a;
            if (this.codeEditor === undefined)
                return;
            if (this.parentPropertyEditor !== undefined) {
                this.parentPropertyEditor.updateParser();
            }
            else {
                var text = this.codeEditor.value;
                var val = this.codeEditor.getObjectFromVariable("this");
                if (text)
                    this.parser.parse(text, [{ classname: (_a = val === null || val === void 0 ? void 0 : val.constructor) === null || _a === void 0 ? void 0 : _a.name, methodname: "layout" }, { classname: undefined, methodname: "test" }]);
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
        addVariableInCode(type, scopename) {
            var _a;
            var val = this.codeEditor.getObjectFromVariable("this");
            var ret = this.parser.addVariableInCode(type, [{ classname: (_a = val === null || val === void 0 ? void 0 : val.constructor) === null || _a === void 0 ? void 0 : _a.name, methodname: "layout" },
                { classname: undefined, methodname: "test" }], scopename);
            this.codeEditor.value = this.parser.getModifiedCode();
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
        setPropertyInCode(property, value, replace = undefined, variableName = undefined, before = undefined, scopename = undefined) {
            var _a;
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
            this.parser.setPropertyInCode(variableName, property, value, [{ classname: (_a = val === null || val === void 0 ? void 0 : val.constructor) === null || _a === void 0 ? void 0 : _a.name, methodname: "layout" }, { classname: undefined, methodname: "test" }], isFunction, replace, before, scopename);
            //correct spaces
            if (value && value.indexOf("\n") > -1) {
                this.codeEditor.value = this.parser.getModifiedCode();
                this.updateParser();
            }
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
            this.callEvent("codeChanged", {});
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
            if (varname.startsWith("me.")) {
                var vname = varname.substring(3);
                var me = this.codeEditor.getObjectFromVariable("me");
                delete me[vname];
            }
        }
        /**
         * removes the variable from code
         * @param {string} varname - the variable to remove
         */
        removeVariableInCode(varname) {
            if (this.codeEditor === undefined) {
                this.callEvent("codeChanged", {});
                return;
            }
            this.parser.removeVariableInCode(varname);
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
        removePropertyInCode(property, onlyValue = undefined, variablename = undefined) {
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
            this.updateParser();
            ; //notwendig?
            this.parser.removePropertyInCode(property, onlyValue, variablename);
            var text = this.parser.getModifiedCode();
            this.codeEditor.value = text;
            this.updateParser();
            this.callEvent("codeChanged", {});
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
        Jassi_1.$Class("jassijs.ui.PropertyEditor"),
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
        Property_1.$Property(),
        __metadata("design:type", Number)
    ], PropertyEditorTestSubProperties.prototype, "num", void 0);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String)
    ], PropertyEditorTestSubProperties.prototype, "text", void 0);
    PropertyEditorTestSubProperties = __decorate([
        Jassi_1.$Class("jassijs.ui.PropertyEditorTestSubProperties")
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
        Property_1.$Property({ decription: "name of the dialog", }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean)
    ], TestProperties.prototype, "checked", void 0);
    __decorate([
        Property_1.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "color", void 0);
    __decorate([
        Property_1.$Property({ type: "componentselector", componentType: "jassi.ui.Component" }),
        __metadata("design:type", typeof (_a = typeof Component_1.Component !== "undefined" && Component_1.Component) === "function" ? _a : Object)
    ], TestProperties.prototype, "component", void 0);
    __decorate([
        Property_1.$Property({ type: "databinder" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "databinder", void 0);
    __decorate([
        Property_1.$Property({ type: "dbobject", componentType: "de.Kunde" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "dbobject", void 0);
    __decorate([
        Property_1.$Property({ default: 80 }),
        __metadata("design:type", Number)
    ], TestProperties.prototype, "num", void 0);
    __decorate([
        Property_1.$Property({ type: "font" }),
        __metadata("design:type", Number)
    ], TestProperties.prototype, "font", void 0);
    __decorate([
        Property_1.$Property({ type: "function" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TestProperties.prototype, "func", null);
    __decorate([
        Property_1.$Property({ type: "html" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "html", void 0);
    __decorate([
        Property_1.$Property({ type: "image" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "image", void 0);
    __decorate([
        Property_1.$Property({ type: "json", componentType: "jassijs.ui.PropertyEditorTestSubProperties" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "json", void 0);
    TestProperties = __decorate([
        Jassi_1.$Class("jassijs.ui.PropertyEditorTestProperties")
    ], TestProperties);
    function test() {
        var ret = new PropertyEditor();
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvcGVydHlFZGl0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBa0JBLElBQWEsY0FBYyxzQkFBM0IsTUFBYSxjQUFlLFNBQVEsYUFBSztRQVlyQzs7VUFFRTtRQUNGLFlBQVksVUFBVSxHQUFDLFNBQVMsRUFBQyxNQUFNLEdBQUMsU0FBUztZQUM3QyxLQUFLLEVBQUUsQ0FBQztZQWZaLGdDQUEyQixHQUFZLEtBQUssQ0FBQztZQVU3QyxnQkFBVyxHQUF3QyxFQUFFLENBQUM7WUFNbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDO1lBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O3FDQVlXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUN6QixDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUV2RCwrREFBK0Q7WUFDL0QsK0JBQStCO1lBQy9CLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkOzs7aUJBR0s7WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixxREFBcUQ7WUFFckQseURBQXlEO1lBQ3pELElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLGlFQUFpRTtZQUNqRSxJQUFJLENBQUMs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QUMsQ0FBQzs7aURBQ2I7SUFFYjtRQURDLG9CQUFTLENBQUMsRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyw0Q0FBNEMsRUFBQyxDQUFDOztnREFDM0U7SUExQlAsY0FBYztRQURuQixjQUFNLENBQUMseUNBQXlDLENBQUM7T0FDNUMsY0FBYyxDQTRCbkI7SUFDRCxTQUFnQixJQUFJO1FBQ2hCLElBQUksR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDL0IsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUpELG9CQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgXCJqYXNzaWpzL2Jhc2UvUHJvcGVydHlFZGl0b3JTZXJ2aWNlXCI7XG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiamFzc2lqcy91aS9CdXR0b25cIjtcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci91dGlsL1BhcnNlclwiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwiamFzc2lqcy91aS9JbWFnZVwiO1xuXG5pbXBvcnQgeyBUb29scyB9IGZyb20gXCJqYXNzaWpzL3V0aWwvVG9vbHNcIjtcbmltcG9ydCByZWdpc3RyeSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcbmltcG9ydCB7IENvbXBvbmVudERlc2NyaXB0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnREZXNjcmlwdG9yXCI7XG5pbXBvcnQgeyBOYW1lRWRpdG9yIH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL05hbWVFZGl0b3JcIjtcbmltcG9ydCB7IHByb3BlcnR5ZWRpdG9yIH0gZnJvbSBcImphc3NpanMvYmFzZS9Qcm9wZXJ0eUVkaXRvclNlcnZpY2VcIjtcbmltcG9ydCB7IFByb3BlcnR5LCAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL0VkaXRvclwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiamFzc2lqcy91aS9Db250YWluZXJcIjtcblxuQCRDbGFzcyhcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JcIilcbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eUVkaXRvciBleHRlbmRzIFBhbmVsIHtcbiAgICByZWFkUHJvcGVydHlWYWx1ZUZyb21EZXNpZ246IGJvb2xlYW4gPSBmYWxzZTtcbiAgICB0YWJsZTogUGFuZWw7XG4gICAgY29kZUVkaXRvcjtcbiAgICBwYXJzZXI6IFBhcnNlcjtcbiAgICB2YXJpYWJsZW5hbWU6IHN0cmluZztcbiAgICBwYXJlbnRQcm9wZXJ0eUVkaXRvcjogUHJvcGVydHlFZGl0b3I7XG4gICAgX211bHRpc2VsZWN0RWRpdG9yczogUHJvcGVydHlFZGl0b3JbXTtcbiAgICBzaG93VGhpc1Byb3BlcnRpZXM7XG4gICAgcHJvcGVydGllcztcbiAgICBfdmFsdWU7XG4gICAgY29kZUNoYW5nZXM6IHsgW3Byb3BlcnR5OiBzdHJpbmddOiBzdHJpbmcgfCB7fSB9ID0ge307XG4gICAgLyoqXG4gICAgKiBlZGl0IG9iamVjdCBwcm9wZXJ0aWVzXG4gICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb2RlRWRpdG9yPXVuZGVmaW5lZCxwYXJzZXI9dW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudGFibGUgPSBuZXcgUGFuZWwoKTtcbiAgICAgICAgdGhpcy5wYXJzZXI9cGFyc2VyO1xuICAgICAgICB0aGlzLnRhYmxlLmluaXQoJChgPHRhYmxlIHN0eWxlPVwidGFibGUtbGF5b3V0OiBmaXhlZDtmb250LXNpemU6MTFweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicHJvcGVydHllZGl0b3JoZWFkZXJcIj5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInByb3BlcnR5ZWRpdG9yaGVhZGVyXCI+VmFsdWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9XCJwcm9wZXJ0eWVkaXRvcnJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkID5hMTwvdGQ+PHRkPmIxPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+YClbMF0pO1xuICAgICAgICB0aGlzLmFkZCh0aGlzLnRhYmxlKTtcbiAgICAgICAgdGhpcy50YWJsZS53aWR0aCA9IFwiOTglXCI7XG4gICAgICAgICQoXCIucHJvcGVydHllZGl0b3JoZWFkZXJcIikucmVzaXphYmxlKHsgaGFuZGxlczogXCJlXCIgfSk7XG5cbiAgICAgICAgLy8gICAgICAgICAgICAkKCBcIi5wcm9wZXJ0eWVkaXRvcmhlYWRlclwiICkuY3NzKFwiaGVpZ2h0XCIsXCI4cHhcIik7XG4gICAgICAgIC8vJCh0aGlzLmRvbSkuY3NzKFwiaGVpZ2h0XCIsXCJcIik7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgICAgLyoqIFxuICAgICAgICAgKiBAbWVtYmVyIHtqYXNzaWpzX2VkaXRvci5Db2RlRWRpdG9yfSAtIHRoZSBwYXJlbnQgQ29kZUVkaXRvclxuICAgICAgICAgKiBpZiB1bmRlZmluZWQgLSBubyBjb2RlIGNoYW5nZXMgd291bGQgYmUgZG9uZSBcbiAgICAgICAgICogKi9cbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yID0gY29kZUVkaXRvcjtcbiAgICAgICAgLyoqIEBtZW1iZXIge2phc3NpanMuYmFzZS5QYXJzZXJ9IC0gdGhlIGNvZGUtcGFyc2VyKi9cbiAgXG4gICAgICAgIC8qKiBAbWVtYmVyIHtzdHJpbmd9IC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIGluIGNvZGUqL1xuICAgICAgICB0aGlzLnZhcmlhYmxlbmFtZSA9IFwiXCI7XG4gICAgICAgIC8qKiBAbWVtYmVyIHtqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yfSAtIHBhcmVudCBwcm9wZXJ0eWVkaXRvciovXG4gICAgICAgIHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3I7XG4gICAgICAgIC8qKiBAbWVtYmVyIHtbamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcl19IC0gaWYgbXVsdGlzZWxlY3QgLSB0aGUgcHJvcGVydHllZGl0b3JzIG9mIHRoZSBvdGhlciBlbGVtZW50cyovXG4gICAgICAgIHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycztcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBhZGRzIGEgbmV3IHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgIC0gdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5FZGl0b3J9IGVkaXRvciAtIHRoZSBwcm9wZXJ0eWVkaXRvciB0byByZW5kZXIgdGhlIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIC0gdGhlIHRoZSBkZXNjcmlwdGlvbiBpcyB0b29sdGlwIG92ZXIgdGhlIG5hbWVcbiAgICAgKi9cbiAgICBhZGRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIGVkaXRvcjogRWRpdG9yLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBlZGl0b3IuZ2V0Q29tcG9uZW50KCk7XG4gICAgICAgIHZhciByb3cgPSAkKCc8dHIgbm93cmFwIGNsYXNzPVwicHJvcGVydHllZGl0b3Jyb3dcIj48dGQgIHN0eWxlPVwiZm9udC1zaXplOjExcHhcIiBub3dyYXAgdGl0bGU9XCInICsgZGVzY3JpcHRpb24gKyAnXCI+JyArIG5hbWUgKyAnPC90ZD48dGQgY2xhc3M9XCJwcm9wZXJ0eXZhbHVlXCIgIG5vd3JhcD48L3RkPjwvdHI+JylbMF07XG4gICAgICAgIHZhciBkZWxldGVidXR0b24gPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgZGVsZXRlYnV0dG9uLnNyYyA9IFwibWRpIG1kaS1kZWxldGUtZm9yZXZlci1vdXRsaW5lXCI7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGRlbGV0ZWJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLnJlbW92ZVByb3BlcnR5SW5EZXNpZ24obmFtZSk7XG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVQcm9wZXJ0eUluQ29kZShuYW1lKTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZVBhcnNlcigpO1xuICAgICAgICAgICAgX3RoaXMudmFsdWUgPSBfdGhpcy52YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChyb3cuY2hpbGRyZW5bMF0pLnRvb2x0aXAoKTtcbiAgICAgICAgLy8gJChyb3cuY2hpbGRyZW5bMF0pLmNzcyhcImZvbnQtc2l6ZVwiLCBcIjExcHhcIik7XG5cbiAgICAgICAgJChyb3cuY2hpbGRyZW5bMF0pLnByZXBlbmQoZGVsZXRlYnV0dG9uLmRvbSk7XG4gICAgICAgIC8vJChjb21wb25lbnQuZG9tKS5jc3MoXCJmb250LXNpemVcIiwgXCIxMXB4XCIpO1xuICAgICAgICB0aGlzLnRhYmxlLmRvbS5jaGlsZHJlblsxXS5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICByb3dbXCJwcm9wZXJ0eU5hbWVcIl09bmFtZTtcbiAgICAgICAgcm93W1wiX2NvbXBvbmVudHNcIl0gPSBbZWRpdG9yLCBkZWxldGVidXR0b25dO1xuICAgICAgICAvKiAkKGNvbXBvbmVudC5kb20pLmNzcyh7XG4gICAgICAgICAgICAgXCJ3aWR0aFwiOlwiMTAwJVwiLFxuICAgICAgICAgICAgIFwicGFkZGluZ1wiOlwiaW5pdGlhbFwiLFxuICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6XCIxMXB4XCJcbiAgICAgICAgIH0pOyovXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHJvdy5jaGlsZHJlblsxXS5hcHBlbmRDaGlsZChjb21wb25lbnQuZG9tKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAvL1doeVxuICAgICAgICAgICAgLy9kZWJ1Z2dlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiByZWdpc3RlciBhbiBldmVudCBpZiB0aGUgcHJvcGVydHkgaGFzIGNoYW5nZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIG9uIGNoYW5nZVxuICAgICAqL1xuICAgIG9uY29kZUNoYW5nZWQoaGFuZGxlcikge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KFwiY29kZUNoYW5nZWRcIiwgaGFuZGxlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIGFuIGV2ZW50IGlmIHRoZSBwcm9wZXJ0eSBoYXMgY2hhbmdlZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSB0aGUgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb24gY2hhbmdlXG4gICAgICovXG4gICAgb25wcm9wZXJ0eUNoYW5nZWQoaGFuZGxlcikge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KFwicHJvcGVydHlDaGFuZ2VkXCIsIGhhbmRsZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBkZWxldGUgYWxsIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdmFyIHRycyA9ICQodGhpcy5kb20pLmZpbmQoXCIucHJvcGVydHllZGl0b3Jyb3dcIik7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdHJzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gdHJzW3hdO1xuICAgICAgICAgICAgaWYgKHJvd1tcIl9jb21wb25lbnRzXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHJvd1tcIl9jb21wb25lbnRzXCJdLmxlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd1tcIl9jb21wb25lbnRzXCJdW2NdW1wiX19kZXN0cm95ZWRcIl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByb3dbXCJfY29tcG9uZW50c1wiXVtjXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChyb3cpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgKiBpZiBwYXJlbnRQcm9wZXJ0eUVkaXRvciBpcyBkZWZpbmVkIHRoZW4gdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSBtdXN0IGJlIHN1YnN0aXR1dGVkXG4gICAqIEBwYXJhbSB7amFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvciBwcm9wZXJ0eUVkaXRvclxuICAgKiBAcGFyYW0ge1tvcGplY3R9IHByb3BzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wbmFtZSB0aGUgcHJvcGVydHlOYW1lXG4gICAqL1xuICAgIC8qIF9nZXRQYXJlbnRFZGl0b3JWYWx1ZShwcm9wZXJ0eUVkaXRvcixvYixwcm9wbmFtZSl7XG4gICAgICAgICBcbiAgICAgfSovXG4gICAgLyoqXG4gICAgICogaWYgcGFyZW50UHJvcGVydHlFZGl0b3IgaXMgZGVmaW5lZCB0aGVuIHRoZSBwcm9wZXJ0aWVzIGFyZSBkZWZpbmVkIHRoZXJlXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yIHByb3BlcnR5RWRpdG9yXG4gICAgICogQHBhcmFtIHtbb3BqZWN0fSBwcm9wc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wbmFtZSB0aGUgcHJvcGVydHlOYW1lXG4gICAgXG4gICAgX2FkZFBhcmVudEVkaXRvclByb3BlcnRpZXMocHJvcGVydHlFZGl0b3IsIHByb3BzLCBwcm9wbmFtZSkge1xuICAgICAgICBpZiAocHJvcGVydHlFZGl0b3IucGFyZW50UHJvcGVydHlFZGl0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX2FkZFBhcmVudEVkaXRvclByb3BlcnRpZXMocHJvcGVydHlFZGl0b3IucGFyZW50UHJvcGVydHlFZGl0b3IsIHByb3BzLCBwcm9wZXJ0eUVkaXRvci52YXJpYWJsZW5hbWUgKyBcIi9cIiArIHByb3BuYW1lKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmV0O1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1RoaXNQcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXQgPSBUb29scy5jb3B5T2JqZWN0KHRoaXMuc2hvd1RoaXNQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHJldCA9IENvbXBvbmVudERlc2NyaXB0b3IuZGVzY3JpYmUocHJvcGVydHlFZGl0b3IudmFsdWUuY29uc3RydWN0b3IsIHRydWUpLmZpZWxkcztcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwO3ggPCByZXQubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgICAgIGlmIChyZXRbeF0ubmFtZS5zdGFydHNXaXRoKHByb3BuYW1lICsgXCIvXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmV0W3hdLm5hbWUuc3Vic3RyaW5nKChwcm9wbmFtZSArIFwiL1wiKS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdC5pbmRleE9mKFwiL1wiKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFt4XS5uYW1lID0gdGVzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLnB1c2gocmV0W3hdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSAqL1xuICAgIC8qKlxuICAgICAqIGdldCBhbGwga25vd24gaW5zdGFuY2VzIGZvciB0eXBlXG4gICAgICogQHBhcmFtIHt0eXBlfSB0eXBlIC0gdGhlIHR5cGUgd2UgYXJlIGludGVyZXN0ZWRcbiAgICAgKiBAcmV0dXJucyB7W3N0cmluZ119XG4gICAgICovXG4gICAgZ2V0VmFyaWFibGVzRm9yVHlwZSh0eXBlKSB7XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFyaWFibGVzRm9yVHlwZSh0eXBlKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIHZhcmlhYmxlbmFtZSBvZiBhbiBvYmplY3RcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2IgLSB0aGUgb2JqZWN0IHRvIHNlYXJjaFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9iKSB7XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9iKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAqIGdldHMgdGhlIG5hbWUgb2JqZWN0IG9mIHRoZSBnaXZlbiB2YXJpYWJlbFxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2IgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGVcbiAgICAgKiAgQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRPYmplY3RGcm9tVmFyaWFibGUob2IpIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUob2IpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9ICAtIHRoZSByZW5kZXJlZCBvYmplY3QgXG4gICAgICovXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl92YWx1ZSAmJiB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLmNvZGVDaGFuZ2VzID0ge307XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkIHx8IHZhbHVlPy5kb20gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCEkKHZhbHVlLmRvbSkuaXMoXCI6Zm9jdXNcIikpXG4gICAgICAgICAgICAgICAgJCh2YWx1ZS5kb20pLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUuY29uc3RydWN0b3IgPT09IHZhbHVlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvcilcbiAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlbmFtZSA9IHRoaXMuY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QodGhpcy5fdmFsdWUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMgPSBbXTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCB2YWx1ZS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBtdWx0aSA9IG5ldyBQcm9wZXJ0eUVkaXRvcih0aGlzLmNvZGVFZGl0b3IsdGhpcy5wYXJzZXIpO1xuICAgICAgICAgICAgICAgIG11bHRpLmNvZGVFZGl0b3IgPSB0aGlzLmNvZGVFZGl0b3I7XG4gICAgICAgICAgICAgICAgbXVsdGkucGFyZW50UHJvcGVydHlFZGl0b3IgPSB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yO1xuICAgICAgICAgICAgICAgIG11bHRpLnZhbHVlID0gdmFsdWVbeF07XG4gICAgICAgICAgICAgICAgbXVsdGkucGFyc2VyID0gdGhpcy5wYXJzZXI7XG4gICAgICAgICAgICAgICAgaWYgKG11bHRpLmNvZGVFZGl0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZW5hbWUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHZhbHVlW3hdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMucHVzaChtdWx0aSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlWzBdO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gW10pIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlbmFtZSA9IHRoaXMuY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QodGhpcy5fdmFsdWUpO1xuXG5cblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9pbml0VmFsdWUoKTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICB9XG4gICAgc3dhcENvbXBvbmVudHMoZmlyc3Q6IENvbXBvbmVudCwgc2Vjb25kOiBDb21wb25lbnQpIHtcbiAgICAgICAgLy9zd2FwIERlc2lnblxuICAgICAgICBpZiAoZmlyc3QuX3BhcmVudCAhPT0gc2Vjb25kLl9wYXJlbnQpXG4gICAgICAgICAgICB0aHJvdyBcInN3YXBlZCBjb21wb25lbnRzIG11c3QgaGF2ZSB0aGUgc2FtZSBwYXJlbnRcIlxuICAgICAgICB2YXIgcGFyZW50OiBDb250YWluZXIgPSBmaXJzdC5fcGFyZW50O1xuICAgICAgICB2YXIgaWZpcnN0ID0gcGFyZW50Ll9jb21wb25lbnRzLmluZGV4T2YoZmlyc3QpO1xuICAgICAgICB2YXIgaXNlY29uZCA9IHBhcmVudC5fY29tcG9uZW50cy5pbmRleE9mKHNlY29uZCk7XG4gICAgICAgIHZhciBkdW1teSA9ICQoXCI8ZGl2Lz5cIik7XG5cbiAgICAgICAgcGFyZW50Ll9jb21wb25lbnRzW2lmaXJzdF0gPSBzZWNvbmQ7XG4gICAgICAgIHBhcmVudC5fY29tcG9uZW50c1tpc2Vjb25kXSA9IGZpcnN0O1xuICAgICAgICAkKGZpcnN0LmRvbVdyYXBwZXIpLnJlcGxhY2VXaXRoKGR1bW15KTtcbiAgICAgICAgJChzZWNvbmQuZG9tV3JhcHBlcikucmVwbGFjZVdpdGgoJChmaXJzdC5kb21XcmFwcGVyKSk7XG4gICAgICAgIGR1bW15LnJlcGxhY2VXaXRoKCQoc2Vjb25kLmRvbVdyYXBwZXIpKTtcbiAgICAgICAgLy9zd2FwIENvZGVcbiAgICAgICAgdmFyIGZpcnN0bmFtZSA9IHRoaXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGZpcnN0KTtcbiAgICAgICAgdmFyIHNlY29uZG5hbWUgPSB0aGlzLmdldFZhcmlhYmxlRnJvbU9iamVjdChzZWNvbmQpO1xuICAgICAgICB2YXIgcGFyZW50bmFtZSA9IHRoaXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHBhcmVudCk7XG4gICAgICAgIHRoaXMucGFyc2VyLnN3YXBQcm9wZXJ0eVdpdGhQYXJhbWV0ZXIocGFyZW50bmFtZSwgXCJhZGRcIiwgZmlyc3RuYW1lLCBzZWNvbmRuYW1lKTtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gdGhpcy5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFyc2VyKCk7XG4gICAgfVxuICAgIHByaXZhdGUgY29udHJvbEVkaXRvcihlZGl0b3IpIHtcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgZWRpdG9yLm9uZWRpdChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLmNhbGxFdmVudChcInByb3BlcnR5Q2hhbmdlZFwiLCBldmVudCk7XG4gICAgICAgICAgICBsZXQgZGVsZXRlYnV0dG9uID0gZWRpdG9yLmNvbXBvbmVudC5kb20ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgJChkZWxldGVidXR0b24pLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIF9pbml0VmFsdWUoKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IFtdO1xuICAgICAgIC8qIGlmICh0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9hZGRQYXJlbnRFZGl0b3JQcm9wZXJ0aWVzKHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IsIHByb3BzLCB0aGlzLnZhcmlhYmxlbmFtZSk7XG4gICAgICAgIGVsc2UqLyB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG93VGhpc1Byb3BlcnRpZXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBwcm9wcyA9IHRoaXMuc2hvd1RoaXNQcm9wZXJ0aWVzO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl92YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMgPSBbXTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHByb3BzID0gQ29tcG9uZW50RGVzY3JpcHRvci5kZXNjcmliZSh0aGlzLl92YWx1ZS5jb25zdHJ1Y3Rvcik/LmZpZWxkcztcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BzKVxuICAgICAgICAgICAgICAgICAgICBwcm9wcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vVE9ETyBjYWNoZSB0aGlzXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF90aGlzLnByb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgLypmb3IgKHZhciB4ID0gMDsgeCA8IHByb3BzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9wZXJ0aWVzW3Byb3BzW3hdLm5hbWVdID0geyBuYW1lOiBwcm9wc1t4XS5uYW1lLCBjb21wb25lbnQ6IHVuZGVmaW5lZCwgZGVzY3JpcHRpb246IHByb3BzW3hdLmRlc2NyaXB0aW9uIH07XG4gICAgICAgIH0qL1xuICAgICAgICB2YXIgYWxsUHJvcGVydGllczogeyBuYW1lOiBzdHJpbmcsIGVkaXRvcjogRWRpdG9yLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBpc1Zpc2libGU/OiAob2JqZWN0KSA9PiBib29sZWFuIH1bXSA9IFtdO1xuXG4gICAgICAgIGlmIChfdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIGhhc3Zhcm5hbWUgPSBfdGhpcy5nZXRWYXJpYWJsZUZyb21PYmplY3QoX3RoaXMuX3ZhbHVlKTtcbiAgICAgICAgICAgIGlmIChoYXN2YXJuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZUVkaXRvciA9IG5ldyBOYW1lRWRpdG9yKFwibmFtZVwiLCBfdGhpcyk7XG4gICAgICAgICAgICAgICAgLy9fdGhpcy5hZGRQcm9wZXJ0eShcIm5hbWVcIiwgbmFtZUVkaXRvciwgXCJ0aGUgbmFtZSBvZiB0aGUgY29tcG9uZW50XCIpO1xuICAgICAgICAgICAgICAgIC8vYWxsUHJvcGVydGllcy5wdXNoKHtuYW1lOlwibmFtZVwiLGVkaXRvcjpuYW1lRWRpdG9yLGRlc2NyaXB0aW9uOlwidGhlIG5hbWUgb2YgdGhlIGNvbXBvbmVudFwifSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcGVydGllc1tcIm5hbWVcIl0gPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwibmFtZVwiLCBlZGl0b3I6IG5hbWVFZGl0b3IsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcInRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnRcIiwgXCJjb21wb25lbnRcIjogbmFtZUVkaXRvci5nZXRDb21wb25lbnQoKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgLy9uYW1lRWRpdG9yLm9iID0gX3RoaXMuX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcHJvcHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1t4XS5uYW1lLmluZGV4T2YoXCIvXCIpID4gLTEpIHtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcGVydGllc1twcm9wc1t4XS5uYW1lXSA9IHsgaXNWaXNpYmxlOiBwcm9wc1t4XS5pc1Zpc2libGUsIG5hbWU6IHByb3BzW3hdLm5hbWUsIGNvbXBvbmVudDogdW5kZWZpbmVkLCBkZXNjcmlwdGlvbjogcHJvcHNbeF0uZGVzY3JpcHRpb24gfTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBwcm9wZXJ0eWVkaXRvci5jcmVhdGVGb3IocHJvcHNbeF0sIF90aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0b3Igbm90IGZvdW5kIGZvciBcIiArIF90aGlzLnZhcmlhYmxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc25hbWUgPSBlZGl0b3IucHJvcGVydHkubmFtZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xFZGl0b3IoZWRpdG9yKTtcbi8qICAgICAgICAgICAgICAgIGVkaXRvci5vbmVkaXQoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNhbGxFdmVudChcInByb3BlcnR5Q2hhbmdlZFwiLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWxldGVidXR0b24gPSBlZGl0b3IuY29tcG9uZW50LmRvbS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgICAgICQoZGVsZXRlYnV0dG9uKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgICAgICAgICAgLy9lZGl0b3Iub2IgPSBfdGhpcy5fdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnByb3BlcnRpZXNbZWRpdG9yLnByb3BlcnR5Lm5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wZXJ0eSBub3QgZm91bmQgXCIgKyBlZGl0b3IucHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcGVydGllc1tlZGl0b3IucHJvcGVydHkubmFtZV0uZWRpdG9yID0gZWRpdG9yO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IgIT09IHVuZGVmaW5lZCAmJiBfdGhpcy5wcm9wZXJ0aWVzW2VkaXRvci5wcm9wZXJ0eS5uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnByb3BlcnRpZXNbZWRpdG9yLnByb3BlcnR5Lm5hbWVdLmNvbXBvbmVudCA9IGVkaXRvci5nZXRDb21wb25lbnQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBfdGhpcy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IF90aGlzLnByb3BlcnRpZXNba2V5XTtcbiAgICAgICAgICAgIHZhciBkb0FkZCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IF90aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IF90aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0ucHJvcGVydGllc1twcm9wLm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIGRvQWRkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZG9BZGQpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5jb21wb25lbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgLy9fdGhpcy5hZGRQcm9wZXJ0eShwcm9wLm5hbWUsIHByb3AuZWRpdG9yLCBwcm9wLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgYWxsUHJvcGVydGllcy5wdXNoKHsgbmFtZTogcHJvcC5uYW1lLCBlZGl0b3I6IHByb3AuZWRpdG9yLCBkZXNjcmlwdGlvbjogcHJvcC5kZXNjcmlwdGlvbiwgaXNWaXNpYmxlOiBwcm9wLmlzVmlzaWJsZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5jbGVhcigpO1xuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IGFsbFByb3BlcnRpZXMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gYWxsUHJvcGVydGllc1twXTtcbiAgICAgICAgICAgIF90aGlzLmFkZFByb3BlcnR5KHByb3AubmFtZSwgcHJvcC5lZGl0b3IsIHByb3AuZGVzY3JpcHRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHVwZGF0ZXMgdmFsdWVzXG4gICAgICovXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgaWYgKHByb3AuZWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJQcm9wZXJ0eUVkaXRvciBmb3IgXCIgKyBrZXkgKyBcIiBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3NvbWV0aW1lcyB0aGUgY29tcG9uZW50IGlzIGFscmVhZHkgZGVsZXRlZCBlLmcucmVzaXplXG4gICAgICAgICAgICBpZiAocHJvcC5lZGl0b3JbXCJfX2Rlc3Ryb3llZFwiXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNWaXNpYmxlID0gcHJvcC5pc1Zpc2libGUodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbD11bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcj0wO3I8dGhpcy50YWJsZS5kb20uY2hpbGRyZW5bMV0uY2hpbGRyZW4ubGVuZ3RoO3IrKyApe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvdz10aGlzLnRhYmxlLmRvbS5jaGlsZHJlblsxXS5jaGlsZHJlbltyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJvd1tcInByb3BlcnR5TmFtZVwiXT09PXByb3AubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbD1yb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChwcm9wLmVkaXRvci5jb21wb25lbnQuZG9tLnBhcmVudE5vZGUpLmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQobGFiZWwpLmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocHJvcC5lZGl0b3IuY29tcG9uZW50LmRvbS5wYXJlbnROb2RlKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChsYWJlbCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBkZWxldGVidXR0b24gPSBwcm9wLmVkaXRvci5jb21wb25lbnQuZG9tLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICB2YXIgbGwgPSB0aGlzLmdldFByb3BlcnR5VmFsdWUocHJvcCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZGVsZXRlYnV0dG9uKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChkZWxldGVidXR0b24pLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qICAgJChwcm9wLmVkaXRvci5jb21wb25lbnQuZG9tLnBhcmVudE5vZGUpLmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgJChwcm9wLmVkaXRvci5jb21wb25lbnQuZG9tLnBhcmVudE5vZGUpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gKi9cbiAgICAgICAgICAgICAgICBwcm9wLmVkaXRvci5vYiA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldHMgdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW25vRGVmYXVsdFZhbHVlXSAtIHJldHVybnMgbm8gZGVmYXVsdCB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAqL1xuICAgIGdldFByb3BlcnR5VmFsdWUocHJvcGVydHk6IFByb3BlcnR5LCBub0RlZmF1bHRWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkUHJvcGVydHlWYWx1ZUZyb21EZXNpZ24pIHtcbiAgICAgICAgICAgIGxldCByZXQgPSB0aGlzLl92YWx1ZVtwcm9wZXJ0eS5uYW1lXTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IHVuZGVmaW5lZCAmJiAhbm9EZWZhdWx0VmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0ID0gcHJvcGVydHkuZGVmYXVsdDtcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKSB7Ly9yZWFkIHByb3BlcnR5XG5cbiAgICAgICAgICAgIHZhciByOiBzdHJpbmcgPSA8c3RyaW5nPnRoaXMuY29kZUNoYW5nZXNbcHJvcGVydHkubmFtZV07XG5cbiAgICAgICAgICAgIGlmIChyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJlbnRQcm9wZXJ0eUVkaXRvciA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX3ZhbHVlW3Byb3BlcnR5Lm5hbWVdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVbcHJvcGVydHkubmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKG5vRGVmYXVsdFZhbHVlICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuZGVmYXVsdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0eS5uYW1lID09PSBcIm5ld1wiICYmIHRoaXMudmFyaWFibGVuYW1lPy5zdGFydHNXaXRoKFwibWUuXCIpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJzZXIuZGF0YVtcIm1lXCJdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5wYXJzZXIuZGF0YVtcIm1lXCJdW3RoaXMudmFyaWFibGVuYW1lLnN1YnN0cmluZygzKV07XG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB2YXIgY29uc3RyID0gcHJvcFswXS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChjb25zdHIuc3RhcnRzV2l0aChcInR5cGVkZWNsYXJhdGlvbjpcIikgJiYgcHJvcC5sZW5ndGggPiAxKVxuICAgICAgICAgICAgICAgIGNvbnN0ciA9IHByb3BbMV0udmFsdWU7XG5cbiAgICAgICAgICAgIHJldCA9IGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSwgY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XG4gICAgICAgICAgICBpZiAocmV0ID09PSBcIlwiKVxuICAgICAgICAgICAgICAgIHJldCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5wYXJzZXI/LmdldFByb3BlcnR5VmFsdWUodGhpcy52YXJpYWJsZW5hbWUsIHByb3BlcnR5Lm5hbWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkICYmIHJldCA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX3ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLl92YWx1ZVtwcm9wZXJ0eS5uYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChyZXQpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXQgPT09IHVuZGVmaW5lZCAmJiBub0RlZmF1bHRWYWx1ZSAhPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICByZXQgPSBwcm9wZXJ0eS5kZWZhdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0udXBkYXRlUGFyc2VyKCk7XG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0uZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSwgbm9EZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0ICE9PSByZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgdXBkYXRlQ29kZUVkaXRvcigpIHtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLmV2YWxDb2RlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSB0aGUgcGFyc2VyXG4gICAgICovXG4gICAgdXBkYXRlUGFyc2VyKCkge1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IudXBkYXRlUGFyc2VyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMuY29kZUVkaXRvci52YWx1ZTtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwidGhpc1wiKTtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VyLnBhcnNlKHRleHQsIFt7IGNsYXNzbmFtZTogdmFsPy5jb25zdHJ1Y3Rvcj8ubmFtZSwgbWV0aG9kbmFtZTogXCJsYXlvdXRcIiB9LCB7IGNsYXNzbmFtZTogdW5kZWZpbmVkLCBtZXRob2RuYW1lOiBcInRlc3RcIiB9XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGRzIGFuIHJlcXVpcmVkIGZpbGUgdG8gdGhlIGNvZGVcbiAgICAgKi9cbiAgICBhZGRJbXBvcnRJZk5lZWRlZChuYW1lOiBzdHJpbmcsIGZpbGU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucGFyc2VyLmFkZEltcG9ydElmTmVlZGVkKG5hbWUsIGZpbGUpO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXRzIHRoZSBuZXh0IHZhcmlhYmxlbmFtZVxuICAgICAqICovXG4gICAgZ2V0TmV4dFZhcmlhYmxlTmFtZUZvclR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5nZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYWRkcyBhbiBQcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB0eXBlIC0gbmFtZSBvZiB0aGUgdHlwZSBvIGNyZWF0ZVxuICAgICAqIEBwYXJhbSBzY29wZW5hbWUgLSB0aGUgc2NvcGUge3ZhcmlhYmxlOiAsbWV0aG9kbmFtZTp9IHRvIGFkZCB0aGUgdmFyaWFibGUgLSBpZiBtaXNzaW5nIGxheW91dCgpIFxuICAgICAqIEByZXR1cm5zICB0aGUgbmFtZSBvZiB0aGUgb2JqZWN0XG4gICAgICovXG4gICAgYWRkVmFyaWFibGVJbkNvZGUodHlwZTogc3RyaW5nLCBzY29wZW5hbWU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9KTogc3RyaW5nIHtcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMuY29kZUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUoXCJ0aGlzXCIpO1xuICAgICAgICB2YXIgcmV0ID0gdGhpcy5wYXJzZXIuYWRkVmFyaWFibGVJbkNvZGUodHlwZSwgW3sgY2xhc3NuYW1lOiB2YWw/LmNvbnN0cnVjdG9yPy5uYW1lLCBtZXRob2RuYW1lOiBcImxheW91dFwiIH0sXG4gICAgICAgIHsgY2xhc3NuYW1lOiB1bmRlZmluZWQsIG1ldGhvZG5hbWU6IFwidGVzdFwiIH1dLCBzY29wZW5hbWUpO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIG1vZGlmeSB0aGUgcHJvcGVydHkgaW4gY29kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHRoZSBuZXcgdmFsdWVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZXBsYWNlXSAgLSBpZiB0cnVlIHRoZSBvbGQgdmFsdWUgaXMgZGVsZXRlZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVuYW1lXSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSAtIGRlZmF1bHQ9dGhpcy52YXJpYWJsZW5hbWVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW2JlZm9yZV0gLSB7dmFyaWFibGVuYW1lLHByb3BlcnR5LHZhbHVlPXVuZGVmaW5lZH1cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc2NvcGUgLSB0aGUgc2NvcGUge3ZhcmlhYmxlOiAsbWV0aG9kbmFtZTp9IHRoZSBzY29wZSAtIGlmIG1pc3NpbmcgbGF5b3V0KCkgXG4gICAgKi9cbiAgICBzZXRQcm9wZXJ0eUluQ29kZShwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZSwgcmVwbGFjZTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgdmFyaWFibGVOYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQsXG4gICAgICAgIGJlZm9yZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU/fSA9IHVuZGVmaW5lZCxcbiAgICAgICAgc2NvcGVuYW1lOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfSA9IHVuZGVmaW5lZCkge1xuXG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb2RlQ2hhbmdlc1twcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhcmlhYmxlTmFtZSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgICAgIHRoaXMuX211bHRpc2VsZWN0RWRpdG9yc1ttXS51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0uc2V0UHJvcGVydHlJbkNvZGUocHJvcGVydHksIHZhbHVlLCByZXBsYWNlLCB2YXJpYWJsZU5hbWUsIGJlZm9yZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvcDtcbiAgICAgICAgaWYgKHZhcmlhYmxlTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSB0aGlzLnZhcmlhYmxlbmFtZTtcbiAgICAgICAgICAgIHByb3AgPSB0aGlzLl92YWx1ZVtwcm9wZXJ0eV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZSh2YXJpYWJsZU5hbWUpW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNGdW5jdGlvbiA9ICh0eXBlb2YgKHByb3ApID09PSBcImZ1bmN0aW9uXCIpO1xuICAgICAgICB2YXIgdmFsID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIik7XG4gICAgICAgIHRoaXMucGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKHZhcmlhYmxlTmFtZSwgcHJvcGVydHksIHZhbHVlLFxuICAgICAgICAgICAgW3sgY2xhc3NuYW1lOiB2YWw/LmNvbnN0cnVjdG9yPy5uYW1lLCBtZXRob2RuYW1lOiBcImxheW91dFwiIH0sIHsgY2xhc3NuYW1lOiB1bmRlZmluZWQsIG1ldGhvZG5hbWU6IFwidGVzdFwiIH1dLFxuICAgICAgICAgICAgaXNGdW5jdGlvbiwgcmVwbGFjZSwgYmVmb3JlLCBzY29wZW5hbWUpO1xuICAgICAgICAvL2NvcnJlY3Qgc3BhY2VzXG4gICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5pbmRleE9mKFwiXFxuXCIpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRoaXMucGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBtb2RpZnkgdGhlIHByb3BlcnR5IGluIGRlc2lnblxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0aGUgbmV3IHZhbHVlXG4gICAgKi9cbiAgICBzZXRQcm9wZXJ0eUluRGVzaWduKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnNldFByb3BlcnR5SW5EZXNpZ24ocHJvcGVydHksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwibmV3XCIgJiYgdGhpcy52YXJpYWJsZW5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5jb2RlRWRpdG9yLmV2YWxDb2RlKCk7XG4gICAgICAgICAgICAvLyAgdmFyIHRlc3Q9dGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZSh0aGlzLnZhcmlhYmxlbmFtZSk7XG4gICAgICAgICAgICAvLyAgdGhpcy52YWx1ZT10aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHRoaXMudmFyaWFibGVuYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mICh0aGlzLl92YWx1ZVtwcm9wZXJ0eV0pID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICB0aGlzLl92YWx1ZVtwcm9wZXJ0eV0odmFsdWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl92YWx1ZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnb3RvIHNvdXJjZSBwb3NpdGlvblxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAtIGluIENvZGVcbiAgICAgKi9cbiAgICBnb3RvQ29kZVBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yLmdvdG9Db2RlUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3Iudmlld21vZGUgPSBcImNvZGVcIjtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnNldEN1cnNvclBvcml0aW9uKHBvc2l0aW9uKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnb3RvIHNvdXJjZSBsaW5lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxpbmUgLSBsaW5lIGluIENvZGVcbiAgICAgKi9cbiAgICBnb3RvQ29kZUxpbmUobGluZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRQcm9wZXJ0eUVkaXRvci5nb3RvQ29kZUxpbmUobGluZSk7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci52aWV3bW9kZSA9IFwiY29kZVwiO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3IuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogbGluZSwgY29sdW1uOiAyMDAgfTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiByZW5hbWVzIGEgdmFyaWFibGUgaW4gY29kZVxuICAgICAqL1xuICAgIHJlbmFtZVZhcmlhYmxlSW5Db2RlKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5jb2RlRWRpdG9yLnZhbHVlO1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBmb3VuZCA9IHRydWU7XG4gICAgICAgIGlmIChvbGROYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpXG4gICAgICAgICAgICBvbGROYW1lID0gb2xkTmFtZS5zdWJzdHJpbmcoMyk7XG4gICAgICAgIGlmIChuZXdOYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpXG4gICAgICAgICAgICBuZXdOYW1lID0gbmV3TmFtZS5zdWJzdHJpbmcoMyk7XG4gICAgICAgIGlmIChvbGROYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSlcbiAgICAgICAgICAgIG9sZE5hbWUgPSBvbGROYW1lLnN1YnN0cmluZyg1KTtcbiAgICAgICAgaWYgKG5ld05hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKVxuICAgICAgICAgICAgbmV3TmFtZSA9IG5ld05hbWUuc3Vic3RyaW5nKDUpO1xuICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIlxcXFxXXCIgKyBvbGROYW1lICsgXCJcXFxcV1wiKTtcbiAgICAgICAgd2hpbGUgKGZvdW5kID09IHRydWUpIHtcbiAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKHJlZywgZnVuY3Rpb24gcmVwbGFjZXIobWF0Y2gsIG9mZnNldCwgc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gcDEgaXMgbm9uZGlnaXRzLCBwMiBkaWdpdHMsIGFuZCBwMyBub24tYWxwaGFudW1lcmljc1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDAsIDEpICsgbmV3TmFtZSArIG1hdGNoLnN1YnN0cmluZyhtYXRjaC5sZW5ndGggLSAxLCBtYXRjaC5sZW5ndGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gY29kZTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlbmFtZXMgYSB2YXJpYWJsZSBpbiBkZXNpZ25cbiAgICAgKi9cbiAgICByZW5hbWVWYXJpYWJsZUluRGVzaWduKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci5yZW5hbWVWYXJpYWJsZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiByZW1vdmVzIHRoZSB2YXJpYWJsZSBmcm9tIGRlc2lnblxuICAgICogQHBhcmFtICB2YXJuYW1lIC0gdGhlIHZhcmlhYmxlIHRvIHJlbW92ZVxuICAgICovXG4gICAgcmVtb3ZlVmFyaWFibGVJbkRlc2lnbih2YXJuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgLy9UT0RPIHRoaXMgdW5kIHZhcj9cbiAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSkge1xuICAgICAgICAgICAgdmFyIHZuYW1lID0gdmFybmFtZS5zdWJzdHJpbmcoMyk7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwibWVcIik7XG4gICAgICAgICAgICBkZWxldGUgbWVbdm5hbWVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlbW92ZXMgdGhlIHZhcmlhYmxlIGZyb20gY29kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YXJuYW1lIC0gdGhlIHZhcmlhYmxlIHRvIHJlbW92ZVxuICAgICAqL1xuICAgIHJlbW92ZVZhcmlhYmxlSW5Db2RlKHZhcm5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFyc2VyLnJlbW92ZVZhcmlhYmxlSW5Db2RlKHZhcm5hbWUpO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogcmVtb3ZlcyB0aGUgcHJvcGVydHkgZnJvbSBjb2RlXG4gICAgKiBAcGFyYW0ge3R5cGV9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIHJlbW92ZVxuICAgICogQHBhcmFtIHt0eXBlfSBbb25seVZhbHVlXSAtIHJlbW92ZSB0aGUgcHJvcGVydHkgb25seSBpZiB0aGUgdmFsdWUgaXMgZm91bmRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVuYW1lXSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSAtIGRlZmF1bHQ9dGhpcy52YXJpYWJsZW5hbWVcbiAgICAqL1xuICAgIHJlbW92ZVByb3BlcnR5SW5Db2RlKHByb3BlcnR5OiBzdHJpbmcsIG9ubHlWYWx1ZSA9IHVuZGVmaW5lZCwgdmFyaWFibGVuYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb2RlQ2hhbmdlc1twcm9wZXJ0eV07XG4gICAgICAgICAgICB0aGlzLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl92YWx1ZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICB0aGlzLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnVwZGF0ZVBhcnNlcigpO1xuICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnJlbW92ZVByb3BlcnR5SW5Db2RlKHByb3BlcnR5LCBvbmx5VmFsdWUsIHZhcmlhYmxlbmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFyaWFibGVuYW1lID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB2YXJpYWJsZW5hbWUgPSB0aGlzLnZhcmlhYmxlbmFtZTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTs7Ly9ub3R3ZW5kaWc/XG4gICAgICAgIHRoaXMucGFyc2VyLnJlbW92ZVByb3BlcnR5SW5Db2RlKHByb3BlcnR5LCBvbmx5VmFsdWUsIHZhcmlhYmxlbmFtZSk7XG4gICAgICAgIHZhciB0ZXh0ID0gdGhpcy5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRleHQ7XG4gICAgICAgIHRoaXMudXBkYXRlUGFyc2VyKClcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogcmVtb3ZlcyB0aGUgcHJvcGVydHkgaW4gZGVzaWduXG4gICAgKi9cbiAgICByZW1vdmVQcm9wZXJ0eUluRGVzaWduKHByb3BlcnR5OiBzdHJpbmcpIHtcbiAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgIHRoaXMuX211bHRpc2VsZWN0RWRpdG9yc1ttXS5yZW1vdmVQcm9wZXJ0eUluRGVzaWduKHByb3BlcnR5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mICh0aGlzLl92YWx1ZVtwcm9wZXJ0eV0pID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICB0aGlzLl92YWx1ZVtwcm9wZXJ0eV0odW5kZWZpbmVkKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlW3Byb3BlcnR5XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0gY2F0Y2gge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fdmFsdWVbcHJvcGVydHldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGF5b3V0KG1lID0gdW5kZWZpbmVkKSB7XG5cbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgfVxufVxuQCRDbGFzcyhcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JUZXN0U3ViUHJvcGVydGllc1wiKVxuZXhwb3J0IGNsYXNzIFByb3BlcnR5RWRpdG9yVGVzdFN1YlByb3BlcnRpZXMge1xuICAgIEAkUHJvcGVydHkoKVxuICAgIG51bTpudW1iZXI9MTk7XG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgdGV4dDpzdHJpbmc9XCJwcm9wXCI7XG4gfVxuXG5cblxuQCRDbGFzcyhcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JUZXN0UHJvcGVydGllc1wiKVxuY2xhc3MgVGVzdFByb3BlcnRpZXMge1xuICAgIEAkUHJvcGVydHkoeyBkZWNyaXB0aW9uOiBcIm5hbWUgb2YgdGhlIGRpYWxvZ1wiLCB9KVxuICAgIGRpYWxvZ25hbWU6IHN0cmluZztcbiAgICBAJFByb3BlcnR5KClcbiAgICBjaGVja2VkOmJvb2xlYW47XG4gICAgQCRQcm9wZXJ0eSh7dHlwZTpcImNvbG9yXCJ9KVxuICAgIGNvbG9yOnN0cmluZztcbiAgICBAJFByb3BlcnR5KHt0eXBlOlwiY29tcG9uZW50c2VsZWN0b3JcIixjb21wb25lbnRUeXBlOlwiamFzc2kudWkuQ29tcG9uZW50XCJ9KVxuICAgIGNvbXBvbmVudDpDb21wb25lbnQ7XG4gICAgQCRQcm9wZXJ0eSh7dHlwZTpcImRhdGFiaW5kZXJcIn0pXG4gICAgZGF0YWJpbmRlcjphbnk7XG4gICAgQCRQcm9wZXJ0eSh7dHlwZTpcImRib2JqZWN0XCIsY29tcG9uZW50VHlwZTpcImRlLkt1bmRlXCJ9KVxuICAgIGRib2JqZWN0O1xuICAgIEAkUHJvcGVydHkoe2RlZmF1bHQ6ODB9KVxuICAgIG51bTpudW1iZXI7XG4gICAgQCRQcm9wZXJ0eSh7dHlwZTpcImZvbnRcIn0pXG4gICAgZm9udDpudW1iZXI7XG4gICAgQCRQcm9wZXJ0eSh7dHlwZTpcImZ1bmN0aW9uXCJ9KVxuICAgIGZ1bmMoYW55KXtcblxuICAgIH07XG4gICAgQCRQcm9wZXJ0eSh7dHlwZTpcImh0bWxcIn0pXG4gICAgaHRtbDpzdHJpbmc9XCJzYW1wbGVcIjtcbiAgICBAJFByb3BlcnR5KHt0eXBlOlwiaW1hZ2VcIn0pXG4gICAgaW1hZ2U6c3RyaW5nO1xuICAgIEAkUHJvcGVydHkoe3R5cGU6XCJqc29uXCIsY29tcG9uZW50VHlwZTpcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JUZXN0U3ViUHJvcGVydGllc1wifSlcbiAgICBqc29uOmFueTtcbiAgICBcbn1cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciByZXQgPSBuZXcgUHJvcGVydHlFZGl0b3IoKTtcbiAgICByZXQudmFsdWUgPSBuZXcgVGVzdFByb3BlcnRpZXMoKTtcbiAgICByZXR1cm4gcmV0O1xufSJdfQ==