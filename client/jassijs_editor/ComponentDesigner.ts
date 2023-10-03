import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { VariablePanel } from "jassijs/ui/VariablePanel";
import { PropertyEditor } from "jassijs/ui/PropertyEditor";
import { ComponentExplorer } from "jassijs_editor/ComponentExplorer";
import { ComponentPalette } from "jassijs_editor/ComponentPalette";
import { Resizer } from "jassijs_editor/util/Resizer";
//import DragAndDropper from "jassijs/ui/helper/DragAndDropper";
import { ErrorPanel } from "jassijs_editor/ErrorPanel";
import { CodeEditorInvisibleComponents } from "jassijs_editor/CodeEditorInvisibleComponents";
import { Repeater } from "jassijs/ui/Repeater";
import "jassijs/ui/Databinder";
import { Button } from "jassijs/ui/Button";
import { Component } from "jassijs/ui/Component";
import { DragAndDropper } from "jassijs_editor/util/DragAndDropper";
import { ComponentDescriptor } from "jassijs/ui/ComponentDescriptor";
import { classes } from "jassijs/remote/Classes";
import { Container } from "jassijs/ui/Container";
import { BoxPanel } from "jassijs/ui/BoxPanel";
//import { Parser } from "./util/Parser";



class ClipboardData {
    varNamesToCopy: string[] = [];
    children: { [name: string]: string[] } = {};
    properties: { [name: string]: { [propname: string]: any[] } } = {};
    types: { [name: string]: string } = {};
    allChilds: string[] = [];
}


@$Class("jassijs_editor.ComponentDesigner")
export class ComponentDesigner extends Panel {
    _codeEditor;
    editMode: boolean;
    variables: VariablePanel;
    _propertyEditor: PropertyEditor;
    _errors: ErrorPanel;
    _componentPalette: ComponentPalette;
    _componentExplorer: ComponentExplorer;
    _invisibleComponents: CodeEditorInvisibleComponents;
    _designToolbar: Panel;
    _designPlaceholder: Panel;
    _resizer: Resizer;
    _draganddropper: DragAndDropper;
    saveButton: Button;
    runButton: Button;
    lassoButton: Button;
    undoButton: Button;
    editButton: Button;
    cutButton: Button;
    inlineEditorPanel: Panel;
    copyButton: Button;
    pasteButton: Button;

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
        this._propertyEditor = new PropertyEditor(value, undefined);
        //   this._propertyEditor=new PropertyEditor(undefined);
        this._errors = this._codeEditor._errors;
        this._componentPalette = new ComponentPalette();
        this._componentPalette.service = "$UIComponent";
        this._componentExplorer = new ComponentExplorer(value, this._propertyEditor);
        this._invisibleComponents = new CodeEditorInvisibleComponents(value);
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
        this._designToolbar = new Panel();
        this._designPlaceholder = new Panel();
        this.editButton = new Button();
        this.editButton.icon = "mdi mdi-run mdi-18px";
        this.editButton.tooltip = "Test Dialog";
        this.editButton.onclick(function () {
            _this.editDialog(!_this.editMode);

        });

        this._designToolbar.add(this.editButton);

        this.saveButton = new Button();
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

        this.undoButton = new Button();
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




        this.lassoButton = new Button();
        this.lassoButton.icon = "mdi mdi-lasso mdi-18px";
        this.lassoButton.tooltip = "Select rubberband";
        this.lassoButton.onclick(function () {
            var val = _this.lassoButton.toggle();
            _this._resizer.setLassoMode(val);
            _this._draganddropper.enableDraggable(!val);
            //_this._draganddropper.activateDragging(!val);
        });
        this._designToolbar.add(this.lassoButton);

        this.cutButton = new Button();
        this.cutButton.icon = "mdi mdi-content-cut mdi-18px";
        this.cutButton.tooltip = "Cut selected Controls (Ctrl+Shift+X)";
        this.cutButton.onclick(function () {
            _this.cutComponent();
        });
        this._designToolbar.add(this.cutButton);


        this.copyButton = new Button();
        this.copyButton.icon = "mdi mdi-content-copy mdi-18px";
        this.copyButton.tooltip = "Copy (Ctrl+Shift+C)";
        this.copyButton.onclick(function () {
            _this.copy();
        });
        this._designToolbar.add(this.copyButton);
        this.pasteButton = new Button();
        this.pasteButton.icon = "mdi mdi-content-paste mdi-18px";
        this.pasteButton.tooltip = "Paste (Ctrl+Shift+V)";
        this.pasteButton.onclick(function () {
            _this.paste();
        });
        this._designToolbar.add(this.pasteButton);
        var box = new BoxPanel();
        box.horizontal = true;

        this.inlineEditorPanel = new Panel();
        this.inlineEditorPanel._id = "i" + this.inlineEditorPanel._id;
        this.inlineEditorPanel.dom.setAttribute("id", this.inlineEditorPanel._id);
        this.inlineEditorPanel.dom.style.display = "inline";
        this.inlineEditorPanel.domWrapper.style.display = "inline";
        this.inlineEditorPanel.dom.classList.add("InlineEditorPanel");

        //   box.height=40;
        box.add(this._designToolbar);
        box.add(this.inlineEditorPanel);
        this.add(box);
        this._designPlaceholder.domWrapper.style.position = "relative";
        this.add(this._designPlaceholder);

    }
    /**
   * manage shortcuts
   */
    registerKeys() {
        var _this = this;
        this._codeEditor._design.dom.tabindex = "1";
        this._codeEditor._design.dom.addEventListener("keydown", function (evt) {
            if (evt.keyCode === 115 && evt.shiftKey) {//F4
                // var thiss=this._this._id;
                // var editor = ace.edit(this._this._id);
                _this.evalCode(true);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === 115) {//F4
                _this.evalCode(false);
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 90 && evt.ctrlKey) {//Ctrl+Z
                _this.undo();
            }
            if (evt.keyCode === 116) {//F5
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 46 || (evt.keyCode === 88 && evt.ctrlKey && evt.shiftKey)) {//Del or Ctrl X)
                _this.cutComponent();
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 67 && evt.ctrlKey && evt.shiftKey) {//Ctrl+C
                _this.copy();
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 86 && evt.ctrlKey && evt.shiftKey) {//Ctrl+V
                _this.paste();
                evt.preventDefault();
                return false;
            }
            if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey)/* && (evt.which == 19)*/) {//Str+s
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
        var text = await this.copy();
        if (await navigator.clipboard.readText() !== text) {
            alert("could not copy to Clipboard.")
            return;
        }
        var clip: ClipboardData = JSON.parse(text);//to Clipboard

        var all = [];
        for (var x = 0; x < clip.allChilds.length; x++) {
            var varname = clip.allChilds[x];//this._codeEditor.getVariableFromObject(todel);
            var todel = this._codeEditor.getObjectFromVariable(varname);
            if (varname !== "this") {
                if (todel?.domWrapper?._parent !== undefined) {
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
    private copyProperties(clip: ClipboardData, component: Component) {
        var varname = this._codeEditor.getVariableFromObject(component);
        var parserdata = this._propertyEditor.parser.data[varname];
        clip.allChilds.push(varname);
        clip.types[varname] = classes.getClassName(component);
        if (!clip.properties[varname]) {
            clip.properties[varname] = {};
        }
        var editorfields = {};
        ComponentDescriptor.describe(component.constructor)?.fields.forEach((f) => { editorfields[f.name] = f });
        for (var key in parserdata) {
            if (editorfields[key] || key === "_new_" || key === "add") {
                if (!clip.properties[varname][key]) {
                    clip.properties[varname][key] = []
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
    async copy(): Promise<string> {

        var components = this._propertyEditor.value;
        if (!Array.isArray(components)) {
            components = [components];
        }

        var clip = new ClipboardData();
        clip.varNamesToCopy = [];
        for (var x = 0; x < components.length; x++) {
            var component: Component = components[x];
            var varname = this._codeEditor.getVariableFromObject(component);
            clip.varNamesToCopy.push(varname);
            this.copyProperties(clip, component);
        }



        var text = JSON.stringify(clip);
        await navigator.clipboard.writeText(text);
        return text;
    }
    private async pasteComponent(clip: ClipboardData, target: Container, before: Component, varname: string, variablelistold: any[], variablelistnew: any[]) {
        var _this = this;
        var created: Component;
        if (clip.properties[varname] !== undefined && clip.properties[varname]["_new_"] !== undefined) {

            var vartype = clip.properties[varname]["_new_"][0];
            if (variablelistold.indexOf(varname) > -1)
                return;
            vartype = vartype.split("(")[0].split("new ")[1];

            var targetname = _this._codeEditor.getVariableFromObject(target);
            var newcomp = { createFromType: clip.types[varname] };
            await classes.loadClass(clip.types[varname]);
            var svarname = varname.split(".")[varname.split(".").length - 1];

            created = _this.createComponent(clip.types[varname], newcomp, undefined, undefined, target, before, false, svarname);
            variablelistold.push(varname);
            var newvarname = _this._codeEditor.getVariableFromObject(created);
            variablelistnew.push(newvarname);
            //correct designdummy
            for (var t = 0; t < target._components.length; t++) {
                var ch = target._components[t];
                if (ch["type"] === "atEnd") {
                    target.remove(ch);
                    // target.add(ch);
                    break;
                }
            }
        } else {
            //component is already created outside the code
            created = _this._codeEditor.getObjectFromVariable(varname);
        }
        if (clip.children[varname] !== undefined) {
            for (var k = 0; k < clip.children[varname].length; k++) {
                await _this.pasteComponent(clip, <Container>created, undefined, clip.children[varname][k], variablelistold, variablelistnew);
            }
        }
        return created;
    }
    async paste() {
        var text = await navigator.clipboard.readText();
        var created
        var clip: ClipboardData = JSON.parse(text);
        var _this = this;
        var variablelistold = [];
        var variablelistnew = [];
        //create Components
        for (var x = 0; x < clip.varNamesToCopy.length; x++) {
            var varname = clip.varNamesToCopy[x];
            var target: Container = _this._propertyEditor.value;
            if (target._components !== undefined)
                await _this.pasteComponent(clip, target, undefined, varname, variablelistold, variablelistnew);
            else {
                // if(x===0)
                //    before=target;
                await _this.pasteComponent(clip, target._parent, target, varname, variablelistold, variablelistnew);
            }
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
            var variablename = variablelistnew[x]
            for (var key in clip.properties[variablename]) {
                if (key !== "_new_" && key !== "config" && key != "add") {
                    var propdata = clip.properties[variablename][key];
                    for (var v = 0; v < propdata.length; v++) {
                        var svalue: string = propdata[v];
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
                            } else {
                                component[key] = realvalue;
                            }
                        } catch {

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
    private getComponentIDsInDesign(component: Component, collect: string[]) {

        collect.push("#" + component._id);
        var childs = component["_components"];
        if (childs !== undefined) {
            for (let x = 0; x < childs.length; x++) {
                this.getComponentIDsInDesign(childs[x], collect);
            }
        }
    }
    createDragAndDropper(): DragAndDropper {
        return new DragAndDropper();
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
        var comps = component.dom.querySelectorAll(".jcomponent");
        comps.forEach((c) => c.classList.add("jdesignmode"));
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
        this.variables.updateCache();//variables can be added with Repeater.setDesignMode
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
            } else
                allcomponents = this.variables.getEditableComponents(component);
            //this._installTinyEditor();
            this._draganddropper = this.createDragAndDropper();
            this._resizer = new Resizer();
            this._resizer.draganddropper = this._draganddropper;

            this._resizer.onelementselected = function (elementIDs, e) {
                var ret = [];
                for (var x = 0; x < elementIDs.length; x++) {
                    var ob = document.getElementById(elementIDs[x])._this;
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

            this._resizer.onpropertychanged = function (comp: Component, prop: string, value: any) {
                if (_this._propertyEditor.value !== comp)
                    _this._propertyEditor.value = comp;
                _this._propertyEditor.setPropertyInCode(prop, value + "", true);
                _this._propertyEditor.value = _this._propertyEditor.value;
            };
            this._resizer.install(component, allcomponents);
            allcomponents = this.variables.getEditableComponents(component, true);
            if (this._draganddropper) {
                this._draganddropper.install(component, allcomponents);
                this._draganddropper.onpropertychanged = function (component, top, left, oldParent, newParent, beforeComponent) {
                    _this.moveComponent(component, top, left, oldParent, newParent, beforeComponent);
                }
                this._draganddropper.onpropertyadded = function (type, component, top, left, newParent, beforeComponent) {
                    _this.createComponent(type, component, top, left, newParent, beforeComponent);

                }

                this._draganddropper.isDragEnabled = function (event, ui) {
                    if (_this._resizer === undefined)
                        return false;
                    return _this._resizer.componentUnderCursor !== undefined;
                }
            }
        } else {

        }
        this._componentExplorer.update();
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
        } else {
            _this._propertyEditor.removePropertyInCode("x");
        }
        if (left !== undefined) {
            _this._propertyEditor.setPropertyInCode("y", left + "", true);
        } else {
            _this._propertyEditor.removePropertyInCode("y");
        }

        if (oldParent !== newParent || beforeComponent !== undefined || top === undefined) {//top=undefined ->on relative position at the end call the block
            //get Position
            var oldVal = _this._propertyEditor.removePropertyInCode("add", compName, oldName, false);
            var before;
            if (beforeComponent !== undefined && beforeComponent.type !== "atEnd") {//designdummy atEnd
                var on = _this._codeEditor.getVariableFromObject(beforeComponent);
                var par = _this._codeEditor.getVariableFromObject(beforeComponent._parent);
                before = { variablename: par, property: "add", value: on };
            }
            _this._propertyEditor.setPropertyInCode("add", /*compName*/oldVal, false, newName, before);

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
    createComponent(type, component, top, left, newParent, beforeComponent, doUpdate = true, suggestedName: string = undefined): Component {
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
        var varvalue = new (classes.getClass(type));
        var varname = _this.createVariable(type, scope, varvalue, suggestedName);
        if (this._propertyEditor.codeEditor !== undefined) {

            var newName = _this._codeEditor.getVariableFromObject(newParent);
            var before;
            if (beforeComponent !== undefined && beforeComponent.type !== "atEnd") {//Designdummy atEnd
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
        } else {
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
    createVariable(type, scope, varvalue, suggestedName: string = undefined) {
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
        if (component instanceof Repeater) {
            return component;
        }
        return this._hasRepeatingContainer(component._parent);
    }

    private fillVariables(root: Component, component: Component, cache: { [componentid: string]: { line: number, column: number } }) {
        if (cache[component._id] === undefined && component["__stack"] !== undefined) {
            var lines = component["__stack"]?.split("\n");
            for (var x = 0; x < lines.length; x++) {
                var sline: string = lines[x];
                if (sline.indexOf("$temp.js") > 0) {
                    var spl = sline.split(":");
                    var entr = {

                    }
                    cache[component._id] = {
                        line: Number(spl[spl.length - 2]),
                        column: Number(spl[spl.length - 1].replace(")", ""))
                    }
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

        this.dom.focus();


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
        if (this._resizer !== undefined) {
            this._resizer.uninstall();
        }
        if (this._draganddropper !== undefined) {
            this._draganddropper.isDragEnabled = undefined;
            this._draganddropper.uninstall();
        }
        this._propertyEditor?.destroy();
        this._componentPalette?.destroy();
        this._componentExplorer?.destroy();
        this._invisibleComponents?.destroy();
        super.destroy();
    }

}
export async function test() {
    return new ComponentDesigner();

};


