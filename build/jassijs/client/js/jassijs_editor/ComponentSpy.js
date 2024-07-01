var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Table", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Classes", "jassijs/base/Actions", "jassijs/base/Router", "jassijs_editor/ErrorPanel", "jassijs/ui/Component"], function (require, exports, Registry_1, Panel_1, Table_1, Button_1, BoxPanel_1, Classes_1, Actions_1, Router_1, ErrorPanel_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentSpy = void 0;
    class Me {
    }
    let ComponentSpy = class ComponentSpy extends Panel_1.Panel {
        constructor() {
            super();
            this.hook = undefined;
            var _this = this;
            this.hook = Component_1.Component.onComponentCreated((name, comp) => {
                if (name === "create") {
                    _this.watch(comp);
                }
                if (name === "precreate" || name === "destroy") {
                    _this.unwatch(comp);
                }
            });
            this.ids = {};
            this.labelids = {};
            this.layout();
        }
        static async dummy() {
        }
        static async showDialog() {
            Router_1.router.navigate("#do=jassijs.ui.ComponentSpy");
        }
        layout() {
            var me = this.me = {};
            me.IDText = new ErrorPanel_1.ErrorPanel(); //HTMLPanel();
            this.style = { overflow: "scroll" };
            var _this = this;
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.IDUpdate = new Button_1.Button();
            me.IDClear = new Button_1.Button();
            me.IDTable = new Table_1.Table();
            this.add(me.boxpanel1);
            this.add(me.IDTable);
            this.add(me.IDText);
            me.boxpanel1.add(me.IDUpdate);
            me.boxpanel1.add(me.IDClear);
            me.boxpanel1.horizontal = false;
            me.IDClear.text = "clear";
            me.IDUpdate.text = "update";
            me.IDUpdate.onclick(function (event) {
                _this.update();
            });
            me.IDClear.onclick(function (event) {
                _this.clear();
            });
            me.IDText.height = 100;
            me.IDUpdate.text = "Update";
            me.IDTable.width = "100%";
            me.IDTable.height = "400";
            me.IDTable.onchange(function (ob) {
                me.IDText.addError({ error: ob.data }); //.stack.replaceAll("\n", "<br>");
            });
        }
        update() {
            var data = [];
            for (var k in jassijs.componentSpy.ids) {
                data.push(jassijs.componentSpy.ids[k]);
            }
            this.me.IDTable.items = data;
        }
        clear() {
            jassijs.componentSpy.ids = {};
            jassijs.componentSpy.labelids = {};
            this.update();
        }
        watch(component) {
            var ob = {
                type: Classes_1.classes.getClassName(component),
                id: component._id,
                labelid: component.domWrapper === undefined ? 0 : component.domWrapper._id,
                stack: new Error().stack
            };
            this.ids[ob.id] = ob;
            this.labelids[ob.labelid] = ob;
        }
        stack(id) {
            var test = this.ids[id];
            if (test === undefined)
                test = this.labelids[id];
            if (test !== undefined)
                return test.stack;
            else
                return "empty";
        }
        unwatch(component) {
            var ob = this.ids[component._id];
            if (ob !== undefined) {
                delete this.ids[ob.id];
                delete this.labelids[ob.labelid];
            }
        }
        list() {
            var test = ["jj", "kkk"];
            return test;
        }
        destroy() {
            super.destroy();
            Component_1.Component.offComponentCreated(this.hook);
            this.hook = undefined;
        }
    };
    __decorate([
        (0, Actions_1.$Action)({
            name: "Administration",
            icon: "mdi mdi-account-cog-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ComponentSpy, "dummy", null);
    __decorate([
        (0, Actions_1.$Action)({
            name: "Administration/Spy Components",
            icon: "mdi mdi-police-badge",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ComponentSpy, "showDialog", null);
    ComponentSpy = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("jassijs_editor.ui.ComponentSpy"),
        __metadata("design:paramtypes", [])
    ], ComponentSpy);
    exports.ComponentSpy = ComponentSpy;
    function test() {
        var sp = new ComponentSpy();
        sp.update();
        sp.height = 100;
        return sp;
    }
    exports.test = test;
    jassijs.componentSpy = new ComponentSpy();
});
//# sourceMappingURL=ComponentSpy.js.map