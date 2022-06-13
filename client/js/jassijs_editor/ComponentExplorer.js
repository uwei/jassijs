var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Tree", "jassijs/ui/ComponentDescriptor", "jassijs/ui/ContextMenu", "jassijs/ui/PropertyEditor", "jassijs/remote/Classes"], function (require, exports, Jassi_1, Panel_1, Tree_1, ComponentDescriptor_1, ContextMenu_1, PropertyEditor_1, Classes_1) {
    "use strict";
    var _a;
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
            if (item === undefined)
                return 0;
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
        (0, Jassi_1.$Class)("jassijs_editor.ComponentExplorer"),
        __metadata("design:paramtypes", [Object, typeof (_a = typeof PropertyEditor_1.PropertyEditor !== "undefined" && PropertyEditor_1.PropertyEditor) === "function" ? _a : Object])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50RXhwbG9yZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX2VkaXRvci9Db21wb25lbnRFeHBsb3Jlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQWNBLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWtCLFNBQVEsYUFBSztRQU14Qzs7VUFFRTtRQUNGLFlBQVksVUFBVSxFQUFDLGNBQTZCO1lBQ2hELEtBQUssRUFBRSxDQUFDO1lBQ1Isa0VBQWtFO1lBQ2xFLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBQyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsY0FBYyxHQUFDLGNBQWMsQ0FBQztRQUN2QyxDQUFDO1FBQ0Q7O1dBRUc7UUFDSCxJQUFJLEtBQUssQ0FBQyxLQUFLO1lBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUUsQ0FBQyxLQUFLLEtBQUcsU0FBUyxDQUFBLENBQUMsQ0FBQSxFQUFFLENBQUEsQ0FBQyxDQUFBLEtBQUssQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELElBQUksS0FBSztZQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO1FBQ0Q7Ozs7V0FJRztRQUNILGdCQUFnQixDQUFDLElBQUk7WUFDakIs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QUFHLFVBQVUsSUFBSTtZQUNqQyxPQUFPLGlCQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQztRQUNGLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQVBELG9CQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQge1BhbmVsfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHtUcmVlfSBmcm9tIFwiamFzc2lqcy91aS9UcmVlXCI7XG5pbXBvcnQge0NvbXBvbmVudERlc2NyaXB0b3J9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudERlc2NyaXB0b3JcIjtcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSBcImphc3NpanMvdWkvQ29udGV4dE1lbnVcIjtcbmltcG9ydCB7IEFjdGlvbiwgQWN0aW9ucyB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvQWN0aW9uc1wiO1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcImphc3NpanMvdWkvQ29udGFpbmVyXCI7XG4vL2ltcG9ydCB7IENvZGVFZGl0b3IgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29kZUVkaXRvclwiO1xuaW1wb3J0IHsgQ29tcG9uZW50RGVzaWduZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50RGVzaWduZXJcIjtcbmltcG9ydCB7IFByb3BlcnR5RWRpdG9yIH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JcIjtcbmltcG9ydCB7IHByb3BlcnR5ZWRpdG9yIH0gZnJvbSBcImphc3NpanMvYmFzZS9Qcm9wZXJ0eUVkaXRvclNlcnZpY2VcIjtcbmltcG9ydCB7IGNsYXNzZXMgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvQ2xhc3Nlc1wiO1xuXG5AJENsYXNzKFwiamFzc2lqc19lZGl0b3IuQ29tcG9uZW50RXhwbG9yZXJcIilcbmV4cG9ydCBjbGFzcyBDb21wb25lbnRFeHBsb3JlciBleHRlbmRzIFBhbmVsIHtcbiAgICBjb2RlRWRpdG9yOy8vOkNvZGVFZGl0b3I7XG4gICAgcHJvcGVydHlFZGl0b3I6UHJvcGVydHlFZGl0b3I7XG4gICAgdHJlZTpUcmVlO1xuICAgIC8vY29udGV4dE1lbnU6Q29udGV4dE1lbnU7XG4gICAgX3ZhbHVlO1xuICAgIC8qKlxuICAgICogZWRpdCBvYmplY3QgcHJvcGVydGllc1xuICAgICovXG4gICAgY29uc3RydWN0b3IoY29kZUVkaXRvcixwcm9wZXJ0eUVkaXRvcjpQcm9wZXJ0eUVkaXRvcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvKiogQG1lbWJlciB7amFzc2lqc19lZGl0b3IuQ29kZUVkaXRvcn0gLSB0aGUgcGFyZW50IENvZGVFZGl0b3IgKi9cbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yID0gY29kZUVkaXRvcjtcbiAgICAgICAgdGhpcy50cmVlID0gbmV3IFRyZWUoKTtcbiAgICAgICAgdGhpcy50cmVlLmhlaWdodCA9IFwiMTAwJVwiO1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51PW5ldyBDb250ZXh0TWVudSgpO1xuICAgICAgICB0aGlzLmFkZCh0aGlzLmNvbnRleHRNZW51KTtcbiAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvcj1wcm9wZXJ0eUVkaXRvcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7amFzc2lqcy51aS5Db21wb25lbnR9ICAtIHRoZSByZW5kZXJlZCBvYmplY3QgXG4gICAgICovXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMudHJlZS5pdGVtcyA9KHZhbHVlPT09dW5kZWZpbmVkP1tdOnZhbHVlKTtcbiAgICAgICAgdGhpcy50cmVlLmV4cGFuZEFsbCgpO1xuICAgIH1cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBkaXNwbGF5bmFtZSBvZiB0aGUgaXRlbVxuICAgICAqIG11c3QgYmUgb3ZlcnJpZGVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbVxuICAgICAqL1xuICAgIGdldENvbXBvbmVudE5hbWUoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBjaGlsZCBjb21wb25lbnRzXG4gICAgICogbXVzdCBiZSBvdmVycmlkZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtXG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50Q2hpbGRzKGl0ZW0pIHtcblx0XHRpZihpdGVtPT09dW5kZWZpbmVkKVxuXHRcdFx0cmV0dXJuIDA7XG4gICAgICAgIGlmIChpdGVtID09PSB0aGlzLnZhbHVlKVxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uX2NvbXBvbmVudHNcbiAgICAgICAgdmFyIGNvbXBzID0gQ29tcG9uZW50RGVzY3JpcHRvci5kZXNjcmliZShpdGVtLmNvbnN0cnVjdG9yKS5yZXNvbHZlRWRpdGFibGVDb21wb25lbnRzKGl0ZW0pO1xuXG4gICAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBjb21wcykge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSBjb21wc1tuYW1lXTtcbiAgICAgICAgICAgIGlmKGNvbXA9PT11bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB2YXIgY29tcGxpc3QgPSBjb21wLl9jb21wb25lbnRzO1xuICAgICAgICAgICAgaWYgKG5hbWUgIT09IFwidGhpc1wiICYmIHRoaXMuZ2V0Q29tcG9uZW50TmFtZShjb21wKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJldC5pbmRleE9mKGNvbXApID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goY29tcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29tcGxpc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgY29tcGxpc3QubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q29tcG9uZW50TmFtZShjb21wbGlzdFt5XSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldC5pbmRleE9mKGNvbXBsaXN0W3ldKSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goY29tcGxpc3RbeV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIGxheW91dCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy50cmVlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgIHRoaXMudHJlZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgdGhpcy50cmVlLnByb3BDaGlsZHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldENvbXBvbmVudENoaWxkcyhpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJlZS5wcm9wRGlzcGxheSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0Q29tcG9uZW50TmFtZShpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRleHRNZW51LmdldEFjdGlvbnM9YXN5bmMgZnVuY3Rpb24oZGF0YTphbnlbXSk6UHJvbWlzZTxBY3Rpb25bXT57XG4gICAgICAgIFx0dmFyIHJldD1bXTtcbiAgICAgICAgXHR2YXIgcGFyZW50PTxDb250YWluZXI+IGRhdGFbMF0uX3BhcmVudDtcbiAgICAgICAgXHRcbiAgICAgICAgXHRpZihwYXJlbnQhPT11bmRlZmluZWQmJnBhcmVudC5fY29tcG9uZW50cyE9PXVuZGVmaW5lZCl7XG4gICAgICAgIFx0XHR2YXIgaGFzRHVtbXk9KHBhcmVudC5fY29tcG9uZW50c1twYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoLTFdW1wiZGVzaWduRHVtbXlGb3JcIl0hPT11bmRlZmluZWQ/MTowKTtcbiAgICAgICAgXHRcdGlmKChwYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoPjEraGFzRHVtbXkpJiZwYXJlbnQuX2NvbXBvbmVudHMuaW5kZXhPZihkYXRhWzBdKSE9PTApe1xuXHQgICAgICAgIFx0XHR2YXIgYWM6QWN0aW9uPXtcblx0ICAgICAgICBcdFx0XHRjYWxsOmZ1bmN0aW9uKCl7XG5cdCAgICAgICAgXHRcdFx0XHRcblx0ICAgICAgICBcdFx0XHRcdF90aGlzLnByb3BlcnR5RWRpdG9yLnN3YXBDb21wb25lbnRzKHBhcmVudC5fY29tcG9uZW50c1twYXJlbnQuX2NvbXBvbmVudHMuaW5kZXhPZihkYXRhWzBdKSstMV0sZGF0YVswXSk7XG5cdCAgICAgICAgXHRcdFx0XHRfdGhpcy50cmVlLml0ZW1zPV90aGlzLnRyZWUuaXRlbXM7XG5cdCAgICAgICAgXHRcdFx0XHRfdGhpcy50cmVlLnZhbHVlPWRhdGFbMF07XG5cdCAgICAgICAgXHRcdFx0fSxcblx0ICAgICAgICBcdFx0XHRuYW1lOlwibW92ZSB1cFwiXG5cdCAgICAgICAgXHRcdH07XG5cdCAgICAgICAgXHRcdHJldC5wdXNoKGFjKVxuXHQgICAgICAgIFx0fVxuXHQgICAgICAgIFx0XHRpZihwYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoPjEraGFzRHVtbXkmJlxuXHQgICAgICAgIFx0ICAgICAgcGFyZW50Ll9jb21wb25lbnRzLmluZGV4T2YoZGF0YVswXSkraGFzRHVtbXkrMTxwYXJlbnQuX2NvbXBvbmVudHMubGVuZ3RoKXtcblx0ICAgICAgICBcdFx0XHR2YXIgYWM6QWN0aW9uPXtcblx0ICAgICAgICBcdFx0XHRjYWxsOmZ1bmN0aW9uKCl7XG5cdCAgICAgICAgXHRcdFx0XHRfdGhpcy5wcm9wZXJ0eUVkaXRvci5zd2FwQ29tcG9uZW50cyhkYXRhWzBdLHBhcmVudC5fY29tcG9uZW50c1twYXJlbnQuX2NvbXBvbmVudHMuaW5kZXhPZihkYXRhWzBdKSsxXSk7XG5cdCAgICAgICAgXHRcdFx0XHRfdGhpcy50cmVlLml0ZW1zPV90aGlzLnRyZWUuaXRlbXM7XG5cdCAgICAgICAgXHRcdFx0XHRfdGhpcy50cmVlLnZhbHVlPWRhdGFbMF07XG5cdCAgICAgICAgXHRcdFx0fSxcblx0ICAgICAgICBcdFx0XHRuYW1lOlwibW92ZSBkb3duXCJcblx0ICAgICAgICBcdFx0fTtcblx0ICAgICAgICBcdFx0cmV0LnB1c2goYWMpXG5cdCAgICAgICAgXHR9XG4gICAgICAgIFx0fVxuICAgICAgICBcdHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmVlLmNvbnRleHRNZW51PXRoaXMuY29udGV4dE1lbnU7XG4gICAgICAgIHRoaXMuYWRkKHRoaXMudHJlZSk7XG4gICAgfVxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuICAgIG9uc2VsZWN0KGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy50cmVlLm9uc2VsZWN0KGhhbmRsZXIpO1xuICAgIH1cbiAgICBvbmNsaWNrKGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy50cmVlLmFkZEV2ZW50KFwiY2xpY2tcIiwgaGFuZGxlcik7XG4gICAgfVxuICAgIGRlc3Ryb3koKXtcbiAgICBcdHRoaXMuX3ZhbHVlPXVuZGVmaW5lZDtcbiAgICBcdHN1cGVyLmRlc3Ryb3koKTtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgZGxnID0gbmV3IENvbXBvbmVudEV4cGxvcmVyKHVuZGVmaW5lZCx1bmRlZmluZWQpO1xuICAgIGRsZy5nZXRDb21wb25lbnROYW1lID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuZ2V0Q2xhc3NOYW1lKGl0ZW0pO1xuICAgIH07XG4gICAgZGxnLnZhbHVlID0gZGxnO1xuICAgIHJldHVybiBkbGc7XG59XG5cblxuIl19