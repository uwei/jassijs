var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/Property", "jassijs/ui/Textbox", "jassijs/ui/State", "jassijs/ui/Button", "jassijs/ui/Panel", "jassijs/ui/Table", "jassijs/ext/jquerylib", "jquery.choosen"], function (require, exports, Registry_1, Component_1, DataComponent_1, Property_1, Textbox_1, State_1, Button_1, Panel_1, Table_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Repeater = void 0;
    ///@$UIComponent({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" })
    let Repeater = class Repeater extends DataComponent_1.DataComponent {
        constructor(properties = undefined) {
            super(properties);
            this._components = [];
            // super.init('<select class="Select"><option value=""></option></select>');
        }
        render() {
            //  super.init('<select class="Select"><option value=""></option></select>');
            return React.createElement("span", {});
        }
        onchange(handler) {
        }
        set value(value) {
            this.state.value.current = value;
        }
        get value() {
            return this.state.value.current;
        }
        set items(value) {
            this.state.items.current = value;
        }
        get items() {
            return this.state.items.current;
        }
        /* get bindItems() {
             return this._bindItems;
         }
     
         @$Property({ type: "databinder" })
         set bindItems(bound: BoundProperty) {
             this._bindItems = bound;
             var _this = this;
             this._bindItems._databinder.add(bound._propertyname, this,(tab) => {
                 return _this.items;
             }, (tab, val) => {
                 _this.items = val;
             });
             //databinderItems.add(property, this, "onchange");
             //databinder.checkAutocommit(this);
         }*/
        duplicateChildren(children, state) {
            var _a, _b, _c, _d, _e;
            var ret = [];
            for (var x = 0; x < children.length; x++) {
                var n = Object.assign({}, children[x]);
                if (n.props) {
                    n.props = {};
                    Object.assign(n.props, children[x].props);
                }
                if ((_a = n.props) === null || _a === void 0 ? void 0 : _a.children) {
                    n.props.children = this.duplicateChildren(n.props.children, state);
                }
                if (((_c = (_b = n.props) === null || _b === void 0 ? void 0 : _b.bind) === null || _c === void 0 ? void 0 : _c._databinder) === ((_d = this.bind) === null || _d === void 0 ? void 0 : _d._databinder) && ((_e = this.bind) === null || _e === void 0 ? void 0 : _e._databinder) !== undefined) {
                    var path = n.props.bind._propertyname.split(".");
                    var pp = state.bind;
                    for (var y = 0; y < path.length; y++) {
                        if (path[y] !== this) {
                            pp = pp[path[y]];
                        }
                    }
                    n.props.bind = pp;
                }
                ret.push(n);
            }
            return ret;
        }
        createRepeatingItem(ob, children) {
            //this._boundProperty._databinder.value=ob;
            var jchilds = [];
            var stat = (0, State_1.createState)();
            stat.current = ob;
            var dup = this.duplicateChildren(children, stat);
            jchilds.push(...dup);
            var comp = (0, Component_1.createComponent)((0, Component_1.jc)(Component_1.HTMLComponent, {
                tag: "span",
                children: jchilds,
                onMouseEnter: () => {
                    var _a;
                    console.log(JSON.stringify(ob));
                    if (((_a = this.bind._databinder.connectedState) === null || _a === void 0 ? void 0 : _a.current) !== ob)
                        this.bind._databinder.connectedState.current = ob;
                }
            }));
            comp.repeatingObject = stat;
            this.add(comp);
        }
        config(config, forceRender = false) {
            var _a, _b, _c, _d, _e;
            Object.assign(this.props, config);
            if (((_a = this.props) === null || _a === void 0 ? void 0 : _a.children) && ((_b = this.props) === null || _b === void 0 ? void 0 : _b.items)) {
                if (((_c = this.props) === null || _c === void 0 ? void 0 : _c.children.length) > 0 && ((_d = this.props) === null || _d === void 0 ? void 0 : _d.bind)) {
                    this.bind = this.props.bind; //setup databinder
                    delete config.bind;
                    if (this._components === undefined)
                        this._components = [];
                    this.removeAll(false);
                    if ((_e = this.props) === null || _e === void 0 ? void 0 : _e.items) {
                        for (var i = 0; i < this.props.items.length; i++) {
                            var ob = this.props.items[i];
                            this.createRepeatingItem(ob, this.props.children);
                        }
                    }
                    delete config.children;
                }
            }
            super.config(config);
            return this;
        }
        add(component) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper._parent = this;
            this._components.push(component);
            this.dom.appendChild(component.domWrapper);
        }
        addBefore(component, before) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper["_parent"] = this;
            var index = this._components.indexOf(before);
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            this._components.splice(index, 0, component);
            this.dom.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
            //before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
        }
        remove(component, destroy = false) {
            if (destroy)
                component.destroy();
            component._parent = undefined;
            if (component.domWrapper !== undefined)
                component.domWrapper._parent = undefined;
            if (this._components) {
                var pos = this._components.indexOf(component);
                if (pos >= 0)
                    this._components.splice(pos, 1);
            }
            try {
                this.dom.removeChild(component.domWrapper);
            }
            catch (ex) {
            }
        }
        removeAll(destroy = undefined) {
            while (this._components.length > 0) {
                this.remove(this._components[0], destroy);
            }
        }
        destroy() {
            if (this._components !== undefined) {
                var tmp = [].concat(this._components);
                for (var k = 0; k < tmp.length; k++) {
                    tmp[k].destroy();
                }
                this._components = [];
            }
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Repeater.prototype, "onchange", null);
    Repeater = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.Repeater")
        //@$Property({ name: "new", type: "json", componentType: "jassijs.ui.SelectProperties" })
        ,
        __metadata("design:paramtypes", [Object])
    ], Repeater);
    exports.Repeater = Repeater;
    class TestComp extends Component_1.Component {
        render() {
            return (0, Component_1.jc)(Repeater, {
                items: data,
                bind: this.state.customer.bind,
                children: [
                    (0, Component_1.jc)(Panel_1.Panel, {
                        children: [
                            (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.customer.bind.id }),
                            (0, Component_1.jc)(Textbox_1.Textbox, {
                                bind: this.state.customer.bind.name
                            }),
                            (0, Component_1.jc)(Button_1.Button, {
                                text: "go",
                                onclick: () => {
                                    alert(this.state.customer.current.name);
                                }
                            }),
                            (0, Component_1.jc)(Table_1.Table, {
                                height: 100,
                                width: 100,
                                bind: this.state.activeChild.bind,
                                bindItems: this.state.customer.bind.childs
                            }),
                            (0, Component_1.jc)(Textbox_1.Textbox, {
                                bind: this.state.activeChild.bind.name
                            }),
                        ]
                    })
                ]
            });
        }
    }
    var data = [
        { id: 1, name: "Max", childs: [{ name: "Anna" }, { name: "Aria" }] },
        { id: 2, name: "Moritz", childs: [{ name: "Clara" }, { name: "Heidi" }] },
        { id: 3, name: "Heinz", childs: [{ name: "Rosa" }, { name: "Luise" }] },
    ];
    function DetailComponent(props, states = {}) {
        var ret = (0, Component_1.jc)("div", {
            children: [
                (0, Component_1.jc)(Textbox_1.Textbox, {
                    bind: states.value.bind.id
                }),
                (0, Component_1.jc)(Textbox_1.Textbox, {
                    bind: states.value.bind.name
                }),
                (0, Component_1.jc)(Table_1.Table, {
                    height: 100,
                    width: 100,
                    bind: states.activeChild.bind,
                    bindItems: states.value.bind.childs
                }),
                (0, Component_1.jc)(Textbox_1.Textbox, {
                    bind: states.activeChild.bind.name
                }),
                (0, Component_1.jc)(Button_1.Button, { text: "erter" }),
                (0, Component_1.jc)("br")
            ]
        });
        return ret;
    }
    function MainComponent(props, states) {
        var ch = props.items.map(item => (0, Component_1.jc)(DetailComponent, { value: item }));
        var ret = (0, Component_1.jc)("span", {
            children: ch
        });
        return ret;
    }
    async function test() {
        var j = (0, Component_1.jc)(MainComponent, { items: data });
        var pan = (0, Component_1.createComponent)(j);
        return pan;
    }
    exports.test = test;
});
//# sourceMappingURL=Repeater.js.map