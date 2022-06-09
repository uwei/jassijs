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
        addVariableInCode(type, scopename) {
            var val = this.codeEditor.getObjectFromVariable("this");
            var ret = this.parser.addVariableInCode(type, undefined, scopename);
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
        setPropertyInCode(property, value, replace = undefined, variableName = undefined, before = undefined, scopename = undefined) {
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
            //correct spaces
            if (value && value.indexOf && value.indexOf("\n") > -1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvcGVydHlFZGl0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBa0JBLElBQWEsY0FBYyxzQkFBM0IsTUFBYSxjQUFlLFNBQVEsYUFBSztRQVlyQzs7VUFFRTtRQUNGLFlBQVksVUFBVSxHQUFHLFNBQVMsRUFBRSxNQUFNLEdBQUcsU0FBUztZQUNsRCxLQUFLLEVBQUUsQ0FBQztZQWZaLGdDQUEyQixHQUFZLEtBQUssQ0FBQztZQVU3QyxnQkFBVyxHQUF3QyxFQUFFLENBQUM7WUFNbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O3FDQVlXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUN6QixDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUV2RCwrREFBK0Q7WUFDL0QsK0JBQStCO1lBQy9CLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkOzs7aUJBR0s7WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixxREFBcUQ7WUFFckQseURBQXlEO1lBQ3pELElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLGlFQUFpRTtZQUNqRSxJQUFJLENBQUMs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QUEsY0FBTSxFQUFDLHlDQUF5QyxDQUFDO09BQzVDLGNBQWMsQ0E0Qm5CO0lBQ0QsU0FBZ0IsSUFBSTtRQUNoQixJQUFJLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNqQyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFKRCxvQkFJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IFwiamFzc2lqcy9iYXNlL1Byb3BlcnR5RWRpdG9yU2VydmljZVwiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXJcIjtcbmltcG9ydCB7IEltYWdlIH0gZnJvbSBcImphc3NpanMvdWkvSW1hZ2VcIjtcblxuaW1wb3J0IHsgVG9vbHMgfSBmcm9tIFwiamFzc2lqcy91dGlsL1Rvb2xzXCI7XG5pbXBvcnQgcmVnaXN0cnkgZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5pbXBvcnQgeyBDb21wb25lbnREZXNjcmlwdG9yIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50RGVzY3JpcHRvclwiO1xuaW1wb3J0IHsgTmFtZUVkaXRvciB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9ycy9OYW1lRWRpdG9yXCI7XG5pbXBvcnQgeyBwcm9wZXJ0eWVkaXRvciB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvUHJvcGVydHlFZGl0b3JTZXJ2aWNlXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSwgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IEVkaXRvciB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9ycy9FZGl0b3JcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcImphc3NpanMvdWkvQ29udGFpbmVyXCI7XG5cbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yXCIpXG5leHBvcnQgY2xhc3MgUHJvcGVydHlFZGl0b3IgZXh0ZW5kcyBQYW5lbCB7XG4gICAgcmVhZFByb3BlcnR5VmFsdWVGcm9tRGVzaWduOiBib29sZWFuID0gZmFsc2U7XG4gICAgdGFibGU6IFBhbmVsO1xuICAgIGNvZGVFZGl0b3I7XG4gICAgcGFyc2VyOiBQYXJzZXI7XG4gICAgdmFyaWFibGVuYW1lOiBzdHJpbmc7XG4gICAgcGFyZW50UHJvcGVydHlFZGl0b3I6IFByb3BlcnR5RWRpdG9yO1xuICAgIF9tdWx0aXNlbGVjdEVkaXRvcnM6IFByb3BlcnR5RWRpdG9yW107XG4gICAgc2hvd1RoaXNQcm9wZXJ0aWVzO1xuICAgIHByb3BlcnRpZXM7XG4gICAgX3ZhbHVlO1xuICAgIGNvZGVDaGFuZ2VzOiB7IFtwcm9wZXJ0eTogc3RyaW5nXTogc3RyaW5nIHwge30gfSA9IHt9O1xuICAgIC8qKlxuICAgICogZWRpdCBvYmplY3QgcHJvcGVydGllc1xuICAgICovXG4gICAgY29uc3RydWN0b3IoY29kZUVkaXRvciA9IHVuZGVmaW5lZCwgcGFyc2VyID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudGFibGUgPSBuZXcgUGFuZWwoKTtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG4gICAgICAgIHRoaXMudGFibGUuaW5pdCgkKGA8dGFibGUgc3R5bGU9XCJ0YWJsZS1sYXlvdXQ6IGZpeGVkO2ZvbnQtc2l6ZToxMXB4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJwcm9wZXJ0eWVkaXRvcmhlYWRlclwiPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicHJvcGVydHllZGl0b3JoZWFkZXJcIj5WYWx1ZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cInByb3BlcnR5ZWRpdG9ycm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgPmExPC90ZD48dGQ+YjE8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5gKVswXSk7XG4gICAgICAgIHRoaXMuYWRkKHRoaXMudGFibGUpO1xuICAgICAgICB0aGlzLnRhYmxlLndpZHRoID0gXCI5OCVcIjtcbiAgICAgICAgJChcIi5wcm9wZXJ0eWVkaXRvcmhlYWRlclwiKS5yZXNpemFibGUoeyBoYW5kbGVzOiBcImVcIiB9KTtcblxuICAgICAgICAvLyAgICAgICAgICAgICQoIFwiLnByb3BlcnR5ZWRpdG9yaGVhZGVyXCIgKS5jc3MoXCJoZWlnaHRcIixcIjhweFwiKTtcbiAgICAgICAgLy8kKHRoaXMuZG9tKS5jc3MoXCJoZWlnaHRcIixcIlwiKTtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLmxheW91dCgpO1xuICAgICAgICAvKiogXG4gICAgICAgICAqIEBtZW1iZXIge2phc3NpanNfZWRpdG9yLkNvZGVFZGl0b3J9IC0gdGhlIHBhcmVudCBDb2RlRWRpdG9yXG4gICAgICAgICAqIGlmIHVuZGVmaW5lZCAtIG5vIGNvZGUgY2hhbmdlcyB3b3VsZCBiZSBkb25lIFxuICAgICAgICAgKiAqL1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3IgPSBjb2RlRWRpdG9yO1xuICAgICAgICAvKiogQG1lbWJlciB7amFzc2lqcy5iYXNlLlBhcnNlcn0gLSB0aGUgY29kZS1wYXJzZXIqL1xuXG4gICAgICAgIC8qKiBAbWVtYmVyIHtzdHJpbmd9IC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIGluIGNvZGUqL1xuICAgICAgICB0aGlzLnZhcmlhYmxlbmFtZSA9IFwiXCI7XG4gICAgICAgIC8qKiBAbWVtYmVyIHtqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yfSAtIHBhcmVudCBwcm9wZXJ0eWVkaXRvciovXG4gICAgICAgIHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3I7XG4gICAgICAgIC8qKiBAbWVtYmVyIHtbamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcl19IC0gaWYgbXVsdGlzZWxlY3QgLSB0aGUgcHJvcGVydHllZGl0b3JzIG9mIHRoZSBvdGhlciBlbGVtZW50cyovXG4gICAgICAgIHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycztcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBhZGRzIGEgbmV3IHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgIC0gdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5FZGl0b3J9IGVkaXRvciAtIHRoZSBwcm9wZXJ0eWVkaXRvciB0byByZW5kZXIgdGhlIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIC0gdGhlIHRoZSBkZXNjcmlwdGlvbiBpcyB0b29sdGlwIG92ZXIgdGhlIG5hbWVcbiAgICAgKi9cbiAgICBhZGRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIGVkaXRvcjogRWRpdG9yLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBlZGl0b3IuZ2V0Q29tcG9uZW50KCk7XG4gICAgICAgIHZhciByb3cgPSAkKCc8dHIgbm93cmFwIGNsYXNzPVwicHJvcGVydHllZGl0b3Jyb3dcIj48dGQgIHN0eWxlPVwiZm9udC1zaXplOjExcHhcIiBub3dyYXAgdGl0bGU9XCInICsgZGVzY3JpcHRpb24gKyAnXCI+JyArIG5hbWUgKyAnPC90ZD48dGQgY2xhc3M9XCJwcm9wZXJ0eXZhbHVlXCIgIG5vd3JhcD48L3RkPjwvdHI+JylbMF07XG4gICAgICAgIHZhciBkZWxldGVidXR0b24gPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgZGVsZXRlYnV0dG9uLnNyYyA9IFwibWRpIG1kaS1kZWxldGUtZm9yZXZlci1vdXRsaW5lXCI7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGRlbGV0ZWJ1dHRvbi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLnJlbW92ZVByb3BlcnR5SW5EZXNpZ24obmFtZSk7XG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVQcm9wZXJ0eUluQ29kZShuYW1lKTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZVBhcnNlcigpO1xuICAgICAgICAgICAgX3RoaXMudmFsdWUgPSBfdGhpcy52YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChyb3cuY2hpbGRyZW5bMF0pLnRvb2x0aXAoKTtcbiAgICAgICAgLy8gJChyb3cuY2hpbGRyZW5bMF0pLmNzcyhcImZvbnQtc2l6ZVwiLCBcIjExcHhcIik7XG5cbiAgICAgICAgJChyb3cuY2hpbGRyZW5bMF0pLnByZXBlbmQoZGVsZXRlYnV0dG9uLmRvbSk7XG4gICAgICAgIC8vJChjb21wb25lbnQuZG9tKS5jc3MoXCJmb250LXNpemVcIiwgXCIxMXB4XCIpO1xuICAgICAgICB0aGlzLnRhYmxlLmRvbS5jaGlsZHJlblsxXS5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICByb3dbXCJwcm9wZXJ0eU5hbWVcIl0gPSBuYW1lO1xuICAgICAgICByb3dbXCJfY29tcG9uZW50c1wiXSA9IFtlZGl0b3IsIGRlbGV0ZWJ1dHRvbl07XG4gICAgICAgIC8qICQoY29tcG9uZW50LmRvbSkuY3NzKHtcbiAgICAgICAgICAgICBcIndpZHRoXCI6XCIxMDAlXCIsXG4gICAgICAgICAgICAgXCJwYWRkaW5nXCI6XCJpbml0aWFsXCIsXG4gICAgICAgICAgICAgXCJmb250LXNpemVcIjpcIjExcHhcIlxuICAgICAgICAgfSk7Ki9cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgcm93LmNoaWxkcmVuWzFdLmFwcGVuZENoaWxkKGNvbXBvbmVudC5kb20pO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIC8vV2h5XG4gICAgICAgICAgICAvL2RlYnVnZ2VyO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIGFuIGV2ZW50IGlmIHRoZSBwcm9wZXJ0eSBoYXMgY2hhbmdlZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSB0aGUgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb24gY2hhbmdlXG4gICAgICovXG4gICAgb25jb2RlQ2hhbmdlZChoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVnaXN0ZXIgYW4gZXZlbnQgaWYgdGhlIHByb3BlcnR5IGhhcyBjaGFuZ2VkXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbiBjaGFuZ2VcbiAgICAgKi9cbiAgICBvbnByb3BlcnR5Q2hhbmdlZChoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoXCJwcm9wZXJ0eUNoYW5nZWRcIiwgaGFuZGxlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGRlbGV0ZSBhbGwgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB2YXIgdHJzID0gJCh0aGlzLmRvbSkuZmluZChcIi5wcm9wZXJ0eWVkaXRvcnJvd1wiKTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0cnMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSB0cnNbeF07XG4gICAgICAgICAgICBpZiAocm93W1wiX2NvbXBvbmVudHNcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgcm93W1wiX2NvbXBvbmVudHNcIl0ubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcm93W1wiX2NvbXBvbmVudHNcIl1bY11bXCJfX2Rlc3Ryb3llZFwiXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJvd1tcIl9jb21wb25lbnRzXCJdW2NdLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHJvdykucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAqIGlmIHBhcmVudFByb3BlcnR5RWRpdG9yIGlzIGRlZmluZWQgdGhlbiB0aGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5IG11c3QgYmUgc3Vic3RpdHV0ZWRcbiAgICogQHBhcmFtIHtqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yIHByb3BlcnR5RWRpdG9yXG4gICAqIEBwYXJhbSB7W29wamVjdH0gcHJvcHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BuYW1lIHRoZSBwcm9wZXJ0eU5hbWVcbiAgICovXG4gICAgLyogX2dldFBhcmVudEVkaXRvclZhbHVlKHByb3BlcnR5RWRpdG9yLG9iLHByb3BuYW1lKXtcbiAgICAgICAgIFxuICAgICB9Ki9cbiAgICAvKipcbiAgICAgKiBpZiBwYXJlbnRQcm9wZXJ0eUVkaXRvciBpcyBkZWZpbmVkIHRoZW4gdGhlIHByb3BlcnRpZXMgYXJlIGRlZmluZWQgdGhlcmVcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuUHJvcGVydHlFZGl0b3IgcHJvcGVydHlFZGl0b3JcbiAgICAgKiBAcGFyYW0ge1tvcGplY3R9IHByb3BzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BuYW1lIHRoZSBwcm9wZXJ0eU5hbWVcbiAgICBcbiAgICBfYWRkUGFyZW50RWRpdG9yUHJvcGVydGllcyhwcm9wZXJ0eUVkaXRvciwgcHJvcHMsIHByb3BuYW1lKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eUVkaXRvci5wYXJlbnRQcm9wZXJ0eUVkaXRvciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fYWRkUGFyZW50RWRpdG9yUHJvcGVydGllcyhwcm9wZXJ0eUVkaXRvci5wYXJlbnRQcm9wZXJ0eUVkaXRvciwgcHJvcHMsIHByb3BlcnR5RWRpdG9yLnZhcmlhYmxlbmFtZSArIFwiL1wiICsgcHJvcG5hbWUpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZXQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG93VGhpc1Byb3BlcnRpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldCA9IFRvb2xzLmNvcHlPYmplY3QodGhpcy5zaG93VGhpc1Byb3BlcnRpZXMpO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgcmV0ID0gQ29tcG9uZW50RGVzY3JpcHRvci5kZXNjcmliZShwcm9wZXJ0eUVkaXRvci52YWx1ZS5jb25zdHJ1Y3RvciwgdHJ1ZSkuZmllbGRzO1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7eCA8IHJldC5sZW5ndGg7eCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJldFt4XS5uYW1lLnN0YXJ0c1dpdGgocHJvcG5hbWUgKyBcIi9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZXRbeF0ubmFtZS5zdWJzdHJpbmcoKHByb3BuYW1lICsgXCIvXCIpLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0LmluZGV4T2YoXCIvXCIpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0W3hdLm5hbWUgPSB0ZXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMucHVzaChyZXRbeF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9ICovXG4gICAgLyoqXG4gICAgICogZ2V0IGFsbCBrbm93biBpbnN0YW5jZXMgZm9yIHR5cGVcbiAgICAgKiBAcGFyYW0ge3R5cGV9IHR5cGUgLSB0aGUgdHlwZSB3ZSBhcmUgaW50ZXJlc3RlZFxuICAgICAqIEByZXR1cm5zIHtbc3RyaW5nXX1cbiAgICAgKi9cbiAgICBnZXRWYXJpYWJsZXNGb3JUeXBlKHR5cGUpIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZUVkaXRvci5nZXRWYXJpYWJsZXNGb3JUeXBlKHR5cGUpO1xuXG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgdmFyaWFibGVuYW1lIG9mIGFuIG9iamVjdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYiAtIHRoZSBvYmplY3QgdG8gc2VhcmNoXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRWYXJpYWJsZUZyb21PYmplY3Qob2IpIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3Qob2IpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICogZ2V0cyB0aGUgbmFtZSBvYmplY3Qgb2YgdGhlIGdpdmVuIHZhcmlhYmVsXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvYiAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxuICAgICAqICBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldE9iamVjdEZyb21WYXJpYWJsZShvYikge1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShvYik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge29iamVjdH0gIC0gdGhlIHJlbmRlcmVkIG9iamVjdCBcbiAgICAgKi9cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcblxuICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX3ZhbHVlICYmIHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuY29kZUNoYW5nZXMgPSB7fTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgfHwgdmFsdWU/LmRvbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoISQodmFsdWUuZG9tKS5pcyhcIjpmb2N1c1wiKSlcbiAgICAgICAgICAgICAgICAkKHZhbHVlLmRvbSkuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlICE9PSB1bmRlZmluZWQgJiYgdGhpcy52YWx1ZS5jb25zdHJ1Y3RvciA9PT0gdmFsdWUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yKVxuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGVuYW1lID0gdGhpcy5jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdCh0aGlzLl92YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycyA9IFtdO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IHZhbHVlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG11bHRpID0gbmV3IFByb3BlcnR5RWRpdG9yKHRoaXMuY29kZUVkaXRvciwgdGhpcy5wYXJzZXIpO1xuICAgICAgICAgICAgICAgIG11bHRpLmNvZGVFZGl0b3IgPSB0aGlzLmNvZGVFZGl0b3I7XG4gICAgICAgICAgICAgICAgbXVsdGkucGFyZW50UHJvcGVydHlFZGl0b3IgPSB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yO1xuICAgICAgICAgICAgICAgIG11bHRpLnZhbHVlID0gdmFsdWVbeF07XG4gICAgICAgICAgICAgICAgbXVsdGkucGFyc2VyID0gdGhpcy5wYXJzZXI7XG4gICAgICAgICAgICAgICAgaWYgKG11bHRpLmNvZGVFZGl0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZW5hbWUgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHZhbHVlW3hdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMucHVzaChtdWx0aSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlWzBdO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gW10pIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlbmFtZSA9IHRoaXMuY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QodGhpcy5fdmFsdWUpO1xuXG5cblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9pbml0VmFsdWUoKTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICB9XG4gICAgc3dhcENvbXBvbmVudHMoZmlyc3Q6IENvbXBvbmVudCwgc2Vjb25kOiBDb21wb25lbnQpIHtcbiAgICAgICAgLy9zd2FwIERlc2lnblxuICAgICAgICBpZiAoZmlyc3QuX3BhcmVudCAhPT0gc2Vjb25kLl9wYXJlbnQpXG4gICAgICAgICAgICB0aHJvdyBcInN3YXBlZCBjb21wb25lbnRzIG11c3QgaGF2ZSB0aGUgc2FtZSBwYXJlbnRcIlxuICAgICAgICB2YXIgcGFyZW50OiBDb250YWluZXIgPSBmaXJzdC5fcGFyZW50O1xuICAgICAgICB2YXIgaWZpcnN0ID0gcGFyZW50Ll9jb21wb25lbnRzLmluZGV4T2YoZmlyc3QpO1xuICAgICAgICB2YXIgaXNlY29uZCA9IHBhcmVudC5fY29tcG9uZW50cy5pbmRleE9mKHNlY29uZCk7XG4gICAgICAgIHZhciBkdW1teSA9ICQoXCI8ZGl2Lz5cIik7XG5cbiAgICAgICAgcGFyZW50Ll9jb21wb25lbnRzW2lmaXJzdF0gPSBzZWNvbmQ7XG4gICAgICAgIHBhcmVudC5fY29tcG9uZW50c1tpc2Vjb25kXSA9IGZpcnN0O1xuICAgICAgICAkKGZpcnN0LmRvbVdyYXBwZXIpLnJlcGxhY2VXaXRoKGR1bW15KTtcbiAgICAgICAgJChzZWNvbmQuZG9tV3JhcHBlcikucmVwbGFjZVdpdGgoJChmaXJzdC5kb21XcmFwcGVyKSk7XG4gICAgICAgIGR1bW15LnJlcGxhY2VXaXRoKCQoc2Vjb25kLmRvbVdyYXBwZXIpKTtcbiAgICAgICAgLy9zd2FwIENvZGVcbiAgICAgICAgdmFyIGZpcnN0bmFtZSA9IHRoaXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGZpcnN0KTtcbiAgICAgICAgdmFyIHNlY29uZG5hbWUgPSB0aGlzLmdldFZhcmlhYmxlRnJvbU9iamVjdChzZWNvbmQpO1xuICAgICAgICB2YXIgcGFyZW50bmFtZSA9IHRoaXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KHBhcmVudCk7XG4gICAgICAgIHRoaXMucGFyc2VyLnN3YXBQcm9wZXJ0eVdpdGhQYXJhbWV0ZXIocGFyZW50bmFtZSwgXCJhZGRcIiwgZmlyc3RuYW1lLCBzZWNvbmRuYW1lKTtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gdGhpcy5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFyc2VyKCk7XG4gICAgfVxuICAgIHByaXZhdGUgY29udHJvbEVkaXRvcihlZGl0b3IpIHtcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgZWRpdG9yLm9uZWRpdChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLmNhbGxFdmVudChcInByb3BlcnR5Q2hhbmdlZFwiLCBldmVudCk7XG4gICAgICAgICAgICBsZXQgZGVsZXRlYnV0dG9uID0gZWRpdG9yLmNvbXBvbmVudC5kb20ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgJChkZWxldGVidXR0b24pLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIF9pbml0VmFsdWUoKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IFtdO1xuICAgICAgIC8qIGlmICh0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9hZGRQYXJlbnRFZGl0b3JQcm9wZXJ0aWVzKHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IsIHByb3BzLCB0aGlzLnZhcmlhYmxlbmFtZSk7XG4gICAgICAgIGVsc2UqLyB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG93VGhpc1Byb3BlcnRpZXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBwcm9wcyA9IHRoaXMuc2hvd1RoaXNQcm9wZXJ0aWVzO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl92YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMgPSBbXTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHByb3BzID0gQ29tcG9uZW50RGVzY3JpcHRvci5kZXNjcmliZSh0aGlzLl92YWx1ZS5jb25zdHJ1Y3Rvcik/LmZpZWxkcztcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BzKVxuICAgICAgICAgICAgICAgICAgICBwcm9wcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vVE9ETyBjYWNoZSB0aGlzXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF90aGlzLnByb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgLypmb3IgKHZhciB4ID0gMDsgeCA8IHByb3BzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9wZXJ0aWVzW3Byb3BzW3hdLm5hbWVdID0geyBuYW1lOiBwcm9wc1t4XS5uYW1lLCBjb21wb25lbnQ6IHVuZGVmaW5lZCwgZGVzY3JpcHRpb246IHByb3BzW3hdLmRlc2NyaXB0aW9uIH07XG4gICAgICAgIH0qL1xuICAgICAgICB2YXIgYWxsUHJvcGVydGllczogeyBuYW1lOiBzdHJpbmcsIGVkaXRvcjogRWRpdG9yLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBpc1Zpc2libGU/OiAob2JqZWN0KSA9PiBib29sZWFuIH1bXSA9IFtdO1xuXG4gICAgICAgIGlmIChfdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIGhhc3Zhcm5hbWUgPSBfdGhpcy5nZXRWYXJpYWJsZUZyb21PYmplY3QoX3RoaXMuX3ZhbHVlKTtcbiAgICAgICAgICAgIGlmIChoYXN2YXJuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZUVkaXRvciA9IG5ldyBOYW1lRWRpdG9yKFwibmFtZVwiLCBfdGhpcyk7XG4gICAgICAgICAgICAgICAgLy9fdGhpcy5hZGRQcm9wZXJ0eShcIm5hbWVcIiwgbmFtZUVkaXRvciwgXCJ0aGUgbmFtZSBvZiB0aGUgY29tcG9uZW50XCIpO1xuICAgICAgICAgICAgICAgIC8vYWxsUHJvcGVydGllcy5wdXNoKHtuYW1lOlwibmFtZVwiLGVkaXRvcjpuYW1lRWRpdG9yLGRlc2NyaXB0aW9uOlwidGhlIG5hbWUgb2YgdGhlIGNvbXBvbmVudFwifSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcGVydGllc1tcIm5hbWVcIl0gPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwibmFtZVwiLCBlZGl0b3I6IG5hbWVFZGl0b3IsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcInRoZSBuYW1lIG9mIHRoZSBjb21wb25lbnRcIiwgXCJjb21wb25lbnRcIjogbmFtZUVkaXRvci5nZXRDb21wb25lbnQoKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgLy9uYW1lRWRpdG9yLm9iID0gX3RoaXMuX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcHJvcHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1t4XS5uYW1lLmluZGV4T2YoXCIvXCIpID4gLTEpIHtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcGVydGllc1twcm9wc1t4XS5uYW1lXSA9IHsgaXNWaXNpYmxlOiBwcm9wc1t4XS5pc1Zpc2libGUsIG5hbWU6IHByb3BzW3hdLm5hbWUsIGNvbXBvbmVudDogdW5kZWZpbmVkLCBkZXNjcmlwdGlvbjogcHJvcHNbeF0uZGVzY3JpcHRpb24gfTtcblxuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBwcm9wZXJ0eWVkaXRvci5jcmVhdGVGb3IocHJvcHNbeF0sIF90aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0b3Igbm90IGZvdW5kIGZvciBcIiArIF90aGlzLnZhcmlhYmxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc25hbWUgPSBlZGl0b3IucHJvcGVydHkubmFtZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xFZGl0b3IoZWRpdG9yKTtcbiAgICAgICAgICAgICAgICAvKiAgICAgICAgICAgICAgICBlZGl0b3Iub25lZGl0KGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2FsbEV2ZW50KFwicHJvcGVydHlDaGFuZ2VkXCIsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZWxldGVidXR0b24gPSBlZGl0b3IuY29tcG9uZW50LmRvbS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGRlbGV0ZWJ1dHRvbikuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgICAgICAgICAvL2VkaXRvci5vYiA9IF90aGlzLl92YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucHJvcGVydGllc1tlZGl0b3IucHJvcGVydHkubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5IG5vdCBmb3VuZCBcIiArIGVkaXRvci5wcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5wcm9wZXJ0aWVzW2VkaXRvci5wcm9wZXJ0eS5uYW1lXS5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvciAhPT0gdW5kZWZpbmVkICYmIF90aGlzLnByb3BlcnRpZXNbZWRpdG9yLnByb3BlcnR5Lm5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucHJvcGVydGllc1tlZGl0b3IucHJvcGVydHkubmFtZV0uY29tcG9uZW50ID0gZWRpdG9yLmdldENvbXBvbmVudCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIF90aGlzLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHZhciBwcm9wID0gX3RoaXMucHJvcGVydGllc1trZXldO1xuICAgICAgICAgICAgdmFyIGRvQWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgX3RoaXMuX211bHRpc2VsZWN0RWRpdG9ycy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gX3RoaXMuX211bHRpc2VsZWN0RWRpdG9yc1ttXS5wcm9wZXJ0aWVzW3Byb3AubmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHRlc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgZG9BZGQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb0FkZCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLmNvbXBvbmVudCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAvL190aGlzLmFkZFByb3BlcnR5KHByb3AubmFtZSwgcHJvcC5lZGl0b3IsIHByb3AuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICBhbGxQcm9wZXJ0aWVzLnB1c2goeyBuYW1lOiBwcm9wLm5hbWUsIGVkaXRvcjogcHJvcC5lZGl0b3IsIGRlc2NyaXB0aW9uOiBwcm9wLmRlc2NyaXB0aW9uLCBpc1Zpc2libGU6IHByb3AuaXNWaXNpYmxlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF90aGlzLmNsZWFyKCk7XG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgYWxsUHJvcGVydGllcy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgbGV0IHByb3AgPSBhbGxQcm9wZXJ0aWVzW3BdO1xuICAgICAgICAgICAgX3RoaXMuYWRkUHJvcGVydHkocHJvcC5uYW1lLCBwcm9wLmVkaXRvciwgcHJvcC5kZXNjcmlwdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogdXBkYXRlcyB2YWx1ZXNcbiAgICAgKi9cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG4gICAgICAgICAgICBpZiAocHJvcC5lZGl0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlByb3BlcnR5RWRpdG9yIGZvciBcIiArIGtleSArIFwiIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vc29tZXRpbWVzIHRoZSBjb21wb25lbnQgaXMgYWxyZWFkeSBkZWxldGVkIGUuZy5yZXNpemVcbiAgICAgICAgICAgIGlmIChwcm9wLmVkaXRvcltcIl9fZGVzdHJveWVkXCJdICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3AuaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc1Zpc2libGUgPSBwcm9wLmlzVmlzaWJsZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHRoaXMudGFibGUuZG9tLmNoaWxkcmVuWzFdLmNoaWxkcmVuLmxlbmd0aDsgcisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGhpcy50YWJsZS5kb20uY2hpbGRyZW5bMV0uY2hpbGRyZW5bcl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93W1wicHJvcGVydHlOYW1lXCJdID09PSBwcm9wLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSByb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChwcm9wLmVkaXRvci5jb21wb25lbnQuZG9tLnBhcmVudE5vZGUpLmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQobGFiZWwpLmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQocHJvcC5lZGl0b3IuY29tcG9uZW50LmRvbS5wYXJlbnROb2RlKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChsYWJlbCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBkZWxldGVidXR0b24gPSBwcm9wLmVkaXRvci5jb21wb25lbnQuZG9tLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICB2YXIgbGwgPSB0aGlzLmdldFByb3BlcnR5VmFsdWUocHJvcCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChsbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZGVsZXRlYnV0dG9uKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChkZWxldGVidXR0b24pLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qICAgJChwcm9wLmVkaXRvci5jb21wb25lbnQuZG9tLnBhcmVudE5vZGUpLmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgJChwcm9wLmVkaXRvci5jb21wb25lbnQuZG9tLnBhcmVudE5vZGUpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gKi9cbiAgICAgICAgICAgICAgICBwcm9wLmVkaXRvci5vYiA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldHMgdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW25vRGVmYXVsdFZhbHVlXSAtIHJldHVybnMgbm8gZGVmYXVsdCB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAqL1xuICAgIGdldFByb3BlcnR5VmFsdWUocHJvcGVydHk6IFByb3BlcnR5LCBub0RlZmF1bHRWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkUHJvcGVydHlWYWx1ZUZyb21EZXNpZ24pIHtcbiAgICAgICAgICAgIGxldCByZXQgPSB0aGlzLl92YWx1ZVtwcm9wZXJ0eS5uYW1lXTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IHVuZGVmaW5lZCAmJiAhbm9EZWZhdWx0VmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0ID0gcHJvcGVydHkuZGVmYXVsdDtcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKSB7Ly9yZWFkIHByb3BlcnR5XG5cbiAgICAgICAgICAgIHZhciByOiBzdHJpbmcgPSA8c3RyaW5nPnRoaXMuY29kZUNoYW5nZXNbcHJvcGVydHkubmFtZV07XG5cbiAgICAgICAgICAgIGlmIChyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJlbnRQcm9wZXJ0eUVkaXRvciA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX3ZhbHVlW3Byb3BlcnR5Lm5hbWVdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVbcHJvcGVydHkubmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKG5vRGVmYXVsdFZhbHVlICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuZGVmYXVsdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0eS5uYW1lID09PSBcIm5ld1wiICYmIHRoaXMudmFyaWFibGVuYW1lPy5zdGFydHNXaXRoKFwibWUuXCIpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJzZXIuZGF0YVtcIm1lXCJdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5wYXJzZXIuZGF0YVtcIm1lXCJdW3RoaXMudmFyaWFibGVuYW1lLnN1YnN0cmluZygzKV07XG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB2YXIgY29uc3RyID0gcHJvcFswXS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChjb25zdHIuc3RhcnRzV2l0aChcInR5cGVkZWNsYXJhdGlvbjpcIikgJiYgcHJvcC5sZW5ndGggPiAxKVxuICAgICAgICAgICAgICAgIGNvbnN0ciA9IHByb3BbMV0udmFsdWU7XG5cbiAgICAgICAgICAgIHJldCA9IGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSwgY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XG4gICAgICAgICAgICBpZiAocmV0ID09PSBcIlwiKVxuICAgICAgICAgICAgICAgIHJldCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5wYXJzZXI/LmdldFByb3BlcnR5VmFsdWUodGhpcy52YXJpYWJsZW5hbWUsIHByb3BlcnR5Lm5hbWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkICYmIHJldCA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX3ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLl92YWx1ZVtwcm9wZXJ0eS5uYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChyZXQpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXQgPT09IHVuZGVmaW5lZCAmJiBub0RlZmF1bHRWYWx1ZSAhPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICByZXQgPSBwcm9wZXJ0eS5kZWZhdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0udXBkYXRlUGFyc2VyKCk7XG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0uZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSwgbm9EZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0ICE9PSByZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgdXBkYXRlQ29kZUVkaXRvcigpIHtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLmV2YWxDb2RlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSB0aGUgcGFyc2VyXG4gICAgICovXG4gICAgdXBkYXRlUGFyc2VyKCkge1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IudXBkYXRlUGFyc2VyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMuY29kZUVkaXRvci52YWx1ZTtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwidGhpc1wiKTtcbiAgICAgICAgICAgIGlmICh0ZXh0KVxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VyLnBhcnNlKHRleHQpO1xuICAgICAgICAgICAgLy8gdGhpcy5wYXJzZXIucGFyc2UodGV4dCwgW3sgY2xhc3NuYW1lOiB2YWw/LmNvbnN0cnVjdG9yPy5uYW1lLCBtZXRob2RuYW1lOiBcImxheW91dFwiIH0sIHsgY2xhc3NuYW1lOiB1bmRlZmluZWQsIG1ldGhvZG5hbWU6IFwidGVzdFwiIH1dKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZHMgYW4gcmVxdWlyZWQgZmlsZSB0byB0aGUgY29kZVxuICAgICAqL1xuICAgIGFkZEltcG9ydElmTmVlZGVkKG5hbWU6IHN0cmluZywgZmlsZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5wYXJzZXIuYWRkSW1wb3J0SWZOZWVkZWQobmFtZSwgZmlsZSk7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRoaXMucGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhcnNlcigpO1xuXG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldHMgdGhlIG5leHQgdmFyaWFibGVuYW1lXG4gICAgICogKi9cbiAgICBnZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLmdldE5leHRWYXJpYWJsZU5hbWVGb3JUeXBlKHR5cGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhZGRzIGFuIFByb3BlcnR5XG4gICAgICogQHBhcmFtIHR5cGUgLSBuYW1lIG9mIHRoZSB0eXBlIG8gY3JlYXRlXG4gICAgICogQHBhcmFtIHNjb3BlbmFtZSAtIHRoZSBzY29wZSB7dmFyaWFibGU6ICxtZXRob2RuYW1lOn0gdG8gYWRkIHRoZSB2YXJpYWJsZSAtIGlmIG1pc3NpbmcgbGF5b3V0KCkgXG4gICAgICogQHJldHVybnMgIHRoZSBuYW1lIG9mIHRoZSBvYmplY3RcbiAgICAgKi9cbiAgICBhZGRWYXJpYWJsZUluQ29kZSh0eXBlOiBzdHJpbmcsIHNjb3BlbmFtZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH0pOiBzdHJpbmcge1xuICAgICAgICB2YXIgdmFsID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIik7XG4gICAgICAgIHZhciByZXQgPSB0aGlzLnBhcnNlci5hZGRWYXJpYWJsZUluQ29kZSh0eXBlLCB1bmRlZmluZWQsIHNjb3BlbmFtZSk7XG4gICAgICAgLyogdmFyIHJldCA9IHRoaXMucGFyc2VyLmFkZFZhcmlhYmxlSW5Db2RlKHR5cGUsIFt7IGNsYXNzbmFtZTogdmFsPy5jb25zdHJ1Y3Rvcj8ubmFtZSwgbWV0aG9kbmFtZTogXCJsYXlvdXRcIiB9LFxuICAgICAgICB7IGNsYXNzbmFtZTogdW5kZWZpbmVkLCBtZXRob2RuYW1lOiBcInRlc3RcIiB9XSwgc2NvcGVuYW1lKTtcbiAgICAgICAgKi90aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIG1vZGlmeSB0aGUgcHJvcGVydHkgaW4gY29kZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHRoZSBuZXcgdmFsdWVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZXBsYWNlXSAgLSBpZiB0cnVlIHRoZSBvbGQgdmFsdWUgaXMgZGVsZXRlZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVuYW1lXSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSAtIGRlZmF1bHQ9dGhpcy52YXJpYWJsZW5hbWVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW2JlZm9yZV0gLSB7dmFyaWFibGVuYW1lLHByb3BlcnR5LHZhbHVlPXVuZGVmaW5lZH1cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc2NvcGUgLSB0aGUgc2NvcGUge3ZhcmlhYmxlOiAsbWV0aG9kbmFtZTp9IHRoZSBzY29wZSAtIGlmIG1pc3NpbmcgbGF5b3V0KCkgXG4gICAgKi9cbiAgICBzZXRQcm9wZXJ0eUluQ29kZShwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZSwgcmVwbGFjZTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgdmFyaWFibGVOYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQsXG4gICAgICAgIGJlZm9yZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU/fSA9IHVuZGVmaW5lZCxcbiAgICAgICAgc2NvcGVuYW1lOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfSA9IHVuZGVmaW5lZCkge1xuXG4gICAgICAgIGlmICh0aGlzLmNvZGVFZGl0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb2RlQ2hhbmdlc1twcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhcmlhYmxlTmFtZSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgICAgIHRoaXMuX211bHRpc2VsZWN0RWRpdG9yc1ttXS51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnNbbV0uc2V0UHJvcGVydHlJbkNvZGUocHJvcGVydHksIHZhbHVlLCByZXBsYWNlLCB2YXJpYWJsZU5hbWUsIGJlZm9yZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvcDtcbiAgICAgICAgaWYgKHZhcmlhYmxlTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSB0aGlzLnZhcmlhYmxlbmFtZTtcbiAgICAgICAgICAgIHByb3AgPSB0aGlzLl92YWx1ZVtwcm9wZXJ0eV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZSh2YXJpYWJsZU5hbWUpW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNGdW5jdGlvbiA9ICh0eXBlb2YgKHByb3ApID09PSBcImZ1bmN0aW9uXCIpO1xuICAgICAgICB2YXIgdmFsID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIik7XG4gICAgICAgIHRoaXMucGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKHZhcmlhYmxlTmFtZSwgcHJvcGVydHksIHZhbHVlLFxuICAgICAgICAgICAgLypbeyBjbGFzc25hbWU6IHZhbD8uY29uc3RydWN0b3I/Lm5hbWUsIG1ldGhvZG5hbWU6IFwibGF5b3V0XCIgfSwgeyBjbGFzc25hbWU6IHVuZGVmaW5lZCwgbWV0aG9kbmFtZTogXCJ0ZXN0XCIgfV0qL3VuZGVmaW5lZCxcbiAgICAgICAgICAgIGlzRnVuY3Rpb24sIHJlcGxhY2UsIGJlZm9yZSwgc2NvcGVuYW1lKTtcbiAgICAgICAgLy9jb3JyZWN0IHNwYWNlc1xuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUuaW5kZXhPZiAmJiB2YWx1ZS5pbmRleE9mKFwiXFxuXCIpID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRoaXMucGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0aGlzLnBhcnNlci5nZXRNb2RpZmllZENvZGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBtb2RpZnkgdGhlIHByb3BlcnR5IGluIGRlc2lnblxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0aGUgbmV3IHZhbHVlXG4gICAgKi9cbiAgICBzZXRQcm9wZXJ0eUluRGVzaWduKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9tdWx0aXNlbGVjdEVkaXRvcnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnNldFByb3BlcnR5SW5EZXNpZ24ocHJvcGVydHksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwibmV3XCIgJiYgdGhpcy52YXJpYWJsZW5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5jb2RlRWRpdG9yLmV2YWxDb2RlKCk7XG4gICAgICAgICAgICAvLyAgdmFyIHRlc3Q9dGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZSh0aGlzLnZhcmlhYmxlbmFtZSk7XG4gICAgICAgICAgICAvLyAgdGhpcy52YWx1ZT10aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHRoaXMudmFyaWFibGVuYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mICh0aGlzLl92YWx1ZVtwcm9wZXJ0eV0pID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICB0aGlzLl92YWx1ZVtwcm9wZXJ0eV0odmFsdWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl92YWx1ZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnb3RvIHNvdXJjZSBwb3NpdGlvblxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAtIGluIENvZGVcbiAgICAgKi9cbiAgICBnb3RvQ29kZVBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50UHJvcGVydHlFZGl0b3IgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yLmdvdG9Db2RlUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3Iudmlld21vZGUgPSBcImNvZGVcIjtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnNldEN1cnNvclBvcml0aW9uKHBvc2l0aW9uKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBnb3RvIHNvdXJjZSBsaW5lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxpbmUgLSBsaW5lIGluIENvZGVcbiAgICAgKi9cbiAgICBnb3RvQ29kZUxpbmUobGluZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudFByb3BlcnR5RWRpdG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRQcm9wZXJ0eUVkaXRvci5nb3RvQ29kZUxpbmUobGluZSk7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci52aWV3bW9kZSA9IFwiY29kZVwiO1xuICAgICAgICB0aGlzLmNvZGVFZGl0b3IuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogbGluZSwgY29sdW1uOiAyMDAgfTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiByZW5hbWVzIGEgdmFyaWFibGUgaW4gY29kZVxuICAgICAqL1xuICAgIHJlbmFtZVZhcmlhYmxlSW5Db2RlKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5jb2RlRWRpdG9yLnZhbHVlO1xuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBmb3VuZCA9IHRydWU7XG4gICAgICAgIGlmIChvbGROYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpXG4gICAgICAgICAgICBvbGROYW1lID0gb2xkTmFtZS5zdWJzdHJpbmcoMyk7XG4gICAgICAgIGlmIChuZXdOYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpXG4gICAgICAgICAgICBuZXdOYW1lID0gbmV3TmFtZS5zdWJzdHJpbmcoMyk7XG4gICAgICAgIGlmIChvbGROYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSlcbiAgICAgICAgICAgIG9sZE5hbWUgPSBvbGROYW1lLnN1YnN0cmluZyg1KTtcbiAgICAgICAgaWYgKG5ld05hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKVxuICAgICAgICAgICAgbmV3TmFtZSA9IG5ld05hbWUuc3Vic3RyaW5nKDUpO1xuICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIlxcXFxXXCIgKyBvbGROYW1lICsgXCJcXFxcV1wiKTtcbiAgICAgICAgd2hpbGUgKGZvdW5kID09IHRydWUpIHtcbiAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlKHJlZywgZnVuY3Rpb24gcmVwbGFjZXIobWF0Y2gsIG9mZnNldCwgc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gcDEgaXMgbm9uZGlnaXRzLCBwMiBkaWdpdHMsIGFuZCBwMyBub24tYWxwaGFudW1lcmljc1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDAsIDEpICsgbmV3TmFtZSArIG1hdGNoLnN1YnN0cmluZyhtYXRjaC5sZW5ndGggLSAxLCBtYXRjaC5sZW5ndGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gY29kZTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlbmFtZXMgYSB2YXJpYWJsZSBpbiBkZXNpZ25cbiAgICAgKi9cbiAgICByZW5hbWVWYXJpYWJsZUluRGVzaWduKG9sZE5hbWU6IHN0cmluZywgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci5yZW5hbWVWYXJpYWJsZShvbGROYW1lLCBuZXdOYW1lKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiByZW1vdmVzIHRoZSB2YXJpYWJsZSBmcm9tIGRlc2lnblxuICAgICogQHBhcmFtICB2YXJuYW1lIC0gdGhlIHZhcmlhYmxlIHRvIHJlbW92ZVxuICAgICovXG4gICAgcmVtb3ZlVmFyaWFibGVJbkRlc2lnbih2YXJuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgLy9UT0RPIHRoaXMgdW5kIHZhcj9cbiAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSAmJiB0aGlzLmNvZGVFZGl0b3IuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwibWVcIikpIHtcbiAgICAgICAgICAgIHZhciB2bmFtZSA9IHZhcm5hbWUuc3Vic3RyaW5nKDMpO1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcy5jb2RlRWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShcIm1lXCIpO1xuICAgICAgICAgICAgZGVsZXRlIG1lW3ZuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvZGVFZGl0b3IucmVtb3ZlVmFyaWFibGVJbkRlc2lnbih2YXJuYW1lKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiByZW1vdmVzIHRoZSB2YXJpYWJsZSBmcm9tIGNvZGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFybmFtZSAtIHRoZSB2YXJpYWJsZSB0byByZW1vdmVcbiAgICAgKi9cbiAgICByZW1vdmVWYXJpYWJsZUluQ29kZSh2YXJuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcnNlci5yZW1vdmVWYXJpYWJsZUluQ29kZSh2YXJuYW1lKTtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gdGhpcy5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFyc2VyKCk7XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgIH1cbiAgICAvKipcbiAgICAqIHJlbW92ZXMgdGhlIHByb3BlcnR5IGZyb20gY29kZVxuICAgICogQHBhcmFtIHt0eXBlfSBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eSB0byByZW1vdmVcbiAgICAqIEBwYXJhbSB7dHlwZX0gW29ubHlWYWx1ZV0gLSByZW1vdmUgdGhlIHByb3BlcnR5IG9ubHkgaWYgdGhlIHZhbHVlIGlzIGZvdW5kXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhcmlhYmxlbmFtZV0gLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgLSBkZWZhdWx0PXRoaXMudmFyaWFibGVuYW1lXG4gICAgKi9cbiAgICByZW1vdmVQcm9wZXJ0eUluQ29kZShwcm9wZXJ0eTogc3RyaW5nLCBvbmx5VmFsdWUgPSB1bmRlZmluZWQsIHZhcmlhYmxlbmFtZTogc3RyaW5nID0gdW5kZWZpbmVkLCBkb3VwZGF0ZSA9IHRydWUpIHtcbiAgICAgICAgaWYgKHRoaXMuY29kZUVkaXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb2RlQ2hhbmdlc1twcm9wZXJ0eV07XG4gICAgICAgICAgICB0aGlzLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb2RlRWRpdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl92YWx1ZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICB0aGlzLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnVwZGF0ZVBhcnNlcigpO1xuICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnJlbW92ZVByb3BlcnR5SW5Db2RlKHByb3BlcnR5LCBvbmx5VmFsdWUsIHZhcmlhYmxlbmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFyaWFibGVuYW1lID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB2YXJpYWJsZW5hbWUgPSB0aGlzLnZhcmlhYmxlbmFtZTtcbiAgICAgICAgaWYgKGRvdXBkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhcnNlcigpOy8vbm90d2VuZGlnP1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXQgPSB0aGlzLnBhcnNlci5yZW1vdmVQcm9wZXJ0eUluQ29kZShwcm9wZXJ0eSwgb25seVZhbHVlLCB2YXJpYWJsZW5hbWUpO1xuICAgICAgICBpZiAoZG91cGRhdGUpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5wYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCk7XG4gICAgICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0ZXh0O1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXJzZXIoKTtcbiAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgLyoqXG4gICAgKiByZW1vdmVzIHRoZSBwcm9wZXJ0eSBpbiBkZXNpZ25cbiAgICAqL1xuICAgIHJlbW92ZVByb3BlcnR5SW5EZXNpZ24ocHJvcGVydHk6IHN0cmluZykge1xuICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IHRoaXMuX211bHRpc2VsZWN0RWRpdG9ycy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgdGhpcy5fbXVsdGlzZWxlY3RFZGl0b3JzW21dLnJlbW92ZVByb3BlcnR5SW5EZXNpZ24ocHJvcGVydHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMuX3ZhbHVlW3Byb3BlcnR5XSkgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlW3Byb3BlcnR5XSh1bmRlZmluZWQpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVbcHJvcGVydHldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSBjYXRjaCB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl92YWx1ZVtwcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsYXlvdXQobWUgPSB1bmRlZmluZWQpIHtcblxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICB9XG59XG5AJENsYXNzKFwiamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvclRlc3RTdWJQcm9wZXJ0aWVzXCIpXG5leHBvcnQgY2xhc3MgUHJvcGVydHlFZGl0b3JUZXN0U3ViUHJvcGVydGllcyB7XG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgbnVtOiBudW1iZXIgPSAxOTtcbiAgICBAJFByb3BlcnR5KClcbiAgICB0ZXh0OiBzdHJpbmcgPSBcInByb3BcIjtcbn1cblxuXG5cbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9yVGVzdFByb3BlcnRpZXNcIilcbmNsYXNzIFRlc3RQcm9wZXJ0aWVzIHtcbiAgICBAJFByb3BlcnR5KHsgZGVjcmlwdGlvbjogXCJuYW1lIG9mIHRoZSBkaWFsb2dcIiwgfSlcbiAgICBkaWFsb2duYW1lOiBzdHJpbmc7XG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgY2hlY2tlZDogYm9vbGVhbjtcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJjb2xvclwiIH0pXG4gICAgY29sb3I6IHN0cmluZztcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJjb21wb25lbnRzZWxlY3RvclwiLCBjb21wb25lbnRUeXBlOiBcImphc3NpLnVpLkNvbXBvbmVudFwiIH0pXG4gICAgY29tcG9uZW50OiBDb21wb25lbnQ7XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwiZGF0YWJpbmRlclwiIH0pXG4gICAgZGF0YWJpbmRlcjogYW55O1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImRib2JqZWN0XCIsIGNvbXBvbmVudFR5cGU6IFwiZGUuS3VuZGVcIiB9KVxuICAgIGRib2JqZWN0O1xuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiA4MCB9KVxuICAgIG51bTogbnVtYmVyO1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImZvbnRcIiB9KVxuICAgIGZvbnQ6IG51bWJlcjtcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJmdW5jdGlvblwiIH0pXG4gICAgZnVuYyhhbnkpIHtcblxuICAgIH07XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwiaHRtbFwiIH0pXG4gICAgaHRtbDogc3RyaW5nID0gXCJzYW1wbGVcIjtcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJpbWFnZVwiIH0pXG4gICAgaW1hZ2U6IHN0cmluZztcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJqc29uXCIsIGNvbXBvbmVudFR5cGU6IFwiamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvclRlc3RTdWJQcm9wZXJ0aWVzXCIgfSlcbiAgICBqc29uOiBhbnk7XG5cbn1cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciByZXQgPSBuZXcgUHJvcGVydHlFZGl0b3IoKTtcbiAgICByZXQudmFsdWUgPSBuZXcgVGVzdFByb3BlcnRpZXMoKTtcbiAgICByZXR1cm4gcmV0O1xufSJdfQ==