import "jassijs/ext/jquerylib";
import { $Class } from "jassijs/remote/Registry";
import "jassijs/base/PropertyEditorService";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { Image } from "jassijs/ui/Image";

import { Tools } from "jassijs/util/Tools";
import registry from "jassijs/remote/Registry";
import { ComponentDescriptor } from "jassijs/ui/ComponentDescriptor";
import { NameEditor } from "jassijs/ui/PropertyEditors/NameEditor";
import { propertyeditor } from "jassijs/base/PropertyEditorService";
import { Property, $Property } from "jassijs/ui/Property";
import { Editor } from "jassijs/ui/PropertyEditors/Editor";
import { Component, createComponent } from "jassijs/ui/Component";
import { Container } from "jassijs/ui/Container";
import { classes } from "jassijs/remote/Classes";
import { Action } from "jassijs/base/Actions";
import { createElement } from "react";


declare global {
    export interface ExtensionAction {
        getPropertyEditorActions?: { propertyEditor: PropertyEditor, actions: Action[] }
    }
}
export interface ParserInterface {
    sourceFile;//: ts.SourceFile = undefined;
    typeMeNode;//: ts.Node;
    typeMe: { [name: string]: any/*Entry*/ };// = {};
    classes: { [name: string]: any/* ParsedClass*/ };// = {};
    imports: { [name: string]: string };// = {};
    functions: { [name: string]: ts.Node };// = {};
    variables: { [name: string]: ts.Node };// = {};
    classScope: { classname: string, methodname: string }[];
    updateCode(code:string);
    code: string;
    data: { [variable: string]: { [property: string]: any[] } };
    getModifiedCode(): string;
    addTypeMe(name: string, type: string);
    /**
   * parse the code 
   * @param {string} code - the code
   * @param {string} onlyfunction - only the code in the function is parsed, e.g. "layout()"
   */
    parse(code: string, classScope?: { classname: string, methodname?: string }[]);
    /**
     * add import {name} from file
     * @param name 
     * @param file 
     */
    addImportIfNeeded(name: string, file: string);
    //searchClassnode(node: ts.Node, pos: number);
    getClassScopeFromPosition(code: string, pos: number): { classname: string, methodname: string };

    /** 
     * modify a member 
     **/
    addOrModifyMember(member/*: ParsedMember*/, pclass/*: ParsedClass*/);
    /**
    * removes the property from code
    * @param {type} property - the property to remove
    * @param {type} [onlyValue] - remove the property only if the value is found
    * @param {string} [variablename] - thpe name of the variable - default=this.variablename
    */
    removePropertyInCode(property: string, onlyValue?, variablename?: string): any;
    /**
     * removes the variable from code
     * @param {string} varname - the variable to remove
     */
    removeVariablesInCode(varnames: string[]);
    /**
     * gets the next variablename
     * */
    getNextVariableNameForType(type: string, suggestedName?: string);
    /**
    * modify the property in code
    * @param variablename - the name of the variable
    * @param  property - the property 
    * @param value - the new value
    * @param classscope  - the property would be insert in this block
    * @param isFunction  - true if the property is a function
    * @param [replace]  - if true the old value is deleted
    * @param [before] - the new property is placed before this property
    * @param [variablescope] - if this scope is defined - the new property would be insert in this variable
    */
    setPropertyInCode(variableName: string, property: string, value: string | any/*ts.Node*/,
        classscope: { classname: string, methodname: string }[],
        isFunction: boolean, replace: boolean,
        before?: { variablename: string, property: string, value?},
        variablescope?: { variablename: string, methodname });
    /**
    * swaps two statements indendified by  functionparameter in a variable.property(parameter1) with variable.property(parameter2)
    **/
    swapPropertyWithParameter(variable: string, property: string, parameter1: string, parameter2: string);
    /**
    * adds an Property
    * @param type - name of the type o create
    * @param classscope - the scope (methodname) where the variable should be insert Class.layout
    * @param variablescope - the scope where the variable should be insert e.g. hallo.onclick
    * @returns  the name of the object
    */
    addVariableInCode(fulltype: string, classscope: { classname: string, methodname: string }[], variablescope?: { variablename: string, methodname }, suggestedName?, codeHasChanged?): string;

    //addVariableInCode(fulltype: string, classscope: { classname: string, methodname: string }[], variablescope?: { variablename: string, methodname } , suggestedName?): string;
    getPropertyValue(variable, property): any;
    renameVariable(oldName:string,newName:string);
}
@$Class("jassijs.ui.PropertyEditor")
export class PropertyEditor extends Panel {
    readPropertyValueFromDesign: boolean = false;
    table: Component;
    codeEditor;
    parser: ParserInterface;
    variablename: string;
    parentPropertyEditor: PropertyEditor;
    _multiselectEditors: PropertyEditor[];
    showThisProperties;
    properties;
    _value;
    codeChanges: { [property: string]: string | {} } = {};
    toolbar: Panel;
    actions: Action[];
    /**
    * edit object properties
    */
    constructor(codeEditor = undefined, parser = undefined) {
        super();
        this.table = createComponent(this.createTable()) as any;
        this.toolbar = new Panel();
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
        return <table style={{ tableLayout: "fixed", fontSize: "11px" }}>
            <thead>
                <tr>
                    <th className="propertyeditorheader">Name</th>
                    <th className="propertyeditorheader">Value</th>
                </tr>
            </thead>
            <tbody>
                <tr className="propertyeditorrow">
                    <td >a1</td><td>b1</td>
                </tr>
            </tbody>
        </table>;
    }
    componentDidMount(): void {

    }
    /**
     * adds a new property
     * @param {string} name  - the name of the property
     * @param {jassijs.ui.PropertyEditors.Editor} editor - the propertyeditor to render the property
     * @param {string} description - the the description is tooltip over the name
     */
    addProperty(name: string, editor: Editor, description: string) {
        var component = editor.getComponent();
        //dont work
        //var row =Component.createHTMLElement('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>');
        var row = Component.createHTMLElement('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>');
        //var row=$('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>')[0];
        var deletebutton = new Image();
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
        } catch {
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
    isVariableAutoGenerated(varname){
        return this.codeEditor.isVariableAutogenerated(varname);
    }
    /**
     * @member {object}  - the rendered object 
     */
    set value(value) {


        if (value !== this._value && this.parentPropertyEditor === undefined)
            this.codeChanges = {};
        if (value !== undefined || value?.dom !== undefined) {
            //if (!$(value.dom).is(":focus"))
            if (value.dom && document.activeElement !== value.dom && value.dom.focus)
                (value.dom as HTMLElement).focus();
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
                var multi = new PropertyEditor(this.codeEditor, this.parser);
                multi.codeEditor = this.codeEditor;
                multi.parentPropertyEditor = this.parentPropertyEditor;
                multi.value = value[x];
                multi.parser = this.parser;
                if (multi.codeEditor !== undefined)
                    this.variablename = this.codeEditor.getVariableFromObject(value[x]);
                this._multiselectEditors.push(multi);
            }
            this._value = value;
        } else
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
    private addActions() {
        var _this = this;
        var all: Action[] = [];
        this.actions?.forEach((e) => all.push(e));
        if (this._value?.extensionCalled) {

            this._value?.extensionCalled(
                {
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
    private createAction(action: Action) {
        var bt = new Button();
        bt.icon = action.icon;
        bt.onclick(() =>
            action.call(this._value, this)
        );
        bt.tooltip = action.description;
        return bt;
    }
    swapComponents(first: Component, second: Component) {
        //swap Design
        if (first._parent !== second._parent)
            throw "swaped components must have the same parent"
        var parent: Container = first._parent;
        var ifirst = parent._components.indexOf(first);
        var isecond = parent._components.indexOf(second);
        var dummy = Component.createHTMLElement("<div/>");

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
    private controlEditor(editor) {
        let _this = this;
        editor.onedit(function (event) {
            _this.callEvent("propertyChanged", event);
            let deletebutton = editor.component.dom.parentNode.parentNode.children[0].children[0];
            if (deletebutton)
                deletebutton.style.visibility = 'visible';
        });
    }
    private _initValue(): boolean {
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
                        props = ComponentDescriptor.describe(this._value[0].constructor)?.fields;
                    else
                        props = ComponentDescriptor.describe(this._value.constructor)?.fields;
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
        var allProperties: { name: string, editor: Editor, description: string, isVisible?: (object) => boolean }[] = [];

        if (_this._multiselectEditors.length === 0) {
            var hasvarname = _this.getVariableFromObject(_this._value);
            if (hasvarname !== undefined) {
                var nameEditor = new NameEditor("name", _this);
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
            } else {
                _this.properties[props[x].name] = { isVisible: props[x].isVisible, name: props[x].name, component: undefined, description: props[x].description };

                var editor: Editor = propertyeditor.createFor(props[x], _this) as Editor;
                if (editor["then"]) {//editor is not loaded yet
                    editorNotLoaded.push(editor);

                } else {
                    //  if (classes.getClassName(editor) === "jassijs.ui.PropertyEditors.LoadingEditor") {
                    //    this.hasLoadingEditor = true;
                    // }
                    if (editor === undefined) {
                        console.log("Editor not found for " + _this.variablename);
                        continue;
                    }
                    var sname = editor.property.name;
                    this.controlEditor(editor);
                    if (_this.properties[(editor as Editor).property.name] === undefined) {
                        console.log("Property not found " + (editor as Editor).property);
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
                _this.value = this.value;//load again
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
                    } else {
                        prop.editor.component.dom.parentNode.style.display = 'none';
                        label.style.display = 'none';
                    }

                }
                let deletebutton = prop.editor.component.dom.parentNode.parentNode.children[0].children[0];
                if (deletebutton) {
                    var ll = this.getPropertyValue(prop, false);
                    if (ll === undefined) {
                        deletebutton.style.visibility = 'hidden';
                    } else {
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
    getPropertyValue(property: Property, noDefaultValue = undefined) {
        if (this.readPropertyValueFromDesign) {
            let ret = this._value[property.name];
            if (ret === undefined && !noDefaultValue)
                ret = property.default;
            return ret;
        }
        var ret = undefined;
        if (this.codeEditor === undefined) {//read property

            var r: string = this.codeChanges[property.name] as string;

            if (r === undefined) {
                if (this.parentPropertyEditor === undefined && this._value[property.name])
                    return this._value[property.name];
                if (noDefaultValue !== true)
                    return property.default;
                return r;
            }
            return r;
        }
        if (property.name === "new" && this.variablename?.startsWith("me.")) {
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

        } else {
            ret = this.parser?.getPropertyValue(this.variablename, property.name);
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
        } else {
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
    addImportIfNeeded(name: string, file: string) {
        if (this.codeEditor === undefined)
            return;
        this.parser.addImportIfNeeded(name, file);
        this.codeEditor.value = this.parser.getModifiedCode();
        this.updateParser();

    }
    /**
     * gets the next variablename
     * */
    getNextVariableNameForType(type: string) {
        return this.parser.getNextVariableNameForType(type);
    }
    /**
     * adds an Property
     * @param type - name of the type o create
     * @param scopename - the scope {variable: ,methodname:} to add the variable - if missing layout() 
     * @returns  the name of the object
     */
    addVariableInCode(type: string, scopename: { variablename: string, methodname: string }, suggestedName: string = undefined): string {
        var val = this.codeEditor.getObjectFromVariable("this");
        var codeHasChanged: any = {}
        var ret = this.parser.addVariableInCode(type, undefined, scopename, suggestedName,codeHasChanged);
        /* var ret = this.parser.addVariableInCode(type, [{ classname: val?.constructor?.name, methodname: "layout" },
         { classname: undefined, methodname: "test" }], scopename);
         */
        if (codeHasChanged?.value === false) {

        } else {
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
    setPropertyInCode(property: string, value, replace: boolean = undefined, variableName: string = undefined,
        before: { variablename: string, property: string, value?} = undefined,
        scopename: { variablename: string, methodname: string } = undefined, doUpdate = true) {

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
            } else {
                prop = this.codeEditor.getObjectFromVariable(variableName)[property];
            }
            isFunction = (typeof (prop) === "function");
        }
        this.parser.setPropertyInCode(variableName, property, value,
            /*[{ classname: val?.constructor?.name, methodname: "layout" }, { classname: undefined, methodname: "test" }]*/undefined,
            isFunction, replace, before, scopename);
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
    setPropertyInDesign(property: string, value) {
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
            if(this._value.config){
                var prop:any={};
                prop[property]=value;
                this._value.config(prop);
            }else
                this._value[property] = value;


        }
        var updateDummies=this.codeEditor?.getDesigner().updateDummies;
        if(updateDummies){
           this.codeEditor?.getDesigner().updateDummies();
        }
    }
    /**
     * goto source position
     * @param position - in Code
     */
    gotoCodePosition(position: number) {
        if (this.parentPropertyEditor !== undefined)
            return this.parentPropertyEditor.gotoCodePosition(position);
        this.codeEditor.viewmode = "code";
        this.codeEditor.setCursorPorition(position);

    }
    /**
     * goto source line
     * @param {number} line - line in Code
     */
    gotoCodeLine(line: number) {
        if (this.parentPropertyEditor !== undefined)
            return this.parentPropertyEditor.gotoCodeLine(line);
        this.codeEditor.viewmode = "code";
        this.codeEditor.cursorPosition = { row: line, column: 200 };

    }
    /**
     * renames a variable in code
     */
    renameVariableInCode(oldName: string, newName: string) {
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
        var newvarname=this.parser.renameVariable(oldName,newName);
        this.codeEditor.value = this.parser.getModifiedCode();
        //this.codeEditor.value = code;
        this.updateParser();
        this.callEvent("codeChanged", {});
        return newvarname;
    }
    /**
     * renames a variable in design
     */
    renameVariableInDesign(oldName: string, newName: string,autogenerated:boolean=false) {
        this.codeEditor.renameVariable(oldName, newName,autogenerated);
    }
    /**
    * removes the variable from design
    * @param  varname - the variable to remove
    */
    removeVariableInDesign(varname: string) {
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
    removeVariablesInCode(varname: string[]) {
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
    removePropertyInCode(property: string, onlyValue = undefined, variablename: string = undefined, doupdate = true) {
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
            this.updateParser();//notwendig?
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
    removePropertyInDesign(property: string) {
        for (var m = 0; m < this._multiselectEditors.length; m++) {
            this._multiselectEditors[m].removePropertyInDesign(property);
        }
        if (typeof (this._value[property]) === "function")
            this._value[property](undefined);
        else {
            try {
                this._value[property] = undefined;
            } catch {

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
}
@$Class("jassijs.ui.PropertyEditorTestSubProperties")
export class PropertyEditorTestSubProperties {
    @$Property()
    num: number = 19;
    @$Property()
    text: string = "prop";
}



@$Class("jassijs.ui.PropertyEditorTestProperties")
class TestProperties {
    @$Property({ decription: "name of the dialog" })
    dialogname: string;
    @$Property()
    checked: boolean;
    @$Property({ type: "color" })
    color: string;
    @$Property({ type: "componentselector", componentType: "jassi.ui.Component" })
    component: Component;
    @$Property({ type: "databinder" })
    databinder: any;
    @$Property({ type: "dbobject", componentType: "de.Kunde" })
    dbobject;
    @$Property({ default: 80 })
    num: number;
    @$Property({ type: "font" })
    font: number;
    @$Property({ type: "function" })
    func(any) {

    };
    @$Property({ type: "html" })
    html: string = "sample";
    @$Property({ type: "image" })
    image: string;
    @$Property({ type: "json", componentType: "jassijs.ui.PropertyEditorTestSubProperties" })
    json: any;

}
export function test() {
    var ret = new PropertyEditor();
    ret.value = new TestProperties();
    return ret;
}