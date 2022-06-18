var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Databinder", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/Property"], function (require, exports, Button_1, BoxPanel_1, Registry_1, Panel_1, Databinder_1, Component_1, Registry_2, Classes_1, Property_1) {
    "use strict";
    var DBObjectView_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectView = exports.$DBObjectView = exports.DBObjectViewProperties = void 0;
    class DBObjectViewProperties {
    }
    exports.DBObjectViewProperties = DBObjectViewProperties;
    function $DBObjectView(properties) {
        return function (pclass) {
            Registry_2.default.register("$DBObjectView", pclass, properties);
        };
    }
    exports.$DBObjectView = $DBObjectView;
    let DBObjectView = DBObjectView_1 = class DBObjectView extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.dom.classList.add("designerNoResizable"); //this should not be resized only me.main
            //everytime call super.layout
            DBObjectView_1.prototype.layout.bind(this)(this.me);
            // this.layout(this.me);
        }
        config(config) {
            super.config(config);
            return this;
        }
        _setDesignMode(enable) {
            //no Icons to add Components in designer
        }
        /**
         * create a new object
         */
        createObject() {
            var clname = Registry_2.default.getData("$DBObjectView", Classes_1.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_1.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("created", this["value"]);
            return this["value"];
        }
        oncreated(handler) {
            this.addEvent("deleted", handler);
        }
        /**
         * saves the object
         */
        saveObject() {
            var ob = this.me.databinder.fromForm();
            ob.save().then((obj) => {
                this["value"] = obj;
                this.callEvent("saved", obj);
            });
        }
        onsaved(handler) {
            this.addEvent("saved", handler);
        }
        /**
         * refresh the object
         */
        refreshObject() {
            this.me.databinder.toForm(this["value"]);
            this.callEvent("refreshed", this["value"]);
        }
        onrefreshed(handler) {
            this.addEvent("refreshed", handler);
        }
        /**
         * deletes Object
         **/
        deleteObject() {
            var ob = this.me.databinder.fromForm();
            ob.remove();
            //set obj to null
            var clname = Registry_2.default.getData("$DBObjectView", Classes_1.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_1.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("deleted", ob);
        }
        ondeleted(handler) {
            this.addEvent("deleted", handler);
        }
        layout(me) {
            var _this = this;
            me.toolbar = new BoxPanel_1.BoxPanel();
            me.save = new Button_1.Button();
            me.remove = new Button_1.Button();
            me.refresh = new Button_1.Button();
            me.create = new Button_1.Button();
            me.databinder = new Databinder_1.Databinder();
            me.main = new Panel_1.Panel();
            me.databinder.definePropertyFor(this, "value");
            this.add(me.toolbar);
            this.add(me.main);
            me.main.width = "100%";
            me.main.height = "100%";
            me.main.css = { position: "relative" };
            me.toolbar.add(me.create);
            me.toolbar.add(me.save);
            me.toolbar.horizontal = true;
            me.toolbar.add(me.refresh);
            me.toolbar.add(me.remove);
            me.save.text = "";
            me.save.tooltip = "save";
            me.save.icon = "mdi mdi-content-save";
            me.save.onclick(function (event) {
                _this.saveObject();
            });
            me.remove.text = "";
            me.remove.icon = "mdi mdi-delete";
            me.remove.onclick(function (event) {
                _this.deleteObject();
            });
            me.remove.tooltip = "remove";
            me.refresh.text = "";
            me.refresh.icon = "mdi mdi-refresh";
            me.refresh.onclick(function (event) {
                _this.refreshObject();
            });
            me.refresh.tooltip = "refresh";
            me.create.text = "";
            me.create.icon = "mdi mdi-tooltip-plus-outline";
            me.create.onclick(function (event) {
                _this.createObject();
                //me.binder.toForm();
            });
            me.create.tooltip = "new";
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "oncreated", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onsaved", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onrefreshed", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "ondeleted", null);
    DBObjectView = DBObjectView_1 = __decorate([
        (0, Component_1.$UIComponent)({ editableChildComponents: ["this", "me.main", "me.toolbar", "me.save", "me.remove", "me.refresh"] }),
        (0, Registry_1.$Class)("jassijs/ui/DBObjectView"),
        __metadata("design:paramtypes", [])
    ], DBObjectView);
    exports.DBObjectView = DBObjectView;
    async function test() {
        var ret = new DBObjectView();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=DBObjectView.js.map