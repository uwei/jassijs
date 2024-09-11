import { TextComponent } from "jassijs/ui/Component";
import "jassijs/ext/jquerylib";
import "jquery.choosen";
import { $Class } from "jassijs/remote/Registry";
import { Component, $UIComponent, ComponentProperties, jc, createComponent, HTMLComponent, Ref } from "jassijs/ui/Component";
import { DataComponent, DataComponentProperties } from "jassijs/ui/DataComponent";
import { $Property } from "jassijs/ui/Property";
import { classes } from "jassijs/remote/Classes";
import { Container, ContainerProperties } from "jassijs/ui/Container";
import { Textbox } from "jassijs/ui/Textbox";
import { BoundProperty, State, States, createState } from "jassijs/ui/State";
import { Button } from "jassijs/ui/Button";
import { Panel } from "jassijs/ui/Panel";
import { ObjectChooser } from "jassijs/ui/ObjectChooser";
import { Select } from "jassijs/ui/Select";
import { Table } from "jassijs/ui/Table";

export interface RepeaterProperties extends DataComponentProperties {
    items?: any[];
    value?;
    children?;
}
///@$UIComponent({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" })
@$Class("jassijs.ui.Repeater")
//@$Property({ name: "new", type: "json", componentType: "jassijs.ui.SelectProperties" })
export class Repeater<T extends RepeaterProperties = RepeaterProperties> extends DataComponent<T> {
    _components=[];
    _items;
    _bindItems?: BoundProperty;

    constructor(properties: RepeaterProperties = undefined) {
        super(properties);
        // super.init('<select class="Select"><option value=""></option></select>');
    }
    render() {
        //  super.init('<select class="Select"><option value=""></option></select>');
        return React.createElement("span", {});
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onchange(handler) {
    }
    set value(value) {
        this.states.value.current = value;
    }
    get value() {
        return this.states.value.current;
    }
    set items(value) {
        this.states.items.current = value;
    }
    get items() {
        return this.states.items.current;
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
    private duplicateChildren(children: any[], state: State) {
        var ret = [];
        for (var x = 0; x < children.length; x++) {
            var n = Object.assign({}, children[x]);
            if (n.props) {
                n.props = {};
                Object.assign(n.props, children[x].props);
            }
            if (n.props?.children) {
                n.props.children = this.duplicateChildren(n.props.children, state);
            }
            if (n.props?.bind?._databinder === this.bind?._databinder && this.bind?._databinder !== undefined) {
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
    private createRepeatingItem(ob, children) {
        //this._boundProperty._databinder.value=ob;
        var jchilds = [];
        var stat = createState();
        stat.current = ob;
        var dup = this.duplicateChildren(children, stat);
        jchilds.push(...dup);
        var comp = <any>createComponent(jc(HTMLComponent, {
            tag: "span",
            children: jchilds,
            onMouseEnter: () => {
                console.log(JSON.stringify(ob));
                if (this.bind._databinder.connectedState?.current !== ob)
                    this.bind._databinder.connectedState.current = ob;
            }
        }));
        comp.repeatingObject = stat;
        this.add(comp);
    }
    config(config: T, forceRender = false): Repeater {
        Object.assign(this.props,config);
        if (this.props?.children && this.props?.items) {
            if (this.props?.children.length > 0 && (this.props?.bind)) {
                this.bind = this.props.bind; //setup databinder
                delete config.bind;
                if (this._components === undefined)
                    this._components = [];
                this.removeAll(false);
                
                if (this.props?.items) {
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
    addBefore(component: Component, before: Component) {
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
}

interface TestCompProperties extends ComponentProperties {
    customer?: Customer;
    activeChild?: Customer;
}
class TestComp extends Component<TestCompProperties> {
    render() {
        return jc(Repeater, {
            items: data,
            bind: this.states.customer.bind,
            children: [
                jc(Panel, {
                    children: [
                        jc(Textbox, { bind: this.states.customer.bind.id }),
                        jc(Textbox, {
                            bind: this.states.customer.bind.name
                        }),
                        jc(Button, {
                            text: "go",
                            onclick: () => {
                                alert(this.states.customer.current.name);
                            }
                        }),
                        jc(Table, {
                            height: 100,
                            width: 100,
                            bind: this.states.activeChild.bind,
                            bindItems: this.states.customer.bind.childs
                        }),
                        jc(Textbox, {
                            bind: this.states.activeChild.bind.name
                        }),
                    ]
                })
            ]
        });
    }
}
interface Customer {
    name?: string;
    id?: number;
    childs?: Customer[];
}
var data: Customer[] = [
    { id: 1, name: "Max", childs: [{ name: "Anna" }, { name: "Aria" }] },
    { id: 2, name: "Moritz", childs: [{ name: "Clara" }, { name: "Heidi" }] },
    { id: 3, name: "Heinz", childs: [{ name: "Rosa" }, { name: "Luise" }] },
];
interface DetailComponentProperties {
    value?: Customer;
    activeChild?: Customer;
}
function DetailComponent(props: DetailComponentProperties, states: States<DetailComponentProperties> = {}) {
    var ret = jc("div", {
        children: [
            jc(Textbox, {
                bind: states.value.bind.id
            }),
            jc(Textbox, {
                bind: states.value.bind.name
            }),
            jc(Table, {
                height: 100,
                width: 100,
                bind: states.activeChild.bind,
                bindItems: states.value.bind.childs
            }),
            jc(Textbox, {
                bind: states.activeChild.bind.name
            }),
            jc(Button, { text: "erter" }),
            jc("br")
        ]
    });
    return ret;
}
interface MainComponentProperties {
    items?: Customer[];
}
function MainComponent(props: MainComponentProperties, states: States<MainComponentProperties>) {
    var ch = props.items.map(item => jc(DetailComponent, { value: item }));
    var ret = jc("span", {
        children: ch
    });
    return ret;
}
export async function test() {
    var j = jc(MainComponent, { items: data });
    var pan = createComponent(j);
    return pan;
}
