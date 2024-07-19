import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { Tree } from "jassijs/ui/Tree";
import { ComponentDescriptor } from "jassijs/ui/ComponentDescriptor";
import { ContextMenu } from "jassijs/ui/ContextMenu";
import { Action, Actions } from "jassijs/base/Actions";
import { Container } from "jassijs/ui/Container";
//import { CodeEditor } from "jassijs_editor/CodeEditor";
import { ComponentDesigner } from "jassijs_editor/ComponentDesigner";
import { PropertyEditor } from "jassijs/ui/PropertyEditor";
import { propertyeditor } from "jassijs/base/PropertyEditorService";
import { classes } from "jassijs/remote/Classes";
import { Component } from "jassijs/ui/Component";

@$Class("jassijs_editor.ComponentExplorer")
export class ComponentExplorer extends Panel {
    codeEditor;//:CodeEditor;
    propertyEditor: PropertyEditor;
    tree: Tree;
    //contextMenu:ContextMenu;
    _value;
    /**
    * edit object properties
    */
    constructor(codeEditor, propertyEditor: PropertyEditor) {
        super();
        /** @member {jassijs_editor.CodeEditor} - the parent CodeEditor */
        this.codeEditor = codeEditor;
        this.tree = new Tree();
        this.tree.height = "100%";
        this.contextMenu = new ContextMenu();
        this.add(this.contextMenu);
        this.layout();
        this.propertyEditor = propertyEditor;
    }
    /**
     * @member {jassijs.ui.Component}  - the rendered object 
     */
    set value(value) {
        this._value = value;
        this.tree.items = (value === undefined ? [] : value);
        this.tree.expandAll();
    }
    get value() {
        return this._value;
    }
    /**
     * get the displayname of the item
     * must be override
     * @param {object} item
     */
    getComponentName(item) {
        return item;
    }

    /**
     * get the child components
     * must be override
     * @param {object} item
     */
    getComponentChilds(item) {
        if (this.codeEditor === undefined)
            return this.getComponentChildsOld(item);
        if (item === undefined)
            return [];
        var ret = [];
        if (item.dom?._thisOther) {
            // <Comp1><Comp2><div> rsults in Tree Comp1-Comp2-div
            //
            var pos = item.dom?._thisOther.indexOf(item);
            if (pos == -1)
                pos = 0;
            else
                pos++;
            if (pos < item.dom?._thisOther.length) {
                var varname = this.codeEditor.getVariableFromObject(item.dom._thisOther[pos]);
                if (varname) {
                    ret.push(item.dom._thisOther[pos]);
                    return ret;
                }
            }
        }
        if (item.dom?.childNodes) {
            for (var x = 0; x < item.dom.childNodes.length; x++) {
                var nd = item.dom.childNodes[x];
                var varname = this.codeEditor.getVariableFromObject(nd._this);
                if (varname)
                    ret.push(nd._this);
            }
        }
        return ret;
    }
    getComponentChildsOld(item) {
        if (item === undefined)
            return [];
        if (item === this.value && item._components) {
            var all = [];
            (<Component[]>item._components).forEach((e) => {
                if (!e["designDummyFor"])
                    all.push(e);
            });
            return all;
        }
        var comps = ComponentDescriptor.describe(item.constructor).resolveEditableComponents(item);

        var ret = [];
        for (var name in comps) {
            var comp = comps[name];
            if (comp === undefined)
                continue;
            var complist = comp._components;
            if (name !== "this" && this.getComponentName(comp) !== undefined) {
                if (ret.indexOf(comp) === -1)
                    ret.push(comp);
            }
            if (complist !== undefined) {
                for (var y = 0; y < complist.length; y++) {
                    if (this.getComponentName(complist[y]) !== undefined) {
                        if (ret.indexOf(complist[y]) === -1)
                            ret.push(complist[y]);
                    }
                }
            }
        }
        return ret;
    }
    layout() {
        var _this = this;
        this.tree.width = "100%";
        this.tree.height = "100%";
        this.tree.propChilds = function (item) {
            return _this.getComponentChilds(item);
        }

        this.tree.propDisplay = function (item) {
            return _this.getComponentName(item);
        }
        this.contextMenu.getActions = async function (data: any[]): Promise<Action[]> {
            var ret = [];
            var parent = <Container>data[0]._parent;

            if (parent !== undefined && parent._components !== undefined) {
                var hasDummy = (parent._components[parent._components.length - 1]["designDummyFor"] !== undefined ? 1 : 0);
                if ((parent._components.length > 1 + hasDummy) && parent._components.indexOf(data[0]) !== 0) {
                    var ac: Action = {
                        call: function () {

                            _this.propertyEditor.swapComponents(parent._components[parent._components.indexOf(data[0]) + -1], data[0]);
                            _this.tree.items = _this.tree.items;
                            _this.tree.value = data[0];
                        },
                        name: "move up"
                    };
                    ret.push(ac)
                }
                if (parent._components.length > 1 + hasDummy &&
                    parent._components.indexOf(data[0]) + hasDummy + 1 < parent._components.length) {
                    var ac: Action = {
                        call: function () {
                            _this.propertyEditor.swapComponents(data[0], parent._components[parent._components.indexOf(data[0]) + 1]);
                            _this.tree.items = _this.tree.items;
                            _this.tree.value = data[0];
                        },
                        name: "move down"
                    };
                    ret.push(ac)
                }
            }
            return ret;
        }
        this.tree.contextMenu = this.contextMenu;
        this.add(this.tree);
    }
    update() {
        this.value = this.value;
    }
    onselect(handler) {
        this.tree.onselect(handler);
    }
    onclick(handler) {
        this.tree.addEvent("click", handler);
    }
    destroy() {
        this._value = undefined;
        super.destroy();
    }
}
export async function test() {
    var dlg = new ComponentExplorer(undefined, undefined);
    dlg.getComponentName = function (item) {
        return classes.getClassName(item);
    };
    dlg.value = dlg;
    return dlg;
}


