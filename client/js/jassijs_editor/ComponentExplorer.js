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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50RXhwbG9yZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX2VkaXRvci9Db21wb25lbnRFeHBsb3Jlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQWNBLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWtCLFNBQVEsYUFBSztRQU14Qzs7VUFFRTtRQUNGLFlBQVksVUFBVSxFQUFDLGNBQTZCO1lBQ2hELEtBQUssRUFBRSxDQUFDO1lBQ1Isa0VBQWtFO1lBQ2xFLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBQyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsY0FBYyxHQUFDLGNBQWMsQ0FBQztRQUN2QyxDQUFDO1FBQ0Q7O1dBRUc7UUFDSCxJQUFJLEtBQUssQ0FBQyxLQUFLO1lBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELElBQUksS0FBSztZQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO1FBQ0Q7Ozs7V0FJRztRQUNILGdCQUFnQixDQUFDLElBQUk7WUFDakIsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxrQkFBa0IsQ0FBQyxJQUFJ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Q0FBQztRQUNoQixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFQRCxvQkFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHtQYW5lbH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbmltcG9ydCB7VHJlZX0gZnJvbSBcImphc3NpanMvdWkvVHJlZVwiO1xuaW1wb3J0IHtDb21wb25lbnREZXNjcmlwdG9yfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnREZXNjcmlwdG9yXCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbnRleHRNZW51XCI7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvbnMgfSBmcm9tIFwiamFzc2lqcy9iYXNlL0FjdGlvbnNcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbnRhaW5lclwiO1xuLy9pbXBvcnQgeyBDb2RlRWRpdG9yIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvZGVFZGl0b3JcIjtcbmltcG9ydCB7IENvbXBvbmVudERlc2lnbmVyIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvbXBvbmVudERlc2lnbmVyXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eUVkaXRvciB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9yXCI7XG5pbXBvcnQgeyBwcm9wZXJ0eWVkaXRvciB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvUHJvcGVydHlFZGl0b3JTZXJ2aWNlXCI7XG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcblxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvbXBvbmVudEV4cGxvcmVyXCIpXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50RXhwbG9yZXIgZXh0ZW5kcyBQYW5lbCB7XG4gICAgY29kZUVkaXRvcjsvLzpDb2RlRWRpdG9yO1xuICAgIHByb3BlcnR5RWRpdG9yOlByb3BlcnR5RWRpdG9yO1xuICAgIHRyZWU6VHJlZTtcbiAgICAvL2NvbnRleHRNZW51OkNvbnRleHRNZW51O1xuICAgIF92YWx1ZTtcbiAgICAvKipcbiAgICAqIGVkaXQgb2JqZWN0IHByb3BlcnRpZXNcbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvZGVFZGl0b3IscHJvcGVydHlFZGl0b3I6UHJvcGVydHlFZGl0b3IpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgLyoqIEBtZW1iZXIge2phc3NpanNfZWRpdG9yLkNvZGVFZGl0b3J9IC0gdGhlIHBhcmVudCBDb2RlRWRpdG9yICovXG4gICAgICAgIHRoaXMuY29kZUVkaXRvciA9IGNvZGVFZGl0b3I7XG4gICAgICAgIHRoaXMudHJlZSA9IG5ldyBUcmVlKCk7XG4gICAgICAgIHRoaXMudHJlZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudT1uZXcgQ29udGV4dE1lbnUoKTtcbiAgICAgICAgdGhpcy5hZGQodGhpcy5jb250ZXh0TWVudSk7XG4gICAgICAgIHRoaXMubGF5b3V0KCk7XG4gICAgICAgIHRoaXMucHJvcGVydHlFZGl0b3I9cHJvcGVydHlFZGl0b3I7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge2phc3NpanMudWkuQ29tcG9uZW50fSAgLSB0aGUgcmVuZGVyZWQgb2JqZWN0IFxuICAgICAqL1xuICAgIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnRyZWUuaXRlbXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50cmVlLmV4cGFuZEFsbCgpO1xuICAgIH1cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBkaXNwbGF5bmFtZSBvZiB0aGUgaXRlbVxuICAgICAqIG11c3QgYmUgb3ZlcnJpZGVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbVxuICAgICAqL1xuICAgIGdldENvbXBvbmVudE5hbWUoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBjaGlsZCBjb21wb25lbnRzXG4gICAgICogbXVzdCBiZSBvdmVycmlkZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtXG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50Q2hpbGRzKGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0gPT09IHRoaXMudmFsdWUpXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5fY29tcG9uZW50c1xuICAgICAgICB2YXIgY29tcHMgPSBDb21wb25lbnREZXNjcmlwdG9yLmRlc2NyaWJlKGl0ZW0uY29uc3RydWN0b3IpLnJlc29sdmVFZGl0YWJsZUNvbXBvbmVudHMoaXRlbSk7XG5cbiAgICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIGNvbXBzKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IGNvbXBzW25hbWVdO1xuICAgICAgICAgICAgaWYoY29tcD09PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIHZhciBjb21wbGlzdCA9IGNvbXAuX2NvbXBvbmVudHM7XG4gICAgICAgICAgICBpZiAobmFtZSAhPT0gXCJ0aGlzXCIgJiYgdGhpcy5nZXRDb21wb25lbnROYW1lKGNvbXApICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmV0LmluZGV4T2YoY29tcCkgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICByZXQucHVzaChjb21wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb21wbGlzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBjb21wbGlzdC5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRDb21wb25lbnROYW1lKGNvbXBsaXN0W3ldKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0LmluZGV4T2YoY29tcGxpc3RbeV0pID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQucHVzaChjb21wbGlzdFt5XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgbGF5b3V0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnRyZWUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgdGhpcy50cmVlLmhlaWdodCA9IFwiMTAwJVwiO1xuICAgICAgICB0aGlzLnRyZWUucHJvcENoaWxkcyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuZ2V0Q29tcG9uZW50Q2hpbGRzKGl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmVlLnByb3BEaXNwbGF5ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRDb21wb25lbnROYW1lKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuZ2V0QWN0aW9ucz1hc3luYyBmdW5jdGlvbihkYXRhOmFueVtdKTpQcm9taXNlPEFjdGlvbltdPntcbiAgICAgICAgXHR2YXIgcmV0PVtdO1xuICAgICAgICBcdHZhciBwYXJlbnQ9PENvbnRhaW5lcj4gZGF0YVswXS5fcGFyZW50O1xuICAgICAgICBcdFxuICAgICAgICBcdGlmKHBhcmVudCE9PXVuZGVmaW5lZCYmcGFyZW50Ll9jb21wb25lbnRzIT09dW5kZWZpbmVkKXtcbiAgICAgICAgXHRcdHZhciBoYXNEdW1teT0ocGFyZW50Ll9jb21wb25lbnRzW3BhcmVudC5fY29tcG9uZW50cy5sZW5ndGgtMV1bXCJkZXNpZ25EdW1teUZvclwiXSE9PXVuZGVmaW5lZD8xOjApO1xuICAgICAgICBcdFx0aWYoKHBhcmVudC5fY29tcG9uZW50cy5sZW5ndGg+MStoYXNEdW1teSkmJnBhcmVudC5fY29tcG9uZW50cy5pbmRleE9mKGRhdGFbMF0pIT09MCl7XG5cdCAgICAgICAgXHRcdHZhciBhYzpBY3Rpb249e1xuXHQgICAgICAgIFx0XHRcdGNhbGw6ZnVuY3Rpb24oKXtcblx0ICAgICAgICBcdFx0XHRcdFxuXHQgICAgICAgIFx0XHRcdFx0X3RoaXMucHJvcGVydHlFZGl0b3Iuc3dhcENvbXBvbmVudHMocGFyZW50Ll9jb21wb25lbnRzW3BhcmVudC5fY29tcG9uZW50cy5pbmRleE9mKGRhdGFbMF0pKy0xXSxkYXRhWzBdKTtcblx0ICAgICAgICBcdFx0XHRcdF90aGlzLnRyZWUuaXRlbXM9X3RoaXMudHJlZS5pdGVtcztcblx0ICAgICAgICBcdFx0XHRcdF90aGlzLnRyZWUudmFsdWU9ZGF0YVswXTtcblx0ICAgICAgICBcdFx0XHR9LFxuXHQgICAgICAgIFx0XHRcdG5hbWU6XCJtb3ZlIHVwXCJcblx0ICAgICAgICBcdFx0fTtcblx0ICAgICAgICBcdFx0cmV0LnB1c2goYWMpXG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgXHRcdGlmKHBhcmVudC5fY29tcG9uZW50cy5sZW5ndGg+MStoYXNEdW1teSYmXG5cdCAgICAgICAgXHQgICAgICBwYXJlbnQuX2NvbXBvbmVudHMuaW5kZXhPZihkYXRhWzBdKStoYXNEdW1teSsxPHBhcmVudC5fY29tcG9uZW50cy5sZW5ndGgpe1xuXHQgICAgICAgIFx0XHRcdHZhciBhYzpBY3Rpb249e1xuXHQgICAgICAgIFx0XHRcdGNhbGw6ZnVuY3Rpb24oKXtcblx0ICAgICAgICBcdFx0XHRcdF90aGlzLnByb3BlcnR5RWRpdG9yLnN3YXBDb21wb25lbnRzKGRhdGFbMF0scGFyZW50Ll9jb21wb25lbnRzW3BhcmVudC5fY29tcG9uZW50cy5pbmRleE9mKGRhdGFbMF0pKzFdKTtcblx0ICAgICAgICBcdFx0XHRcdF90aGlzLnRyZWUuaXRlbXM9X3RoaXMudHJlZS5pdGVtcztcblx0ICAgICAgICBcdFx0XHRcdF90aGlzLnRyZWUudmFsdWU9ZGF0YVswXTtcblx0ICAgICAgICBcdFx0XHR9LFxuXHQgICAgICAgIFx0XHRcdG5hbWU6XCJtb3ZlIGRvd25cIlxuXHQgICAgICAgIFx0XHR9O1xuXHQgICAgICAgIFx0XHRyZXQucHVzaChhYylcblx0ICAgICAgICBcdH1cbiAgICAgICAgXHR9XG4gICAgICAgIFx0cmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyZWUuY29udGV4dE1lbnU9dGhpcy5jb250ZXh0TWVudTtcbiAgICAgICAgdGhpcy5hZGQodGhpcy50cmVlKTtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG4gICAgb25zZWxlY3QoaGFuZGxlcikge1xuICAgICAgICB0aGlzLnRyZWUub25zZWxlY3QoaGFuZGxlcik7XG4gICAgfVxuICAgIG9uY2xpY2soaGFuZGxlcikge1xuICAgICAgICB0aGlzLnRyZWUuYWRkRXZlbnQoXCJjbGlja1wiLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgZGVzdHJveSgpe1xuICAgIFx0dGhpcy5fdmFsdWU9dW5kZWZpbmVkO1xuICAgIFx0c3VwZXIuZGVzdHJveSgpO1xuICAgIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciBkbGcgPSBuZXcgQ29tcG9uZW50RXhwbG9yZXIodW5kZWZpbmVkLHVuZGVmaW5lZCk7XG4gICAgZGxnLmdldENvbXBvbmVudE5hbWUgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gY2xhc3Nlcy5nZXRDbGFzc05hbWUoaXRlbSk7XG4gICAgfTtcbiAgICBkbGcudmFsdWUgPSBkbGc7XG4gICAgcmV0dXJuIGRsZztcbn1cblxuXG4iXX0=