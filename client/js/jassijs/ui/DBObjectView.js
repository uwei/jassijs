var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/ui/Notify"], function (require, exports, Button_1, BoxPanel_1, Registry_1, Panel_1, Component_1, Registry_2, Classes_1, Property_1, Notify_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObjectViewToolbar = exports.test = exports.DBObjectView = exports.$DBObjectView = exports.$DBObjectViewProperties = void 0;
    Registry_2 = __importDefault(Registry_2);
    class $DBObjectViewProperties {
    }
    exports.$DBObjectViewProperties = $DBObjectViewProperties;
    function $DBObjectView(properties) {
        return function (pclass) {
            Registry_2.default.register("$DBObjectView", pclass, properties);
            var p = { name: "value", componentType: properties.classname, type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" };
            Registry_2.default.registerMember("$Property", pclass, undefined, p);
        };
    }
    exports.$DBObjectView = $DBObjectView;
    //@$UIComponent({ editableChildComponents: ["this", "me.main", "me.toolbar", "me.save", "me.remove", "me.refresh", "me.databinder"] })
    let DBObjectView = class DBObjectView extends Panel_1.Panel {
        constructor(props = {}) {
            super(props);
            this.dom.classList.add("designerNoResizable"); //this should not be resized only me.main
            //everytime call super.layout
            //DBObjectView.prototype.layout.bind(this)(this.me);
            // this.layout(this.me);
        }
        config(config) {
            super.config(config);
            return this;
        }
        _setDesignMode(enable) {
            //no Icons to add Components in designer
        }
        set value(value) {
            this.states.value.current = value;
        }
        get value() {
            return this.states.value.current;
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
            this.addEvent("created", handler);
        }
        async doSave(ob) {
            var obj = await ob.save();
            this["value"] = typeof obj === "object" ? obj : ob;
            this.callEvent("saved", ob);
        }
        /**
         * saves the object
         */
        async saveObject() {
            var ob = await this.states.value.bind.$fromForm();
            if (ob !== undefined) {
                await this.doSave(ob);
                (0, Notify_1.notify)("saved", "info");
            }
        }
        onsaved(handler) {
            this.addEvent("saved", handler);
        }
        /**
         * refresh the object
         */
        refreshObject() {
            this.states.value.bind.$toForm(); //this["value"]);
            this.callEvent("refreshed", this["value"]);
        }
        onrefreshed(handler) {
            this.addEvent("refreshed", handler);
        }
        /**
         * deletes Object
         **/
        deleteObject() {
            var ob = this.states.value.bind.$fromForm();
            if (ob === undefined)
                return;
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
    DBObjectView = __decorate([
        (0, Registry_1.$Class)("jassijs/ui/DBObjectView")
        //see export function $DBObjectView =>@$Property({name:"value", type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
        ,
        __metadata("design:paramtypes", [Object])
    ], DBObjectView);
    exports.DBObjectView = DBObjectView;
    async function test() {
        var ret = new DBObjectView();
        return ret;
    }
    exports.test = test;
    //@ts-ignore
    class DBObjectViewToolbar extends Panel_1.Panel {
        constructor(props) {
            super(props);
        }
        render() {
            return (0, Component_1.jc)(BoxPanel_1.BoxPanel, {
                horizontal: true,
                children: [
                    (0, Component_1.jc)(Button_1.Button, {
                        text: "",
                        tooltip: "save",
                        icon: "mdi mdi-content-save",
                        onclick: (event) => {
                            this.props.view.saveObject();
                        }
                    }),
                    (0, Component_1.jc)(Button_1.Button, {
                        text: "",
                        tooltip: "remove",
                        icon: "mdi mdi-delete",
                        onclick: (event) => {
                            this.props.view.deleteObject();
                        }
                    }),
                    (0, Component_1.jc)(Button_1.Button, {
                        text: "",
                        tooltip: "refresh",
                        icon: "mdi mdi-refresh",
                        onclick: (event) => {
                            this.props.view.refreshObject();
                        }
                    }),
                    (0, Component_1.jc)(Button_1.Button, {
                        text: "",
                        tooltip: "new",
                        icon: "mdi mdi-tooltip-plus-outline",
                        onclick: (event) => {
                            this.props.view.createObject();
                        }
                    })
                ]
            });
        }
    }
    exports.DBObjectViewToolbar = DBObjectViewToolbar;
});
//# sourceMappingURL=DBObjectView.js.map