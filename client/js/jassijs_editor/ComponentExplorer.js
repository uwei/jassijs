var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Tree", "jassijs/ui/ComponentDescriptor", "jassijs/ui/ContextMenu", "jassijs/ui/PropertyEditor", "jassijs/remote/Classes"], function (require, exports, Registry_1, Panel_1, Tree_1, ComponentDescriptor_1, ContextMenu_1, PropertyEditor_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentExplorer = void 0;
    let ComponentExplorer = class ComponentExplorer extends Panel_1.Panel {
        /**
        * edit object properties
        */
        constructor(codeEditor, propertyEditor) {
            super();
            /** @member {jassijs_editor.CodeEditor} - the parent CodeEditor */
            this.codeEditor = codeEditor;
            this.tree = new Tree_1.Tree();
            this.tree.height = "100%";
            this.contextMenu = new ContextMenu_1.ContextMenu();
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
            var _a, _b, _c, _d;
            if (this.codeEditor === undefined)
                return this.getComponentChildsOld(item);
            if (item === undefined)
                return [];
            var ret = [];
            if ((_a = item.dom) === null || _a === void 0 ? void 0 : _a._thisOther) {
                // <Comp1><Comp2><div> rsults in Tree Comp1-Comp2-div
                //
                var pos = (_b = item.dom) === null || _b === void 0 ? void 0 : _b._thisOther.indexOf(item);
                if (pos == -1)
                    pos = 0;
                else
                    pos++;
                if (pos < ((_c = item.dom) === null || _c === void 0 ? void 0 : _c._thisOther.length)) {
                    var varname = this.codeEditor.getVariableFromObject(item.dom._thisOther[pos]);
                    if (varname) {
                        ret.push(item.dom._thisOther[pos]);
                        return ret;
                    }
                }
            }
            if ((_d = item.dom) === null || _d === void 0 ? void 0 : _d.childNodes) {
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
                item._components.forEach((e) => {
                    if (!e["designDummyFor"])
                        all.push(e);
                });
                return all;
            }
            var comps = ComponentDescriptor_1.ComponentDescriptor.describe(item.constructor).resolveEditableComponents(item);
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
            };
            this.tree.propDisplay = function (item) {
                return _this.getComponentName(item);
            };
            this.contextMenu.getActions = async function (data) {
                var ret = [];
                var parent = data[0]._parent;
                if (parent !== undefined && parent._components !== undefined) {
                    var hasDummy = (parent._components[parent._components.length - 1]["designDummyFor"] !== undefined ? 1 : 0);
                    if ((parent._components.length > 1 + hasDummy) && parent._components.indexOf(data[0]) !== 0) {
                        var ac = {
                            call: function () {
                                _this.propertyEditor.swapComponents(parent._components[parent._components.indexOf(data[0]) + -1], data[0]);
                                _this.tree.items = _this.tree.items;
                                _this.tree.value = data[0];
                            },
                            name: "move up"
                        };
                        ret.push(ac);
                    }
                    if (parent._components.length > 1 + hasDummy &&
                        parent._components.indexOf(data[0]) + hasDummy + 1 < parent._components.length) {
                        var ac = {
                            call: function () {
                                _this.propertyEditor.swapComponents(data[0], parent._components[parent._components.indexOf(data[0]) + 1]);
                                _this.tree.items = _this.tree.items;
                                _this.tree.value = data[0];
                            },
                            name: "move down"
                        };
                        ret.push(ac);
                    }
                }
                return ret;
            };
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
    };
    ComponentExplorer = __decorate([
        (0, Registry_1.$Class)("jassijs_editor.ComponentExplorer"),
        __metadata("design:paramtypes", [Object, PropertyEditor_1.PropertyEditor])
    ], ComponentExplorer);
    exports.ComponentExplorer = ComponentExplorer;
    async function test() {
        var dlg = new ComponentExplorer(undefined, undefined);
        dlg.getComponentName = function (item) {
            return Classes_1.classes.getClassName(item);
        };
        dlg.value = dlg;
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=ComponentExplorer.js.map