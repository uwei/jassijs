var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Tree", "jassijs/ui/ComponentDescriptor", "jassijs/ui/ContextMenu", "jassijs_editor/CodeEditor", "jassijs/ui/PropertyEditor"], function (require, exports, jassijs_1, Panel_1, Tree_1, ComponentDescriptor_1, ContextMenu_1, CodeEditor_1, PropertyEditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentExplorer = void 0;
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
            this.tree.items = value;
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
            if (item === this.value)
                return item._components;
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
        onclick(handler) {
            this.tree.addEvent("click", handler);
        }
        destroy() {
            this._value = undefined;
            super.destroy();
        }
    };
    ComponentExplorer = __decorate([
        jassijs_1.$Class("jassijs_editor.ComponentExplorer"),
        __metadata("design:paramtypes", [CodeEditor_1.CodeEditor, PropertyEditor_1.PropertyEditor])
    ], ComponentExplorer);
    exports.ComponentExplorer = ComponentExplorer;
    jassijs_1.default.test = async function () {
        var dlg = new jassijs_1.default.ui.ComponentExplorer();
        dlg.getComponentName = function (item) {
            return "hallo";
        };
        dlg.value = dlg;
        return dlg;
    };
});
//# sourceMappingURL=ComponentExplorer.js.map